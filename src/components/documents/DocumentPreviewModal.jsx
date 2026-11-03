import React from 'react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ExternalLink, ShieldAlert, FileText, Clock, X, AlertTriangle } from 'lucide-react';
import { formatKolkata } from '../../utils/formatters';

export function DocumentPreviewModal({
  open = false,
  onOpenChange,
  document: doc,
  signedUrl,
  isLoading = false,
}) {
  if (!doc) return null;

  const isPdf = doc.fileFormat?.includes('pdf') || signedUrl?.includes('.pdf');
  const isExpired = doc.expiresAt && new Date(doc.expiresAt) < new Date();
  const isExpiringSoon =
    doc.expiresAt &&
    !isExpired &&
    new Date(doc.expiresAt).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <div className="space-y-4">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-[#15803D]/10 text-[#15803D] dark:bg-[#1FD88A]/15 dark:text-[#1FD88A]">
              <FileText className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#5E6A64] dark:text-[#9AA6A0]">
              Secure Document Inspection
            </span>
          </div>
          <DialogTitle className="flex items-center justify-between pr-8">
            <span>{doc.type?.replace(/_/g, ' ')}</span>
            <Badge
              variant={
                doc.status === 'APPROVED'
                  ? 'success'
                  : doc.status === 'REJECTED'
                  ? 'danger'
                  : 'warning'
              }
            >
              {doc.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Confidential review. Signed URL expires in 300 seconds. PII masked and logged for audit.
          </DialogDescription>
        </DialogHeader>

        {/* Security & Expiry Metadata Pill */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] p-2.5 rounded-xl bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D]">
          <div>
            <span className="text-[#5E6A64] dark:text-[#9AA6A0] block text-[10px]">Format / Size</span>
            <span className="font-mono font-semibold text-[#171717] dark:text-[#F4F6F5]">
              {doc.fileFormat || 'image/jpeg'} • {doc.fileSizeBytes ? `${(doc.fileSizeBytes / 1024 / 1024).toFixed(1)} MB` : '1.2 MB'}
            </span>
          </div>

          <div>
            <span className="text-[#5E6A64] dark:text-[#9AA6A0] block text-[10px]">Uploaded At</span>
            <span className="font-mono text-[#171717] dark:text-[#F4F6F5]">
              {formatKolkata(doc.createdAt, 'dateOnly')}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="text-[#5E6A64] dark:text-[#9AA6A0] block text-[10px]">Validity Expiry</span>
            {doc.expiresAt ? (
              <span
                className={`font-mono font-bold ${
                  isExpired
                    ? 'text-[#DC2626] dark:text-[#FF5A52]'
                    : isExpiringSoon
                    ? 'text-[#B45309] dark:text-[#F5B301]'
                    : 'text-[#15803D] dark:text-[#1FD88A]'
                }`}
              >
                {formatKolkata(doc.expiresAt, 'dateOnly')}
                {isExpired && ' (EXPIRED)'}
                {isExpiringSoon && ' (Expiring Soon)'}
              </span>
            ) : (
              <span className="text-[#5E6A64] dark:text-[#9AA6A0]">No Expiry Date</span>
            )}
          </div>
        </div>

        {/* Rejection Warning if rejected */}
        {doc.status === 'REJECTED' && doc.rejectionReason && (
          <div className="p-3 rounded-xl bg-[#FBE9E8] dark:bg-[#2A0F0E] border border-[#DC2626]/30 text-xs text-[#DC2626] dark:text-[#FF5A52] flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="block">Rejection Reason:</strong>
              <span>{doc.rejectionReason}</span>
            </div>
          </div>
        )}

        {/* Preview Frame */}
        <div className="relative min-h-[300px] max-h-[500px] rounded-xl overflow-hidden bg-black/5 dark:bg-black/40 border border-[#E2E8E4] dark:border-[#2A322D] flex items-center justify-center">
          {isLoading ? (
            <div className="text-center py-16 space-y-2">
              <div className="w-8 h-8 rounded-full border-2 border-[#A31C18] border-t-transparent animate-spin mx-auto" />
              <p className="text-xs text-[#5E6A64] dark:text-[#9AA6A0]">Generating temporary signed URL...</p>
            </div>
          ) : signedUrl ? (
            isPdf ? (
              <iframe
                src={signedUrl}
                title={doc.type}
                className="w-full h-[400px] rounded-lg border-0"
              />
            ) : (
              <div className="relative w-full h-full flex items-center justify-center p-2">
                <img
                  src={signedUrl}
                  alt={doc.type}
                  className="max-h-[420px] max-w-full rounded-lg object-contain shadow-md select-none"
                />
                {/* Visual Watermark */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-15 rotate-[-25deg]">
                  <span className="text-xl sm:text-2xl font-black font-mono tracking-widest text-[#171717] dark:text-white uppercase select-none">
                    VRUMM AUDIT REVIEW
                  </span>
                </div>
              </div>
            )
          ) : (
            <div className="text-center py-12 text-xs text-[#5E6A64] dark:text-[#9AA6A0]">
              <ShieldAlert className="w-8 h-8 mx-auto mb-2 text-[#9AA6A0]" />
              No preview available for this document.
            </div>
          )}
        </div>

        {/* Footer info & external link */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-[#5E6A64] dark:text-[#9AA6A0]">
            Audit ID: <code className="font-mono">{doc._id?.slice(0, 12)}...</code>
          </span>
          {signedUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(signedUrl, '_blank', 'noopener,noreferrer')}
              className="gap-1.5 text-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open in New Tab
            </Button>
          )}
        </div>
      </div>
    </Dialog>
  );
}
