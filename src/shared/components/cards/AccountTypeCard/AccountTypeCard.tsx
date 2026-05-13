import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { THEME } from '@/constants/theme';
import { Card, CardContent, CardDescription, CardTitle } from '@/shared/components';

interface AccountTypeCardProps {
  title: string;
  description?: string;
  iconName: string;
  gradientColors: readonly [string, string];
  onPress: () => void;
  accessibilityLabel: string;
  accessibilityHint?: string;
}

export function AccountTypeCard(props: AccountTypeCardProps): React.ReactElement {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={props.accessibilityLabel}
      accessibilityHint={props.accessibilityHint}
      hitSlop={6}
      onPress={props.onPress}
      style={styles.pressableOuter}
    >
      {({ pressed }) => (
        <Card
          style={StyleSheet.flatten([
            styles.card,
            pressed ? styles.cardPressed : {},
          ])}
        >
          <LinearGradient colors={[...props.gradientColors]} style={styles.iconContainer}>
            <Ionicons
              name={props.iconName}
              size={24}
              color={THEME.colors.chooseAccountIconOnGradient}
            />
          </LinearGradient>

          <CardContent style={styles.cardContent}>
            <CardTitle style={styles.cardTitle}>{props.title}</CardTitle>
            {props.description ? (
              <CardDescription style={styles.cardDescription}>{props.description}</CardDescription>
            ) : null}
          </CardContent>

          <View style={styles.arrowContainer}>
            <Ionicons name="arrow-forward" size={16} color={THEME.colors.chooseAccountArrow} />
          </View>
        </Card>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressableOuter: {
    borderRadius: 30,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.chooseAccountCardBg,
    borderRadius: 30,
    paddingVertical: THEME.spacing[16],
    paddingHorizontal: THEME.spacing[16],
    borderWidth: 1,
    borderColor: THEME.colors.chooseAccountCardBorder2,
    shadowColor: THEME.colors.chooseAccountTitle,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  cardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.988 }],
    borderColor: THEME.colors.chooseAccountCardBorder,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    marginLeft: THEME.spacing[16],
    marginRight: THEME.spacing[8],
    padding: 0,
  },
  cardTitle: {
    fontSize: THEME.typography.size[16],
    fontWeight: THEME.typography.weight.bold,
    color: THEME.colors.chooseAccountTitle,
  },
  cardDescription: {
    fontSize: THEME.typography.size[14],
    color: THEME.colors.chooseAccountSubtitle,
    lineHeight: 20,
  },
  arrowContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.colors.chooseAccountArrowBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

