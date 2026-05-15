import { StyleSheet } from 'react-native';

import { THEME } from '@/constants/theme';

export const styles = StyleSheet.create({
  // ── Screen wrapper ────────────────────────────────────────
  screen: {
    gap: THEME.spacing[16],
  },

  // ── Subscription card ─────────────────────────────────────
  subscriptionCard: {
    borderRadius: THEME.radius[12],
    overflow: 'hidden',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    shadowColor: THEME.colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
   // shadowRadius: 16,
  //  elevation: 8,
    marginHorizontal:10,
    marginVertical : 10
  },
  paddingTop : {
      paddingTop : 50,
  },
  subscriptionShimmer: {
    height: 1,
    backgroundColor: THEME.colors.accentAmber,
    opacity: 0.6,
  },
  subscriptionInner: {
    padding: THEME.spacing[16],
    gap: THEME.spacing[12],
  },
  subscriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subscriptionLeft: {
    gap: THEME.spacing[4],
  },
  subscriptionPlanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[8],
  },
  subscriptionPlanText: {
    color: THEME.colors.accentAmber,
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold,
  },
  subscriptionChevron: {
    color: THEME.colors.accentAmber,
    fontSize: THEME.typography.size[14],
  },
  subscriptionPhone: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.regular,
  },
  upgradeBtnWrapper: {
    alignItems: 'flex-end',
    gap: THEME.spacing[4],
  },
upgradeBtn: {
  paddingHorizontal: THEME.spacing[20],
  paddingVertical: THEME.spacing[8],
  borderRadius: 10,
  overflow: 'hidden',
  alignItems: 'center',
},
  upgradeBtnText: {
    color: THEME.colors.black,
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold,
    letterSpacing: 0.3,
  },
  upgradeBtnSubText: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.typography.size[12],
    textAlign: 'right',
  },

  // ── Section header ────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[10],
  },
  sectionAccentBar: {
    width: 4,
    height: 22,
    borderRadius: 2,
    backgroundColor: THEME.colors.accentAmber,
  },
  sectionTitle: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.textPrimary,
    letterSpacing: -0.4,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing[4],
    marginHorizontal : 15,
  },
  editIcon: {
    fontSize: THEME.typography.size[12],
    color: THEME.colors.textSecondary,
  },
  editText: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium,
  },

  // ── Profile avatars ───────────────────────────────────────
  profilesRow: {
    flexDirection: 'row',
    gap: THEME.spacing[20],
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginHorizontal : 15
  },
  profileItem: {
    alignItems: 'center',
    gap: THEME.spacing[8],
  },
  profileAvatarRing: {
    width: 55,
    height: 55,
    borderRadius: 34,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.colors.accentBlue,
  },
  profileAvatarInner: {
    flex: 1,
    backgroundColor: '#1A3A5C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationCard: {
  borderRadius: THEME.radius[16],
  overflow: 'hidden',
  borderWidth: 1,
  borderColor: 'rgba(168,85,247,0.14)',
  marginHorizontal : 10,
  shadowColor: '#B48CFF',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.12,
  shadowRadius: 12,
  elevation: 5,
},

notificationGlow: {
  height: 2,
  backgroundColor: '#C084FC',
  opacity: 0.4,
},

notificationInner: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: THEME.spacing[14],
},

videoThumbnail: {
  width: 88,
  height: 60,
  borderRadius: 12,
  backgroundColor: '#EEE',
},

notificationContent: {
  flex: 1,
  marginLeft: THEME.spacing[12],
  justifyContent: 'center',
},

videoTitle: {
  color: '#1F2937',
  fontSize: THEME.typography.size[14],
  fontWeight: THEME.typography.weight.bold,
},

videoDescription: {
  marginTop: THEME.spacing[4],
  color: '#6B7280',
  fontSize: THEME.typography.size[12],
  lineHeight: 18,
},

