package com.handover.service.impl;

import com.handover.dto.request.TaskRequest;
import com.handover.dto.response.TaskResponse;
import com.handover.entity.Handover;
import com.handover.entity.HandoverTask;
import com.handover.enums.Priority;
import com.handover.enums.TaskStatus;
import com.handover.exception.ResourceNotFoundException;
import com.handover.repository.HandoverRepository;
import com.handover.repository.HandoverTaskRepository;
import com.handover.service.TaskService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskService {

    private final HandoverTaskRepository taskRepository;
    private final HandoverRepository handoverRepository;

    public TaskServiceImpl(HandoverTaskRepository taskRepository, HandoverRepository handoverRepository) {
        this.taskRepository = taskRepository;
        this.handoverRepository = handoverRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByHandoverId(Long handoverId) {
        return taskRepository.findByHandoverId(handoverId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TaskResponse createTask(Long handoverId, TaskRequest request) {
        Handover handover = handoverRepository.findById(handoverId)
                .orElseThrow(() -> new ResourceNotFoundException("Handover not found with ID: " + handoverId));

        HandoverTask task = new HandoverTask();
        task.setHandover(handover);
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority() != null ? request.getPriority() : Priority.MEDIUM);
        task.setDueDate(request.getDueDate());
        task.setTaskStatus(request.getTaskStatus() != null ? request.getTaskStatus() : TaskStatus.PENDING);
        task.setNotes(request.getNotes());

        HandoverTask saved = taskRepository.save(task);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public TaskResponse updateTask(Long taskId, TaskRequest request) {
        HandoverTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));

        if (request.getTitle() != null) task.setTitle(request.getTitle());
        if (request.getDescription() != null) task.setDescription(request.getDescription());
        if (request.getPriority() != null) task.setPriority(request.getPriority());
        if (request.getDueDate() != null) task.setDueDate(request.getDueDate());
        if (request.getTaskStatus() != null) task.setTaskStatus(request.getTaskStatus());
        if (request.getNotes() != null) task.setNotes(request.getNotes());

        HandoverTask updated = taskRepository.save(task);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteTask(Long taskId) {
        HandoverTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));
        taskRepository.delete(task);
    }

    private TaskResponse mapToResponse(HandoverTask t) {
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
