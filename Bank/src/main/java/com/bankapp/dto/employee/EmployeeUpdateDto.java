package com.bankapp.dto.employee;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class EmployeeUpdateDto {
    @NotBlank
    private String empName;
    @NotBlank
    private String phone;
    @NotNull
    private Integer branchId;
}