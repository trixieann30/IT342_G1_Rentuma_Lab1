package com.it342.g1.rentuma.activities;

import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.button.MaterialButton;
import com.it342.g1.rentuma.R;
import com.it342.g1.rentuma.api.ApiClient;
import com.it342.g1.rentuma.api.ApiService;
import com.it342.g1.rentuma.api.models.MessageResponse;
import com.it342.g1.rentuma.utils.SessionManager;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * DashboardActivity - Protected profile/dashboard screen
 * Redirects to Login if user is not authenticated
 */
public class DashboardActivity extends AppCompatActivity {

    private TextView tvAvatarInitial, tvWelcomeUsername, tvUsername, tvEmail;
    private MaterialButton btnLogout;

    private ApiService apiService;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        sessionManager = new SessionManager(this);

        // PROTECTED: Redirect to Login if not authenticated
        if (!sessionManager.isLoggedIn()) {
            redirectToLogin();
            return;
        }

        setContentView(R.layout.activity_dashboard);

        // Initialize API
        apiService = ApiClient.getApiService();

        // Bind views
        tvAvatarInitial = findViewById(R.id.tvAvatarInitial);
        tvWelcomeUsername = findViewById(R.id.tvWelcomeUsername);
        tvUsername = findViewById(R.id.tvUsername);
        tvEmail = findViewById(R.id.tvEmail);
        btnLogout = findViewById(R.id.btnLogout);

        // Populate user data
        populateUserData();

        // Logout button
        btnLogout.setOnClickListener(v -> confirmLogout());
    }

    /**
     * Populate UI with user data from session
     */
    private void populateUserData() {
        String username = sessionManager.getUsername();
        String email = sessionManager.getEmail();

        // Set avatar initial (first letter of username)
        if (username != null && !username.isEmpty()) {
            tvAvatarInitial.setText(String.valueOf(username.charAt(0)).toUpperCase());
        }

        tvWelcomeUsername.setText(username != null ? username : "User");
        tvUsername.setText(username != null ? username : "N/A");
        tvEmail.setText(email != null && !email.isEmpty() ? email : "N/A");
    }

    /**
     * Show confirmation dialog before logout
     */
    private void confirmLogout() {
        new AlertDialog.Builder(this)
                .setTitle("Sign Out")
                .setMessage("Are you sure you want to sign out?")
                .setPositiveButton("Sign Out", (dialog, which) -> performLogout())
                .setNegativeButton("Cancel", null)
                .show();
    }

    /**
     * Perform logout - call backend API and clear session
     */
    private void performLogout() {
        String bearerToken = sessionManager.getBearerToken();

        if (bearerToken != null) {
            // Call backend logout endpoint
            apiService.logout(bearerToken).enqueue(new Callback<MessageResponse>() {
                @Override
                public void onResponse(Call<MessageResponse> call, Response<MessageResponse> response) {
                    // Clear session regardless of response
                    clearSessionAndRedirect();
                }

                @Override
                public void onFailure(Call<MessageResponse> call, Throwable t) {
                    // Clear session even if API call fails
                    clearSessionAndRedirect();
                }
            });
        } else {
            clearSessionAndRedirect();
        }
    }

    /**
     * Clear session data and redirect to Login
     */
    private void clearSessionAndRedirect() {
        sessionManager.clearSession();
        Toast.makeText(this, "Signed out successfully", Toast.LENGTH_SHORT).show();
        redirectToLogin();
    }

    /**
     * Redirect to Login and clear back stack
     */
    private void redirectToLogin() {
        Intent intent = new Intent(DashboardActivity.this, LoginActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }
}
