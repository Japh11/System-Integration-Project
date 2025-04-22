package com.Capstone.IskoLAIR.Controller;

import com.Capstone.IskoLAIR.Entity.OurScholars;
import com.Capstone.IskoLAIR.Entity.Role;
import com.Capstone.IskoLAIR.Entity.Staff;
import com.Capstone.IskoLAIR.Repository.ScholarRepository;
import com.Capstone.IskoLAIR.Repository.StaffRepository;
import com.Capstone.IskoLAIR.Security.JWTUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
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
     @PreAuthorize("hasRole('ADMIN')") // Only ADMIN can delete staff
     public ResponseEntity<?> deleteStaff(@PathVariable Long id) {
         if (!staffRepo.existsById(id)) {
             return ResponseEntity.badRequest().body(Map.of("error", "Staff not found"));
         }
 
         staffRepo.deleteById(id);
         return ResponseEntity.ok(Map.of("message", "Staff deleted successfully"));
     }
     
     @GetMapping("/visible")
     @PreAuthorize("hasAnyRole('SCHOLAR', 'STAFF', 'ADMIN')")
     public List<Map<String, Object>> getVisibleStaff() {
         return staffRepo.findAll().stream()
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

}
