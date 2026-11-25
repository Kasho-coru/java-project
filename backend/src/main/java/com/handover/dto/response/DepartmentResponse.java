package com.handover.dto.response;

import java.time.LocalDateTime;

public class DepartmentResponse {
    private Long id;
    private String departmentName;
    private String description;
    private Long managerEmployeeId;
    private String managerName;
    private long employeeCount;
    private long activeHandoversCount;
    private LocalDateTime createdAt;

    public DepartmentResponse() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getManagerEmployeeId() {
        return managerEmployeeId;
    }

    public void setManagerEmployeeId(Long managerEmployeeId) {
        this.managerEmployeeId = managerEmployeeId;
    }

    public String getManagerName() {
        return managerName;
    }

    public void setManagerName(String managerName) {
        this.managerName = managerName;
    }

    public long getEmployeeCount() {
        return employeeCount;
    }

    public void setEmployeeCount(long employeeCount) {
        this.employeeCount = employeeCount;
    }

    public long getActiveHandoversCount() {
        return activeHandoversCount;
    }

    public void setActiveHandoversCount(long activeHandoversCount) {
        this.activeHandoversCount = activeHandoversCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
