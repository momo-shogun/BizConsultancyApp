import React from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import {
  EdpLearningJourneyCard,
  EdpSectionHeader,
  SafeAreaWrapper,
  ScreenHeader,
} from '@/shared/components';

import { EdpCurriculumSection } from '../components/landing/EdpCurriculumSection';
import { EdpFaqSection } from '../components/landing/EdpFaqSection';
import { EdpStatsStripBlock } from '../components/landing/EdpStatsStripBlock';
import { landingStyles } from '../components/landing/EdpLandingSection.styles';
import { EdpHeroSection } from '../components/EdpHeroSection';
import { EDP_HERO_BG, EDP_JOURNEY_STEPS } from '../data/edpLandingData';
import { useEdpLandingScreen } from '../hooks/useEdpLandingScreen';
import { styles } from './EDPScreen.styles';

export interface EDPScreenProps {
  onContinueLearning?: () => void;
  onTalkToExpert?: () => void;
  onModulePress?: (moduleSlug: string) => void;
  onViewAllModules?: () => void;
}

export default function EDPScreen(props: EDPScreenProps): React.ReactElement {
  const { onBizAiScroll, courses, faqs, onGetStarted, onAskQuestion, openModules } = useEdpLandingScreen({
    onViewAllModules: props.onViewAllModules,
  });

  return (
    <SafeAreaWrapper edges={['top']} bgColor={EDP_HERO_BG} statusBarStyle="light-content">
      <View style={styles.root}>
        <ScreenHeader title="EDP Programme" headerColor={EDP_HERO_BG} />

        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onScroll={onBizAiScroll}
          scrollEventThrottle={16}
        >
          <EdpHeroSection onGetStarted={onGetStarted} onAskQuestion={onAskQuestion} />

          <EdpStatsStripBlock isLoading={courses.isLoading} items={courses.stripStats} />

          <EdpCurriculumSection
            isLoading={courses.isLoading}
            isEmpty={courses.isCurriculumEmpty}
            modules={courses.curriculumModules}
            onViewAll={openModules}
          />

          <View style={landingStyles.section}>
            <EdpSectionHeader title="Learning journey" />
            <EdpLearningJourneyCard steps={EDP_JOURNEY_STEPS} />
          </View>

          <EdpFaqSection
            isLoading={faqs.isLoading}
            isEmpty={faqs.isEmpty}
            faqs={faqs.faqs}
            count={faqs.count}
          />

          {/* <EdpLandingCtaSection
            onContinueLearning={props.onContinueLearning}
            onTalkToExpert={props.onTalkToExpert}
          /> */}
        </Animated.ScrollView>
      </View>
    </SafeAreaWrapper>
  );
}
