/**
 * MOCK API ADAPTER (LEARNING & DEMO FALLBACK)
 * Status: Clearly labelled and OFF by default.
 * Engaged when `useUIStore.getState().isMockApi` is explicitly toggled true.
 */

import { ROLES } from '../contracts/rbac';

const MOCK_USERS = {
  'superadmin@vrumm.dev': {
    id: 'mock-usr-superadmin',
    email: 'superadmin@vrumm.dev',
    displayName: 'Super Admin',
    role: ROLES.SUPER_ADMIN,
    phone: '+919999900001',
  },
  'ops@vrumm.dev': {
    id: 'mock-usr-ops',
    email: 'ops@vrumm.dev',
    displayName: 'Ops Agent',
    role: ROLES.OPERATIONS,
    phone: '+919999900002',
  },
  'support@vrumm.dev': {
    id: 'mock-usr-support',
    email: 'support@vrumm.dev',
    displayName: 'Support Agent',
    role: ROLES.SUPPORT,
    phone: '+919999900003',
  },
  'finance@vrumm.dev': {
    id: 'mock-usr-finance',
    email: 'finance@vrumm.dev',
    displayName: 'Finance Agent',
    role: ROLES.FINANCE,
    phone: '+919999900004',
  },
  'marketing@vrumm.dev': {
    id: 'mock-usr-marketing',
    email: 'marketing@vrumm.dev',
    displayName: 'Marketing Agent',
    role: ROLES.MARKETING,
    phone: '+919999900005',
  },
  'compliance@vrumm.dev': {
    id: 'mock-usr-compliance',
    email: 'compliance@vrumm.dev',
    displayName: 'Compliance Agent',
    role: ROLES.COMPLIANCE,
    phone: '+919999900006',
  },
};

let MOCK_BOOKINGS = [
  {
    _id: '65f01a0123456789012345a1',
    idempotencyKey: 'idem_mumbai_001',
    vehicleType: 'BIKE',
    mode: 'INSTANT',
    status: 'ACTIVE', // Display as ACTIVE (IN_PROGRESS)
    pickup: {
      address: 'Linking Road, Bandra West, Mumbai 400050',
      location: { type: 'Point', coordinates: [72.833, 19.06] },
    },
    drop: {
      address: 'G-Block, BKC, Bandra East, Mumbai 400051',
      location: { type: 'Point', coordinates: [72.868, 19.066] },
    },
    fareSnapshot: {
      totalPaise: 9500, // ₹95.00
      breakdown: { basePaise: 3000, distancePaise: 5000, timePaise: 1500, taxesPaise: 0 },
      fareConfigVersion: 3,
      fareConfigId: '65f0fare0003',
      distanceMetres: 4800,
      distanceMethod: 'haversine',
    },
    userId: { email: 'aarav.patel@example.com', displayName: 'Aarav Patel' },
    customerPhone: '+919876500001',
    captainId: { displayName: 'Suresh Kamble', phone: '+919820011111', vehicleNumber: 'MH02BZ4921' },
    timeline: [
      { status: 'SEARCHING', at: '2026-10-30T05:30:00.000Z' },
      { status: 'ACCEPTED', at: '2026-10-30T05:30:14.000Z' },
      { status: 'ARRIVED', at: '2026-10-30T05:33:00.000Z' },
      { status: 'IN_PROGRESS', at: '2026-10-30T05:34:20.000Z' },
    ],
    createdAt: '2026-10-30T05:30:00.000Z',
  },
  {
    _id: '65f01a0123456789012345a2',
    idempotencyKey: 'idem_mumbai_002',
    vehicleType: 'AUTO',
    mode: 'INSTANT',
    status: 'COMPLETED',
    pickup: {
      address: 'Andheri East Metro Station, Mumbai 400069',
      location: { type: 'Point', coordinates: [72.857, 19.119] },
    },
    drop: {
      address: 'Hiranandani Gardens, Powai, Mumbai 400076',
      location: { type: 'Point', coordinates: [72.905, 19.119] },
    },
    fareSnapshot: {
      totalPaise: 14500, // ₹145.00
      breakdown: { basePaise: 4000, distancePaise: 8500, timePaise: 2000, taxesPaise: 0 },
      fareConfigVersion: 3,
      fareConfigId: '65f0fare0003',
      distanceMetres: 6200,
      distanceMethod: 'haversine',
    },
    userId: { email: 'neha.sharma@example.com', displayName: 'Neha Sharma' },
    customerPhone: '+919876500002',
    captainId: { displayName: 'Ganesh More', phone: '+919820022222', vehicleNumber: 'MH03CP1088' },
    timeline: [
      { status: 'SEARCHING', at: '2026-10-30T05:00:00.000Z' },
      { status: 'ACCEPTED', at: '2026-10-30T05:00:18.000Z' },
      { status: 'ARRIVED', at: '2026-10-30T05:04:00.000Z' },
      { status: 'IN_PROGRESS', at: '2026-10-30T05:05:10.000Z' },
      { status: 'COMPLETED', at: '2026-10-30T05:24:00.000Z' },
    ],
    createdAt: '2026-10-30T05:00:00.000Z',
  },
  {
    _id: '65f01a0123456789012345a3',
    idempotencyKey: 'idem_mumbai_003',
    vehicleType: 'CAB',
    mode: 'SCHEDULED',
    status: 'SEARCHING',
    pickup: {
      address: 'Chhatrapati Shivaji Maharaj International Airport (T2), Mumbai 400099',
      location: { type: 'Point', coordinates: [72.874, 19.09] },
    },
    drop: {
      address: 'Taj Mahal Palace, Colaba, Mumbai 400001',
      location: { type: 'Point', coordinates: [72.833, 18.922] },
    },
    fareSnapshot: {
      totalPaise: 68000, // ₹680.00
      breakdown: { basePaise: 12000, distancePaise: 46000, timePaise: 10000, taxesPaise: 0 },
      fareConfigVersion: 3,
      fareConfigId: '65f0fare0003',
      distanceMetres: 24500,
      distanceMethod: 'haversine',
    },
    userId: { email: 'vikram.joshi@example.com', displayName: 'Vikram Joshi' },
    customerPhone: '+919876500003',
    scheduledFor: '2026-10-30T07:00:00.000Z',
    timeline: [{ status: 'SEARCHING', at: '2026-10-30T05:25:00.000Z' }],
    createdAt: '2026-10-30T05:25:00.000Z',
  },
  {
    _id: '65f01a0123456789012345a4',
    idempotencyKey: 'idem_mumbai_004',
    vehicleType: 'BIKE',
    mode: 'INSTANT',
    status: 'CANCELLED',
    cancelledBy: 'CUSTOMER',
    cancellationReason: 'Driver asked for cash surcharge',
    cancelledAt: '2026-10-30T04:45:00.000Z',
    pickup: {
      address: 'Dadar Western Station, Mumbai 400028',
      location: { type: 'Point', coordinates: [72.843, 19.019] },
    },
    drop: {
      address: 'Lower Parel One World Center, Mumbai 400013',
      location: { type: 'Point', coordinates: [72.83, 18.995] },
    },
    fareSnapshot: {
      totalPaise: 8000,
      breakdown: { basePaise: 3000, distancePaise: 4000, timePaise: 1000, taxesPaise: 0 },
      fareConfigVersion: 3,
      fareConfigId: '65f0fare0003',
      distanceMetres: 3400,
      distanceMethod: 'haversine',
    },
    userId: { email: 'pooja.iyer@example.com', displayName: 'Pooja Iyer' },
    customerPhone: '+919876500004',
    timeline: [
      { status: 'SEARCHING', at: '2026-10-30T04:40:00.000Z' },
      { status: 'ACCEPTED', at: '2026-10-30T04:40:22.000Z' },
      { status: 'CANCELLED', at: '2026-10-30T04:45:00.000Z' },
    ],
    createdAt: '2026-10-30T04:40:00.000Z',
  },
  {
    _id: '65f01a0123456789012345a5',
    idempotencyKey: 'idem_mumbai_005',
    vehicleType: 'AUTO',
    mode: 'INSTANT',
    status: 'NO_CAPTAIN',
    pickup: {
      address: 'Viviana Mall, Thane West, Mumbai 400606',
      location: { type: 'Point', coordinates: [72.973, 19.208] },
    },
    drop: {
      address: 'Mulund West Station, Mumbai 400080',
      location: { type: 'Point', coordinates: [72.956, 19.176] },
    },
    fareSnapshot: {
      totalPaise: 11000,
      breakdown: { basePaise: 4000, distancePaise: 5500, timePaise: 1500, taxesPaise: 0 },
      fareConfigVersion: 3,
      fareConfigId: '65f0fare0003',
      distanceMetres: 5100,
      distanceMethod: 'haversine',
    },
    userId: { email: 'kunal.d@example.com', displayName: 'Kunal Deshmukh' },
    customerPhone: '+919876500005',
    timeline: [
      { status: 'SEARCHING', at: '2026-10-30T04:10:00.000Z' },
      { status: 'NO_CAPTAIN', at: '2026-10-30T04:12:30.000Z' },
    ],
    createdAt: '2026-10-30T04:10:00.000Z',
  },
];

const MOCK_DISPATCH_ROUNDS = {
  '65f01a0123456789012345a1': [
    {
      roundNumber: 1,
      status: 'COMPLETED',
      searchRadiusMetres: 2500,
      offerDurationSeconds: 15,
      offeredCaptains: [
        {
          id: 'cpt_01',
          name: 'Suresh Kamble',
          phone: '+919820011111',
          vehicle: 'BIKE (MH02BZ4921)',
          distanceToPickupMetres: 780,
          status: 'ACCEPTED',
        },
      ],
      skippedCaptains: [
        {
          captainId: 'cpt_98',
          name: 'Prakash Rao',
          reason: 'captain is 3,420m from pickup, exceeds radius of 2,500m',
          failedRule: 'Rule A (Pickup Radius Exceeded)',
        },
        {
          captainId: 'cpt_99',
          name: 'Amit Salvi',
          reason:
            'Relative-Distance Rule: captain is closer to drop (2,100m) than pickup (3,800m) — heading away from pickup',
          failedRule: 'Rule B (Relative-Distance Rule - Experimental)',
        },
      ],
      completedAt: '2026-10-30T05:30:14.000Z',
    },
  ],
  '65f01a0123456789012345a3': [
    {
      roundNumber: 1,
      status: 'ACTIVE',
      searchRadiusMetres: 3000,
      offerDurationSeconds: 20,
      offeredCaptains: [
        {
          id: 'cpt_05',
          name: 'Pradeep Jadhav',
          phone: '+919820033333',
          vehicle: 'CAB (MH01DE9001)',
          distanceToPickupMetres: 1420,
          status: 'PENDING',
        },
      ],
      skippedCaptains: [
        {
          captainId: 'cpt_88',
          name: 'Rajesh Solanki',
          reason:
            'Relative-Distance Rule: captain is closer to drop (12,000m) than pickup (18,400m)',
          failedRule: 'Rule B (Relative-Distance Rule - Experimental)',
        },
      ],
    },
  ],
};

