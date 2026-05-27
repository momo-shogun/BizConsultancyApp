import { StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  playerArea: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerClip: {
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  webView: {
    backgroundColor: '#000000',
  },
  iframeWrap: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loaderWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[12],
    zIndex: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.semibold as '600',
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing[16],
    paddingHorizontal: THEME.spacing[24],
  },
  fallbackText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: THEME.typography.size[14],
    textAlign: 'center',
  },
  openBrowserButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
    paddingHorizontal: THEME.spacing[16],
    paddingVertical: THEME.spacing[12],
    borderRadius: THEME.radius[12],
    backgroundColor: THEME.colors.primary,
  },
  openBrowserLabel: {
    color: '#FFFFFF',
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
  },
});
