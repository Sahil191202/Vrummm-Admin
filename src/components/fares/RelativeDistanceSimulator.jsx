import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Compass,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Navigation,
  MapPin,
  Car,
} from 'lucide-react';

// Exact haversine formula in metres as used in backend distance.rules.js
function haversineMetres([lon1, lat1], [lon2, lat2]) {
  const R = 6371000; // Earth radius in metres
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

const PRESET_MUMBAI_SCENARIOS = [
  {
    name: 'Scenario 1: Captain Heading Toward Pickup (PASS)',
    description: 'Captain in Bandra West, Customer at Linking Road heading to BKC.',
    captain: [72.836, 19.058], // Bandra West
    pickup: [72.833, 19.06], // Linking Road
    drop: [72.868, 19.066], // BKC G-Block
    vehicleType: 'BIKE',
    expectedRuleB: true,
  },
  {
    name: 'Scenario 2: Captain Near Drop, Heading Away from Pickup (FAIL Rule B)',
    description: 'Captain is already in BKC (near drop), but customer is at Bandra West (pickup).',
    captain: [72.865, 19.065], // Already in BKC!
    pickup: [72.833, 19.06], // Linking Road
    drop: [72.868, 19.066], // BKC G-Block
    vehicleType: 'BIKE',
    expectedRuleB: false,
  },
  {
    name: 'Scenario 3: Captain Far Outside Search Radius (FAIL Rule A)',
    description: 'Captain is in Santacruz East (4,500m away, exceeds 2,500m initial radius).',
    captain: [72.855, 19.09], // Santacruz
    pickup: [72.833, 19.06], // Linking Road
    drop: [72.868, 19.066], // BKC
    vehicleType: 'BIKE',
    expectedRuleB: true,
  },
];

export function RelativeDistanceSimulator({
  initialRadiusMetres = 2500,
  ruleBEnabledForBike = true,
}) {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const scenario = PRESET_MUMBAI_SCENARIOS[selectedScenarioIndex];

  const [captainCoords, setCaptainCoords] = useState(scenario.captain);
  const [pickupCoords, setPickupCoords] = useState(scenario.pickup);
  const [dropCoords, setDropCoords] = useState(scenario.drop);
  const [vehicleType, setVehicleType] = useState('BIKE');

  // Load preset scenario
  const handleSelectScenario = (idx) => {
    setSelectedScenarioIndex(idx);
    const s = PRESET_MUMBAI_SCENARIOS[idx];
    setCaptainCoords(s.captain);
    setPickupCoords(s.pickup);
    setDropCoords(s.drop);
    setVehicleType(s.vehicleType);
  };

  // Live evaluation of Rule A and Rule B
  const evaluation = useMemo(() => {
    const distToPickup = haversineMetres(captainCoords, pickupCoords);
    const distToDrop = haversineMetres(captainCoords, dropCoords);

    // Rule A: Within pickup radius
    const passRuleA = distToPickup <= initialRadiusMetres;

    // Rule B: Relative Distance (captain-to-drop > captain-to-pickup)
    const ruleBActive = vehicleType === 'CAB' ? false : ruleBEnabledForBike;
    const passRuleB = !ruleBActive || distToDrop > distToPickup;

    const overallEligible = passRuleA && passRuleB;

    return {
      distToPickup,
      distToDrop,
      passRuleA,
      passRuleB,
      ruleBActive,
      overallEligible,
    };
  }, [captainCoords, pickupCoords, dropCoords, vehicleType, initialRadiusMetres, ruleBEnabledForBike]);

  return (
    <Card className="border border-[#E2E8E4] dark:border-[#2A322D]">
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1 rounded-md bg-[#15803D]/10 text-[#15803D] dark:bg-[#1FD88A]/15 dark:text-[#1FD88A]">
            <Compass className="w-4 h-4" />
          </span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#5E6A64] dark:text-[#9AA6A0]">
            Interactive Rule Engine Simulator
          </span>
        </div>
        <CardTitle className="text-base">Relative-Distance (Rule B) & Pickup Radius (Rule A)</CardTitle>
        <CardDescription>
          Simulate how Vrumm excludes captains who are closer to the destination than to the pickup point.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Scenario Selection Pills */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0]">
            Preset Mumbai Operational Scenarios:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PRESET_MUMBAI_SCENARIOS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectScenario(idx)}
                className={`p-2.5 rounded-xl text-left transition-all border text-xs ${
                  selectedScenarioIndex === idx
                    ? 'border-[#A31C18] bg-[#FBE9E8]/40 dark:bg-[#2A0F0E]/50 text-[#171717] dark:text-[#F4F6F5] font-semibold'
                    : 'border-[#E2E8E4] dark:border-[#2A322D] bg-white dark:bg-[#171717] text-[#5E6A64] dark:text-[#9AA6A0] hover:bg-[#F5F7F6]'
                }`}
              >
                <div className="font-bold text-[11px] mb-0.5">{s.name.split(':')[0]}</div>
                <div className="text-[10px] line-clamp-2">{s.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Live Calculation Results Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Distance Calculations */}
          <div className="p-4 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#5E6A64] dark:text-[#9AA6A0]">
              Calculated Geodesic Distances
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D]">
                <span className="flex items-center gap-1.5 text-[#5E6A64] dark:text-[#9AA6A0]">
                  <MapPin className="w-3.5 h-3.5 text-[#15803D] dark:text-[#1FD88A]" />
                  Captain to Pickup:
                </span>
                <span className="font-mono font-bold text-sm text-[#171717] dark:text-[#F4F6F5]">
                  {evaluation.distToPickup.toLocaleString()} m
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D]">
                <span className="flex items-center gap-1.5 text-[#5E6A64] dark:text-[#9AA6A0]">
                  <Navigation className="w-3.5 h-3.5 text-[#A31C18]" />
                  Captain to Drop:
                </span>
                <span className="font-mono font-bold text-sm text-[#171717] dark:text-[#F4F6F5]">
                  {evaluation.distToDrop.toLocaleString()} m
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D]">
                <span className="text-[#5E6A64] dark:text-[#9AA6A0]">Initial Search Radius:</span>
                <span className="font-mono font-bold text-xs text-[#5E6A64] dark:text-[#9AA6A0]">
                  {initialRadiusMetres.toLocaleString()} m
                </span>
              </div>
            </div>
          </div>

          {/* Rule Evaluation Verdicts */}
          <div className="p-4 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#5E6A64] dark:text-[#9AA6A0] mb-2">
                Dispatch Rule Evaluation
              </h4>

              <div className="space-y-2 text-xs">
                {/* Rule A */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-[#171717] dark:text-[#F4F6F5] block">
                      Rule A: Max Pickup Radius
                    </span>
                    <span className="text-[10px] text-[#5E6A64] dark:text-[#9AA6A0]">
                      Captain must be within {initialRadiusMetres}m
                    </span>
                  </div>
                  {evaluation.passRuleA ? (
                    <Badge variant="success" className="gap-1">
                      <CheckCircle2 className="w-3 h-3" /> PASS
                    </Badge>
                  ) : (
                    <Badge variant="danger" className="gap-1">
                      <XCircle className="w-3 h-3" /> FAILED
                    </Badge>
                  )}
                </div>

                {/* Rule B */}
                <div className="flex items-center justify-between pt-1 border-t border-[#E2E8E4] dark:border-[#2A322D]">
                  <div>
                    <span className="font-semibold text-[#171717] dark:text-[#F4F6F5] block">
                      Rule B: Relative-Distance
                    </span>
                    <span className="text-[10px] text-[#5E6A64] dark:text-[#9AA6A0]">
                      Captain must be farther from Drop than Pickup
                    </span>
                  </div>
                  {evaluation.passRuleB ? (
                    <Badge variant="success" className="gap-1">
                      <CheckCircle2 className="w-3 h-3" /> PASS
                    </Badge>
                  ) : (
                    <Badge variant="warning" className="gap-1">
                      <AlertTriangle className="w-3 h-3" /> EXCLUDED
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Overall Status Pill */}
            <div
              className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                evaluation.overallEligible
                  ? 'bg-[#15803D]/10 text-[#15803D] dark:bg-[#1FD88A]/15 dark:text-[#1FD88A] border-[#15803D]/30'
                  : 'bg-[#FBE9E8] dark:bg-[#2A0F0E] text-[#DC2626] dark:text-[#FF5A52] border-[#DC2626]/30'
              }`}
            >
              <span className="font-bold">
                {evaluation.overallEligible ? 'CAPTAIN ELIGIBLE FOR OFFER' : 'CAPTAIN EXCLUDED FROM DISPATCH'}
              </span>
              <span className="text-[11px] font-mono">
                {evaluation.overallEligible ? 'Offer Dispatched' : 'Skipped in Round 1'}
              </span>
            </div>
          </div>
        </div>

        {/* Informational Guidance Callout */}
        <div className="p-3 rounded-xl bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D] text-xs text-[#5E6A64] dark:text-[#9AA6A0] space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#171717] dark:text-[#F4F6F5]">
            <Info className="w-4 h-4 text-[#15803D] dark:text-[#1FD88A]" />
            Why Relative-Distance Rule (Rule B) Exists:
          </div>
          <p className="leading-relaxed">
            In high-density traffic clusters like Mumbai, a driver who is physically closer to the destination than to the passenger is heading in the wrong direction. Dispatching an offer to them leads to high cancellation rates and prolonged passenger waiting times. Rule B preserves fleet efficiency by offering rides only to captains positioned along the approach corridor.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
