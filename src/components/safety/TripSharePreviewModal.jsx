import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { safetyService } from '../../services/safetyService';
import { formatKolkata } from '../../utils/formatters';
import {
  Share2,
  Navigation,
  MapPin,
  Car,
  Shield,
  PhoneCall,
  Search,
  AlertCircle,
} from 'lucide-react';

export function TripSharePreviewModal({ open, onOpenChange, initialToken = '' }) {
  const [tokenInput, setTokenInput] = useState(initialToken);
  const [sharedTrip, setSharedTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTripShare = async (tokenToFetch) => {
    const query = tokenToFetch || tokenInput;
    if (!query.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      const res = await safetyService.getSharedTrip(query.trim());
      setSharedTrip(res.sharedTrip);
    } catch (err) {
      setError(err?.message || 'Shared trip not found or link has expired.');
      setSharedTrip(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D] rounded-2xl p-6 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-[#15803D]/10 text-[#15803D] dark:bg-[#1FD88A]/20 dark:text-[#1FD88A]">
              <Share2 className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#5E6A64] dark:text-[#9AA6A0]">
              Public Safety Trip-Share
            </span>
          </div>
          <DialogTitle className="text-base font-bold text-[#171717] dark:text-[#F4F6F5]">
            Trip-Share Token Inspection
          </DialogTitle>
          <DialogDescription className="text-xs text-[#5E6A64] dark:text-[#9AA6A0]">
            Simulate the emergency live tracker shared with passenger contacts.
          </DialogDescription>
        </DialogHeader>

        {/* Token Search Bar */}
        <div className="flex gap-2 my-2">
          <input
            type="text"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Enter trip share token (e.g. share_tok_001)..."
            className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D] text-[#171717] dark:text-[#F4F6F5] font-mono focus:outline-none focus:ring-2 focus:ring-[#15803D]"
          />
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => fetchTripShare(tokenInput)}
            disabled={!tokenInput.trim() || isLoading}
            className="gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            {isLoading ? 'Checking...' : 'Inspect'}
          </Button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-[#FBE9E8] dark:bg-[#2A0F0E] border border-[#DC2626]/30 text-[#DC2626] dark:text-[#FF5A52] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {sharedTrip && (
          <div className="space-y-4 pt-2 text-xs">
            {/* Status & Vehicle Pill */}
            <div className="p-3 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-[#15803D] dark:text-[#1FD88A]" />
                <div>
                  <span className="font-bold text-[#171717] dark:text-[#F4F6F5] block">
                    {sharedTrip.vehicleType || 'AUTO'} • {sharedTrip.vehicleNumber || 'MH02BZ4921'}
                  </span>
                  <span className="text-[10px] text-[#5E6A64] dark:text-[#9AA6A0]">
                    Captain: {sharedTrip.captainName || 'Assigned Fleet Driver'}
                  </span>
                </div>
              </div>
              <Badge variant="success" className="font-mono">
                {sharedTrip.status || 'IN_PROGRESS'}
              </Badge>
            </div>

            {/* Route Points */}
            <div className="space-y-2 p-3 rounded-xl bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D]">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#15803D] dark:text-[#1FD88A] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-[#5E6A64] dark:text-[#9AA6A0] uppercase font-bold block">
                    Pickup Location
                  </span>
                  <span className="text-[#171717] dark:text-[#F4F6F5] font-medium">
                    {sharedTrip.pickup?.address || 'Linking Road, Bandra West, Mumbai'}
                  </span>
                </div>
              </div>

              <div className="border-t border-[#E2E8E4] dark:border-[#2A322D] pt-2 flex items-start gap-2">
                <Navigation className="w-3.5 h-3.5 text-[#A31C18] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-[#5E6A64] dark:text-[#9AA6A0] uppercase font-bold block">
                    Destination Drop
                  </span>
                  <span className="text-[#171717] dark:text-[#F4F6F5] font-medium">
                    {sharedTrip.drop?.address || 'Chhatrapati Shivaji Maharaj Terminus (CSMT), Mumbai'}
                  </span>
                </div>
              </div>
            </div>

            {/* Emergency Hotline Alert */}
            <div className="p-3 rounded-xl bg-[#15803D]/10 dark:bg-[#1FD88A]/10 border border-[#15803D]/30 flex items-center justify-between text-[#15803D] dark:text-[#1FD88A]">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="font-semibold">Vrumm 24x7 Safety Emergency Line</span>
              </div>
              <span className="font-mono font-bold">112 / 100</span>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
