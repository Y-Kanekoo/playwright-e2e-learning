package com.example.taskboard.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * ユーザーエンティティ
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** ユーザー名（一意） */
    @Column(nullable = false, unique = true, length = 50)
    private String username;

    /** パスワード（BCryptハッシュ） */
    @Column(nullable = false)
    private String password;

    /** 表示名 */
    @Column(nullable = false, length = 100)
    private String displayName;

    /** 役割（ADMIN / USER） */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    /** 作成日時 */
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
