package com.peopleflow.repository;

import com.peopleflow.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, String> {
    Optional<Department> findByNameIgnoreCase(String name);
    Optional<Department> findByCodeIgnoreCase(String code);
    boolean existsByNameIgnoreCase(String name);
    boolean existsByCodeIgnoreCase(String code);

    @Query("SELECT COUNT(e) FROM Employee e WHERE e.department.id = :departmentId")
    long countEmployeesByDepartmentId(String departmentId);
}
