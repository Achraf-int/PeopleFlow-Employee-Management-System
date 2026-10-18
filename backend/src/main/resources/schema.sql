-- ==============================================================
-- PeopleFlow - Database Schema DDL for MySQL 8.0+
-- Auspify Technologies Software Engineering Internship
-- ==============================================================

CREATE DATABASE IF NOT EXISTS peopleflow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE peopleflow_db;

-- 1. Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    manager_name VARCHAR(100) NOT NULL,
    manager_email VARCHAR(150),
    budget DECIMAL(15, 2) DEFAULT 250000.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_department_name (name),
    INDEX idx_department_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Employees Table
CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(64) PRIMARY KEY,
    employee_id VARCHAR(32) NOT NULL UNIQUE,
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(30),
    department_id VARCHAR(64) NOT NULL,
    job_title VARCHAR(100) NOT NULL,
    employment_type ENUM('Full-time', 'Part-time', 'Contract', 'Intern') NOT NULL DEFAULT 'Full-time',
    employment_status ENUM('Active', 'On Leave', 'Inactive') NOT NULL DEFAULT 'Active',
    date_hired DATE NOT NULL,
    work_location VARCHAR(120) DEFAULT 'San Francisco HQ',
    image_url VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_employee_department FOREIGN KEY (department_id) 
        REFERENCES departments (id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    INDEX idx_emp_names (last_name, first_name),
    INDEX idx_emp_email (email),
    INDEX idx_emp_dept (department_id),
    INDEX idx_emp_status (employment_status),
    INDEX idx_emp_hire_date (date_hired)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