const MOCK_CAPTAINS = [
  {
    _id: '65f02c0123456789012345c1',
    userId: {
      displayName: 'Suresh Kamble',
      email: 'suresh.k@example.com',
      phone: '+919820011111',
    },
    vehicleType: 'BIKE',
    approvalStatus: 'PENDING',
    isOnline: false,
    vehicle: {
      make: 'Bajaj',
      model: 'Pulsar 150',
      year: 2022,
      registrationNumber: 'MH02BZ4921',
      color: 'Black',
    },
    totalRides: 0,
    totalEarnedPaise: 0,
    rating: null,
    ratingCount: 0,
    createdAt: '2026-10-25T10:00:00.000Z',
  },
  {
    _id: '65f02c0123456789012345c2',
    userId: {
      displayName: 'Ganesh More',
      email: 'ganesh.m@example.com',
      phone: '+919820022222',
    },
    vehicleType: 'AUTO',
    approvalStatus: 'APPROVED',
    isOnline: true,
    vehicle: {
      make: 'Bajaj',
      model: 'Compact 4S',
      year: 2021,
      registrationNumber: 'MH03CK1928',
      color: 'Yellow/Black',
    },
    totalRides: 342,
    totalEarnedPaise: 3840000,
    rating: 4.85,
    ratingCount: 290,
    approvedAt: '2026-09-15T12:00:00.000Z',
    createdAt: '2026-09-10T08:30:00.000Z',
  },
  {
    _id: '65f02c0123456789012345c3',
    userId: {
      displayName: 'Pravin Rane',
      email: 'pravin.r@example.com',
      phone: '+919820033333',
    },
    vehicleType: 'CAB',
    approvalStatus: 'REJECTED',
    isOnline: false,
    rejectionReason: 'Driving licence copy expired and Aadhaar back is unreadable.',
    vehicle: {
      make: 'Maruti Suzuki',
      model: 'WagonR',
      year: 2020,
      registrationNumber: 'MH01DE8831',
      color: 'White',
    },
    totalRides: 12,
    totalEarnedPaise: 145000,
    rating: 3.9,
    ratingCount: 10,
    createdAt: '2026-10-15T14:20:00.000Z',
  },
  {
    _id: '65f02c0123456789012345c4',
    userId: {
      displayName: 'Rajesh Varma',
      email: 'rajesh.v@example.com',
      phone: '+919820044444',
    },
    vehicleType: 'BIKE',
    approvalStatus: 'PENDING',
    isOnline: false,
    vehicle: {
      make: 'Hero',
      model: 'Splendor Plus',
      year: 2023,
      registrationNumber: 'MH04EF5512',
      color: 'Blue',
    },
    totalRides: 0,
    totalEarnedPaise: 0,
    rating: null,
    ratingCount: 0,
    createdAt: '2026-10-28T11:15:00.000Z',
  },
  {
    _id: '65f02c0123456789012345c5',
    userId: {
      displayName: 'Imran Shaikh',
      email: 'imran.s@example.com',
      phone: '+919820055555',
    },
    vehicleType: 'AUTO',
    approvalStatus: 'SUSPENDED',
    isOnline: false,
    rejectionReason: 'Vehicle insurance expired. Periodic re-verification required.',
    vehicle: {
      make: 'Piaggio',
      model: 'Ape City',
      year: 2019,
      registrationNumber: 'MH02FG9943',
      color: 'Green',
    },
    totalRides: 689,
    totalEarnedPaise: 7920000,
    rating: 4.2,
    ratingCount: 520,
    createdAt: '2026-07-04T09:00:00.000Z',
  },
];

const MOCK_DOCUMENTS = {
  '65f02c0123456789012345c1': [
    {
      _id: '65f02d0123456789012345d1',
      captainId: '65f02c0123456789012345c1',
      type: 'AADHAAR_FRONT',
      status: 'APPROVED',
      expiresAt: null,
      fileFormat: 'image/jpeg',
      fileSizeBytes: 1250000,
      storagePublicId: 'vrumm/captains/c1/aadhaar_front',
      previewUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      createdAt: '2026-10-25T10:05:00.000Z',
    },
    {
      _id: '65f02d0123456789012345d2',
      captainId: '65f02c0123456789012345c1',
      type: 'AADHAAR_BACK',
      status: 'APPROVED',
      expiresAt: null,
      fileFormat: 'image/jpeg',
      fileSizeBytes: 1100000,
      storagePublicId: 'vrumm/captains/c1/aadhaar_back',
      previewUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      createdAt: '2026-10-25T10:05:00.000Z',
    },
    {
      _id: '65f02d0123456789012345d3',
      captainId: '65f02c0123456789012345c1',
      type: 'DRIVING_LICENCE_FRONT',
      status: 'PENDING',
      expiresAt: '2026-11-15T00:00:00.000Z', // Expiring in 16 days!
      fileFormat: 'image/jpeg',
      fileSizeBytes: 1800000,
      storagePublicId: 'vrumm/captains/c1/dl_front',
      previewUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80',
      createdAt: '2026-10-25T10:10:00.000Z',
    },
    {
      _id: '65f02d0123456789012345d4',
      captainId: '65f02c0123456789012345c1',
      type: 'DRIVING_LICENCE_BACK',
      status: 'PENDING',
      expiresAt: '2026-11-15T00:00:00.000Z',
      fileFormat: 'image/jpeg',
      fileSizeBytes: 1750000,
      storagePublicId: 'vrumm/captains/c1/dl_back',
      previewUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80',
      createdAt: '2026-10-25T10:10:00.000Z',
    },
    {
      _id: '65f02d0123456789012345d5',
      captainId: '65f02c0123456789012345c1',
      type: 'VEHICLE_RC',
      status: 'APPROVED',
      expiresAt: '2032-04-10T00:00:00.000Z',
      fileFormat: 'application/pdf',
      fileSizeBytes: 2400000,
      storagePublicId: 'vrumm/captains/c1/vehicle_rc',
      previewUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80',
      createdAt: '2026-10-25T10:15:00.000Z',
    },
    {
      _id: '65f02d0123456789012345d6',
      captainId: '65f02c0123456789012345c1',
      type: 'VEHICLE_INSURANCE',
      status: 'PENDING',
      expiresAt: '2027-08-20T00:00:00.000Z',
      fileFormat: 'application/pdf',
      fileSizeBytes: 2100000,
      storagePublicId: 'vrumm/captains/c1/insurance',
      previewUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
      createdAt: '2026-10-25T10:15:00.000Z',
    },
    {
      _id: '65f02d0123456789012345d7',
      captainId: '65f02c0123456789012345c1',
      type: 'PROFILE_PHOTO',
      status: 'APPROVED',
      expiresAt: null,
      fileFormat: 'image/jpeg',
      fileSizeBytes: 950000,
      storagePublicId: 'vrumm/captains/c1/profile',
      previewUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
      createdAt: '2026-10-25T10:20:00.000Z',
    },
  ],
  '65f02c0123456789012345c2': [
    {
      _id: '65f02d0123456789012345d8',
      captainId: '65f02c0123456789012345c2',
      type: 'AADHAAR_FRONT',
      status: 'APPROVED',
      expiresAt: null,
      fileFormat: 'image/jpeg',
      fileSizeBytes: 1200000,
      storagePublicId: 'vrumm/captains/c2/aadhaar_front',
      previewUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      createdAt: '2026-09-10T09:00:00.000Z',
    },
    {
      _id: '65f02d0123456789012345d9',
      captainId: '65f02c0123456789012345c2',
      type: 'AADHAAR_BACK',
      status: 'APPROVED',
      expiresAt: null,
      fileFormat: 'image/jpeg',
      fileSizeBytes: 1200000,
      storagePublicId: 'vrumm/captains/c2/aadhaar_back',
      previewUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      createdAt: '2026-09-10T09:00:00.000Z',
    },
    {
      _id: '65f02d0123456789012345da',
      captainId: '65f02c0123456789012345c2',
      type: 'DRIVING_LICENCE_FRONT',
      status: 'APPROVED',
      expiresAt: '2029-06-15T00:00:00.000Z',
      fileFormat: 'image/jpeg',
      fileSizeBytes: 1600000,
      storagePublicId: 'vrumm/captains/c2/dl_front',
      previewUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80',
      createdAt: '2026-09-10T09:10:00.000Z',
    },
    {
      _id: '65f02d0123456789012345db',
      captainId: '65f02c0123456789012345c2',
      type: 'DRIVING_LICENCE_BACK',
      status: 'APPROVED',
      expiresAt: '2029-06-15T00:00:00.000Z',
      fileFormat: 'image/jpeg',
      fileSizeBytes: 1550000,
      storagePublicId: 'vrumm/captains/c2/dl_back',
      previewUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80',
      createdAt: '2026-09-10T09:10:00.000Z',
    },
    {
      _id: '65f02d0123456789012345dc',
      captainId: '65f02c0123456789012345c2',
      type: 'VEHICLE_RC',
      status: 'APPROVED',
      expiresAt: '2031-10-10T00:00:00.000Z',
      fileFormat: 'application/pdf',
      fileSizeBytes: 2200000,
      storagePublicId: 'vrumm/captains/c2/vehicle_rc',
      previewUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80',
      createdAt: '2026-09-10T09:15:00.000Z',
    },
    {
      _id: '65f02d0123456789012345dd',
      captainId: '65f02c0123456789012345c2',
      type: 'VEHICLE_INSURANCE',
      status: 'APPROVED',
      expiresAt: '2027-02-14T00:00:00.000Z',
      fileFormat: 'application/pdf',
      fileSizeBytes: 2300000,
      storagePublicId: 'vrumm/captains/c2/insurance',
      previewUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
      createdAt: '2026-09-10T09:15:00.000Z',
    },
    {
      _id: '65f02d0123456789012345de',
      captainId: '65f02c0123456789012345c2',
      type: 'PROFILE_PHOTO',
      status: 'APPROVED',
      expiresAt: null,
      fileFormat: 'image/jpeg',
      fileSizeBytes: 980000,
      storagePublicId: 'vrumm/captains/c2/profile',
      previewUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80',
      createdAt: '2026-09-10T09:20:00.000Z',
    },
  ],
  '65f02c0123456789012345c3': [
    {
      _id: '65f02d0123456789012345df',
      captainId: '65f02c0123456789012345c3',
      type: 'DRIVING_LICENCE_FRONT',
      status: 'REJECTED',
      rejectionReason: 'Licence expired on 2026-10-10. Valid unexpired driving licence required.',
      expiresAt: '2026-10-10T00:00:00.000Z', // Expired!
      fileFormat: 'image/jpeg',
      fileSizeBytes: 1400000,
      storagePublicId: 'vrumm/captains/c3/dl_front',
      previewUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80',
      createdAt: '2026-10-15T14:30:00.000Z',
    },
    {
      _id: '65f02d0123456789012345e0',
      captainId: '65f02c0123456789012345c3',
      type: 'AADHAAR_BACK',
      status: 'REJECTED',
      rejectionReason: 'Image is blurred. Address details are completely illegible.',
      expiresAt: null,
      fileFormat: 'image/jpeg',
      fileSizeBytes: 890000,
      storagePublicId: 'vrumm/captains/c3/aadhaar_back',
      previewUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
      createdAt: '2026-10-15T14:30:00.000Z',
    },
  ],
};

