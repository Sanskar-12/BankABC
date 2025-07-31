package com.bankapp.dto.account;

import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
public class AccountDto {
    private Long accId;
    private String accName;
    private String accType;
    private BigDecimal balance;
    private String status;
    private Long transId;

    private String accountHolderName; // from Customer
    private String branchName;

    public void setTransactionId(Integer transactionId) {
    }
}