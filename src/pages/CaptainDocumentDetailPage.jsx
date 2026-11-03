import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileCheck,
  FileText,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Eye,
  Check,
  Ban,
  Car,
  User,
  Calendar,
  AlertCircle,
  FileQuestion,
  RefreshCw,
} from 'lucide-react';
import { documentService } from '../services/documentService';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { ErrorState } from '../components/ui/error-state';
import { ConfirmWithReasonDialog } from '../components/common/ConfirmWithReasonDialog';
import { DocumentPreviewModal } from '../components/documents/DocumentPreviewModal';
import { PermissionGuard } from '../components/auth/PermissionGuard';
import { PERMISSIONS } from '../contracts/rbac';
import { formatKolkata, maskPhone } from '../utils/formatters';
import { useToast } from '../components/ui/toast';

const DOCUMENT_TYPE_LABELS = {
  AADHAAR_FRONT: { title: 'Aadhaar Card (Front)', category: 'Identity & Address', required: true },
  AADHAAR_BACK: { title: 'Aadhaar Card (Back)', category: 'Identity & Address', required: true },
  PAN_CARD: { title: 'PAN Card', category: 'Tax & Compliance', required: false },
  DRIVING_LICENCE_FRONT: { title: 'Driving Licence (Front)', category: 'Driving Authorisation', required: true },
  DRIVING_LICENCE_BACK: { title: 'Driving Licence (Back)', category: 'Driving Authorisation', required: true },
  VEHICLE_RC: { title: 'Vehicle Registration Certificate (RC)', category: 'Vehicle Ownership', required: true },
  VEHICLE_INSURANCE: { title: 'Vehicle Insurance Policy', category: 'Vehicle Compliance', required: true },
  PROFILE_PHOTO: { title: 'Captain Portrait Photograph', category: 'Biometric & Profile', required: true },
};

