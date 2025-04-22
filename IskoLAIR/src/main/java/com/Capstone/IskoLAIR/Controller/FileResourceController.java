package com.Capstone.IskoLAIR.Controller;

import com.Capstone.IskoLAIR.Entity.FileResource;
import com.Capstone.IskoLAIR.Service.FileResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/fileresources")
public class FileResourceController {

    @Autowired
    private FileResourceService service;

    @PostMapping
    public ResponseEntity<FileResource> create(
            @RequestParam String title,
            @RequestParam("file") MultipartFile file) {
        FileResource fr = service.create(title, file);
        return ResponseEntity.status(201).body(fr);
    }

    @GetMapping
    public ResponseEntity<List<FileResource>> list() {
        return ResponseEntity.ok(service.getAll());
    } 

    @GetMapping("/{id}")
    public ResponseEntity<FileResource> get(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<FileResource> update(
            @PathVariable Long id,
            @RequestParam(required = false) String title,
            @RequestParam(name = "file", required = false) MultipartFile file) {
        try {
            FileResource fr = service.update(id, title, file);
            return ResponseEntity.ok(fr);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
