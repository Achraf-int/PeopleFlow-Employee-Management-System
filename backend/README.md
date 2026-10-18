# PeopleFlow Backend – Spring Boot 3 & MySQL

This folder contains the complete, production-grade Spring Boot 3.2+ backend for the **PeopleFlow – Employee Management System**.

## Stack
- Java 17 (LTS)
- Spring Boot 3.2.3
- Spring Data JPA
- Spring Web & Validation
- MySQL 8.0 Driver
- Lombok

## Build & Test
```bash
# Compile and package jar
mvn clean package

# Run unit and integration tests
mvn test

# Run application locally
mvn spring-boot:run
```

## Database Connection
By default, the backend connects to MySQL on `localhost:3306` with database `peopleflow_db`.
Override these with environment variables:
- `DB_HOST`: Hostname (default: `localhost`)
- `DB_PORT`: Port (default: `3306`)
- `DB_NAME`: Database (default: `peopleflow_db`)
- `DB_USERNAME`: User (default: `root`)
- `DB_PASSWORD`: Password (default: `rootpassword`)

## Endpoints
- `GET /api/employees` - List, filter, search, sort, and paginate employees
- `POST /api/employees` - Register employee with validation and unique checks
- `GET /api/employees/{id}` - Get employee details
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee
- `GET /api/departments` - List departments with employee count
- `POST /api/departments` - Create department
- `PUT /api/departments/{id}` - Update department
- `DELETE /api/departments/{id}` - Delete department (blocked if employees exist)
- `GET /api/dashboard` - Real-time executive KPIs and department distributions
- `GET /api/reports/employees/export` - Direct CSV stream download
