package com.peopleflow.dto;

import com.peopleflow.entity.EmploymentStatus;
import com.peopleflow.entity.EmploymentType;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDto {

    private long totalEmployees;
    private long activeEmployees;
    private long totalDepartments;
    private long onLeaveEmployees;
    private long inactiveEmployees;

    private List<DepartmentDistributionItem> departmentDistribution;
    private List<StatusDistributionItem> statusDistribution;
    private List<EmploymentTypeDistributionItem> employmentTypeDistribution;
    private List<EmployeeDto> recentEmployees;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DepartmentDistributionItem {
        private String departmentId;
        private String departmentName;
        private String code;
        private long count;
        private int percentage;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StatusDistributionItem {
        private EmploymentStatus status;
        private long count;
        private int percentage;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EmploymentTypeDistributionItem {
        private EmploymentType type;
        private long count;
        private int percentage;
    }
}