let MOCK_FARE_CONFIGS = [
  {
    _id: '65f0fare0001',
    vehicleType: 'BIKE',
    zone: 'mumbai',
    version: 2,
    effectiveFrom: '2026-06-01T00:00:00.000Z',
    effectiveTo: null,
    isActive: true,
    baseFarePaise: 2500, // ₹25.00
    perKmPaise: 1200, // ₹12.00 / km
    perMinutePaise: 150, // ₹1.50 / min
    minimumFarePaise: 3000, // ₹30.00
    minimumBillableDistanceMetres: 1500,
    waitingGracePeriodMinutes: 3,
    waitingChargePerMinutePaise: 150,
    surgeEnabled: false,
    surgeMultiplierMax: 1.5,
    taxes: [{ label: 'GST', basisPoints: 500 }],
    createdBy: { displayName: 'Super Admin', email: 'superadmin@vrumm.dev' },
    reason: 'Annual fuel price index adjustment for Mumbai urban zone',
    createdAt: '2026-06-01T00:00:00.000Z',
  },
  {
    _id: '65f0fare0002',
    vehicleType: 'BIKE',
    zone: 'mumbai',
    version: 1,
    effectiveFrom: '2026-01-01T00:00:00.000Z',
    effectiveTo: '2026-06-01T00:00:00.000Z',
    isActive: false,
    baseFarePaise: 2000,
    perKmPaise: 1000,
    perMinutePaise: 100,
    minimumFarePaise: 2500,
    minimumBillableDistanceMetres: 1500,
    waitingGracePeriodMinutes: 3,
    waitingChargePerMinutePaise: 100,
    surgeEnabled: false,
    surgeMultiplierMax: 1.0,
    taxes: [{ label: 'GST', basisPoints: 500 }],
    createdBy: { displayName: 'Super Admin', email: 'superadmin@vrumm.dev' },
    reason: 'Initial platform launch tariff for Bike Taxi',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    _id: '65f0fare0003',
    vehicleType: 'AUTO',
    zone: 'mumbai',
    version: 2,
    effectiveFrom: '2026-05-15T00:00:00.000Z',
    effectiveTo: null,
    isActive: true,
    baseFarePaise: 3500, // ₹35.00
    perKmPaise: 1500, // ₹15.00 / km
    perMinutePaise: 200, // ₹2.00 / min
    minimumFarePaise: 4000, // ₹40.00
    minimumBillableDistanceMetres: 1800,
    waitingGracePeriodMinutes: 3,
    waitingChargePerMinutePaise: 150,
    surgeEnabled: false,
    surgeMultiplierMax: 1.5,
    taxes: [{ label: 'GST', basisPoints: 500 }],
    createdBy: { displayName: 'Ops Agent', email: 'ops@vrumm.dev' },
    reason: 'MMRTA regulated auto meter revision alignment',
    createdAt: '2026-05-15T00:00:00.000Z',
  },
  {
    _id: '65f0fare0004',
    vehicleType: 'AUTO',
    zone: 'mumbai',
    version: 1,
    effectiveFrom: '2026-01-01T00:00:00.000Z',
    effectiveTo: '2026-05-15T00:00:00.000Z',
    isActive: false,
    baseFarePaise: 3000,
    perKmPaise: 1400,
    perMinutePaise: 150,
    minimumFarePaise: 3500,
    minimumBillableDistanceMetres: 1500,
    waitingGracePeriodMinutes: 3,
    waitingChargePerMinutePaise: 100,
    surgeEnabled: false,
    surgeMultiplierMax: 1.0,
    taxes: [{ label: 'GST', basisPoints: 500 }],
    createdBy: { displayName: 'Super Admin', email: 'superadmin@vrumm.dev' },
    reason: 'Initial platform launch auto tariff',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    _id: '65f0fare0005',
    vehicleType: 'CAB',
    zone: 'mumbai',
    version: 1,
    effectiveFrom: '2026-01-01T00:00:00.000Z',
    effectiveTo: null,
    isActive: true,
    baseFarePaise: 6000, // ₹60.00
    perKmPaise: 2200, // ₹22.00 / km
    perMinutePaise: 250, // ₹2.50 / min
    minimumFarePaise: 8000, // ₹80.00
    minimumBillableDistanceMetres: 2500,
    waitingGracePeriodMinutes: 5,
    waitingChargePerMinutePaise: 200,
    surgeEnabled: false,
    surgeMultiplierMax: 2.0,
    taxes: [{ label: 'GST', basisPoints: 500 }],
    createdBy: { displayName: 'Super Admin', email: 'superadmin@vrumm.dev' },
    reason: 'Initial Mumbai AC Cab baseline tariff',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

let MOCK_DISPATCH_SETTINGS = {
  offerDurationSeconds: 10,
  initialRadiusMetres: {
    BIKE: 2000,
    AUTO: 3000,
    CAB: 4000,
  },
  radiusExpansionMetres: {
    BIKE: 1000,
    AUTO: 1500,
    CAB: 2000,
  },
  maxRadiusMetres: {
    BIKE: 6000,
    AUTO: 8000,
    CAB: 10000,
  },
  maxRounds: 3,
  distanceRuleBEnabled: {
    BIKE: true,
    AUTO: true,
    CAB: false, // Cabs exempt by default
  },
  scheduledDispatchWindowMinutes: 15,
  scheduledWorkerPollIntervalMs: 30000,
  workerLockTtlSeconds: 120,
};

let MOCK_REVENUE_PLANS = [
  {
    _id: 'rev_plan_001',
    name: 'Standard Per-Ride Commission',
    type: 'COMMISSION',
    commissionBasisPoints: 1500, // 15.00%
    fixedFeePaise: 0,
    billingCycle: 'PER_RIDE',
    effectiveFrom: '2026-01-01T00:00:00.000Z',
    effectiveTo: null,
    isActive: true,
    description: 'Default 15% platform take-rate charged on net ride fares.',
    reason: 'Baseline platform commission economics for Maharashtra market',
  },
  {
    _id: 'rev_plan_002',
    name: 'Daily Driver Subscription Pass',
    type: 'SUBSCRIPTION',
    commissionBasisPoints: 0, // 0.00%
    fixedFeePaise: 4900, // ₹49.00 / day
    billingCycle: 'DAILY',
    effectiveFrom: '2026-06-01T00:00:00.000Z',
    effectiveTo: null,
    isActive: true,
    description: 'Zero commission for 24 hours. Fixed flat daily subscription fee for full-time captains.',
    reason: 'Pilot program to boost driver retention during peak monsoon season',
  },
  {
    _id: 'rev_plan_003',
    name: 'Weekly Fleet Pro Pass',
    type: 'SUBSCRIPTION',
    commissionBasisPoints: 0,
    fixedFeePaise: 29900, // ₹299.00 / week
    billingCycle: 'WEEKLY',
    effectiveFrom: '2026-08-01T00:00:00.000Z',
    effectiveTo: null,
    isActive: true,
    description: 'Zero commission for 7 consecutive calendar days. Preferred by dedicated auto captains.',
    reason: 'Expansion into Thane and Navi Mumbai high-volume corridors',
  },
  {
    _id: 'rev_plan_004',
    name: 'Legacy 20% Take Rate (Retired)',
    type: 'COMMISSION',
    commissionBasisPoints: 2000, // 20.00%
    fixedFeePaise: 0,
    billingCycle: 'PER_RIDE',
    effectiveFrom: '2025-10-01T00:00:00.000Z',
    effectiveTo: '2026-01-01T00:00:00.000Z',
    isActive: false,
    description: 'Historical alpha launch commission tier.',
    reason: 'Superseded by 15% rate on official launch',
  },
];

let MOCK_PROMOTIONS = [
  {
    _id: '65f0promo000000000000001',
    code: 'VRUMM50',
    description: '50% off up to ₹50 on rides in Mumbai cluster',
    discountType: 'PERCENTAGE',
    discountValue: 50,
    maxDiscountPaise: 5000, // ₹50.00
    minRideFarePaise: 10000, // ₹100.00
    firstRideOnly: false,
    allowedVehicleTypes: ['BIKE', 'AUTO', 'CAB'],
    maxTotalRedemptions: 5000,
    currentRedemptions: 1420,
    maxPerUserRedemptions: 3,
    startsAt: '2026-10-01T00:00:00.000Z',
    expiresAt: '2026-12-31T23:59:59.000Z',
    isActive: true,
    reason: 'Festive season customer acquisition drive across Mumbai',
    createdAt: '2026-10-01T00:00:00.000Z',
  },
  {
    _id: '65f0promo000000000000002',
    code: 'FIRST100',
    description: 'Flat ₹100 off on your very first ride',
    discountType: 'FLAT',
    discountValue: 10000, // ₹100.00 in paise
    maxDiscountPaise: 10000,
    minRideFarePaise: 12000, // ₹120.00
    firstRideOnly: true,
    allowedVehicleTypes: ['BIKE', 'AUTO', 'CAB'],
    maxTotalRedemptions: 2000,
    currentRedemptions: 890,
    maxPerUserRedemptions: 1,
    startsAt: '2026-09-01T00:00:00.000Z',
    expiresAt: '2026-12-31T23:59:59.000Z',
    isActive: true,
    reason: 'Welcome onboarding incentive for new riders',
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    _id: '65f0promo000000000000003',
    code: 'MUMBAIAUTO',
    description: '20% discount on all Auto bookings up to ₹30',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    maxDiscountPaise: 3000, // ₹30.00
    minRideFarePaise: 4000, // ₹40.00
    firstRideOnly: false,
    allowedVehicleTypes: ['AUTO'],
    maxTotalRedemptions: 10000,
    currentRedemptions: 2150,
    maxPerUserRedemptions: 5,
    startsAt: '2026-10-15T00:00:00.000Z',
    expiresAt: '2026-11-30T23:59:59.000Z',
    isActive: true,
    reason: 'Encourage short-distance suburban auto ridership',
    createdAt: '2026-10-15T00:00:00.000Z',
  },
  {
    _id: '65f0promo000000000000004',
    code: 'BANDRABIKER',
    description: 'Flat ₹25 off on quick bike taxi trips',
    discountType: 'FLAT',
    discountValue: 2500, // ₹25.00
    maxDiscountPaise: 2500,
    minRideFarePaise: 5000, // ₹50.00
    firstRideOnly: false,
    allowedVehicleTypes: ['BIKE'],
    maxTotalRedemptions: 3000,
    currentRedemptions: 630,
    maxPerUserRedemptions: 2,
    startsAt: '2026-10-20T00:00:00.000Z',
    expiresAt: '2026-11-25T23:59:59.000Z',
    isActive: true,
    reason: 'Metro station last-mile commuter booster',
    createdAt: '2026-10-20T00:00:00.000Z',
  },
  {
    _id: '65f0promo000000000000005',
    code: 'AIRPORTCAB',
    description: '15% discount up to ₹150 on airport cab drops',
    discountType: 'PERCENTAGE',
    discountValue: 15,
    maxDiscountPaise: 15000, // ₹150.00
    minRideFarePaise: 40000, // ₹400.00
    firstRideOnly: false,
    allowedVehicleTypes: ['CAB'],
    maxTotalRedemptions: 1500,
    currentRedemptions: 310,
    maxPerUserRedemptions: 2,
    startsAt: '2026-10-01T00:00:00.000Z',
    expiresAt: '2026-12-31T23:59:59.000Z',
    isActive: true,
    reason: 'Capture high-value airport transit volume at T1 and T2',
    createdAt: '2026-10-01T00:00:00.000Z',
  },
  {
    _id: '65f0promo000000000000006',
    code: 'MONSOON20',
    description: '20% off during heavy monsoon showers (Expired)',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    maxDiscountPaise: 5000,
    minRideFarePaise: 10000,
    firstRideOnly: false,
    allowedVehicleTypes: ['BIKE', 'AUTO', 'CAB'],
    maxTotalRedemptions: 1000,
    currentRedemptions: 1000,
    maxPerUserRedemptions: 1,
    startsAt: '2026-08-01T00:00:00.000Z',
    expiresAt: '2026-09-30T23:59:59.000Z',
    isActive: false,
    reason: 'Seasonal campaign completed successfully',
    createdAt: '2026-08-01T00:00:00.000Z',
  },
];

let MOCK_INCENTIVES = [
  {
    _id: '65f0inc0000000000000001',
    name: 'Bandra-BKC Peak Hour 5-Ride Boost',
    description: 'Complete 5 peak-hour rides between 8 AM - 12 PM in Mumbai cluster',
    targetType: 'PEAK_HOUR',
    targetCount: 5,
    rewardAmountPaise: 25000, // ₹250.00
    startsAt: '2026-10-01T00:00:00.000Z',
    expiresAt: '2026-11-30T23:59:59.000Z',
    isActive: true,
    completedCount: 384,
    reason: 'Maintain supply liquidity in BKC financial district during rush hours',
    createdAt: '2026-10-01T00:00:00.000Z',
  },
  {
    _id: '65f0inc0000000000000002',
    name: 'Weekly Auto Marathon 40',
    description: 'Complete 40 completed trips in one calendar week',
    targetType: 'WEEKLY_RIDES',
    targetCount: 40,
    rewardAmountPaise: 200000, // ₹2,000.00
    startsAt: '2026-10-01T00:00:00.000Z',
    expiresAt: '2026-12-31T23:59:59.000Z',
    isActive: true,
    completedCount: 142,
    reason: 'Reward full-time committed drivers and reduce churn',
    createdAt: '2026-10-01T00:00:00.000Z',
  },
  {
    _id: '65f0inc0000000000000003',
    name: 'Daily Bike Express 12',
    description: 'Complete 12 bike taxi rides in a single calendar day',
    targetType: 'DAILY_RIDES',
    targetCount: 12,
    rewardAmountPaise: 35000, // ₹350.00
    startsAt: '2026-10-15T00:00:00.000Z',
    expiresAt: '2026-11-30T23:59:59.000Z',
    isActive: true,
    completedCount: 520,
    reason: 'Drive rapid turnaround for short inner-city trips',
    createdAt: '2026-10-15T00:00:00.000Z',
  },
  {
    _id: '65f0inc0000000000000004',
    name: 'Captain Referral Reward',
    description: 'Refer a new captain who completes their first verified ride',
    targetType: 'REFERRAL',
    targetCount: 1,
    rewardAmountPaise: 50000, // ₹500.00
    startsAt: '2026-09-01T00:00:00.000Z',
    expiresAt: '2026-12-31T23:59:59.000Z',
    isActive: true,
    completedCount: 95,
    reason: 'Peer recruitment incentive for qualified commercial badge holders',
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    _id: '65f0inc0000000000000005',
    name: 'Late Night Thane Surge (Archived)',
    description: 'Complete 4 midnight rides between 11 PM and 4 AM',
    targetType: 'PEAK_HOUR',
    targetCount: 4,
    rewardAmountPaise: 30000, // ₹300.00
    startsAt: '2026-08-01T00:00:00.000Z',
    expiresAt: '2026-09-30T23:59:59.000Z',
    isActive: false,
    completedCount: 68,
    reason: 'Seasonal midnight demand trial concluded',
    createdAt: '2026-08-01T00:00:00.000Z',
  },
];

let MOCK_PAYMENTS = [
  {
    _id: '65f0pay0000000000000001',
    rideId: '65f01a0123456789012345a1',
    customerUserId: '65f0usr0000000000000001',
    customerName: 'Aarav Patel',
    customerPhone: '+919876500001',
    captainUserId: '65f0capt000000000000001',
    captainName: 'Suresh Kamble',
    vehicleNumber: 'MH02BZ4921',
    amountPaise: 9500, // ₹95.00
    currency: 'INR',
    status: 'CAPTURED',
    provider: 'RAZORPAY',
    providerOrderId: 'order_RZP_A10091',
    providerPaymentId: 'pay_RZP_A10091_CAP',
    refundReason: null,
    refundedAt: null,
    createdAt: '2026-10-30T05:35:00.000Z',
    updatedAt: '2026-10-30T05:35:00.000Z',
  },
  {
    _id: '65f0pay0000000000000002',
    rideId: '65f01a0123456789012345a2',
    customerUserId: '65f0usr0000000000000002',
    customerName: 'Priya Sharma',
    customerPhone: '+919876500002',
    captainUserId: '65f0capt000000000000002',
    captainName: 'Ramesh Jadhav',
    vehicleNumber: 'MH01AB1234',
    amountPaise: 19500, // ₹195.00
    currency: 'INR',
    status: 'CAPTURED',
    provider: 'RAZORPAY',
    providerOrderId: 'order_RZP_B20042',
    providerPaymentId: 'pay_RZP_B20042_CAP',
    refundReason: null,
    refundedAt: null,
    createdAt: '2026-10-30T05:22:00.000Z',
    updatedAt: '2026-10-30T05:22:00.000Z',
  },
  {
    _id: '65f0pay0000000000000003',
    rideId: '65f01a0123456789012345a3',
    customerUserId: '65f0usr0000000000000003',
    customerName: 'Vikram Joshi',
    customerPhone: '+919876500003',
    captainUserId: null,
    captainName: 'Unassigned',
    vehicleNumber: '—',
    amountPaise: 68000, // ₹680.00
    currency: 'INR',
    status: 'PENDING',
    provider: 'MOCK',
    providerOrderId: 'order_MCK_C30018',
    providerPaymentId: null,
    refundReason: null,
    refundedAt: null,
    createdAt: '2026-10-30T05:25:00.000Z',
    updatedAt: '2026-10-30T05:25:00.000Z',
  },
  {
    _id: '65f0pay0000000000000004',
    rideId: '65f01a0123456789012345a4',
    customerUserId: '65f0usr0000000000000004',
    customerName: 'Pooja Iyer',
    customerPhone: '+919876500004',
    captainUserId: '65f0capt000000000000003',
    captainName: 'Ganesh Shinde',
    vehicleNumber: 'MH03CD5678',
    amountPaise: 8000, // ₹80.00
    currency: 'INR',
    status: 'REFUNDED_SIMULATED',
    provider: 'RAZORPAY',
    providerOrderId: 'order_RZP_D40055',
    providerPaymentId: 'pay_RZP_D40055_CAP',
    refundReason: 'Customer canceled due to cash surcharge dispute. Simulated refund processed for audit compliance.',
    refundedAt: '2026-10-30T05:00:00.000Z',
    createdAt: '2026-10-30T04:45:00.000Z',
    updatedAt: '2026-10-30T05:00:00.000Z',
  },
  {
    _id: '65f0pay0000000000000005',
    rideId: '65f01a0123456789012345a5',
    customerUserId: '65f0usr0000000000000005',
    customerName: 'Rohan Desai',
    customerPhone: '+919876500005',
    captainUserId: '65f0capt000000000000004',
    captainName: 'Vinod More',
    vehicleNumber: 'MH04EF9012',
    amountPaise: 14500, // ₹145.00
    currency: 'INR',
    status: 'CAPTURED',
    provider: 'RAZORPAY',
    providerOrderId: 'order_RZP_E50077',
    providerPaymentId: 'pay_RZP_E50077_CAP',
    refundReason: null,
    refundedAt: null,
    createdAt: '2026-10-30T04:30:00.000Z',
    updatedAt: '2026-10-30T04:30:00.000Z',
  },
  {
    _id: '65f0pay0000000000000006',
    rideId: '65f01a0123456789012345a6',
    customerUserId: '65f0usr0000000000000006',
    customerName: 'Sneha Kulkarni',
    customerPhone: '+919876500006',
    captainUserId: '65f0capt000000000000001',
    captainName: 'Suresh Kamble',
    vehicleNumber: 'MH02BZ4921',
    amountPaise: 42000, // ₹420.00
    currency: 'INR',
    status: 'CAPTURED',
    provider: 'RAZORPAY',
    providerOrderId: 'order_RZP_F60088',
    providerPaymentId: 'pay_RZP_F60088_CAP',
    refundReason: null,
    refundedAt: null,
    createdAt: '2026-10-30T04:15:00.000Z',
    updatedAt: '2026-10-30T04:15:00.000Z',
  },
  {
    _id: '65f0pay0000000000000007',
    rideId: '65f01a0123456789012345a7',
    customerUserId: '65f0usr0000000000000007',
    customerName: 'Amit Varma',
    customerPhone: '+919876500007',
    captainUserId: null,
    captainName: 'Unassigned',
    vehicleNumber: '—',
    amountPaise: 25000, // ₹250.00
    currency: 'INR',
    status: 'FAILED',
    provider: 'MOCK',
    providerOrderId: 'order_MCK_G70099',
    providerPaymentId: null,
    refundReason: null,
    refundedAt: null,
    createdAt: '2026-10-30T04:00:00.000Z',
    updatedAt: '2026-10-30T04:00:00.000Z',
  },
];

let MOCK_LEDGER_ENTRIES = [
  {
    _id: '65f0ledg0000000000000001',
    accountUserId: '65f0plat0000000000000000',
    accountType: 'PLATFORM',
    direction: 'CREDIT',
    amountPaise: 19500, // ₹195.00
    entryType: 'FARE_COLLECTED',
    rideId: '65f01a0123456789012345a2',
    paymentId: '65f0pay0000000000000002',
    description: 'Ride fare captured from Priya Sharma',
    reason: 'Automated settlement of completed ride',
    createdAt: '2026-10-30T05:22:01.000Z',
  },
  {
    _id: '65f0ledg0000000000000002',
    accountUserId: '65f0plat0000000000000000',
    accountType: 'PLATFORM',
    direction: 'CREDIT',
    amountPaise: 2925, // ₹29.25 (15% commission)
    entryType: 'COMMISSION_EARNED',
    rideId: '65f01a0123456789012345a2',
    paymentId: '65f0pay0000000000000002',
    description: '15.00% platform commission on ₹195.00 ride',
    reason: 'Revenue share policy Vrumm Standard 15%',
    createdAt: '2026-10-30T05:22:02.000Z',
  },
  {
    _id: '65f0ledg0000000000000003',
    accountUserId: '65f0capt0000000000000002',
    accountType: 'CAPTAIN',
    direction: 'CREDIT',
    amountPaise: 16575, // ₹165.75 (85% captain share)
    entryType: 'CAPTAIN_EARNING',
    rideId: '65f01a0123456789012345a2',
    paymentId: '65f0pay0000000000000002',
    description: 'Net driver earnings credited to Ramesh Jadhav',
    reason: 'Driver payout allocation',
    createdAt: '2026-10-30T05:22:03.000Z',
  },
  {
    _id: '65f0ledg0000000000000004',
    accountUserId: '65f0plat0000000000000000',
    accountType: 'PLATFORM',
    direction: 'CREDIT',
    amountPaise: 9500, // ₹95.00
    entryType: 'FARE_COLLECTED',
    rideId: '65f01a0123456789012345a1',
    paymentId: '65f0pay0000000000000001',
    description: 'Ride fare captured from Aarav Patel',
    reason: 'Automated settlement of completed ride',
    createdAt: '2026-10-30T05:35:01.000Z',
  },
  {
    _id: '65f0ledg0000000000000005',
    accountUserId: '65f0plat0000000000000000',
    accountType: 'PLATFORM',
    direction: 'CREDIT',
    amountPaise: 1425, // ₹14.25 (15% commission)
    entryType: 'COMMISSION_EARNED',
    rideId: '65f01a0123456789012345a1',
    paymentId: '65f0pay0000000000000001',
    description: '15.00% platform commission on ₹95.00 ride',
    reason: 'Revenue share policy Vrumm Standard 15%',
    createdAt: '2026-10-30T05:35:02.000Z',
  },
  {
    _id: '65f0ledg0000000000000006',
    accountUserId: '65f0capt0000000000000001',
    accountType: 'CAPTAIN',
    direction: 'CREDIT',
    amountPaise: 8075, // ₹80.75 (85% captain share)
    entryType: 'CAPTAIN_EARNING',
    rideId: '65f01a0123456789012345a1',
    paymentId: '65f0pay0000000000000001',
    description: 'Net driver earnings credited to Suresh Kamble',
    reason: 'Driver payout allocation',
    createdAt: '2026-10-30T05:35:03.000Z',
  },
  {
    _id: '65f0ledg0000000000000007',
    accountUserId: '65f0plat0000000000000000',
    accountType: 'PLATFORM',
    direction: 'DEBIT',
    amountPaise: 8000, // ₹80.00
    entryType: 'ADJUSTMENT',
    rideId: '65f01a0123456789012345a4',
    paymentId: '65f0pay0000000000000004',
    description: 'Simulated refund debit for canceled ride #a4',
    reason: 'Customer canceled due to cash surcharge dispute. Simulated refund processed for audit compliance.',
    createdAt: '2026-10-30T05:00:05.000Z',
  },
  {
    _id: '65f0ledg0000000000000008',
    accountUserId: '65f0capt0000000000000001',
    accountType: 'CAPTAIN',
    direction: 'DEBIT',
    amountPaise: 150000, // ₹1,500.00
    entryType: 'CAPTAIN_PAYOUT_SIMULATED',
    rideId: null,
    paymentId: null,
    description: 'Weekly automated batch payout to Suresh Kamble (MH02BZ4921)',
    reason: 'Weekly driver payout run',
    createdAt: '2026-10-29T18:30:00.000Z',
  },
  {
    _id: '65f0ledg0000000000000009',
    accountUserId: '65f0plat0000000000000000',
    accountType: 'PLATFORM',
    direction: 'CREDIT',
    amountPaise: 14500, // ₹145.00
    entryType: 'FARE_COLLECTED',
    rideId: '65f01a0123456789012345a5',
    paymentId: '65f0pay0000000000000005',
    description: 'Ride fare captured from Rohan Desai',
    reason: 'Automated settlement of completed ride',
    createdAt: '2026-10-30T04:30:01.000Z',
  },
  {
    _id: '65f0ledg0000000000000010',
    accountUserId: '65f0plat0000000000000000',
    accountType: 'PLATFORM',
    direction: 'CREDIT',
    amountPaise: 2175, // ₹21.75
    entryType: 'COMMISSION_EARNED',
    rideId: '65f01a0123456789012345a5',
    paymentId: '65f0pay0000000000000005',
    description: '15.00% platform commission on ₹145.00 ride',
    reason: 'Revenue share policy Vrumm Standard 15%',
    createdAt: '2026-10-30T04:30:02.000Z',
  },
  {
    _id: '65f0ledg0000000000000011',
    accountUserId: '65f0capt0000000000000004',
    accountType: 'CAPTAIN',
    direction: 'CREDIT',
    amountPaise: 12325, // ₹123.25
    entryType: 'CAPTAIN_EARNING',
    rideId: '65f01a0123456789012345a5',
    paymentId: '65f0pay0000000000000005',
    description: 'Net driver earnings credited to Vinod More',
    reason: 'Driver payout allocation',
    createdAt: '2026-10-30T04:30:03.000Z',
  },
];

export async function handleMockRequest(url, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const requestId = 'mock-req-' + Math.random().toString(36).slice(2, 9);
  const body = options.body ? JSON.parse(options.body) : {};

  await new Promise((r) => setTimeout(r, 150)); // simulate latency

  if (url.includes('/auth/login') && method === 'POST') {
    const user = MOCK_USERS[body.email?.toLowerCase().trim()];
    if (!user || body.password !== 'Vrumm@Dev2026!') {
      return {
        status: 401,
        body: {
          success: false,
          error: { code: 'UNAUTHENTICATED', message: 'Invalid email or password (Mock Adapter)' },
          requestId,
        },
      };
    }
    return {
      status: 200,
      body: {
        success: true,
        data: { accessToken: 'mock-jwt-' + user.role, refreshToken: 'mock-ref-' + user.role, user },
        requestId,
      },
    };
  }

  if (url.includes('/auth/me')) {
    return {
      status: 200,
      body: {
        success: true,
        data: { id: 'mock-usr-superadmin', email: 'superadmin@vrumm.dev', role: ROLES.SUPER_ADMIN },
        requestId,
      },
    };
  }

  if (url.includes('/ops/overview')) {
    return {
      status: 200,
      body: {
        success: true,
        data: {
          activeRides: 2845,
          searchingBookings: 142,
          onlineCaptains: 1420,
          openSafetyAlerts: 0,
          todayFareVolumePaise: 48235000,
        },
        requestId,
      },
    };
  }

  // List Bookings
  if (url.includes('/bookings') && method === 'GET' && !url.match(/\/bookings\/[a-f\d]{24}$/i)) {
    const parsedUrl = new URL(url, 'http://localhost');
    const status = parsedUrl.searchParams.get('status');
    const vehicleType = parsedUrl.searchParams.get('vehicleType');
    const search = parsedUrl.searchParams.get('search')?.toLowerCase();
    const page = Number(parsedUrl.searchParams.get('page')) || 1;
    const limit = Number(parsedUrl.searchParams.get('limit')) || 20;

    let filtered = [...MOCK_BOOKINGS];
    if (status && status !== 'ALL') {
      filtered = filtered.filter((b) => b.status === status);
    }
    if (vehicleType && vehicleType !== 'ALL') {
      filtered = filtered.filter((b) => b.vehicleType === vehicleType);
    }
    if (search) {
      filtered = filtered.filter(
        (b) =>
          b._id.includes(search) ||
          b.userId?.displayName?.toLowerCase().includes(search) ||
          b.pickup?.address?.toLowerCase().includes(search) ||
          b.drop?.address?.toLowerCase().includes(search),
      );
    }

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return {
      status: 200,
      body: {
        success: true,
        data: paginated,
        meta: { total: filtered.length, page, pages: Math.ceil(filtered.length / limit) || 1, limit },
        requestId,
      },
    };
  }

  // Get Single Booking
  const bookingMatch = url.match(/\/bookings\/([a-f\d]{24})/i);
  if (bookingMatch && method === 'GET') {
    const bookingId = bookingMatch[1];
    const found = MOCK_BOOKINGS.find((b) => b._id === bookingId) || MOCK_BOOKINGS[0];
    return {
      status: 200,
      body: { success: true, data: found, requestId },
    };
  }

  // Cancel Booking
  if (bookingMatch && url.includes('/cancel') && method === 'POST') {
    const bookingId = bookingMatch[1];
    const b = MOCK_BOOKINGS.find((x) => x._id === bookingId);
    if (b) {
      b.status = 'CANCELLED';
      b.cancelledBy = 'SYSTEM';
      b.cancellationReason = body.reason || 'Admin cancelled';
      b.cancelledAt = new Date().toISOString();
      b.timeline.push({ status: 'CANCELLED', at: b.cancelledAt });
    }
    return {
      status: 200,
      body: { success: true, data: b || { _id: bookingId, status: 'CANCELLED' }, requestId },
    };
  }

  // Resolve Booking
  if (bookingMatch && url.includes('/resolve') && method === 'POST') {
    const bookingId = bookingMatch[1];
    const b = MOCK_BOOKINGS.find((x) => x._id === bookingId);
    if (b) {
      b.status = 'COMPLETED';
      b.resolutionReason = body.reason;
      b.resolvedAt = new Date().toISOString();
      b.timeline.push({ status: 'COMPLETED', at: b.resolvedAt });
    }
    return {
      status: 200,
      body: { success: true, data: b || { _id: bookingId, status: 'COMPLETED' }, requestId },
    };
  }

  // Dispatch Rounds (Exclusion reasons)
  const roundsMatch = url.match(/\/dispatch\/rounds\/([a-f\d]{24})/i);
  if (roundsMatch && method === 'GET') {
    const bId = roundsMatch[1];
    const rounds = MOCK_DISPATCH_ROUNDS[bId] || MOCK_DISPATCH_ROUNDS['65f01a0123456789012345a1'];
    return {
      status: 200,
      body: { success: true, data: rounds, requestId },
    };
  }

  // --- Phase C: Captains & Document Review Endpoints ---

  // List Captains
  if (url.includes('/captains') && !url.includes('/captains/') && method === 'GET') {
    const parsed = new URL(url, 'http://localhost');
    const page = Number(parsed.searchParams.get('page')) || 1;
    const limit = Number(parsed.searchParams.get('limit')) || 20;
    const approvalStatus = parsed.searchParams.get('approvalStatus');
    const search = parsed.searchParams.get('search')?.toLowerCase();

    let filtered = [...MOCK_CAPTAINS];
    if (approvalStatus && approvalStatus !== 'ALL') {
      filtered = filtered.filter((c) => c.approvalStatus === approvalStatus);
    }
    if (search) {
      filtered = filtered.filter(
        (c) =>
          c.userId?.displayName?.toLowerCase().includes(search) ||
          c.userId?.email?.toLowerCase().includes(search) ||
          c.userId?.phone?.includes(search) ||
          c.vehicle?.registrationNumber?.toLowerCase().includes(search),
      );
    }

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return {
      status: 200,
      body: {
        success: true,
        data: paginated,
        meta: { total: filtered.length, page, pages: Math.ceil(filtered.length / limit) || 1, limit },
        requestId,
      },
    };
  }

  // Single Captain Profile
  const captainMatch = url.match(/\/captains\/([a-f\d]{24})$/i);
  if (captainMatch && method === 'GET') {
    const captainId = captainMatch[1];
    const captain = MOCK_CAPTAINS.find((c) => c._id === captainId) || MOCK_CAPTAINS[0];
    return {
      status: 200,
      body: { success: true, data: captain, requestId },
    };
  }

  // Set Captain Approval Status (with written reason for audit)
  const captainApprovalMatch = url.match(/\/captains\/([a-f\d]{24})\/approval$/i);
  if (captainApprovalMatch && method === 'PATCH') {
    const captainId = captainApprovalMatch[1];
    const captain = MOCK_CAPTAINS.find((c) => c._id === captainId);
    if (captain) {
      captain.approvalStatus = body.status;
      if (body.reason) captain.rejectionReason = body.reason;
      if (body.status === 'APPROVED') {
        captain.approvedAt = new Date().toISOString();
        captain.rejectionReason = null;
      }
    }
    return {
      status: 200,
      body: { success: true, data: captain, requestId },
    };
  }

  // List Documents for Captain
  const captainDocsMatch = url.match(/\/documents\/captain\/([a-f\d]{24})/i);
  if (captainDocsMatch && method === 'GET') {
    const captainId = captainDocsMatch[1];
    const docs = MOCK_DOCUMENTS[captainId] || MOCK_DOCUMENTS['65f02c0123456789012345c1'] || [];
    const approvedTypes = new Set(docs.filter((d) => d.status === 'APPROVED').map((d) => d.type));
    const requiredTypes = [
      'AADHAAR_FRONT',
      'AADHAAR_BACK',
      'DRIVING_LICENCE_FRONT',
      'DRIVING_LICENCE_BACK',
      'VEHICLE_RC',
      'VEHICLE_INSURANCE',
      'PROFILE_PHOTO',
    ];
    const missingRequired = requiredTypes.filter((t) => !approvedTypes.has(t));

    return {
      status: 200,
      body: {
        success: true,
        data: { documents: docs, missingRequired },
        requestId,
      },
    };
  }

  // Review a Document (Approve or Reject with reason)
  const docReviewMatch = url.match(/\/documents\/([a-f\d]{24})\/review/i);
  if (docReviewMatch && method === 'PATCH') {
    const docId = docReviewMatch[1];
    let updatedDoc = null;
    for (const captainId in MOCK_DOCUMENTS) {
      const d = MOCK_DOCUMENTS[captainId].find((x) => x._id === docId);
      if (d) {
        d.status = body.status;
        d.rejectionReason = body.status === 'REJECTED' ? body.rejectionReason : null;
        d.reviewedAt = new Date().toISOString();
        updatedDoc = d;
        break;
      }
    }
    return {
      status: 200,
      body: { success: true, data: updatedDoc || { _id: docId, status: body.status }, requestId },
    };
  }

  // Get Signed Document URL (Preview)
  const docUrlMatch = url.match(/\/documents\/([a-f\d]{24})\/url/i);
  if (docUrlMatch && method === 'GET') {
    const docId = docUrlMatch[1];
    let foundDoc = null;
    for (const captainId in MOCK_DOCUMENTS) {
      const d = MOCK_DOCUMENTS[captainId]?.find((x) => x._id === docId);
      if (d) {
        foundDoc = d;
        break;
      }
    }
    return {
      status: 200,
      body: {
        success: true,
        data: {
          url: foundDoc?.previewUrl || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=600&auto=format&fit=crop&q=80',
          expiresInSeconds: 300,
          documentType: foundDoc?.type || 'DOCUMENT',
          status: foundDoc?.status || 'PENDING',
        },
        requestId,
      },
    };
  }

  // --- Phase D: Fare Configs, Dispatch Tunables & Revenue Plans ---

  // List Fare Configs
  if (url.includes('/fares/configs') && !url.match(/\/fares\/configs\/[a-f\d]{24}/i) && method === 'GET') {
    const parsed = new URL(url, 'http://localhost');
    const page = Number(parsed.searchParams.get('page')) || 1;
    const limit = Number(parsed.searchParams.get('limit')) || 20;
    const vehicleType = parsed.searchParams.get('vehicleType');
    const zone = parsed.searchParams.get('zone');

    let filtered = [...MOCK_FARE_CONFIGS];
    if (vehicleType && vehicleType !== 'ALL') {
      filtered = filtered.filter((f) => f.vehicleType === vehicleType);
    }
    if (zone && zone !== 'ALL') {
      filtered = filtered.filter((f) => f.zone === zone);
    }

    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);

    return {
      status: 200,
      body: {
        success: true,
        data: paginated,
        meta: { total: filtered.length, page, pages: Math.ceil(filtered.length / limit) || 1, limit },
        requestId,
      },
    };
  }

  // Single Fare Config
  const fareConfigMatch = url.match(/\/fares\/configs\/([a-f\d]{24})/i);
  if (fareConfigMatch && method === 'GET') {
    const configId = fareConfigMatch[1];
    const found = MOCK_FARE_CONFIGS.find((f) => f._id === configId) || MOCK_FARE_CONFIGS[0];
    return {
      status: 200,
      body: { success: true, data: found, requestId },
    };
  }

  // Create New Fare Config Version
  if (url.includes('/fares/configs') && method === 'POST') {
    const { vehicleType, zone = 'mumbai' } = body;
    // Find current highest version for this vehicleType and zone
    const existing = MOCK_FARE_CONFIGS.filter(
      (f) => f.vehicleType === vehicleType && f.zone === zone,
    );
    const maxVer = existing.reduce((max, f) => Math.max(max, f.version || 1), 0);
    const nextVer = maxVer + 1;

    // Retire previous active config
    existing.forEach((f) => {
      if (f.isActive) {
        f.isActive = false;
        f.effectiveTo = body.effectiveFrom || new Date().toISOString();
      }
    });

    const newConfig = {
      _id: '65f0fare' + Math.random().toString(36).slice(2, 8),
      vehicleType: body.vehicleType,
      zone: body.zone || 'mumbai',
      version: nextVer,
      effectiveFrom: body.effectiveFrom || new Date().toISOString(),
      effectiveTo: null,
      isActive: true,
      baseFarePaise: body.baseFarePaise,
      perKmPaise: body.perKmPaise,
      perMinutePaise: body.perMinutePaise,
      minimumFarePaise: body.minimumFarePaise,
      minimumBillableDistanceMetres: body.minimumBillableDistanceMetres || 1500,
      waitingGracePeriodMinutes: body.waitingGracePeriodMinutes || 3,
      waitingChargePerMinutePaise: body.waitingChargePerMinutePaise || 0,
      surgeEnabled: Boolean(body.surgeEnabled),
      surgeMultiplierMax: body.surgeMultiplierMax || 1.0,
      taxes: body.taxes || [{ label: 'GST', basisPoints: 500 }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: { displayName: 'Super Admin', email: 'superadmin@vrumm.dev' },
      reason: body.reason,
    };

    MOCK_FARE_CONFIGS.unshift(newConfig);

    return {
      status: 201,
      body: { success: true, data: newConfig, requestId },
    };
  }

  // Public Fare Quote
  if (url.includes('/fares/quote') && method === 'GET') {
    const parsed = new URL(url, 'http://localhost');
    const vehicleType = parsed.searchParams.get('vehicleType') || 'BIKE';
    const cfg =
      MOCK_FARE_CONFIGS.find((f) => f.vehicleType === vehicleType && f.isActive) ||
      MOCK_FARE_CONFIGS[0];

    const estimatedDistanceMetres = 4500;
    const distanceKm = estimatedDistanceMetres / 1000;
    const distanceFarePaise = Math.round(distanceKm * cfg.perKmPaise);
    const durationMinutes = 12;
    const timeFarePaise = Math.round(durationMinutes * cfg.perMinutePaise);
    const subtotal = Math.max(cfg.baseFarePaise + distanceFarePaise + timeFarePaise, cfg.minimumFarePaise);
    const taxPaise = Math.round((subtotal * 500) / 10000); // 5% GST

    return {
      status: 200,
      body: {
        success: true,
        data: {
          totalPaise: subtotal + taxPaise,
          breakdown: {
            baseFarePaise: cfg.baseFarePaise,
            distanceCharge: {
              distanceMetres: estimatedDistanceMetres,
              ratePerKmPaise: cfg.perKmPaise,
              amountPaise: distanceFarePaise,
            },
            timeCharge: {
              durationMinutes,
              ratePerMinutePaise: cfg.perMinutePaise,
              amountPaise: timeFarePaise,
            },
            subtotalPaise: subtotal,
            totalTaxPaise: taxPaise,
          },
          fareConfigId: cfg._id,
          fareConfigVersion: cfg.version,
        },
        requestId,
      },
    };
  }

  // Get Dispatch Settings
  if (url.includes('/settings/dispatch') && method === 'GET') {
    return {
      status: 200,
      body: { success: true, data: MOCK_DISPATCH_SETTINGS, requestId },
    };
  }

  // Update Dispatch Settings
  if (url.includes('/settings/dispatch') && method === 'PATCH') {
    Object.assign(MOCK_DISPATCH_SETTINGS, body);
    MOCK_DISPATCH_SETTINGS.lastUpdated = new Date().toISOString();
    return {
      status: 200,
      body: { success: true, data: MOCK_DISPATCH_SETTINGS, requestId },
    };
  }

  // List Revenue Plans
  if (url.includes('/revenue-plans') && method === 'GET') {
    return {
      status: 200,
      body: { success: true, data: MOCK_REVENUE_PLANS, requestId },
    };
  }

  // Create Revenue Plan Version
  if (url.includes('/revenue-plans') && method === 'POST') {
    const newPlan = {
      _id: 'rev_plan_' + Math.random().toString(36).slice(2, 8),
      name: body.name,
      type: body.type,
      commissionBasisPoints: body.commissionBasisPoints ?? 1500,
      fixedFeePaise: body.fixedFeePaise ?? 0,
      billingCycle: body.billingCycle || 'PER_RIDE',
      effectiveFrom: body.effectiveFrom || new Date().toISOString(),
      isActive: true,
      description: body.description,
      reason: body.reason,
      createdAt: new Date().toISOString(),
    };
    MOCK_REVENUE_PLANS.unshift(newPlan);
    return {
      status: 201,
      body: { success: true, data: newPlan, requestId },
    };
  }

  // --- PHASE E: PROMOTIONS ---

  // Validate Promo Code (Customer / Simulator)
  if (url.includes('/promotions/validate') && method === 'POST') {
    const code = (body.code || '').trim().toUpperCase();
    const rideFarePaise = Number(body.rideFarePaise || 0);
    const vehicleType = body.vehicleType || 'BIKE';

    const promo = MOCK_PROMOTIONS.find((p) => p.code.toUpperCase() === code);
    if (!promo) {
      return {
        status: 200,
        body: {
          success: true,
          data: { valid: false, reason: `Promotion code '${code}' is invalid or does not exist.` },
          requestId,
        },
      };
    }

    if (!promo.isActive) {
      return {
        status: 200,
        body: {
          success: true,
          data: { valid: false, reason: `Promotion code '${code}' is currently inactive.` },
          requestId,
        },
      };
    }

    if (promo.expiresAt && new Date(promo.expiresAt) <= new Date()) {
      return {
        status: 200,
        body: {
          success: true,
          data: { valid: false, reason: `Promotion code '${code}' expired on ${new Date(promo.expiresAt).toLocaleDateString()}.` },
          requestId,
        },
      };
    }

    if (promo.startsAt && new Date(promo.startsAt) > new Date()) {
      return {
        status: 200,
        body: {
          success: true,
          data: { valid: false, reason: `Promotion code '${code}' is scheduled to start on ${new Date(promo.startsAt).toLocaleDateString()}.` },
          requestId,
        },
      };
    }

    if (promo.allowedVehicleTypes && !promo.allowedVehicleTypes.includes(vehicleType)) {
      return {
        status: 200,
        body: {
          success: true,
          data: {
            valid: false,
            reason: `Promo code '${code}' is only eligible for: ${promo.allowedVehicleTypes.join(', ')}. Not applicable for ${vehicleType}.`,
          },
          requestId,
        },
      };
    }

    if (promo.minRideFarePaise && rideFarePaise < promo.minRideFarePaise) {
      return {
        status: 200,
        body: {
          success: true,
          data: {
            valid: false,
            reason: `Ride fare of ₹${(rideFarePaise / 100).toFixed(2)} is below the minimum required fare of ₹${(promo.minRideFarePaise / 100).toFixed(2)}.`,
          },
          requestId,
        },
      };
    }

    if (promo.maxTotalRedemptions && promo.currentRedemptions >= promo.maxTotalRedemptions) {
      return {
        status: 200,
        body: {
          success: true,
          data: { valid: false, reason: `Promotion code '${code}' has reached its total maximum redemption limit.` },
          requestId,
        },
      };
    }

    let discountAmountPaise = 0;
    if (promo.discountType === 'PERCENTAGE') {
      const calculated = Math.round((rideFarePaise * promo.discountValue) / 100);
      discountAmountPaise = promo.maxDiscountPaise ? Math.min(calculated, promo.maxDiscountPaise) : calculated;
    } else {
      discountAmountPaise = Math.min(promo.discountValue, rideFarePaise);
    }

    const finalFarePaise = Math.max(0, rideFarePaise - discountAmountPaise);

    return {
      status: 200,
      body: {
        success: true,
        data: {
          valid: true,
          discountAmountPaise,
          finalFarePaise,
          code: promo.code,
          discountType: promo.discountType,
          discountValue: promo.discountValue,
          description: promo.description,
        },
        requestId,
      },
    };
  }

  // Get Single Promotion
  const promoMatch = url.match(/\/promotions\/([a-zA-Z0-9_-]+)$/);
  if (promoMatch && method === 'GET') {
    const promo = MOCK_PROMOTIONS.find((p) => p._id === promoMatch[1] || p.code === promoMatch[1]);
    if (!promo) {
      return {
        status: 404,
        body: { success: false, error: { code: 'NOT_FOUND', message: 'Promotion not found' }, requestId },
      };
    }
    return {
      status: 200,
      body: { success: true, data: promo, requestId },
    };
  }

  // List Promotions
  if (url.includes('/promotions') && method === 'GET') {
    const parsed = new URL(url, 'http://localhost');
    const search = parsed.searchParams.get('search')?.toLowerCase();
    const isActiveParam = parsed.searchParams.get('isActive');
    const page = parseInt(parsed.searchParams.get('page') || '1', 10);
    const limit = parseInt(parsed.searchParams.get('limit') || '20', 10);

    let filtered = [...MOCK_PROMOTIONS];
    if (search) {
      filtered = filtered.filter(
        (p) => p.code.toLowerCase().includes(search) || (p.description && p.description.toLowerCase().includes(search)),
      );
    }
    if (isActiveParam !== null && isActiveParam !== undefined && isActiveParam !== 'ALL') {
      const shouldBeActive = isActiveParam === 'true';
      filtered = filtered.filter((p) => p.isActive === shouldBeActive);
    }

    const total = filtered.length;
    const pages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return {
      status: 200,
      body: {
        success: true,
        data,
        meta: { total, page, limit, pages },
        requestId,
      },
    };
  }

  // Create Promotion
  if (url.includes('/promotions') && method === 'POST') {
    if (!body.reason || body.reason.trim().length < 5) {
      return {
        status: 400,
        body: { success: false, error: { code: 'VALIDATION_ERROR', message: 'Written justification of >= 5 chars required' }, requestId },
      };
    }

    const newPromo = {
      _id: '65f0promo' + Math.random().toString(36).slice(2, 12),
      code: body.code.toUpperCase().trim(),
      description: body.description?.trim() || '',
      discountType: body.discountType,
      discountValue: body.discountValue,
      maxDiscountPaise: body.maxDiscountPaise,
      minRideFarePaise: body.minRideFarePaise || 0,
      firstRideOnly: Boolean(body.firstRideOnly),
      allowedVehicleTypes: body.allowedVehicleTypes || ['BIKE', 'AUTO', 'CAB'],
      maxTotalRedemptions: body.maxTotalRedemptions || null,
      currentRedemptions: 0,
      maxPerUserRedemptions: body.maxPerUserRedemptions || 1,
      startsAt: body.startsAt || new Date().toISOString(),
      expiresAt: body.expiresAt,
      isActive: true,
      reason: body.reason,
      createdAt: new Date().toISOString(),
    };
    MOCK_PROMOTIONS.unshift(newPromo);

    return {
      status: 201,
      body: { success: true, data: newPromo, requestId },
    };
  }

  // --- PHASE E: INCENTIVES ---

  // Get Single Incentive Campaign
  const incentiveMatch = url.match(/\/incentives\/([a-zA-Z0-9_-]+)$/);
  if (incentiveMatch && method === 'GET') {
    const campaign = MOCK_INCENTIVES.find((c) => c._id === incentiveMatch[1]);
    if (!campaign) {
      return {
        status: 404,
        body: { success: false, error: { code: 'NOT_FOUND', message: 'Incentive campaign not found' }, requestId },
      };
    }
    return {
      status: 200,
      body: { success: true, data: campaign, requestId },
    };
  }

  // List Incentive Campaigns
  if (url.includes('/incentives') && method === 'GET') {
    const parsed = new URL(url, 'http://localhost');
    const targetType = parsed.searchParams.get('targetType');
    const isActiveParam = parsed.searchParams.get('isActive');
    const page = parseInt(parsed.searchParams.get('page') || '1', 10);
    const limit = parseInt(parsed.searchParams.get('limit') || '20', 10);

    let filtered = [...MOCK_INCENTIVES];
    if (targetType && targetType !== 'ALL') {
      filtered = filtered.filter((c) => c.targetType === targetType);
    }
    if (isActiveParam !== null && isActiveParam !== undefined && isActiveParam !== 'ALL') {
      const shouldBeActive = isActiveParam === 'true';
      filtered = filtered.filter((c) => c.isActive === shouldBeActive);
    }

    const total = filtered.length;
    const pages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return {
      status: 200,
      body: {
        success: true,
        data,
        meta: { total, page, limit, pages },
        requestId,
      },
    };
  }

  // Create Incentive Campaign
  if (url.includes('/incentives') && method === 'POST') {
    if (!body.reason || body.reason.trim().length < 5) {
      return {
        status: 400,
        body: { success: false, error: { code: 'VALIDATION_ERROR', message: 'Written justification of >= 5 chars required' }, requestId },
      };
    }

    const newCampaign = {
      _id: '65f0inc' + Math.random().toString(36).slice(2, 12),
      name: body.name.trim(),
      description: body.description?.trim() || '',
      targetType: body.targetType,
      targetCount: Number(body.targetCount),
      rewardAmountPaise: Number(body.rewardAmountPaise),
      startsAt: body.startsAt || new Date().toISOString(),
      expiresAt: body.expiresAt,
      isActive: true,
      completedCount: 0,
      reason: body.reason,
      createdAt: new Date().toISOString(),
    };
    MOCK_INCENTIVES.unshift(newCampaign);

    return {
      status: 201,
      body: { success: true, data: newCampaign, requestId },
    };
  }

  // --- PHASE E: PAYMENTS & REFUNDS ---

  // Payment by Ride
  const paymentRideMatch = url.match(/\/payments\/ride\/([a-zA-Z0-9_-]+)$/);
  if (paymentRideMatch && method === 'GET') {
    const payment = MOCK_PAYMENTS.find((p) => p.rideId === paymentRideMatch[1]);
    return {
      status: 200,
      body: { success: true, data: payment || null, requestId },
    };
  }

  // Simulate Payment Refund
  const refundMatch = url.match(/\/payments\/([a-zA-Z0-9_-]+)\/refund\/simulate$/);
  if (refundMatch && method === 'POST') {
    const payment = MOCK_PAYMENTS.find((p) => p._id === refundMatch[1]);
    if (!payment) {
      return {
        status: 404,
        body: { success: false, error: { code: 'NOT_FOUND', message: 'Payment record not found' }, requestId },
      };
    }

    if (!body.reason || body.reason.trim().length < 5) {
      return {
        status: 400,
        body: {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'A detailed reason of at least 5 characters is required for refund simulation' },
          requestId,
        },
      };
    }

    payment.status = 'REFUNDED_SIMULATED';
    payment.refundReason = body.reason.trim();
    payment.refundedAt = new Date().toISOString();
    payment.updatedAt = new Date().toISOString();

    // Strictly append-only: create reversal entry in ledger
    const ledgerReversal = {
      _id: '65f0ledg' + Math.random().toString(36).slice(2, 12),
      accountUserId: '65f0plat0000000000000000',
      accountType: 'PLATFORM',
      direction: 'DEBIT',
      amountPaise: payment.amountPaise,
      entryType: 'ADJUSTMENT',
      rideId: payment.rideId,
      paymentId: payment._id,
      description: `Simulated refund reversal for payment ${payment._id}`,
      reason: body.reason.trim(),
      createdAt: new Date().toISOString(),
    };
    MOCK_LEDGER_ENTRIES.unshift(ledgerReversal);

    return {
      status: 200,
      body: {
        success: true,
        data: {
          payment,
          refundId: 'sim_rfnd_' + Math.random().toString(36).slice(2, 10),
          status: 'REFUNDED_SIMULATED',
          simulated: true,
          message: 'SIMULATED REFUND - LEARNING ENVIRONMENT ONLY. Financial balance reversed in append-only ledger.',
        },
        requestId,
      },
    };
  }

  // List Payments
  if (url.includes('/payments') && method === 'GET') {
    const parsed = new URL(url, 'http://localhost');
    const status = parsed.searchParams.get('status');
    const rideId = parsed.searchParams.get('rideId');
    const customerUserId = parsed.searchParams.get('customerUserId');
    const captainUserId = parsed.searchParams.get('captainUserId');
    const page = parseInt(parsed.searchParams.get('page') || '1', 10);
    const limit = parseInt(parsed.searchParams.get('limit') || '20', 10);

    let filtered = [...MOCK_PAYMENTS];
    if (status && status !== 'ALL') {
      filtered = filtered.filter((p) => p.status === status);
    }
    if (rideId) {
      filtered = filtered.filter((p) => p.rideId === rideId);
    }
    if (customerUserId) {
      filtered = filtered.filter((p) => p.customerUserId === customerUserId);
    }
    if (captainUserId) {
      filtered = filtered.filter((p) => p.captainUserId === captainUserId);
    }

    const total = filtered.length;
    const pages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return {
      status: 200,
      body: {
        success: true,
        data,
        meta: { total, page, limit, pages },
        requestId,
      },
    };
  }

  // --- PHASE E: LEDGER & RECONCILIATION ---

  // Ledger Balance
  if (url.includes('/ledger/balance') && method === 'GET') {
    // Balance is Platform total credits minus platform total debits
    const platformCredits = MOCK_LEDGER_ENTRIES
      .filter((e) => e.accountType === 'PLATFORM' && e.direction === 'CREDIT')
      .reduce((sum, e) => sum + (e.amountPaise || 0), 0);

    const platformDebits = MOCK_LEDGER_ENTRIES
      .filter((e) => e.accountType === 'PLATFORM' && e.direction === 'DEBIT')
      .reduce((sum, e) => sum + (e.amountPaise || 0), 0);

    const balancePaise = platformCredits - platformDebits;

    return {
      status: 200,
      body: {
        success: true,
        data: {
          balancePaise,
          currency: 'INR',
          totalCreditsPaise: platformCredits,
          totalDebitsPaise: platformDebits,
        },
        requestId,
      },
    };
  }

  // Create Ledger Adjustment Entry (Append-only)
  if (url.includes('/ledger/adjustments') && method === 'POST') {
    if (!body.reason || body.reason.trim().length < 5) {
      return {
        status: 400,
        body: {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Reason of at least 5 characters is required for manual adjustments' },
          requestId,
        },
      };
    }
    if (!body.accountType || !body.direction || !body.amountPaise) {
      return {
        status: 400,
        body: {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'accountType, direction, and amountPaise are required' },
          requestId,
        },
      };
    }

    const newEntry = {
      _id: '65f0ledg' + Math.random().toString(36).slice(2, 12),
      accountUserId: body.accountUserId || '65f0plat0000000000000000',
      accountType: body.accountType,
      direction: body.direction,
      amountPaise: Number(body.amountPaise),
      entryType: 'ADJUSTMENT',
      rideId: body.rideId || null,
      paymentId: body.paymentId || null,
      description: body.description?.trim() || 'Manual ledger audit adjustment',
      reason: body.reason.trim(),
      createdAt: new Date().toISOString(),
    };
    MOCK_LEDGER_ENTRIES.unshift(newEntry);

    return {
      status: 201,
      body: { success: true, data: newEntry, requestId },
    };
  }

  // List Ledger Entries (Read-only immutable stream)
  if (url.includes('/ledger/entries') && method === 'GET') {
    const parsed = new URL(url, 'http://localhost');
    const accountType = parsed.searchParams.get('accountType');
    const entryType = parsed.searchParams.get('entryType');
    const rideId = parsed.searchParams.get('rideId');
    const paymentId = parsed.searchParams.get('paymentId');
    const page = parseInt(parsed.searchParams.get('page') || '1', 10);
    const limit = parseInt(parsed.searchParams.get('limit') || '20', 10);

    let filtered = [...MOCK_LEDGER_ENTRIES];
    if (accountType && accountType !== 'ALL') {
      filtered = filtered.filter((e) => e.accountType === accountType);
    }
    if (entryType && entryType !== 'ALL') {
      filtered = filtered.filter((e) => e.entryType === entryType);
    }
    if (rideId) {
      filtered = filtered.filter((e) => e.rideId === rideId);
    }
    if (paymentId) {
      filtered = filtered.filter((e) => e.paymentId === paymentId);
    }

    const total = filtered.length;
    const pages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return {
      status: 200,
      body: {
        success: true,
        data,
        meta: { total, page, limit, pages },
        requestId,
      },
    };
  }

  return {
    status: 404,
    body: {
      success: false,
      error: { code: 'NOT_FOUND', message: `Mock endpoint not found: ${method} ${url}` },
      requestId,
    },
  };
}
