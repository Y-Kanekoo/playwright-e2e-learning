package com.example.taskboard.service;

import com.example.taskboard.dto.TaskRequest;
import com.example.taskboard.dto.TaskResponse;
import com.example.taskboard.model.Task;
import com.example.taskboard.model.TaskStatus;
import com.example.taskboard.model.User;
import com.example.taskboard.repository.TaskRepository;
import com.example.taskboard.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * タスクサービス
 * タスクのCRUD操作、ステータス変更、検索、ページネーションを提供する
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    /**
     * 全タスクを取得する（ページネーション対応）
     */
    @Transactional(readOnly = true)
    public Page<TaskResponse> getAllTasks(Pageable pageable) {
        return taskRepository.findAll(pageable)
                .map(TaskResponse::fromEntity);
    }

    /**
     * IDでタスクを取得する
     */
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long id) {
        Task task = findTaskOrThrow(id);
        return TaskResponse.fromEntity(task);
    }

    /**
     * 新しいタスクを作成する
     */
    @Transactional
    public TaskResponse createTask(TaskRequest request, String creatorUsername) {
        User creator = findUserByUsernameOrThrow(creatorUsername);

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus())
                .priority(request.getPriority())
                .creator(creator)
                .dueDate(request.getDueDate())
                .build();

        // 担当者が指定されている場合は設定
        if (request.getAssigneeId() != null) {
            User assignee = findUserByIdOrThrow(request.getAssigneeId());
            task.setAssignee(assignee);
        }

        Task savedTask = taskRepository.save(task);
        log.info("タスクが作成されました: id={}, title={}", savedTask.getId(), savedTask.getTitle());

        return TaskResponse.fromEntity(savedTask);
    }

    /**
     * タスクを更新する
     */
    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = findTaskOrThrow(id);

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());

        // 担当者の更新
        if (request.getAssigneeId() != null) {
            User assignee = findUserByIdOrThrow(request.getAssigneeId());
            task.setAssignee(assignee);
        } else {
            task.setAssignee(null);
        }

        Task updatedTask = taskRepository.save(task);
        log.info("タスクが更新されました: id={}", updatedTask.getId());

        return TaskResponse.fromEntity(updatedTask);
    }

    /**
     * タスクを削除する
     */
    @Transactional
    public void deleteTask(Long id) {
        Task task = findTaskOrThrow(id);
        taskRepository.delete(task);
        log.info("タスクが削除されました: id={}", id);
    }

    /**
     * タスクのステータスを変更する
     */
    @Transactional
    public TaskResponse updateTaskStatus(Long id, TaskStatus status) {
        Task task = findTaskOrThrow(id);
        task.setStatus(status);
        Task updatedTask = taskRepository.save(task);
        log.info("タスクのステータスが変更されました: id={}, status={}", id, status);

        return TaskResponse.fromEntity(updatedTask);
    }

    /**
     * ステータスでタスクを検索する
     */
    @Transactional(readOnly = true)
    public Page<TaskResponse> getTasksByStatus(TaskStatus status, Pageable pageable) {
        return taskRepository.findByStatus(status, pageable)
                .map(TaskResponse::fromEntity);
    }

    /**
     * キーワードでタスクを検索する（タイトル・説明）
     */
    @Transactional(readOnly = true)
    public Page<TaskResponse> searchTasks(String keyword, Pageable pageable) {
        return taskRepository.searchByKeyword(keyword, pageable)
                .map(TaskResponse::fromEntity);
    }

    /**
     * 担当者でタスクを検索する
     */
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByAssignee(Long assigneeId) {
        User assignee = findUserByIdOrThrow(assigneeId);
        return taskRepository.findByAssignee(assignee).stream()
                .map(TaskResponse::fromEntity)
                .toList();
    }

    // --- プライベートヘルパーメソッド ---

    private Task findTaskOrThrow(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "タスクが見つかりません: id=" + id));
    }

    private User findUserByIdOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "ユーザーが見つかりません: id=" + id));
    }

    private User findUserByUsernameOrThrow(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException(
                        "ユーザーが見つかりません: username=" + username));
    }
}
