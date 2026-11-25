package com.handover.controller;

import com.handover.dto.ApiResponse;
import com.handover.dto.request.TaskRequest;
import com.handover.dto.response.TaskResponse;
import com.handover.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/handovers/{handoverId}/tasks")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getTasksByHandover(@PathVariable Long handoverId) {
        List<TaskResponse> list = taskService.getTasksByHandoverId(handoverId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PostMapping("/handovers/{handoverId}/tasks")
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            @PathVariable Long handoverId,
            @Valid @RequestBody TaskRequest request) {
        TaskResponse task = taskService.createTask(handoverId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Task created successfully", task));
    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request) {
        TaskResponse task = taskService.updateTask(id, request);
        return ResponseEntity.ok(ApiResponse.success("Task updated", task));
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(ApiResponse.success("Task deleted", null));
    }
}
