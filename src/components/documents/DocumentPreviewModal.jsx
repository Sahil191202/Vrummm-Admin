import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  ExternalLink,
  ShieldAlert,
  FileText,
  Clock,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { formatKolkata } from '../../utils/formatters';

export function DocumentPreviewModal({
  open = false,
  onOpenChange,
  document: doc,
  signedUrl,
  isLoading = false,
}) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 300s signed URL expiry

  // Reset zoom & rotation whenever a new document opens
  useEffect(() => {
    if (open) {
      setZoom(1);
      setRotation(0);
      setTimeLeft(300);
    }
  }, [open, doc?._id]);

  // Countdown timer for 300s signed URL expiration
  useEffect(() => {
    if (!open) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [open]);

  if (!doc) return null;

  const isPdf = doc.fileFormat?.includes('pdf') || signedUrl?.includes('.pdf');
  const isExpired = doc.expiresAt && new Date(doc.expiresAt) < new Date();
  const isExpiringSoon =
    doc.expiresAt &&
    !isExpired &&
    new Date(doc.expiresAt).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000;

  const handleZoomIn = () => setZoom((z) => Math.min(Number((z + 0.25).toFixed(2)), 2.5));
  const handleZoomOut = () => setZoom((z) => Math.max(Number((z - 0.25).toFixed(2)), 0.5));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} maxWidth="max-w-4xl" className="p-4 sm:p-5">
      <div className="space-y-3">
        {/* Compact Header: Title + Status + Controls all in one view */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-[#E2E8E4] dark:border-[#2A322D] pr-8">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="p-1.5 rounded-lg bg-[#15803D]/10 text-[#15803D] dark:bg-[#1FD88A]/15 dark:text-[#1FD88A]">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-[#171717] dark:text-[#F4F6F5] capitalize leading-none">
                  {doc.type?.replace(/_/g, ' ').toLowerCase()}
                </h3>
                <Badge
                  variant={
                    doc.status === 'APPROVED'
                      ? 'success'
                      : doc.status === 'REJECTED'
                      ? 'danger'
                      : 'warning'
                  }
                  className="text-[11px] font-bold py-0 px-2"
                >
                  {doc.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-[#5E6A64] dark:text-[#9AA6A0] font-mono">
                <span>{doc.fileFormat?.replace('image/', '').toUpperCase() || 'JPEG'}</span>
                <span>•</span>
                <span>{doc.fileSizeBytes ? `${(doc.fileSizeBytes / 1024 / 1024).toFixed(2)} MB` : '0.2 MB'}</span>
                <span>•</span>
                <span>Uploaded {formatKolkata(doc.createdAt, 'dateOnly')}</span>
                {doc.expiresAt && (
                  <>
                    <span>•</span>
                    <span className={isExpired ? 'text-[#DC2626] dark:text-[#FF5A52] font-bold' : ''}>
                      Exp: {formatKolkata(doc.expiresAt, 'dateOnly')}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Inspection Toolset (Zoom, Rotate, Timer) */}
          {!isPdf && signedUrl && (
            <div className="flex items-center gap-1.5 bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] rounded-xl px-2.5 py-1 self-start sm:self-auto shadow-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                title="Zoom Out (-25%)"
                className="h-7 w-7 p-0"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </Button>
              <button
                type="button"
                onClick={handleReset}
                title="Reset Zoom to 100%"
                className="text-[11px] font-mono px-1.5 py-0.5 rounded text-[#171717] dark:text-[#F4F6F5] hover:bg-[#E2E8E4] dark:hover:bg-[#171717] transition-colors"
              >
                {Math.round(zoom * 100)}%
              </button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                title="Zoom In (+25%)"
                className="h-7 w-7 p-0"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </Button>

              <div className="h-4 w-px bg-[#E2E8E4] dark:bg-[#2A322D] mx-0.5" />

              <Button
                variant="ghost"
                size="sm"
                onClick={handleRotate}
                title="Rotate 90° Clockwise"
                className="h-7 w-7 p-0"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </Button>

              <div className="h-4 w-px bg-[#E2E8E4] dark:bg-[#2A322D] mx-0.5" />

              <div
                className="flex items-center gap-1 text-[11px] font-mono text-[#5E6A64] dark:text-[#9AA6A0] pl-1"
                title="Signed URL expiration countdown"
              >
                <Clock className="w-3 h-3 text-[#B45309] dark:text-[#F5B301]" />
                <span className="font-semibold text-[#171717] dark:text-[#F4F6F5]">{formatTimer(timeLeft)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Rejection Alert if rejected */}
        {doc.status === 'REJECTED' && doc.rejectionReason && (
          <div className="p-2.5 rounded-xl bg-[#FBE9E8] dark:bg-[#2A0F0E] border border-[#DC2626]/30 text-xs text-[#DC2626] dark:text-[#FF5A52] flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Rejection Justification: </strong>
              <span>{doc.rejectionReason}</span>
            </div>
          </div>
        )}

        {/* Document Viewport with adaptive theme background */}
        <div className="relative h-[420px] sm:h-[460px] w-full rounded-2xl bg-[#F5F7F6] border border-[#E2E8E4] dark:bg-[#06110C] dark:border-[#2A322D] flex items-center justify-center p-3 overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="text-center py-16 space-y-2">
              <div className="w-8 h-8 rounded-full border-2 border-[#A31C18] border-t-transparent animate-spin mx-auto" />
              <p className="text-xs font-semibold text-[#5E6A64] dark:text-[#9AA6A0]">
                Generating secure single-use signed URL...
              </p>
            </div>
          ) : signedUrl ? (
            isPdf ? (
              <iframe
                src={signedUrl}
                title={doc.type}
                className="w-full h-full rounded-xl border-0"
              />
            ) : (
              <div
                className="relative flex items-center justify-center w-full h-full overflow-auto"
                style={{ cursor: zoom > 1 ? 'grab' : 'default' }}
              >
                <div
                  className="transition-transform duration-150 ease-out select-none flex items-center justify-center"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  }}
                >
                  {/* Clean, completely unobstructed document image */}
                  <img
                    src={signedUrl}
                    alt={doc.type}
                    className="max-h-[390px] max-w-full object-contain rounded-xl shadow-md border border-[#E2E8E4]/60 dark:border-transparent block mx-auto"
                    draggable={false}
                  />
                </div>
              </div>
            )
          ) : (
            <div className="text-center py-16 text-xs text-[#5E6A64] dark:text-[#9AA6A0]">
              <ShieldAlert className="w-8 h-8 mx-auto mb-2 text-[#9AA6A0]" />
              No preview available for this document record.
            </div>
          )}

          {/* Discrete, non-obstructive compliance security watermark in bottom-right corner */}
          <div className="pointer-events-none absolute bottom-2.5 right-3 select-none flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/80 dark:bg-black/60 backdrop-blur-sm border border-[#E2E8E4] dark:border-white/10 text-[10px] font-mono text-[#5E6A64] dark:text-[#9AA6A0]">
            <ShieldCheck className="w-3 h-3 text-[#15803D] dark:text-[#1FD88A]" />
            <span>VRUMM AUDIT REVIEW • STRICTLY CONFIDENTIAL</span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-[#E2E8E4] dark:border-[#2A322D]">
          <div className="flex items-center gap-1.5 text-[11px] text-[#5E6A64] dark:text-[#9AA6A0]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] dark:text-[#1FD88A]" />
            <span>Encrypted preview stream • Access logged to compliance audit trail</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {signedUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(signedUrl, '_blank', 'noopener,noreferrer')}
                className="gap-1.5 text-xs h-8"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open Original in New Tab
              </Button>
            )}
            <Button
              variant="default"
              size="sm"
              onClick={() => onOpenChange?.(false)}
              className="text-xs h-8 px-4 font-bold"
            >
              Done Reviewing
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
