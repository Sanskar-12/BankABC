package com.bankapp.repository;

import com.bankapp.entity.CustomerEntity;
import com.bankapp.entity.LoanEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LoanRepository extends JpaRepository<LoanEntity, Integer> {
    List<LoanEntity> findByAccountAccId(Long accountId);
    List<LoanEntity> findByLoanStatus(String status);
    Optional<LoanEntity> findFirstByAccountCustomerAndLoanStatus(CustomerEntity customer, String status);
}