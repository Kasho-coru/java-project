package com.handover.dto.request;

import com.handover.enums.HandoverReason;
import java.time.LocalDate;

public class HandoverUpdateRequest {

    private Long toEmployeeId;
    private Long departmentId;
    private HandoverReason reason;
    private String description;
    private String additionalNotes;
    private LocalDate lastWorkingDate;

    public HandoverUpdateRequest() {}

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
}
