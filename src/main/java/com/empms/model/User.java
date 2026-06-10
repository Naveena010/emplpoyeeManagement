package com.empms.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users",
        uniqueConstraints = @UniqueConstraint(columnNames = {"username", "role"}))
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    private String password;
    private String role;
    private boolean active = true;
}