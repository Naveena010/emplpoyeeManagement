package com.empms.exception;

public class InvalidXmlException extends RuntimeException {
    public InvalidXmlException(String detail) {
        super("XML validation failed: " + detail);
    }
}