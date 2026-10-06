package com.JobAppBackend.JobApp.controller;

import com.JobAppBackend.JobApp.entity.Application;
import com.JobAppBackend.JobApp.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:5173")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(
            ApplicationService applicationService
    ) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public ResponseEntity<?> applyForJob(
            @RequestBody Application application
    ) {

        try {

            Application savedApplication =
                    applicationService.applyForJob(application);

            return ResponseEntity.ok(savedApplication);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public List<Application> getUserApplications(
            @PathVariable Long userId
    ) {

        return applicationService
                .getApplicationsByJobSeeker(userId);
    }

    @GetMapping("/job/{jobId}")
    public List<Application> getJobApplications(
            @PathVariable Long jobId
    ) {

        return applicationService
                .getApplicationsByJob(jobId);
    }

    @PutMapping("/{applicationId}/status")
    public ResponseEntity<Application> updateStatus(
            @PathVariable Long applicationId,
            @RequestBody Map<String, String> request
    ) {

        String status = request.get("status");

        Application updatedApplication =
                applicationService.updateStatus(
                        applicationId,
                        status
                );

        return ResponseEntity.ok(updatedApplication);
    }
}