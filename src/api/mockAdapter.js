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

  return {
    status: 404,
    body: {
      success: false,
      error: { code: 'NOT_FOUND', message: `Mock endpoint not found: ${method} ${url}` },
      requestId,
    },
  };
}
