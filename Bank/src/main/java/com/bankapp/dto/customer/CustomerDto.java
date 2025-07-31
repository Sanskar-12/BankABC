package com.bankapp.dto.customer;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CustomerDto {
    private Integer custId;
    private String custName;
    private String email;
    private LocalDate dob;
    private String phone;
}
