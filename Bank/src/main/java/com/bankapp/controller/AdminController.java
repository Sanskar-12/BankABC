package com.bankapp.controller;

import com.bankapp.dto.branch.BranchDto;
import com.bankapp.dto.employee.EmployeeCreateDto;
import com.bankapp.dto.employee.EmployeeDto;
import com.bankapp.dto.employee.EmployeeUpdateDto;
import com.bankapp.service.AdminService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/admin")
@Tag(name = "4. Admin Actions", description = "APIs for high-level administrative tasks")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {
    @Autowired
    private AdminService adminService;

    @PostMapping("/branches")
    public ResponseEntity<BranchDto> createBranch(@Valid @RequestBody BranchDto branchDto) {
        BranchDto newBranch = adminService.createBranch(branchDto);
        return new ResponseEntity<>(newBranch, HttpStatus.CREATED);
    }

    @DeleteMapping("/branches/{id}")
    public ResponseEntity<String> deleteBranch(@PathVariable Integer id) {
        adminService.deleteBranch(id);
        return ResponseEntity.ok("Branch deleted successfully");
    }

    @PostMapping("/employees")
    public ResponseEntity<String> createEmployee(@Valid @RequestBody EmployeeCreateDto employeeCreateDto) {
        adminService.createEmployee(employeeCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED).body("Employee created successfully");
    }

    @GetMapping("/employees")
    public ResponseEntity<List<EmployeeDto>> getAllEmployees() {
        return ResponseEntity.ok(adminService.getAllEmployees());
    }

    @PutMapping("/employees/{id}")
    public ResponseEntity<EmployeeDto> updateEmployee(@PathVariable Integer id, @Valid @RequestBody EmployeeUpdateDto dto) {
        return ResponseEntity.ok(adminService.updateEmployee(id, dto));
    }

    @DeleteMapping("/employees/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable Integer id) {
        adminService.deleteEmployee(id);
        return ResponseEntity.ok("Employee deleted successfully");
    }

    @DeleteMapping("/customers/{id}")
    public ResponseEntity<String> deleteCustomer(@PathVariable Integer id) {
        adminService.deleteCustomer(id);
        return ResponseEntity.ok("Customer record deleted successfully");
    }
}