import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { safetyService } from '../../services/safetyService';
import { AlertTriangle, ShieldCheck, CheckCircle2, X } from 'lucide-react';

export function ResolveIncidentDialog({ open, onOpenChange, incident, onSuccess }) {
  const [status, setStatus] = useState('RESOLVED');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (incident) {
      setStatus(incident.status === 'REPORTED' ? 'INVESTIGATING' : 'RESOLVED');
      setResolutionNotes(incident.resolutionNotes || '');
      setReason('');
      setError(null);
    }
  }, [incident, open]);

  if (!incident) return null;

  const isReasonValid = reason.trim().length >= 5;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isReasonValid || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await safetyService.resolveIncident(incident._id, {
        status,
        resolutionNotes: resolutionNotes.trim(),
        reason: reason.trim(),
      });
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (err) {
      setError(err?.message || 'Failed to update incident resolution status.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D] rounded-2xl p-6 shadow-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-[#A31C18]/10 text-[#A31C18] dark:bg-[#A31C18]/20 dark:text-[#FF5A52]">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#5E6A64] dark:text-[#9AA6A0]">
              Safety Incident Action Desk
            </span>
          </div>
          <DialogTitle className="text-base font-bold text-[#171717] dark:text-[#F4F6F5]">
            Update Incident Resolution
          </DialogTitle>
          <DialogDescription className="text-xs text-[#5E6A64] dark:text-[#9AA6A0]">
            Transition incident state, record resolution actions, and provide mandatory written justification for audit compliance.
          </DialogDescription>
        </DialogHeader>

        {/* Incident Summary Pill */}
        <div className="p-3 my-2 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-[#171717] dark:text-[#F4F6F5]">
              {incident.type}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D] text-[#5E6A64] dark:text-[#9AA6A0]">
              Severity: {incident.severity}
            </span>
          </div>
          <p className="text-[#5E6A64] dark:text-[#9AA6A0] text-[11px] line-clamp-2">
            {incident.description}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="p-2.5 rounded-lg bg-[#FBE9E8] dark:bg-[#2A0F0E] border border-[#DC2626]/30 text-[#DC2626] dark:text-[#FF5A52] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* New Status Selection */}
          <div className="space-y-1.5">
            <label htmlFor="incident-status-select" className="font-semibold text-[#171717] dark:text-[#F4F6F5]">
              Target State <span className="text-[#DC2626]">*</span>
            </label>
            <select
              id="incident-status-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D] text-[#171717] dark:text-[#F4F6F5] font-mono focus:outline-none focus:ring-2 focus:ring-[#15803D]"
            >
              <option value="INVESTIGATING">INVESTIGATING - Under Active Desk Review</option>
              <option value="RESOLVED">RESOLVED - Investigation Complete & Closed</option>
              <option value="DISMISSED">DISMISSED - False Alarm / Rejected</option>
            </select>
          </div>

          {/* Resolution Notes */}
          <div className="space-y-1.5">
            <label htmlFor="resolution-notes" className="font-semibold text-[#171717] dark:text-[#F4F6F5]">
              Action Taken / Resolution Summary
            </label>
            <textarea
              id="resolution-notes"
              rows={3}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="e.g. Spoke with passenger, confirmed safe. Driver alerted to stay on GPS corridor."
              className="w-full p-3 rounded-xl bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D] text-[#171717] dark:text-[#F4F6F5] placeholder-[#9AA6A0] focus:outline-none focus:ring-2 focus:ring-[#15803D]"
            />
          </div>

          {/* Mandatory Audit Reason */}
          <div className="space-y-1.5">
            <label htmlFor="audit-reason" className="font-semibold text-[#171717] dark:text-[#F4F6F5] flex justify-between">
              <span>Mandatory Audit Justification <span className="text-[#DC2626]">*</span></span>
              <span className={`text-[10px] font-mono ${isReasonValid ? 'text-[#15803D] dark:text-[#1FD88A]' : 'text-[#DC2626]'}`}>
                {reason.trim().length}/5 chars min
              </span>
            </label>
            <textarea
              id="audit-reason"
              rows={2}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Written justification recorded permanently in compliance audit trail..."
              className="w-full p-2.5 rounded-xl bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D] text-[#171717] dark:text-[#F4F6F5] placeholder-[#9AA6A0] focus:outline-none focus:ring-2 focus:ring-[#15803D]"
            />
          </div>

          <DialogFooter className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8E4] dark:border-[#2A322D]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={!isReasonValid || isSubmitting}
              className="gap-1.5"
            >
              {isSubmitting ? (
                'Saving...'
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Apply Resolution
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
