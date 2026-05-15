import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  Dropdown as ElementDropdown,
  type IDropdownRef,
} from 'react-native-element-dropdown';

import type { DropdownProps } from './dropdown.types';
import { dropdownStyles, dropdownTokens } from './dropdown.styles';

function DropdownInner(
  {
    disabled,
    error,
    leftIcon,
    rightIcon,
    containerStyle,
    menuContainerStyle,
    placeholderStyle,
    selectedTextStyle,
    itemContainerStyle,
    itemTextStyle,
    inputSearchStyle,
    renderLeftIcon,
    renderRightIcon,
    renderItem: renderItemProp,
    labelField,
    ...rest
  }: DropdownProps<Record<string, unknown>>,
  ref: React.ForwardedRef<IDropdownRef>,
) {
  const mergedRenderLeftIcon =
    renderLeftIcon ??
    (leftIcon != null
      ? () => <View style={dropdownStyles.iconSlot}>{leftIcon}</View>
      : undefined);

  const mergedRenderRightIcon =
    renderRightIcon ??
    (rightIcon != null
      ? () => <View style={dropdownStyles.iconSlotEnd}>{rightIcon}</View>
      : undefined);

  const defaultRenderItem = useCallback(
    (item: Record<string, unknown>, selected?: boolean) => (
      <View
        style={[
          dropdownStyles.itemContainer,
          selected ? dropdownStyles.itemSelected : undefined,
          itemContainerStyle,
        ]}
      >
        <Text style={[dropdownStyles.itemText, itemTextStyle]}>
          {String(item[labelField as string] ?? '')}
        </Text>
      </View>
    ),
    [itemContainerStyle, itemTextStyle, labelField],
  );

  return (
    <ElementDropdown
      ref={ref}
      disable={disabled}
      labelField={labelField}
      maxHeight={200}
      style={StyleSheet.flatten([
        dropdownStyles.trigger,
        error ? dropdownStyles.error : null,
        containerStyle,
      ])}
      containerStyle={StyleSheet.flatten([
        dropdownStyles.menuContainer,
        menuContainerStyle,
      ])}
      placeholderStyle={StyleSheet.flatten([
        dropdownStyles.placeholderText,
        placeholderStyle,
      ])}
      selectedTextStyle={StyleSheet.flatten([
        dropdownStyles.selectedText,
        selectedTextStyle,
      ])}
      itemTextStyle={StyleSheet.flatten([
        dropdownStyles.itemText,
        itemTextStyle,
      ])}
      inputSearchStyle={StyleSheet.flatten([
        dropdownStyles.searchInput,
        inputSearchStyle,
      ])}
      itemContainerStyle={dropdownStyles.itemWrapperReset}
      activeColor="transparent"
      iconColor={dropdownTokens.icon}
      backgroundColor={dropdownTokens.overlay}
      searchPlaceholderTextColor={dropdownTokens.placeholder}
      renderLeftIcon={mergedRenderLeftIcon}
      renderRightIcon={mergedRenderRightIcon}
      renderItem={renderItemProp ?? defaultRenderItem}
      {...rest}
    />
  );
}

export const Dropdown = React.forwardRef(DropdownInner);

Dropdown.displayName = 'Dropdown';