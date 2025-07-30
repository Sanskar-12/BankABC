package com.bankapp.repository;

import com.bankapp.entity.BranchEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BranchRepository extends JpaRepository<BranchEntity, Integer> {
    Optional<BranchEntity> findByBranchName(String branchName);
}