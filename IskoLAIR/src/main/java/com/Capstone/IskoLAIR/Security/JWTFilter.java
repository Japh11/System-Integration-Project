package com.Capstone.IskoLAIR.Security;

import com.Capstone.IskoLAIR.Entity.Admin;
import com.Capstone.IskoLAIR.Entity.OurScholars;
import com.Capstone.IskoLAIR.Entity.Staff;
import com.Capstone.IskoLAIR.Repository.AdminRepository;
import com.Capstone.IskoLAIR.Repository.ScholarRepository;
import com.Capstone.IskoLAIR.Repository.StaffRepository;

import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
public class JWTFilter extends OncePerRequestFilter {

    @Autowired private JWTUtil jwtUtil;
    @Autowired private AdminRepository adminRepo;
    @Autowired private ScholarRepository scholarRepo;
    @Autowired private StaffRepository staffRepo;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String requestPath = request.getRequestURI();

        // Allow specific paths without token validation (e.g., password reset)
        if (requestPath.startsWith("/uploads/") ||
            requestPath.startsWith("/api/fileresources") ||
            requestPath.startsWith("/api/scholar/reset-password") ||
            requestPath.startsWith("/api/scholar/save-password") ||
            requestPath.startsWith("/api/scholar/change-password")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract the Authorization header
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);  // Extract JWT token

            if (jwt.isBlank()) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid JWT Token");
                return;
            }

            try {
                // Validate the token and extract the subject and role
                String email = jwtUtil.validateTokenAndRetrieveSubject(jwt);
                String role = jwtUtil.validateTokenAndRetrieveRole(jwt);
                System.out.println("📧 Extracted email: " + email);
                System.out.println("🛡️ Extracted role: " + role);

                System.out.println("Extracted Role from Token: " + role);  // Debugging

                UserDetails userDetails = null;
                List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role));  // Match JWT role format

                // Check role and fetch user based on role
                if ("ROLE_ADMIN".equals(role)) {
                    Optional<Admin> adminOpt = adminRepo.findByEmail(email);
                    if (adminOpt.isPresent()) {
                        userDetails = new User(adminOpt.get().getEmail(), adminOpt.get().getPassword(), authorities);
                    }
                } else if ("ROLE_SCHOLAR".equals(role)) {
                    Optional<OurScholars> scholarOpt = scholarRepo.findByEmail(email);
                    if (scholarOpt.isPresent()) {
                        userDetails = new User(scholarOpt.get().getEmail(), scholarOpt.get().getPassword(), authorities);
                    }
                } else if ("ROLE_STAFF".equals(role)) {
                    Optional<Staff> staffOpt = staffRepo.findByEmail(email);
                    if (staffOpt.isPresent()) {
                        userDetails = new User(staffOpt.get().getEmail(), staffOpt.get().getPassword(), authorities);
                    }
                }
                
                System.out.println("🧍 UserDetails: " + (userDetails != null ? "✅ Found: " + userDetails.getUsername() : "❌ NOT FOUND"));


                if (userDetails != null) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not found for the role");
                    return;
                }
            } catch (JWTVerificationException exc) {
                System.out.println("❌ JWT Verification failed: " + exc.getMessage());  // Add this line
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT Token");
                return;
            }

        }

        filterChain.doFilter(request, response);  // Proceed with the filter chain
    }
}
