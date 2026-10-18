package com.peopleflow.service;

import com.peopleflow.dto.EmployeeDto;
import com.peopleflow.entity.Department;
import com.peopleflow.entity.Employee;
import com.peopleflow.entity.EmploymentStatus;
import com.peopleflow.entity.EmploymentType;
import com.peopleflow.exception.DuplicateResourceException;
import com.peopleflow.exception.ResourceNotFoundException;
import com.peopleflow.repository.DepartmentRepository;
import com.peopleflow.repository.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private DepartmentRepository departmentRepository;

    @InjectMocks
    private EmployeeService employeeService;

    private Department sampleDepartment;
    private Employee sampleEmployee;
    private EmployeeDto sampleDto;

    @BeforeEach
    void setUp() {
        sampleDepartment = Department.builder()
                .id("dept-eng")
                .name("Engineering")
                .code("ENG")
                .managerName("Marcus Vance")
                .build();

        sampleEmployee = Employee.builder()
                .id("emp-1")
                .employeeId("EMP-1001")
                .firstName("Mateo")
                .lastName("Silva")
                .email("mateo.silva@auspify.com")
                .jobTitle("Software Engineering Intern")
                .employmentType(EmploymentType.INTERN)
                .employmentStatus(EmploymentStatus.ACTIVE)
                .dateHired(LocalDate.of(2024, 2, 1))
                .department(sampleDepartment)
                .build();

        sampleDto = EmployeeDto.builder()
                .employeeId("EMP-1001")
                .firstName("Mateo")
                .lastName("Silva")
                .email("mateo.silva@auspify.com")
                .departmentId("dept-eng")
                .jobTitle("Software Engineering Intern")
                .employmentType(EmploymentType.INTERN)
                .employmentStatus(EmploymentStatus.ACTIVE)
                .dateHired(LocalDate.of(2024, 2, 1))
                .build();
    }

    @Test
    @DisplayName("Should successfully create employee when valid data is provided")
    void testCreateEmployeeSuccess() {
        when(employeeRepository.existsByEmployeeIdIgnoreCase("EMP-1001")).thenReturn(false);
        when(employeeRepository.existsByEmailIgnoreCase("mateo.silva@auspify.com")).thenReturn(false);
        when(departmentRepository.findById("dept-eng")).thenReturn(Optional.of(sampleDepartment));
        when(employeeRepository.save(any(Employee.class))).thenReturn(sampleEmployee);

        EmployeeDto result = employeeService.createEmployee(sampleDto);

        assertNotNull(result);
        assertEquals("EMP-1001", result.getEmployeeId());
        assertEquals("Mateo", result.getFirstName());
        verify(employeeRepository, times(1)).save(any(Employee.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when employee ID already exists")
    void testCreateEmployeeDuplicateId() {
        when(employeeRepository.existsByEmployeeIdIgnoreCase("EMP-1001")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> {
            employeeService.createEmployee(sampleDto);
        });

        verify(employeeRepository, never()).save(any(Employee.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when email already exists")
    void testCreateEmployeeDuplicateEmail() {
        when(employeeRepository.existsByEmployeeIdIgnoreCase("EMP-1001")).thenReturn(false);
        when(employeeRepository.existsByEmailIgnoreCase("mateo.silva@auspify.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> {
            employeeService.createEmployee(sampleDto);
        });

        verify(employeeRepository, never()).save(any(Employee.class));
    }

    @Test
    @DisplayName("Should retrieve existing employee by ID")
    void testGetEmployeeByIdSuccess() {
        when(employeeRepository.findById("emp-1")).thenReturn(Optional.of(sampleEmployee));

        EmployeeDto result = employeeService.getEmployeeById("emp-1");

        assertNotNull(result);
        assertEquals("EMP-1001", result.getEmployeeId());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when employee ID not found")
    void testGetEmployeeByIdNotFound() {
        when(employeeRepository.findById("invalid-id")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            employeeService.getEmployeeById("invalid-id");
        });
    }

    @Test
    @DisplayName("Should delete employee successfully")
    void testDeleteEmployeeSuccess() {
        when(employeeRepository.findById("emp-1")).thenReturn(Optional.of(sampleEmployee));
        doNothing().when(employeeRepository).delete(sampleEmployee);

        assertDoesNotThrow(() -> employeeService.deleteEmployee("emp-1"));
        verify(employeeRepository, times(1)).delete(sampleEmployee);
    }
}
