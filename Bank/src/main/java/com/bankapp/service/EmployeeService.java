package com.bankapp.service;
import com.bankapp.dto.account.AccountDto;
import com.bankapp.dto.account.AccountUpdateDto;
import com.bankapp.dto.employee.EmployeeDto;
import com.bankapp.dto.loan.LoanDto;
import com.bankapp.dto.loan.LoanStatusUpdateDto;
import com.bankapp.dto.transaction.TransactionDto;
import java.util.List;
public interface EmployeeService {
    AccountDto updateAccountDetails(Long accountId, AccountUpdateDto accountUpdateDto);
    AccountDto manageAccountStatus(Long accountId, String status);
    LoanDto updateLoanStatus(Integer loanId, LoanStatusUpdateDto statusUpdateDto);
    List<LoanDto> getAllCustomerLoans();
    List<TransactionDto> getTransactionsForAccount(Long accountId);

    AccountDto getAccountDetails(Long id);

    EmployeeDto getEmployeeById(Long id);
}