package com.handover.service.impl;

import com.handover.dto.request.LoginRequest;
import com.handover.dto.response.AuthResponse;
import com.handover.entity.Employee;
import com.handover.entity.User;
import com.handover.exception.BadRequestException;
import com.handover.repository.EmployeeRepository;
import com.handover.repository.UserRepository;
import com.handover.service.AuthService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;

    public AuthServiceImpl(UserRepository userRepository, EmployeeRepository employeeRepository) {
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String identifier = request.getUsername().trim();
        String password = request.getPassword().trim();

        // 1. Direct match on username or email
        Optional<User> userOpt = userRepository.findByUsername(identifier);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(identifier);
        }

        if (userOpt.isEmpty()) {
            throw new BadRequestException("Invalid username or email address");
        }

        User user = userOpt.get();

        // 2. Direct plaintext password check (Local Academic Requirement)
        if (!user.getPassword().equals(password)) {
            throw new BadRequestException("Invalid password. Please check your credentials");
        }

        // 3. Resolve linked employee profile if applicable
        Optional<Employee> empOpt = employeeRepository.findByUserId(user.getId());
        Long employeeId = empOpt.map(Employee::getId).orElse(null);
        String designation = empOpt.map(Employee::getDesignation).orElse("System Administrator");
        String department = empOpt.map(e -> e.getDepartment().getDepartmentName()).orElse("Executive Administration");
        String fullName = empOpt.map(Employee::getFullName).orElse(user.getUsername());

        return new AuthResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                fullName,
                user.getRole(),
                employeeId,
                designation,
                department
        );
    }
}
