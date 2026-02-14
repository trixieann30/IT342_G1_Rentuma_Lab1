package com.it342.g1.rentuma.api;

import com.it342.g1.rentuma.api.models.AuthResponse;
import com.it342.g1.rentuma.api.models.LoginRequest;
import com.it342.g1.rentuma.api.models.MessageResponse;
import com.it342.g1.rentuma.api.models.RegisterRequest;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Header;
import retrofit2.http.POST;

/**
 * Retrofit API service interface
 * Defines all backend API endpoints
 */
public interface ApiService {

    /**
     * Login user
     * POST /api/auth/login
     */
    @POST("auth/login")
    Call<AuthResponse> login(@Body LoginRequest request);

    /**
     * Register new user
     * POST /api/auth/register
     */
    @POST("auth/register")
    Call<MessageResponse> register(@Body RegisterRequest request);

    /**
     * Logout user
     * POST /api/auth/logout
     */
    @POST("auth/logout")
    Call<MessageResponse> logout(@Header("Authorization") String authToken);
}
