package com.bankapp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Table(name = "loans")
@Getter
@Setter
public class LoanEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer loanId;
    private String loanType; // PERSONAL, HOME, CAR
    private BigDecimal loanAmount;
    private String loanStatus; // PENDING, APPROVED, REJECTED, PAID

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "acc_id", nullable = false)
    private AccountEntity account;
}
