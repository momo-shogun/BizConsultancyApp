/**
 * User guide content — mirrors biz_consultancy_portal `app/user/user-guide/page.tsx`.
 * Portal route has no backend API; data is served statically on the web client.
 */

export interface UserGuideVideo {
  id: number;
  title: string;
  link: string;
}

export interface UserGuideFaqItem {
  id: string;
  q: string;
  lines: string[];
}

export const USER_GUIDE_VIDEOS: UserGuideVideo[] = [
  { id: 1, title: 'Slot Booking', link: 'https://youtu.be/MspWCkzzbD8' },
  { id: 2, title: 'Expertise Add', link: 'https://youtu.be/jUzPpNzPNrE' },
  { id: 3, title: 'Consultant Login', link: 'https://youtu.be/6hhXtS-aDA0' },
  { id: 4, title: 'User Login', link: 'https://youtu.be/neFKw7fvdP0' },
  {
    id: 5,
    title: 'Locker Creation and Document Upload',
    link: 'https://youtu.be/w8wv9vBtH9k',
  },
  { id: 6, title: 'Profile Creation', link: 'https://www.youtube.com/watch?v=IQCVW3PgS2U' },
  { id: 7, title: 'Document Sharing', link: 'https://www.youtube.com/watch?v=KHPBr4IxE10' },
];

export const USER_GUIDE_FAQ_ITEMS: UserGuideFaqItem[] = [
  {
    id: 'faq-1',
    q: 'How to become a User on Biz Consultancy?',
    lines: [
      'For Login as User, follow these steps:',
      'By OTP:',
      'Download the App from Play Store.',
      'Fill mobile number in the box.',
      'Click on Continue.',
      'Wait for OTP from SAM-IID, fill it manually or grant permission to auto-fill.',
      'Fill your Name and Password, then click on Register.',
      'Now you are on the home page of Biz Consultancy.',
      'By Password:',
      'Download the App from Play Store.',
      'You can log in by password by choosing "Login by Password".',
      'Fill mobile number in the box.',
      'Fill your Password, then click on Continue.',
      'Now you are on the home page of Biz Consultancy.',
    ],
  },
  {
    id: 'faq-2',
    q: 'How to become a Consultant on Biz Consultant?',
    lines: [
      'Follow these steps to get started:',
      'Download the App from Play Store.',
      'Allow the required permissions.',
      'Swipe left to get started.',
      'Fill mobile number in the box, then click on Sign Up.',
      'Fill the OTP, then click on Submit.',
      'Now you are on the home page of Biz Consultant.',
    ],
  },
  {
    id: 'faq-3',
    q: 'How to create profile on Biz Consultant?',
    lines: [
      'Follow these steps to log in as a Consultant:',
      'Download the App from Play Store.',
      'Login by OTP and go to the home page.',
      'On the right side, tap My Profile, then select My Profile.',
      'To update your profile picture, tap on the profile picture, select and upload an image.',
      'Fill in the required details and save them.',
      'Now you are logged in as a Consultant.',
    ],
  },
  {
    id: 'faq-4',
    q: 'How to add your expertise as Expert on Biz Consultant?',
    lines: [
      'Follow these steps to add expertise:',
      'Download the App from Play Store.',
      'Login by OTP and go to the home page.',
      'Tap on Dashboard and select Add Expertise.',
      'Tap Add New on the right corner.',
      'Now there are three options available: Select Type, Sector, and Industry.',
      'You can also add multiple sectors and industries.',
    ],
  },
  {
    id: 'faq-5',
    q: 'How to add slot for users on Biz Consultant?',
    lines: [
      'Follow these steps to schedule your timing:',
      'Download the App from Play Store.',
      'Login by OTP and go to the home page.',
      'Tap on Dashboard and select Schedule Timing.',
      'Tap Add New on the right corner.',
      'You can add a slot by choosing Start Time and End Time, along with A.M. and P.M.',
      'Now, users can book your consultancy by choosing your available time slot.',
    ],
  },
  {
    id: 'faq-6',
    q: 'How to create document locker and upload document?',
    lines: [
      'Follow these steps to use My Locker:',
      'Download the App from Play Store.',
      'Login by OTP and go to the home page.',
      'Choose My Locker from the main menu.',
      'In Select Category, select Company Type and enter the name, then create.',
      'Now, look for your entity name, tap the three dots on the right-hand side, choose Create Folder, and upload documents.',
      'You can now choose the Document Name and Type.',
      'You can upload the desired document by name.',
    ],
  },
  {
    id: 'faq-7',
    q: 'How to share document with Expert?',
    lines: [
      'Follow these steps to share a document:',
      'In Document Locker, open the desired folder, tap the three dots, and select Share Documents.',
      'A list of experts will appear. Search for the desired expert and share the document.',
      'The expert can now view your document.',
    ],
  },
];

/** Accent colors for video index badges (visual variety only). */
export const USER_GUIDE_VIDEO_ACCENTS: readonly string[] = [
  '#2563EB',
  '#10B981',
  '#3B82F6',
  '#8B5CF6',
  '#F97316',
  '#14B8A6',
  '#0D9488',
] as const;
