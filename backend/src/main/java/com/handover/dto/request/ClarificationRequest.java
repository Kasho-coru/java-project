package com.handover.dto.request;

import jakarta.validation.constraints.NotBlank;

public class ClarificationRequest {

    @NotBlank(message = "Clarification comment is mandatory")
    private String comment;

    public ClarificationRequest() {}

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
