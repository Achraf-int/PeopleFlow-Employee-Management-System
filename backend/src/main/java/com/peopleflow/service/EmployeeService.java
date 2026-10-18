package com.peopleflow.service;

import com.peopleflow.dto.EmployeeDto;
import com.peopleflow.dto.PagedResponse;
import com.peopleflow.entity.Department;
import com.peopleflow.entity.Employee;
import com.peopleflow.entity.EmploymentStatus;
import com.peopleflow.entity.EmploymentType;
import com.peopleflow.exception.DuplicateResourceException;
import com.peopleflow.exception.ResourceNotFoundException;
import com.peopleflow.repository.DepartmentRepository;
import com.peopleflow.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    @Transactional(readOnly = true)
    public PagedResponse<EmployeeDto> getEmployees(
            String search,
            String departmentId,
            String statusStr,
            String employmentTypeStr,
            String sortBy,
            String sortDir,
            int page,
            int limit
    ) {
        EmploymentStatus status = null;
        if (statusStr != null && !statusStr.isBlank() && !statusStr.equalsIgnoreCase("ALL")) {
            status = EmploymentStatus.fromString(statusStr);
        }

        EmploymentType type = null;
        if (employmentTypeStr != null && !employmentTypeStr.isBlank() && !employmentTypeStr.equalsIgnoreCase("ALL")) {
            type = EmploymentType.fromString(employmentTypeStr);
        }

        Sort.Direction direction = "desc".equalsIgnoreCase(sortDir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortProperty = "firstName";
        if ("dateHired".equalsIgnoreCase(sortBy)) {
            sortProperty = "dateHired";
        } else if ("employeeId".equalsIgnoreCase(sortBy)) {
            sortProperty = "employeeId";
        } else if ("department".equalsIgnoreCase(sortBy)) {
            sortProperty = "department.name";
        }

        Pageable pageable = PageRequest.of(Math.max(0, page - 1), limit, Sort.by(direction, sortProperty));

        String queryParam = (search != null && !search.isBlank()) ? search.trim() : null;
        String deptParam = (departmentId != null && !departmentId.isBlank()) ? departmentId.trim() : null;

        Page<Employee> pageResult = employeeRepository.findWithFilters(queryParam, deptParam, status, type, pageable);

        List<EmployeeDto> dtos = pageResult.getContent().stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        return PagedResponse.<EmployeeDto>builder()
                .data(dtos)
                .pagination(PagedResponse.PaginationMetadata.builder()
                        .total(pageResult.getTotalElements())
                        .page(page)
                        .limit(limit)
                        .totalPages(pageResult.getTotalPages())
                        .build())
                .build();
    }

    @Transactional(readOnly = true)
    public EmployeeDto getEmployeeById(String id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        return toDto(employee);
    }

    @Transactional
    public EmployeeDto createEmployee(EmployeeDto dto) {
        String employeeId = dto.getEmployeeId().trim().toUpperCase();
        if (employeeRepository.existsByEmployeeIdIgnoreCase(employeeId)) {
            throw new DuplicateResourceException("employeeId", "Employee ID '" + employeeId + "' is already assigned to another staff member.");
        }

        String email = dto.getEmail().trim().toLowerCase();
        if (employeeRepository.existsByEmailIgnoreCase(email)) {
            throw new DuplicateResourceException("email", "Email address '" + email + "' is already registered.");
        }

        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + dto.getDepartmentId()));

        Employee employee = Employee.builder()
                .id("emp-" + UUID.randomUUID().toString().substring(0, 8))
                .employeeId(employeeId)
                .firstName(dto.getFirstName().trim())
                .lastName(dto.getLastName().trim())
                .email(email)
                .phone(dto.getPhone())
                .department(department)
                .jobTitle(dto.getJobTitle().trim())
                .employmentType(dto.getEmploymentType() != null ? dto.getEmploymentType() : EmploymentType.FULL_TIME)
                .employmentStatus(dto.getEmploymentStatus() != null ? dto.getEmploymentStatus() : EmploymentStatus.ACTIVE)
                .dateHired(dto.getDateHired() != null ? dto.getDateHired() : LocalDate.now())
                .workLocation(dto.getWorkLocation() != null ? dto.getWorkLocation().trim() : "San Francisco HQ")
                .imageUrl(dto.getImageUrl())
                .notes(dto.getNotes())
                .build();

        Employee saved = employeeRepository.save(employee);
        return toDto(saved);
    }

    @Transactional
    public EmployeeDto updateEmployee(String id, EmployeeDto dto) {
        Employee current = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        String employeeId = dto.getEmployeeId().trim().toUpperCase();
        if (!current.getEmployeeId().equalsIgnoreCase(employeeId)) {
            if (employeeRepository.existsByEmployeeIdIgnoreCase(employeeId)) {
                throw new DuplicateResourceException("employeeId", "Employee ID '" + employeeId + "' is already assigned.");
            }
        }

        String email = dto.getEmail().trim().toLowerCase();
        if (!current.getEmail().equalsIgnoreCase(email)) {
            if (employeeRepository.existsByEmailIgnoreCase(email)) {
                throw new DuplicateResourceException("email", "Email address '" + email + "' is already registered.");
            }
        }

        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + dto.getDepartmentId()));

        current.setEmployeeId(employeeId);
        current.setFirstName(dto.getFirstName().trim());
        current.setLastName(dto.getLastName().trim());
        current.setEmail(email);
        current.setPhone(dto.getPhone());
        current.setDepartment(department);
        current.setJobTitle(dto.getJobTitle().trim());
        current.setEmploymentType(dto.getEmploymentType());
        current.setEmploymentStatus(dto.getEmploymentStatus());
        current.setDateHired(dto.getDateHired());
        current.setWorkLocation(dto.getWorkLocation());
        current.setImageUrl(dto.getImageUrl());
        current.setNotes(dto.getNotes());

        Employee updated = employeeRepository.save(current);
        return toDto(updated);
    }

    @Transactional
    public void deleteEmployee(String id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        employeeRepository.delete(employee);
    }

    @Transactional(readOnly = true)
    public byte[] exportEmployeesCsv() {
        List<Employee> allEmployees = employeeRepository.findAll();

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (PrintWriter writer = new PrintWriter(out, true, StandardCharsets.UTF_8)) {
            writer.println("Employee ID,First Name,Last Name,Email Address,Phone Number,Department,Job Title,Employment Type,Status,Date Hired,Work Location,Notes");

            for (Employee e : allEmployees) {
                writer.printf("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"%n",
                        e.getEmployeeId(),
                        e.getFirstName(),
                        e.getLastName(),
                        e.getEmail(),
                        e.getPhone() != null ? e.getPhone() : "",
                        e.getDepartment() != null ? e.getDepartment().getName() : "Unassigned",
                        e.getJobTitle(),
                        e.getEmploymentType().getLabel(),
                        e.getEmploymentStatus().getLabel(),
                        e.getDateHired(),
                        e.getWorkLocation(),
                        e.getNotes() != null ? e.getNotes().replace("\"", "\"\"") : ""
                );
            }
            writer.flush();
        }
        return out.toByteArray();
    }

    public EmployeeDto toDto(Employee emp) {
        return EmployeeDto.builder()
                .id(emp.getId())
                .employeeId(emp.getEmployeeId())
                .firstName(emp.getFirstName())
                .lastName(emp.getLastName())
                .email(emp.getEmail())
                .phone(emp.getPhone())
                .departmentId(emp.getDepartment() != null ? emp.getDepartment().getId() : null)
                .departmentName(emp.getDepartment() != null ? emp.getDepartment().getName() : null)
                .jobTitle(emp.getJobTitle())
                .employmentType(emp.getEmploymentType())
                .employmentStatus(emp.getEmploymentStatus())
                .dateHired(emp.getDateHired())
                .workLocation(emp.getWorkLocation())
                .imageUrl(emp.getImageUrl())
                .notes(emp.getNotes())
                .createdAt(emp.getCreatedAt())
                .updatedAt(emp.getUpdatedAt())
                .build();
    }
}
