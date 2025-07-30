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

    public void setTransactionId(Integer transactionId) {
    }
}