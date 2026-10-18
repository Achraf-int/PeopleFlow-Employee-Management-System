package com.peopleflow.exception;

import lombok.Getter;

@Getter
public class DepartmentHasEmployeesException extends RuntimeException {
    private final long employeeCount;

    public DepartmentHasEmployeesException(String departmentName, long employeeCount) {
        super(String.format("Cannot delete department '%s' because it currently has %d employee(s) assigned. Reassign these employees before deleting.", departmentName, employeeCount));
        this.employeeCount = employeeCount;
    }
}
