package com.handover.service;

import com.handover.dto.request.CommentRequest;
import com.handover.dto.response.CommentResponse;

import java.util.List;

public interface CommentService {
    List<CommentResponse> getCommentsByHandoverId(Long handoverId);
    CommentResponse createComment(Long handoverId, CommentRequest request);
}
