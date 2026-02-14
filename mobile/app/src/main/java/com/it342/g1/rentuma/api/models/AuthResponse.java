package com.it342.g1.rentuma.api.models;

import com.google.gson.annotations.SerializedName;

/**
 * Response model for login API
 * Contains JWT token and user info
 */
public class AuthResponse {

    @SerializedName("token")
    private String token;

    @SerializedName("username")
    private String username;

    @SerializedName("email")
    private String email;

    public String getToken() {
        return token;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }
}
