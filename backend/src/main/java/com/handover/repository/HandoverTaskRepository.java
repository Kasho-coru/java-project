package com.handover.repository;

import com.handover.entity.HandoverTask;
import com.handover.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HandoverTaskRepository extends JpaRepository<HandoverTask, Long> {
    List<HandoverTask> findByHandoverId(Long handoverId);
    List<HandoverTask> findByHandoverIdAndTaskStatus(Long handoverId, TaskStatus taskStatus);
    long countByHandoverId(Long handoverId);
    long countByHandoverIdAndTaskStatus(Long handoverId, TaskStatus taskStatus);
}
