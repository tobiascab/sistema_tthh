package com.coopreducto.tthh.service;

import com.coopreducto.tthh.dto.AuthResponseDTO;
import com.coopreducto.tthh.dto.LoginRequestDTO;

public interface AuthService {
    AuthResponseDTO login(LoginRequestDTO request);

    AuthResponseDTO refreshToken(String token);

    void logout(String token);
}
