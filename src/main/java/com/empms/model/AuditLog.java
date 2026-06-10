package com.empms.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long   employeeId;   // null for auth events
    private String username;     // who performed the action
    private String role;         // their role
    private String action;       // CREATE / UPDATE / DELETE / REGISTER / LOGIN
    private String source;       // REST / JMS

    @Column(columnDefinition = "TEXT")
    private String request;      // what was sent

    @Column(columnDefinition = "TEXT")
    private String response;     // what was returned

    private String remarks;      // short description
    private LocalDateTime timestamp;
}