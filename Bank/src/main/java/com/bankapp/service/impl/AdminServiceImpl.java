package com.bankapp.service.impl;

import com.bankapp.dto.branch.BranchDto;
import com.bankapp.dto.customer.CustomerDto;
import com.bankapp.dto.dashboard.DashboardStatsDto;
import com.bankapp.dto.employee.EmployeeCreateDto;
import com.bankapp.dto.employee.EmployeeDto;
import com.bankapp.dto.employee.EmployeeUpdateDto;
import com.bankapp.dto.user.UserDto;
import com.bankapp.entity.*;
import com.bankapp.exception.ResourceNotFoundException;
import com.bankapp.repository.*;
import com.bankapp.service.AdminService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {


    @Autowired private EmployeeRepository employeeRepository;
    @Autowired private BranchRepository branchRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private PasswordEncoder encoder;
    @Autowired private CustomerRepository customerRepository;
    @Override
    public DashboardStatsDto getDashboardStats() {
        long totalCustomers = customerRepository.count();
        long activeCustomers = customerRepository.countCustomersByAccountStatus("ACTIVE");
        long totalBranches = branchRepository.count();
        long totalEmployees = employeeRepository.count();
        return new DashboardStatsDto(totalCustomers, activeCustomers, totalBranches, totalEmployees);
    }

    @Override
    public List<BranchDto> getAllBranches() {
        return branchRepository.findAll().stream()
                .map(this::convertToBranchDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void createEmployee(EmployeeCreateDto dto) {
        if (userRepository.existsByUsername(dto.getEmail())) {
            throw new IllegalArgumentException("Error: Email is already in use!");
        }
        BranchEntity branch = branchRepository.findById(dto.getBranchId())
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found"));

        UserEntity user = new UserEntity(dto.getEmail(), encoder.encode(dto.getPassword()));
        Set<RoleEntity> roles = new HashSet<>();
        RoleEntity employeeRole = roleRepository.findByName(RoleEntity.ERole.ROLE_EMPLOYEE)
                .orElseThrow(() -> new ResourceNotFoundException("Error: Role 'EMPLOYEE' not found."));
        roles.add(employeeRole);
        user.setRoles(roles);
        UserEntity savedUser = userRepository.save(user);

        EmployeeEntity employee = new EmployeeEntity();
        employee.setUser(savedUser);
        employee.setEmpName(dto.getEmployeeName());
        employee.setEmail(dto.getEmail());
        employee.setDob(dto.getDateOfBirth());
        employee.setPhone(dto.getPhone());
        employee.setBranch(branch);
        employeeRepository.save(employee);
    }

    @Override
    @Transactional
    public BranchDto createBranch(BranchDto branchDto) {
        BranchEntity branch = new BranchEntity();
        branch.setBranchName(branchDto.getBranchName());
        branch.setBranchAddr(branchDto.getBranchAddr());
        BranchEntity savedBranch = branchRepository.save(branch);
        return convertToBranchDto(savedBranch);
    }

    @Override
    @Transactional
    public void deleteEmployee(Integer employeeId) {
        EmployeeEntity employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        employeeRepository.delete(employee);
    }

    @Override
    @Transactional
    public void deleteCustomer(Integer customerId) {
        CustomerEntity customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found"));
        customerRepository.delete(customer);
    }

    @Override
    @Transactional
    public void deleteBranch(Integer branchId) {
        BranchEntity branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found"));
        if (!branch.getAccounts().isEmpty() || !branch.getEmployees().isEmpty()) {
            throw new IllegalStateException("Cannot delete branch with associated accounts or employees.");
        }
        branchRepository.delete(branch);
    }

    @Override
    public UserDto blockUser(Long userId) {
        // This is a complex operation. A simple block/unblock might be better suited
        // on the AccountEntity for financial blocking, managed by Employees.
        // A full user block might mean disabling login.
        throw new UnsupportedOperationException("Full user blocking not yet implemented.");
    }

    @Override
    public UserDto unblockUser(Long userId) {
        throw new UnsupportedOperationException("Full user unblocking not yet implemented.");
    }

    @Override
    @Transactional
    public EmployeeDto updateEmployee(Integer employeeId, EmployeeUpdateDto employeeUpdateDto) {
        EmployeeEntity employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        BranchEntity branch = branchRepository.findById(employeeUpdateDto.getBranchId())
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found"));

        employee.setEmpName(employeeUpdateDto.getEmpName());
        employee.setPhone(employeeUpdateDto.getPhone());
        employee.setBranch(branch);

        EmployeeEntity updatedEmployee = employeeRepository.save(employee);
        return convertToEmployeeDto(updatedEmployee);
    }

    @Override
    public List<EmployeeDto> getAllEmployees() {
        return employeeRepository.findAll().stream()
                .map(this::convertToEmployeeDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<CustomerDto> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(this::convertToCustomerDto)
                .collect(Collectors.toList());
    }


    private BranchDto convertToBranchDto(BranchEntity branch) {
        BranchDto dto = new BranchDto();
        BeanUtils.copyProperties(branch, dto);
        return dto;
    }

    private CustomerDto convertToCustomerDto(CustomerEntity customer) {
        CustomerDto dto = new CustomerDto();
        BeanUtils.copyProperties(customer, dto);
//        if (customer.getBranch() != null) {
//            dto.setBranchId(customer.getBranch().getBranchId());
//        }
        return dto;
    }


    private EmployeeDto convertToEmployeeDto(EmployeeEntity employee) {
        EmployeeDto dto = new EmployeeDto();
        BeanUtils.copyProperties(employee, dto);
        if (employee.getBranch() != null) {
            dto.setBranchId(employee.getBranch().getBranchId());
        }
        return dto;
    }
}