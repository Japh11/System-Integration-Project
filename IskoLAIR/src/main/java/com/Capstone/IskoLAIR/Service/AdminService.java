package com.Capstone.IskoLAIR.Service;

import com.Capstone.IskoLAIR.Entity.OurScholars;
import com.Capstone.IskoLAIR.Entity.Role;
import com.Capstone.IskoLAIR.Entity.Staff;
import com.Capstone.IskoLAIR.Repository.ScholarRepository;
import com.Capstone.IskoLAIR.Repository.StaffRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    @Autowired private ScholarRepository scholarRepository;
    @Autowired private StaffRepository staffRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    public OurScholars createScholar(String email) {
        OurScholars scholar = new OurScholars();
        scholar.setEmail(email);

        // 🔥 Hash the default password before storing
//        scholar.setPassword(passwordEncoder.encode("123456"));
        scholar.setFirstTimeLogin(true);

        return scholarRepository.save(scholar);
    }
    
  
}
