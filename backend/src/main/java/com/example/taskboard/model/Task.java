package com.example.taskboard.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * タスクエンティティ
 */
@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** タスクのタイトル */
    @Column(nullable = false, length = 200)
    private String title;

    /** タスクの説明 */
    @Column(length = 2000)
    private String description;

    /** ステータス（TODO / IN_PROGRESS / DONE） */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status;

    /** 優先度（LOW / MEDIUM / HIGH） */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    /** 担当者 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id")
    private User assignee;

    /** 作成者 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    /** 期限日 */
    private LocalDate dueDate;

    /** 作成日時 */
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /** 更新日時 */
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
