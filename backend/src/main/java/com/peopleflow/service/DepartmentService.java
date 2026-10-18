package com.peopleflow.service;

import com.peopleflow.dto.DepartmentDto;
import com.peopleflow.entity.Department;
import com.peopleflow.exception.DepartmentHasEmployeesException;
import com.peopleflow.exception.DuplicateResourceException;
import com.peopleflow.exception.ResourceNotFoundException;
import com.peopleflow.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    @Transactional(readOnly = true)
    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::toDtoWithCount)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DepartmentDto getDepartmentById(String id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        return toDtoWithCount(dept);
    }

    @Transactional
    public DepartmentDto createDepartment(DepartmentDto dto) {
        if (departmentRepository.existsByNameIgnoreCase(dto.getName().trim())) {
            throw new DuplicateResourceException("name", "Department name '" + dto.getName() + "' already exists");
        }
        if (departmentRepository.existsByCodeIgnoreCase(dto.getCode().trim())) {
            throw new DuplicateResourceException("code", "Department code '" + dto.getCode() + "' is already in use");
        }

        Department department = Department.builder()
                .id("dept-" + UUID.randomUUID().toString().substring(0, 8))
                .name(dto.getName().trim())
                .code(dto.getCode().trim().toUpperCase())
                .description(dto.getDescription().trim())
                .managerName(dto.getManagerName().trim())
                .managerEmail(dto.getManagerEmail())
                .budget(dto.getBudget())
                .build();

        Department saved = departmentRepository.save(department);
        return toDtoWithCount(saved);
    }

    @Transactional
    public DepartmentDto updateDepartment(String id, DepartmentDto dto) {
        Department current = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));

        if (!current.getName().equalsIgnoreCase(dto.getName().trim())) {
            if (departmentRepository.existsByNameIgnoreCase(dto.getName().trim())) {
                throw new DuplicateResourceException("name", "Department name '" + dto.getName() + "' already exists");
            }
        }

        if (!current.getCode().equalsIgnoreCase(dto.getCode().trim())) {
            if (departmentRepository.existsByCodeIgnoreCase(dto.getCode().trim())) {
                throw new DuplicateResourceException("code", "Department code '" + dto.getCode() + "' is already in use");
            }
        }

        current.setName(dto.getName().trim());
        current.setCode(dto.getCode().trim().toUpperCase());
        current.setDescription(dto.getDescription().trim());
        current.setManagerName(dto.getManagerName().trim());
        current.setManagerEmail(dto.getManagerEmail());
        current.setBudget(dto.getBudget());

        Department updated = departmentRepository.save(current);
        return toDtoWithCount(updated);
    }

    @Transactional
    public void deleteDepartment(String id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));

        long employeeCount = departmentRepository.countEmployeesByDepartmentId(id);
        if (employeeCount > 0) {
            throw new DepartmentHasEmployeesException(dept.getName(), employeeCount);
        }

        departmentRepository.delete(dept);
    }

    public DepartmentDto toDtoWithCount(Department dept) {
        long count = departmentRepository.countEmployeesByDepartmentId(dept.getId());
        return DepartmentDto.builder()
                .id(dept.getId())
                .name(dept.getName())
                .code(dept.getCode())
                .description(dept.getDescription())
                .managerName(dept.getManagerName())
                .managerEmail(dept.getManagerEmail())
                .budget(dept.getBudget())
                .employeeCount(count)
                .createdAt(dept.getCreatedAt())
                .updatedAt(dept.getUpdatedAt())
                .build();
    }
}
