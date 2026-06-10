package com.empms.exception;

public class InvalidDateOfJoiningException extends RuntimeException {
    public InvalidDateOfJoiningException(String date) {
        super("Date of joining cannot be in the future: " + date);
    }
}