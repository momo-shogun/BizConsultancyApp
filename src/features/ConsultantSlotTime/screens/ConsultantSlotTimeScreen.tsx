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
import Ionicons from 'react-native-vector-icons/Ionicons';

import { OverrideEditorModal } from '@/features/ConsultantSlotTime/components/OverrideEditorModal';
import { ScheduleDayCard } from '@/features/ConsultantSlotTime/components/ScheduleDayCard';
import { SlotPreviewSection } from '@/features/ConsultantSlotTime/components/SlotPreviewSection';
import { useConsultantSlotTimeScreen } from '@/features/ConsultantSlotTime/hooks/useConsultantSlotTimeScreen';
import { formatOverrideDisplay } from '@/features/ConsultantSlotTime/utils/scheduleDisplay';
import { PROFILE_HEADER_GRADIENT } from '@/features/Profile/constants/profileScreenTheme';
import { THEME } from '@/constants/theme';
import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';

import { SLOT_TIME_CANVAS, styles } from './ConsultantSlotTimeScreen.styles';

export function ConsultantSlotTimeScreen(): React.ReactElement {
  const navigation = useNavigation();
  const screen = useConsultantSlotTimeScreen();

  if (screen.isScheduleLoading) {
    return (
      <SafeAreaWrapper edges={['top', 'bottom']} bgColor={SLOT_TIME_CANVAS}>
        <ScreenHeader title="Slot Time" onBackPress={() => navigation.goBack()} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={THEME.colors.primary} />
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} bgColor={SLOT_TIME_CANVAS}>
      <ScreenHeader title="Slot Time" onBackPress={() => navigation.goBack()} />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={screen.isRefreshing}
            onRefresh={screen.refreshAll}
            tintColor={THEME.colors.primary}
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
              <Text style={styles.heroTitle}>Availability</Text>
              <Text style={styles.heroMeta}>
                Set your weekly hours and block specific dates when you are unavailable.
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.tipCard}>
          <Ionicons name="information-circle-outline" size={18} color="#059669" />
          <Text style={styles.tipText}>
            Weekly schedule defines your regular slots. Overrides mark one-off unavailable
            windows. Clients can only book inside active hours.
          </Text>
        </View>

        <SlotPreviewSection
          previewDate={screen.previewDate}
          onPreviewDateChange={screen.setPreviewDate}
          slots={screen.previewSlots}
          isLoading={screen.isPreviewLoading}
          slugMissing={screen.slugMissing}
        />

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Weekly schedule</Text>
            <Text style={styles.sectionSubtitle}>
              Turn days on and add one or more time ranges per day.
            </Text>
          </View>

          {!screen.scheduleExists ? (
            <View style={styles.emptyScheduleBox}>
              <Text style={styles.emptyScheduleTitle}>No schedule yet</Text>
              <Text style={styles.emptyScheduleText}>
                Create a schedule to define your regular availability by day and time.
              </Text>
              <Pressable
                accessibilityRole="button"
                onPress={screen.createSchedule}
                style={({ pressed }) => [styles.primaryBtn, pressed ? { opacity: 0.92 } : null]}
              >
                <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
                <Text style={styles.primaryBtnText}>Create schedule</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View>
                <Text style={styles.sectionSubtitle}>Schedule name</Text>
                <TextInput
                  value={screen.scheduleName}
                  onChangeText={screen.setScheduleName}
                  placeholder="Default"
                  placeholderTextColor="#94A3B8"
                  style={styles.scheduleNameInput}
                />
              </View>

              <View style={styles.scheduleActions}>
                <Pressable
                  accessibilityRole="button"
                  onPress={screen.cancelScheduleEdits}
                  style={styles.secondaryBtn}
                >
                  <Text style={styles.secondaryBtnText}>Cancel</Text>
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
                    <Text style={styles.saveBtnText}>Save schedule</Text>
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
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Unavailable blocks</Text>
              <Text style={styles.sectionSubtitle}>
                Block specific dates that override your weekly schedule.
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={screen.openCreateOverride}
              style={({ pressed }) => [styles.primaryBtn, pressed ? { opacity: 0.92 } : null]}
            >
              <Ionicons name="add" size={16} color="#FFFFFF" />
              <Text style={styles.primaryBtnText}>Add</Text>
            </Pressable>
          </View>

          {screen.isOverridesLoading ? (
            <ActivityIndicator color={THEME.colors.primary} />
          ) : screen.overrides.length === 0 ? (
            <Text style={styles.sectionSubtitle}>
              No blocks yet. Tap Add to mark a date/time as unavailable.
            </Text>
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
