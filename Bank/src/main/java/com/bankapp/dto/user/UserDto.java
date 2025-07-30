package com.bankapp.dto.user;
import lombok.Getter;
import lombok.Setter;
import java.util.Set;
@Getter
@Setter
public class UserDto {
    private Long id;
    private String username;
    private Set<String> roles;
}