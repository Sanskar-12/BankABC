package com.bankapp.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DashboardStatsDto {
    private long totalCustomers;
    private long activeCustomers;
    private long totalBranches;
    private long totalEmployees;
}
