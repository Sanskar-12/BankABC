package com.bankapp.repository;

import com.bankapp.entity.CustomerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<CustomerEntity, Integer> {
    Optional<CustomerEntity> findByUserId(Long userId);

    // New method to count customers who have at least one active account
    @Query("SELECT COUNT(DISTINCT c) FROM CustomerEntity c JOIN c.accounts a WHERE a.status = :status")
    long countCustomersByAccountStatus(@Param("status") String status);
}