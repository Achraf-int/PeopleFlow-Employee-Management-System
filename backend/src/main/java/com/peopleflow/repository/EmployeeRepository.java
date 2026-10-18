package com.peopleflow.repository;

import com.peopleflow.entity.Employee;
import com.peopleflow.entity.EmploymentStatus;
import com.peopleflow.entity.EmploymentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String>, JpaSpecificationExecutor<Employee> {

    Optional<Employee> findByEmployeeIdIgnoreCase(String employeeId);

    Optional<Employee> findByEmailIgnoreCase(String email);

    boolean existsByEmployeeIdIgnoreCase(String employeeId);

    boolean existsByEmailIgnoreCase(String email);

    long countByEmploymentStatus(EmploymentStatus status);

    long countByDepartmentId(String departmentId);

    List<Employee> findByDepartmentId(String departmentId);

    @Query("SELECT e FROM Employee e WHERE " +
           "(:search IS NULL OR LOWER(CONCAT(e.firstName, ' ', e.lastName)) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(e.employeeId) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(e.jobTitle) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:departmentId IS NULL OR e.department.id = :departmentId) AND " +
           "(:status IS NULL OR e.employmentStatus = :status) AND " +
           "(:employmentType IS NULL OR e.employmentType = :employmentType)")
    Page<Employee> findWithFilters(
        @Param("search") String search,
        @Param("departmentId") String departmentId,
        @Param("status") EmploymentStatus status,
        @Param("employmentType") EmploymentType employmentType,
        Pageable pageable
    );

    @Query("SELECT e FROM Employee e ORDER BY e.dateHired DESC LIMIT 5")
    List<Employee> findTop5RecentlyHired();

    @Query("SELECT e FROM Employee e WHERE " +
           "(:departmentId IS NULL OR e.department.id = :departmentId) AND " +
           "(:status IS NULL OR e.employmentStatus = :status) AND " +
           "(:employmentType IS NULL OR e.employmentType = :employmentType) AND " +
           "(:startDate IS NULL OR e.dateHired >= :startDate) AND " +
           "(:endDate IS NULL OR e.dateHired <= :endDate) " +
           "ORDER BY e.dateHired DESC")
    List<Employee> findForReports(
        @Param("departmentId") String departmentId,
        @Param("status") EmploymentStatus status,
        @Param("employmentType") EmploymentType employmentType,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}
