package com.JobAppBackend.JobApp.service;

import com.JobAppBackend.JobApp.entity.Application;
import com.JobAppBackend.JobApp.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository
    ) {
        this.applicationRepository = applicationRepository;
    }

    public Application applyForJob(Application application) {

        Long userId = application.getJobSeeker().getId();
        Long jobId = application.getJob().getId();

        // Check if user has already applied
        boolean alreadyApplied =
                applicationRepository
                        .existsByJobSeekerIdAndJobId(
                                userId,
                                jobId
                        );

        if (alreadyApplied) {
            throw new RuntimeException(
                    "You have already applied for this job."
            );
        }

        application.setStatus("APPLIED");

        return applicationRepository.save(application);
    }

    public List<Application> getApplicationsByJobSeeker(
            Long userId
    ) {
        return applicationRepository
                .findByJobSeekerId(userId);
    }

    public List<Application> getApplicationsByJob(
            Long jobId
    ) {
        return applicationRepository
                .findByJobId(jobId);
    }

    public Application updateStatus(
            Long applicationId,
            String status
    ) {

        Application application =
                applicationRepository
                        .findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"
                                )
                        );

        application.setStatus(status);

        return applicationRepository.save(application);
    }
}