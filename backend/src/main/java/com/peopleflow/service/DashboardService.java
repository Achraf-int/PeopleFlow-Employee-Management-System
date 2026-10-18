package com.peopleflow.service;

import com.peopleflow.dto.DashboardStatsDto;
import com.peopleflow.dto.EmployeeDto;
import com.peopleflow.entity.Department;
import com.peopleflow.entity.Employee;
import com.peopleflow.entity.EmploymentStatus;
import com.peopleflow.entity.EmploymentType;
import com.peopleflow.repository.DepartmentRepository;
import com.peopleflow.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeService employeeService;

    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        long totalEmployees = employeeRepository.count();
        long activeEmployees = employeeRepository.countByEmploymentStatus(EmploymentStatus.ACTIVE);
        long onLeaveEmployees = employeeRepository.countByEmploymentStatus(EmploymentStatus.ON_LEAVE);
        long inactiveEmployees = employeeRepository.countByEmploymentStatus(EmploymentStatus.INACTIVE);
        long totalDepartments = departmentRepository.count();

        // Department breakdown
        List<Department> departments = departmentRepository.findAll();
        List<DashboardStatsDto.DepartmentDistributionItem> deptDistribution = new ArrayList<>();
        for (Department dept : departments) {
            long count = employeeRepository.countByDepartmentId(dept.getId());
            int pct = totalEmployees > 0 ? (int) Math.round(((double) count / totalEmployees) * 100) : 0;
            deptDistribution.add(DashboardStatsDto.DepartmentDistributionItem.builder()
                    .departmentId(dept.getId())
                    .departmentName(dept.getName())
                    .code(dept.getCode())
                    .count(count)
                    .percentage(pct)
                    .build());
        }

        // Status breakdown
        List<DashboardStatsDto.StatusDistributionItem> statusDistribution = new ArrayList<>();
        for (EmploymentStatus status : EmploymentStatus.values()) {
            long count = employeeRepository.countByEmploymentStatus(status);
            int pct = totalEmployees > 0 ? (int) Math.round(((double) count / totalEmployees) * 100) : 0;
            statusDistribution.add(DashboardStatsDto.StatusDistributionItem.builder()
                    .status(status)
                    .count(count)
                    .percentage(pct)
                    .build());
        }

        // Employment Type breakdown
        List<DashboardStatsDto.EmploymentTypeDistributionItem> typeDistribution = new ArrayList<>();
        List<Employee> all = employeeRepository.findAll();
        for (EmploymentType type : EmploymentType.values()) {
            long count = all.stream().filter(e -> e.getEmploymentType() == type).count();
            int pct = totalEmployees > 0 ? (int) Math.round(((double) count / totalEmployees) * 100) : 0;
            typeDistribution.add(DashboardStatsDto.EmploymentTypeDistributionItem.builder()
                    .type(type)
                    .count(count)
                    .percentage(pct)
                    .build());
        }

        // Top 5 recently hired
        List<EmployeeDto> recent = employeeRepository.findTop5RecentlyHired().stream()
                .map(employeeService::toDto)
                .collect(Collectors.toList());

        return DashboardStatsDto.builder()
                .totalEmployees(totalEmployees)
                .activeEmployees(activeEmployees)
                .totalDepartments(totalDepartments)
                .onLeaveEmployees(onLeaveEmployees)
                .inactiveEmployees(inactiveEmployees)
                .departmentDistribution(deptDistribution)
                .statusDistribution(statusDistribution)
                .employmentTypeDistribution(typeDistribution)
                .recentEmployees(recent)
                .build();
    }
}
