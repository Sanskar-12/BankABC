package com.bankapp.service;

import com.bankapp.dto.account.AccountCreateDto;
import com.bankapp.dto.account.AccountDto;
import com.bankapp.dto.account.TransactionRequestDto;
import com.bankapp.dto.loan.LoanApplicationDto;
import com.bankapp.dto.loan.LoanDto;
import com.bankapp.dto.transaction.TransactionDto;
import java.util.List;

public interface UserService {
    AccountDto createAccount(AccountCreateDto accountCreateDto, String username);
    AccountDto deposit(TransactionRequestDto transactionRequestDto);
    AccountDto withdraw(TransactionRequestDto transactionRequestDto);
    LoanDto applyForLoan(LoanApplicationDto loanApplicationDto);
    List<AccountDto> getMyAccounts(String username);
    List<TransactionDto> getTransactionsForAccount(Long accountId, String username);
}