package com.it342.g1.rentuma.utils;

import android.content.Context;
import android.content.SharedPreferences;

/**
 * SessionManager - Manages user session using SharedPreferences
 * Stores JWT token and user information
 */
public class SessionManager {

    private static final String PREF_NAME = "RentumaSession";
    private static final String KEY_TOKEN = "token";
    private static final String KEY_USERNAME = "username";
    private static final String KEY_EMAIL = "email";
    private static final String KEY_IS_LOGGED_IN = "isLoggedIn";

    private final SharedPreferences prefs;
    private final SharedPreferences.Editor editor;

    public SessionManager(Context context) {
        prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        editor = prefs.edit();
    }

    /**
     * Save user session after successful login
     */
    public void saveSession(String token, String username, String email) {
        editor.putString(KEY_TOKEN, token);
        editor.putString(KEY_USERNAME, username);
        editor.putString(KEY_EMAIL, email);
        editor.putBoolean(KEY_IS_LOGGED_IN, true);
        editor.apply();
    }

    /**
     * Get stored JWT token
     */
    public String getToken() {
        return prefs.getString(KEY_TOKEN, null);
    }

    /**
     * Get Bearer token string for Authorization header
     */
    public String getBearerToken() {
        String token = getToken();
        return token != null ? "Bearer " + token : null;
    }

    /**
     * Get stored username
     */
    public String getUsername() {
        return prefs.getString(KEY_USERNAME, "User");
    }

    /**
     * Get stored email
     */
    public String getEmail() {
        return prefs.getString(KEY_EMAIL, "");
    }

    /**
     * Check if user is logged in
     */
    public boolean isLoggedIn() {
        return prefs.getBoolean(KEY_IS_LOGGED_IN, false);
    }

    /**
     * Clear session data (logout)
     */
    public void clearSession() {
        editor.clear();
        editor.apply();
    }
}
