package com.Capstone.IskoLAIR.Repository;

import com.Capstone.IskoLAIR.Entity.PasswordResetToken;
import com.Capstone.IskoLAIR.Entity.OurScholars;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    
    // ✅ Find existing reset token by scholar
    Optional<PasswordResetToken> findByScholar(OurScholars scholar);
}
