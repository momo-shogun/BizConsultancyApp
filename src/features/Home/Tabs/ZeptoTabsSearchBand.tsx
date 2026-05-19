import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { zeptoTabsStyles } from './ZeptoTabs.styles';

export type ZeptoTabsSearchBandProps = {
  backgroundColor: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  /** Opens dedicated search screen — bar becomes tappable (Zepto-style). */
  onPress?: () => void;
  testID?: string;
};

/** Search row matching `ZeptoTabs` visuals — extracted for sticky / scroll layouts. */
export function ZeptoTabsSearchBand(props: ZeptoTabsSearchBandProps): React.ReactElement {
  const {
    backgroundColor,
    searchPlaceholder = 'Search',
    searchValue,
    onSearchChange,
    onPress,
    testID,
  } = props;

  const isLauncher = onPress != null;

  const searchBar = (
    <View style={zeptoTabsStyles.searchBar}>
      <View style={zeptoTabsStyles.searchIcon}>
        <View style={zeptoTabsStyles.searchIconCircle} />
        <View style={zeptoTabsStyles.searchIconHandle} />
      </View>
      {isLauncher ? (
        <View style={zeptoTabsStyles.searchTextSlot}>
          <Text style={zeptoTabsStyles.searchPlaceholderText} numberOfLines={1}>
            {searchPlaceholder}
          </Text>
        </View>
      ) : (
        <TextInput
          value={searchValue}
          onChangeText={onSearchChange}
          placeholder={searchPlaceholder}
          placeholderTextColor="rgba(17,24,39,0.55)"
          style={zeptoTabsStyles.searchInput}
        />
      )}
    </View>
  );

  return (
    <View style={[zeptoTabsStyles.searchBg, { backgroundColor }]} testID={testID}>
      <View style={zeptoTabsStyles.searchWrap}>
        {isLauncher ? (
          <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={searchPlaceholder}
            style={({ pressed }) => [pressed && zeptoTabsStyles.searchBarPressed]}
          >
            {searchBar}
          </Pressable>
        ) : (
          searchBar
        )}
      </View>
    </View>
  );
}

ZeptoTabsSearchBand.displayName = 'ZeptoTabsSearchBand';
