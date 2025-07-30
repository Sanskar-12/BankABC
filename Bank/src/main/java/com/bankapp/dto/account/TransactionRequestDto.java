package com.bankapp.dto.account;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
public class TransactionRequestDto {
    @NotNull(message = "Account ID cannot be null")
    private Long accountId;

    @NotNull(message = "Amount cannot be null")
    @DecimalMin(value = "0.01", message = "Amount must be positive")
    private BigDecimal amount;

    // Type for deposits: DEPOSIT or LOAN_REPAYMENT
    @Pattern(regexp = "DEPOSIT|LOAN_REPAYMENT", message = "Type must be DEPOSIT or LOAN_REPAYMENT")
    private String type;
}