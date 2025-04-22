package com.Capstone.IskoLAIR.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.Capstone.IskoLAIR.Entity.FileResource;

@Repository
public interface FileResourceRepository extends JpaRepository<FileResource, Long> {
}
