package com.Capstone.IskoLAIR.Controller;

import com.Capstone.IskoLAIR.Entity.Announcement;
import com.Capstone.IskoLAIR.Entity.OurScholars;
import com.Capstone.IskoLAIR.Entity.Staff;
import com.Capstone.IskoLAIR.Repository.ScholarRepository;
import com.Capstone.IskoLAIR.Service.AnnouncementService;
import com.Capstone.IskoLAIR.Service.FileStorageService;
import com.Capstone.IskoLAIR.Service.StaffService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    @Autowired
    private AnnouncementService announcementService;

    @Autowired
    private FileStorageService fileStorageService; // Assuming this is defined in your code

    @Autowired
    private StaffService staffService;

    @Autowired
    private ScholarRepository   scholarRepository; // Assuming this is defined in your code

    @PostMapping("/create")
    public ResponseEntity<?> createAnnouncement(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "photos", required = false) List<MultipartFile> photos,
            @RequestParam("createdByJson") String createdByJson
    ) {
        try {
            // Parse createdBy JSON
            ObjectMapper mapper = new ObjectMapper();
            Staff createdBy = mapper.readValue(createdByJson, Staff.class);
    
            // Get staff from DB
            Staff staff = staffService.getStaffById(createdBy.getId());
            if (staff == null) {
                return ResponseEntity.badRequest().body("Invalid staffId");
            }
    
            // Handle photos (optional)
            List<String> photoUrls = new ArrayList<>();
            if (photos != null && !photos.isEmpty()) {
                for (MultipartFile file : photos) {
                    // Save the file and generate its URL
                    String fileUrl = fileStorageService.save(file); // Ensure this returns a full URL
                    photoUrls.add(fileUrl);
                }
            }
    
            // Build announcement
            Announcement announcement = new Announcement();
            announcement.setTitle(title);
            announcement.setDescription(description);
            announcement.setCreatedBy(staff);
            announcement.setPhotos(photoUrls); // Set the photo URLs
    
            // Assign all scholars if none are set
            List<OurScholars> allScholars = scholarRepository.findAll();
            announcement.setScholars(allScholars);
    
            return ResponseEntity.ok(announcementService.createAnnouncement(announcement));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }


    @GetMapping
    public ResponseEntity<List<Announcement>> getAllAnnouncements() {
        return ResponseEntity.ok(announcementService.getAllAnnouncements());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAnnouncementById(@PathVariable Long id) {
        Optional<Announcement> announcementOpt = announcementService.getAnnouncementById(id);
        if (announcementOpt.isPresent()) {
            Announcement announcement = announcementOpt.get();
            // Create a simplified response
            Map<String, Object> response = new HashMap<>();
            response.put("id", announcement.getId());
            response.put("title", announcement.getTitle());
            response.put("description", announcement.getDescription());
            response.put("photos", announcement.getPhotos());
            response.put("createdDate", announcement.getCreatedDate()); // Include createdDate

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(404).body("Announcement not found");
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateAnnouncement(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam(value = "photos", required = false) List<MultipartFile> photos,
            @RequestParam(value = "existingPhotos", required = false) List<String> existingPhotos
    ) {
        try {
            Optional<Announcement> existingOpt = announcementService.getAnnouncementById(id);
            if (!existingOpt.isPresent()) {
                return ResponseEntity.status(404).body("Announcement not found");
            }

            Announcement existing = existingOpt.get();
            existing.setTitle(title);
            existing.setDescription(description);

            // Merge existing photos with new photos
            List<String> photoUrls = new ArrayList<>();
            if (existingPhotos != null) {
                photoUrls.addAll(existingPhotos); // Retain existing photos
            }
            if (photos != null && !photos.isEmpty()) {
                for (MultipartFile file : photos) {
                    // Save the file and generate its URL
                    String fileUrl = fileStorageService.save(file); // Ensure this returns a full URL
                    photoUrls.add(fileUrl);
                }
            }
            existing.setPhotos(photoUrls);

            Announcement updatedAnnouncement = announcementService.updateAnnouncement(id, existing);

            // Create a response including the lastUpdatedDate
            Map<String, Object> response = new HashMap<>();
            response.put("id", updatedAnnouncement.getId());
            response.put("title", updatedAnnouncement.getTitle());
            response.put("description", updatedAnnouncement.getDescription());
            response.put("photos", updatedAnnouncement.getPhotos());
            response.put("createdDate", updatedAnnouncement.getCreatedDate());
            response.put("lastUpdatedDate", updatedAnnouncement.getLastUpdatedDate());

            return ResponseEntity.ok(response);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body("Announcement not found");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteAnnouncement(@PathVariable Long id) {
        try {
            announcementService.deleteAnnouncement(id);
            return ResponseEntity.ok("Announcement deleted successfully");
        } catch (EmptyResultDataAccessException e) {
            return ResponseEntity.status(404).body("Announcement not found");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }
}

