package com.peopleflow.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.peopleflow.dto.EmployeeDto;
import com.peopleflow.entity.EmploymentStatus;
import com.peopleflow.entity.EmploymentType;
import com.peopleflow.service.EmployeeService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(EmployeeController.class)
public class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EmployeeService employeeService;

    @Test
    @DisplayName("POST /api/employees should return 201 Created for valid payload")
    void testCreateEmployeeValid() throws Exception {
        EmployeeDto request = EmployeeDto.builder()
                .employeeId("EMP-1020")
                .firstName("Mateo")
                .lastName("Silva")
                .email("mateo.silva@auspify.com")
                .departmentId("dept-eng")
                .jobTitle("Intern")
                .employmentType(EmploymentType.INTERN)
                .employmentStatus(EmploymentStatus.ACTIVE)
                .dateHired(LocalDate.of(2024, 2, 1))
                .build();

        EmployeeDto response = EmployeeDto.builder()
                .id("emp-new")
                .employeeId("EMP-1020")
                .firstName("Mateo")
                .lastName("Silva")
                .email("mateo.silva@auspify.com")
                .departmentId("dept-eng")
                .jobTitle("Intern")
                .employmentType(EmploymentType.INTERN)
                .employmentStatus(EmploymentStatus.ACTIVE)
                .dateHired(LocalDate.of(2024, 2, 1))
                .build();

        when(employeeService.createEmployee(any(EmployeeDto.class))).thenReturn(response);

        mockMvc.perform(post("/api/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.employeeId").value("EMP-1020"))
                .andExpect(jsonPath("$.firstName").value("Mateo"));
    }

    @Test
    @DisplayName("POST /api/employees should return 400 Bad Request when required fields are missing")
    void testCreateEmployeeValidationFailure() throws Exception {
        // Missing firstName, lastName, email, and departmentId
        EmployeeDto invalidRequest = EmployeeDto.builder()
                .employeeId("EMP-1020")
                .build();

        mockMvc.perform(post("/api/employees")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation Failed"));
    }
}
