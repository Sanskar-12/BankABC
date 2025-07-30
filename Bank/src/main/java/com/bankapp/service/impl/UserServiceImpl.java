package com.bankapp.service.impl;

import com.bankapp.dto.account.AccountCreateDto;
import com.bankapp.dto.account.AccountDto;
import com.bankapp.dto.account.TransactionRequestDto;
import com.bankapp.dto.loan.LoanApplicationDto;
import com.bankapp.dto.loan.LoanDto;
import com.bankapp.dto.transaction.TransactionDto;
import com.bankapp.entity.*;
import com.bankapp.exception.ResourceNotFoundException;
import com.bankapp.repository.*;
import com.bankapp.service.UserService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired private AccountRepository accountRepository;
    @Autowired private CustomerRepository customerRepository;
    @Autowired private BranchRepository branchRepository;
    @Autowired private TransactionRepository transactionRepository;
    @Autowired private LoanRepository loanRepository;
    @Autowired private UserRepository userRepository;

    @Override
    @Transactional
    public AccountDto createAccount(AccountCreateDto accountCreateDto, String username) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CustomerEntity customer = customerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found for user."));

        BranchEntity branch = branchRepository.findByBranchName(accountCreateDto.getBranchName())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Branch with name " + accountCreateDto.getBranchName() + " not found."));

        AccountEntity account = new AccountEntity();
        account.setCustomer(customer);
        account.setBranch(branch);
        account.setAccName(accountCreateDto.getAccountName());
        account.setAccType(accountCreateDto.getAccountType());
        account.setBalance(accountCreateDto.getInitialDeposit());
        account.setStatus("ACTIVE");

        AccountEntity savedAccount = accountRepository.save(account);
        return convertToAccountDto(savedAccount);
    }


    @Override
    @Transactional
    public AccountDto deposit(TransactionRequestDto request) {
        AccountEntity account = findAccountById(request.getAccountId());
        checkAccountStatus(account);

        TransactionEntity transaction;

        if ("LOAN_REPAYMENT".equalsIgnoreCase(request.getType())) {
            LoanEntity activeLoan = loanRepository.findFirstByAccountCustomerAndLoanStatus(account.getCustomer(), "APPROVED")
                    .orElseThrow(() -> new ResourceNotFoundException("No active loan found for this customer."));

            BigDecimal paymentAmount = request.getAmount();
            BigDecimal remainingLoan = activeLoan.getLoanAmount();

            if (paymentAmount.compareTo(remainingLoan) >= 0) {
                activeLoan.setLoanAmount(BigDecimal.ZERO);
                activeLoan.setLoanStatus("PAID");
            } else {
                activeLoan.setLoanAmount(remainingLoan.subtract(paymentAmount));
            }

            loanRepository.save(activeLoan);

            transaction = createTransaction(
                    account,
                    paymentAmount,
                    "LOAN_REPAYMENT",
                    "Loan repayment for loan ID: " + activeLoan.getLoanId()
            );
        } else {
            account.setBalance(account.getBalance().add(request.getAmount()));
            transaction = createTransaction(account, request.getAmount(), "DEPOSIT", "Customer deposit");
        }

        AccountEntity savedAccount = accountRepository.save(account);
        AccountDto dto = convertToAccountDto(savedAccount);

        dto.setTransId(transaction.getTransId()); // ✅ Setting the transaction ID in DTO

        return dto;
    }


    @Override
    @Transactional
    public AccountDto withdraw(TransactionRequestDto request) {
        AccountEntity account = findAccountById(request.getAccountId());
        checkAccountStatus(account);

        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new IllegalArgumentException("Insufficient funds.");
        }

        account.setBalance(account.getBalance().subtract(request.getAmount()));

        TransactionEntity transaction = createTransaction(
                account,
                request.getAmount(),
                "WITHDRAWAL",
                "Customer withdrawal"
        );

        AccountEntity savedAccount = accountRepository.save(account);
        AccountDto dto = convertToAccountDto(savedAccount);
        dto.setTransId(transaction.getTransId()); // ✅ Set transaction ID in the response
        return dto;
    }


    @Override
    @Transactional
    public LoanDto applyForLoan(LoanApplicationDto loanApplicationDto) {
        AccountEntity account = findAccountById(loanApplicationDto.getAccountId());
        checkAccountStatus(account);

        LoanEntity newLoan = new LoanEntity();
        newLoan.setAccount(account);
        newLoan.setLoanAmount(loanApplicationDto.getLoanAmount());
        newLoan.setLoanType(loanApplicationDto.getLoanType());
        newLoan.setLoanStatus("PENDING");

        LoanEntity savedLoan = loanRepository.save(newLoan);
        return convertToLoanDto(savedLoan);
    }

    @Override
    public List<AccountDto> getMyAccounts(String username) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        CustomerEntity customer = customerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found for user."));

        return accountRepository.findByCustomerCustId(customer.getCustId())
                .stream()
                .map(this::convertToAccountDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TransactionDto> getTransactionsForAccount(Long accountId, String username) {
        AccountEntity account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + accountId));

        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        CustomerEntity customer = customerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found for user."));

        if (!account.getCustomer().getCustId().equals(customer.getCustId())) {
            throw new AccessDeniedException("You do not have permission to view these transactions.");
        }

        return transactionRepository.findByAccountAccIdOrderByTimestampDesc(accountId)
                .stream()
                .map(this::convertToTransactionDto)
                .collect(Collectors.toList());
    }

    // --- Helper Methods ---

    private AccountEntity findAccountById(Long accountId) {
        return accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account with ID " + accountId + " not found."));
    }

    private void checkAccountStatus(AccountEntity account) {
        if (!"ACTIVE".equals(account.getStatus())) {
            throw new IllegalStateException("Account is not active. Current status: " + account.getStatus());
        }
    }

    private TransactionEntity  createTransaction(AccountEntity account, BigDecimal amount, String type, String description) {
        TransactionEntity transaction = new TransactionEntity();
        transaction.setAccount(account);
        transaction.setAmount(amount);
        transaction.setTransactionType(type);
        transaction.setTimestamp(LocalDateTime.now());
        transaction.setDescription(description);
        transactionRepository.save(transaction);
        return transaction;
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
