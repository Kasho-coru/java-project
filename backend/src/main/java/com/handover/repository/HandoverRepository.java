package com.handover.repository;

import com.handover.entity.Handover;
import com.handover.enums.HandoverStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HandoverRepository extends JpaRepository<Handover, Long> {
    Optional<Handover> findByHandoverCode(String handoverCode);
    List<Handover> findByFromEmployeeId(Long fromEmployeeId);
    List<Handover> findByToEmployeeId(Long toEmployeeId);
    List<Handover> findByDepartmentId(Long departmentId);
    List<Handover> findByStatus(HandoverStatus status);

    @Query("SELECT h FROM Handover h WHERE h.fromEmployee.id = :employeeId OR h.toEmployee.id = :employeeId ORDER BY h.createdAt DESC")
    List<Handover> findByEmployeeInvolvement(@Param("employeeId") Long employeeId);

    @Query("SELECT h FROM Handover h WHERE h.department.manager.id = :managerEmployeeId ORDER BY h.createdAt DESC")
    List<Handover> findByDepartmentManager(@Param("managerEmployeeId") Long managerEmployeeId);

    long countByStatus(HandoverStatus status);
    long countByDepartmentId(Long departmentId);
}
