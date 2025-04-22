package com.Capstone.IskoLAIR.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Capstone.IskoLAIR.Entity.Assignment;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
	List<Assignment> findByScholarId(Long scholarId);
	
}
