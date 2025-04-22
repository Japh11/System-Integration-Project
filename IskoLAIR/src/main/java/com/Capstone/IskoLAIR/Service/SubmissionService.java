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

import java.util.Arrays; 

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private ScholarRepository scholarRepository;

    public Submission submitAssignment(Long assignmentId, Long scholarId, MultipartFile file) throws IOException {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow();
        OurScholars scholar = scholarRepository.findById(scholarId)
                .orElseThrow();

        String filePath = storeFile(file);

        Submission submission = new Submission();
        submission.setAssignment(assignment);
        submission.setScholar(scholar);
        submission.setFilePath(filePath);
        submission.setStatus("unverified");
        submission.setSubmittedAt(LocalDateTime.now());

        return submissionRepository.save(submission);
    }

    public Submission submitOrUpdateSubmission(Long assignmentId, Long scholarId, MultipartFile[] files) throws IOException {
        Submission existing = submissionRepository.findByAssignmentIdAndScholarId(assignmentId, scholarId);

        String combinedFilePaths = Arrays.stream(files)
                .map(file -> {
                    try {
                        return storeFile(file);
                    } catch (IOException e) {
                        throw new RuntimeException("File storage failed: " + file.getOriginalFilename(), e);
                    }
                })
                .collect(Collectors.joining(","));

        if (existing != null) {
            existing.setFilePath(combinedFilePaths);
            existing.setSubmittedAt(LocalDateTime.now());
            existing.setStatus("unverified");
            return submissionRepository.save(existing);
        }

        Submission newSub = new Submission();
        newSub.setAssignment(assignmentRepository.findById(assignmentId).orElseThrow());
        newSub.setScholar(scholarRepository.findById(scholarId).orElseThrow());
        newSub.setFilePath(combinedFilePaths);
        newSub.setSubmittedAt(LocalDateTime.now());
        newSub.setStatus("unverified");

        return submissionRepository.save(newSub);
    }


    private String storeFile(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path path = Paths.get("uploads", fileName);
        Files.createDirectories(path.getParent());
        Files.write(path, file.getBytes());
        return path.toString();
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
        assignmentRepository.save(assignment);
    }

    public Optional<Submission> getSubmissionById(Long submissionId) {
        return submissionRepository.findById(submissionId);
    }

    public void saveSubmission(Submission submission) {
        submissionRepository.save(submission);
    }
}
