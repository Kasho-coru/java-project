package com.handover.controller;

import com.handover.dto.ApiResponse;
import com.handover.dto.request.ClarificationRequest;
import com.handover.dto.request.HandoverCreateRequest;
import com.handover.dto.request.HandoverUpdateRequest;
import com.handover.dto.request.RejectionRequest;
import com.handover.dto.response.HandoverDetailResponse;
import com.handover.dto.response.HandoverSummaryResponse;
import com.handover.service.HandoverService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/handovers")
public class HandoverController {

    private final HandoverService handoverService;

    public HandoverController(HandoverService handoverService) {
        this.handoverService = handoverService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<HandoverSummaryResponse>>> getAllHandovers(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long departmentId) {
        List<HandoverSummaryResponse> list = handoverService.getAllHandovers(status, departmentId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HandoverDetailResponse>> getHandoverById(@PathVariable Long id) {
        HandoverDetailResponse handover = handoverService.getHandoverById(id);
        return ResponseEntity.ok(ApiResponse.success(handover));
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<ApiResponse<List<HandoverSummaryResponse>>> getHandoversByEmployee(@PathVariable Long employeeId) {
        List<HandoverSummaryResponse> list = handoverService.getHandoversByEmployeeId(employeeId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<HandoverDetailResponse>> createHandover(@Valid @RequestBody HandoverCreateRequest request) {
        HandoverDetailResponse handover = handoverService.createHandover(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Handover transition initiated", handover));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<HandoverDetailResponse>> updateHandover(
            @PathVariable Long id,
            @Valid @RequestBody HandoverUpdateRequest request) {
        HandoverDetailResponse handover = handoverService.updateHandover(id, request);
        return ResponseEntity.ok(ApiResponse.success("Handover updated", handover));
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<ApiResponse<HandoverDetailResponse>> submitHandover(@PathVariable Long id) {
        HandoverDetailResponse handover = handoverService.submitHandover(id);
        return ResponseEntity.ok(ApiResponse.success("Handover submitted for manager approval", handover));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<HandoverDetailResponse>> approveHandover(@PathVariable Long id) {
        HandoverDetailResponse handover = handoverService.approveHandover(id);
        return ResponseEntity.ok(ApiResponse.success("Handover approved by manager", handover));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ApiResponse<HandoverDetailResponse>> rejectHandover(
            @PathVariable Long id,
            @Valid @RequestBody RejectionRequest request) {
        HandoverDetailResponse handover = handoverService.rejectHandover(id, request);
        return ResponseEntity.ok(ApiResponse.success("Handover rejected", handover));
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<ApiResponse<HandoverDetailResponse>> acceptHandover(@PathVariable Long id) {
        HandoverDetailResponse handover = handoverService.acceptHandover(id);
        return ResponseEntity.ok(ApiResponse.success("Handover successfully accepted and completed", handover));
    }

    @PostMapping("/{id}/clarification")
    public ResponseEntity<ApiResponse<HandoverDetailResponse>> requestClarification(
            @PathVariable Long id,
            @Valid @RequestBody ClarificationRequest request) {
        HandoverDetailResponse handover = handoverService.requestClarification(id, request);
        return ResponseEntity.ok(ApiResponse.success("Clarification request recorded", handover));
    }
}
