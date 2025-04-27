package com.Capstone.IskoLAIR.Service;

import com.Capstone.IskoLAIR.Entity.OurScholars;
import com.Capstone.IskoLAIR.Repository.ScholarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class ScholarService {
    @Autowired
    private ScholarRepository scholarRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Assuming you have a PasswordEncoder bean

    public OurScholars uploadMonitoringSheet(Long scholarId, MultipartFile file) throws IOException {
        Optional<OurScholars> scholarOptional = scholarRepository.findById(scholarId);
        if (scholarOptional.isPresent()) {
            OurScholars scholar = scholarOptional.get();
            scholar.setMonitoringSheet(file.getBytes());
            return scholarRepository.save(scholar);
        }
        return null;
    }

    public byte[] getMonitoringSheet(Long scholarId) {
        Optional<OurScholars> scholarOptional = scholarRepository.findById(scholarId);
        return scholarOptional.map(OurScholars::getMonitoringSheet).orElse(null);
    }

    public List<OurScholars> getAllScholars() {
        return scholarRepository.findAll(); // Retrieves all scholars from DB
    }
    public OurScholars updateScholar(Long id, OurScholars updatedScholar) {
        Optional<OurScholars> scholarOptional = scholarRepository.findById(id);
        if (scholarOptional.isPresent()) {
            OurScholars scholar = scholarOptional.get();
            scholar.setLastName(updatedScholar.getLastName());
            scholar.setFirstName(updatedScholar.getFirstName());
            scholar.setMiddleName(updatedScholar.getMiddleName());
            scholar.setBatchYear(updatedScholar.getBatchYear());
            scholar.setAccountNo(updatedScholar.getAccountNo());
            scholar.setSpasNo(updatedScholar.getSpasNo());
            scholar.setSex(updatedScholar.getSex());
            scholar.setLevelYear(updatedScholar.getLevelYear());
            scholar.setSchool(updatedScholar.getSchool());
            scholar.setCourse(updatedScholar.getCourse());
            scholar.setStatus(updatedScholar.getStatus());
            scholar.setTypeOfScholarship(updatedScholar.getTypeOfScholarship());
            scholar.setBirthday(updatedScholar.getBirthday());
            scholar.setContactNumber(updatedScholar.getContactNumber());
            scholar.setEmail(updatedScholar.getEmail());
            scholar.setBrgy(updatedScholar.getBrgy());
            scholar.setMunicipality(updatedScholar.getMunicipality());
            scholar.setProvince(updatedScholar.getProvince());
            scholar.setDistrict(updatedScholar.getDistrict());
            scholar.setRegion(updatedScholar.getRegion());
            if (updatedScholar.getPassword() != null && !updatedScholar.getPassword().isEmpty()) {
                scholar.setPassword(passwordEncoder.encode(updatedScholar.getPassword()));
            }
            return scholarRepository.save(scholar);
        }
        throw new RuntimeException("Scholar not found");
    }

    public void archiveScholar(Long id) {
        Optional<OurScholars> scholarOpt = scholarRepository.findById(id);
        if (scholarOpt.isPresent()) {
            OurScholars scholar = scholarOpt.get();
            scholar.setArchived(true);
            scholarRepository.save(scholar);
        } else {
            throw new RuntimeException("Scholar not found");
        }
    }
    
    public void reactivateScholar(Long id) {
        Optional<OurScholars> scholarOpt = scholarRepository.findById(id);
        if (scholarOpt.isPresent()) {
            OurScholars scholar = scholarOpt.get();
            if (!scholar.isArchived()) {
                throw new RuntimeException("Scholar is already active");
            }
            scholar.setArchived(false);
            scholarRepository.save(scholar);
        } else {
            throw new RuntimeException("Scholar not found");
        }
    }

    public OurScholars findByEmail(String email) {
        return scholarRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Scholar not found with email: " + email));
    }
    public Optional<OurScholars> findById(Long id) {
        return scholarRepository.findById(id);
    }

    public OurScholars save(OurScholars scholar) {
        return scholarRepository.save(scholar);
    }
    
}
