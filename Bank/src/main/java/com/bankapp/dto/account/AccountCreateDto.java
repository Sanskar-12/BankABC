package com.bankapp.dto.account;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
public class AccountCreateDto {
    @NotNull(message = "Customer ID cannot be null")
    private Integer customerId;

    @NotNull(message = "Branch Name cannot be null")
    private String branchName;

    @NotBlank(message = "Account name cannot be blank")
    private String accountName;

    @Pattern(regexp = "SAVINGS|CHECKING", message = "Account type must be SAVINGS or CHECKING")
    private String accountType;

    @NotNull(message = "Initial deposit cannot be null")
    @DecimalMin(value = "0.0", message = "Initial deposit must not be negative")
    private BigDecimal initialDeposit;

    @Email(message = "Invalid email format")
    private String email;

    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    private String phone;
}