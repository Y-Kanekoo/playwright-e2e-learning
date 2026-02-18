package com.example.taskboard.config;

import com.example.taskboard.model.*;
import com.example.taskboard.repository.TaskRepository;
import com.example.taskboard.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

/**
 * アプリケーション起動時に初期データを投入するクラス
 * H2インメモリDBのため、起動するたびに実行される
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // 既にデータがある場合はスキップ
        if (userRepository.count() > 0) {
            log.info("初期データは既に存在します。スキップします。");
            return;
        }

        log.info("初期データの投入を開始します...");

        // ユーザー作成
        User admin = userRepository.save(User.builder()
                .username("admin")
                .password(passwordEncoder.encode("admin123"))
                .displayName("管理者")
                .role(Role.ADMIN)
                .build());

        User user = userRepository.save(User.builder()
                .username("user")
                .password(passwordEncoder.encode("user123"))
                .displayName("一般ユーザー")
                .role(Role.USER)
                .build());

        log.info("ユーザーを作成しました: admin, user");

        // タスク作成（5件、各ステータスに分散）
        taskRepository.save(Task.builder()
                .title("プロジェクト計画書の作成")
                .description("Q1のプロジェクト計画書を作成する。目標、スケジュール、リソース配分を含める。")
                .status(TaskStatus.TODO)
                .priority(Priority.HIGH)
                .assignee(admin)
                .creator(admin)
                .dueDate(LocalDate.of(2026, 3, 15))
                .build());

        taskRepository.save(Task.builder()
                .title("APIエンドポイントの設計")
                .description("RESTful APIのエンドポイント設計書を作成する。OpenAPI仕様に準拠すること。")
                .status(TaskStatus.TODO)
                .priority(Priority.MEDIUM)
                .assignee(user)
                .creator(admin)
                .dueDate(LocalDate.of(2026, 3, 1))
                .build());

        taskRepository.save(Task.builder()
                .title("データベースのマイグレーション")
                .description("本番環境のデータベーススキーマを新仕様に移行する。バックアップを忘れずに。")
                .status(TaskStatus.IN_PROGRESS)
                .priority(Priority.HIGH)
                .assignee(admin)
                .creator(admin)
                .dueDate(LocalDate.of(2026, 2, 28))
                .build());

        taskRepository.save(Task.builder()
                .title("ユニットテストの追加")
                .description("認証モジュールのユニットテストを追加する。カバレッジ80%以上を目標とする。")
                .status(TaskStatus.IN_PROGRESS)
                .priority(Priority.MEDIUM)
                .assignee(user)
                .creator(user)
                .dueDate(LocalDate.of(2026, 3, 10))
                .build());

        taskRepository.save(Task.builder()
                .title("ドキュメントの更新")
                .description("README.mdとAPI仕様書を最新の実装に合わせて更新する。")
                .status(TaskStatus.DONE)
                .priority(Priority.LOW)
                .assignee(user)
                .creator(admin)
                .dueDate(LocalDate.of(2026, 2, 20))
                .build());

        log.info("タスクを5件作成しました");
        log.info("初期データの投入が完了しました");
    }
}
