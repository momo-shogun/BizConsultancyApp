import { StyleSheet } from 'react-native';

export const PIP_WIDTH = 112;
export const PIP_HEIGHT = 158;
export const PIP_MARGIN = 14;

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  remoteVideo: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 2,
    borderColor: '#22D3EE',
  },
  remoteCameraOffOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  remoteCameraOffCard: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 18,
    backgroundColor: 'rgba(10, 15, 20, 0.42)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.32)',
  },
  remoteFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
    backgroundColor: '#0A0F14',
  },
  remoteName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  waitingText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
  },
  localPip: {
    position: 'absolute',
    width: PIP_WIDTH,
    height: PIP_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1E293B',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  pipDragArea: {
    flex: 1,
    width: '100%',
  },
  localVideo: {
    width: '100%',
    height: '100%',
  },
  localFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#1E293B',
  },
  cameraOffText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
  },
  flipBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  flipBtnPressed: {
    opacity: 0.85,
  },
});
