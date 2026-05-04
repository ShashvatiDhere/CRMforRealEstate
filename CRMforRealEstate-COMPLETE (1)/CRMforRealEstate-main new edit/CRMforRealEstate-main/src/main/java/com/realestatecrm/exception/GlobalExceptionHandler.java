package com.realestatecrm.exception;

import com.realestatecrm.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Business logic errors (not found, duplicate, invalid input)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<String>> handleRuntimeException(RuntimeException ex) {
        String message = ex.getMessage() != null ? ex.getMessage() : "An error occurred";
        HttpStatus status = HttpStatus.BAD_REQUEST;

        // Map common patterns to correct HTTP codes
        if (message.toLowerCase().contains("not found")) {
            status = HttpStatus.NOT_FOUND;
        } else if (message.toLowerCase().contains("already exists")
                || message.toLowerCase().contains("duplicate")) {
            status = HttpStatus.CONFLICT;
        } else if (message.toLowerCase().contains("not approved")
                || message.toLowerCase().contains("not an agent")
                || message.toLowerCase().contains("not a manager")) {
            status = HttpStatus.FORBIDDEN;
        }

        return new ResponseEntity<>(
                new ApiResponse<>(false, message, null),
                status
        );
    }

    // 403 from @PreAuthorize
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<String>> handleAccessDenied(AccessDeniedException ex) {
        return new ResponseEntity<>(
                new ApiResponse<>(false, "Access denied: you don't have permission", null),
                HttpStatus.FORBIDDEN
        );
    }

    // @Valid validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<String>> handleValidation(MethodArgumentNotValidException ex) {
        String errorMsg = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .findFirst()
                .orElse("Validation error");

        return new ResponseEntity<>(
                new ApiResponse<>(false, errorMsg, null),
                HttpStatus.BAD_REQUEST
        );
    }

    // Catch-all for unexpected errors
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> handleException(Exception ex) {
        return new ResponseEntity<>(
                new ApiResponse<>(false, "Internal server error: " + ex.getMessage(), null),
                HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
}
