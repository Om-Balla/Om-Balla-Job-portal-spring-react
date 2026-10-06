package com.JobAppBackend.JobApp.service;

import com.JobAppBackend.JobApp.entity.Job;
import com.JobAppBackend.JobApp.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public Job createJob(Job job) {
        return jobRepository.save(job);
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public List<Job> getJobsByRecruiter(Long recruiterId) {
        return jobRepository.findByRecruiterId(recruiterId);
    }

    public Optional<Job> getJobById(Long id) {
        return jobRepository.findById(id);
    }

    public boolean deleteJob(Long jobId, Long recruiterId) {

        Optional<Job> jobOptional =
                jobRepository.findById(jobId);

        if (jobOptional.isEmpty()) {
            return false;
        }

        Job job = jobOptional.get();

        if (job.getRecruiter() == null ||
                !job.getRecruiter().getId().equals(recruiterId)) {
            return false;
        }

        jobRepository.delete(job);

        return true;
    }
}