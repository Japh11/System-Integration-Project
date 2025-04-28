package com.Capstone.IskoLAIR.Controller;

import com.Capstone.IskoLAIR.Entity.OurScholars;
import com.Capstone.IskoLAIR.Entity.Role;
import com.Capstone.IskoLAIR.Entity.Staff;
import com.Capstone.IskoLAIR.Repository.ScholarRepository;
import com.Capstone.IskoLAIR.Repository.StaffRepository;
import com.Capstone.IskoLAIR.Security.JWTUtil;
import com.Capstone.IskoLAIR.Service.FileStorageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/staff")
public class StaffController {
    
    @Autowired private ScholarRepository scholarRepo;
    @Autowired private StaffRepository staffRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JWTUtil jwtUtil;
    @Autowired private FileStorageService fileStorageService; // Assuming you have a service for file storage

    // ✅ Staff registers a scholar
    @PostMapping("/register-scholar")
    @PreAuthorize("hasRole('STAFF')")  // Only staff can access this route
    public ResponseEntity<?> registerScholar(@RequestBody OurScholars scholar) {
        if (scholarRepo.findByEmail(scholar.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Scholar already exists"));
        }

        // ✅ Set the correct role for Scholar
        scholar.setRole(Role.SCHOLAR);

        // ✅ Encode password & save scholar
        scholar.setPassword(passwordEncoder.encode(scholar.getPassword()));
        scholarRepo.save(scholar);

        // ✅ Generate JWT token for scholar (optional)
        String token = jwtUtil.generateToken(scholar.getEmail(), "SCHOLAR");
        return ResponseEntity.ok(Map.of("jwt-token", token));
    }
     // ✅ Update staff details
     @PutMapping("/{id}")
     @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')") // Allow both STAFF and ADMIN roles
     public ResponseEntity<?> updateStaff(@PathVariable Long id, @RequestBody Staff updatedStaff) {
         Optional<Staff> existingStaff = staffRepo.findById(id);
         if (existingStaff.isEmpty()) {
             return ResponseEntity.badRequest().body(Map.of("error", "Staff not found"));
         }
 
         Staff staff = existingStaff.get();
         staff.setFirstName(updatedStaff.getFirstName());
         staff.setLastName(updatedStaff.getLastName());
         staff.setEmail(updatedStaff.getEmail());
         if (updatedStaff.getPassword() != null && !updatedStaff.getPassword().isEmpty()) {
             staff.setPassword(passwordEncoder.encode(updatedStaff.getPassword()));
         }
         staffRepo.save(staff);
 
         return ResponseEntity.ok(staff);
     }
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> archiveStaff(@PathVariable Long id) {
        Optional<Staff> optionalStaff = staffRepo.findById(id);
        if (optionalStaff.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Staff not found"));
        }

        Staff staff = optionalStaff.get();
        staff.setArchived(true);
        staffRepo.save(staff);

        return ResponseEntity.ok(Map.of("message", "Staff archived successfully"));
    }
     
    @GetMapping("/visible")
    @PreAuthorize("hasAnyRole('SCHOLAR', 'STAFF', 'ADMIN')")
    public List<Map<String, Object>> getVisibleStaff() {
        return staffRepo.findByArchivedFalse().stream()
            .map(staff -> {
                Map<String, Object> m = new HashMap<>();
                m.put("id", staff.getId());
                m.put("firstName", staff.getFirstName());
                m.put("lastName", staff.getLastName());
                m.put("email", staff.getEmail());
                return m;
            })
            .collect(Collectors.toList());
    }
    @PutMapping("/reactivate/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> reactivateStaff(@PathVariable Long id) {
        Optional<Staff> optionalStaff = staffRepo.findById(id);
        if (optionalStaff.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Staff not found"));
        }

        Staff staff = optionalStaff.get();
        if (!staff.isArchived()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Staff is already active"));
        }

        staff.setArchived(false);
        staffRepo.save(staff);

        return ResponseEntity.ok(Map.of("message", "Staff reactivated successfully"));
    }
    @GetMapping("/archived")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Map<String, Object>> getArchivedStaff() {
        return staffRepo.findByArchivedTrue().stream()
            .map(staff -> {
                Map<String, Object> m = new HashMap<>();
                m.put("id", staff.getId());
                m.put("firstName", staff.getFirstName());
                m.put("lastName", staff.getLastName());
                m.put("email", staff.getEmail());
                return m;
            })
            .collect(Collectors.toList());
    }
    @PostMapping("/{id}/upload-profile-picture")
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN')")
    public ResponseEntity<?> uploadProfilePicture(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        Optional<Staff> optionalStaff = staffRepo.findById(id);
        if (optionalStaff.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Staff not found"));
        }

        Staff staff = optionalStaff.get();
        try {
            // Save the file using FileStorageService
            String fileUrl = fileStorageService.save(file);
            staff.setProfilePicture(fileUrl);
            staffRepo.save(staff);

            return ResponseEntity.ok(Map.of("message", "Profile picture uploaded successfully", "url", fileUrl));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to upload profile picture"));
        }
    }
    @GetMapping("/{id}/profile-picture")
    @PreAuthorize("hasRole('STAFF') or hasRole('ADMIN') or hasRole('SCHOLAR')")
    public ResponseEntity<?> getProfilePicture(@PathVariable Long id) {
        Optional<Staff> optionalStaff = staffRepo.findById(id);
        if (optionalStaff.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Staff not found"));
        }

        Staff staff = optionalStaff.get();
        return ResponseEntity.ok(Map.of("profilePicture", staff.getProfilePicture()));
    }
}
