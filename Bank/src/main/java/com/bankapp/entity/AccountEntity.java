package com.bankapp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "accounts")
@Getter
@Setter
public class AccountEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "account_seq")
    @SequenceGenerator(name = "account_seq", sequenceName = "ACCOUNT_ID_SEQ", allocationSize = 1)
    private Long accId;

    private String accName;
    private String accType; // SAVINGS, CHECKING
    private BigDecimal balance;
    private String status = "ACTIVE"; // ACTIVE, BLOCKED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cust_id")
    private CustomerEntity customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id")
    private BranchEntity branch;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
    private List<TransactionEntity> transactions;

    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL)
    private List<LoanEntity> loans;
}