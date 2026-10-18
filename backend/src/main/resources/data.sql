-- ==============================================================
-- PeopleFlow - Seed Records for MySQL
-- Auspify Technologies Software Engineering Internship
-- ==============================================================

-- Insert Departments
INSERT IGNORE INTO departments (id, name, code, description, manager_name, manager_email, budget, created_at, updated_at) VALUES
('dept-eng', 'Engineering', 'ENG', 'Core software development, cloud infrastructure, and platform engineering.', 'Marcus Vance', 'marcus.vance@auspify.com', 850000.00, '2024-01-10 09:00:00', '2024-01-10 09:00:00'),
('dept-prod', 'Product & Design', 'PRD', 'Product strategy, UX/UI design, design systems, and user research.', 'Elena Rostova', 'elena.rostova@auspify.com', 420000.00, '2024-01-12 09:00:00', '2024-01-12 09:00:00'),
('dept-hr', 'Human Resources', 'HR', 'Talent acquisition, employee experience, compensation, and workplace culture.', 'Sarah Chen', 'sarah.chen@auspify.com', 280000.00, '2024-01-15 09:00:00', '2024-01-15 09:00:00'),
('dept-mktg', 'Marketing & Growth', 'MKT', 'Brand positioning, demand generation, developer relations, and content.', 'Julian Sterling', 'julian.sterling@auspify.com', 350000.00, '2024-02-01 09:00:00', '2024-02-01 09:00:00'),
('dept-fin', 'Finance & Operations', 'FIN', 'Corporate accounting, financial planning, compliance, and enterprise logistics.', 'Priya Patel', 'priya.patel@auspify.com', 310000.00, '2024-02-10 09:00:00', '2024-02-10 09:00:00'),
('dept-cust', 'Customer Success', 'CS', 'Client onboarding, technical support, account management, and SLA delivery.', 'David Kim', 'david.kim@auspify.com', 240000.00, '2024-03-01 09:00:00', '2024-03-01 09:00:00');

-- Insert Initial Employees
INSERT IGNORE INTO employees (id, employee_id, first_name, last_name, email, phone, department_id, job_title, employment_type, employment_status, date_hired, work_location, notes) VALUES
('emp-1001', 'EMP-1001', 'Marcus', 'Vance', 'marcus.vance@auspify.com', '+1 (415) 555-0142', 'dept-eng', 'VP of Engineering', 'Full-time', 'Active', '2023-03-15', 'San Francisco HQ', 'Oversees engineering architecture and technical roadmap.'),
('emp-1002', 'EMP-1002', 'Sarah', 'Chen', 'sarah.chen@auspify.com', '+1 (415) 555-0188', 'dept-hr', 'Head of People & Culture', 'Full-time', 'Active', '2023-04-01', 'San Francisco HQ', 'Internship coordinator and organization designer.'),
('emp-1003', 'EMP-1003', 'Elena', 'Rostova', 'elena.rostova@auspify.com', '+1 (415) 555-0193', 'dept-prod', 'Lead Product Designer', 'Full-time', 'Active', '2023-05-12', 'New York Office', 'Spearheading design system modernization.'),
('emp-1004', 'EMP-1004', 'Julian', 'Sterling', 'julian.sterling@auspify.com', '+1 (415) 555-0112', 'dept-mktg', 'Director of Growth Marketing', 'Full-time', 'Active', '2023-06-01', 'Austin, TX (Remote)', 'Leading B2B enterprise acquisition campaigns.'),
('emp-1005', 'EMP-1005', 'Priya', 'Patel', 'priya.patel@auspify.com', '+1 (415) 555-0165', 'dept-fin', 'Senior Financial Controller', 'Full-time', 'Active', '2023-07-15', 'San Francisco HQ', 'Quarterly financial auditing and cap table management.'),
('emp-1006', 'EMP-1006', 'David', 'Kim', 'david.kim@auspify.com', '+1 (415) 555-0177', 'dept-cust', 'Customer Success Manager', 'Full-time', 'Active', '2023-08-20', 'Chicago Office', 'Enterprise account onboarding and retention.'),
('emp-1007', 'EMP-1007', 'Amara', 'Okafor', 'amara.okafor@auspify.com', '+1 (415) 555-0131', 'dept-eng', 'Staff Backend Architect', 'Full-time', 'Active', '2023-09-01', 'San Francisco HQ', 'Microservices architecture, Spring Boot & database scaling.'),
('emp-1008', 'EMP-1008', 'Liam', 'Nakamura', 'liam.nakamura@auspify.com', '+1 (415) 555-0129', 'dept-eng', 'Senior Full-Stack Engineer', 'Full-time', 'On Leave', '2023-10-15', 'Seattle, WA (Remote)', 'On parental leave until next month.'),
('emp-1009', 'EMP-1009', 'Chloe', 'Dupont', 'chloe.dupont@auspify.com', '+1 (415) 555-0158', 'dept-prod', 'Senior Product Manager', 'Full-time', 'Active', '2023-11-01', 'San Francisco HQ', 'Leading HR management system initiative.'),
('emp-1010', 'EMP-1010', 'Tariq', 'Al-Mansoor', 'tariq.almansoor@auspify.com', '+1 (415) 555-0199', 'dept-eng', 'DevOps & Site Reliability Engineer', 'Full-time', 'Active', '2023-12-05', 'San Francisco HQ', 'Kubernetes, CI/CD pipelines, and cloud security compliance.'),
('emp-1011', 'EMP-1011', 'Kavita', 'Sharma', 'kavita.sharma@auspify.com', '+1 (415) 555-0144', 'dept-mktg', 'Content & Brand Strategist', 'Contract', 'Active', '2024-01-08', 'New York Office', '6-month contract for rebranding launch.'),
('emp-1012', 'EMP-1012', 'Mateo', 'Silva', 'mateo.silva@auspify.com', '+1 (415) 555-0182', 'dept-eng', 'Software Engineering Intern', 'Intern', 'Active', '2024-02-01', 'San Francisco HQ', 'Building the PeopleFlow Employee Management System.'),
('emp-1013', 'EMP-1013', 'Sofia', 'Lindqvist', 'sofia.lindqvist@auspify.com', '+1 (415) 555-0161', 'dept-prod', 'UX Researcher', 'Part-time', 'Active', '2024-02-15', 'Remote (Sweden/EST)', 'Conducting employee experience user studies.'),
('emp-1014', 'EMP-1014', 'Carlos', 'Mendoza', 'carlos.mendoza@auspify.com', '+1 (415) 555-0136', 'dept-hr', 'Talent Acquisition Specialist', 'Full-time', 'On Leave', '2024-03-01', 'San Francisco HQ', 'Scheduled medical leave, returns in 2 weeks.'),
('emp-1015', 'EMP-1015', 'Aaliyah', 'Washington', 'aaliyah.washington@auspify.com', '+1 (415) 555-0173', 'dept-eng', 'QA Automation Engineer', 'Full-time', 'Active', '2024-03-10', 'Denver, CO (Remote)', 'End-to-end Cypress & JUnit regression testing.'),
('emp-1016', 'EMP-1016', 'Lucas', 'Weber', 'lucas.weber@auspify.com', '+1 (415) 555-0118', 'dept-cust', 'Technical Support Specialist', 'Full-time', 'Inactive', '2023-05-01', 'Berlin Office', 'Transitioned out of company in Feb 2024.');
