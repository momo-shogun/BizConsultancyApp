export interface ServicePageRef {
  title: string;
  slug: string;
  showInSuggestions: boolean;
}

export interface ServicesSubCategory {
  name: string;
  slug: string;
  pages: ServicePageRef[];
}

export interface ServicesTopCategory {
  name: string;
  slug: string;
  subCategories: ServicesSubCategory[];
  otherPages: ServicePageRef[];
}

export interface ServicesCategoryTree {
  categories: ServicesTopCategory[];
}

export const SERVICES_CATEGORY_TREE: ServicesCategoryTree = {
  categories: [
    {
      name: 'Registration & Licenses',
      slug: 'registration-licenses',
      subCategories: [
        {
          name: 'Company Registration',
          slug: 'company-registration',
          pages: [
            {
              title: 'Private Limited Company Incorporation',
              slug: 'private-limited-company-incorporation',
              showInSuggestions: false,
            },
            {
              title: 'Digital Signature Certificate',
              slug: 'digital-signature-certificate',
              showInSuggestions: false,
            },
            {
              title: 'Farmer Producer Company ',
              slug: 'farmer-producer-company',
              showInSuggestions: false,
            },
            {
              title: 'One Person Company (OPC)',
              slug: 'one-person-company-opc',
              showInSuggestions: false,
            },
            {
              title: 'Startup ',
              slug: 'startup',
              showInSuggestions: false,
            },
            {
              title: 'Public Limited Company',
              slug: 'public-limited-company',
              showInSuggestions: false,
            },
            {
              title: 'Section 8 Company',
              slug: 'section-8-company',
              showInSuggestions: false,
            },
            {
              title: 'Limited Liability Partnership',
              slug: 'limited-liability-partnership',
              showInSuggestions: false,
            },
          ],
        },
        {
          name: 'Licenses & Approvals',
          slug: 'licenses-approvals',
          pages: [
            {
              title: 'Import Export Code',
              slug: 'import-export-code',
              showInSuggestions: false,
            },
            {
              title: 'Good Manufacturing Practice(GMP) Registration',
              slug: 'good-manufacturing-practicegmp-registration',
              showInSuggestions: false,
            },
            {
              title: 'TAN Registration',
              slug: 'tan-registration',
              showInSuggestions: false,
            },
            {
              title: 'PAN Registration',
              slug: 'pan-registration',
              showInSuggestions: false,
            },
            {
              title: 'GST Registration',
              slug: 'gst-registration',
              showInSuggestions: false,
            },
            {
              title: 'APEDA',
              slug: 'apeda',
              showInSuggestions: false,
            },
            {
              title: 'FIEO-RCMC',
              slug: 'fieo-rcmc',
              showInSuggestions: false,
            },
            {
              title: 'FSSAI Annual Return',
              slug: 'fssai-annual-return',
              showInSuggestions: false,
            },
            {
              title: 'FSSAI Central License ',
              slug: 'fssai-central-license',
              showInSuggestions: false,
            },
            {
              title: 'FSSAI Registration',
              slug: 'fssai-registration',
              showInSuggestions: false,
            },
            {
              title: 'Udyam Registration',
              slug: 'udyam-registration',
              showInSuggestions: false,
            },
            {
              title: 'Shop and Establishment Act ',
              slug: 'shop-and-establishment-act',
              showInSuggestions: false,
            },
            {
              title: 'Trademark Registration',
              slug: 'trademark-registration',
              showInSuggestions: false,
            },
            {
              title: 'FSSAI State License ',
              slug: 'fssai-state-license',
              showInSuggestions: false,
            },
          ],
        },
        {
          name: 'Company Registration Changes',
          slug: 'company-registration-changes',
          pages: [
            {
              title: 'Company Name Change',
              slug: 'company-name-change',
              showInSuggestions: false,
            },
            {
              title: 'Company Registered Office Change',
              slug: 'company-registered-office-change',
              showInSuggestions: false,
            },
            {
              title: 'Company Registration Changes Package ',
              slug: 'company-registration-changes-package',
              showInSuggestions: false,
            },
            {
              title: 'Changes in Directorship (Appointment or Resignation)',
              slug: 'changes-in-directorship-appointment-or-resignation',
              showInSuggestions: false,
            },
            {
              title: 'Director Removal',
              slug: 'director-removal',
              showInSuggestions: false,
            },
            {
              title: 'Capital Modification Package',
              slug: 'capital-modification-package',
              showInSuggestions: false,
            },
            {
              title: 'Changes In Directorship',
              slug: 'changes-in-directorship',
              showInSuggestions: false,
            },
            {
              title: 'Compnay MOA & AOA Changes',
              slug: 'compnay-moa-aoa-changes',
              showInSuggestions: false,
            },
          ],
        },
      ],
      otherPages: [],
    },
    {
      name: 'Tax & Compliance',
      slug: 'tax-compliance',
      subCategories: [
        {
          name: 'ROC & Company Law ',
          slug: 'roc-company-law',
          pages: [
            {
              title: 'Annual Compliance',
              slug: 'annual-compliance',
              showInSuggestions: false,
            },
            {
              title: 'Post Incorporation Compliances',
              slug: 'post-incorporation-compliances',
              showInSuggestions: false,
            },
          ],
        },
        {
          name: 'GST Compliances ',
          slug: 'gst-compliances',
          pages: [
            {
              title: 'GSTR-9',
              slug: 'gstr-9',
              showInSuggestions: false,
            },
            {
              title: 'LUT Filing',
              slug: 'lut-filing',
              showInSuggestions: false,
            },
            {
              title: 'ITC Reconciliation',
              slug: 'itc-reconciliation',
              showInSuggestions: false,
            },
          ],
        },
        {
          name: 'Income Tax Compliances',
          slug: 'income-tax-compliances',
          pages: [
            {
              title: 'TDS Return Filing',
              slug: 'tds-return-filing',
              showInSuggestions: false,
            },
            {
              title: 'TCS Return Filing',
              slug: 'tcs-return-filing',
              showInSuggestions: false,
            },
          ],
        },
      ],
      otherPages: [],
    },
    {
      name: 'Growth Gear ',
      slug: 'growth-gear',
      subCategories: [
        {
          name: 'Virtual CFO ',
          slug: 'virtual-cfo',
          pages: [
            {
              title: 'Virtual CFO',
              slug: 'virtual-cfo',
              showInSuggestions: false,
            },
          ],
        },
        {
          name: 'Digital Marketing Services',
          slug: 'digital-marketing-services',
          pages: [
            {
              title: 'Digital Marketing Package',
              slug: 'digital-markeing-package',
              showInSuggestions: false,
            },
            {
              title: 'Search Engine Optimization Services',
              slug: 'search-engine-optimization-services',
              showInSuggestions: false,
            },
            {
              title: 'Social Media Marketing Service (SMM)',
              slug: 'social-media-marketing-service-smm',
              showInSuggestions: false,
            },
            {
              title: 'Social Media Optimization Services',
              slug: 'social-media-optimization-services',
              showInSuggestions: false,
            },
          ],
        },
        {
          name: 'IT services',
          slug: 'it-services',
          pages: [
            {
              title: 'IT Service',
              slug: 'it-service',
              showInSuggestions: false,
            },
          ],
        },
        {
          name: 'NGO Support Pack',
          slug: 'ngo-support-pack',
          pages: [
            {
              title: 'NGO Support Pack',
              slug: 'ngo-support-pack',
              showInSuggestions: false,
            },
            {
              title: '12A & 80G APPLICATION',
              slug: '12a-80g-application',
              showInSuggestions: false,
            },
            {
              title: 'Trust Registration',
              slug: 'trust-registration',
              showInSuggestions: false,
            },
          ],
        },
      ],
      otherPages: [],
    },
  ],
};
