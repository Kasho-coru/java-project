package com.handover.dto.request;

import com.handover.enums.HandoverReason;
import com.handover.enums.HandoverStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class HandoverCreateRequest {

    @NotNull(message = "From employee ID is required")
    private Long fromEmployeeId;

    @NotNull(message = "To employee ID is required")
    private Long toEmployeeId;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    @NotNull(message = "Handover reason is required")
    private HandoverReason reason;

    @NotBlank(message = "Description is required")
    private String description;

    private String additionalNotes;

    @NotNull(message = "Last working date is required")
    private LocalDate lastWorkingDate;

    private HandoverStatus status = HandoverStatus.DRAFT;

    private List<TaskRequest> tasks = new ArrayList<>();

    public HandoverCreateRequest() {}

    public Long getFromEmployeeId() {
        return fromEmployeeId;
    }

    public void setFromEmployeeId(Long fromEmployeeId) {
        this.fromEmployeeId = fromEmployeeId;
    }

    public Long getToEmployeeId() {
        return toEmployeeId;
    }

    public void setToEmployeeId(Long toEmployeeId) {
        this.toEmployeeId = toEmployeeId;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
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

    public List<TaskRequest> getTasks() {
        return tasks;
    }

    public void setTasks(List<TaskRequest> tasks) {
        this.tasks = tasks;
    }
}
