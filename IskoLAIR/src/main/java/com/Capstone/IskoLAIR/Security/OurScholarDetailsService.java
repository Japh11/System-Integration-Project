package com.Capstone.IskoLAIR.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.Capstone.IskoLAIR.Entity.OurScholars;
import com.Capstone.IskoLAIR.Repository.ScholarRepository;

import java.util.Collections;
import java.util.List;

@Service
public class OurScholarDetailsService implements UserDetailsService {

    @Autowired
    private ScholarRepository scholarRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        OurScholars scholar = scholarRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Scholar not found"));

        if (scholar.isArchived()) {
            throw new UsernameNotFoundException("This scholar account has been archived.");
        }

        return new org.springframework.security.core.userdetails.User(
                scholar.getEmail(),
                scholar.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + scholar.getRole()))
        );
    }
}
