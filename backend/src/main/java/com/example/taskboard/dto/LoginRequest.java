package com.example.taskboard.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ログインリクエストDTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    /** ユーザー名 */
    @NotBlank(message = "ユーザー名は必須です")
    private String username;

    /** パスワード */
    @NotBlank(message = "パスワードは必須です")
    private String password;
}
