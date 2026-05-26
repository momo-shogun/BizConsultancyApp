import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { OverrideEditorModal } from '@/features/ConsultantSlotTime/components/OverrideEditorModal';
import { ScheduleDayCard } from '@/features/ConsultantSlotTime/components/ScheduleDayCard';
import { SlotPreviewSection } from '@/features/ConsultantSlotTime/components/SlotPreviewSection';
import { useConsultantSlotTimeScreen } from '@/features/ConsultantSlotTime/hooks/useConsultantSlotTimeScreen';
import { formatOverrideDisplay } from '@/features/ConsultantSlotTime/utils/scheduleDisplay';
import {
  PROFILE_HEADER_GRADIENT,
  PROFILE_HEADER_STATUS_BAR,
} from '@/features/Profile/constants/profileScreenTheme';
import { THEME } from '@/constants/theme';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';

import { SLOT_TIME_CANVAS, styles } from './ConsultantSlotTimeScreen.styles';

export function ConsultantSlotTimeScreen(): React.ReactElement {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const screen = useConsultantSlotTimeScreen();

  const topChrome = (
    <LinearGradient
      colors={[...PROFILE_HEADER_GRADIENT]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.topChrome, { paddingTop: insets.top }]}
    >
      <ScreenHeader
        title="Booking hours"
        onBackPress={() => navigation.goBack()}
        headerColor="transparent"
      />
    </LinearGradient>
  );

  if (screen.isScheduleLoading) {
    return (
      <SafeAreaWrapper
        edges={['bottom']}
        bgColor={PROFILE_HEADER_STATUS_BAR}
        contentBgColor={SLOT_TIME_CANVAS}
        statusBarStyle="light-content"
        style={styles.screenRoot}
      >
        {topChrome}
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#059669" />
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper
      edges={['bottom']}
      bgColor={PROFILE_HEADER_STATUS_BAR}
      contentBgColor={SLOT_TIME_CANVAS}
      statusBarStyle="light-content"
      style={styles.screenRoot}
    >
      {topChrome}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={screen.isRefreshing}
            onRefresh={screen.refreshAll}
            tintColor="#059669"
          />
        }
      >
        <LinearGradient
          colors={[...PROFILE_HEADER_GRADIENT]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroRow}>
            <View style={styles.heroIcon}>
              <Ionicons name="time-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.heroTextBlock}>
              <Text style={styles.heroTitle}>When can people book you?</Text>
              <Text style={styles.heroMeta}>Set your weekly hours. Mark days you are off.</Text>
            </View>
          </View>
        </LinearGradient>

        <SlotPreviewSection
          previewDate={screen.previewDate}
          onPreviewDateChange={screen.setPreviewDate}
          slots={screen.previewSlots}
          isLoading={screen.isPreviewLoading}
          slugMissing={screen.slugMissing}
        />

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Every week</Text>

          {!screen.scheduleExists ? (
            <View style={styles.emptyScheduleBox}>
              <Text style={styles.emptyScheduleTitle}>Not set up yet</Text>
              <Text style={styles.emptyScheduleText}>
                Tap below to choose your working days and times.
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={screen.createSchedule}
                style={({ pressed }) => [styles.primaryBtn, pressed ? { opacity: 0.92 } : null]}
              >
                <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
                <Text style={styles.primaryBtnText}>Set up now</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <Text style={styles.fieldLabel}>Name (optional)</Text>
              <TextInput
                value={screen.scheduleName}
                onChangeText={screen.setScheduleName}
                placeholder="e.g. My hours"
                placeholderTextColor="#94A3B8"
                style={styles.scheduleNameInput}
              />

              <View style={styles.scheduleActions}>
                <Pressable
                  accessibilityRole="button"
                  onPress={screen.cancelScheduleEdits}
                  style={styles.secondaryBtn}
                >
                  <Text style={styles.secondaryBtnText}>Undo</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => void screen.saveSchedule()}
                  disabled={screen.isScheduleSaving}
                  style={[styles.saveBtn, screen.isScheduleSaving ? { opacity: 0.7 } : null]}
                >
                  {screen.isScheduleSaving ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.saveBtnText}>Save</Text>
                  )}
                </Pressable>
              </View>

              <View style={styles.daysList}>
                {screen.scheduleDays.map((day) => (
                  <ScheduleDayCard
                    key={day.dayOfWeek}
                    day={day}
                    onToggleActive={(active) => screen.setDayActive(day.dayOfWeek, active)}
                    onAddRange={() => screen.addRangeToDay(day.dayOfWeek)}
                    onRemoveRange={(rangeIndex) =>
                      screen.removeRangeFromDay(day.dayOfWeek, rangeIndex)
                    }
                    onUpdateRange={(rangeIndex, field, value) =>
                      screen.updateDayRange(day.dayOfWeek, rangeIndex, field, value)
                    }
                  />
                ))}
              </View>
            </>
          )}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.overridesHeader}>
            <View style={styles.overridesHeaderText}>
              <Text style={styles.sectionTitle}>Days off</Text>
              <Text style={styles.sectionSubtitle}>Pick dates you are not free.</Text>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add day off"
              onPress={screen.openCreateOverride}
              style={({ pressed }) => [
                styles.addBlockBtn,
                pressed ? { opacity: 0.92 } : null,
              ]}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" />
              <Text style={styles.addBlockBtnText}>Add</Text>
            </Pressable>
          </View>

          {screen.isOverridesLoading ? (
            <ActivityIndicator color={THEME.colors.primary} />
          ) : screen.overrides.length === 0 ? (
            <Text style={styles.emptyHint}>No days off yet. Tap Add.</Text>
          ) : (
            screen.overrides.map((override) => (
              <View key={override.id} style={styles.overrideRow}>
                <Text style={styles.overrideText}>{formatOverrideDisplay(override)}</Text>
                <View style={styles.overrideActions}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => screen.openEditOverride(override)}
                    style={styles.iconBtn}
                  >
                    <Ionicons name="create-outline" size={20} color="#64748B" />
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => void screen.deleteOverride(override.id)}
                    style={styles.iconBtn}
                  >
                    <Ionicons name="trash-outline" size={20} color="#DC2626" />
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <OverrideEditorModal
        visible={screen.overrideModalVisible}
        isEdit={screen.overrideEditId != null}
        form={screen.overrideForm}
        isSaving={screen.isOverrideSaving}
        onClose={screen.closeOverrideModal}
        onChange={screen.updateOverrideForm}
        onSave={() => void screen.saveOverride()}
      />
    </SafeAreaWrapper>
  );
}
