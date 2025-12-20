package com.coopreducto.tthh.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {
    private String token;
    private String tokenType;
    private Long expiresIn;
    private UserInfoDTO user;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfoDTO {
        private Long id;
        private String username;
        private String email;
        private String nombres;
        private String apellidos;
        private String avatarUrl;
        private List<String> roles;
        private Long empleadoId;
    }
}
