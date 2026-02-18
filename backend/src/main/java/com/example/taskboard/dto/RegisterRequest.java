package com.example.taskboard.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ユーザー登録リクエストDTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    /** ユーザー名 */
    @NotBlank(message = "ユーザー名は必須です")
    @Size(min = 3, max = 50, message = "ユーザー名は3文字以上50文字以下で入力してください")
    private String username;

    /** パスワード */
    @NotBlank(message = "パスワードは必須です")
    @Size(min = 6, max = 100, message = "パスワードは6文字以上100文字以下で入力してください")
    private String password;

    /** 表示名 */
    @NotBlank(message = "表示名は必須です")
    @Size(max = 100, message = "表示名は100文字以下で入力してください")
    private String displayName;
}
