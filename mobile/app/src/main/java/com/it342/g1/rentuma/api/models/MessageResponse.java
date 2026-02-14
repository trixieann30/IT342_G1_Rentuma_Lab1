package com.it342.g1.rentuma.api.models;

import com.google.gson.annotations.SerializedName;

/**
 * Generic message response from backend
 * Used for register and logout responses
 */
public class MessageResponse {

    @SerializedName("message")
    private String message;

    @SerializedName("error")
    private String error;

    public String getMessage() {
        return message;
    }

    public String getError() {
        return error;
    }

    public boolean isSuccess() {
        return error == null || error.isEmpty();
    }

    public String getDisplayMessage() {
        if (error != null && !error.isEmpty()) {
            return error;
        }
        return message != null ? message : "Unknown response";
    }
}
