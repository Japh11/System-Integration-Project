package com.Capstone.IskoLAIR.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.Capstone.IskoLAIR.Entity.Assignment;
import com.Capstone.IskoLAIR.Entity.Staff;
import com.Capstone.IskoLAIR.Service.AssignmentService;
import com.Capstone.IskoLAIR.Service.StaffService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private StaffService staffService;  // Inject StaffService to fetch the staff entity

    @PostMapping("/create")
    public ResponseEntity<?> createAssignment(@RequestBody Assignment assignment) {
        try {
            // Check if staffId is provided in the request
            if (assignment.getStaff() == null || assignment.getStaff().getId() == null) {
                return ResponseEntity.badRequest().body("Missing staff or staffId");
            }

            // Fetch the staff object using the staffId
            Staff staff = staffService.getStaffById(assignment.getStaff().getId());
            if (staff == null) {
                return ResponseEntity.badRequest().body("Invalid staffId");  // Return error if staff not found
            }

            // Set the staff to the assignment
            assignment.setStaff(staff);

             // Set the status to "pending" if not already set
            if (assignment.getStatus() == null || assignment.getStatus().isEmpty()) {
                assignment.setStatus("pending");
            }

            // Create and return the assignment
            return ResponseEntity.ok(assignmentService.createAssignment(assignment));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }


    @GetMapping
    public ResponseEntity<List<Assignment>> getAllAssignments() {
        return ResponseEntity.ok(assignmentService.getAllAssignments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Assignment> getAssignmentById(@PathVariable Long id) {
        Optional<Assignment> assignment = assignmentService.getAssignmentById(id);
        return assignment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @GetMapping("/scholar/assignments")
    public ResponseEntity<List<Assignment>> getAssignments(@RequestAttribute("scholarId") Long scholarId) {
        // Use the scholarId to fetch assignments
        List<Assignment> assignments = assignmentService.getAssignmentsForScholar(scholarId);
        return ResponseEntity.ok(assignments);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAssignment(@PathVariable Long id) {
        try {
            boolean isDeleted = assignmentService.deleteAssignment(id);
            if (isDeleted) {
                return ResponseEntity.ok("Assignment deleted successfully");
            } else {
                return ResponseEntity.status(404).body("Assignment not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }   
}
