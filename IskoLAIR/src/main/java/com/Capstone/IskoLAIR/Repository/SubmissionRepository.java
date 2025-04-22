package com.Capstone.IskoLAIR.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.Capstone.IskoLAIR.Entity.Assignment;
import com.Capstone.IskoLAIR.Entity.Submission;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    @Query("SELECT s.assignment FROM Submission s WHERE s.scholar.id = :scholarId")
    List<Assignment> findAssignmentsByScholarId(@Param("scholarId") Long scholarId);

    @Query("SELECT s FROM Submission s JOIN FETCH s.assignment WHERE s.scholar.id = :scholarId")
    List<Submission> findByScholarId(@Param("scholarId") Long scholarId);

    @Query("SELECT s FROM Submission s JOIN FETCH s.scholar WHERE s.assignment.id = :assignmentId")
    List<Submission> findByAssignmentId(@Param("assignmentId") Long assignmentId);
}
