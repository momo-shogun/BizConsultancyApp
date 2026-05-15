import React, { useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { ROUTES } from '@/navigation/routeNames';
import type { EdpStackParamList } from '@/navigation/types';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { styles, ACCENT_BLUE, ACCENT_GREEN, ACCENT_PURPLE, ACCENT_AMBER } from './EDPScreen.styles';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';


// ─── Types ────────────────────────────────────────────────────────────────────

interface ModuleItem {
  id: string;
  title: string;
  videos: number;
  pdfs: number;
  status: 'completed' | 'active' | 'locked';
  progress: number;
}

interface StatItem {
  label: string;
  value: string;
  icon: string;
  accent: string;
}

interface JourneyStep {
  step: number;
  title: string;
  description: string;
  isLast?: boolean;
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface ProgressMeta {
  value: string;
  label: string;
}

export interface EDPScreenProps {
  onBack?: () => void;
  onShare?: () => void;
  onContinueLearning?: () => void;
  onTalkToExpert?: () => void;
  onModulePress?: (moduleId: string) => void;
  onViewAllModules?: () => void;
}

// ─── Config Maps ──────────────────────────────────────────────────────────────

const STAT_ITEMS: StatItem[] = [
  { label: 'Video lectures', value: '48', icon: '▶', accent: ACCENT_GREEN },
  { label: 'PDF resources', value: '23', icon: '⊞', accent: ACCENT_AMBER },
  { label: 'Modules', value: '8', icon: '◈', accent: ACCENT_BLUE },
  { label: 'Assessments', value: '5', icon: '✦', accent: ACCENT_PURPLE },
];

const MODULE_ITEMS: ModuleItem[] = [
  {
    id: 'm1',
    title: 'Module I — Programme intro',
    videos: 3,
    pdfs: 2,
    status: 'completed',
    progress: 100,
  },
  {
    id: 'm2',
    title: 'Module II — Business basics',
    videos: 5,
    pdfs: 3,
    status: 'active',
    progress: 60,
  },
  {
    id: 'm3',
    title: 'Module III — Compliance & GST',
    videos: 4,
    pdfs: 4,
    status: 'locked',
    progress: 0,
  },
  {
    id: 'm4',
    title: 'Module IV — Financial planning',
    videos: 6,
    pdfs: 3,
    status: 'locked',
    progress: 0,
  },
];

const JOURNEY_STEPS: JourneyStep[] = [
  {
    step: 1,
    title: 'Register & login',
    description: 'Create your account and access your personalised training dashboard.',
  },
  {
    step: 2,
    title: 'Start learning',
    description: 'Follow curated lectures and complete resources step by step.',
  },
  {
    step: 3,
    title: 'Get certified',
    description: 'Finish all module requirements and earn your government certification.',
    isLast: true,
  },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'f1',
    question: 'What is the EDP programme duration?',
    answer: 'The programme is self-paced. Most learners complete it in 3–6 months depending on their schedule and prior knowledge.',
  },
  {
    id: 'f2',
    question: 'Is certification government recognised?',
    answer: 'Yes. Completion leads to a government-recognised certificate issued by IID under the national entrepreneurship framework.',
  },
  {
    id: 'f3',
    question: 'Can I access content offline?',
    answer: 'PDF resources are available for download. Video lectures require an internet connection for streaming.',
  },
  {
    id: 'f4',
    question: 'How are assessments graded?',
    answer: 'Assessments are auto-graded. A minimum score of 60% is required to unlock the next module.',
  },
];

const PROGRESS_META: ProgressMeta[] = [
  { value: '28 min', label: 'Time spent' },
  { value: '2 / 8', label: 'Modules done' },
  { value: '3 / 5', label: 'Assessments' },
];

const MODULE_ACCENT: Record<ModuleItem['status'], string> = {
  completed: ACCENT_GREEN,
  active: ACCENT_BLUE,
  locked: '#4B5563',
};

const MODULE_STATUS_LABEL: Record<ModuleItem['status'], string> = {
  completed: 'Completed',
  active: 'In progress',
  locked: 'Locked',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function PressableCard({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: object;
}) {
  return (
    <Pressable onPress={onPress} style={style} android_ripple={{ color: 'rgba(255,255,255,0.08)' }}>
      {children}
    </Pressable>
  );
}

function SectionHeader({
  title,
  count,
  onAction,
  actionLabel,
}: {
  title: string;
  count?: number;
  onAction?: () => void;
  actionLabel?: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {count !== undefined ? (
        <View style={styles.sectionCountBadge}>
          <Text style={styles.sectionCountText}>{count}</Text>
        </View>
      ) : null}
      <View style={styles.sectionLine} />
      {onAction ? (
        <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
          <Text style={styles.sectionAction}>{actionLabel ?? 'View all'}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

function StatCard({ item }: { item: StatItem }) {
  return (
    <PressableCard style={styles.statCard}>
      <View style={styles.statCardShimmer} />
      <View style={styles.statRow}>
        <View style={[styles.statIconWrap, { borderColor: item.accent + '55' }]}>
          <View style={[styles.statIconInner, { backgroundColor: item.accent + '22' }]}>
            <Text style={[styles.statIconText, { color: item.accent }]}>
              {item.icon}
            </Text>
          </View>
        </View>
        <View style={styles.statTextContainer}>
          <Text style={styles.statValue}>{item.value}</Text>
          <Text style={styles.statLabel}>{item.label}</Text>
        </View>
      </View>
    </PressableCard>
  );
}

function ModuleCard({
  item,
  onPress,
}: {
  item: ModuleItem;
  onPress?: (id: string) => void;
}) {
  const accent = MODULE_ACCENT[item.status];
  const isLocked = item.status === 'locked';

  return (
    <PressableCard
      onPress={() => !isLocked && onPress?.(item.id)}
      style={styles.moduleCard}
    >
      <View style={styles.moduleCardInner}>
        <View style={[styles.moduleIconWrap, { borderColor: accent + '55' }]}>
          <View style={[styles.moduleIconInner, { backgroundColor: accent + '22' }]}>
            <Text style={[styles.moduleIconText, { color: accent }]}>
              {item.status === 'completed' ? '✓' : item.status === 'active' ? '▶' : '⊠'}
            </Text>
          </View>
        </View>
        <View style={styles.moduleInfo}>
          <Text style={[styles.moduleName, isLocked && styles.moduleNameLocked]}>
            {item.title}
          </Text>
          <View style={styles.moduleMeta}>
            <Text style={styles.moduleMetaText}>▶ {item.videos} videos</Text>
            <Text style={styles.moduleMetaDot}>·</Text>
            <Text style={styles.moduleMetaText}>⊞ {item.pdfs} PDFs</Text>
          </View>
          <View style={styles.moduleProgressBg}>
            <View
              style={[
                styles.moduleProgressFill,
                { width: `${item.progress}%` as unknown as number, backgroundColor: accent },
              ]}
            />
          </View>
        </View>
        <View style={[styles.moduleStatusPill, { backgroundColor: accent + '38', borderColor: accent + '55' }]}>
          <Text style={[styles.moduleStatusText, { color: accent }]}>
            {MODULE_STATUS_LABEL[item.status]}
          </Text>
        </View>
      </View>
    </PressableCard>
  );
}

function JourneyStepRow({ step }: { step: JourneyStep }) {
  const accentColor = step.isLast ? ACCENT_AMBER : ACCENT_GREEN;
  return (
    <View style={styles.journeyRow}>
      <View style={styles.journeyLeft}>
        <View style={[styles.journeyCircle, { borderColor: accentColor, backgroundColor: accentColor + '22' }]}>
          <Text style={[styles.journeyStepNum, { color: 'black' }]}>{step.step}</Text>
        </View>
        {!step.isLast && <View style={styles.journeyLine} />}
      </View>
      <View style={styles.journeyContent}>
        <Text style={styles.journeyTitle}>{step.title}</Text>
        <Text style={styles.journeyDesc}>{step.description}</Text>
      </View>
    </View>
  );
}

function FaqRow({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);
  const rotateVal = useSharedValue(0);
  const answerOpacity = useSharedValue(0);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(rotateVal.value, [0, 1], [0, 180])}deg`,
      },
    ],
  }));

  const answerStyle = useAnimatedStyle(() => ({
    opacity: answerOpacity.value,
  }));

  const toggle = useCallback(() => {
    const nextOpen = !open;
    rotateVal.value = withTiming(nextOpen ? 1 : 0, { duration: 200 });
    answerOpacity.value = withTiming(nextOpen ? 1 : 0, { duration: 200 });
    setOpen(nextOpen);
  }, [open, rotateVal, answerOpacity]);

  return (
    <View style={styles.faqCard}>
      <TouchableOpacity onPress={toggle} activeOpacity={0.8} style={styles.faqRow}>
        <Text style={styles.faqQuestion}>{item.question}</Text>
        <Animated.Text style={[styles.faqChevron, iconStyle]}>⌄</Animated.Text>
      </TouchableOpacity>
      {open ? (
        <Animated.View style={[styles.faqAnswer, answerStyle]}>
          <Text style={styles.faqAnswerText}>{item.answer}</Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

function CtaButton({
  label,
  variant,
  onPress,
}: {
  label: string;
  variant: 'primary' | 'secondary';
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={variant === 'primary' ? styles.ctaPrimary : styles.ctaSecondary}
      android_ripple={{ color: 'rgba(255,255,255,0.12)' }}
    >
      <Text style={variant === 'primary' ? styles.ctaPrimaryText : styles.ctaSecondaryText}>
        {label}
      </Text>
    </Pressable>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EDPScreen({
  onContinueLearning,
  onTalkToExpert,
  onModulePress,
  onViewAllModules,
}: EDPScreenProps) {
  const navigation = useNavigation<NavigationProp<EdpStackParamList>>();

  const onGetStarted = (): void => {
    navigation.navigate(ROUTES.Edp.Modules);
  };

  return (
    <SafeAreaWrapper edges={['top']} bgColor="#0F5132">
      <View style={styles.root}>
        <ScreenHeader title="EDP Programme" headerColor="#0F5132" onSearchPress={() => {}} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.heroBlock}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>✦  Government certified programme</Text>
            </View>
            <Text style={styles.heroTitle}>Build a compliant,{'\n'}sustainable business</Text>
            <Text style={styles.heroSubtitle}>
              Module-by-module learning — video lectures, downloads, and assessments toward certification.
            </Text>
            <View style={styles.heroActions}>
              <TouchableOpacity onPress={onGetStarted} activeOpacity={0.8} style={styles.heroBtnPrimary}>
                <Text style={styles.heroBtnPrimaryText}>Get started</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} style={styles.heroBtnSecondary}>
                <Text style={styles.heroBtnSecondaryText}>Ask a question</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.statsStrip}>
            {[
              { label: 'Hours', value: '100+' },
              { label: 'Modules', value: '8' },
              { label: 'Resources', value: '23' },
              { label: 'Assessments', value: '5' },
            ].map((s, i) => (
              <View key={s.label} style={[styles.stripItem, i < 3 && styles.stripItemBorder]}>
                <Text style={styles.stripVal}>{s.value}</Text>
                <Text style={styles.stripLbl}>{s.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.progressCard}>
            <View style={[styles.progressCardShimmer, { backgroundColor: ACCENT_GREEN }]} />
            <View style={styles.progressCardTop}>
              <View>
                <Text style={styles.progressCardTitle}>Your learning progress</Text>
                <Text style={styles.progressCardSub}>Module II — 1 lecture remaining</Text>
              </View>
              <View style={[styles.progressBadge, { backgroundColor: ACCENT_GREEN + '38', borderColor: ACCENT_GREEN + '55' }]}>
                <Text style={[styles.progressBadgeText, { color: ACCENT_GREEN }]}>25%</Text>
              </View>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { backgroundColor: ACCENT_GREEN }]} />
            </View>
            <View style={styles.progressMeta}>
              {PROGRESS_META.map((m, i) => (
                <View key={m.label} style={[styles.progressMetaItem, i < 2 && styles.progressMetaItemBorder]}>
                  <Text style={styles.progressMetaVal}>{m.value}</Text>
                  <Text style={styles.progressMetaLbl}>{m.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <SectionHeader title="Programme overview" count={4} />
            <View style={styles.statGrid}>
              {STAT_ITEMS.map((item) => (
                <StatCard key={item.label} item={item} />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <SectionHeader
              title="Curriculum"
              count={MODULE_ITEMS.length}
              onAction={onViewAllModules}
              actionLabel="View all"
            />
            {MODULE_ITEMS.map((item) => (
              <ModuleCard key={item.id} item={item} onPress={onModulePress} />
            ))}
          </View>

          <View style={styles.section}>
            <SectionHeader title="Learning journey" />
            <View style={styles.journeyCard}>
              <View style={styles.journeyCardShimmer} />
              {JOURNEY_STEPS.map((step) => (
                <JourneyStepRow key={step.step} step={step} />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <SectionHeader title="Quick answers" count={FAQ_ITEMS.length} />
            {FAQ_ITEMS.map((item) => (
              <FaqRow key={item.id} item={item} />
            ))}
          </View>

          <View style={styles.ctaSection}>
            <CtaButton
              label="Continue learning"
              variant="primary"
              onPress={onContinueLearning}
            />
            <CtaButton
              label="Talk to an expert"
              variant="secondary"
              onPress={onTalkToExpert}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaWrapper>
  );
}
