package com.bankapp.validation.validators;

import com.bankapp.validation.annotations.ValidStatus;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.Arrays;
import java.util.List;

public class StatusValidator implements ConstraintValidator<ValidStatus, String> {
    private final List<String> validStatuses = Arrays.asList("PENDING", "APPROVED", "REJECTED");

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return false;
        }
        return validStatuses.contains(value.toUpperCase());
    }
}