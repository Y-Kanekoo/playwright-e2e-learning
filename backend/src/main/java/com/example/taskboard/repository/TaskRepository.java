package com.example.taskboard.repository;

import com.example.taskboard.model.Task;
import com.example.taskboard.model.TaskStatus;
import com.example.taskboard.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * タスクリポジトリ
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    /** ステータスでタスクを検索する */
    List<Task> findByStatus(TaskStatus status);

    /** 担当者でタスクを検索する */
    List<Task> findByAssignee(User assignee);

    /** タイトルにキーワードを含むタスクを検索する（大文字小文字無視） */
    @Query("SELECT t FROM Task t WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Task> searchByTitle(@Param("keyword") String keyword);

    /** タイトルまたは説明にキーワードを含むタスクを検索する（大文字小文字無視） */
    @Query("SELECT t FROM Task t WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Task> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);

    /** ステータスでフィルタしてページネーション検索する */
    Page<Task> findByStatus(TaskStatus status, Pageable pageable);

    /** 全タスクをページネーションで取得する */
    Page<Task> findAll(Pageable pageable);
}
