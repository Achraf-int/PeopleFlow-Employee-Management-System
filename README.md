# PeopleFlow – Employee Management System

> **Auspify Technologies | Software Engineering Internship — Task 4**  
> Full-Stack Enterprise Application built with **React (TypeScript), Vite, Tailwind CSS, Java 17, Spring Boot 3, Spring Data JPA, and MySQL 8.0**.

---

## 1. Project Overview & Features

**PeopleFlow** is a premium human resources software platform designed for high-growth tech enterprises. Built to modern enterprise SaaS standards, it provides executive workforce visibility, seamless talent directory workflows, department integrity governance, and automated reporting.

### Core Features
- **Executive Overview Dashboard**: Dynamic KPI cards (Total Headcount, Active Staff, Total Departments, On-Leave Tracking) driven by live database queries. Includes interactive department distribution bars, employment status breakdown, recent additions, and audit logs.
- **Interactive Employee Directory**: Search across name, employee ID, email, and job title with real-time debouncing. Multi-facet filters for Department, Employment Status (Active, On Leave, Inactive), and Type (Full-time, Part-time, Contract, Intern). Supports column sorting, pagination, and quick actions.
- **Registration & Profile Editing**: Clean two-column modal with client-side and server-side Bean validation. Enforces strict uniqueness for Employee IDs and email addresses, with field error mapping.
- **Slide-Over Employee Dossier**: Quick view panel calculating real-time employment tenure, location tags, and direct edit/delete controls.
- **Department Management & Relational Integrity**: Add, edit, and organize departments with manager assignments and annual budget tracking. Protects database integrity by strictly preventing the deletion of any department that still has assigned employees.
- **Reporting & Functional CSV Export**: Real-time hiring trajectory charts, breakdown matrix, date range and department filters, and one-click direct CSV streaming (`/api/reports/employees/export`).
- **Standardized REST Architecture**: Full DTO layering, centralized exception handling (`GlobalExceptionHandler`), CORS governance, and database seeders.

---

## 2. Technology Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Bundler & Tooling**: Vite 8 & TSX
- **Styling**: Tailwind CSS v4 (Clean, Anti-Slop, 60-30-10 palette)
- **Icons**: Lucide React
- **Typography**: Plus Jakarta Sans (Prose) & JetBrains Mono (Metrics & IDs)

### Backend
- **Language**: Java 17 (LTS)
- **Framework**: Spring Boot 3.2.3
- **Data & Persistence**: Spring Data JPA & Hibernate ORM
- **Database**: MySQL 8.0 with InnoDB foreign key constraints
- **Validation**: Spring Boot Starter Validation (Hibernate Validator)
- **Build Tool**: Apache Maven 3.9+
- **Testing**: JUnit 5, Mockito, and Spring MockMvc

---

## 3. Project Directory Structure

```
employee-management-system/
├── backend/                               # Spring Boot 3 + Java 17 Project
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/peopleflow/
│   │   │   │   ├── config/                # CorsConfig.java, DataSeeder.java
│   │   │   │   ├── controller/            # EmployeeController, DepartmentController, etc.
│   │   │   │   ├── dto/                   # Request/Response Data Transfer Objects
│   │   │   │   ├── entity/                # Employee, Department, Enums (JPA Entities)
│   │   │   │   ├── exception/             # Custom exceptions & GlobalExceptionHandler
│   │   │   │   ├── repository/            # Spring Data JPA repositories
│   │   │   │   ├── service/               # Business logic & CSV streaming
│   │   │   │   └── PeopleFlowApplication.java
│   │   │   └── resources/
│   │   │       ├── application.properties # Spring Boot & MySQL configuration
│   │   │       ├── schema.sql             # MySQL DDL with foreign keys and indexes
│   │   │       └── data.sql               # Auspify initial development seed records
│   │   └── test/java/com/peopleflow/      # Unit and WebMvc integration tests
│   ├── pom.xml                            # Maven dependencies & build config
│   ├── Dockerfile                         # Container definition for Spring Boot
│   └── .env.example                       # Backend environment template
├── src/                                   # React Frontend
│   ├── assets/images/                     # High-fidelity HR avatar assets
│   ├── components/                        # Directory, Dashboard, Modals, Sidebar, etc.
│   ├── services/                          # Typed apiService communicating with REST APIs
│   ├── types.ts                           # Shared TypeScript interfaces
│   ├── App.tsx                            # Primary layout & state orchestration
│   ├── main.tsx                           # React entry point
│   └── index.css                          # Tailwind CSS v4 configuration
├── .vscode/                               # VS Code launch & debug settings
├── docker-compose.yml                     # 1-command startup for MySQL & Spring Boot
├── server.ts                              # Full-stack dev runner & Vite middleware mount
├── package.json                           # Frontend scripts & dependencies
└── README.md                              # Complete documentation
```

---

## 4. Prerequisites

Before running the application locally on your workstation, ensure you have:
1. **Java Development Kit (JDK) 17** installed (`java -version`).
2. **Apache Maven 3.8+** installed (`mvn -version`).
3. **Node.js 18+ or 20+** installed (`node -v`).
4. **MySQL 8.0+** or **Docker Desktop** installed.

---

## 5. Quick Start: Running with Docker (Recommended)

To launch the MySQL database and the Spring Boot backend with a single command:

