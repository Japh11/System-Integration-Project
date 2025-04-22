package com.Capstone.IskoLAIR.Service;

import com.Capstone.IskoLAIR.Entity.FileResource;
import com.Capstone.IskoLAIR.Repository.FileResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
public class FileResourceService {

    @Autowired
    private FileResourceRepository repo;
    @Autowired
    private FileStorageService fileStorageService;

    public FileResource create(String title, MultipartFile file) {
        String url = fileStorageService.save(file);
        FileResource fr = new FileResource();
        fr.setTitle(title);
        fr.setFileUrl(url);
        return repo.save(fr);
    }

    public List<FileResource> getAll() {
        return repo.findAll();
    }

    public Optional<FileResource> getById(Long id) {
        return repo.findById(id);
    }

    public FileResource update(Long id, String title, MultipartFile file) {
        FileResource fr = repo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        if (title != null) fr.setTitle(title);
        if (file != null && !file.isEmpty()) {
            String url = fileStorageService.save(file);
            fr.setFileUrl(url);
        }
        return repo.save(fr);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}