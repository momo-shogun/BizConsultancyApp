import { SafeAreaWrapper, ScreenHeader } from '@/shared/components';
import React, { useState } from 'react';
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    Image,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import lightLogo from '@/assets/lightlogo.png';

const ServiceOnboarding = () => {
    const [step, setStep] = useState(1);

    const isFirstStep = step === 1;

    return (
        <SafeAreaWrapper edges={['bottom', 'top']} >
            {/* <ScreenHeader title="Services"  /> */}
            ̰<View style={[styles.top, { paddingTop: insets.top + THEME.spacing[8] }]}>
              <Image
                source={lightLogo}
                accessibilityLabel="Biz Consultancy"
                style={styles.brandMark}
                resizeMode="contain"
              />
              <View style={styles.progressTrack}>
                <View style={styles.progressActive} />
              </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}>



                {/* Title */}
                <Text style={styles.title}>
                    1.5 Lakh +{' '}
                    <Text style={styles.lightTitle}>
                        Successful MSME Registrations
                    </Text>
                </Text>

                {/* Progress Card */}
                <View style={styles.progressCard}>
                    <View style={styles.progressTop}>
                        <Text style={styles.progressLabel}>
                            {isFirstStep ? '0/2 complete' : '2/2 complete'}
                        </Text>

                        <Text style={styles.progressTime}>
                            Takes less than 1 min
                        </Text>
                    </View>

                    <View style={styles.progressTrack}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    width: isFirstStep ? '45%' : '100%',
                                    backgroundColor: isFirstStep
                                        ? '#D7DBE1'
                                        : '#45C15A',
                                },
                            ]}
                        />
                    </View>
                </View>

                {/* Form Section */}
                <View style={styles.formSection}>
                    <Text style={styles.question}>
                        {isFirstStep
                            ? 'Please select your entity type?'
                            : "What’s the annual turnover of your company?"}
                    </Text>

                    <TouchableOpacity
                        activeOpacity={0.85}
                        style={styles.dropdown}>
                        <Text style={styles.dropdownText}>
                            {isFirstStep
                                ? 'Select option'
                                : '10 lakhs - 1 crore'}
                        </Text>

                        <Ionicons
                            name="chevron-down"
                            size={18}
                            color="#A0A4AB"
                        />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Floating Assistant */}
            <View style={styles.assistant}>
                <Text style={styles.assistantEmoji}>🧑🏻</Text>
            </View>

            {/* Bottom Buttons */}
            <View style={styles.footer}>
                {!isFirstStep && (
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.backBtn}
                        onPress={() => setStep(1)}>
                        <Ionicons
                            name="arrow-back"
                            size={18}
                            color="#0B3B66"
                        />

                        <Text style={styles.backBtnText}>Back</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    activeOpacity={0.9}
                    style={[
                        styles.nextBtn,
                        isFirstStep && styles.fullBtn,
                    ]}
                    onPress={() => setStep(2)}>
                    <Text
                        style={[
                            styles.nextBtnText,
                            isFirstStep && styles.disabledText,
                        ]}>
                        Next
                    </Text>

                    <Ionicons
                        name="arrow-forward"
                        size={18}
                        color={isFirstStep ? '#AEB6C1' : '#FFFFFF'}
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaWrapper>
    );
};

export default ServiceOnboarding;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },

    scrollContainer: {
        paddingHorizontal: 18,
        paddingTop: 14,
        paddingBottom: 120,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },

    backIcon: {
        width: 34,
        height: 34,
        justifyContent: 'center',
        alignItems: 'center',
    },

    logoWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },

    logoYellow: {
        backgroundColor: '#FFD633',
        paddingHorizontal: 6,
        paddingVertical: 2,
        fontSize: 15,
        fontWeight: '800',
        color: '#111827',
    },

    logoText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        letterSpacing: 0.6,
        marginLeft: 2,
    },

    title: {
        fontSize: 18,
        lineHeight: 28,
        fontWeight: '800',
        color: '#0B3258',
        marginBottom: 20,
    },

    lightTitle: {
        color: '#7B8794',
        fontWeight: '700',
    },

    progressCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: '#ECEFF3',
        marginBottom: 24,
    },

    progressTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },

    progressLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
    },

    progressTime: {
        fontSize: 13,
        color: '#98A2B3',
        fontWeight: '500',
    },

    progressTrack: {
        height: 5,
        borderRadius: 10,
        backgroundColor: '#EEF1F4',
        overflow: 'hidden',
    },

    progressFill: {
        height: '100%',
        borderRadius: 10,
    },

    formSection: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        borderColor: '#ECEFF3',
    },

    question: {
        fontSize: 20,
        lineHeight: 30,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 18,
    },

    dropdown: {
        height: 54,
        borderRadius: 12,
        borderWidth: 1.3,
        borderColor: '#0B3B66',
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
    },

    dropdownText: {
        fontSize: 16,
        color: '#A0A4AB',
        fontWeight: '500',
    },

    assistant: {
        position: 'absolute',
        right: 18,
        bottom: 92,
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: '#2E74B7',
        justifyContent: 'center',
        alignItems: 'center',
    },

    assistantEmoji: {
        fontSize: 28,
    },

    footer: {
        position: 'absolute',
        bottom: 20,
        left: 18,
        right: 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    backBtn: {
        flex: 0.48,
        height: 52,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#0B3B66',
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    backBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0B3B66',
        marginLeft: 6,
    },

    nextBtn: {
        flex: 0.48,
        height: 52,
        borderRadius: 12,
        backgroundColor: '#0B3B66',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    fullBtn: {
        flex: 1,
        backgroundColor: '#E6EAF0',
    },

    nextBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        marginRight: 6,
    },

    disabledText: {
        color: '#AEB6C1',
    },
});