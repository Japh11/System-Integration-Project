package com.Capstone.IskoLAIR.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@Table(name = "submissions")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "assignment_id", nullable = false)
    private Assignment assignment;

    @ManyToOne
    @JoinColumn(name = "scholar_id", nullable = false)
    private OurScholars scholar;

    private LocalDateTime submittedAt;
    private String filePath;
    private String status; // New field to track submission status
    
    // Constructors
    public Submission() {}

    public Submission(Assignment assignment, String fileUrl, LocalDateTime submittedAt) {
        this.assignment = assignment;
        this.submittedAt = submittedAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getSubmittedAt() { 
        return submittedAt; 
    }
    public void setSubmittedAt(LocalDateTime submittedAt) { 
        this.submittedAt = submittedAt; 
    }
    
    public OurScholars getScholar() {
        return scholar;
    }

    public void setScholar(OurScholars scholar) {
        this.scholar = scholar;
    }

    public Assignment getAssignment() {
        return assignment;
    }

    public void setAssignment(Assignment assignment) {
        this.assignment = assignment;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
