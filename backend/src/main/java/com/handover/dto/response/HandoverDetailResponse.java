package com.handover.dto.response;

import com.handover.enums.HandoverReason;
import com.handover.enums.HandoverStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class HandoverDetailResponse {
    private Long id;
    private String handoverCode;

    private Long fromEmployeeId;
    private String fromEmployeeName;
    private String fromEmployeeDesignation;
    private String fromEmployeeEmail;

    private Long toEmployeeId;
    private String toEmployeeName;
    private String toEmployeeDesignation;
    private String toEmployeeEmail;

    private Long departmentId;
    private String departmentName;

    private HandoverReason reason;
    private String description;
    private String additionalNotes;
    private LocalDate lastWorkingDate;
    private HandoverStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<TaskResponse> tasks = new ArrayList<>();
    private List<CommentResponse> comments = new ArrayList<>();
    private List<HistoryResponse> history = new ArrayList<>();

    public HandoverDetailResponse() {}

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

    public String getFromEmployeeEmail() {
        return fromEmployeeEmail;
    }

    public void setFromEmployeeEmail(String fromEmployeeEmail) {
        this.fromEmployeeEmail = fromEmployeeEmail;
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

    public String getToEmployeeEmail() {
        return toEmployeeEmail;
    }

    public void setToEmployeeEmail(String toEmployeeEmail) {
        this.toEmployeeEmail = toEmployeeEmail;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAdditionalNotes() {
        return additionalNotes;
    }

    public void setAdditionalNotes(String additionalNotes) {
        this.additionalNotes = additionalNotes;
    }

    public LocalDate getLastWorkingDate() {
        return lastWorkingDate;
    }

    public void setLastWorkingDate(LocalDate lastWorkingDate) {
        this.lastWorkingDate = lastWorkingDate;
    }

    public HandoverStatus getStatus() {
        return status;
    }

    public void setStatus(HandoverStatus status) {
        this.status = status;
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

    public List<TaskResponse> getTasks() {
        return tasks;
    }

    public void setTasks(List<TaskResponse> tasks) {
        this.tasks = tasks;
    }

    public List<CommentResponse> getComments() {
        return comments;
    }

    public void setComments(List<CommentResponse> comments) {
        this.comments = comments;
    }

    public List<HistoryResponse> getHistory() {
        return history;
    }

    public void setHistory(List<HistoryResponse> history) {
        this.history = history;
    }
}
