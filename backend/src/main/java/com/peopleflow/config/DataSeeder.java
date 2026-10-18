package com.peopleflow.config;

import com.peopleflow.entity.Department;
import com.peopleflow.entity.Employee;
import com.peopleflow.entity.EmploymentStatus;
import com.peopleflow.entity.EmploymentType;
import com.peopleflow.repository.DepartmentRepository;
import com.peopleflow.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    public void run(String... args) {
        if (departmentRepository.count() > 0) {
            log.info("Database already contains records. Skipping development seed execution.");
            return;
        }

        log.info("Seeding initial Auspify Technologies organization records into database...");

        Department eng = Department.builder()
                .id("dept-eng")
                .name("Engineering")
                .code("ENG")
                .description("Core software development, cloud infrastructure, and platform engineering.")
                .managerName("Marcus Vance")
                .managerEmail("marcus.vance@auspify.com")
                .budget(new BigDecimal("850000.00"))
                .build();

        Department prod = Department.builder()
                .id("dept-prod")
                .name("Product & Design")
                .code("PRD")
                .description("Product strategy, UX/UI design, design systems, and user research.")
                .managerName("Elena Rostova")
                .managerEmail("elena.rostova@auspify.com")
                .budget(new BigDecimal("420000.00"))
                .build();

        Department hr = Department.builder()
                .id("dept-hr")
                .name("Human Resources")
                .code("HR")
                .description("Talent acquisition, employee experience, compensation, and workplace culture.")
                .managerName("Sarah Chen")
                .managerEmail("sarah.chen@auspify.com")
                .budget(new BigDecimal("280000.00"))
                .build();

        Department mktg = Department.builder()
                .id("dept-mktg")
                .name("Marketing & Growth")
                .code("MKT")
                .description("Brand positioning, demand generation, developer relations, and content.")
                .managerName("Julian Sterling")
                .managerEmail("julian.sterling@auspify.com")
                .budget(new BigDecimal("350000.00"))
                .build();

        Department fin = Department.builder()
                .id("dept-fin")
                .name("Finance & Operations")
                .code("FIN")
                .description("Corporate accounting, financial planning, compliance, and enterprise logistics.")
                .managerName("Priya Patel")
                .managerEmail("priya.patel@auspify.com")
                .budget(new BigDecimal("310000.00"))
                .build();

        Department cs = Department.builder()
                .id("dept-cust")
                .name("Customer Success")
                .code("CS")
                .description("Client onboarding, technical support, account management, and SLA delivery.")
                .managerName("David Kim")
                .managerEmail("david.kim@auspify.com")
                .budget(new BigDecimal("240000.00"))
                .build();

        departmentRepository.saveAll(List.of(eng, prod, hr, mktg, fin, cs));

        List<Employee> employees = List.of(
                Employee.builder()
                        .id("emp-1001")
                        .employeeId("EMP-1001")
                        .firstName("Marcus")
                        .lastName("Vance")
                        .email("marcus.vance@auspify.com")
                        .phone("+1 (415) 555-0142")
                        .department(eng)
                        .jobTitle("VP of Engineering")
                        .employmentType(EmploymentType.FULL_TIME)
                        .employmentStatus(EmploymentStatus.ACTIVE)
                        .dateHired(LocalDate.of(2023, 3, 15))
                        .workLocation("San Francisco HQ")
                        .notes("Oversees engineering architecture and technical roadmap.")
                        .build(),
                Employee.builder()
                        .id("emp-1002")
                        .employeeId("EMP-1002")
                        .firstName("Sarah")
                        .lastName("Chen")
                        .email("sarah.chen@auspify.com")
                        .phone("+1 (415) 555-0188")
                        .department(hr)
                        .jobTitle("Head of People & Culture")
                        .employmentType(EmploymentType.FULL_TIME)
                        .employmentStatus(EmploymentStatus.ACTIVE)
                        .dateHired(LocalDate.of(2023, 4, 1))
                        .workLocation("San Francisco HQ")
                        .notes("Internship coordinator and organization designer.")
                        .build(),
                Employee.builder()
                        .id("emp-1003")
                        .employeeId("EMP-1003")
                        .firstName("Elena")
                        .lastName("Rostova")
                        .email("elena.rostova@auspify.com")
                        .phone("+1 (415) 555-0193")
                        .department(prod)
                        .jobTitle("Lead Product Designer")
                        .employmentType(EmploymentType.FULL_TIME)
                        .employmentStatus(EmploymentStatus.ACTIVE)
                        .dateHired(LocalDate.of(2023, 5, 12))
                        .workLocation("New York Office")
                        .notes("Spearheading design system modernization.")
                        .build(),
                Employee.builder()
                        .id("emp-1004")
                        .employeeId("EMP-1004")
                        .firstName("Julian")
                        .lastName("Sterling")
                        .email("julian.sterling@auspify.com")
                        .phone("+1 (415) 555-0112")
                        .department(mktg)
                        .jobTitle("Director of Growth Marketing")
                        .employmentType(EmploymentType.FULL_TIME)
                        .employmentStatus(EmploymentStatus.ACTIVE)
                        .dateHired(LocalDate.of(2023, 6, 1))
                        .workLocation("Austin, TX (Remote)")
                        .notes("Leading B2B enterprise acquisition campaigns.")
                        .build(),
                Employee.builder()
                        .id("emp-1005")
                        .employeeId("EMP-1005")
                        .firstName("Priya")
                        .lastName("Patel")
                        .email("priya.patel@auspify.com")
                        .phone("+1 (415) 555-0165")
                        .department(fin)
                        .jobTitle("Senior Financial Controller")
                        .employmentType(EmploymentType.FULL_TIME)
                        .employmentStatus(EmploymentStatus.ACTIVE)
                        .dateHired(LocalDate.of(2023, 7, 15))
                        .workLocation("San Francisco HQ")
                        .notes("Quarterly financial auditing and cap table management.")
                        .build(),
                Employee.builder()
                        .id("emp-1006")
                        .employeeId("EMP-1006")
                        .firstName("David")
                        .lastName("Kim")
                        .email("david.kim@auspify.com")
                        .phone("+1 (415) 555-0177")
                        .department(cs)
                        .jobTitle("Customer Success Manager")
                        .employmentType(EmploymentType.FULL_TIME)
                        .employmentStatus(EmploymentStatus.ACTIVE)
                        .dateHired(LocalDate.of(2023, 8, 20))
                        .workLocation("Chicago Office")
                        .notes("Enterprise account onboarding and retention.")
                        .build(),
                Employee.builder()
                        .id("emp-1007")
                        .employeeId("EMP-1007")
                        .firstName("Amara")
                        .lastName("Okafor")
                        .email("amara.okafor@auspify.com")
                        .phone("+1 (415) 555-0131")
                        .department(eng)
                        .jobTitle("Staff Backend Architect")
                        .employmentType(EmploymentType.FULL_TIME)
                        .employmentStatus(EmploymentStatus.ACTIVE)
                        .dateHired(LocalDate.of(2023, 9, 1))
                        .workLocation("San Francisco HQ")
                        .notes("Microservices architecture, Spring Boot & database scaling.")
                        .build(),
                Employee.builder()
                        .id("emp-1008")
                        .employeeId("EMP-1008")
                        .firstName("Liam")
                        .lastName("Nakamura")
                        .email("liam.nakamura@auspify.com")
                        .phone("+1 (415) 555-0129")
                        .department(eng)
                        .jobTitle("Senior Full-Stack Engineer")
                        .employmentType(EmploymentType.FULL_TIME)
                        .employmentStatus(EmploymentStatus.ON_LEAVE)
                        .dateHired(LocalDate.of(2023, 10, 15))
                        .workLocation("Seattle, WA (Remote)")
                        .notes("On parental leave until next month.")
                        .build(),
                Employee.builder()
                        .id("emp-1009")
                        .employeeId("EMP-1009")
                        .firstName("Chloe")
                        .lastName("Dupont")
                        .email("chloe.dupont@auspify.com")
                        .phone("+1 (415) 555-0158")
                        .department(prod)
                        .jobTitle("Senior Product Manager")
                        .employmentType(EmploymentType.FULL_TIME)
                        .employmentStatus(EmploymentStatus.ACTIVE)
                        .dateHired(LocalDate.of(2023, 11, 1))
                        .workLocation("San Francisco HQ")
                        .notes("Leading HR management system initiative.")
                        .build(),
                Employee.builder()
                        .id("emp-1010")
                        .employeeId("EMP-1010")
                        .firstName("Tariq")
                        .lastName("Al-Mansoor")
                        .email("tariq.almansoor@auspify.com")
                        .phone("+1 (415) 555-0199")
                        .department(eng)
                        .jobTitle("DevOps & Site Reliability Engineer")
                        .employmentType(EmploymentType.FULL_TIME)
                        .employmentStatus(EmploymentStatus.ACTIVE)
                        .dateHired(LocalDate.of(2023, 12, 5))
                        .workLocation("San Francisco HQ")
                        .notes("Kubernetes, CI/CD pipelines, and cloud security compliance.")
                        .build(),
                Employee.builder()
                        .id("emp-1011")
                        .employeeId("EMP-1011")
                        .firstName("Kavita")
                        .lastName("Sharma")
                        .email("kavita.sharma@auspify.com")
                        .phone("+1 (415) 555-0144")
                        .department(mktg)
                        .jobTitle("Content & Brand Strategist")
                        .employmentType(EmploymentType.CONTRACT)
                        .employmentStatus(EmploymentStatus.ACTIVE)
                        .dateHired(LocalDate.of(2024, 1, 8))
                        .workLocation("New York Office")
                        .notes("6-month contract for rebranding launch.")
                        .build(),
                Employee.builder()
                        .id("emp-1012")
                        .employeeId("EMP-1012")
                        .firstName("Mateo")
                        .lastName("Silva")
                        .email("mateo.silva@auspify.com")
                        .phone("+1 (415) 555-0182")
                        .department(eng)
                        .jobTitle("Software Engineering Intern")
                        .employmentType(EmploymentType.INTERN)
                        .employmentStatus(EmploymentStatus.ACTIVE)
                        .dateHired(LocalDate.of(2024, 2, 1))
                        .workLocation("San Francisco HQ")
                        .notes("Building the PeopleFlow Employee Management System.")
                        .build(),
                Employee.builder()
                        .id("emp-1013")
                        .employeeId("EMP-1013")
                        .firstName("Sofia")
                        .lastName("Lindqvist")
                        .email("sofia.lindqvist@auspify.com")
                        .phone("+1 (415) 555-0161")
                        .department(prod)
                        .jobTitle("UX Researcher")
                        .employmentType(EmploymentType.PART_TIME)
                        .employmentStatus(EmploymentStatus.ACTIVE)
                        .dateHired(LocalDate.of(2024, 2, 15))
                        .workLocation("Remote (Sweden/EST)")
                        .notes("Conducting employee experience user studies.")
                        .build(),
                Employee.builder()
                        .id("emp-1014")
                        .employeeId("EMP-1014")
                        .firstName("Carlos")
                        .lastName("Mendoza")
                        .email("carlos.mendoza@auspify.com")
                        .phone("+1 (415) 555-0136")
                        .department(hr)
                        .jobTitle("Talent Acquisition Specialist")
                        .employmentType(EmploymentType.FULL_TIME)
                        .employmentStatus(EmploymentStatus.ON_LEAVE)
                        .dateHired(LocalDate.of(2024, 3, 1))
                        .workLocation("San Francisco HQ")
                        .notes("Scheduled medical leave, returns in 2 weeks.")
                        .build(),
                Employee.builder()
                        .id("emp-1015")
                        .employeeId("EMP-1015")
                        .firstName("Aaliyah")
                        .lastName("Washington")
                        .email("aaliyah.washington@auspify.com")
                        .phone("+1 (415) 555-0173")
                        .department(eng)
                        .jobTitle("QA Automation Engineer")
                        .employmentType(EmploymentType.FULL_TIME)
                        .employmentStatus(EmploymentStatus.ACTIVE)
                        .dateHired(LocalDate.of(2024, 3, 10))
                        .workLocation("Denver, CO (Remote)")
                        .notes("End-to-end Cypress & JUnit regression testing.")
                        .build(),
                Employee.builder()
                        .id("emp-1016")
                        .employeeId("EMP-1016")
                        .firstName("Lucas")
                        .lastName("Weber")
                        .email("lucas.weber@auspify.com")
                        .phone("+1 (415) 555-0118")
                        .department(cs)
                        .jobTitle("Technical Support Specialist")
                        .employmentType(EmploymentType.FULL_TIME)
                        .employmentStatus(EmploymentStatus.INACTIVE)
                        .dateHired(LocalDate.of(2023, 5, 1))
                        .workLocation("Berlin Office")
                        .notes("Transitioned out of company in Feb 2024.")
                        .build()
        );

        employeeRepository.saveAll(employees);
        log.info("Database seeding successfully initialized with {} departments and {} employees.", departmentRepository.count(), employeeRepository.count());
    }
}
