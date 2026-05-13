import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { styles, THEME } from './EDPModulesScreen.styles';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';


// ─── Types ────────────────────────────────────────────────────────────────────

interface ModuleItem {
  id: string;
  number: string;
  label: string;
  title: string;
  icon: string;
  accentColor: string;
  videos: number;
  pdfs: number;
  tests: number;
  cardBg: string;
}

export interface EDPModulesScreenProps {
  onBack?: () => void;
  onOpenModule?: (moduleId: string) => void;
}

// ─── Config Maps ─────────────────────────────────────────────────────────────

const MODULES: ModuleItem[] = [
  {
    id: 'm1',
    number: 'M1',
    label: 'MODULE I',
    title: 'EDP Programme Orientations',
    icon: '📋',
    accentColor: THEME.colors.accentGreen,
    videos: 6,
    pdfs: 6,
    tests: 0,
    cardBg: '#0F2A1A',
  },
  {
    id: 'm2',
    number: 'M2',
    label: 'MODULE II',
    title: 'Business Idea Generation & Validation',
    icon: '💡',
    accentColor: THEME.colors.accentAmber,
    videos: 14,
    pdfs: 15,
    tests: 0,
    cardBg: '#1C1400',
  },
  {
    id: 'm3',
    number: 'M3',
    label: 'MODULE III',
    title: 'Entrepreneur Skill Sets',
    icon: '🌟',
    accentColor: THEME.colors.accentBlue,
    videos: 12,
    pdfs: 12,
    tests: 0,
    cardBg: '#0A1929',
  },
  {
    id: 'm4',
    number: 'M4',
    label: 'MODULE IV',
    title: 'Business Venture Types & Registration',
    icon: '🏪',
    accentColor: THEME.colors.accentPurple,
    videos: 8,
    pdfs: 8,
    tests: 0,
    cardBg: '#1A0F2E',
  },
  {
    id: 'm5',
    number: 'M5',
    label: 'MODULE V',
    title: 'Financial Planning & Management',
    icon: '💰',
    accentColor: THEME.colors.accentRose,
    videos: 10,
    pdfs: 10,
    tests: 0,
    cardBg: '#200818',
  },
  {
    id: 'm6',
    number: 'M6',
    label: 'MODULE VI',
    title: 'Marketing & Digital Strategy',
    icon: '📣',
    accentColor: THEME.colors.accentTeal,
    videos: 11,
    pdfs: 11,
    tests: 0,
    cardBg: '#061A18',
  },
  {
    id: 'm7',
    number: 'M7',
    label: 'MODULE VII',
    title: 'Legal Compliance & Taxation',
    icon: '⚖️',
    accentColor: THEME.colors.accentOrange,
    videos: 9,
    pdfs: 9,
    tests: 0,
    cardBg: '#1C0E00',
  },
  {
    id: 'm8',
    number: 'M8',
    label: 'MODULE VIII',
    title: 'Scaling & Growth Operations',
    icon: '🚀',
    accentColor: THEME.colors.accentBlue,
    videos: 13,
    pdfs: 13,
    tests: 0,
    cardBg: '#071428',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const ModuleCard = ({
  item,
  onPress,
}: {
  item: ModuleItem;
  onPress: () => void;
}) => {
  const accentBg22 = `${item.accentColor}38`;
  const accentBg13 = `${item.accentColor}21`;
  const accentBorder33 = `${item.accentColor}54`;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: "white" }]}
      onPress={onPress}
      activeOpacity={0.82}
    >
      {/* shimmer top edge */}
      <View style={[styles.cardShimmerEdge,]} />

      <View style={styles.cardTopSection}>
        {/* Badge */}
        <View
          style={[
            styles.cardBadge,
            { backgroundColor: accentBg22, borderWidth: 1, borderColor: accentBorder33 },
          ]}
        >
          <Text style={[styles.cardBadgeText,]}>
            {item.number}
          </Text>
        </View>

        {/* Icon container */}
        <View
          style={[
            styles.cardIconContainer,
            { borderColor: accentBorder33 },
          ]}
        >
          <View style={[styles.cardIconInner]}>
            <Text style={{ fontSize: 22 }}>{item.icon}</Text>
          </View>
        </View>
      </View>

      {/* Body */}
      <View style={styles.cardBody}>
        <Text style={styles.cardModLabel}>{item.label}</Text>
        <Text style={styles.cardTitle} numberOfLines={3}>
          {item.title}
        </Text>

        {/* Pills */}
        <View style={styles.cardPills}>
          <View style={styles.pill}>
            <Text style={{ fontSize: 9, color: item.accentColor }}>▶</Text>
            <Text style={styles.pillText}>{item.videos} Videos</Text>
          </View>
          <View style={styles.pill}>
            <Text style={{ fontSize: 9, color: item.accentColor }}>📄</Text>
            <Text style={styles.pillText}>{item.pdfs} PDFs</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <Text style={styles.cardAssessText}>
          {item.tests === 0 ? 'No tests' : `${item.tests} tests`}
        </Text>
        <TouchableOpacity
          style={[styles.cardOpenBtn, { backgroundColor: accentBg22 }]}
          onPress={onPress}
          activeOpacity={0.75}
        >
          <Text style={[styles.cardOpenBtnText, { color: item.accentColor }]}>Open →</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const TopBar = ({
  lang,
  onLangSwitch,
  onBack,
}: {
  lang: 'EN' | 'HI';
  onLangSwitch: (l: 'EN' | 'HI') => void;
  onBack?: () => void;
}) => (
  <View style={styles.topBar}>
    <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
      <Text style={{ fontSize: 16, color: THEME.colors.textSecondary }}>←</Text>
    </TouchableOpacity>
    <View style={styles.topBarMid}>
      <Text style={styles.topBarTitle}>EDP Modules</Text>
      <Text style={styles.topBarSubtitle}>Learn the programme step-by-step</Text>
    </View>
    <View style={styles.langToggle}>
      <TouchableOpacity
        style={[styles.langBtn, lang === 'EN' && styles.langBtnActive]}
        onPress={() => onLangSwitch('EN')}
        activeOpacity={0.8}
      >
        <Text style={lang === 'EN' ? styles.langBtnActiveText : styles.langBtnText}>EN</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.langBtn, lang === 'HI' && styles.langBtnActive]}
        onPress={() => onLangSwitch('HI')}
        activeOpacity={0.8}
      >
        <Text style={lang === 'HI' ? styles.langBtnActiveText : styles.langBtnText}>हिंदी</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const BottomNav = ({ active }: { active: 'home' | 'profile' | 'signout' }) => {
  const NAV_ITEMS: { key: 'home' | 'profile' | 'signout'; icon: string; label: string }[] = [
    { key: 'home', icon: '⌂', label: 'Home' },
    { key: 'profile', icon: '◉', label: 'Profile' },
    { key: 'signout', icon: '⏻', label: 'Sign out' },
  ];

  return (
    <View style={styles.bottomNav}>
      {NAV_ITEMS.map((item) => (
        <TouchableOpacity key={item.key} style={styles.navItem} activeOpacity={0.7}>
          <Text
            style={{
              fontSize: 22,
              color: active === item.key ? THEME.colors.accentGreen : 'rgba(148,163,184,0.35)',
            }}
          >
            {item.icon}
          </Text>
          <Text style={active === item.key ? styles.navLabelActive : styles.navLabel}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const EDPModulesScreen = ({ onBack, onOpenModule }: EDPModulesScreenProps) => {
  const [lang, setLang] = useState<'ENG' | 'HI'>('ENG');

  const totalModules = MODULES.length;
  const navigation = useNavigation();

  return (
    
    <SafeAreaWrapper edges={['top']} bgColor='black' isLight = {true}>
      
      <ScreenHeader
        title="EDP Modules"
        headerColor="black"
        onBackPress={()=> {
          navigation.goBack();
        }}
        showLanguageSwitch={true}
        lang={lang}
        onLangSwitch={setLang}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search */}
        <View style={styles.searchWrapper}>
          <Text style={{ fontSize: 25, color: 'black' }}>⌕</Text>
          <Text style={styles.searchPlaceholder}>Search modules...</Text>
          
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionAccentBar} />
          <Text style={styles.sectionTitle}>Catalogue</Text>
        </View>

        {/* Grid */}
        <View style={styles.grid}>
          {MODULES.map((item) => (
            <ModuleCard
              key={item.id}
              item={item}
              onPress={() => onOpenModule?.(item.id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  
  );
};

export default EDPModulesScreen;