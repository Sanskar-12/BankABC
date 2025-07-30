package com.bankapp.dto.loan;

import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
public class LoanDto {
    private Integer loanId;
    private String loanType;
    private BigDecimal loanAmount;
    private String loanStatus;
    private Long accountId;
}