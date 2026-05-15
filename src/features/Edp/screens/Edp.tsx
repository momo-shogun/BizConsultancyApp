import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { ROUTES } from '@/navigation/routeNames';
import type { EdpStackParamList } from '@/navigation/types';
import {
  EdpFaqCard,
  EdpLearningJourneyCard,
  EdpMetricCard,
  EdpModuleCard,
  EdpProgressCard,
  EdpSectionHeader,
  EdpStatsStrip,
  SafeAreaWrapper,
  ScreenHeader,
} from '@/shared/components';

import { EdpHeroSection } from '../components/EdpHeroSection';
import {
  EDP_ACCENT_GREEN,
  EDP_FAQ_ITEMS,
  EDP_HERO_BG,
  EDP_JOURNEY_STEPS,
  EDP_METRIC_ITEMS,
  EDP_MODULE_ITEMS,
  EDP_PROGRESS_META,
  EDP_STRIP_STATS,
} from '../data/edpLandingData';
import { styles } from './EDPScreen.styles';

export interface EDPScreenProps {
  onContinueLearning?: () => void;
  onTalkToExpert?: () => void;
  onModulePress?: (moduleId: string) => void;
  onViewAllModules?: () => void;
}

export default function EDPScreen({
  onContinueLearning,
  onTalkToExpert,
  onModulePress,
  onViewAllModules,
}: EDPScreenProps): React.ReactElement {
  const navigation = useNavigation<NavigationProp<EdpStackParamList>>();

  const onGetStarted = (): void => {
    navigation.navigate(ROUTES.Edp.Modules);
  };

  return (
    <SafeAreaWrapper edges={['top']} bgColor={EDP_HERO_BG}>
      <View style={styles.root}>
        <ScreenHeader title="EDP Programme" headerColor={EDP_HERO_BG} onSearchPress={() => {}} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <EdpHeroSection onGetStarted={onGetStarted} />

          <EdpStatsStrip items={EDP_STRIP_STATS} />

          <EdpProgressCard
            title="Your learning progress"
            subtitle="Module II — 1 lecture remaining"
            badgeLabel="25%"
            badgeAccent={EDP_ACCENT_GREEN}
            progressPercent={25}
            progressAccent={EDP_ACCENT_GREEN}
            meta={EDP_PROGRESS_META}
          />

          <View style={styles.section}>
            <EdpSectionHeader title="Programme overview" count={EDP_METRIC_ITEMS.length} />
            <View style={styles.statGrid}>
              {EDP_METRIC_ITEMS.map((item) => (
                <EdpMetricCard key={item.label} item={item} />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <EdpSectionHeader
              title="Curriculum"
              count={EDP_MODULE_ITEMS.length}
              onAction={onViewAllModules}
              actionLabel="View all"
            />
            {EDP_MODULE_ITEMS.map((item) => (
              <EdpModuleCard
                key={item.id}
                item={item}
                onPress={() => onModulePress?.(item.id)}
              />
            ))}
          </View>

          <View style={styles.section}>
            <EdpSectionHeader title="Learning journey" />
            <EdpLearningJourneyCard steps={EDP_JOURNEY_STEPS} />
          </View>

          <View style={styles.section}>
            <EdpSectionHeader title="Quick answers" count={EDP_FAQ_ITEMS.length} />
            {EDP_FAQ_ITEMS.map((item) => (
              <EdpFaqCard key={item.id} question={item.question} answer={item.answer} />
            ))}
          </View>

          <View style={styles.ctaSection}>
            <Pressable
              onPress={onContinueLearning}
              style={styles.ctaPrimary}
              accessibilityRole="button"
              accessibilityLabel="Continue learning"
            >
              <Text style={styles.ctaPrimaryText}>Continue learning</Text>
            </Pressable>
            <Pressable
              onPress={onTalkToExpert}
              style={styles.ctaSecondary}
              accessibilityRole="button"
              accessibilityLabel="Talk to an expert"
            >
              <Text style={styles.ctaSecondaryText}>Talk to an expert</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </SafeAreaWrapper>
  );
}
