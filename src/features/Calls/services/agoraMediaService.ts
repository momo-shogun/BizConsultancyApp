import {
  AudioProfileType,
  AudioScenarioType,
  ChannelProfileType,
  ClientRoleType,
  createAgoraRtcEngine,
  RemoteAudioState,
  type ChannelMediaOptions,
  type IRtcEngine,
  type IRtcEngineEventHandler,
  type RtcConnection,
  type RtcStats,
} from 'react-native-agora';

import type { CallType } from '../types/callApi.types';
import { ensureCallMicrophonePermission } from '../utils/callPermissions';

export type AgoraConnectionState = 'disconnected' | 'connecting' | 'connected' | 'failed';

type AgoraListeners = {
  onConnectionState?: (state: AgoraConnectionState) => void;
  onRemoteUserJoined?: (uid: number) => void;
  onRemoteUserLeft?: (uid: number) => void;
  onError?: (message: string) => void;
};

let engine: IRtcEngine | null = null;
let listeners: AgoraListeners = {};
let eventHandler: IRtcEngineEventHandler | null = null;
let joinResolve: (() => void) | null = null;
let joinReject: ((error: Error) => void) | null = null;
let joinTimeout: ReturnType<typeof setTimeout> | null = null;
let localMuted = false;
let speakerOn = true;
let inChannel = false;
let activeCallType: CallType = 'voice';

function buildChannelMediaOptions(callType: CallType): ChannelMediaOptions {
  const isVideo = callType === 'video';
  return {
    channelProfile: ChannelProfileType.ChannelProfileCommunication,
    clientRoleType: ClientRoleType.ClientRoleBroadcaster,
    publishMicrophoneTrack: true,
    autoSubscribeAudio: true,
    enableAudioRecordingOrPlayout: true,
    publishCameraTrack: isVideo,
    autoSubscribeVideo: isVideo,
  };
}

function clearJoinWaiters(): void {
  if (joinTimeout != null) {
    clearTimeout(joinTimeout);
    joinTimeout = null;
  }
  joinResolve = null;
  joinReject = null;
}

function settleJoinSuccess(): void {
  const resolve = joinResolve;
  clearJoinWaiters();
  inChannel = true;
  listeners.onConnectionState?.('connected');
  resolve?.();
}

function settleJoinFailure(message: string): void {
  const reject = joinReject;
  clearJoinWaiters();
  listeners.onConnectionState?.('failed');
  reject?.(new Error(message));
}

function applyVoiceAudioSettings(rtc: IRtcEngine): void {
  rtc.setAudioScenario(AudioScenarioType.AudioScenarioDefault);
  rtc.setAudioProfile(
    AudioProfileType.AudioProfileSpeechStandard,
    AudioScenarioType.AudioScenarioDefault,
  );
  rtc.enableAudio();
  rtc.enableLocalAudio(true);
  rtc.muteLocalAudioStream(localMuted);
  rtc.muteAllRemoteAudioStreams(false);
  rtc.adjustRecordingSignalVolume(100);
  rtc.adjustPlaybackSignalVolume(100);
  rtc.setEnableSpeakerphone(speakerOn);
  rtc.updateChannelMediaOptions(buildChannelMediaOptions(activeCallType));
}

function subscribeRemoteAudio(rtc: IRtcEngine, uid: number): void {
  rtc.muteRemoteAudioStream(uid, false);
  rtc.adjustUserPlaybackSignalVolume(uid, 100);
}

function getOrCreateEngine(): IRtcEngine {
  if (engine == null) {
    engine = createAgoraRtcEngine();
    engine.initialize({ appId: '' });
    eventHandler = {
      onJoinChannelSuccess: () => {
        if (engine != null) {
          applyVoiceAudioSettings(engine);
        }
        settleJoinSuccess();
      },
      onLeaveChannel: (_connection, _stats) => {
        inChannel = false;
        listeners.onConnectionState?.('disconnected');
      },
      onUserJoined: (_connection, uid) => {
        if (engine != null) {
          subscribeRemoteAudio(engine, uid);
        }
        listeners.onRemoteUserJoined?.(uid);
      },
      onUserOffline: (_connection, uid) => {
        listeners.onRemoteUserLeft?.(uid);
      },
      onRemoteAudioStateChanged: (_connection, remoteUid, state) => {
        if (engine != null && state === RemoteAudioState.RemoteAudioStateDecoding) {
          subscribeRemoteAudio(engine, remoteUid);
        }
      },
      onConnectionLost: () => {
        listeners.onConnectionState?.('failed');
        if (joinReject != null) {
          settleJoinFailure('connection lost');
        }
      },
      onError: (err) => {
        const message = `Agora error ${err}`;
        listeners.onError?.(message);
        if (joinReject != null) {
          settleJoinFailure(message);
        }
      },
    };
    engine.registerEventHandler(eventHandler);
  }
  return engine;
}

