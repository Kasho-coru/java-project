package com.handover.service.impl;

import com.handover.dto.request.DepartmentRequest;
import com.handover.dto.response.DepartmentResponse;
import com.handover.entity.Department;
import com.handover.entity.Employee;
import com.handover.exception.BadRequestException;
import com.handover.exception.ResourceNotFoundException;
import com.handover.repository.DepartmentRepository;
import com.handover.repository.EmployeeRepository;
import com.handover.repository.HandoverRepository;
import com.handover.service.DepartmentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;
    private final HandoverRepository handoverRepository;

    public DepartmentServiceImpl(DepartmentRepository departmentRepository,
                                 EmployeeRepository employeeRepository,
                                 HandoverRepository handoverRepository) {
        this.departmentRepository = departmentRepository;
        this.employeeRepository = employeeRepository;
        this.handoverRepository = handoverRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentResponse getDepartmentById(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));
        return mapToResponse(dept);
    }

    @Override
    @Transactional
    public DepartmentResponse createDepartment(DepartmentRequest request) {
        if (departmentRepository.existsByDepartmentName(request.getDepartmentName())) {
            throw new BadRequestException("Department with name '" + request.getDepartmentName() + "' already exists");
        }

        Department dept = new Department();
        dept.setDepartmentName(request.getDepartmentName());
        dept.setDescription(request.getDescription());

        if (request.getManagerEmployeeId() != null) {
            Employee manager = employeeRepository.findById(request.getManagerEmployeeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager employee not found with ID: " + request.getManagerEmployeeId()));
            dept.setManager(manager);
        }

        Department saved = departmentRepository.save(dept);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public DepartmentResponse updateDepartment(Long id, DepartmentRequest request) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));

        dept.setDepartmentName(request.getDepartmentName());
        dept.setDescription(request.getDescription());

        if (request.getManagerEmployeeId() != null) {
            Employee manager = employeeRepository.findById(request.getManagerEmployeeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager employee not found with ID: " + request.getManagerEmployeeId()));
            dept.setManager(manager);
        } else {
            dept.setManager(null);
        }

        Department updated = departmentRepository.save(dept);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteDepartment(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));

        long employeeCount = employeeRepository.countByDepartmentId(id);
        if (employeeCount > 0) {
            throw new BadRequestException("Cannot delete department with " + employeeCount + " active employees assigned");
        }

        departmentRepository.delete(dept);
    }

    private DepartmentResponse mapToResponse(Department dept) {
        DepartmentResponse res = new DepartmentResponse();
        res.setId(dept.getId());
        res.setDepartmentName(dept.getDepartmentName());
        res.setDescription(dept.getDescription());
        if (dept.getManager() != null) {
            res.setManagerEmployeeId(dept.getManager().getId());
            res.setManagerName(dept.getManager().getFullName());
        } else {
            res.setManagerName("Unassigned");
        }
        res.setEmployeeCount(employeeRepository.countByDepartmentId(dept.getId()));
        res.setActiveHandoversCount(handoverRepository.countByDepartmentId(dept.getId()));
        res.setCreatedAt(dept.getCreatedAt());
        return res;
    }
}
