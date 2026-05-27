import {
  AudioProfileType,
  AudioScenarioType,
  ChannelProfileType,
  ClientRoleType,
  createAgoraRtcEngine,
  RemoteAudioState,
  RemoteVideoState,
  VideoCodecType,
  type ChannelMediaOptions,
  type IRtcEngine,
  type IRtcEngineEventHandler,
  type RtcConnection,
  type RtcStats,
} from 'react-native-agora';

import type { CallType } from '../types/callApi.types';
import { ensureCallPermissions } from '../utils/callPermissions';

export type AgoraConnectionState = 'disconnected' | 'connecting' | 'connected' | 'failed';

type AgoraListeners = {
  onConnectionState?: (state: AgoraConnectionState) => void;
  onRemoteUserJoined?: (uid: number) => void;
  onRemoteUserLeft?: (uid: number) => void;
  onRemoteVideoMuted?: (uid: number, muted: boolean) => void;
  onRemoteVideoState?: (uid: number, active: boolean) => void;
  onError?: (message: string) => void;
};

let engine: IRtcEngine | null = null;
let listeners: AgoraListeners = {};
let eventHandler: IRtcEngineEventHandler | null = null;
let joinResolve: (() => void) | null = null;
let joinReject: ((error: Error) => void) | null = null;
let joinTimeout: ReturnType<typeof setTimeout> | null = null;
let localMuted = false;
let localVideoEnabled = true;
let speakerOn = true;
let inChannel = false;
let previewActive = false;
let activeCallType: CallType = 'voice';
let joinedLocalUid = 0;
let joinedChannelName = '';

