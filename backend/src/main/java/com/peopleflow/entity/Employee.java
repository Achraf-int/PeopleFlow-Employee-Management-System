package com.peopleflow.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "employees", indexes = {
    @Index(name = "idx_emp_id_unique", columnList = "employee_id", unique = true),
    @Index(name = "idx_emp_email_unique", columnList = "email", unique = true),
    @Index(name = "idx_emp_dept", columnList = "department_id"),
    @Index(name = "idx_emp_status", columnList = "employment_status"),
    @Index(name = "idx_emp_hire_date", columnList = "date_hired")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "employee_id", nullable = false, unique = true, length = 32)
    private String employeeId;

    @Column(name = "first_name", nullable = false, length = 60)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 60)
    private String lastName;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(length = 30)
    private String phone;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(name = "job_title", nullable = false, length = 100)
    private String jobTitle;

    @Enumerated(EnumType.STRING)
    @Column(name = "employment_type", nullable = false)
    @Builder.Default
    private EmploymentType employmentType = EmploymentType.FULL_TIME;

    @Enumerated(EnumType.STRING)
    @Column(name = "employment_status", nullable = false)
    @Builder.Default
    private EmploymentStatus employmentStatus = EmploymentStatus.ACTIVE;

    @Column(name = "date_hired", nullable = false)
    private LocalDate dateHired;

    @Column(name = "work_location", length = 120)
    @Builder.Default
    private String workLocation = "San Francisco HQ";

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
