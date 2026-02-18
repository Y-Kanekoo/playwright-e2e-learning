package com.example.taskboard.service;

import com.example.taskboard.dto.UserResponse;
import com.example.taskboard.model.User;
import com.example.taskboard.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * ユーザーサービス
 * ユーザー一覧・詳細のビジネスロジックを提供する
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;

    /**
     * 全ユーザーを取得する
     */
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::fromEntity)
                .toList();
    }

    /**
     * IDでユーザーを取得する
     */
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        "ユーザーが見つかりません: id=" + id));
        return UserResponse.fromEntity(user);
    }

    /**
     * ユーザー名でユーザーを取得する
     */
    @Transactional(readOnly = true)
    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException(
                        "ユーザーが見つかりません: username=" + username));
        return UserResponse.fromEntity(user);
    }
}