```bash
# From the root directory:
docker compose up -d mysql

# Verify MySQL container health:
docker compose ps
```

The database container will automatically execute `schema.sql` and `data.sql` to initialize the `peopleflow_db` database and seed records.

---

## 6. Backend Setup & Startup (Spring Boot)

### 1. Database Configuration
If running MySQL natively (outside Docker), create the database:
```sql
CREATE DATABASE peopleflow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Update your environment variables in `.env` or pass them directly:
```bash
export DB_HOST=localhost
export DB_PORT=3306
export DB_NAME=peopleflow_db
export DB_USERNAME=root
export DB_PASSWORD=rootpassword
```

### 2. Run the Spring Boot Application
```bash
cd backend
mvn clean compile
mvn spring-boot:run
```

The Spring Boot backend will start on **`http://localhost:8080`**.  
The `DataSeeder` component will populate default records automatically if the database is empty.

### 3. Run Backend Unit & Integration Tests
```bash
cd backend
mvn test
```
This runs:
- `EmployeeServiceTest`: Tests CRUD operations and duplicate ID/email validations.
- `DepartmentServiceTest`: Tests department creation and verifies deletion prevention when employees are assigned.
- `EmployeeControllerTest`: Tests MockMvc HTTP status codes and Bean Validation responses.

---

## 7. Frontend Setup & Startup (React + Vite)

### 1. Install Dependencies
```bash
# In the root directory:
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The development server will start on **`http://localhost:3000`**. Open your browser to explore the PeopleFlow dashboard.

---

## 8. RESTful API Endpoint Documentation

All endpoints follow REST principles with JSON request/response payloads:

| HTTP Method | Endpoint | Description | Request Body / Query Params |
|:---|:---|:---|:---|
| **GET** | `/api/employees` | Search, filter, and paginate employees | `?search=marcus&departmentId=dept-eng&status=Active&page=1&limit=8` |
| **GET** | `/api/employees/{id}` | Get single employee details | None |
| **POST** | `/api/employees` | Register new employee | `EmployeeDto` (validates unique employeeId & email) |
| **PUT** | `/api/employees/{id}` | Update employee profile | `EmployeeDto` (re-checks uniqueness) |
| **DELETE** | `/api/employees/{id}` | Remove employee record | None |
| **GET** | `/api/departments` | List all departments with employee counts | None |
| **GET** | `/api/departments/{id}` | Get department details and member list | None |
| **POST** | `/api/departments` | Create new department | `DepartmentDto` (name, code, manager, budget) |
| **PUT** | `/api/departments/{id}` | Update department metadata | `DepartmentDto` |
| **DELETE** | `/api/departments/{id}` | Delete department | **Fails with 400 if employees are assigned** |
| **GET** | `/api/dashboard` | Aggregated executive metrics & charts | None |
| **GET** | `/api/reports/employees` | Filtered workforce analytics | `?departmentId=dept-eng&startDate=2023-01-01` |
| **GET** | `/api/reports/employees/export`| Download CSV spreadsheet | None (`Content-Type: text/csv`) |
| **GET** | `/api/system/info` | Inspect system architecture & records | None |
| **POST** | `/api/system/reset` | Restore initial Auspify seed data | None |

### Sample `POST /api/employees` Payload:
```json
{
  "employeeId": "EMP-1025",
  "firstName": "Alex",
  "lastName": "Rivera",
  "email": "alex.rivera@auspify.com",
  "phone": "+1 (415) 555-0195",
  "departmentId": "dept-eng",
  "jobTitle": "Full-Stack Engineer",
  "employmentType": "Full-time",
  "employmentStatus": "Active",
  "dateHired": "2024-03-15",
  "workLocation": "San Francisco HQ",
  "notes": "Assigned to Platform Core sprint team."
}
```

---

## 9. Running and Debugging in Visual Studio Code

1. Install the recommended VS Code Extensions:
   - **Extension Pack for Java** (`vscjava.vscode-java-pack`)
   - **Spring Boot Extension Pack** (`vmware.vscode-boot-dev-pack`)
   - **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
2. Open the repository root in VS Code (`code .`).
3. Press **`F5`** or open the **Run & Debug** tab:
   - Select **"Spring Boot - PeopleFlowApplication"** to debug the Java backend.
   - Select **"Launch Frontend Dev Server"** to debug the React frontend.
4. Set breakpoints inside any Controller or Service to step through incoming HTTP requests interactively.

---

## 10. Git Version Control & Submission Guidelines

To initialize your Git repository for submission:
```bash
git init
git add .
git commit -m "feat: Task 4 - Complete PeopleFlow Employee Management System"
git branch -M main
git remote add origin https://github.com/your-username/employee-management-system.git
git push -u origin main
```

---

## 11. Internship Verification & Auspify Deliverables

- **CRUD Persistence**: Complete persistence to relational tables with foreign keys and unique indexes.
- **Dynamic Metrics**: Zero hardcoded cards; every number and percentage updates dynamically upon user actions.
- **Integrity Enforcement**: Departments with employees cannot be deleted without reassigning members first.
- **Clean Architecture**: Separation of concerns between Controllers, Services, Repositories, DTOs, and React hooks.

*Built with precision for the Auspify Technologies Software Engineering Internship.*
