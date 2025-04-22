package com.Capstone.IskoLAIR.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.Capstone.IskoLAIR.Entity.Staff;
import com.Capstone.IskoLAIR.Repository.StaffRepository;

@Service
public class StaffService {
    private final StaffRepository staffRepository;
    private final PasswordEncoder passwordEncoder;

    public StaffService(StaffRepository staffRepository, PasswordEncoder passwordEncoder) {
        this.staffRepository = staffRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Staff saveStaff(Staff staff) {
        staff.setPassword(passwordEncoder.encode(staff.getPassword()));
        return staffRepository.save(staff);
    }

    public Optional<Staff> findByEmail(String email) {
        return staffRepository.findByEmail(email);
    }
    
    public List<Staff> getAllStaff() {
        return staffRepository.findAll(); // Retrieves all staff from DB
    }
    public Staff updateStaff(Long id, Staff updatedStaff) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found"));

        staff.setFirstName(updatedStaff.getFirstName());
        staff.setLastName(updatedStaff.getLastName());
        staff.setEmail(updatedStaff.getEmail());
        if (updatedStaff.getPassword() != null && !updatedStaff.getPassword().isEmpty()) {
            staff.setPassword(passwordEncoder.encode(updatedStaff.getPassword()));
        }
        return staffRepository.save(staff);
    }
    public void deleteStaff(Long id) {
        if (!staffRepository.existsById(id)) {
            throw new RuntimeException("Staff not found");
        }
        staffRepository.deleteById(id);
    }
    
    public Staff getStaffById(Long id) {
        Optional<Staff> staff = staffRepository.findById(id);
        return staff.orElse(null);  // Return null if no staff found
    }
    
}
