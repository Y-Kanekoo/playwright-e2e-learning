package com.example.taskboard.dto;

import com.example.taskboard.model.TaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * タスクステータス更新リクエストDTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusUpdateRequest {

    /** 新しいステータス */
    @NotNull(message = "ステータスは必須です")
    private TaskStatus status;
}
