package com.Capstone.IskoLAIR.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.Capstone.IskoLAIR.Entity.Assignment;
import com.Capstone.IskoLAIR.Entity.OurScholars;
import com.Capstone.IskoLAIR.Entity.Submission;
import com.Capstone.IskoLAIR.Repository.AssignmentRepository;
import com.Capstone.IskoLAIR.Repository.ScholarRepository;
import com.Capstone.IskoLAIR.Repository.SubmissionRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private ScholarRepository scholarRepository;

    public Submission submitAssignment(Long assignmentId, Long scholarId, MultipartFile file) throws IOException {
        // Get the assignment and scholar, throw exception if not found
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow();
        OurScholars scholar = scholarRepository.findById(scholarId)
                .orElseThrow();

        // Save the file (you may want to save it to disk or cloud storage here)
        String fileName = file.getOriginalFilename();
        Path path = Path.of("uploads", fileName);  // Using Path.of to better handle file paths
        Files.createDirectories(path.getParent());  // Ensure directories exist before saving the file
        Files.write(path, file.getBytes());

        // Create the submission object and set its fields
        Submission submission = new Submission();
        submission.setAssignment(assignment);
        submission.setScholar(scholar);
        submission.setFilePath(path.toString());
        submission.setStatus("unverified"); // Set initial status to unverified
        submission.setSubmittedAt(LocalDateTime.now()); // Set the current date and time


        // Save and return the submission
        return submissionRepository.save(submission);
    }

    public List<Submission> getAllSubmissions() {
        return submissionRepository.findAll();
    }


    public List<Submission> getSubmissionsByScholar(Long scholarId) {
        return submissionRepository.findByScholarId(scholarId);
    }

    public List<Submission> getSubmissionsByAssignment(Long assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId);
    }
    public void updateAssignmentStatus(Assignment assignment) {
        assignmentRepository.save(assignment); // Save the updated assignment
    }
    public Optional<Submission> getSubmissionById(Long submissionId) {
        return submissionRepository.findById(submissionId);
    }
    
    public void saveSubmission(Submission submission) {
        submissionRepository.save(submission);
    }
}

