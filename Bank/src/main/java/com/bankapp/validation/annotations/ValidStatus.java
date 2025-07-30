package com.bankapp.validation.annotations;

import com.bankapp.validation.validators.StatusValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = StatusValidator.class)
@Documented
public @interface ValidStatus {
    String message() default "Invalid status value";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}