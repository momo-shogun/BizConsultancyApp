import React, { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { View } from 'react-native';

import { ZeptoHeaderV1 } from '../../navigation/Header/ZeptoHeaderV1';
import { ZeptoTabs } from '../../Tabs/ZeptoTabs';
import { darkenHex, ZEPTO_TABS_TRACK_DARKEN } from '@/utils/darkenHex';

import { ZeptoHSCategorySpotlight } from './ZeptoHSCategorySpotlight';
import type { HomeCategoryId, ZeptoHSProps, ZeptoHSShellColors } from './ZeptoHS.types';

// ─── Shell colors per category ────────────────────────────────────────────────

function uniformShell(fallbackBackground: string): ZeptoHSShellColors {
  return {
    headerBackground: fallbackBackground,
    topTabsBackground: fallbackBackground,
    categoryStripBackground: fallbackBackground,
    tabLabelColor: '#0A0A0A',
  };
}

function shell(topTabsBackground: string, tabLabelColor: string): ZeptoHSShellColors {
  return {
    headerBackground: topTabsBackground,
    topTabsBackground,
    categoryStripBackground: topTabsBackground,
    tabLabelColor,
  };
}

const ZEPTO_HS_INACTIVE_TAB_TILE_BG = '#FFFFFF';

export const ZEPTO_HS_SHELL_BY_CATEGORY_ID: Record<string, ZeptoHSShellColors> = {
  diagnosis: shell('#E0F2FE', '#2563EB'),
  services: shell('#ECFDF5', '#16A34A'),
  consultation: shell('#FFF3E6', '#F97316'),
  mentorship: shell('#F7F5FF', '#6D28D9'),
};

export const ZEPTO_HS_TOP_CATEGORY_TABS = [
  { id: 'diagnosis', label: 'Business Diagnosis' },
  { id: 'services', label: 'Business Services' },
  { id: 'consultation', label: 'Expert Consultation' },
  { id: 'mentorship', label: 'Mentorship Program' },
] as const;

export function resolveZeptoHSShellColors(
  categoryId: string | undefined,
  fallbackBackground: string,
): ZeptoHSShellColors {
  if (!categoryId) return uniformShell(fallbackBackground);
  return ZEPTO_HS_SHELL_BY_CATEGORY_ID[categoryId] ?? uniformShell(fallbackBackground);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ZeptoHS(props: ZeptoHSProps): React.ReactElement {
  const { header, children, testID, style } = props;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopCategoryIndex, setActiveTopCategoryIndex] = useState(0);

  const activeTopCategoryId: HomeCategoryId =
    (ZEPTO_HS_TOP_CATEGORY_TABS[activeTopCategoryIndex]?.id as HomeCategoryId) ?? 'diagnosis';

  const topTabsTabBackgroundColors = useMemo(() => {
    const byId: Record<string, string> = {};
    for (const tab of ZEPTO_HS_TOP_CATEGORY_TABS) {
      const row = resolveZeptoHSShellColors(tab.id, header.backgroundColor);
      byId[tab.id] = row.topTabsBackground;
    }
    return byId;
  }, [header.backgroundColor]);

  const topTabsTabLabelColors = useMemo(() => {
    const byId: Record<string, string> = {};
    for (const tab of ZEPTO_HS_TOP_CATEGORY_TABS) {
      const row = resolveZeptoHSShellColors(tab.id, header.backgroundColor);
      byId[tab.id] = row.tabLabelColor;
    }
    return byId;
  }, [header.backgroundColor]);

  const activeShell = resolveZeptoHSShellColors(activeTopCategoryId, header.backgroundColor);

  const headerBackgroundColor = useMemo(
    () => darkenHex(activeShell.topTabsBackground, ZEPTO_TABS_TRACK_DARKEN),
    [activeShell.topTabsBackground],
  );

  return (
    <View style={[{ flex: 1 }, style]} testID={testID}>
      <ZeptoHeaderV1 {...header} backgroundColor={headerBackgroundColor} />

      <ZeptoTabs
        tabs={[...ZEPTO_HS_TOP_CATEGORY_TABS]}
        tabBackgroundColors={topTabsTabBackgroundColors}
        tabLabelColors={topTabsTabLabelColors}
        inactiveTabTileBackgroundColor={ZEPTO_HS_INACTIVE_TAB_TILE_BG}
        activeIndex={activeTopCategoryIndex}
        defaultActiveIndex={0}
        onChange={setActiveTopCategoryIndex}
        showSearch
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search for services, experts..."
        style={{ borderRadius: 0 }}
      />

      <ZeptoHSCategorySpotlight
        key={activeTopCategoryId}
        categoryId={activeTopCategoryId}
        backgroundColor={activeShell.categoryStripBackground}
        accentColor={activeShell.tabLabelColor}
      />

      {children != null ? (
        <View style={{ flex: 1 }}>
          {typeof children === 'function'
            ? (children as (id: HomeCategoryId) => ReactNode)(activeTopCategoryId)
            : children}
        </View>
      ) : null}
    </View>
  );
}

ZeptoHS.displayName = 'ZeptoHS';
