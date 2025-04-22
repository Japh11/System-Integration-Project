package com.Capstone.IskoLAIR.Controller;

import java.io.IOException; // ✅ Correct import
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Capstone.IskoLAIR.Service.ScholarPasswordResetService;

@RestController
@RequestMapping("/api/scholar")
@CrossOrigin(origins = "http://localhost:5173") // ✅ Allow requests from Vite frontend
public class ScholarPasswordResetController {

    @Autowired 
    private ScholarPasswordResetService passwordResetService;

    @PostMapping("/reset-password")
    public ResponseEntity<String> requestPasswordReset(@RequestParam("email") String email) {
        passwordResetService.createPasswordResetTokenForScholar(email);
        return ResponseEntity.ok("Password reset email sent!");
    }

    @GetMapping("/change-password")
    public void validateToken(@RequestParam String token, HttpServletResponse response) throws IOException {
        if (passwordResetService.validatePasswordResetToken(token)) {
            String resetPageUrl = "http://localhost:5173/reset-password?token=" + token; 
            response.sendRedirect(resetPageUrl);
        } else {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid or expired token!");
        }
    }

    @PostMapping(value = "/save-password", consumes = "application/x-www-form-urlencoded")
    public ResponseEntity<String> resetPassword(
            @RequestParam("token") String token,
            @RequestParam("newPassword") String newPassword) {
        try {
            passwordResetService.resetPassword(token, newPassword);
            return ResponseEntity.ok("Password successfully reset!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Invalid or expired token.");
        }
    }

}