function waitForJoinChannel(timeoutMs = 20_000): Promise<void> {
  return new Promise((resolve, reject) => {
    clearJoinWaiters();
    joinResolve = resolve;
    joinReject = reject;
    joinTimeout = setTimeout(() => {
      settleJoinFailure('Timed out joining voice channel');
    }, timeoutMs);
  });
}

async function leaveChannelIfNeeded(rtc: IRtcEngine): Promise<void> {
  if (!inChannel) {
    return;
  }
  clearJoinWaiters();
  await new Promise<void>((resolve) => {
    const timeout = setTimeout(() => {
      inChannel = false;
      resolve();
    }, 800);
    const prevLeave = eventHandler?.onLeaveChannel;
    if (eventHandler != null) {
      eventHandler.onLeaveChannel = (connection: RtcConnection, stats: RtcStats) => {
        clearTimeout(timeout);
        inChannel = false;
        if (eventHandler != null) {
          eventHandler.onLeaveChannel = prevLeave;
        }
        prevLeave?.(connection, stats);
        resolve();
      };
    }
    rtc.leaveChannel();
  });
}

export const agoraMediaService = {
  setListeners(next: AgoraListeners): void {
    listeners = next;
  },

  async warmup(appId: string): Promise<void> {
    const rtc = getOrCreateEngine();
    rtc.initialize({ appId });
  },

  async join(params: {
    appId: string;
    channelName: string;
    token: string;
    uid: number;
    callType: CallType;
  }): Promise<void> {
    const micGranted = await ensureCallMicrophonePermission();
    if (!micGranted) {
      throw new Error('Microphone permission denied');
    }

    activeCallType = params.callType;
    const rtc = getOrCreateEngine();
    rtc.initialize({ appId: params.appId });
    rtc.setChannelProfile(ChannelProfileType.ChannelProfileCommunication);
    rtc.setClientRole(ClientRoleType.ClientRoleBroadcaster);

    applyVoiceAudioSettings(rtc);

    if (params.callType === 'video') {
      rtc.enableVideo();
    } else {
      rtc.disableVideo();
    }

    await leaveChannelIfNeeded(rtc);

    listeners.onConnectionState?.('connecting');
    const joinPromise = waitForJoinChannel();
    const mediaOptions = buildChannelMediaOptions(params.callType);

    const code = rtc.joinChannel(params.token, params.channelName, params.uid, mediaOptions);
    if (code !== 0) {
      settleJoinFailure(`joinChannel failed (${code})`);
      throw new Error(`joinChannel failed (${code})`);
    }

    await joinPromise;
  },

  refreshVoiceAudio(): void {
    if (engine == null || !inChannel) {
      return;
    }
    applyVoiceAudioSettings(engine);
  },

  async leave(): Promise<void> {
    if (engine == null) {
      return;
    }
    clearJoinWaiters();
    await leaveChannelIfNeeded(engine);
    listeners.onConnectionState?.('disconnected');
  },

  setMuted(muted: boolean): void {
    localMuted = muted;
    engine?.muteLocalAudioStream(muted);
  },

  setSpeakerphone(enabled: boolean): void {
    speakerOn = enabled;
    engine?.setEnableSpeakerphone(enabled);
  },

  release(): void {
    if (engine != null && eventHandler != null) {
      engine.unregisterEventHandler(eventHandler);
      engine.release();
    }
    engine = null;
    eventHandler = null;
    listeners = {};
    clearJoinWaiters();
    localMuted = false;
    speakerOn = true;
    inChannel = false;
    activeCallType = 'voice';
  },
};
