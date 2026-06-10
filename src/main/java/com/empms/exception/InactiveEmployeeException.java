package com.empms.exception;

public class InactiveEmployeeException extends RuntimeException {
    public InactiveEmployeeException(Long id) {
        super("Employee " + id + " is inactive and cannot be modified.");
    }
}