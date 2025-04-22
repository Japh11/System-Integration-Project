package com.Capstone.IskoLAIR.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.Capstone.IskoLAIR.Entity.Admin;
import com.Capstone.IskoLAIR.Entity.OurScholars;
import com.Capstone.IskoLAIR.Entity.Staff;
import com.Capstone.IskoLAIR.Models.AdminLoginCredentials;
import com.Capstone.IskoLAIR.Models.ScholarLoginCredentials;
import com.Capstone.IskoLAIR.Models.StaffLoginCredentials;
import com.Capstone.IskoLAIR.Repository.AdminRepository;
import com.Capstone.IskoLAIR.Repository.ScholarRepository;
import com.Capstone.IskoLAIR.Repository.StaffRepository;
import com.Capstone.IskoLAIR.Security.JWTUtil;
import com.Capstone.IskoLAIR.Service.ScholarPasswordResetService;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private AdminRepository adminRepo;
    @Autowired private ScholarRepository scholarRepo;
    @Autowired private StaffRepository staffRepo;
    @Autowired private JWTUtil jwtUtil;
    @Autowired private AuthenticationManager authManager;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private ScholarPasswordResetService passwordResetService;

    // ✅ Admin Registration (Includes Role)
    @PostMapping("/register-admin")
    public ResponseEntity<Map<String, Object>> registerAdmin(@RequestBody Admin admin) {
        if (adminRepo.findByEmail(admin.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Admin already exists"));
        }
        
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        admin = adminRepo.save(admin);
        
        String token = jwtUtil.generateToken(admin.getEmail(), "ADMIN");
        return ResponseEntity.ok(Map.of("jwt-token", token, "role", "ADMIN"));
    }

    // ✅ Scholar Registration (Includes Role)
    @PostMapping("/register-scholar")
    public ResponseEntity<Map<String, Object>> registerScholar(@RequestBody OurScholars scholar) {
        if (scholarRepo.findByEmail(scholar.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Scholar already exists"));
        }

        scholar.setPassword(passwordEncoder.encode(scholar.getPassword()));
        scholar.setFirstTimeLogin(true); // First-time login flag
        scholar = scholarRepo.save(scholar);

        String token = jwtUtil.generateToken(scholar.getEmail(), "SCHOLAR");
        return ResponseEntity.ok(Map.of("jwt-token", token, "role", "SCHOLAR"));
    }

    // ✅ Admin Login (Proper Response Handling)
    @PostMapping("/login-admin")
    public ResponseEntity<Map<String, Object>> loginAdmin(@RequestBody AdminLoginCredentials body) {
        try {
            authManager.authenticate(new UsernamePasswordAuthenticationToken(body.getEmail(), body.getPassword()));

            Optional<Admin> adminOpt = adminRepo.findByEmail(body.getEmail());
            if (adminOpt.isPresent()) {
                Admin admin = adminOpt.get();
                String token = jwtUtil.generateToken(admin.getEmail(), "ADMIN");

                return ResponseEntity.ok(Map.of(
                    "jwt-token", token,
                    "role", "ADMIN"
                ));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Admin not found"));
            }
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }
    }

    @PostMapping("/login-scholar")
    public ResponseEntity<Map<String, Object>> loginScholar(@RequestBody ScholarLoginCredentials body) {
        try {
            authManager.authenticate(new UsernamePasswordAuthenticationToken(body.getEmail(), body.getPassword()));

            Optional<OurScholars> scholarOpt = scholarRepo.findByEmail(body.getEmail());
            if (scholarOpt.isPresent()) {
                OurScholars scholar = scholarOpt.get();

                // 🟢 First-Time Login Handling
                if (scholar.isFirstTimeLogin()) {
                    passwordResetService.createPasswordResetTokenForScholar(scholar.getEmail());
                    return ResponseEntity.ok(Map.of("message", "Check email to reset password."));
                }

                // 🟢 Normal Login (Token + Role + Scholar ID)
                String token = jwtUtil.generateToken(scholar.getEmail(), "SCHOLAR");
                return ResponseEntity.ok(Map.of(
                    "jwt-token", token,
                    "role", "SCHOLAR",
                    "scholarId", scholar.getId()  // ✅ Include scholarId in the response
                ));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Scholar not found"));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }
    }


    
 
    @PostMapping("/login-staff")
    public ResponseEntity<Map<String, Object>> loginStaff(@RequestBody StaffLoginCredentials body) {
        try {
            authManager.authenticate(new UsernamePasswordAuthenticationToken(body.getEmail(), body.getPassword()));

            Optional<Staff> staffOpt = staffRepo.findByEmail(body.getEmail());
            if (staffOpt.isPresent()) {
                Staff staff = staffOpt.get();
                String token = jwtUtil.generateToken(staff.getEmail(), "STAFF");

                // ✅ Debugging: Print staff ID
                System.out.println("Staff Login Success - Staff ID: " + staff.getId());

                return ResponseEntity.ok(Map.of(
                    "jwt-token", token,
                    "role", "STAFF",
                    "staffId", staff.getId()  // ✅ Ensure staffId is included
                ));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Staff not found"));
            }
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }
    }

}
