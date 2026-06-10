package com.empms.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET = "mysecretkeymysecretkeymysecretkey12";
    private final long   EXPIRY = 1000 * 60 * 60;

    private SecretKey key() { return Keys.hmacShaKeyFor(SECRET.getBytes()); }


    public String generateToken(String username, String role) {
        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRY))
                .signWith(key())
                .compact();
    }

    public String validateToken(String token) {
        return Jwts.parser().verifyWith(key()).build()
                .parseSignedClaims(token).getPayload().getSubject();
    }


    public String extractRole(String token) {
        return (String) Jwts.parser().verifyWith(key()).build()
                .parseSignedClaims(token).getPayload().get("role");
    }
}