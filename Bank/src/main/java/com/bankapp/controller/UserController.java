package com.bankapp.controller;

import com.bankapp.dto.account.AccountCreateDto;
import com.bankapp.dto.account.AccountDto;
import com.bankapp.dto.account.TransactionRequestDto;
import com.bankapp.dto.loan.LoanApplicationDto;
import com.bankapp.dto.loan.LoanDto;
import com.bankapp.dto.transaction.TransactionDto;
import com.bankapp.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/user")
@Tag(name = "2. User Actions", description = "APIs for customer banking actions")
@SecurityRequirement(name = "bearerAuth")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/accounts")
    public ResponseEntity<List<AccountDto>> getMyAccounts() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        List<AccountDto> accounts = userService.getMyAccounts(username);
        return ResponseEntity.ok(accounts);
    }

    @PostMapping("/accounts")
    public ResponseEntity<AccountDto> createAccount(@Valid @RequestBody AccountCreateDto accountCreateDto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        AccountDto newAccount = userService.createAccount(accountCreateDto, username);
        return new ResponseEntity<>(newAccount, HttpStatus.CREATED);
    }

    @PostMapping("/accounts/deposit")
    public ResponseEntity<AccountDto> deposit(@Valid @RequestBody TransactionRequestDto request) {
        AccountDto updatedAccount = userService.deposit(request);
        return ResponseEntity.ok(updatedAccount);
    }
//withdraw ke liye
    @PostMapping("/accounts/withdraw")
    public ResponseEntity<AccountDto> withdraw(@Valid @RequestBody TransactionRequestDto request) {
        AccountDto updatedAccount = userService.withdraw(request);
        return ResponseEntity.ok(updatedAccount);
    }

    @PostMapping("/loans/apply")
    public ResponseEntity<LoanDto> applyForLoan(@Valid @RequestBody LoanApplicationDto loanApplicationDto) {
        LoanDto newLoan = userService.applyForLoan(loanApplicationDto);
        return new ResponseEntity<>(newLoan, HttpStatus.CREATED);
    }

    @GetMapping("/accounts/{accountId}/transactions")
    public ResponseEntity<List<TransactionDto>> getAccountTransactions(@PathVariable Long accountId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        List<TransactionDto> transactions = userService.getTransactionsForAccount(accountId, username);
        return ResponseEntity.ok(transactions);
    }
}