arrowBox: {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: 'rgba(168,85,247,0.10)',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: THEME.spacing[10],
},
  profileEmoji: {
    fontSize: 35,
  },
  profileKidsBadge: {
    width: 55,
    height: 55,
    borderRadius: 34,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: THEME.colors.accentPurple,
  },
  profileKidsText: {
    color: THEME.colors.white,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold,
    letterSpacing: 0.5,
  },
  addProfileCircle: {
    width: 55,
    height: 55,
    borderRadius: 34,
    borderWidth: 1,
    borderColor: THEME.colors.black,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  addProfilePlus: {
    fontSize: THEME.typography.size[28],
    color: THEME.colors.textSecondary,
    lineHeight: 32,
  },
  profileName: {
    color: THEME.colors.textSecondary,
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.medium,
    textAlign: 'center',
  },

  // ── Jeeto banner ─────────────────────────────────────────
jeetoBanner: {
  borderRadius: THEME.radius[16],
  borderWidth: 1,
  borderColor: 'rgba(168,85,247,0.18)',
  overflow: 'hidden',

  shadowColor: '#B48CFF',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.12,
  shadowRadius: 12,
  elevation: 5,
  marginHorizontal:15
},

jeetoShimmer: {
  height: 2,
 // backgroundColor: '#C084FC',
  opacity: 0.45,
},

jeetoInner: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: THEME.spacing[16],
},

jeetoLeft: {
  flex: 1,
  gap: THEME.spacing[4],
},

jeetoTitle: {
  color: '#1F2937',
  fontSize: THEME.typography.size[14],
  fontWeight: THEME.typography.weight.bold,
},

jeetoLink: {
  color: '#A855F7',
  fontSize: THEME.typography.size[16],
  fontWeight: THEME.typography.weight.semibold,
},

jeetoLogoBox: {
  width: 78,
  height: 48,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: 'rgba(168,85,247,0.15)',
},

jeetoLogoText: {
  color: '#7C3AED',
  fontSize: 8,
  fontWeight: THEME.typography.weight.bold,
  textAlign: 'center',
  letterSpacing: 0.6,
  padding :5
},

  // ── Continue watching ─────────────────────────────────────
watchRow: {
  flexDirection: 'row',
},

watchCard: {
  flex: 1,
  borderRadius: 12,
  overflow: 'hidden',
  backgroundColor: '#111827',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 10,
  elevation: 6,
  marginHorizontal : 1
},

watchThumbnail: {
  width: '100%',
  aspectRatio: 20 / 9,
  justifyContent: 'space-between',
},
headerRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},

helpText: {
  color: '#A855F7',
  fontSize: THEME.typography.size[14],
  marginHorizontal:10,
  fontWeight: THEME.typography.weight.semibold,
},
helpBtn: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 2,
},

watchThumbnailImage: {
  borderTopLeftRadius: 18,
  borderTopRightRadius: 18,
},

watchThumbnailOverlay: {
  ...StyleSheet.absoluteFill,
},

watchPlayOverlay: {
  position: 'absolute',
  bottom: THEME.spacing[10],
  left: THEME.spacing[10],

  width: 32,
  height: 32,
  borderRadius: 16,

  backgroundColor: 'rgba(255,255,255,0.18)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.4)',

  alignItems: 'center',
  justifyContent: 'center',
},

watchProgressTrack: {
  height: 3,
  backgroundColor: 'rgba(255,255,255,0.08)',
},

watchProgressFill: {
  height: 3,
  backgroundColor: '#3B82F6',
  borderRadius: 10,
},

watchCardMeta: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: THEME.spacing[10],
  paddingVertical: THEME.spacing[10],
},

watchCardTitle: {
  color: '#fff',
  fontSize: THEME.typography.size[14],
  fontWeight: THEME.typography.weight.semibold,
},

watchCardSubLabel: {
  color: '#A1A1AA',
  fontSize: THEME.typography.size[12],
  marginTop: 4,
},

watchMoreBtn: {
  width: 28,
  height: 28,
  borderRadius: 14,
  alignItems: 'center',
  justifyContent: 'center',
},
watchPlayIcon: {
  color: '#FFFFFF',
  fontSize: 12,
},

watchCardSpacer: {
  flex: 1,
},
});