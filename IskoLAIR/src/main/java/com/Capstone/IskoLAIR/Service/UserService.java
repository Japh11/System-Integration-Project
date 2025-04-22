package com.Capstone.IskoLAIR.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Capstone.IskoLAIR.Entity.OurScholars;
import com.Capstone.IskoLAIR.Entity.Staff;
import com.Capstone.IskoLAIR.Repository.ScholarRepository;
import com.Capstone.IskoLAIR.Repository.StaffRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired private ScholarRepository scholarsRepository;
    @Autowired private StaffRepository staffRepository;

    public List<Object> getContactsByRole(Long userId, String role) {
        if (userId == null || role == null) return List.of();

        switch (role) {
            case "ROLE_SCHOLAR":
                // Scholar sees all staff
                return staffRepository.findAll().stream()
                    .filter(staff -> staff.getId() != null)
                    .collect(Collectors.toList());

            case "ROLE_STAFF":
                // Staff sees all scholars
                return scholarsRepository.findAll().stream()
                    .filter(scholar -> scholar.getId() != null)
                    .collect(Collectors.toList());

            default:
                return List.of();
        }
    }
    
    public String resolveFullName(String id, String role) {
        if (role.equals("STAFF")) {
            return staffRepository.findById(Long.parseLong(id))
                    .map(staff -> staff.getFirstName() + " " + staff.getLastName())
                    .orElse("Unknown Staff");
        } else if (role.equals("SCHOLAR")) {
            return scholarsRepository.findById(Long.parseLong(id))
                    .map(scholar -> scholar.getFirstName() + " " + scholar.getLastName())
                    .orElse("Unknown Scholar");
        } else {
            return "Unknown";
        }
    }

}
