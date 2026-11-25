package com.handover.dto.response;

import com.handover.enums.HandoverReason;
import com.handover.enums.HandoverStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class HandoverSummaryResponse {
    private Long id;
    private String handoverCode;
    private Long fromEmployeeId;
    private String fromEmployeeName;
    private String fromEmployeeDesignation;
    private Long toEmployeeId;
    private String toEmployeeName;
    private String toEmployeeDesignation;
    private Long departmentId;
    private String departmentName;
    private HandoverReason reason;
    private HandoverStatus status;
    private LocalDate lastWorkingDate;
    private long taskCount;
    private long completedTaskCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public HandoverSummaryResponse() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getHandoverCode() {
        return handoverCode;
    }

    public void setHandoverCode(String handoverCode) {
        this.handoverCode = handoverCode;
    }

    public Long getFromEmployeeId() {
        return fromEmployeeId;
    }

    public void setFromEmployeeId(Long fromEmployeeId) {
        this.fromEmployeeId = fromEmployeeId;
    }

    public String getFromEmployeeName() {
        return fromEmployeeName;
    }

    public void setFromEmployeeName(String fromEmployeeName) {
        this.fromEmployeeName = fromEmployeeName;
    }

    public String getFromEmployeeDesignation() {
        return fromEmployeeDesignation;
    }

    public void setFromEmployeeDesignation(String fromEmployeeDesignation) {
        this.fromEmployeeDesignation = fromEmployeeDesignation;
    }

    public Long getToEmployeeId() {
        return toEmployeeId;
    }

    public void setToEmployeeId(Long toEmployeeId) {
        this.toEmployeeId = toEmployeeId;
    }

    public String getToEmployeeName() {
        return toEmployeeName;
    }

    public void setToEmployeeName(String toEmployeeName) {
        this.toEmployeeName = toEmployeeName;
    }

    public String getToEmployeeDesignation() {
        return toEmployeeDesignation;
    }

    public void setToEmployeeDesignation(String toEmployeeDesignation) {
        this.toEmployeeDesignation = toEmployeeDesignation;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public HandoverReason getReason() {
        return reason;
    }

    public void setReason(HandoverReason reason) {
        this.reason = reason;
    }

    public HandoverStatus getStatus() {
        return status;
    }

    public void setStatus(HandoverStatus status) {
        this.status = status;
    }

    public LocalDate getLastWorkingDate() {
        return lastWorkingDate;
    }

    public void setLastWorkingDate(LocalDate lastWorkingDate) {
        this.lastWorkingDate = lastWorkingDate;
    }

    public long getTaskCount() {
        return taskCount;
    }

    public void setTaskCount(long taskCount) {
        this.taskCount = taskCount;
    }

    public long getCompletedTaskCount() {
        return completedTaskCount;
    }

    public void setCompletedTaskCount(long completedTaskCount) {
        this.completedTaskCount = completedTaskCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
