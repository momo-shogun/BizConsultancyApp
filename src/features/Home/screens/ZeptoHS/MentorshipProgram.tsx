import React, { useMemo } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

type MentorshipItem = {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
  description: string;
  category: {
    id: number;
    name: string;
    slug: string;
  };
};

type Props = {
  backgroundColor?: string;
  accentColor?: string;
  data?: MentorshipItem[];
};

/* -------------------------------------------------------------------------- */
/*                                  DUMMY DATA                                */
/* -------------------------------------------------------------------------- */

const DUMMY_DATA: MentorshipItem[] = [
  {
    id: 1,
    name: 'Energy and Fuel',
    slug: 'energy-and-fuel',
    thumbnail:
      'https://images.unsplash.com/photo-1513828583688-c52646db42da?q=80&w=1200&auto=format&fit=crop',
    description:
      'Mentorship for petroleum, gas, energy operations and industrial growth strategies.',
    category: {
      id: 1,
      name: 'Industrial',
      slug: 'industrial',
    },
  },

  {
    id: 2,
    name: 'Manufacturing Excellence',
    slug: 'manufacturing',
    thumbnail:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop',
    description:
      'Learn scaling, automation and operational efficiency from manufacturing leaders.',
    category: {
      id: 1,
      name: 'Industrial',
      slug: 'industrial',
    },
  },

  {
    id: 3,
    name: 'Social Enterprises & CSR Funding',
    slug: 'social-enterprises-csr-funding',
    thumbnail:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop',
    description:
      'Guidance for NGOs, CSR initiatives and social impact funding opportunities.',
    category: {
      id: 2,
      name: 'Professional',
      slug: 'professional',
    },
  },

  {
    id: 4,
    name: 'Business Consulting',
    slug: 'business-consulting',
    thumbnail:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop',
    description:
      'Connect with experienced consultants for strategy, finance and growth planning.',
    category: {
      id: 2,
      name: 'Professional',
      slug: 'professional',
    },
  },

  {
    id: 5,
    name: 'Startup Fundraising',
    slug: 'startup-fundraising',
    thumbnail:
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1200&auto=format&fit=crop',
    description:
      'Learn investor pitching, fundraising and startup scaling from founders and VCs.',
    category: {
      id: 3,
      name: 'Startup',
      slug: 'startup',
    },
  },

  {
    id: 6,
    name: 'Product & UX Mentorship',
    slug: 'product-ux',
    thumbnail:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
    description:
      'Get mentorship in product strategy, user experience and digital innovation.',
    category: {
      id: 3,
      name: 'Startup',
      slug: 'startup',
    },
  },
];

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

export function MentorshipProgram({
  backgroundColor = '#F8FAFC',
  accentColor = '#2563EB',
  data = DUMMY_DATA,
}: Props) {
  const groupedData = useMemo(() => {
    const map: Record<string, MentorshipItem[]> = {};

    data.forEach(item => {
      const key = item.category?.name ?? 'Other';

      if (!map[key]) {
        map[key] = [];
      }

      map[key].push(item);
    });

    return Object.entries(map);
  }, [data]);

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor },
      ]}
      contentContainerStyle={
        styles.contentContainer
      }
      showsVerticalScrollIndicator={false}
    >
      {/* HERO */}
      <LinearGradient
        colors={[
          'rgba(37,99,235,0.14)',
          'rgba(14,165,233,0.04)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Text
          style={[
            styles.eyebrow,
            { color: accentColor },
          ]}
        >
          MENTORSHIP PROGRAM
        </Text>

        <Text style={styles.title}>
          Learn from{'\n'}
          <Text style={styles.titleAccent}>
            Industry Experts
          </Text>
        </Text>

        <Text style={styles.subtitle}>
          Personalized mentorship across
          industries to help you scale,
          grow and innovate faster.
        </Text>

        <View style={styles.heroPills}>
          <View style={styles.heroPill}>
            <Text style={styles.heroPillEmoji}>
              🚀
            </Text>

            <Text style={styles.heroPillText}>
              Startup Growth
            </Text>
          </View>

          <View style={styles.heroPill}>
            <Text style={styles.heroPillEmoji}>
              🎯
            </Text>

            <Text style={styles.heroPillText}>
              1:1 Guidance
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* CATEGORY SECTIONS */}
      {groupedData.map(([category, items]) => {
        return (
          <View
            key={category}
            style={styles.section}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {category}
              </Text>

              <View style={styles.sectionLine} />
            </View>

            <FlatList
              horizontal
              data={items}
              keyExtractor={item =>
                item.id.toString()
              }
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.horizontalList
              }
              renderItem={({ item }) => {
                return (
                  <View style={styles.card}>
                    {/* IMAGE */}
                    <View style={styles.imageWrap}>
                      <Image
                        source={{
                          uri: item.thumbnail,
                        }}
                        style={styles.image}
                        resizeMode="cover"
                      />

                      <LinearGradient
                        colors={[
                          'transparent',
                          'rgba(15,23,42,0.65)',
                        ]}
                        style={
                          styles.imageOverlay
                        }
                      />

                      <View
                        style={
                          styles.floatingBadge
                        }
                      >
                        <Text
                          style={
                            styles.floatingBadgeText
                          }
                        >
                          Expert Mentors
                        </Text>
                      </View>
                    </View>

                    {/* CONTENT */}
                    <View style={styles.cardBody}>
                      <Text
                        numberOfLines={2}
                        style={styles.cardTitle}
                      >
                        {item.name}
                      </Text>

                      <Text
                        numberOfLines={3}
                        style={
                          styles.cardDescription
                        }
                      >
                        {item.description}
                      </Text>

                      <View
                        style={styles.cardFooter}
                      >
                        <View style={styles.tag}>
                          <Text
                            style={styles.tagText}
                          >
                            {
                              item.category
                                .slug
                            }
                          </Text>
                        </View>

                        <View
                          style={
                            styles.arrowWrap
                          }
                        >
                          <Text
                            style={styles.arrow}
                          >
                            →
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        );
      })}
    </ScrollView>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   STYLES                                   */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  contentContainer: {
    paddingBottom: 40,
  },

  hero: {
    margin: 14,
    borderRadius: 28,
    padding: 20,
    overflow: 'hidden',
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 10,
  },

  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
    color: '#0F172A',
  },

  titleAccent: {
    color: '#2563EB',
  },

  subtitle: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 22,
    color: '#475569',
    paddingRight: 20,
  },

  heroPills: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },

  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      'rgba(255,255,255,0.7)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    gap: 6,
  },

  heroPillEmoji: {
    fontSize: 14,
  },

  heroPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },

  section: {
    marginTop: 18,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },

  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor:
      'rgba(15,23,42,0.08)',
    marginLeft: 12,
  },

  horizontalList: {
    paddingLeft: 16,
    paddingRight: 4,
  },

  card: {
    width: 260,
    marginRight: 14,
    borderRadius: 24,
    backgroundColor: 'white',
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 4,
  },

  imageWrap: {
    height: 150,
    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  imageOverlay: {
    ...StyleSheet.absoluteFill,
  },

  floatingBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor:
      'rgba(255,255,255,0.92)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  floatingBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0F172A',
  },

  cardBody: {
    padding: 16,
  },

  cardTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    color: '#0F172A',
  },

  cardDescription: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 20,
    color: '#64748B',
    minHeight: 58,
  },

  cardFooter: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  tag: {
    backgroundColor:
      'rgba(37,99,235,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },

  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
    textTransform: 'capitalize',
  },

  arrowWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  arrow: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});