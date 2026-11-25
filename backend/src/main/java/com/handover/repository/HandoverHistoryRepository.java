package com.handover.repository;

import com.handover.entity.HandoverHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HandoverHistoryRepository extends JpaRepository<HandoverHistory, Long> {
    List<HandoverHistory> findByHandoverIdOrderByCreatedAtDesc(Long handoverId);
}
