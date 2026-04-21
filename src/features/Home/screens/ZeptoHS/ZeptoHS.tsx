import React, { useMemo, useState } from 'react';
import { View } from 'react-native';

import { ZeptoHeaderV1 } from '../../navigation/Header/ZeptoHeaderV1';
import { ZeptoTabC } from '../../Tabs/ZeptoTabC';
import { ZeptoTabs } from '../../Tabs/ZeptoTabs';
import { darkenHex, ZEPTO_TABS_TRACK_DARKEN } from '@/utils/darkenHex';

import type { ZeptoHSProps } from './ZeptoHS.types';

type ZeptoHSShellColors = {
  headerBackground: string;
  topTabsBackground: string;
  categoryStripBackground: string;
  tabLabelColor: string;
};

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

const ZEPTO_HS_SHELL_BY_CATEGORY_ID: Record<string, ZeptoHSShellColors> = {
  diagnosis: shell('#E0F2FE', '#2563EB'), // blue
  services: shell('#ECFDF5', '#16A34A'), // green (clearer)
  consultation: shell('#FFF3E6', '#F97316'), // lighter peach (active pill)
  mentorship: shell('#F7F5FF', '#6D28D9'), // lighter lavender (active pill)
};

const ZEPTO_HS_TOP_CATEGORY_TABS = [
  { id: 'diagnosis', label: 'Business Diagnosis' },
  { id: 'services', label: 'Business Services' },
  { id: 'consultation', label: 'Expert Consultation' },
  { id: 'mentorship', label: 'Mentorship Program' },
] as const;

function resolveZeptoHSShellColors(
  categoryId: string | undefined,
  fallbackBackground: string,
): ZeptoHSShellColors {
  if (!categoryId) return uniformShell(fallbackBackground);
  return ZEPTO_HS_SHELL_BY_CATEGORY_ID[categoryId] ?? uniformShell(fallbackBackground);
}

export function ZeptoHS(props: ZeptoHSProps): React.ReactElement {
  const { header, tabStrip, children, testID, style } = props;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopCategoryIndex, setActiveTopCategoryIndex] = useState(0);

  const activeTopCategoryId = ZEPTO_HS_TOP_CATEGORY_TABS[activeTopCategoryIndex]?.id;

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
        onChange={(index) => setActiveTopCategoryIndex(index)}
        showSearch
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search for “Iphone”"
        style={{ borderRadius: 0 }}
      />
      {/* <ZeptoTabC {...tabStrip} backgroundColor={activeShell.categoryStripBackground} /> */}

      {children != null ? <View style={{ flex: 1 }}>{children}</View> : null}
    </View>
  );
}

ZeptoHS.displayName = 'ZeptoHS';

