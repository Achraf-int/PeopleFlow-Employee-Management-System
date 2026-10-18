package com.peopleflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentDto {

    private String id;

    @NotBlank(message = "Department name is required")
    @Size(max = 100, message = "Department name must not exceed 100 characters")
    private String name;

    @NotBlank(message = "Department code is required")
    @Size(max = 20, message = "Department code must not exceed 20 characters")
    private String code;

    @NotBlank(message = "Department description is required")
    private String description;

    @NotBlank(message = "Department manager name is required")
    private String managerName;

    private String managerEmail;

    private BigDecimal budget;

    private Long employeeCount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
