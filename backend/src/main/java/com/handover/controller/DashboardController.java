package com.handover.controller;

import com.handover.dto.ApiResponse;
import com.handover.dto.response.DashboardStatsResponse;
import com.handover.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/admin")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getAdminDashboard() {
        DashboardStatsResponse stats = dashboardService.getAdminDashboard();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/manager")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getManagerDashboard(
            @RequestParam(required = false) Long managerEmployeeId) {
        DashboardStatsResponse stats = dashboardService.getManagerDashboard(managerEmployeeId);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/employee")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getEmployeeDashboard(
            @RequestParam(required = false) Long employeeId) {
        DashboardStatsResponse stats = dashboardService.getEmployeeDashboard(employeeId);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
