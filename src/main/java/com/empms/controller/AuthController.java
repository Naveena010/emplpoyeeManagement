package com.empms.controller;

import com.empms.dto.*;
import com.empms.model.AuditLog;
import com.empms.model.User;
import com.empms.repository.AuditLogRepository;
import com.empms.repository.UserRepository;
import com.empms.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil               jwtUtil;
    private final UserRepository        userRepo;
    private final PasswordEncoder       encoder;
    private final AuditLogRepository    auditRepo;

    // ── Register ──────────────────────────────────────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody AuthRequestDTO req) {
        String role = req.getRole() != null ? req.getRole() : "ROLE_USER";

        if (userRepo.existsByUsernameAndRole(req.getUsername(), role)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("User '" + req.getUsername() + "' is already registered as " + role);
        }

        var user = new User();
        user.setUsername(req.getUsername());
        user.setPassword(encoder.encode(req.getPassword()));
        user.setRole(role);
        userRepo.save(user);

        String message = "User registered: " + req.getUsername() + " as " + role;

        // save register audit
        saveAudit(null, req.getUsername(), role, "REGISTER",
                "{ \"username\": \"" + req.getUsername() + "\", \"role\": \"" + role + "\" }",
                "{ \"message\": \"" + message + "\" }",
                "New user registered");

        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }

    // ── Login ─────────────────────────────────────────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody AuthRequestDTO req) {
        var auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));

        var user  = (UserDetails) auth.getPrincipal();
        var role  = user.getAuthorities().iterator().next().getAuthority();
        var token = jwtUtil.generateToken(user.getUsername(), role);

        System.out.println("Login: " + user.getUsername() + " | role: " + role);

        // save login audit
        saveAudit(null, user.getUsername(), role, "LOGIN",
                "{ \"username\": \"" + req.getUsername() + "\" }",
                "{ \"message\": \"Login successful\", \"role\": \"" + role + "\" }",
                "User logged in");

        return ResponseEntity.ok(new AuthResponseDTO(token, user.getUsername(), role));
    }

    // ── Helper ────────────────────────────────────────────────────────────────
    private void saveAudit(Long empId, String username, String role,
                           String action, String request, String response, String remarks) {
        AuditLog log = new AuditLog();
        log.setEmployeeId(empId);
        log.setUsername(username);
        log.setRole(role);
        log.setAction(action);
        log.setSource("REST");
        log.setRequest(request);
        log.setResponse(response);
        log.setRemarks(remarks);
        log.setTimestamp(LocalDateTime.now());
        auditRepo.save(log);
    }
}