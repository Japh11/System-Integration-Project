package com.Capstone.IskoLAIR.Security;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.Capstone.IskoLAIR.Repository.AdminRepository;
import com.Capstone.IskoLAIR.Repository.ScholarRepository;
import com.Capstone.IskoLAIR.Repository.StaffRepository;

@Component
public class AuthChannelInterceptorAdapter implements ChannelInterceptor {

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private AdminRepository adminRepo;

    @Autowired
    private ScholarRepository scholarRepo;

    @Autowired
    private StaffRepository staffRepo;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String token = accessor.getFirstNativeHeader("Authorization");

            System.out.println("🔐 WebSocket CONNECT Attempt...");
            System.out.println("🪪 Raw Authorization Header: " + token);

            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7); // remove "Bearer "
                System.out.println("🔑 JWT after stripping 'Bearer': " + token);

                try {
                    String email = jwtUtil.validateTokenAndRetrieveSubject(token);
                    String role = jwtUtil.validateTokenAndRetrieveRole(token);

                    System.out.println("✅ Token Validated");
                    System.out.println("📧 Email: " + email);
                    System.out.println("🛡️ Role: " + role);

                    UserDetails userDetails = null;
                    var authorities = List.of(new SimpleGrantedAuthority(role));

                    switch (role) {
                        case "ROLE_ADMIN":
                            userDetails = adminRepo.findByEmail(email)
                                .map(a -> new User(a.getEmail(), a.getPassword(), authorities))
                                .orElse(null);
                            break;

                        case "ROLE_STAFF":
                            userDetails = staffRepo.findByEmail(email)
                                .map(s -> new User(s.getEmail(), s.getPassword(), authorities))
                                .orElse(null);
                            break;

                        case "ROLE_SCHOLAR":
                            userDetails = scholarRepo.findByEmail(email)
                                .map(s -> new User(s.getEmail(), s.getPassword(), authorities))
                                .orElse(null);
                            break;

                        default:
                            System.out.println("❌ Unrecognized role: " + role);
                    }

                    if (userDetails != null) {
                        Authentication auth = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                        SecurityContextHolder.getContext().setAuthentication(auth);
                        accessor.setUser(auth);
                        System.out.println("✅ WebSocket user authenticated: " + userDetails.getUsername());
                    } else {
                        System.out.println("❌ User not found in repository for email: " + email);
                    }
                } catch (Exception e) {
                    System.out.println("🚨 JWT validation failed: " + e.getMessage());
                    throw new IllegalArgumentException("Invalid WebSocket JWT", e);
                }
            } else {
                System.out.println("⚠️ No valid Authorization header found.");
            }
        }

        return message;
    }
}
