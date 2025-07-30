package com.bankapp.dto.loan;

import com.bankapp.validation.annotations.ValidStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoanStatusUpdateDto {
    @NotBlank
    @ValidStatus(message = "Status must be PENDING, APPROVED, or REJECTED")
    private String status;
}