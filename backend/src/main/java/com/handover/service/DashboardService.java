package com.handover.service;

import com.handover.dto.response.DashboardStatsResponse;

public interface DashboardService {
    DashboardStatsResponse getAdminDashboard();
    DashboardStatsResponse getManagerDashboard(Long managerEmployeeId);
    DashboardStatsResponse getEmployeeDashboard(Long employeeId);
}
