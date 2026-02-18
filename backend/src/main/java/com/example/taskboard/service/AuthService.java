package com.example.taskboard.service;

import com.example.taskboard.config.JwtTokenProvider;
import com.example.taskboard.dto.LoginRequest;
import com.example.taskboard.dto.LoginResponse;
import com.example.taskboard.dto.RegisterRequest;
import com.example.taskboard.dto.UserResponse;
import com.example.taskboard.model.Role;
import com.example.taskboard.model.User;
import com.example.taskboard.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 認証サービス
 * ログインとユーザー登録のビジネスロジックを提供する
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * ログイン処理
     * ユーザー名とパスワードを検証し、JWTトークンを発行する
     */
    public LoginResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()));

            String token = jwtTokenProvider.generateToken(authentication);

            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("ユーザーが見つかりません"));

            log.info("ユーザーがログインしました: {}", request.getUsername());

            return LoginResponse.builder()
                    .token(token)
                    .tokenType("Bearer")
                    .username(user.getUsername())
                    .displayName(user.getDisplayName())
                    .role(user.getRole().name())
                    .build();

        } catch (BadCredentialsException e) {
            log.warn("ログイン失敗 - ユーザー名またはパスワードが正しくありません: {}",
                    request.getUsername());
            throw new BadCredentialsException("ユーザー名またはパスワードが正しくありません");
        }
    }

    /**
     * ユーザー登録処理
     * 新しいユーザーを作成し、レスポンスを返す
     */
    @Transactional
    public UserResponse register(RegisterRequest request) {
        // ユーザー名の重複チェック
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException(
                    "ユーザー名 '" + request.getUsername() + "' は既に使用されています");
        }

        // ユーザーエンティティを作成
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .displayName(request.getDisplayName())
                .role(Role.USER)
                .build();

        User savedUser = userRepository.save(user);
        log.info("新しいユーザーが登録されました: {}", savedUser.getUsername());

        return UserResponse.fromEntity(savedUser);
    }
}
