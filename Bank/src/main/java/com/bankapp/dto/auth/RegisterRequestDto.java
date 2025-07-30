package com.bankapp.dto.auth;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class RegisterRequestDto {
    @NotBlank @Email(message = "Email should be valid")
    private String email;

    @NotBlank @Size(min = 8, max = 40, message = "Password must be between 8 and 40 characters")
    private String password;

    @NotBlank(message = "Customer name cannot be blank")
    private String customerName;

    @NotNull(message = "Date of birth cannot be null")
    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Phone number cannot be blank")
    private String phone;
}