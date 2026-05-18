import {
  ChannelProfileType,
  ClientRoleType,
  createAgoraRtcEngine,
  type IRtcEngine,
  type IRtcEngineEventHandler,
} from 'react-native-agora';

import type { CallType } from '../types/callApi.types';

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

function getOrCreateEngine(): IRtcEngine {
  if (engine == null) {
    engine = createAgoraRtcEngine();
    engine.initialize({ appId: '' });
    eventHandler = {
      onJoinChannelSuccess: () => {
        listeners.onConnectionState?.('connected');
      },
      onLeaveChannel: () => {
        listeners.onConnectionState?.('disconnected');
      },
      onUserJoined: (_connection, uid) => {
        listeners.onRemoteUserJoined?.(uid);
      },
      onUserOffline: (_connection, uid) => {
        listeners.onRemoteUserLeft?.(uid);
      },
      onConnectionLost: () => {
        listeners.onConnectionState?.('failed');
      },
      onError: (err) => {
        listeners.onError?.(`Agora error ${err}`);
      },
    };
    engine.registerEventHandler(eventHandler);
  }
  return engine;
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
    const rtc = getOrCreateEngine();
    rtc.initialize({ appId: params.appId });
    rtc.setChannelProfile(ChannelProfileType.ChannelProfileCommunication);
    rtc.setClientRole(ClientRoleType.ClientRoleBroadcaster);
    rtc.enableAudio();
    if (params.callType === 'video') {
      rtc.enableVideo();
    } else {
      rtc.disableVideo();
    }
    listeners.onConnectionState?.('connecting');
    rtc.joinChannel(params.token, params.channelName, params.uid, {
      clientRoleType: ClientRoleType.ClientRoleBroadcaster,
    });
  },

  async leave(): Promise<void> {
    if (engine == null) {
      return;
    }
    engine.leaveChannel();
    listeners.onConnectionState?.('disconnected');
  },

  setMuted(muted: boolean): void {
    engine?.muteLocalAudioStream(muted);
  },

  setSpeakerphone(enabled: boolean): void {
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
  },
};
