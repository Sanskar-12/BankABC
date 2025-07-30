package com.bankapp.dto.loan;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
public class LoanApplicationDto {
    @NotNull(message = "Account ID cannot be null")
    private Long accountId;

    @NotBlank(message = "Loan type cannot be blank")
    private String loanType;

    @NotNull(message = "Loan amount cannot be null")
    @DecimalMin(value = "100.00", message = "Loan amount must be at least 100.00")
    private BigDecimal loanAmount;
}