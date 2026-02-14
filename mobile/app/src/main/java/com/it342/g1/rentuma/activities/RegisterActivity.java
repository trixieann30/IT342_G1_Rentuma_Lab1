package com.it342.g1.rentuma.activities;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Patterns;
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
import com.it342.g1.rentuma.api.models.MessageResponse;
import com.it342.g1.rentuma.api.models.RegisterRequest;
import com.it342.g1.rentuma.utils.SessionManager;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * RegisterActivity - Handles new user registration
 * After successful registration, auto-logs in the user
 */
public class RegisterActivity extends AppCompatActivity {

    private TextInputLayout tilUsername, tilEmail, tilPassword, tilConfirmPassword;
    private TextInputEditText etUsername, etEmail, etPassword, etConfirmPassword;
    private MaterialButton btnRegister;
    private ProgressBar progressBar;
    private TextView tvError, tvGoToLogin;

    private ApiService apiService;
    private SessionManager sessionManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        // Initialize
        apiService = ApiClient.getApiService();
        sessionManager = new SessionManager(this);

        // Bind views
        tilUsername = findViewById(R.id.tilUsername);
        tilEmail = findViewById(R.id.tilEmail);
        tilPassword = findViewById(R.id.tilPassword);
        tilConfirmPassword = findViewById(R.id.tilConfirmPassword);
        etUsername = findViewById(R.id.etUsername);
        etEmail = findViewById(R.id.etEmail);
        etPassword = findViewById(R.id.etPassword);
        etConfirmPassword = findViewById(R.id.etConfirmPassword);
        btnRegister = findViewById(R.id.btnRegister);
        progressBar = findViewById(R.id.progressBar);
        tvError = findViewById(R.id.tvError);
        tvGoToLogin = findViewById(R.id.tvGoToLogin);

        // Set click listeners
        btnRegister.setOnClickListener(v -> attemptRegister());
        tvGoToLogin.setOnClickListener(v -> {
            finish(); // Go back to Login
        });
    }

    /**
     * Validate inputs and attempt registration via API
     */
    private void attemptRegister() {
        // Reset errors
        tilUsername.setError(null);
        tilEmail.setError(null);
        tilPassword.setError(null);
        tilConfirmPassword.setError(null);
        hideError();

        String username = etUsername.getText().toString().trim();
        String email = etEmail.getText().toString().trim();
        String password = etPassword.getText().toString().trim();
        String confirmPassword = etConfirmPassword.getText().toString().trim();

        // Validate fields
        if (TextUtils.isEmpty(username)) {
            tilUsername.setError(getString(R.string.error_empty_username));
            return;
        }
        if (TextUtils.isEmpty(email)) {
            tilEmail.setError(getString(R.string.error_empty_email));
            return;
        }
        if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            tilEmail.setError(getString(R.string.error_invalid_email));
            return;
        }
        if (TextUtils.isEmpty(password)) {
            tilPassword.setError(getString(R.string.error_empty_password));
            return;
        }
        if (password.length() < 6) {
            tilPassword.setError(getString(R.string.error_short_password));
            return;
        }
        if (!password.equals(confirmPassword)) {
            tilConfirmPassword.setError(getString(R.string.error_password_mismatch));
            return;
        }

        // Show loading
        setLoading(true);

        // Make register API call
        RegisterRequest request = new RegisterRequest(username, email, password);
        apiService.register(request).enqueue(new Callback<MessageResponse>() {
            @Override
            public void onResponse(Call<MessageResponse> call, Response<MessageResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    MessageResponse msgResponse = response.body();

                    if (msgResponse.isSuccess()) {
                        // Registration successful! Now auto-login
                        Toast.makeText(RegisterActivity.this, "Account created! Signing in...", Toast.LENGTH_SHORT)
                                .show();
                        autoLogin(username, password);
                    } else {
                        setLoading(false);
                        showError(msgResponse.getDisplayMessage());
                    }
                } else {
                    setLoading(false);
                    showError(getString(R.string.error_register_failed));
                }
            }

            @Override
            public void onFailure(Call<MessageResponse> call, Throwable t) {
                setLoading(false);
                showError(getString(R.string.error_network) + "\n" + t.getMessage());
            }
        });
    }

    /**
     * Auto-login after successful registration
     */
    private void autoLogin(String username, String password) {
        LoginRequest loginRequest = new LoginRequest(username, password);
        apiService.login(loginRequest).enqueue(new Callback<AuthResponse>() {
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

                    // Navigate to Dashboard
                    Intent intent = new Intent(RegisterActivity.this, DashboardActivity.class);
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                    startActivity(intent);
                    finish();
                } else {
                    // Registration succeeded but auto-login failed
                    Toast.makeText(RegisterActivity.this, "Account created! Please log in.", Toast.LENGTH_LONG).show();
                    finish(); // Go back to log in
                }
            }

            @Override
            public void onFailure(Call<AuthResponse> call, Throwable t) {
                setLoading(false);
                Toast.makeText(RegisterActivity.this, "Account created! Please log in.", Toast.LENGTH_LONG).show();
                finish();
            }
        });
    }

    /**
     * Show/hide loading state
     */
    private void setLoading(boolean loading) {
        progressBar.setVisibility(loading ? View.VISIBLE : View.GONE);
        btnRegister.setEnabled(!loading);
        if (loading) {
            btnRegister.setText(getString(R.string.loading));
        } else {
            btnRegister.setText(getString(R.string.btn_create_account));
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
