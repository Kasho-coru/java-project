package com.handover.service;

import com.handover.dto.request.ClarificationRequest;
import com.handover.dto.request.HandoverCreateRequest;
import com.handover.dto.request.HandoverUpdateRequest;
import com.handover.dto.request.RejectionRequest;
import com.handover.dto.response.HandoverDetailResponse;
import com.handover.dto.response.HandoverSummaryResponse;

import java.util.List;

public interface HandoverService {
    List<HandoverSummaryResponse> getAllHandovers(String status, Long departmentId);
    HandoverDetailResponse getHandoverById(Long id);
    List<HandoverSummaryResponse> getHandoversByEmployeeId(Long employeeId);
    HandoverDetailResponse createHandover(HandoverCreateRequest request);
    HandoverDetailResponse updateHandover(Long id, HandoverUpdateRequest request);
    HandoverDetailResponse submitHandover(Long id);
    HandoverDetailResponse approveHandover(Long id);
    HandoverDetailResponse rejectHandover(Long id, RejectionRequest request);
    HandoverDetailResponse acceptHandover(Long id);
    HandoverDetailResponse requestClarification(Long id, ClarificationRequest request);
}
