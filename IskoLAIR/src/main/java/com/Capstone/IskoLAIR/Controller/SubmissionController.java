package com.Capstone.IskoLAIR.Controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.Capstone.IskoLAIR.Entity.Assignment;
import com.Capstone.IskoLAIR.Entity.Submission;
import com.Capstone.IskoLAIR.Service.SubmissionService;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {
    @Autowired
    private SubmissionService submissionService;

    @PostMapping("/submit/{assignmentId}/{scholarId}")
    public ResponseEntity<Submission> submitAssignment(
            @PathVariable Long assignmentId,
            @PathVariable Long scholarId,
            @RequestParam("file") MultipartFile file) throws IOException {

        Submission submission = submissionService.submitAssignment(assignmentId, scholarId, file);
        submission.setStatus("unverified");

        return ResponseEntity.status(HttpStatus.CREATED).body(submission);
    }
        // New endpoint to fetch all submissions
        @GetMapping
        public ResponseEntity<List<Submission>> getAllSubmissions() {
            List<Submission> submissions = submissionService.getAllSubmissions();
            return ResponseEntity.ok(submissions);
        }
    
        // New endpoint to fetch submissions by scholar ID
        @GetMapping("/scholar/{scholarId}")
        public ResponseEntity<List<Submission>> getSubmissionsByScholar(@PathVariable Long scholarId) {
            List<Submission> submissions = submissionService.getSubmissionsByScholar(scholarId);
            return ResponseEntity.ok(submissions);
        }
    
        // New endpoint to fetch submissions by assignment ID
        @GetMapping("/assignment/{assignmentId}")
        public ResponseEntity<List<Submission>> getSubmissionsByAssignment(@PathVariable Long assignmentId) {
            List<Submission> submissions = submissionService.getSubmissionsByAssignment(assignmentId);
            return ResponseEntity.ok(submissions);
        }
        @PatchMapping("/verify/{submissionId}")
        public ResponseEntity<?> verifySubmission(@PathVariable Long submissionId) {
            try {
                Optional<Submission> submissionOptional = submissionService.getSubmissionById(submissionId);
                if (submissionOptional.isPresent()) {
                    Submission submission = submissionOptional.get();
                    submission.setStatus("verified"); // Update the status to "verified"
                    submissionService.saveSubmission(submission); // Save the updated submission
                    return ResponseEntity.ok("Submission verified successfully");
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Submission not found");
                }
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error verifying submission: " + e.getMessage());
            }
        }
}
