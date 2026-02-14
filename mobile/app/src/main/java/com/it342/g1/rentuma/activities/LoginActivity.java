package com.it342.g1.rentuma.activities;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;
import com.it342.g1.rentuma.R;
import com.it342.g1.rentuma.api.ApiClient;
import com.it342.g1.rentuma.api.ApiService;
import com.it342.g1.rentuma.api.models.AuthResponse;
import com.it342.g1.rentuma.api.models.LoginRequest;
import com.it342.g1.rentuma.utils.SessionManager;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * LoginActivity - Handles user authentication
 * Launcher activity - redirects to Dashboard if already logged in
 */
public class LoginActivity extends AppCompatActivity {

    private TextInputLayout tilUsername, tilPassword;
    private TextInputEditText etUsername, etPassword;
    private MaterialButton btnLogin, btnDemoLogin;
    private ProgressBar progressBar;
    private TextView tvError, tvGoToRegister;

    private ApiService apiService;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        sessionManager = new SessionManager(this);

        // If already logged in, go to Dashboard
        if (sessionManager.isLoggedIn()) {
            navigateToDashboard();
            return;
        }

        setContentView(R.layout.activity_login);

        // Initialize API service
        apiService = ApiClient.getApiService();

        // Bind views
        tilUsername = findViewById(R.id.tilUsername);
        tilPassword = findViewById(R.id.tilPassword);
        etUsername = findViewById(R.id.etUsername);
        etPassword = findViewById(R.id.etPassword);
        btnLogin = findViewById(R.id.btnLogin);
        btnDemoLogin = findViewById(R.id.btnDemoLogin);
        progressBar = findViewById(R.id.progressBar);
        tvError = findViewById(R.id.tvError);
        tvGoToRegister = findViewById(R.id.tvGoToRegister);

        // Set click listeners
        btnLogin.setOnClickListener(v -> attemptLogin());
        btnDemoLogin.setOnClickListener(v -> demoLogin());
        tvGoToRegister.setOnClickListener(v -> {
            startActivity(new Intent(LoginActivity.this, RegisterActivity.class));
        });
    }

    /**
     * Validate inputs and attempt login via API
     */
    private void attemptLogin() {
        // Reset errors
        tilUsername.setError(null);
        tilPassword.setError(null);
        hideError();

        String username = etUsername.getText().toString().trim();
        String password = etPassword.getText().toString().trim();

        // Validate
        if (TextUtils.isEmpty(username)) {
            tilUsername.setError(getString(R.string.error_empty_username));
            return;
        }
        if (TextUtils.isEmpty(password)) {
            tilPassword.setError(getString(R.string.error_empty_password));
            return;
        }

        // Show loading
        setLoading(true);

        // Make API call
        LoginRequest request = new LoginRequest(username, password);
        apiService.login(request).enqueue(new Callback<AuthResponse>() {
            @Override
            public void onResponse(Call<AuthResponse> call, Response<AuthResponse> response) {
                setLoading(false);

                if (response.isSuccessful() && response.body() != null) {
                    AuthResponse authResponse = response.body();

                    // Save session
                    sessionManager.saveSession(
                            authResponse.getToken(),
                            authResponse.getUsername(),
                            authResponse.getEmail());

                    Toast.makeText(LoginActivity.this, "Login successful!", Toast.LENGTH_SHORT).show();
                    navigateToDashboard();
                } else {
                    showError(getString(R.string.error_login_failed));
                }
            }

            @Override
            public void onFailure(Call<AuthResponse> call, Throwable t) {
                setLoading(false);
                showError(getString(R.string.error_network) + "\n" + t.getMessage());
            }
        });
    }

    /**
     * Demo login - uses hardcoded demo credentials
     */
    private void demoLogin() {
        etUsername.setText("demo_user");
        etPassword.setText("demo123");
        attemptLogin();
    }

    /**
     * Navigate to Dashboard and finish login
     */
    private void navigateToDashboard() {
        Intent intent = new Intent(LoginActivity.this, DashboardActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }

    /**
     * Show/hide loading state
     */
    private void setLoading(boolean loading) {
        progressBar.setVisibility(loading ? View.VISIBLE : View.GONE);
        btnLogin.setEnabled(!loading);
        btnDemoLogin.setEnabled(!loading);
        if (loading) {
            btnLogin.setText(getString(R.string.loading));
        } else {
            btnLogin.setText(getString(R.string.btn_sign_in));
        }
    }

    /**
     * Show error message
     */
    private void showError(String message) {
        tvError.setText(message);
        tvError.setVisibility(View.VISIBLE);
    }

    /**
     * Hide error message
     */
    private void hideError() {
        tvError.setVisibility(View.GONE);
    }
}
