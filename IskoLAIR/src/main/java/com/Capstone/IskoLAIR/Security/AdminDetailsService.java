package com.Capstone.IskoLAIR.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.Capstone.IskoLAIR.Entity.Admin;
import com.Capstone.IskoLAIR.Repository.AdminRepository;

import java.util.Collections;
import java.util.List;

@Service
public class AdminDetailsService implements UserDetailsService {

    @Autowired
    private AdminRepository adminRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return adminRepo.findByEmail(email)
                .map(admin -> new org.springframework.security.core.userdetails.User(
                        admin.getEmail(),
                        admin.getPassword(),
                        List.of(new SimpleGrantedAuthority("ROLE_" + admin.getRole()))))  // ✅ Dynamically set role
                .orElseThrow(() -> new UsernameNotFoundException("Could not find Admin with email = " + email));
    }
}
