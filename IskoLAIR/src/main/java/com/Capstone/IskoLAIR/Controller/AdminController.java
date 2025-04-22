package com.Capstone.IskoLAIR.Controller;

import com.Capstone.IskoLAIR.Entity.Admin;
import com.Capstone.IskoLAIR.Entity.OurScholars;
import com.Capstone.IskoLAIR.Entity.Role;
import com.Capstone.IskoLAIR.Entity.Staff;
import com.Capstone.IskoLAIR.Repository.AdminRepository;
import com.Capstone.IskoLAIR.Repository.ScholarRepository;
import com.Capstone.IskoLAIR.Repository.StaffRepository;
import com.Capstone.IskoLAIR.Security.JWTUtil;
import com.Capstone.IskoLAIR.Service.AdminService;
import com.Capstone.IskoLAIR.Service.ScholarService;
import com.Capstone.IskoLAIR.Service.StaffService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {
    
    @Autowired 
    private AdminRepository adminRepo;
    @Autowired 
    private ScholarRepository scholarRepo;
    @Autowired 
    private AdminService adminService;
    @Autowired 
    private StaffRepository staffRepo;
    @Autowired 
    private PasswordEncoder passwordEncoder;
    @Autowired 
    private JWTUtil jwtUtil;
    @Autowired
    private ScholarService scholarService;
    @Autowired
    private StaffService staffService;

    // ✅ Fetch admin details
    @GetMapping("/info")
    public ResponseEntity<?> getAdminDetails() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Admin admin = adminRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        return ResponseEntity.ok(admin);
    }

    // ✅ Admin registers a scholar
    @PostMapping("/register-scholar")
    @PreAuthorize("hasRole('ADMIN')")  // Only admins can access this
    public ResponseEntity<?> registerScholar(@RequestBody OurScholars scholar) {
        if (scholarRepo.findByEmail(scholar.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Scholar already exists"));
        }

        // ✅ Set the correct role
        scholar.setRole(Role.SCHOLAR);

        // ✅ Encode password & save scholar
        scholar.setPassword(passwordEncoder.encode(scholar.getPassword()));
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email;

        if (principal instanceof org.springframework.security.core.userdetails.User userDetails) {
            email = userDetails.getUsername(); // ✅ get email (username)
        } else {
            throw new RuntimeException("Unexpected principal type: " + principal.getClass());
        }

        Admin admin = adminRepo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Admin not found"));

        scholar.setCreatedBy(admin);
        scholarRepo.saveAndFlush(scholar);



        // ✅ Generate JWT token for scholar (optional)
        String token = jwtUtil.generateToken(scholar.getEmail(), "SCHOLAR");
        return ResponseEntity.ok(Map.of("jwt-token", token));
    }
    

 // ✅ Admin registers a staff
    @PostMapping("/register-staff")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> registerStaff(@RequestBody Staff staff) {
        if (staffRepo.findByEmail(staff.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Staff already exists"));
        }

        // ✅ Set default role
        staff.setRole(Role.STAFF);
        staff.setPassword(passwordEncoder.encode(staff.getPassword()));

        staffRepo.save(staff);

        // ✅ Generate JWT token
        String token = jwtUtil.generateToken(staff.getEmail(), "STAFF");
        return ResponseEntity.ok(Map.of("jwt-token", token));
    }
    
    @GetMapping("/scholars")
    public ResponseEntity<List<OurScholars>> getAllScholars() {
        List<OurScholars> scholars = scholarService.getAllScholars();
        System.out.println("Scholars fetched: " + scholars.size());
        return ResponseEntity.ok(scholars);
    }
    /*@GetMapping("/scholars")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OurScholars>> getAdminScholars() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email;
        if (principal instanceof org.springframework.security.core.userdetails.User userDetails) {
            email = userDetails.getUsername();
        } else {
            throw new RuntimeException("Unexpected principal type");
        }

        Admin admin = adminRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("Admin not found"));
        List<OurScholars> scholars = scholarRepo.findByCreatedBy(admin);
        return ResponseEntity.ok(scholars);
    }*/


    @GetMapping("/staff")
    public ResponseEntity<List<Staff>> getAllStaff() {
        List<Staff> staffList = staffService.getAllStaff();
        return ResponseEntity.ok(staffList);
    }
}
