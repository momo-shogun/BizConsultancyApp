import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { THEME } from '@/constants/theme';

import { accentAlpha, edpCardBase } from '../edp/edpCardShared';

export interface EdpProgressMetaItem {
  label: string;
  value: string;
}

export interface EdpProgressCardProps {
  title: string;
  subtitle: string;
  badgeLabel: string;
  badgeAccent: string;
  progressPercent: number;
  progressAccent: string;
  meta: EdpProgressMetaItem[];
}

export function EdpProgressCard(props: EdpProgressCardProps): React.ReactElement {
  const accent = props.progressAccent;

  return (
    <View style={[edpCardBase.cardBordered, styles.card]}>
      <View style={styles.top}>
        <Text style={styles.title}>{props.title}</Text>
        <View
          style={[
            styles.badge,
            {
              borderColor: accentAlpha(props.badgeAccent, 0.33),
              backgroundColor: accentAlpha(props.badgeAccent, 0.1),
            },
          ]}
        >
          <Text style={[styles.badgeText, { color: props.badgeAccent }]}>{props.badgeLabel}</Text>
        </View>
      </View>
      <View style={styles.barBg}>
        <View
          style={[
            styles.barFill,
            { width: `${props.progressPercent}%`, backgroundColor: accent },
          ]}
        />
      </View>
      <Text style={styles.subtitle}>{props.subtitle}</Text>
      <View style={styles.meta}>
        {props.meta.map((item, index) => (
          <View
            key={item.label}
            style={[styles.metaItem, index < props.meta.length - 1 ? styles.metaItemBorder : null]}
          >
            <Text style={styles.metaVal}>{item.value}</Text>
            <Text style={styles.metaLbl}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: THEME.spacing[16],
    marginTop: THEME.spacing[14],
    padding: THEME.spacing[16],
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.spacing[12],
    gap: THEME.spacing[10],
  },
  title: {
    flex: 1,
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
    lineHeight: 18,
  },
  badge: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: THEME.spacing[10],
    paddingVertical: THEME.spacing[4],
  },
  badgeText: {
    fontSize: THEME.typography.size[12],
    fontWeight: THEME.typography.weight.bold as '700',
  },
  barBg: {
    height: 5,
    backgroundColor: 'rgba(15,23,42,0.08)',
    borderRadius: 100,
    marginBottom: THEME.spacing[14],
  },
  barFill: {
    height: 5,
    borderRadius: 100,
  },
  subtitle: {
    fontSize: THEME.typography.size[12],
    lineHeight: 16,
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing[12],
  },
  meta: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(15,23,42,0.12)',
    paddingTop: THEME.spacing[12],
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  metaItemBorder: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: 'rgba(15,23,42,0.12)',
  },
  metaVal: {
    fontSize: THEME.typography.size[14],
    fontWeight: THEME.typography.weight.bold as '700',
    color: THEME.colors.textPrimary,
  },
  metaLbl: {
    fontSize: THEME.typography.size[12],
    lineHeight: 16,
    color: THEME.colors.textSecondary,
    marginTop: 2,
  },
});
