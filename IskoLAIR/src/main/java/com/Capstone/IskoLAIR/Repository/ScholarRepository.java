package com.Capstone.IskoLAIR.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Capstone.IskoLAIR.Entity.Admin;
import com.Capstone.IskoLAIR.Entity.OurScholars;

public interface ScholarRepository extends JpaRepository<OurScholars, Long> {
	 public Optional<OurScholars> findByEmail(String email);
	 List<OurScholars> findByCreatedBy(Admin admin);
}