package com.handover.dto.request;

import jakarta.validation.constraints.NotBlank;

public class RejectionRequest {

    @NotBlank(message = "Rejection reason is mandatory")
    private String reason;

    public RejectionRequest() {}

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
