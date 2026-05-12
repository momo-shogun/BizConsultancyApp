import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp,
    Layout,
} from 'react-native-reanimated';
import { styles } from './BenefitsSection.styles';
import Entypo from 'react-native-vector-icons/Entypo';

interface BenefitItem {
    title: string;
    description: string;
}

interface BenefitsData {
    items: BenefitItem[];
}

interface BenefitsSectionProps {
    benefits: BenefitsData;
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({
    benefits,
}) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(0);

    const toggleItem = (index: number) => {
        setActiveIndex(prev => (prev === index ? null : index));
    };

    if (!benefits?.items?.length) {
        return null;
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <Animated.View entering={FadeInUp.duration(350)}>
                <Text style={styles.sectionTitle}>
                    Key Benefits
                </Text>

                <Text style={styles.sectionSubtitle}>
                    A Private Limited Company is the most popular form of business entity in India. It offers limited liability protection to shareholders, has a separate legal entity, and is ideal for startups and growing businesses.
                </Text>
            </Animated.View>

            {/* Accordion */}
            <View style={styles.benefitsList}>
                {benefits.items.map((benefit, index) => {
                    const isOpen = activeIndex === index;

                    return (
                        <Animated.View
                            key={`${benefit.title}-${index}`}
                            entering={FadeInDown.delay(index * 70)}
                            layout={Layout.springify()}
                            style={[
                                styles.benefitItem,
                                index === benefits.items.length - 1 &&
                                styles.lastBenefitItem,
                            ]}
                        >
                            <Pressable
                                onPress={() => toggleItem(index)}
                                style={styles.header}
                            >
                                <View style={styles.titleWrap}>
                                    <Text style={styles.benefitTitle}>
                                        {benefit.title}
                                    </Text>
                                </View>

                                <Animated.Text
                                    layout={Layout.springify()}
                                    style={[
                                        styles.chevron,
                                        isOpen && styles.chevronOpen,
                                    ]}
                                >
                                    {isOpen ? (
                                        <Entypo name="cross" size={20} />
                                    ) : (
                                        <Entypo name="chevron-down" size={20} />
                                    )}
                                </Animated.Text>
                            </Pressable>

                            {isOpen && (
                                <Animated.View
                                    entering={FadeInDown.duration(220)}
                                    style={styles.content}
                                >
                                    <Text style={styles.description}>
                                        {benefit.description}
                                    </Text>
                                </Animated.View>
                            )}
                        </Animated.View>
                    );
                })}
            </View>
        </View>
    );
};

export default BenefitsSection;