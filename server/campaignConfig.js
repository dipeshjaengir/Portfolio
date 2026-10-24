// Central configuration for BIRTHDAY SALE campaign
// Matches exact reference image: 8-segment wheel with discount amounts
export const CAMPAIGN_CONFIG = {
  name: 'BIRTHDAY SALE',
  timezone: 'Asia/Kolkata',
  // 26 October 2026, 12:00 AM IST
  startTimestamp: new Date('2026-10-26T00:00:00+05:30').getTime(),
  // 2 November 2026, 12:00 AM IST
  endTimestamp: new Date('2026-11-02T00:00:00+05:30').getTime(),
  standardPrice: 300,
  offerValidityDays: 7,
  inquiryEmail: 'dipeshjangir12@gmail.com',
  instagramUrl: 'https://www.instagram.com/_dipesh2.0/',

  // Exact 8-segment wheel configuration matching reference image & probability table:
  // Segment 1: $200 OFF (25%) -> Final Price $100 (Highest probability outcome)
  // Segment 2: $180 OFF (20%) -> Final Price $120
  // Segment 3: $150 OFF (18%) -> Final Price $150
  // Segment 4: $100 OFF (17%) -> Final Price $200
  // Segment 5: $80 OFF (8%)   -> Final Price $220
  // Segment 6: $50 OFF (5%)   -> Final Price $250
  // Segment 7: $30 OFF (4%)   -> Final Price $270
  // Segment 8: $100 OFF (3%)  -> Final Price $200
  // Total Probability = 100%
  outcomes: [
    {
      id: 'disc_200',
      segmentNumber: 1,
      discount: 200,
      label: '$200 OFF',
      shortLabel: '$200',
      finalPrice: 100,
      probability: 0.25,
      color: '#1D75F2', // Electric Blue slice
      textColor: '#FFFFFF',
      description: '$200 discount applied to standard $300 package'
    },
    {
      id: 'disc_180',
      segmentNumber: 2,
      discount: 180,
      label: '$180 OFF',
      shortLabel: '$180',
      finalPrice: 120,
      probability: 0.20,
      color: '#081226', // Deep Navy slice
      textColor: '#FFFFFF',
      description: '$180 discount applied to standard $300 package'
    },
    {
      id: 'disc_150',
      segmentNumber: 3,
      discount: 150,
      label: '$150 OFF',
      shortLabel: '$150',
      finalPrice: 150,
      probability: 0.18,
      color: '#1D75F2', // Electric Blue slice
      textColor: '#FFFFFF',
      description: '$150 discount applied to standard $300 package'
    },
    {
      id: 'disc_100_a',
      segmentNumber: 4,
      discount: 100,
      label: '$100 OFF',
      shortLabel: '$100',
      finalPrice: 200,
      probability: 0.17,
      color: '#081226', // Deep Navy slice
      textColor: '#FFFFFF',
      description: '$100 discount applied to standard $300 package'
    },
    {
      id: 'disc_80',
      segmentNumber: 5,
      discount: 80,
      label: '$80 OFF',
      shortLabel: '$80',
      finalPrice: 220,
      probability: 0.08,
      color: '#1D75F2', // Electric Blue slice
      textColor: '#FFFFFF',
      description: '$80 discount applied to standard $300 package'
    },
    {
      id: 'disc_50',
      segmentNumber: 6,
      discount: 50,
      label: '$50 OFF',
      shortLabel: '$50',
      finalPrice: 250,
      probability: 0.05,
      color: '#081226', // Deep Navy slice
      textColor: '#FFFFFF',
      description: '$50 discount applied to standard $300 package'
    },
    {
      id: 'disc_30',
      segmentNumber: 7,
      discount: 30,
      label: '$30 OFF',
      shortLabel: '$30',
      finalPrice: 270,
      probability: 0.04,
      color: '#1D75F2', // Electric Blue slice
      textColor: '#FFFFFF',
      description: '$30 discount applied to standard $300 package'
    },
    {
      id: 'disc_100_b',
      segmentNumber: 8,
      discount: 100,
      label: '$100 OFF',
      shortLabel: '$100',
      finalPrice: 200,
      probability: 0.03,
      color: '#081226', // Deep Navy slice
      textColor: '#FFFFFF',
      description: '$100 discount applied to standard $300 package (Segment 8)'
    }
  ],

  packageScope: {
    standardPrice: 300,
    included: [
      'Custom Responsive Portfolio Website (Desktop + Mobile)',
      'Modern UI/UX with Smooth Animations & Transitions',
      'Contact Form Integration & Social Links',
      'SEO Basics, Fast Performance & Asset Optimization',
      'Free Deployment Assistance (Vercel / Netlify / Custom Domain)',
      '14 Days Post-Launch Support & Bug Fixes'
    ],
    excluded: [
      'Custom Domain registration fees (paid directly to registrar)',
      'Third-party paid API subscriptions or premium SaaS keys',
      'Complex multi-tier backend architectures or external databases outside standard scope'
    ]
  }
};
