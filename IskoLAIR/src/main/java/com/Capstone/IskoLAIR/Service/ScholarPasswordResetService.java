package com.Capstone.IskoLAIR.Service;

import com.Capstone.IskoLAIR.Entity.OurScholars;
import com.Capstone.IskoLAIR.Entity.PasswordResetToken;
import com.Capstone.IskoLAIR.Repository.PasswordResetTokenRepository;
import com.Capstone.IskoLAIR.Repository.ScholarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value; // 🆕 Added for @Value
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class ScholarPasswordResetService {

    @Autowired private ScholarRepository scholarRepository;
    @Autowired private PasswordResetTokenRepository tokenRepository;
    @Autowired private JavaMailSender mailSender;
    @Autowired private PasswordEncoder passwordEncoder;

    @Value("${app.url.backend}")
    private String backendUrl;

    @Value("${app.url.frontend}") // 🆕 Inject frontend URL
    private String frontendUrl;

    // ✅ Generate and send password reset token
    public void createPasswordResetTokenForScholar(String email) {
        Optional<OurScholars> scholarOpt = scholarRepository.findByEmail(email);
        if (scholarOpt.isEmpty()) {
            throw new RuntimeException("Scholar not found!");
        }

        OurScholars scholar = scholarOpt.get();
        String token = UUID.randomUUID().toString();

        // ✅ Check if scholar already has a reset token
        Optional<PasswordResetToken> existingTokenOpt = tokenRepository.findByScholar(scholar);
        if (existingTokenOpt.isPresent()) {
            // ✅ Update existing token instead of creating a new one
            PasswordResetToken existingToken = existingTokenOpt.get();
            existingToken.setToken(token);
            existingToken.updateExpiryDate();  // Update expiration time
            tokenRepository.save(existingToken);
        } else {
            // ✅ Create a new reset token if none exists
            PasswordResetToken resetToken = new PasswordResetToken(token, scholar);
            tokenRepository.save(resetToken);
        }

        sendResetEmail(scholar.getEmail(), token); // ✅ Call email sender method
    }

    // ✅ Method to send the reset email
    private void sendResetEmail(String email, String token) {
        // Use backendUrl configured in application.properties
        String resetUrl = backendUrl + "/api/scholar/change-password?token=" + token;

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(email);
        mailMessage.setFrom("iskolair.noreply@gmail.com"); // ✅ Set sender email
        mailMessage.setSubject("Password Reset Request");
        mailMessage.setText("Click the link to reset your password: " + resetUrl);

        mailSender.send(mailMessage); // ✅ Send email
    }

    public boolean validatePasswordResetToken(String token) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);
        return tokenOpt.isPresent() && !tokenOpt.get().isExpired();
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isEmpty() || tokenOpt.get().isExpired()) {
            throw new RuntimeException("Invalid or expired token!");
        }

        PasswordResetToken resetToken = tokenOpt.get();
        OurScholars scholar = resetToken.getScholar();

        // ✅ Encode and update password
        String encodedPassword = passwordEncoder.encode(newPassword);
        scholar.setPassword(encodedPassword);
        scholar.setFirstTimeLogin(false); // Ensure scholar can log in

        // ✅ Save updated scholar
        scholarRepository.save(scholar);

        // ✅ Delete the token after successful reset
        tokenRepository.delete(resetToken);
    }

    public String createPasswordResetLink(String token) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isPresent() && !tokenOpt.get().isExpired()) {
            // 🆕 Redirect to frontend instead of backend
            return frontendUrl + "/reset-password?token=" + token;
        }
        return null;
    }
}
