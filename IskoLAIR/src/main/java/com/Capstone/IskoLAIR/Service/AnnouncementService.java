package com.Capstone.IskoLAIR.Service;

import com.Capstone.IskoLAIR.Entity.Announcement;
import com.Capstone.IskoLAIR.Entity.OurScholars;
import com.Capstone.IskoLAIR.Repository.AnnouncementRepository;
import com.Capstone.IskoLAIR.Repository.ScholarRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date; // Import Date
import java.util.List;
import java.util.Optional;

@Service
public class AnnouncementService {

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private ScholarRepository scholarRepository;

    public Announcement createAnnouncement(Announcement announcement) {
        // Set the current date as the createdDate
        announcement.setCreatedDate(new Date());

        // If scholars are not provided, assign all scholars
        if (announcement.getScholars() == null || announcement.getScholars().isEmpty()) {
            List<OurScholars> allScholars = scholarRepository.findAll();
            announcement.setScholars(allScholars);
        }

        return announcementRepository.save(announcement);
    }

    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAll();
    }

    public Optional<Announcement> getAnnouncementById(Long id) {
        return announcementRepository.findById(id);
    }

    public Announcement updateAnnouncement(Long id, Announcement updatedAnnouncement) {
        Announcement existing = announcementRepository.findById(id).orElseThrow();

        existing.setTitle(updatedAnnouncement.getTitle());
        existing.setDescription(updatedAnnouncement.getDescription());
        existing.setPhotos(updatedAnnouncement.getPhotos());
        existing.setCreatedBy(updatedAnnouncement.getCreatedBy());
        existing.setScholars(updatedAnnouncement.getScholars());
        existing.setLastUpdatedDate(new Date()); 

        return announcementRepository.save(existing);
    }

    public void deleteAnnouncement(Long id) {
        announcementRepository.deleteById(id);
    }
}