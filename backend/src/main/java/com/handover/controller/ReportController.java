package com.handover.controller;

import com.handover.dto.ApiResponse;
import com.handover.dto.response.ReportSummaryResponse;
import com.handover.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<ReportSummaryResponse>> getSummaryReport() {
        ReportSummaryResponse report = reportService.getSummaryReport();
        return ResponseEntity.ok(ApiResponse.success(report));
    }

    @GetMapping("/departments")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getDepartmentReports() {
        List<Map<String, Object>> reports = reportService.getDepartmentReports();
        return ResponseEntity.ok(ApiResponse.success(reports));
    }

    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMonthlyReports() {
        List<Map<String, Object>> reports = reportService.getMonthlyReports();
        return ResponseEntity.ok(ApiResponse.success(reports));
    }
}
