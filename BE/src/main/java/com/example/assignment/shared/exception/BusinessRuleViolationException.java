package com.example.assignment.shared.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BusinessRuleViolationException extends RuntimeException {

    public BusinessRuleViolationException(String message) {
        super(message);
    }

    public BusinessRuleViolationException(String rule, String detail) {
        super(String.format("Business rule violated [%s]: %s", rule, detail));
    }
}
