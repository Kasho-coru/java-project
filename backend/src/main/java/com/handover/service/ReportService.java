package com.handover.service;

import com.handover.dto.response.ReportSummaryResponse;

import java.util.List;
import java.util.Map;

public interface ReportService {
    ReportSummaryResponse getSummaryReport();
    List<Map<String, Object>> getDepartmentReports();
    List<Map<String, Object>> getMonthlyReports();
}