export function CaptainDocumentDetailPage() {
  const { captainId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [captain, setCaptain] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [missingRequired, setMissingRequired] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Preview Modal State
  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewSignedUrl, setPreviewSignedUrl] = useState(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Document Reject Dialog State
  const [rejectDocDialog, setRejectDocDialog] = useState(false);
  const [selectedDocForReject, setSelectedDocForReject] = useState(null);

  // Captain Approval / Reject / Suspend Dialog State
  const [captainActionDialog, setCaptainActionDialog] = useState({
    open: false,
    action: null, // 'REJECTED' | 'SUSPENDED'
    title: '',
  });

  const loadCaptainAndDocs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [cRes, dRes] = await Promise.all([
        documentService.getCaptain(captainId),
        documentService.listCaptainDocuments(captainId),
      ]);
      setCaptain(cRes.captain);
      setDocuments(dRes.documents || []);
      setMissingRequired(dRes.missingRequired || []);
    } catch (err) {
      setError(err);
      addToast({
        title: 'Failed to load candidate documents',
        description: err.message || 'Error communicating with compliance API.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [captainId, addToast]);

  useEffect(() => {
    loadCaptainAndDocs();
  }, [loadCaptainAndDocs]);

  // Open Document Preview with short-lived signed URL
  const handlePreview = async (doc) => {
    setPreviewDoc(doc);
    setIsPreviewLoading(true);
    setPreviewSignedUrl(null);

    try {
      const res = await documentService.getSignedUrl(doc._id);
      setPreviewSignedUrl(res.url);
    } catch (err) {
      addToast({
        title: 'Preview Failed',
        description: err.message || 'Could not fetch short-lived signed URL.',
        variant: 'destructive',
      });
    } finally {
      setIsPreviewLoading(false);
    }
  };

  // Quick Approve Single Document
  const handleApproveDocument = async (docId) => {
    try {
      await documentService.reviewDocument(docId, { status: 'APPROVED' });
      addToast({
        title: 'Document Approved',
        description: 'Status updated and audit log entry created.',
        variant: 'success',
      });
      loadCaptainAndDocs();
    } catch (err) {
      addToast({
        title: 'Review Action Failed',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  // Reject Single Document with written reason
  const handleConfirmDocReject = async ({ reason }) => {
    if (!selectedDocForReject) return;
    try {
      await documentService.reviewDocument(selectedDocForReject._id, {
        status: 'REJECTED',
        rejectionReason: reason,
      });
      addToast({
        title: 'Document Rejected',
        description: 'Rejection reason recorded to audit trail.',
        variant: 'default',
      });
      setRejectDocDialog(false);
      setSelectedDocForReject(null);
      loadCaptainAndDocs();
    } catch (err) {
      addToast({
        title: 'Rejection Failed',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  // Global Captain Approval Actions
  const handleApproveCaptain = async () => {
    try {
      await documentService.setCaptainApproval(captainId, { status: 'APPROVED' });
      addToast({
        title: 'Captain Approved',
        description: 'Captain is now onboarded and authorised for dispatch.',
        variant: 'success',
      });
      loadCaptainAndDocs();
    } catch (err) {
      addToast({
        title: 'Approval Failed',
        description: err.message || 'Ensure all required documents are approved.',
        variant: 'destructive',
      });
    }
  };

  const handleConfirmCaptainAction = async ({ reason }) => {
    const { action } = captainActionDialog;
    try {
      await documentService.setCaptainApproval(captainId, { status: action, reason });
      addToast({
        title: `Captain ${action === 'REJECTED' ? 'Rejected' : 'Suspended'}`,
        description: 'Status and justification logged to audit trail.',
        variant: 'default',
      });
      setCaptainActionDialog({ open: false, action: null, title: '' });
      loadCaptainAndDocs();
    } catch (err) {
      addToast({
        title: 'Action Failed',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !captain) {
    return (
      <div className="space-y-4">
        <ErrorState
          title="Failed to load captain dossier"
          message={error?.message || 'Captain record not found'}
          code={error?.code}
          requestId={error?.requestId}
          onRetry={loadCaptainAndDocs}
          secondaryAction={
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/documents')}
              className="gap-2 text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Document Review Queue
            </Button>
          }
        />
      </div>
    );
  }

  // Calculate Verification Checklist
  const totalApproved = documents.filter((d) => d.status === 'APPROVED').length;
  const hasExpiredDocs = documents.some(
    (d) => d.expiresAt && new Date(d.expiresAt) < new Date(),
  );
  const isEligibleForApproval = missingRequired.length === 0 && !hasExpiredDocs;

  return (
    <div className="space-y-6">
      {/* Top Bar Header with Captain Info & Global Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8E4] dark:border-[#2A322D]">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/documents')}
            className="gap-1.5 text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Queue
          </Button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-[#171717] dark:text-[#F4F6F5]">
                {captain.userId?.displayName || 'Captain Profile'}
              </h1>
              <Badge
                variant={
                  captain.approvalStatus === 'APPROVED'
                    ? 'success'
                    : captain.approvalStatus === 'REJECTED'
                    ? 'danger'
                    : captain.approvalStatus === 'SUSPENDED'
                    ? 'warning'
                    : 'forest'
                }
              >
                {captain.approvalStatus}
              </Badge>
              <Badge variant="outline">{captain.vehicleType || 'BIKE'}</Badge>
            </div>
            <p className="text-[11px] text-[#5E6A64] dark:text-[#9AA6A0] mt-0.5">
              Contact: {maskPhone(captain.userId?.phone)} • Email: {captain.userId?.email || '—'}
            </p>
          </div>
        </div>

        {/* Global Captain Actions Guarded by RBAC */}
        <PermissionGuard permission={PERMISSIONS.CAPTAINS_APPROVE}>
          <div className="flex items-center gap-2">
            {captain.approvalStatus !== 'APPROVED' && (
              <Button
                variant="forest"
                size="sm"
                onClick={handleApproveCaptain}
                disabled={!isEligibleForApproval}
                className="gap-1.5 text-xs"
                title={
                  !isEligibleForApproval
                    ? 'All required documents must be approved and unexpired before captain approval'
                    : 'Approve captain candidate'
                }
              >
                <Check className="w-3.5 h-3.5" />
                Approve Captain
              </Button>
            )}

            {captain.approvalStatus !== 'REJECTED' && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() =>
                  setCaptainActionDialog({
                    open: true,
                    action: 'REJECTED',
                    title: 'Reject Captain Candidate',
                  })
                }
                className="gap-1.5 text-xs"
              >
                <Ban className="w-3.5 h-3.5" />
                Reject Captain
              </Button>
            )}

            {captain.approvalStatus === 'APPROVED' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setCaptainActionDialog({
                    open: true,
                    action: 'SUSPENDED',
                    title: 'Suspend Active Captain',
                  })
                }
                className="gap-1.5 text-xs text-[#B45309] dark:text-[#F5B301]"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Suspend Fleet Access
              </Button>
            )}
          </div>
        </PermissionGuard>
      </div>

      {/* Checklist & Eligibility Overview Banner */}
      <Card
        className={`p-4 border ${
          isEligibleForApproval
            ? 'border-[#15803D]/30 bg-[#F5F7F6]/50 dark:bg-[#06110C]/60'
            : 'border-[#B45309]/30 bg-[#F5F7F6]/30 dark:bg-[#0B1A13]/50'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isEligibleForApproval
                  ? 'bg-[#15803D]/10 text-[#15803D] dark:bg-[#1FD88A]/20 dark:text-[#1FD88A]'
                  : 'bg-[#B45309]/10 text-[#B45309] dark:bg-[#F5B301]/20 dark:text-[#F5B301]'
              }`}
            >
              {isEligibleForApproval ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#171717] dark:text-[#F4F6F5]">
                {isEligibleForApproval
                  ? 'Document Requirements Met'
                  : 'Pending Document Requirements'}
              </h3>
              <p className="text-xs text-[#5E6A64] dark:text-[#9AA6A0] mt-0.5">
                {isEligibleForApproval
                  ? 'All mandatory identity, driving licence, and vehicle ownership documents are approved and valid.'
                  : `${missingRequired.length} required document(s) remaining before captain can be approved for live dispatch.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto text-xs">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#5E6A64] dark:text-[#9AA6A0] block">
                Approved Ratio
              </span>
              <span className="font-mono font-bold text-sm text-[#171717] dark:text-[#F4F6F5]">
                {totalApproved} / {Object.keys(DOCUMENT_TYPE_LABELS).length}
              </span>
            </div>
            <div className="h-8 w-px bg-[#E2E8E4] dark:bg-[#2A322D]" />
            <Button
              variant="outline"
              size="sm"
              onClick={loadCaptainAndDocs}
              className="gap-1 text-xs h-8"
            >
              <RefreshCw className="w-3 h-3" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Missing Required Warning Chips */}
        {missingRequired.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[#E2E8E4] dark:border-[#2A322D] flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-[#DC2626] dark:text-[#FF5A52]">
              Missing Mandatory:
            </span>
            {missingRequired.map((docType) => (
              <span
                key={docType}
                className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#FBE9E8] dark:bg-[#2A0F0E] text-[#DC2626] dark:text-[#FF5A52] border border-[#DC2626]/20"
              >
                {DOCUMENT_TYPE_LABELS[docType]?.title || docType}
              </span>
            ))}
          </div>
        )}
      </Card>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => {
          const meta = DOCUMENT_TYPE_LABELS[doc.type] || {
            title: doc.type?.replace(/_/g, ' '),
            category: 'Miscellaneous',
            required: false,
          };
          const isExpired = doc.expiresAt && new Date(doc.expiresAt) < new Date();
          const isExpiringSoon =
            doc.expiresAt &&
            !isExpired &&
            new Date(doc.expiresAt).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000;

          return (
            <Card key={doc._id} className="p-4 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#5E6A64] dark:text-[#9AA6A0]">
                      {meta.category} {meta.required && '• Mandatory'}
                    </span>
                    <h4 className="text-sm font-bold text-[#171717] dark:text-[#F4F6F5] mt-0.5">
                      {meta.title}
                    </h4>
                  </div>
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
                </div>

                {/* Expiry Tracking Pill */}
                <div className="mt-3 flex items-center justify-between p-2 rounded-lg bg-[#F5F7F6] dark:bg-[#0B1A13] border border-[#E2E8E4] dark:border-[#2A322D] text-xs">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#5E6A64] dark:text-[#9AA6A0]" />
                    <span className="text-[11px] text-[#5E6A64] dark:text-[#9AA6A0]">Expiry Date:</span>
                  </div>

                  {doc.expiresAt ? (
                    <span
                      className={`font-mono text-[11px] font-bold ${
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
                    <span className="text-[11px] text-[#5E6A64] dark:text-[#9AA6A0]">
                      Lifetime / No Expiry
                    </span>
                  )}
                </div>

                {/* Rejection Alert */}
                {doc.status === 'REJECTED' && doc.rejectionReason && (
                  <div className="mt-2.5 p-2.5 rounded-lg bg-[#FBE9E8] dark:bg-[#2A0F0E] border border-[#DC2626]/20 text-xs text-[#DC2626] dark:text-[#FF5A52]">
                    <span className="font-bold block text-[11px]">Reason for Rejection:</span>
                    <span className="text-[11px]">{doc.rejectionReason}</span>
                  </div>
                )}
              </div>

              {/* Action Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E2E8E4] dark:border-[#2A322D]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreview(doc)}
                  className="gap-1.5 text-xs h-8"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Preview
                </Button>

                {/* Audit Review Actions Guarded by RBAC */}
                <PermissionGuard permission={PERMISSIONS.DOCUMENTS_REVIEW}>
                  <div className="flex items-center gap-2">
                    {doc.status !== 'APPROVED' && (
                      <Button
                        variant="forest"
                        size="sm"
                        onClick={() => handleApproveDocument(doc._id)}
                        disabled={isExpired}
                        className="gap-1 text-xs h-8"
                        title={isExpired ? 'Cannot approve expired document' : 'Approve document'}
                      >
                        <Check className="w-3.5 h-3.5" />
                        Approve
                      </Button>
                    )}

                    {doc.status !== 'REJECTED' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setSelectedDocForReject(doc);
                          setRejectDocDialog(true);
                        }}
                        className="gap-1 text-xs h-8"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject
                      </Button>
                    )}
                  </div>
                </PermissionGuard>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        open={Boolean(previewDoc)}
        onOpenChange={(open) => !open && setPreviewDoc(null)}
        document={previewDoc}
        signedUrl={previewSignedUrl}
        isLoading={isPreviewLoading}
      />

      {/* Document Rejection Reason Dialog */}
      <ConfirmWithReasonDialog
        open={rejectDocDialog}
        onOpenChange={(open) => {
          setRejectDocDialog(open);
          if (!open) setSelectedDocForReject(null);
        }}
        title={`Reject ${DOCUMENT_TYPE_LABELS[selectedDocForReject?.type]?.title || 'Document'}`}
        description="Provide a clear compliance reason for document rejection (e.g. illegible text, wrong document type, expired validity)."
        actionName="document.review.reject"
        targetId={selectedDocForReject?._id}
        targetType="Document"
        confirmLabel="Confirm Rejection"
        confirmVariant="destructive"
        onConfirm={handleConfirmDocReject}
      />

      {/* Global Captain Status Dialog (Reject or Suspend) */}
      <ConfirmWithReasonDialog
        open={captainActionDialog.open}
        onOpenChange={(open) =>
          setCaptainActionDialog((prev) => ({ ...prev, open }))
        }
        title={captainActionDialog.title}
        description="Every captain status modification requires a written reason for compliance and immutable audit logging."
        actionName={`captain.${captainActionDialog.action?.toLowerCase()}`}
        targetId={captainId}
        targetType="Captain"
        confirmLabel={`Confirm ${captainActionDialog.action === 'REJECTED' ? 'Rejection' : 'Suspension'}`}
        confirmVariant="destructive"
        onConfirm={handleConfirmCaptainAction}
      />
    </div>
  );
}
