package com.bankapp.dto.transaction;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Getter
@Setter
public class TransactionDto {
    private Long transId;
    private BigDecimal amount;
    private String transactionType;
    private LocalDateTime timestamp;
    private String description;
}