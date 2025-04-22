package com.Capstone.IskoLAIR.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Capstone.IskoLAIR.Entity.Admin;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    public Optional<Admin> findByEmail(String email);
}
