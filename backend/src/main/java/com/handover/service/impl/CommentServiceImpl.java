package com.handover.service.impl;

import com.handover.dto.request.CommentRequest;
import com.handover.dto.response.CommentResponse;
import com.handover.entity.Handover;
import com.handover.entity.HandoverComment;
import com.handover.entity.User;
import com.handover.exception.ResourceNotFoundException;
import com.handover.repository.HandoverCommentRepository;
import com.handover.repository.HandoverRepository;
import com.handover.repository.UserRepository;
import com.handover.service.CommentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    private final HandoverCommentRepository commentRepository;
    private final HandoverRepository handoverRepository;
    private final UserRepository userRepository;

    public CommentServiceImpl(HandoverCommentRepository commentRepository,
                              HandoverRepository handoverRepository,
                              UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.handoverRepository = handoverRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByHandoverId(Long handoverId) {
        return commentRepository.findByHandoverIdOrderByCreatedAtAsc(handoverId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CommentResponse createComment(Long handoverId, CommentRequest request) {
        Handover handover = handoverRepository.findById(handoverId)
                .orElseThrow(() -> new ResourceNotFoundException("Handover not found with ID: " + handoverId));

        User user = (request.getUserId() != null)
                ? userRepository.findById(request.getUserId()).orElse(userRepository.findAll().get(0))
                : userRepository.findAll().get(0);

        HandoverComment comment = new HandoverComment();
        comment.setHandover(handover);
        comment.setUser(user);
        comment.setComment(request.getComment());

        HandoverComment saved = commentRepository.save(comment);
        return mapToResponse(saved);
    }

    private CommentResponse mapToResponse(HandoverComment c) {
        CommentResponse res = new CommentResponse();
        res.setId(c.getId());
        res.setHandoverId(c.getHandover().getId());
        res.setUserId(c.getUser().getId());
        res.setUserName(c.getUser().getUsername());
        res.setUserRole(c.getUser().getRole().name());
        res.setComment(c.getComment());
        res.setCreatedAt(c.getCreatedAt());
        return res;
    }
}
