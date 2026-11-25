package com.handover.service.impl;

import com.handover.dto.request.ClarificationRequest;
import com.handover.dto.request.HandoverCreateRequest;
import com.handover.dto.request.HandoverUpdateRequest;
import com.handover.dto.request.RejectionRequest;
import com.handover.dto.response.*;
import com.handover.entity.*;
import com.handover.enums.HandoverStatus;
import com.handover.enums.Priority;
import com.handover.enums.TaskStatus;
import com.handover.exception.BadRequestException;
import com.handover.exception.ResourceNotFoundException;
import com.handover.repository.*;
import com.handover.service.HandoverService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HandoverServiceImpl implements HandoverService {

    private final HandoverRepository handoverRepository;
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final HandoverTaskRepository handoverTaskRepository;
    private final HandoverCommentRepository handoverCommentRepository;
    private final HandoverHistoryRepository handoverHistoryRepository;
    private final UserRepository userRepository;

    public HandoverServiceImpl(HandoverRepository handoverRepository,
                               EmployeeRepository employeeRepository,
                               DepartmentRepository departmentRepository,
                               HandoverTaskRepository handoverTaskRepository,
                               HandoverCommentRepository handoverCommentRepository,
                               HandoverHistoryRepository handoverHistoryRepository,
                               UserRepository userRepository) {
        this.handoverRepository = handoverRepository;
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.handoverTaskRepository = handoverTaskRepository;
        this.handoverCommentRepository = handoverCommentRepository;
        this.handoverHistoryRepository = handoverHistoryRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<HandoverSummaryResponse> getAllHandovers(String status, Long departmentId) {
        List<Handover> list = handoverRepository.findAll();

        return list.stream()
                .filter(h -> status == null || status.trim().isEmpty() || status.equalsIgnoreCase("ALL") || h.getStatus().name().equalsIgnoreCase(status))
                .filter(h -> departmentId == null || h.getDepartment().getId().equals(departmentId))
                .map(this::mapToSummaryResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public HandoverDetailResponse getHandoverById(Long id) {
        Handover handover = handoverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Handover not found with ID: " + id));
        return mapToDetailResponse(handover);
    }

    @Override
    @Transactional(readOnly = true)
    public List<HandoverSummaryResponse> getHandoversByEmployeeId(Long employeeId) {
        return handoverRepository.findByEmployeeInvolvement(employeeId).stream()
                .map(this::mapToSummaryResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public HandoverDetailResponse createHandover(HandoverCreateRequest request) {
        Employee fromEmp = employeeRepository.findById(request.getFromEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Outgoing employee not found with ID: " + request.getFromEmployeeId()));

        Employee toEmp = employeeRepository.findById(request.getToEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Receiving employee not found with ID: " + request.getToEmployeeId()));

        Department dept = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + request.getDepartmentId()));

        Handover handover = new Handover();
        String code = "HO-2026-" + String.format("%03d", (int) (handoverRepository.count() + 1));
        handover.setHandoverCode(code);
        handover.setFromEmployee(fromEmp);
        handover.setToEmployee(toEmp);
        handover.setDepartment(dept);
        handover.setReason(request.getReason());
        handover.setDescription(request.getDescription());
        handover.setAdditionalNotes(request.getAdditionalNotes());
        handover.setLastWorkingDate(request.getLastWorkingDate());
        handover.setStatus(request.getStatus() != null ? request.getStatus() : HandoverStatus.DRAFT);

        // Add itemized tasks
        if (request.getTasks() != null) {
            for (var taskReq : request.getTasks()) {
                HandoverTask task = new HandoverTask();
                task.setTitle(taskReq.getTitle());
                task.setDescription(taskReq.getDescription());
                task.setPriority(taskReq.getPriority() != null ? taskReq.getPriority() : Priority.MEDIUM);
                task.setDueDate(taskReq.getDueDate());
                task.setTaskStatus(taskReq.getTaskStatus() != null ? taskReq.getTaskStatus() : TaskStatus.PENDING);
                task.setNotes(taskReq.getNotes());
                handover.addTask(task);
            }
        }

        Handover saved = handoverRepository.save(handover);

        // Record Initial History Audit Log
        User performer = fromEmp.getUser() != null ? fromEmp.getUser() : userRepository.findAll().get(0);
        HandoverHistory history = new HandoverHistory(
                saved,
                "Handover Created",
                "Handover initiated with status: " + saved.getStatus().name(),
                performer
        );
        handoverHistoryRepository.save(history);

        return mapToDetailResponse(saved);
    }

    @Override
    @Transactional
    public HandoverDetailResponse updateHandover(Long id, HandoverUpdateRequest request) {
        Handover handover = handoverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Handover not found with ID: " + id));

        if (request.getToEmployeeId() != null) {
            Employee toEmp = employeeRepository.findById(request.getToEmployeeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + request.getToEmployeeId()));
            handover.setToEmployee(toEmp);
        }
        if (request.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + request.getDepartmentId()));
            handover.setDepartment(dept);
        }
        if (request.getReason() != null) handover.setReason(request.getReason());
        if (request.getDescription() != null) handover.setDescription(request.getDescription());
        if (request.getAdditionalNotes() != null) handover.setAdditionalNotes(request.getAdditionalNotes());
        if (request.getLastWorkingDate() != null) handover.setLastWorkingDate(request.getLastWorkingDate());

        Handover updated = handoverRepository.save(handover);
        return mapToDetailResponse(updated);
    }

    @Override
    @Transactional
    public HandoverDetailResponse submitHandover(Long id) {
        Handover handover = handoverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Handover not found with ID: " + id));

        // Workflow transition: DRAFT or CLARIFICATION_REQUESTED -> PENDING_MANAGER (User Correction 3)
        handover.setStatus(HandoverStatus.PENDING_MANAGER);
        Handover updated = handoverRepository.save(handover);

        User performer = handover.getFromEmployee().getUser() != null
                ? handover.getFromEmployee().getUser()
                : userRepository.findAll().get(0);

        HandoverHistory history = new HandoverHistory(
                updated,
                "Submitted for Approval",
                "Handover submitted for department manager review.",
                performer
        );
        handoverHistoryRepository.save(history);

        return mapToDetailResponse(updated);
    }

    @Override
    @Transactional
    public HandoverDetailResponse approveHandover(Long id) {
        Handover handover = handoverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Handover not found with ID: " + id));

        handover.setStatus(HandoverStatus.PENDING_RECEIVER);
        Handover updated = handoverRepository.save(handover);

        User managerUser = handover.getDepartment().getManager() != null && handover.getDepartment().getManager().getUser() != null
                ? handover.getDepartment().getManager().getUser()
                : userRepository.findAll().get(0);

        HandoverHistory history = new HandoverHistory(
                updated,
                "Manager Approved",
                "Manager approved the handover. Moved to receiving employee confirmation.",
                managerUser
        );
        handoverHistoryRepository.save(history);

        return mapToDetailResponse(updated);
    }

    @Override
    @Transactional
    public HandoverDetailResponse rejectHandover(Long id, RejectionRequest request) {
        Handover handover = handoverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Handover not found with ID: " + id));

        handover.setStatus(HandoverStatus.REJECTED_BY_MANAGER);
        Handover updated = handoverRepository.save(handover);

        User managerUser = handover.getDepartment().getManager() != null && handover.getDepartment().getManager().getUser() != null
                ? handover.getDepartment().getManager().getUser()
                : userRepository.findAll().get(0);

        HandoverHistory history = new HandoverHistory(
                updated,
                "Manager Rejected",
                "Rejection Reason: " + request.getReason(),
                managerUser
        );
        handoverHistoryRepository.save(history);

        return mapToDetailResponse(updated);
    }

    @Override
    @Transactional
    public HandoverDetailResponse acceptHandover(Long id) {
        Handover handover = handoverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Handover not found with ID: " + id));

        handover.setStatus(HandoverStatus.COMPLETED);
        Handover updated = handoverRepository.save(handover);

        User receiverUser = handover.getToEmployee().getUser() != null
                ? handover.getToEmployee().getUser()
                : userRepository.findAll().get(0);

        HandoverHistory history = new HandoverHistory(
                updated,
                "Receiver Accepted",
                "Successor accepted all transferred tasks. Handover COMPLETED.",
                receiverUser
        );
        handoverHistoryRepository.save(history);

        return mapToDetailResponse(updated);
    }

    @Override
    @Transactional
    public HandoverDetailResponse requestClarification(Long id, ClarificationRequest request) {
        Handover handover = handoverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Handover not found with ID: " + id));

        handover.setStatus(HandoverStatus.CLARIFICATION_REQUESTED);
        Handover updated = handoverRepository.save(handover);

        User receiverUser = handover.getToEmployee().getUser() != null
                ? handover.getToEmployee().getUser()
                : userRepository.findAll().get(0);

        // Add clarification comment
        HandoverComment comment = new HandoverComment();
        comment.setHandover(updated);
        comment.setUser(receiverUser);
        comment.setComment("Clarification Needed: " + request.getComment());
        handoverCommentRepository.save(comment);

        // Add history log
        HandoverHistory history = new HandoverHistory(
                updated,
                "Clarification Requested",
                "Receiver requested details: " + request.getComment(),
                receiverUser
        );
        handoverHistoryRepository.save(history);

        return mapToDetailResponse(updated);
    }

    private HandoverSummaryResponse mapToSummaryResponse(Handover h) {
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

    private HandoverDetailResponse mapToDetailResponse(Handover h) {
        HandoverDetailResponse res = new HandoverDetailResponse();
        res.setId(h.getId());
        res.setHandoverCode(h.getHandoverCode());

        res.setFromEmployeeId(h.getFromEmployee().getId());
        res.setFromEmployeeName(h.getFromEmployee().getFullName());
        res.setFromEmployeeDesignation(h.getFromEmployee().getDesignation());
        res.setFromEmployeeEmail(h.getFromEmployee().getEmail());

        res.setToEmployeeId(h.getToEmployee().getId());
        res.setToEmployeeName(h.getToEmployee().getFullName());
        res.setToEmployeeDesignation(h.getToEmployee().getDesignation());
        res.setToEmployeeEmail(h.getToEmployee().getEmail());

        res.setDepartmentId(h.getDepartment().getId());
        res.setDepartmentName(h.getDepartment().getDepartmentName());

        res.setReason(h.getReason());
        res.setDescription(h.getDescription());
        res.setAdditionalNotes(h.getAdditionalNotes());
        res.setLastWorkingDate(h.getLastWorkingDate());
        res.setStatus(h.getStatus());
        res.setCreatedAt(h.getCreatedAt());
        res.setUpdatedAt(h.getUpdatedAt());

        res.setTasks(h.getTasks().stream().map(this::mapTaskToResponse).collect(Collectors.toList()));
        res.setComments(h.getComments().stream().map(this::mapCommentToResponse).collect(Collectors.toList()));
        res.setHistory(h.getHistory().stream().map(this::mapHistoryToResponse).collect(Collectors.toList()));

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

    private CommentResponse mapCommentToResponse(HandoverComment c) {
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

    private HistoryResponse mapHistoryToResponse(HandoverHistory h) {
        HistoryResponse res = new HistoryResponse();
        res.setId(h.getId());
        res.setHandoverId(h.getHandover().getId());
        res.setAction(h.getAction());
        res.setDescription(h.getDescription());
        res.setPerformedById(h.getPerformedBy().getId());
        res.setPerformedByName(h.getPerformedBy().getUsername());
        res.setCreatedAt(h.getCreatedAt());
        return res;
    }
}
