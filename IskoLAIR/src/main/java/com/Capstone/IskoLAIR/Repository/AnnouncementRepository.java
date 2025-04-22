package com.Capstone.IskoLAIR.Repository;

import com.Capstone.IskoLAIR.Entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
}

