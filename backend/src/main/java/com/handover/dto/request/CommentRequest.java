package com.handover.dto.request;

import jakarta.validation.constraints.NotBlank;

public class CommentRequest {

    private Long userId;

    @NotBlank(message = "Comment content cannot be empty")
    private String comment;

    public CommentRequest() {}

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
