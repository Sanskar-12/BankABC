package com.bankapp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Getter
@Setter
public class TransactionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transId;
    private BigDecimal amount;
    private String transactionType; // DEPOSIT, WITHDRAWAL, LOAN_REPAYMENT
    private LocalDateTime timestamp;
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "acc_id", nullable = false)
    private AccountEntity account;
}