import { describe, it, expect, vi, beforeEach } from 'vitest';
import { documentService } from './documentService';
import { apiClient } from '../api/client';

vi.mock('../api/client', () => ({
  apiClient: vi.fn(),
}));

describe('Document Service (documentService)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('builds listCaptains query params with pagination and approvalStatus filter', async () => {
    apiClient.mockResolvedValueOnce({
      success: true,
      data: [{ _id: 'cap_01', approvalStatus: 'PENDING' }],
      meta: { total: 1, page: 2, pages: 3, limit: 10 },
      requestId: 'req_123',
    });

    const res = await documentService.listCaptains({
      page: 2,
      limit: 10,
      approvalStatus: 'PENDING',
      search: 'Suresh',
    });

    expect(apiClient).toHaveBeenCalledWith(
      '/captains?page=2&limit=10&approvalStatus=PENDING&search=Suresh',
    );
    expect(res.total).toBe(1);
    expect(res.page).toBe(2);
    expect(res.captains).toHaveLength(1);
  });

  it('reviews a document with status and mandatory rejection reason', async () => {
    apiClient.mockResolvedValueOnce({
      success: true,
      data: { _id: 'doc_01', status: 'REJECTED', rejectionReason: 'Illegible photocopy' },
      requestId: 'req_456',
    });

    const res = await documentService.reviewDocument('doc_01', {
      status: 'REJECTED',
      rejectionReason: 'Illegible photocopy',
    });

    expect(apiClient).toHaveBeenCalledWith('/documents/doc_01/review', {
      method: 'PATCH',
      body: JSON.stringify({ status: 'REJECTED', rejectionReason: 'Illegible photocopy' }),
    });
    expect(res.document.status).toBe('REJECTED');
  });

  it('submits captain approval status modification with written justification', async () => {
    apiClient.mockResolvedValueOnce({
      success: true,
      data: { _id: 'cap_01', approvalStatus: 'SUSPENDED' },
      requestId: 'req_789',
    });

    const res = await documentService.setCaptainApproval('cap_01', {
      status: 'SUSPENDED',
      reason: 'Driver license expired and pending re-verification',
    });

    expect(apiClient).toHaveBeenCalledWith('/captains/cap_01/approval', {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'SUSPENDED',
        reason: 'Driver license expired and pending re-verification',
      }),
    });
    expect(res.captain.approvalStatus).toBe('SUSPENDED');
  });

  it('requests short-lived signed URL for secure preview', async () => {
    apiClient.mockResolvedValueOnce({
      success: true,
      data: {
        url: 'https://storage.vrumm.dev/signed/doc_01.jpg?token=abc',
        expiresInSeconds: 300,
        documentType: 'DRIVING_LICENCE_FRONT',
        status: 'APPROVED',
      },
      requestId: 'req_signed',
    });

    const res = await documentService.getSignedUrl('doc_01');

    expect(apiClient).toHaveBeenCalledWith('/documents/doc_01/url');
    expect(res.url).toContain('https://storage.vrumm.dev/signed/doc_01.jpg');
    expect(res.expiresInSeconds).toBe(300);
  });
});
