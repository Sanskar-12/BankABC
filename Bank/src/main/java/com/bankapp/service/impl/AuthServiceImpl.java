package com.bankapp.service.impl;

import com.bankapp.dto.auth.JwtResponseDto;
import com.bankapp.dto.auth.LoginRequestDto;
import com.bankapp.dto.auth.RegisterRequestDto;
import com.bankapp.entity.CustomerEntity;
import com.bankapp.entity.RoleEntity;
import com.bankapp.entity.UserEntity;
import com.bankapp.exception.ResourceNotFoundException;
import com.bankapp.repository.CustomerRepository;
import com.bankapp.repository.RoleRepository;
import com.bankapp.repository.UserRepository;
import com.bankapp.security.UserDetailsImpl;
import com.bankapp.security.jwt.JwtUtils;
import com.bankapp.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private PasswordEncoder encoder;
    @Autowired
    private JwtUtils jwtUtils;

    @Override
    @Transactional
    public void registerUser(RegisterRequestDto registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getEmail())) {
            throw new IllegalArgumentException("Error: Email is already in use!");
        }

        UserEntity user = new UserEntity(registerRequest.getEmail(), encoder.encode(registerRequest.getPassword()));

        Set<RoleEntity> roles = new HashSet<>();
        RoleEntity userRole = roleRepository.findByName(RoleEntity.ERole.ROLE_USER)
                .orElseThrow(() -> new ResourceNotFoundException("Error: Role is not found."));
        roles.add(userRole);
        user.setRoles(roles);

        UserEntity savedUser = userRepository.save(user);

        CustomerEntity customer = new CustomerEntity();
        customer.setUser(savedUser);
        customer.setCustName(registerRequest.getCustomerName());
        customer.setEmail(registerRequest.getEmail());
        customer.setDob(registerRequest.getDateOfBirth());
        customer.setPhone(registerRequest.getPhone());
        customerRepository.save(customer);
    }

    @Override
    public JwtResponseDto loginUser(LoginRequestDto loginRequest) {
        System.out.println("Username: " + loginRequest.getUsername());
        System.out.println("Password: " + loginRequest.getPassword());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return new JwtResponseDto(jwt, userDetails.getId(), userDetails.getUsername(), roles);
    }
}
