package com.bankapp.dto.employee;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
@Getter
@Setter
public class EmployeeCreateDto {
    @NotBlank @Email
    private String email;
    @NotBlank @Size(min = 8)
    private String password;
    @NotBlank
    private String employeeName;
    @NotNull @Past
    private LocalDate dateOfBirth;
    @NotBlank
    private String phone;
    @NotNull
    private Integer branchId;
}