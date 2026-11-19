import React, { useState, useEffect } from 'react';
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
  LifeBuoy,
  Send,
  User,
  Shield,
  Clock,
  Car,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export function TicketDetailModal({ open, onOpenChange, ticket, onTicketUpdated }) {
  const [activeTicket, setActiveTicket] = useState(ticket);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [targetStatus, setTargetStatus] = useState(ticket?.status || 'OPEN');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setActiveTicket(ticket);
    setTargetStatus(ticket?.status || 'OPEN');
    setNewMessage('');
    setError(null);
  }, [ticket, open]);

  if (!activeTicket) return null;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    try {
      setIsSending(true);
      setError(null);
      const res = await safetyService.addTicketMessage(activeTicket._id, {
        message: newMessage.trim(),
      });
      setActiveTicket(res.ticket);
      setNewMessage('');
      if (onTicketUpdated) onTicketUpdated(res.ticket);
    } catch (err) {
      setError(err?.message || 'Failed to dispatch ticket response message.');
    } finally {
      setIsSending(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setIsUpdatingStatus(true);
      setError(null);
      const res = await safetyService.updateTicketStatus(activeTicket._id, {
        status: newStatus,
      });
      setActiveTicket(res.ticket);
      setTargetStatus(res.ticket.status);
      if (onTicketUpdated) onTicketUpdated(res.ticket);
    } catch (err) {
      setError(err?.message || 'Failed to update ticket status.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D] rounded-2xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
        <DialogHeader className="border-b border-[#E2E8E4] dark:border-[#2A322D] pb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-[#15803D]/10 text-[#15803D] dark:bg-[#1FD88A]/20 dark:text-[#1FD88A]">
                <LifeBuoy className="w-4 h-4" />
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#5E6A64] dark:text-[#9AA6A0]">
                Support Ticket Desk
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-[10px]">
                {activeTicket.category}
              </Badge>
              <Badge
                variant={
                  activeTicket.priority === 'URGENT'
                    ? 'danger'
                    : activeTicket.priority === 'HIGH'
                    ? 'warning'
                    : 'secondary'
                }
                className="font-mono text-[10px]"
              >
                {activeTicket.priority}
              </Badge>
            </div>
          </div>
          <DialogTitle className="text-base font-bold text-[#171717] dark:text-[#F4F6F5] mt-1">
            {activeTicket.subject}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#5E6A64] dark:text-[#9AA6A0]">
            User: {activeTicket.user?.name} ({activeTicket.user?.email || activeTicket.user?.role})
            {activeTicket.rideId && ` • Ride: ${activeTicket.rideId.slice(-8)}`}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="my-2 p-2.5 rounded-lg bg-[#FBE9E8] dark:bg-[#2A0F0E] border border-[#DC2626]/30 text-[#DC2626] dark:text-[#FF5A52] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Status Transition Header Pill */}
        <div className="flex items-center justify-between gap-3 p-3 my-2 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#5E6A64] dark:text-[#9AA6A0]">Current Status:</span>
            <Badge
              variant={
                activeTicket.status === 'OPEN'
                  ? 'warning'
                  : activeTicket.status === 'IN_PROGRESS'
                  ? 'forest'
                  : 'secondary'
              }
              className="font-mono text-xs"
            >
              {activeTicket.status}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="ticket-status-select" className="text-[#5E6A64] dark:text-[#9AA6A0] text-[11px]">
              Transition to:
            </label>
            <select
              id="ticket-status-select"
              value={targetStatus}
              disabled={isUpdatingStatus}
              onChange={(e) => {
                const nextStatus = e.target.value;
                setTargetStatus(nextStatus);
                handleStatusChange(nextStatus);
              }}
              className="h-8 px-2 rounded-lg bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D] text-[#171717] dark:text-[#F4F6F5] font-mono text-xs"
            >
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
        </div>

        {/* Message Thread Stream */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 my-2">
          {(!activeTicket.messages || activeTicket.messages.length === 0) ? (
            <div className="py-8 text-center text-xs text-[#5E6A64] dark:text-[#9AA6A0]">
              No message logs attached to this ticket.
            </div>
          ) : (
            activeTicket.messages.map((m, idx) => {
              const isSupport = m.role === 'SUPPORT' || m.role === 'ADMIN';
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                    isSupport
                      ? 'bg-[#15803D]/5 dark:bg-[#1FD88A]/5 border-[#15803D]/20 ml-6'
                      : 'bg-[#F5F7F6] dark:bg-[#0B1A13] border-[#E2E8E4] dark:border-[#2A322D] mr-6'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 font-bold text-[#171717] dark:text-[#F4F6F5]">
                      {isSupport ? (
                        <Shield className="w-3.5 h-3.5 text-[#15803D] dark:text-[#1FD88A]" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-[#5E6A64] dark:text-[#9AA6A0]" />
                      )}
                      <span>{m.sender}</span>
                      <span className="text-[10px] font-mono font-normal px-1.5 py-0.2 rounded bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D] text-[#5E6A64] dark:text-[#9AA6A0]">
                        {m.role}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#5E6A64] dark:text-[#9AA6A0] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {m.at ? formatKolkata(m.at, 'dateTime') : 'Just now'}
                    </span>
                  </div>
                  <p className="text-[#171717] dark:text-[#F4F6F5] leading-relaxed whitespace-pre-wrap">
                    {m.message}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Message Reply Form */}
        <form onSubmit={handleSendMessage} className="pt-3 border-t border-[#E2E8E4] dark:border-[#2A322D] space-y-2">
          <div className="flex gap-2">
            <textarea
              rows={2}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your response to the customer/captain..."
              className="flex-1 p-2.5 rounded-xl bg-white dark:bg-[#171717] border border-[#E2E8E4] dark:border-[#2A322D] text-xs text-[#171717] dark:text-[#F4F6F5] placeholder-[#9AA6A0] focus:outline-none focus:ring-2 focus:ring-[#15803D]"
            />
            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={!newMessage.trim() || isSending}
              className="self-end gap-1.5 h-10 px-4"
            >
              <Send className="w-3.5 h-3.5" />
              {isSending ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
