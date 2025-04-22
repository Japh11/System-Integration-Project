package com.Capstone.IskoLAIR.Controller;

import com.Capstone.IskoLAIR.Entity.Assignment;
import com.Capstone.IskoLAIR.Entity.OurScholars;
import com.Capstone.IskoLAIR.Service.AssignmentService;
import com.Capstone.IskoLAIR.Service.FileStorageService;
import com.Capstone.IskoLAIR.Service.ScholarService;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/scholars")
public class ScholarController {
    @Autowired
    private ScholarService scholarService;
    private AssignmentService assignmentService;
    @Autowired
    private FileStorageService fileStorageService; // Assuming you have a FileStorageService for file handling

    // 📌 Upload Monitoring Sheet
    @PostMapping("/{id}/upload-monitoring-sheet")
    public ResponseEntity<String> uploadMonitoringSheet(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            scholarService.uploadMonitoringSheet(id, file);
            return ResponseEntity.ok("Monitoring sheet uploaded successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("File upload failed: " + e.getMessage());
        }
    }

    // 📌 Download Monitoring Sheet
    @GetMapping("/{id}/download-monitoring-sheet")
    public ResponseEntity<byte[]> downloadMonitoringSheet(@PathVariable Long id) {
        byte[] fileData = scholarService.getMonitoringSheet(id);
        if (fileData != null) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=monitoring_sheet.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(fileData);
        }
        return ResponseEntity.badRequest().body(null);
    }
    // ✅ Update scholar details
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF') or hasRole('SCHOLAR')")
    public ResponseEntity<OurScholars> updateScholar(@PathVariable Long id, @RequestBody OurScholars updatedScholar) {
        try {
            OurScholars scholar = scholarService.updateScholar(id, updatedScholar);
            return ResponseEntity.ok(scholar);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<String> archiveScholar(@PathVariable Long id) {
        try {
            scholarService.archiveScholar(id);
            return ResponseEntity.ok("Scholar archived successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<Assignment>> getAllAssignments() {
        List<Assignment> assignments = assignmentService.getAllAssignments();
        return ResponseEntity.ok(assignments);
    }

   @GetMapping("/info")
    @PreAuthorize("hasRole('SCHOLAR')")
    public ResponseEntity<OurScholars> getScholarInfo(Principal principal) {
        try {
            // Extract the email of the logged-in scholar from the Principal object
            String email = principal.getName(); // The email is typically stored as the username in the Principal
            OurScholars scholar = scholarService.findByEmail(email);
            if (scholar == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(scholar);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PutMapping("/reactivate/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('STAFF')")
    public ResponseEntity<String> reactivateScholar(@PathVariable Long id) {
        try {
            scholarService.reactivateScholar(id);
            return ResponseEntity.ok("Scholar reactivated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/{id}/upload-profile-picture")
    @PreAuthorize("hasRole('SCHOLAR') or hasRole('ADMIN')")
    public ResponseEntity<?> uploadProfilePicture(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        Optional<OurScholars> optionalScholar = scholarService.findById(id);
        if (optionalScholar.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Scholar not found"));
        }

        OurScholars scholar = optionalScholar.get();
        try {
            // Save the file using FileStorageService
            String fileUrl = fileStorageService.save(file);
            scholar.setProfilePicture(fileUrl);
            scholarService.save(scholar);

            return ResponseEntity.ok(Map.of("message", "Profile picture uploaded successfully", "url", fileUrl));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to upload profile picture"));
        }
    }
    @GetMapping("/{id}/profile-picture")
    @PreAuthorize("hasRole('SCHOLAR') or hasRole('ADMIN')")
    public ResponseEntity<?> getProfilePicture(@PathVariable Long id) {
        Optional<OurScholars> optionalScholar = scholarService.findById(id);
        if (optionalScholar.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Scholar not found"));
        }

        OurScholars scholar = optionalScholar.get();
        return ResponseEntity.ok(Map.of("profilePicture", scholar.getProfilePicture()));
    }
    
}
