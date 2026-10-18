package com.peopleflow.service;

import com.peopleflow.dto.DepartmentDto;
import com.peopleflow.entity.Department;
import com.peopleflow.exception.DepartmentHasEmployeesException;
import com.peopleflow.exception.DuplicateResourceException;
import com.peopleflow.repository.DepartmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DepartmentServiceTest {

    @Mock
    private DepartmentRepository departmentRepository;

    @InjectMocks
    private DepartmentService departmentService;

    private Department sampleDepartment;
    private DepartmentDto sampleDto;

    @BeforeEach
    void setUp() {
        sampleDepartment = Department.builder()
                .id("dept-eng")
                .name("Engineering")
                .code("ENG")
                .description("Core software engineering")
                .managerName("Marcus Vance")
                .budget(new BigDecimal("850000.00"))
                .build();

        sampleDto = DepartmentDto.builder()
                .name("Engineering")
                .code("ENG")
                .description("Core software engineering")
                .managerName("Marcus Vance")
                .budget(new BigDecimal("850000.00"))
                .build();
    }

    @Test
    @DisplayName("Should create department when valid and unique")
    void testCreateDepartmentSuccess() {
        when(departmentRepository.existsByNameIgnoreCase("Engineering")).thenReturn(false);
        when(departmentRepository.existsByCodeIgnoreCase("ENG")).thenReturn(false);
        when(departmentRepository.save(any(Department.class))).thenReturn(sampleDepartment);
        when(departmentRepository.countEmployeesByDepartmentId(any())).thenReturn(0L);

        DepartmentDto result = departmentService.createDepartment(sampleDto);

        assertNotNull(result);
        assertEquals("Engineering", result.getName());
        assertEquals("ENG", result.getCode());
        verify(departmentRepository, times(1)).save(any(Department.class));
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException when department name exists")
    void testCreateDepartmentDuplicateName() {
        when(departmentRepository.existsByNameIgnoreCase("Engineering")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> {
            departmentService.createDepartment(sampleDto);
        });

        verify(departmentRepository, never()).save(any(Department.class));
    }

    @Test
    @DisplayName("Should throw DepartmentHasEmployeesException when attempting to delete department with assigned employees")
    void testDeleteDepartmentPreventedWhenEmployeesExist() {
        when(departmentRepository.findById("dept-eng")).thenReturn(Optional.of(sampleDepartment));
        when(departmentRepository.countEmployeesByDepartmentId("dept-eng")).thenReturn(5L);

        DepartmentHasEmployeesException ex = assertThrows(DepartmentHasEmployeesException.class, () -> {
            departmentService.deleteDepartment("dept-eng");
        });

        assertTrue(ex.getMessage().contains("5 employee(s) assigned"));
        verify(departmentRepository, never()).delete(sampleDepartment);
    }

    @Test
    @DisplayName("Should delete department when employee count is zero")
    void testDeleteDepartmentSuccessWhenEmpty() {
        when(departmentRepository.findById("dept-eng")).thenReturn(Optional.of(sampleDepartment));
        when(departmentRepository.countEmployeesByDepartmentId("dept-eng")).thenReturn(0L);
        doNothing().when(departmentRepository).delete(sampleDepartment);

        assertDoesNotThrow(() -> departmentService.deleteDepartment("dept-eng"));
        verify(departmentRepository, times(1)).delete(sampleDepartment);
    }
}
