package com.handover.controller;

import com.handover.dto.ApiResponse;
import com.handover.dto.request.CommentRequest;
import com.handover.dto.response.CommentResponse;
import com.handover.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/handovers/{handoverId}/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getComments(@PathVariable Long handoverId) {
        List<CommentResponse> list = commentService.getCommentsByHandoverId(handoverId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CommentResponse>> addComment(
            @PathVariable Long handoverId,
            @Valid @RequestBody CommentRequest request) {
        CommentResponse comment = commentService.createComment(handoverId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Comment added", comment));
    }
}
