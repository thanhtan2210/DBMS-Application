package com.example.assignment.shared.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateResourceException extends RuntimeException {

    public DuplicateResourceException(String resourceName, String field, String value) {
        super(String.format("%s already exists with %s: %s", resourceName, field, value));
    }

    public DuplicateResourceException(String message) {
        super(message);
    }
}
