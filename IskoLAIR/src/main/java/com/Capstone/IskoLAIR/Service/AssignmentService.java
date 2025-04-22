package com.Capstone.IskoLAIR.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Capstone.IskoLAIR.Entity.Assignment;
import com.Capstone.IskoLAIR.Repository.AssignmentRepository;
import com.Capstone.IskoLAIR.Repository.SubmissionRepository;

import java.util.List;
import java.util.Optional;

@Service
public class AssignmentService {

    @Autowired
    private AssignmentRepository assignmentRepository;
    private SubmissionRepository submissionRepository;
    
    public Assignment createAssignment(Assignment assignment) {
        return assignmentRepository.save(assignment);
    }

    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    public Optional<Assignment> getAssignmentById(Long id) {
        return assignmentRepository.findById(id);
    }
    
    public List<Assignment> getAssignmentsForScholar(Long scholarId) {
        List<Assignment> assignments = submissionRepository.findAssignmentsByScholarId(scholarId);

        // Segregate assignments
        assignments.forEach(assignment -> {
            if (assignment.isPastDue()) {
                assignment.setStatus("past due");
            } else if (assignment.isPending()) {
                assignment.setStatus("pending");
            }
        });

        return assignments;
    }
    public boolean deleteAssignment(Long id) {
        Optional<Assignment> assignment = assignmentRepository.findById(id);
        if (assignment.isPresent()) {
            assignmentRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
