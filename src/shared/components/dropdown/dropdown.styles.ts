import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

const TRIGGER_HEIGHT = 44;

export const dropdownTokens = {
  border: '#D1D5DB',
  background: '#FFFFFF',
  text: '#111827',
  placeholder: '#9CA3AF',
  error: '#DC2626',
  icon: '#6B7280',
  activeItem: '#F3F4F6',
  overlay: 'rgba(15, 23, 42, 0.12)',
  menuBorder: '#E2E8F0',
} as const;

const trigger: ViewStyle = {
  borderWidth: 1,
  borderColor: dropdownTokens.border,
  borderRadius: 10,
  height: TRIGGER_HEIGHT,
  paddingHorizontal: 12,
  backgroundColor: dropdownTokens.background,
  justifyContent: 'center',
};

const error: ViewStyle = {
  borderColor: dropdownTokens.error,
};

const menuContainer: ViewStyle = {
  backgroundColor: dropdownTokens.background,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: dropdownTokens.menuBorder,
  shadowColor: 'transparent',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0,
  shadowRadius: 0,
  elevation: 0,
  overflow: 'hidden',
};

const placeholderText: TextStyle = {
  fontSize: 14,
  color: dropdownTokens.placeholder,
};

const selectedText: TextStyle = {
  fontSize: 14,
  color: dropdownTokens.text,
};

const itemText: TextStyle = {
  fontSize: 14,
  lineHeight: 20,
  color: dropdownTokens.text,
};

const itemContainer: ViewStyle = {
  paddingVertical: 10,
  paddingHorizontal: 14,
};

const itemWrapperReset: ViewStyle = {
  padding: 0,
};

const itemSelected: ViewStyle = {
  backgroundColor: dropdownTokens.activeItem,
};

const searchInput: TextStyle = {
  borderWidth: 1,
  borderColor: dropdownTokens.border,
  borderRadius: 10,
  height: 38,
  paddingHorizontal: 12,
  fontSize: 14,
  color: dropdownTokens.text,
};

const iconSlot: ViewStyle = {
  marginRight: 8,
};

const iconSlotEnd: ViewStyle = {
  marginLeft: 8,
};

export const dropdownStyles = StyleSheet.create({
  trigger,
  error,
  menuContainer,
  placeholderText,
  selectedText,
  itemText,
  itemContainer,
  itemWrapperReset,
  itemSelected,
  searchInput,
  iconSlot,
  iconSlotEnd,
});