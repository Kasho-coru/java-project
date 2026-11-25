package com.handover.repository;

import com.handover.entity.HandoverComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HandoverCommentRepository extends JpaRepository<HandoverComment, Long> {
    List<HandoverComment> findByHandoverIdOrderByCreatedAtAsc(Long handoverId);
}
