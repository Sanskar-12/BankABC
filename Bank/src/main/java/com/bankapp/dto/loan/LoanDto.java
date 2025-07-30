package com.bankapp.dto.loan;

import com.bankapp.entity.LoanEntity;
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

    private LoanDto convertToLoanDto(LoanEntity loan) {
        LoanDto dto = new LoanDto();
        dto.setLoanId(loan.getLoanId()); // ✅ set loanId
        dto.setLoanAmount(loan.getLoanAmount());
        dto.setLoanType(loan.getLoanType());
        dto.setLoanStatus(loan.getLoanStatus());
        return dto;
    }

}