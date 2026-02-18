package com.example.taskboard.controller;

import com.example.taskboard.dto.StatusUpdateRequest;
import com.example.taskboard.dto.TaskRequest;
import com.example.taskboard.dto.TaskResponse;
import com.example.taskboard.model.TaskStatus;
import com.example.taskboard.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * タスクコントローラ
 * タスクのCRUD操作、ステータス変更、検索のエンドポイントを提供する
 */
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Slf4j
public class TaskController {

    private final TaskService taskService;

    /**
     * タスク一覧の取得（ページネーション対応）
     * GET /api/tasks
     * クエリパラメータ: status, search, page, size, sort
     */
    @GetMapping
    public ResponseEntity<Page<TaskResponse>> getTasks(
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20, sort = "createdAt",
                    direction = Sort.Direction.DESC) Pageable pageable) {

        Page<TaskResponse> tasks;

        if (search != null && !search.isBlank()) {
            log.info("タスクを検索します: keyword={}", search);
            tasks = taskService.searchTasks(search, pageable);
        } else if (status != null) {
            log.info("ステータスでタスクを絞り込みます: status={}", status);
            tasks = taskService.getTasksByStatus(status, pageable);
        } else {
            tasks = taskService.getAllTasks(pageable);
        }

        return ResponseEntity.ok(tasks);
    }

    /**
     * タスクの詳細を取得する
     * GET /api/tasks/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTask(@PathVariable Long id) {
        log.info("タスクの詳細を取得します: id={}", id);
        TaskResponse task = taskService.getTaskById(id);
        return ResponseEntity.ok(task);
    }

    /**
     * 新しいタスクを作成する
     * POST /api/tasks
     */
    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @Valid @RequestBody TaskRequest request,
            Authentication authentication) {
        log.info("タスクを作成します: title={}", request.getTitle());
        String username = authentication.getName();
        TaskResponse task = taskService.createTask(request, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(task);
    }

    /**
     * タスクを更新する
     * PUT /api/tasks/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request) {
        log.info("タスクを更新します: id={}", id);
        TaskResponse task = taskService.updateTask(id, request);
        return ResponseEntity.ok(task);
    }

    /**
     * タスクを削除する
     * DELETE /api/tasks/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        log.info("タスクを削除します: id={}", id);
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * タスクのステータスを変更する
     * PATCH /api/tasks/{id}/status
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponse> updateTaskStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request) {
        log.info("タスクのステータスを変更します: id={}, status={}", id, request.getStatus());
        TaskResponse task = taskService.updateTaskStatus(id, request.getStatus());
        return ResponseEntity.ok(task);
    }

    /**
     * 担当者でタスクを検索する
     * GET /api/tasks/assignee/{assigneeId}
     */
    @GetMapping("/assignee/{assigneeId}")
    public ResponseEntity<List<TaskResponse>> getTasksByAssignee(
            @PathVariable Long assigneeId) {
        log.info("担当者でタスクを検索します: assigneeId={}", assigneeId);
        List<TaskResponse> tasks = taskService.getTasksByAssignee(assigneeId);
        return ResponseEntity.ok(tasks);
    }
}
