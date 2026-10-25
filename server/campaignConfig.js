// Central configuration for BIRTHDAY SALE campaign
// Matches exact reference image: 9-segment wheel with discount amounts + 100% OFF (FREE)
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

  // 9-segment wheel configuration:
  // Segment 1: $200 OFF (18.0000%) -> Final Price $100
  // Segment 2: $180 OFF (22.0000%) -> Final Price $120
  // Segment 3: $150 OFF (28.0000%) -> Final Price $150
  // Segment 4: $100 OFF (9.5000%)  -> Final Price $200
  // Segment 5: $80 OFF  (9.0000%)  -> Final Price $220
  // Segment 6: $50 OFF  (5.0000%)  -> Final Price $250
  // Segment 7: $30 OFF  (2.9900%)  -> Final Price $270
  // Segment 8: $100 OFF (5.5000%)  -> Final Price $200
  // Segment 9: 100% OFF (0.0100%)  -> Final Price $0 (FREE Basic Portfolio package)
  // Total Probability = 100.000000%
  // Prize Hierarchy:
  // 1. $150 OFF: 28.00% (Highest)
  // 2. $180 OFF: 22.00% (Second highest)
  // 3. $200 OFF: 18.00% (Third highest)
  // 4. $100 OFF: 15.00% (Fourth highest: 9.50% + 5.50%)
  // 5. $80 OFF:   9.00% (Fifth highest)
  // 6. $50 OFF:   5.00% (Sixth highest)
  // 7. $30 OFF:   2.99% (Seventh highest)
  // 8. 100% OFF:  0.01% (FREE basic portfolio - exactly 0.01%)
  outcomes: [
    {
      id: 'disc_200',
      segmentNumber: 1,
      discount: 200,
      label: '$200 OFF',
      shortLabel: '$200',
      finalPrice: 100,
      probability: 0.18,
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
      probability: 0.22,
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
      probability: 0.28,
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
      probability: 0.095,
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
      probability: 0.09,
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
      probability: 0.0299,
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
      probability: 0.055,
      color: '#081226', // Deep Navy slice
      textColor: '#FFFFFF',
      description: '$100 discount applied to standard $300 package (Segment 8)'
    },
    {
      id: 'disc_free',
      segmentNumber: 9,
      discount: 300,
      label: '100% OFF (FREE)',
      shortLabel: 'FREE',
      subLabel: '100% OFF',
      finalPrice: 0,
      isFree: true,
      probability: 0.0001, // 0.01% real probability
      color: '#0284C7', // Distinctive electric cyan-blue slice
      textColor: '#FFFFFF',
      description: '100% OFF Basic Portfolio Website package ($300 value)'
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
    ],
    freePrizeScope: {
      title: '100% OFF (FREE) Basic Portfolio Package Scope',
      description: 'The 100% OFF prize covers a complete, production-ready Basic Portfolio Website (single-page / 3 core sections: Hero introduction, Projects showcase, Contact/social links) completely free ($0 final price against the standard $300 package price, with $300 savings). It covers responsive design and deployment assistance. Additional multi-page expansions, backend databases, or third-party paid subscriptions are not included.'
    }
  }
};
