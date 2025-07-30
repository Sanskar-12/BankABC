package com.bankapp.service;

import com.bankapp.dto.auth.JwtResponseDto;
import com.bankapp.dto.auth.LoginRequestDto;
import com.bankapp.dto.auth.RegisterRequestDto;

public interface AuthService {
    void registerUser(RegisterRequestDto registerRequest);
    JwtResponseDto loginUser(LoginRequestDto loginRequest);
}
