package com.Capstone.IskoLAIR.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "assignments")
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDate dueDate;
    private String status; // Optional: to track if the assignment is completed or not

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", nullable = false) 
     @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Staff staff;
    
    @ManyToOne
    @JoinColumn(name = "scholar_id") // or whatever name you want for the foreign key column
    @JsonIgnore
    private OurScholars scholar;
    
    @OneToMany(mappedBy = "assignment", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Submission> submissions = new ArrayList<>();

    // Constructors
    public Assignment() {}

    public Assignment(String title, String description, LocalDate dueDate, Staff staff) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.staff = staff;
    }

    // Getters and Setters
    public Long getId() { 
        return id; 
    }
    public void setId(Long id) { 
        this.id = id; 
    }

    public String getTitle() { 
        return title; 
    }
    public void setTitle(String title) { 
        this.title = title; 
    }

    public String getDescription() { 
        return description; 
    }
    public void setDescription(String description) { 
        this.description = description; 
    }

    public LocalDate getDueDate() { 
        return dueDate; 
    }
    public void setDueDate(LocalDate dueDate) {
         this.dueDate = dueDate; 
        }

    public List<Submission> getSubmissions() {
         return submissions;
         }
    public void setSubmissions(List<Submission> submissions) { 
        this.submissions = submissions; 
    }

    // Getters and setters
    public Staff getStaff() {
        return staff;
    }

    public void setStaff(Staff staff) {
        this.staff = staff;
    }
    public OurScholars getScholar() {
        return scholar;
    }
    public void setScholar(OurScholars scholar) {
        this.scholar = scholar;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isPastDue() {
        return LocalDate.now().isAfter(this.dueDate) && !"completed".equalsIgnoreCase(this.status);
    }

    public boolean isPending() {
        return LocalDate.now().isBefore(this.dueDate) && !"completed".equalsIgnoreCase(this.status);
    }

    // Method to handle submission logic
    public void turnInAssignment(Submission submission) {
        this.status = "completed"; // Update assignment status to completed
        submission.setStatus("unverified"); // Update submission status to unverified
        this.submissions.add(submission); // Add the submission to the list
    }
}
