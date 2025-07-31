package com.bankapp.dto.account;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
public class AccountUpdateDto {

    @NotBlank(message = "Account name cannot be blank")
    private String accName;

    private String accType;

    private BigDecimal balance; // ✅ Added for balance updates

    private String status;

    @Email(message = "Invalid email address")
    private String email; // ✅ Added email

    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    private String phone; // ✅ Added phone
}






