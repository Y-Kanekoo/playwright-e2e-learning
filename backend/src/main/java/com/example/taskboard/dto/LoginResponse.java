package com.example.taskboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ログインレスポンスDTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    /** JWTトークン */
    private String token;

    /** トークン種別 */
    private String tokenType;

    /** ユーザー名 */
    private String username;

    /** 表示名 */
    private String displayName;

    /** 役割 */
    private String role;
}
