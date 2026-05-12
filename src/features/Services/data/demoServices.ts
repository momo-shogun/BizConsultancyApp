import type { RecommendedServiceItem } from '@/shared/components';

export const DEMO_SERVICES: any[] = [
  {
    id: "sd",

    slug: 'private-limited-company-incorporation',

    title: 'Private Limited Company Incorporation',

    summary:
      'Get your Private Limited Company registered with complete expert assistance.',

    headerRight: '8–10 Days',

    badgeLabel: 'Popular',

    categoryLabel: 'Business Incorporation',

    priceLabel: '₹10,500',

    hero: {
      title:
        'Register Your Private Limited Company with IID Biz Consultancy',

      subtitle:
        'Get a fully compliant, investor ready private limited company without visiting any office.',

      formHeading:
        'Get a fully compliant, investor ready private limited company without visiting any office.',

      features: [
        {
          icon: 'CheckCircle2',

          text: 'Fast: Incorporation in as little as 8–10 working days',

          color: '',
        },

        {
          icon: 'CheckCircle2',

          text: 'Expert-Handled: Professional backed Drafting and filing with RoC done for you',

          color: '',
        },

        {
          icon: 'CheckCircle2',

          text: 'Transparent Pricing: Fixed packages with no surprise costs',

          color: '',
        },
      ],

      quickActions: [
        {
          href: '',

          icon: 'FileText',

          text: 'Get Started',
        },

        {
          href: '',

          icon: 'FileText',

          text: 'Talk to an Expert',
        },
      ],
    },

    about: {
      badge: 'About this service',

      titleSegments: [
        {
          type: 'plain',

          value: 'What is',
        },

        {
          type: 'highlight',

          color: 'orange',

          value: 'Private Limited',
        },

        {
          type: 'plain',

          value: 'Company Registration?',
        },
      ],

      taglineSegments: [
        {
          type: 'plain',

          value:
            'It is one of the most trusted and scalable business structures in India.',
        },
      ],

      paragraphsSegments: [
        {
          segments: [
            {
              type: 'plain',

              value:
                'Private Limited Company registration is the legal process of incorporating a company under the Companies Act, 2013.',
            },
          ],
        },

        {
          segments: [
            {
              type: 'plain',

              value:
                'A Private Limited Company is a separate legal entity offering limited liability protection.',
            },
          ],
        },
      ],
    },

    idealFor: {
      titleSegments: [
        {
          type: 'plain',
          value: 'Who Is This',
        },

        {
          type: 'highlight',
          color: 'blue',
          value: 'Ideal For?',
        },
      ],

      items: [
        {
          image:
            'https://biz-consultancy-sigma.vercel.app/service/12553960_4963914.jpg',

          title: 'Founders & Startups',

          description:
            'Individuals starting a new business who need a legally recognized structure to grow and raise funds.',
        },

        {
          image:
            'https://biz-consultancy-sigma.vercel.app/service/5597691_56632.jpg',

          title: 'Small & Medium Enterprises (SMEs)',

          description:
            'Growing businesses that require formal registration for compliance, credibility, and expansion.',
        },

        {
          image:
            'https://biz-consultancy-sigma.vercel.app/service/6438019_3279765.jpg',

          title: 'Professionals & Consultants',

          description:
            'Service providers who want a legal entity to sign contracts, invoice clients, and limit personal liability.',
        },
      ],
    },

    ourPackage: {
      sectionTitle: 'Our Packages',

      items: [
        {
          icon: 'fileText',

          title: 'Support Included',

          status: 'completed',

          category: 'Support',

          details: [
            'End-to-end filing',

            'Professional consultation',

            'Compliance guidance',
          ],
        },

        {
          icon: 'award',

          title: 'Deliverables',

          status: 'completed',

          category: 'Deliverables',

          details: [
            'Certificate of Incorporation',

            'PAN & TAN',

            'MOA & AOA',

            'DIN & DSC',
          ],
        },
      ],
    },

    process: {
      title: 'How the Process Works',

      steps: [
        {
          number: '1',

          title: 'Order Placement',

          description:
            'Book the service and submit your details.',
        },

        {
          number: '2',

          title: 'Document Verification',

          description:
            'We verify your documents for MCA compliance.',
        },

        {
          number: '3',

          title: 'Company Name Approval',

          description:
            'We submit your company name for approval.',
        },

        {
          number: '4',

          title: 'Company Incorporation',

          description:
            'SPICe+ filing and incorporation completion.',
        },
      ],
    },

    documents: {
      categories: [
        {
          title: 'For Directors',

          documents: [
            'PAN Card',

            'Aadhaar Card',

            'Address Proof',

            'Photograph',
          ],
        },

        {
          title: 'Registered Office',

          subtitle: 'Office proof',

          documents: [
            'Utility Bill',

            'Rent Agreement',

            'NOC',
          ],
        },
      ],
    },

    benefits: {
      items: [
        {
          title: 'Limited liability',

          description:
            'Protects shareholders from personal liability.',
        },

        {
          title: 'Higher credibility',

          description:
            'Builds trust with banks and investors.',
        },

        {
          title: 'Easy funding',

          description:
            'Enables raising capital through shares.',
        },
      ],
    },

    eligibility: {
      items: [
        {
          icon: 'Users',

          title: 'Members',

          description:
            'Minimum 2 members required.',
        },

        {
          icon: 'LuBuilding2',

          title: 'Directors',

          description:
            'Minimum 2 directors required.',
        },
      ],
    },

    compliance: {
      items: [
        'Open current account',

        'Maintain statutory registers',

        'Annual ROC filings',

        'Board meetings',
      ],
    },

    faqs: {
      faqs: [
        {
          question:
            'What is a Private Limited Company?',

          answer:
            'A registered business entity under Companies Act, 2013.',
        },

        {
          question:
            'How long does registration take?',

          answer:
            'Usually 8–10 working days.',
        },

        {
          question:
            'Is GST mandatory after incorporation?',

          answer:
            'Only if turnover threshold is crossed.',
        },
      ],
    },
  },
  {
    id: 'svc-gst',
    slug: 'gst-registration',
    headerRight: '2–4 weeks',
    categoryLabel: 'Tax & compliance',
    title: 'GST Registration',
    summary:
      'Get GSTIN for your business with document prep and compliance hand-holding from day one.',
    badgeLabel: 'ourPackage',
    priceLabel: 'From ₹1,499',
    headerStyleIndex: 1,
  },
  {
    id: 'svc-tm',
    slug: 'trademark-registration',
    headerRight: 'MCA ready',
    categoryLabel: 'IP & legal',
    title: 'Trademark Registration',
    summary:
      'Protect your brand with search, filing, and expert follow-up through registration.',
    badgeLabel: 'Trending',
    priceLabel: 'From ₹5,999',
    headerStyleIndex: 2,
  },
];