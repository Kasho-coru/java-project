package com.handover.service;

import com.handover.dto.request.TaskRequest;
import com.handover.dto.response.TaskResponse;

import java.util.List;

public interface TaskService {
    List<TaskResponse> getTasksByHandoverId(Long handoverId);
    TaskResponse createTask(Long handoverId, TaskRequest request);
    TaskResponse updateTask(Long taskId, TaskRequest request);
    void deleteTask(Long taskId);
}
