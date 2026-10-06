package com.JobAppBackend.JobApp.repository;

import com.JobAppBackend.JobApp.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository
        extends JpaRepository<Application, Long> {

    List<Application> findByJobSeekerId(Long jobSeekerId);

    List<Application> findByJobId(Long jobId);

    boolean existsByJobSeekerIdAndJobId(
            Long jobSeekerId,
            Long jobId
    );
}