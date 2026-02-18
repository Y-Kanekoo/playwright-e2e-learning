package com.example.taskboard.repository;

import com.example.taskboard.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * ユーザーリポジトリ
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /** ユーザー名でユーザーを検索する */
    Optional<User> findByUsername(String username);

    /** ユーザー名の存在確認 */
    boolean existsByUsername(String username);
}
