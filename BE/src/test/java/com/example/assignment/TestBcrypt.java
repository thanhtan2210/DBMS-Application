package com.example.assignment;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class TestBcrypt {
    
    @Test
    public void testHash() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = encoder.encode("123456");
        System.out.println("================================");
        System.out.println("NEW HASH: " + hash);
        boolean matches = encoder.matches("123456", "$2a$10$X/wGyeT6g9aYqBwP2H5oH.P0E1m5R8zP5T8F.K2n.e/1n/7x0qX5q");
        System.out.println("OLD HASH MATCHES: " + matches);
        System.out.println("================================");
    }
}
