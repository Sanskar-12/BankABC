package com.bankapp.controller;
import com.bankapp.dto.account.AccountDto;
import com.bankapp.dto.account.AccountUpdateDto;
import com.bankapp.dto.employee.EmployeeDto;
import com.bankapp.dto.loan.LoanDto;
import com.bankapp.dto.loan.LoanStatusUpdateDto;
import com.bankapp.dto.transaction.TransactionDto;
import com.bankapp.service.EmployeeService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/employee")
@Tag(name = "3. Employee Actions", description = "APIs for customer and account management")
@SecurityRequirement(name = "bearerAuth")
public class EmployeeController {
    @Autowired
    private EmployeeService employeeService;

    @PutMapping("/accounts/{id}/status/{status}")
    public ResponseEntity<AccountDto> manageAccountStatus(@PathVariable Long id, @PathVariable String status) {
        AccountDto account = employeeService.manageAccountStatus(id, status);
        return ResponseEntity.ok(account);
    }

    @PutMapping("/accounts/{id}")
    public ResponseEntity<AccountDto> updateAccountDetails(@PathVariable Long id, @Valid @RequestBody AccountUpdateDto dto) {
        return ResponseEntity.ok(employeeService.updateAccountDetails(id, dto));
    }

    @GetMapping("/loans")
    public ResponseEntity<List<LoanDto>> getAllCustomerLoans() {
        return ResponseEntity.ok(employeeService.getAllCustomerLoans());
    }

    @PutMapping("/loans/{id}/status")
    public ResponseEntity<LoanDto> updateLoanStatus(@PathVariable Integer id, @Valid @RequestBody LoanStatusUpdateDto statusUpdateDto) {
        LoanDto updatedLoan = employeeService.updateLoanStatus(id, statusUpdateDto);
        return ResponseEntity.ok(updatedLoan);
    }

    @GetMapping("/accounts/{id}")
    public ResponseEntity<AccountDto> getAccountDetails(@PathVariable Long id){
        AccountDto account = employeeService.getAccountDetails(id);
        return ResponseEntity.ok(account);
    }
    @GetMapping("/employees/{id}")
    public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable Long id){
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    @GetMapping("/accounts/{accountId}/transactions")
    public ResponseEntity<List<TransactionDto>> getAccountTransactions(@PathVariable Long accountId) {
        List<TransactionDto> transactions = employeeService.getTransactionsForAccount(accountId);
        return ResponseEntity.ok(transactions);
    }
}
