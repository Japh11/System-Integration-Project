package com.Capstone.IskoLAIR.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.Capstone.IskoLAIR.Entity.Staff;
import com.Capstone.IskoLAIR.Repository.StaffRepository;

import java.util.List;

@Service
public class StaffDetailsService implements UserDetailsService {

    @Autowired
    private StaffRepository staffRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return staffRepo.findByEmail(email)
                .map(staff -> new org.springframework.security.core.userdetails.User(
                        staff.getEmail(),
                        staff.getPassword(),
                        List.of(new SimpleGrantedAuthority("ROLE_STAFF"))))  // ✅ Assign "STAFF" role
                .orElseThrow(() -> new UsernameNotFoundException("Could not find Staff with email = " + email));
    }
}
