package com.example.taskboard.dto;

import com.example.taskboard.model.Priority;
import com.example.taskboard.model.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * タスク作成・更新リクエストDTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskRequest {

    /** タスクのタイトル */
    @NotBlank(message = "タイトルは必須です")
    @Size(max = 200, message = "タイトルは200文字以下で入力してください")
    private String title;

    /** タスクの説明 */
    @Size(max = 2000, message = "説明は2000文字以下で入力してください")
    private String description;

    /** ステータス */
    @NotNull(message = "ステータスは必須です")
    private TaskStatus status;

    /** 優先度 */
    @NotNull(message = "優先度は必須です")
    private Priority priority;

    /** 担当者ID */
    private Long assigneeId;

    /** 期限日 */
    private LocalDate dueDate;
}
