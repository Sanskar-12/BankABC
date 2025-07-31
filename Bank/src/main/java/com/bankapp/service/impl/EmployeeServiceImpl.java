package com.bankapp.service.impl;
import com.bankapp.dto.account.AccountDto;
import com.bankapp.dto.account.AccountUpdateDto;
import com.bankapp.dto.employee.EmployeeDto;
import com.bankapp.dto.loan.LoanDto;
import com.bankapp.dto.loan.LoanStatusUpdateDto;
import com.bankapp.dto.transaction.TransactionDto;
import com.bankapp.entity.AccountEntity;
import com.bankapp.entity.EmployeeEntity;
import com.bankapp.entity.LoanEntity;
import com.bankapp.entity.TransactionEntity;
import com.bankapp.exception.ResourceNotFoundException;
import com.bankapp.repository.AccountRepository;
import com.bankapp.repository.EmployeeRepository;
import com.bankapp.repository.LoanRepository;
import com.bankapp.repository.TransactionRepository;
import com.bankapp.service.EmployeeService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class EmployeeServiceImpl implements EmployeeService {
    @Autowired private EmployeeRepository employeeRepository;
    @Autowired private AccountRepository accountRepository;
    @Autowired private LoanRepository loanRepository;
    @Autowired private TransactionRepository transactionRepository;

    @Override
    @Transactional
    public AccountDto updateAccountDetails(Long accountId, AccountUpdateDto accountUpdateDto) {
        AccountEntity account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        // Update fields only if provided
        if (accountUpdateDto.getAccName() != null) {
            account.setAccName(accountUpdateDto.getAccName());
        }
        if (accountUpdateDto.getAccType() != null) {
            account.setAccType(accountUpdateDto.getAccType());
        }
        if (accountUpdateDto.getBalance() != null) {
            account.setBalance(accountUpdateDto.getBalance());
        }
        if (accountUpdateDto.getStatus() != null) {
            account.setStatus(accountUpdateDto.getStatus());
        }
        if (accountUpdateDto.getEmail() != null) {
            account.setEmail(accountUpdateDto.getEmail());
        }
        if (accountUpdateDto.getPhone() != null) {
            account.setPhone(accountUpdateDto.getPhone());
        }

        AccountEntity updatedAccount = accountRepository.save(account);
        return convertToAccountDto(updatedAccount);
    }


    @Override
    @Transactional
    public AccountDto manageAccountStatus(Long accountId, String status) {
        AccountEntity account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account with ID " + accountId + " not found."));
        account.setStatus(status.toUpperCase());
        AccountEntity updatedAccount = accountRepository.save(account);
        return convertToAccountDto(updatedAccount);
    }

    @Override
    @Transactional
    public LoanDto updateLoanStatus(Integer loanId, LoanStatusUpdateDto statusUpdateDto) {
        LoanEntity loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new ResourceNotFoundException("Loan with ID " + loanId + " not found."));
        String newStatus = statusUpdateDto.getStatus().toUpperCase();
        if ("APPROVED".equals(newStatus) && !"APPROVED".equals(loan.getLoanStatus())) {
            AccountEntity account = loan.getAccount();
            if (!"ACTIVE".equals(account.getStatus())) {
                throw new IllegalStateException("Cannot approve loan for an inactive account.");
            }
            account.setBalance(account.getBalance().add(loan.getLoanAmount()));
            TransactionEntity transaction = new TransactionEntity();
            transaction.setAccount(account);
            transaction.setAmount(loan.getLoanAmount());
            transaction.setTransactionType("LOAN_CREDIT");
            transaction.setTimestamp(LocalDateTime.now());
            transaction.setDescription("Loan disbursement for loan ID: " + loan.getLoanId());
            transactionRepository.save(transaction);
            accountRepository.save(account);
        }
        loan.setLoanStatus(newStatus);
        LoanEntity updatedLoan = loanRepository.save(loan);
        return convertToLoanDto(updatedLoan);
    }

    @Override
    public List<LoanDto> getAllCustomerLoans() {
        return loanRepository.findAll().stream()
                .map(this::convertToLoanDto)
                .collect(Collectors.toList());
    }

    @Override
    public AccountDto getAccountDetails(Long id) {
        AccountEntity account = accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + id));
        return convertToAccountDto(account);
    }

    @Override
    public EmployeeDto getEmployeeById(Long id) {
        EmployeeEntity employee = employeeRepository.findById(id.intValue())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        EmployeeDto dto = new EmployeeDto();
        BeanUtils.copyProperties(employee, dto);

        // Ensure branchId is set if branch is not null
        if (employee.getBranch() != null) {
            dto.setBranchId(employee.getBranch().getBranchId());
        }

        return dto;
    }



    @Override
    public List<TransactionDto> getTransactionsForAccount(Long accountId) {
        if (!accountRepository.existsById(accountId)) {
            throw new ResourceNotFoundException("Account not found with id: " + accountId);
        }
        return transactionRepository.findByAccountAccIdOrderByTimestampDesc(accountId)
                .stream()
                .map(this::convertToTransactionDto)
                .collect(Collectors.toList());
    }

    private AccountDto convertToAccountDto(AccountEntity account) {
        AccountDto dto = new AccountDto();
        BeanUtils.copyProperties(account, dto);
        return dto;
    }
    private LoanDto convertToLoanDto(LoanEntity loan) {
        LoanDto dto = new LoanDto();
        BeanUtils.copyProperties(loan, dto);
        dto.setAccountId(loan.getAccount().getAccId());
        return dto;
    }
    private TransactionDto convertToTransactionDto(TransactionEntity transaction) {
        TransactionDto dto = new TransactionDto();
        BeanUtils.copyProperties(transaction, dto);
        return dto;
    }
}




















