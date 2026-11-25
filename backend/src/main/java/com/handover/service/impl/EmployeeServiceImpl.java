package com.handover.service.impl;

import com.handover.dto.request.EmployeeRequest;
import com.handover.dto.response.EmployeeResponse;
import com.handover.entity.Department;
import com.handover.entity.Employee;
import com.handover.entity.User;
import com.handover.enums.EmploymentStatus;
import com.handover.enums.Role;
import com.handover.exception.BadRequestException;
import com.handover.exception.ResourceNotFoundException;
import com.handover.repository.DepartmentRepository;
import com.handover.repository.EmployeeRepository;
import com.handover.repository.UserRepository;
import com.handover.service.EmployeeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository,
                               DepartmentRepository departmentRepository,
                               UserRepository userRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponse> getAllEmployees(String search, Long departmentId, String status) {
        List<Employee> list;
        if (search != null && !search.trim().isEmpty()) {
            list = employeeRepository.searchEmployees(search.trim());
        } else if (departmentId != null) {
            list = employeeRepository.findByDepartmentId(departmentId);
        } else {
            list = employeeRepository.findAll();
        }

        return list.stream()
                .filter(e -> status == null || status.trim().isEmpty() || status.equalsIgnoreCase("ALL") || e.getEmploymentStatus().name().equalsIgnoreCase(status))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public EmployeeResponse getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + id));
        return mapToResponse(employee);
    }

    @Override
    @Transactional
    public EmployeeResponse createEmployee(EmployeeRequest request) {
        if (employeeRepository.existsByEmployeeCode(request.getEmployeeCode())) {
            throw new BadRequestException("Employee code '" + request.getEmployeeCode() + "' is already in use");
        }
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email '" + request.getEmail() + "' is already registered to another employee");
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + request.getDepartmentId()));

        Employee employee = new Employee();
        employee.setEmployeeCode(request.getEmployeeCode());
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setDesignation(request.getDesignation());
        employee.setDepartment(department);
        employee.setJoiningDate(request.getJoiningDate());
        employee.setEmploymentStatus(request.getEmploymentStatus() != null ? request.getEmploymentStatus() : EmploymentStatus.ACTIVE);

        // User Account Creation (User Correction 2)
        if (request.isCreateLoginAccount() && request.getUsername() != null && !request.getUsername().trim().isEmpty()) {
            String uname = request.getUsername().trim();
            if (userRepository.existsByUsername(uname)) {
                throw new BadRequestException("Username '" + uname + "' is already taken");
            }
            String pwd = (request.getPassword() != null && !request.getPassword().trim().isEmpty())
                    ? request.getPassword().trim()
                    : uname + "123";
            Role role = request.getRole() != null ? request.getRole() : Role.EMPLOYEE;

            User user = new User(uname, request.getEmail(), pwd, role);
            User savedUser = userRepository.save(user);
            employee.setUser(savedUser);
        }

        Employee saved = employeeRepository.save(employee);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public EmployeeResponse updateEmployee(Long id, EmployeeRequest request) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + id));

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + request.getDepartmentId()));

        employee.setEmployeeCode(request.getEmployeeCode());
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setDesignation(request.getDesignation());
        employee.setDepartment(department);
        employee.setJoiningDate(request.getJoiningDate());
        if (request.getEmploymentStatus() != null) {
            employee.setEmploymentStatus(request.getEmploymentStatus());
        }

        // Update role on linked user account if specified
        if (employee.getUser() != null && request.getRole() != null) {
            employee.getUser().setRole(request.getRole());
            userRepository.save(employee.getUser());
        }

        Employee updated = employeeRepository.save(employee);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with ID: " + id));

        // Soft delete / resignation status or remove
        employee.setEmploymentStatus(EmploymentStatus.RESIGNED);
        employeeRepository.save(employee);
    }

    private EmployeeResponse mapToResponse(Employee emp) {
        EmployeeResponse res = new EmployeeResponse();
        res.setId(emp.getId());
        res.setEmployeeCode(emp.getEmployeeCode());
        res.setFirstName(emp.getFirstName());
        res.setLastName(emp.getLastName());
        res.setFullName(emp.getFullName());
        res.setEmail(emp.getEmail());
        res.setPhone(emp.getPhone());
        res.setDesignation(emp.getDesignation());
        res.setDepartmentId(emp.getDepartment().getId());
        res.setDepartmentName(emp.getDepartment().getDepartmentName());
        res.setJoiningDate(emp.getJoiningDate());
        res.setEmploymentStatus(emp.getEmploymentStatus());

        if (emp.getUser() != null) {
            res.setUserId(emp.getUser().getId());
            res.setUsername(emp.getUser().getUsername());
            res.setRole(emp.getUser().getRole());
        }

        res.setCreatedAt(emp.getCreatedAt());
        return res;
    }
}
