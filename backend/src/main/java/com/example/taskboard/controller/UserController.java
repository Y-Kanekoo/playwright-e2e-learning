package com.example.taskboard.controller;

import com.example.taskboard.dto.UserResponse;
import com.example.taskboard.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ユーザーコントローラ
 * ユーザー一覧・詳細のエンドポイントを提供する
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    /**
     * ユーザー一覧を取得する
     * GET /api/users
     */
    @GetMapping
    public ResponseEntity<List<UserResponse>> getUsers() {
        log.info("ユーザー一覧を取得します");
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * ユーザーの詳細を取得する
     * GET /api/users/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
        log.info("ユーザーの詳細を取得します: id={}", id);
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }
}
