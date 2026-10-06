package com.JobAppBackend.JobApp.controller;

import com.JobAppBackend.JobApp.entity.Job;
import com.JobAppBackend.JobApp.service.JobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:5173")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping
    public List<Job> getAllJobs() {
        return jobService.getAllJobs();
    }

    @GetMapping("/recruiter/{recruiterId}")
    public List<Job> getJobsByRecruiter(
            @PathVariable Long recruiterId
    ) {
        return jobService.getJobsByRecruiter(recruiterId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(
            @PathVariable Long id
    ) {
        return jobService.getJobById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Job createJob(@RequestBody Job job) {
        return jobService.createJob(job);
    }

    @DeleteMapping("/{jobId}/recruiter/{recruiterId}")
    public ResponseEntity<String> deleteJob(
            @PathVariable Long jobId,
            @PathVariable Long recruiterId
    ) {

        boolean deleted =
                jobService.deleteJob(jobId, recruiterId);

        if (!deleted) {
            return ResponseEntity
                    .badRequest()
                    .body("You are not allowed to delete this job.");
        }

        return ResponseEntity.ok(
                "Job deleted successfully."
        );
    }
}