function buildChannelMediaOptions(callType: CallType): ChannelMediaOptions {
  const isVideo = callType === 'video';
  return {
    channelProfile: ChannelProfileType.ChannelProfileCommunication,
    clientRoleType: ClientRoleType.ClientRoleBroadcaster,
    publishMicrophoneTrack: true,
    autoSubscribeAudio: true,
    enableAudioRecordingOrPlayout: true,
    publishCameraTrack: isVideo && localVideoEnabled,
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
  previewActive = false;
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

function applyVideoSettings(rtc: IRtcEngine): void {
  rtc.enableVideo();
  rtc.setVideoEncoderConfiguration({
    codecType: VideoCodecType.VideoCodecVp8,
    dimensions: { width: 640, height: 480 },
    frameRate: 15,
    bitrate: 0,
  });
  rtc.muteLocalVideoStream(!localVideoEnabled);
  rtc.muteAllRemoteVideoStreams(false);
  rtc.updateChannelMediaOptions(buildChannelMediaOptions(activeCallType));
}

function startVideoCapture(rtc: IRtcEngine): void {
  applyVideoSettings(rtc);
  if (!inChannel) {
    rtc.startPreview();
    previewActive = true;
    return;
  }
  rtc.muteLocalVideoStream(!localVideoEnabled);
}

function applyMediaSettings(rtc: IRtcEngine): void {
  applyVoiceAudioSettings(rtc);
  if (activeCallType === 'video') {
    applyVideoSettings(rtc);
  }
}

function notifyRemoteVideoState(uid: number, state: RemoteVideoState): void {
  const active =
    state === RemoteVideoState.RemoteVideoStateStarting ||
    state === RemoteVideoState.RemoteVideoStateDecoding;
  const inactive =
    state === RemoteVideoState.RemoteVideoStateStopped ||
    state === RemoteVideoState.RemoteVideoStateFailed;

  if (active) {
    listeners.onRemoteUserJoined?.(uid);
    listeners.onRemoteVideoState?.(uid, true);
    return;
  }
  if (inactive) {
    listeners.onRemoteVideoMuted?.(uid, true);
    listeners.onRemoteVideoState?.(uid, false);
  }
}

function subscribeRemoteAudio(rtc: IRtcEngine, uid: number): void {
  rtc.muteRemoteAudioStream(uid, false);
  rtc.adjustUserPlaybackSignalVolume(uid, 100);
}

function subscribeRemoteVideo(rtc: IRtcEngine, uid: number): void {
  if (activeCallType !== 'video') {
    return;
  }
  rtc.muteRemoteVideoStream(uid, false);
}

function getOrCreateEngine(): IRtcEngine {
  if (engine == null) {
    engine = createAgoraRtcEngine();
    engine.initialize({ appId: '' });
    eventHandler = {
      onJoinChannelSuccess: (_connection) => {
        if (engine != null) {
          applyMediaSettings(engine);
          if (activeCallType === 'video') {
            engine.muteLocalVideoStream(!localVideoEnabled);
            engine.muteAllRemoteVideoStreams(false);
          }
        }
        settleJoinSuccess();
      },
      onLeaveChannel: (_connection, _stats) => {
        inChannel = false;
        previewActive = false;
        listeners.onConnectionState?.('disconnected');
      },
      onUserJoined: (_connection, uid) => {
        if (engine != null) {
          subscribeRemoteAudio(engine, uid);
          subscribeRemoteVideo(engine, uid);
        }
        if (uid !== joinedLocalUid) {
          listeners.onRemoteUserJoined?.(uid);
        }
      },
      onRemoteVideoStateChanged: (_connection, uid, state) => {
        if (engine != null && uid !== joinedLocalUid) {
          subscribeRemoteVideo(engine, uid);
          notifyRemoteVideoState(uid, state);
        }
      },
      onUserOffline: (_connection, uid) => {
        listeners.onRemoteUserLeft?.(uid);
      },
      onRemoteAudioStateChanged: (_connection, remoteUid, state) => {
        if (engine != null && state === RemoteAudioState.RemoteAudioStateDecoding) {
          subscribeRemoteAudio(engine, remoteUid);
        }
      },
      onUserMuteVideo: (_connection, uid, muted) => {
        listeners.onRemoteVideoMuted?.(uid, muted);
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
      settleJoinFailure('Timed out joining call channel');
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

  async startLocalPreview(appId: string): Promise<void> {
    const permissions = await ensureCallPermissions('video');
    if (!permissions.camera) {
      throw new Error('Camera permission denied');
    }

    activeCallType = 'video';
    localVideoEnabled = true;
    const rtc = getOrCreateEngine();
    rtc.initialize({ appId });
    rtc.enableVideo();
    rtc.startPreview();
    previewActive = true;
  },

  stopLocalPreview(): void {
    if (engine == null || !previewActive) {
      return;
    }
    engine.stopPreview();
    previewActive = false;
  },

  async join(params: {
    appId: string;
    channelName: string;
    token: string;
    uid: number;
    callType: CallType;
  }): Promise<void> {
    const permissions = await ensureCallPermissions(params.callType);
    if (!permissions.microphone) {
      throw new Error('Microphone permission denied');
    }
    if (params.callType === 'video' && !permissions.camera) {
      throw new Error('Camera permission denied');
    }

    activeCallType = params.callType;
    localVideoEnabled = params.callType === 'video';
    joinedLocalUid = params.uid;
    joinedChannelName = params.channelName;
    const rtc = getOrCreateEngine();
    rtc.initialize({ appId: params.appId });
    rtc.setChannelProfile(ChannelProfileType.ChannelProfileCommunication);
    rtc.setClientRole(ClientRoleType.ClientRoleBroadcaster);

    applyVoiceAudioSettings(rtc);
    if (params.callType === 'video') {
      startVideoCapture(rtc);
    } else {
      if (previewActive) {
        rtc.stopPreview();
        previewActive = false;
      }
      rtc.disableVideo();
    }

    await leaveChannelIfNeeded(rtc);

    if (params.callType === 'video' && previewActive) {
      rtc.stopPreview();
      previewActive = false;
    }

    listeners.onConnectionState?.('connecting');
    const joinPromise = waitForJoinChannel();
    const mediaOptions = buildChannelMediaOptions(params.callType);

    const code = rtc.joinChannel(params.token, params.channelName, params.uid, mediaOptions);
    if (code !== 0) {
      settleJoinFailure(`joinChannel failed (${code})`);
      throw new Error(`joinChannel failed (${code})`);
    }

    await joinPromise;

    if (params.callType === 'video') {
      rtc.muteLocalVideoStream(!localVideoEnabled);
      rtc.muteAllRemoteVideoStreams(false);
      rtc.updateChannelMediaOptions(buildChannelMediaOptions('video'));
    }
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
    if (previewActive) {
      engine.stopPreview();
      previewActive = false;
    }
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

  setLocalVideoEnabled(enabled: boolean): void {
    localVideoEnabled = enabled;
    if (engine == null || activeCallType !== 'video') {
      return;
    }
    engine.muteLocalVideoStream(!enabled);
    engine.updateChannelMediaOptions(buildChannelMediaOptions(activeCallType));
  },

  switchCamera(): void {
    if (engine == null || activeCallType !== 'video') {
      return;
    }
    engine.switchCamera();
  },

  isVideoCall(): boolean {
    return activeCallType === 'video';
  },

  getJoinedLocalUid(): number {
    return joinedLocalUid;
  },

  getJoinedChannelName(): string {
    return joinedChannelName;
  },

  release(): void {
    if (engine != null) {
      if (previewActive) {
        engine.stopPreview();
        previewActive = false;
      }
      if (eventHandler != null) {
        engine.unregisterEventHandler(eventHandler);
      }
      engine.release();
    }
    engine = null;
    eventHandler = null;
    listeners = {};
    clearJoinWaiters();
    localMuted = false;
    localVideoEnabled = true;
    speakerOn = true;
    inChannel = false;
    activeCallType = 'voice';
    joinedLocalUid = 0;
    joinedChannelName = '';
  },
};
