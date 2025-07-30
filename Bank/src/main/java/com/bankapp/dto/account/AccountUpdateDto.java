package com.bankapp.dto.account;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class AccountUpdateDto {
    @NotBlank(message = "Account name cannot be blank")
    private String accName;
}
