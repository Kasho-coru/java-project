package com.handover.service;

import com.handover.dto.request.LoginRequest;
import com.handover.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
}
