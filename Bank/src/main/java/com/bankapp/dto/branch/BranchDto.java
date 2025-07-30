package com.bankapp.dto.branch;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BranchDto {
    private Integer branchId;
    @NotBlank
    private String branchName;
    @NotBlank
    private String branchAddr;
}