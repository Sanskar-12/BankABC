package com.bankapp.dto.employee;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
@Getter
@Setter
public class EmployeeDto {
    private Integer empId;
    private String empName;
    private String email;
    private LocalDate dob;
    private String phone;
    private Integer branchId;
}