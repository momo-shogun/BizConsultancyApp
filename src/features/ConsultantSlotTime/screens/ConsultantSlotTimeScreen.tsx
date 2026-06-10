import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  ConsultantSlotTimeSegmentTabs,
  type ConsultantSlotTimeTab,
} from '@/features/ConsultantSlotTime/components/ConsultantSlotTimeSegmentTabs';
import { OverrideEditorModal } from '@/features/ConsultantSlotTime/components/OverrideEditorModal';
import { ScheduleAvailabilitySummary } from '@/features/ConsultantSlotTime/components/ScheduleAvailabilitySummary';
import { ScheduleDayCard } from '@/features/ConsultantSlotTime/components/ScheduleDayCard';
import { SlotPreviewSection } from '@/features/ConsultantSlotTime/components/SlotPreviewSection';
import { useConsultantSlotTimeScreen } from '@/features/ConsultantSlotTime/hooks/useConsultantSlotTimeScreen';
import { formatOverrideDisplay } from '@/features/ConsultantSlotTime/utils/scheduleDisplay';
import {
  PROFILE_HEADER_GRADIENT,
  PROFILE_HEADER_STATUS_BAR,
} from '@/features/Profile/constants/profileScreenTheme';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';

import { SLOT_TIME_CANVAS, styles } from './ConsultantSlotTimeScreen.styles';

export function ConsultantSlotTimeScreen(): React.ReactElement {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const screen = useConsultantSlotTimeScreen();
  const [activeTab, setActiveTab] = useState<ConsultantSlotTimeTab>('schedule');

  const goToDaysOffTab = useCallback((): void => {
    setActiveTab('daysOff');
  }, []);

  const openAddDayOff = useCallback((): void => {
    setActiveTab('daysOff');
    screen.openCreateOverride();
  }, [screen]);

  const weeklyDays = useMemo(
    () => screen.scheduleDays.filter((day) => day.dayOfWeek !== 7),
    [screen.scheduleDays],
  );

  const isScheduleTab = activeTab === 'schedule';

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

      <View style={styles.tabBarWrap}>
        <ConsultantSlotTimeSegmentTabs
          activeTab={activeTab}
          daysOffCount={screen.overrides.length}
          onTabChange={setActiveTab}
        />
      </View>

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
        {isScheduleTab ? (
          <Animated.View
            key="schedule"
            entering={FadeIn.duration(220)}
            exiting={FadeOut.duration(160)}
            style={styles.tabPanel}
          >
            <SlotPreviewSection
              previewDate={screen.previewDate}
              onPreviewDateChange={screen.setPreviewDate}
              slots={screen.previewSlots}
              isLoading={screen.isPreviewLoading}
              previewNeedsSchedule={screen.previewNeedsSchedule}
            />

            <ScheduleAvailabilitySummary
              scheduleDays={screen.scheduleDays}
              overrides={screen.overrides}
              onManageDaysOff={goToDaysOffTab}
            />

            <View style={styles.weeklySection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Weekly hours</Text>
                <Text style={styles.sectionSubtitle}>
                  Choose which days you take bookings and set your open times. Switch off a day
                  if you are never available that day.
                </Text>
              </View>

              {!screen.scheduleExists ? (
                <View style={styles.emptyScheduleBox}>
                  <View style={styles.emptyScheduleIcon}>
                    <Ionicons name="time-outline" size={26} color="#059669" />
                  </View>
                  <Text style={styles.emptyScheduleTitle}>Set your weekly hours</Text>
                  <Text style={styles.emptyScheduleText}>
                    We will start with Mon–Sat open and Sunday closed. You can change any day
                    after.
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    onPress={screen.createSchedule}
                    style={({ pressed }) => [
                      styles.primaryBtnFull,
                      pressed ? { opacity: 0.92 } : null,
                    ]}
                  >
                    <Ionicons name="arrow-forward-circle-outline" size={20} color="#FFFFFF" />
                    <Text style={styles.primaryBtnText}>Get started</Text>
                  </Pressable>
                </View>
              ) : (
                <>
                  <View style={styles.tipBox}>
                    <Ionicons name="information-circle-outline" size={18} color="#059669" />
                    <Text style={styles.tipText}>
                      Changes apply after you tap Save. For a single holiday, use the Days off
                      tab.
                    </Text>
                  </View>

                  <View style={styles.weeklyDaysList}>
                    {weeklyDays.map((day, index) => (
                      <ScheduleDayCard
                        key={day.dayOfWeek}
                        day={day}
                        isLast={index === weeklyDays.length - 1}
                        onToggleActive={(active) => screen.setDayActive(day.dayOfWeek, active)}
                        onAddRange={() => screen.addRangeToDay(day.dayOfWeek)}
                        onRemoveRange={(rangeIndex) =>
                          screen.removeRangeFromDay(day.dayOfWeek, rangeIndex)
                        }
                        onUpdateRange={(rangeIndex, field, value) =>
                          screen.updateDayRange(day.dayOfWeek, rangeIndex, field, value)
                        }
                        onAddDayOff={openAddDayOff}
                      />
                    ))}
                  </View>

                  <Pressable
                    accessibilityRole="button"
                    onPress={() => void screen.saveSchedule()}
                    disabled={screen.isScheduleSaving}
                    style={({ pressed }) => [
                      styles.saveBtnFull,
                      screen.isScheduleSaving ? { opacity: 0.7 } : null,
                      pressed && !screen.isScheduleSaving ? { opacity: 0.92 } : null,
                    ]}
                  >
                    {screen.isScheduleSaving ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <>
                        <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
                        <Text style={styles.saveBtnText}>Save weekly hours</Text>
                      </>
                    )}
                  </Pressable>
                </>
              )}
            </View>
          </Animated.View>
        ) : (
          <Animated.View
            key="daysOff"
            entering={FadeIn.duration(220)}
            exiting={FadeOut.duration(160)}
            style={styles.tabPanel}
          >
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Block a date</Text>
                <Text style={styles.sectionSubtitle}>
                  Pick a date and time range when clients cannot book you.
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Add day off"
                onPress={screen.openCreateOverride}
                style={({ pressed }) => [styles.primaryBtn, pressed ? { opacity: 0.92 } : null]}
              >
                <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
                <Text style={styles.primaryBtnText}>Add day off</Text>
              </Pressable>
            </View>

            <View style={styles.daysOffCard}>
              <Text style={styles.sectionTitle}>Your blocked dates</Text>

              {screen.isOverridesLoading ? (
                <ActivityIndicator color="#059669" />
              ) : screen.overrides.length === 0 ? (
                <View style={styles.daysOffEmpty}>
                  <Text style={styles.daysOffEmptyTitle}>No days off yet</Text>
                  <Text style={styles.emptyHint}>
                    Tap Add day off above to block a date you are unavailable.
                  </Text>
                </View>
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
          </Animated.View>
        )}
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
