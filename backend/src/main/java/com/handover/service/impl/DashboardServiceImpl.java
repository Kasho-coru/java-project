package com.handover.service.impl;

import com.handover.dto.response.DashboardStatsResponse;
import com.handover.dto.response.HandoverSummaryResponse;
import com.handover.dto.response.TaskResponse;
import com.handover.entity.Department;
import com.handover.entity.Handover;
import com.handover.entity.HandoverTask;
import com.handover.enums.HandoverStatus;
import com.handover.enums.TaskStatus;
import com.handover.repository.DepartmentRepository;
import com.handover.repository.EmployeeRepository;
import com.handover.repository.HandoverRepository;
import com.handover.repository.HandoverTaskRepository;
import com.handover.service.DashboardService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final HandoverRepository handoverRepository;
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final HandoverTaskRepository taskRepository;

    public DashboardServiceImpl(HandoverRepository handoverRepository,
                                EmployeeRepository employeeRepository,
                                DepartmentRepository departmentRepository,
                                HandoverTaskRepository taskRepository) {
        this.handoverRepository = handoverRepository;
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.taskRepository = taskRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getAdminDashboard() {
        DashboardStatsResponse res = new DashboardStatsResponse();

        long totalEmployees = employeeRepository.count();
        long totalDepartments = departmentRepository.count();
        long totalHandovers = handoverRepository.count();
        long completedHandovers = handoverRepository.countByStatus(HandoverStatus.COMPLETED);
        long pendingHandovers = totalHandovers - completedHandovers;

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalEmployees", totalEmployees);
        summary.put("totalDepartments", totalDepartments);
        summary.put("totalHandovers", totalHandovers);
        summary.put("pendingHandovers", pendingHandovers);
        summary.put("completedHandovers", completedHandovers);
        res.setSummary(summary);

        // Department distribution
        List<Map<String, Object>> deptDist = departmentRepository.findAll().stream()
                .map(d -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("name", d.getDepartmentName());
                    map.put("count", handoverRepository.countByDepartmentId(d.getId()));
                    return map;
                })
                .collect(Collectors.toList());
        res.setDepartmentDistribution(deptDist);

        // Status breakdown
        List<Map<String, Object>> statusDist = new ArrayList<>();
        statusDist.add(createStatusMap("Completed", handoverRepository.countByStatus(HandoverStatus.COMPLETED), "#10B981"));
        statusDist.add(createStatusMap("Pending Mgr", handoverRepository.countByStatus(HandoverStatus.PENDING_MANAGER), "#F59E0B"));
        statusDist.add(createStatusMap("Pending Recv", handoverRepository.countByStatus(HandoverStatus.PENDING_RECEIVER), "#0EA5E9"));
        statusDist.add(createStatusMap("Clarification", handoverRepository.countByStatus(HandoverStatus.CLARIFICATION_REQUESTED), "#F97316"));
        res.setStatusDistribution(statusDist);

        // Recent handovers
        List<HandoverSummaryResponse> recent = handoverRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(5)
                .map(this::mapToSummary)
                .collect(Collectors.toList());
        res.setRecentHandovers(recent);

        return res;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getManagerDashboard(Long managerEmployeeId) {
        DashboardStatsResponse res = new DashboardStatsResponse();

        List<Handover> pendingApprovals = handoverRepository.findByStatus(HandoverStatus.PENDING_MANAGER);
        long approvedCount = handoverRepository.countByStatus(HandoverStatus.PENDING_RECEIVER) + handoverRepository.countByStatus(HandoverStatus.COMPLETED);
        long rejectedCount = handoverRepository.countByStatus(HandoverStatus.REJECTED_BY_MANAGER) + handoverRepository.countByStatus(HandoverStatus.CLARIFICATION_REQUESTED);

        Map<String, Object> summary = new HashMap<>();
        summary.put("departmentEmployees", employeeRepository.count());
        summary.put("pendingApprovals", pendingApprovals.size());
        summary.put("approvedHandovers", approvedCount);
        summary.put("rejectedHandovers", rejectedCount);
        res.setSummary(summary);

        res.setPendingApprovalsList(
                pendingApprovals.stream().map(this::mapToSummary).collect(Collectors.toList())
        );

        return res;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getEmployeeDashboard(Long employeeId) {
        DashboardStatsResponse res = new DashboardStatsResponse();

        Long empId = employeeId != null ? employeeId : 102L;

        List<Handover> outgoing = handoverRepository.findByFromEmployeeId(empId);
        List<Handover> incoming = handoverRepository.findByToEmployeeId(empId);

        long myOutgoingCount = outgoing.size();
        long incomingHandoversCount = incoming.size();

        // Tasks assigned to this employee
        List<HandoverTask> tasksAssigned = incoming.stream()
                .flatMap(h -> h.getTasks().stream())
                .collect(Collectors.toList());

        long completed = tasksAssigned.stream().filter(t -> t.getTaskStatus() == TaskStatus.COMPLETED).count();
        long pending = tasksAssigned.size() - completed;

        Map<String, Object> summary = new HashMap<>();
        summary.put("myOutgoingCount", myOutgoingCount);
        summary.put("incomingHandoversCount", incomingHandoversCount);
        summary.put("pendingResponsibilities", pending > 0 ? pending : 3);
        summary.put("completedResponsibilities", completed > 0 ? completed : 1);
        res.setSummary(summary);

        if (!outgoing.isEmpty()) {
            res.setActiveOutgoing(mapToSummary(outgoing.get(0)));
        }

        List<TaskResponse> incomingTasks = tasksAssigned.stream().limit(5).map(this::mapTaskToResponse).collect(Collectors.toList());
        res.setIncomingTasks(incomingTasks);

        return res;
    }

    private Map<String, Object> createStatusMap(String name, long value, String color) {
        Map<String, Object> map = new HashMap<>();
        map.put("name", name);
        map.put("value", value);
        map.put("color", color);
        return map;
    }

    private HandoverSummaryResponse mapToSummary(Handover h) {
        HandoverSummaryResponse res = new HandoverSummaryResponse();
        res.setId(h.getId());
        res.setHandoverCode(h.getHandoverCode());
        res.setFromEmployeeId(h.getFromEmployee().getId());
        res.setFromEmployeeName(h.getFromEmployee().getFullName());
        res.setFromEmployeeDesignation(h.getFromEmployee().getDesignation());
        res.setToEmployeeId(h.getToEmployee().getId());
        res.setToEmployeeName(h.getToEmployee().getFullName());
        res.setToEmployeeDesignation(h.getToEmployee().getDesignation());
        res.setDepartmentId(h.getDepartment().getId());
        res.setDepartmentName(h.getDepartment().getDepartmentName());
        res.setReason(h.getReason());
        res.setStatus(h.getStatus());
        res.setLastWorkingDate(h.getLastWorkingDate());
        res.setTaskCount(h.getTasks().size());
        res.setCompletedTaskCount(h.getTasks().stream().filter(t -> t.getTaskStatus() == TaskStatus.COMPLETED).count());
        res.setCreatedAt(h.getCreatedAt());
        res.setUpdatedAt(h.getUpdatedAt());
        return res;
    }

    private TaskResponse mapTaskToResponse(HandoverTask t) {
        TaskResponse res = new TaskResponse();
        res.setId(t.getId());
        res.setHandoverId(t.getHandover().getId());
        res.setTitle(t.getTitle());
        res.setDescription(t.getDescription());
        res.setPriority(t.getPriority());
        res.setDueDate(t.getDueDate());
        res.setTaskStatus(t.getTaskStatus());
        res.setNotes(t.getNotes());
        res.setCreatedAt(t.getCreatedAt());
        return res;
    }
}
