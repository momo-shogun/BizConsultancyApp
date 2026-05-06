import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { THEME } from '@/constants/theme';
import {
  InterestEventsSection,
  SafeAreaWrapper,
  StatsSection,
  UpcomingBookingsSection,
  TopConsultantsSection,
  type EventSpotlightItem,
} from '@/shared/components';
import type { HomeCategoryId } from './ZeptoHS/ZeptoHS.types';
import { ZeptoHS } from './ZeptoHS/ZeptoHS';

const HOME_INTEREST_DEMO_ITEMS: EventSpotlightItem[] = [
  {
    id: 39,
    createdAt: '2026-02-25T10:42:32.000Z',
    updatedAt: '2026-04-28T06:40:36.000Z',
    name: 'Custom Food Packaging for FMCG & Startups From Plain Pouch to Brand Identity',
    slug: 'custom-food-packaging-for-fmcg-startups-from-plain-pouch-to',
    type: 'webinar',
    thumbnail:
      'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'The webinar is being organized by IID BIZ Consultancy - Your Business Success Partner.',
    highlightPoints:
      '\"[\\\\\" Understanding FMCG & Startup Packaging Needs\\\\\",\\\\\"From Plain Pouch To Custom Pack – Innovative Transformation In Packaging\\\\\",\\\\\"Packaging Materials & Food Safety For Handling\\\\\",\\\\\"How Packaging Plays A Vital Role In Branding And Visual Identity\\\\\",\\\\\"Sustainability & Eco-Friendly Packaging\\\\\",\\\\\"Know About Investment Requirement\\\\\",\\\\\"Machines And Equipments Required For Plant Setup\\\\\",\\\\\"Licenses And Approvals\\\\\"]\"',
    startDate: '2026-03-29',
    endDate: '2026-03-30',
    startTime: '16:00:00',
    endTime: '18:00:00',
    place: 'Online',
    contactNumber: '8400999175',
    onlineFee: '100.00',
    offlineFee: '0.00',
    externalUrlOnline: 'https://bizconsultancy.iid.org.in/workshops',
    workshopUrl:
      'https://bizconsultancy.iid.org.in/workshops/webinar-on-sanitary-pad-napkins-manufacturing-business',
    isOnlineAvailable: 1,
    isLiveWorkshop: 1,
    externalUrlOffline: '',
    mapLocation: '',
    segmentId: 2005,
    industryId: 171,
    status: 1,
    isDeleted: 0,
  },
  {
    id: 40,
    createdAt: '2026-03-02T09:10:12.000Z',
    updatedAt: '2026-04-28T06:40:36.000Z',
    name: 'Webinar: How to Build a Scalable Service Business (Operations + Pricing)',
    slug: 'webinar-how-to-build-a-scalable-service-business',
    type: 'webinar',
    thumbnail:
      'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'A practical session for founders to fix delivery, pricing, and growth loops.',
    highlightPoints: '\"[\\\\\"Pricing that scales\\\\\",\\\\\"Delivery SOPs\\\\\",\\\\\"Customer retention\\\\\"]\"',
    startDate: '2026-04-10',
    startTime: '11:00:00',
    endTime: '12:30:00',
    place: 'Online',
    onlineFee: '0.00',
    offlineFee: '0.00',
    workshopUrl: 'https://bizconsultancy.iid.org.in/workshops',
    isOnlineAvailable: 1,
    isLiveWorkshop: 1,
    externalUrlOnline: 'https://bizconsultancy.iid.org.in/workshops',
    externalUrlOffline: '',
    mapLocation: '',
    contactNumber: '8400999175',
    segmentId: 2005,
    industryId: 171,
    status: 1,
    isDeleted: 0,
  },
];

export function HomeDashboardScreen(): React.ReactElement {
  const onInterestViewAll = useCallback(() => {
    console.log('View all interests');
  }, []);

  const onBookingsViewAll = useCallback(() => {
    console.log('View all bookings');
  }, []);

  const onTopConsultantsViewAll = useCallback(() => {
    console.log('View all consultants');
  }, []);

  return (
    <SafeAreaWrapper edges={['top', 'bottom']}>
      <ZeptoHS
        header={{
          backgroundColor: '#E6C8A4',
          addressLabel: 'Business setup • Tap to update address',
          walletLabel: '₹0',
          onAddressPress: () => undefined,
          onWalletPress: () => undefined,
          onProfilePress: () => undefined,
        }}
      >
        {(_categoryId: HomeCategoryId) => (
          <View style={styles.sheet}>
            <InterestEventsSection
              items={HOME_INTEREST_DEMO_ITEMS}
              onViewAllPress={onInterestViewAll}
              onItemPress={(item: EventSpotlightItem) =>
                console.log('Workshop clicked', item.id, item.slug)
              }
            />
            {/* <StatsSection /> */}
            <UpcomingBookingsSection
              title="Upcoming bookings"
              items={[
                {
                  id: 'BCG99763',
                  dateLabel: '10/05/2026',
                  timeLabel: '11:00–11:30',
                  consultantName: 'Riya Sharma',
                  consultantTitle: 'Startup & Compliance Consultant',
                  callType: 'video',
                  statusLabel: 'Upcoming',
                },
                {
                  id: 'BCG99764',
                  dateLabel: '12/05/2026',
                  timeLabel: '16:00–16:30',
                  consultantName: 'Aman Verma',
                  consultantTitle: 'Funding & Pitch Advisor',
                  callType: 'audio',
                  statusLabel: 'Upcoming',
                },
              ]}
              onViewAllPress={onBookingsViewAll}
              onItemPress={(item) => console.log('Open booking', item.id)}
              onJoinCallPress={(item) => console.log('Join call', item.id)}
            />
            <TopConsultantsSection
              title="Top consultants"
              cardWidth={184}
              items={[
                {
                  id: 'consultant-lata-moorjani',
                  name: 'CA Lata Moorjani',
                  role: 'Business Analyst',
                  bio: 'Bringing over 5 years of rich experience to the table, I, C.A. Lata Moorjani stand out as a seasoned financial expert. I am a proficient financial advisor, leveraging my extensive knowledge to assist clients in making informed decisions. My strategic insights help individuals and businesses achieve their financial goals.',
                  specialty: 'Startup Nurturing & Funding',
                  experienceLabel: '5+ years',
                  rateLabel: '₹354',
                  photoUri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
                },
                {
                  id: 'consultant-aman-verma',
                  name: 'Aman Verma',
                  role: 'Funding & Pitch Advisor',
                  bio: 'Startup funding specialist with 8+ years helping founders raise seed to Series A rounds. Former VC analyst, now working directly with entrepreneurs.',
                  specialty: 'Funding & Pitch',
                  experienceLabel: '8+ years',
                  rateLabel: '₹499',
                  photoUri: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=80',
                },
              ]}
              onViewAllPress={onTopConsultantsViewAll}
              onItemPress={(item) => console.log('Open consultant', item.id)}
              onBookPress={(item) => console.log('Book consultation', item.id)}
            />
          </View>
        )}
      </ZeptoHS>
    </SafeAreaWrapper>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: THEME.colors.background,
    paddingTop: THEME.spacing[8],
    flexGrow: 1,
    gap: THEME.spacing[20],
  },
});
