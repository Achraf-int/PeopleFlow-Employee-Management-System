package com.peopleflow.controller;

import com.peopleflow.dto.ApiResponse;
import com.peopleflow.dto.EmployeeDto;
import com.peopleflow.dto.PagedResponse;
import com.peopleflow.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<PagedResponse<EmployeeDto>> getEmployees(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String departmentId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String employmentType,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "8") int limit
    ) {
        return ResponseEntity.ok(employeeService.getEmployees(
                search, departmentId, status, employmentType, sortBy, sortDir, page, limit
        ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable String id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    @PostMapping
    public ResponseEntity<EmployeeDto> createEmployee(@Valid @RequestBody EmployeeDto dto) {
        EmployeeDto created = employeeService.createEmployee(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeDto> updateEmployee(
            @PathVariable String id,
            @Valid @RequestBody EmployeeDto dto
    ) {
        EmployeeDto updated = employeeService.updateEmployee(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(@PathVariable String id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok(ApiResponse.success("Employee successfully deleted"));
    }
}
