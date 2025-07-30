package com.bankapp.service;

import com.bankapp.dto.branch.BranchDto;
import com.bankapp.dto.employee.EmployeeCreateDto;
import com.bankapp.dto.employee.EmployeeDto;
import com.bankapp.dto.employee.EmployeeUpdateDto;
import com.bankapp.dto.user.UserDto;
import java.util.List;

public interface AdminService {
    void createEmployee(EmployeeCreateDto employeeCreateDto);
    BranchDto createBranch(BranchDto branchDto);
    void deleteEmployee(Integer employeeId);
    void deleteCustomer(Integer customerId);
    void deleteBranch(Integer branchId);
    UserDto blockUser(Long userId);
    UserDto unblockUser(Long userId);
    EmployeeDto updateEmployee(Integer employeeId, EmployeeUpdateDto employeeUpdateDto);
    List<EmployeeDto> getAllEmployees();
}