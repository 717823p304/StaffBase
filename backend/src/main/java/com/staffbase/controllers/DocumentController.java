package com.staffbase.controllers;

import com.staffbase.dto.ApiResponse;
import com.staffbase.models.EmployeeDocument;
import com.staffbase.models.User;
import com.staffbase.models.DocumentAccessLog;
import com.staffbase.repositories.jpa.UserRepository;
import com.staffbase.repositories.mongo.EmployeeDocumentRepository;
import com.staffbase.repositories.mongo.DocumentAccessLogRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/documents")
public class DocumentController {

    private final EmployeeDocumentRepository documentRepository;
    private final DocumentAccessLogRepository accessLogRepository;
    private final UserRepository userRepository;
    private final String uploadDir;

    public DocumentController(
            EmployeeDocumentRepository documentRepository,
            DocumentAccessLogRepository accessLogRepository,
            UserRepository userRepository,
            @Value("${file.upload-dir:uploads}") String uploadDir) {
        this.documentRepository = documentRepository;
        this.accessLogRepository = accessLogRepository;
        this.userRepository = userRepository;
        this.uploadDir = uploadDir;
        
        // Ensure uploads directory exists
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("document") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("expiryDate") String expiryDate,
            @RequestParam("employeeId") String employeeId) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(false, "File cannot be empty"));
        }

        try {
            // Clean filename
            String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
            String extension = "";
            int extIdx = originalFileName.lastIndexOf('.');
            if (extIdx >= 0) {
                extension = originalFileName.substring(extIdx + 1).toUpperCase();
            } else {
                extension = "FILE";
            }

            // Create unique saved file name
            String savedFileName = System.currentTimeMillis() + "_" + originalFileName;
            Path targetLocation = Paths.get(uploadDir).toAbsolutePath().resolve(savedFileName);
            
            // Write binary content to disk
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Construct local static URL path
            String fileUrl = "/api/uploads/" + savedFileName; // map relative to /api

            // Save document metadata in MongoDB
            String dateStr = new SimpleDateFormat("yyyy-MM-dd").format(new Date());
            EmployeeDocument doc = new EmployeeDocument(
                    name,
                    extension,
                    fileUrl,
                    "Pending",
                    dateStr,
                    expiryDate,
                    employeeId
            );

            EmployeeDocument savedDoc = documentRepository.save(doc);

            // Log access
            try {
                String email = SecurityContextHolder.getContext().getAuthentication().getName();
                accessLogRepository.save(new DocumentAccessLog(savedDoc.getId(), email, "UPLOAD"));
            } catch (Exception ex) {
                // Ignore
            }

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(true, "Document uploaded successfully", savedDoc));

        } catch (IOException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Failed to upload document file: " + ex.getMessage()));
        }
    }

    @PutMapping("/{docId}/verify")
    public ResponseEntity<?> verifyDocument(
            @PathVariable String docId,
            @RequestBody java.util.Map<String, Boolean> payload) {
        
        Optional<EmployeeDocument> docOpt = documentRepository.findById(docId);
        if (docOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Document not found"));
        }

        EmployeeDocument doc = docOpt.get();
        boolean approve = payload.getOrDefault("approve", false);
        doc.setStatus(approve ? "Verified" : "Rejected");

        EmployeeDocument saved = documentRepository.save(doc);

        // Log access
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            accessLogRepository.save(new DocumentAccessLog(docId, email, "VERIFY"));
        } catch (Exception ex) {
            // Ignore
        }

        return ResponseEntity.ok(new ApiResponse<>(true, "Document status updated", saved));
    }

    @GetMapping("/my-documents")
    public ResponseEntity<?> getMyDocuments(@RequestParam(required = false) String employeeId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        String targetEmpId = employeeId;
        
        if (targetEmpId == null || targetEmpId.trim().isEmpty()) {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent() && userOpt.get().getEmployeeId() != null) {
                targetEmpId = userOpt.get().getEmployeeId();
            }
        }
        
        if (targetEmpId == null || targetEmpId.trim().isEmpty()) {
            return ResponseEntity.ok(new ApiResponse<>(true, "No employee ID associated", new ArrayList<>()));
        }
        
        List<EmployeeDocument> docs = documentRepository.findByEmployeeId(targetEmpId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Documents retrieved successfully", docs));
    }

    @GetMapping("/access-history")
    public ResponseEntity<?> getAccessHistory(@RequestParam(required = false) String documentId) {
        if (documentId != null && !documentId.trim().isEmpty()) {
            List<DocumentAccessLog> logs = accessLogRepository.findByDocumentIdOrderByAccessedAtDesc(documentId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Document access history retrieved", logs));
        } else {
            List<DocumentAccessLog> logs = accessLogRepository.findAll();
            return ResponseEntity.ok(new ApiResponse<>(true, "All document access logs retrieved", logs));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDocument(@PathVariable String id) {
        Optional<EmployeeDocument> docOpt = documentRepository.findById(id);
        if (docOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Document not found"));
        }
        EmployeeDocument doc = docOpt.get();
        
        // Log access
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            accessLogRepository.save(new DocumentAccessLog(id, email, "DOWNLOAD"));
        } catch (Exception ex) {
            // Ignore
        }
        
        // Return file
        try {
            String filePathStr = doc.getFilePath();
            // Extrapolate filename from "/api/uploads/filename" or similar
            String filename = filePathStr.substring(filePathStr.lastIndexOf('/') + 1);
            Path filePath = Paths.get(uploadDir).toAbsolutePath().resolve(filename);
            
            if (!Files.exists(filePath)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(false, "File not found on disk"));
            }
            
            byte[] fileBytes = Files.readAllBytes(filePath);
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            
            return ResponseEntity.ok()
                    .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getName() + "." + doc.getType().toLowerCase() + "\"")
                    .header(org.springframework.http.HttpHeaders.CONTENT_TYPE, contentType)
                    .body(fileBytes);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(false, "Error retrieving file: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDocument(@PathVariable String id) {
        Optional<EmployeeDocument> docOpt = documentRepository.findById(id);
        if (docOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Document not found"));
        }
        EmployeeDocument doc = docOpt.get();
        
        // Delete file from disk
        try {
            String filePathStr = doc.getFilePath();
            String filename = filePathStr.substring(filePathStr.lastIndexOf('/') + 1);
            Path filePath = Paths.get(uploadDir).toAbsolutePath().resolve(filename);
            Files.deleteIfExists(filePath);
        } catch (Exception e) {
            // Ignore
        }
        
        documentRepository.delete(doc);
        return ResponseEntity.ok(new ApiResponse<>(true, "Document deleted successfully"));
    }
}
