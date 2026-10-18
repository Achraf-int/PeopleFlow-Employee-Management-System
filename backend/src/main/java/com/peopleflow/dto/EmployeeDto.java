package com.peopleflow.dto;

import com.peopleflow.entity.EmploymentStatus;
import com.peopleflow.entity.EmploymentType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeDto {

    private String id;

    @NotBlank(message = "Employee ID is required")
    @Size(max = 32, message = "Employee ID must not exceed 32 characters")
    private String employeeId;

    @NotBlank(message = "First name is required")
    @Size(max = 60, message = "First name must not exceed 60 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 60, message = "Last name must not exceed 60 characters")
    private String lastName;

    @NotBlank(message = "Email address is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    private String phone;

    @NotBlank(message = "Department ID is required")
    private String departmentId;

    private String departmentName;

    @NotBlank(message = "Job title is required")
    @Size(max = 100, message = "Job title must not exceed 100 characters")
    private String jobTitle;

    @NotNull(message = "Employment type is required")
    private EmploymentType employmentType;

    @NotNull(message = "Employment status is required")
    private EmploymentStatus employmentStatus;

    @NotNull(message = "Date hired is required")
    private LocalDate dateHired;

    private String workLocation;
    private String imageUrl;
    private String notes;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
