import React from 'react';
import { TextInput, View } from 'react-native';

import { zeptoTabsStyles } from './ZeptoTabs.styles';

export type ZeptoTabsSearchBandProps = {
  backgroundColor: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  testID?: string;
};

/** Search row matching `ZeptoTabs` visuals — extracted for sticky / scroll layouts. */
export function ZeptoTabsSearchBand(props: ZeptoTabsSearchBandProps): React.ReactElement {
  const {
    backgroundColor,
    searchPlaceholder = 'Search',
    searchValue,
    onSearchChange,
    testID,
  } = props;

  return (
    <View style={[zeptoTabsStyles.searchBg, { backgroundColor }]} testID={testID}>
      <View style={zeptoTabsStyles.searchWrap}>
        <View style={zeptoTabsStyles.searchBar}>
          <View style={zeptoTabsStyles.searchIcon}>
            <View style={zeptoTabsStyles.searchIconCircle} />
            <View style={zeptoTabsStyles.searchIconHandle} />
          </View>
          <TextInput
            value={searchValue}
            onChangeText={onSearchChange}
            placeholder={searchPlaceholder}
            placeholderTextColor="rgba(17,24,39,0.55)"
            style={zeptoTabsStyles.searchInput}
          />
        </View>
      </View>
    </View>
  );
}

ZeptoTabsSearchBand.displayName = 'ZeptoTabsSearchBand';
