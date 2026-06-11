package com.staffbase.service;

import com.staffbase.models.*;
import com.staffbase.repositories.jpa.*;
import com.staffbase.repositories.mongo.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class DatabaseSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final DesignationRepository designationRepository;
    private final SkillRepository skillRepository;
    private final EmployeeSkillRepository employeeSkillRepository;
    private final OnboardingTaskRepository onboardingTaskRepository;
    private final ReportingHierarchyRepository reportingHierarchyRepository;
    private final NotificationRepository notificationRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final LoginAuditRepository loginAuditRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final RegistrationRequestRepository registrationRequestRepository;
    private final EmployeeDocumentRepository employeeDocumentRepository;
    private final SystemSettingRepository systemSettingRepository;
    private final PasswordEncoder passwordEncoder;
    private final MongoTemplate mongoTemplate;

    public DatabaseSeeder(
            RoleRepository roleRepository,
            UserRepository userRepository,
            EmployeeRepository employeeRepository,
            DepartmentRepository departmentRepository,
            DesignationRepository designationRepository,
            SkillRepository skillRepository,
            EmployeeSkillRepository employeeSkillRepository,
            OnboardingTaskRepository onboardingTaskRepository,
            ReportingHierarchyRepository reportingHierarchyRepository,
            NotificationRepository notificationRepository,
            RefreshTokenRepository refreshTokenRepository,
            LoginAuditRepository loginAuditRepository,
            PasswordResetTokenRepository passwordResetTokenRepository,
            RegistrationRequestRepository registrationRequestRepository,
            EmployeeDocumentRepository employeeDocumentRepository,
            SystemSettingRepository systemSettingRepository,
            PasswordEncoder passwordEncoder,
            MongoTemplate mongoTemplate) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.designationRepository = designationRepository;
        this.skillRepository = skillRepository;
        this.employeeSkillRepository = employeeSkillRepository;
        this.onboardingTaskRepository = onboardingTaskRepository;
        this.reportingHierarchyRepository = reportingHierarchyRepository;
        this.notificationRepository = notificationRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.loginAuditRepository = loginAuditRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.registrationRequestRepository = registrationRequestRepository;
        this.employeeDocumentRepository = employeeDocumentRepository;
        this.systemSettingRepository = systemSettingRepository;
        this.passwordEncoder = passwordEncoder;
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("====== Starting Database Seeder Process ======");

        if (roleRepository.count() > 0 || userRepository.count() > 0) {
            System.out.println("Database already contains seeded tables. Skipping cleanup and seeding to preserve previous employees and user data.");
            return;
        }

        System.out.println("====== Clean Database Seeding Commenced ======");

        // 0. Drop all collections & tables for clean slate
        refreshTokenRepository.deleteAll();
        loginAuditRepository.deleteAll();
        passwordResetTokenRepository.deleteAll();
        userRepository.deleteAll();
        roleRepository.deleteAll();

        mongoTemplate.dropCollection("employees");
        mongoTemplate.dropCollection("departments");
        mongoTemplate.dropCollection("designations");
        mongoTemplate.dropCollection("skills");
        mongoTemplate.dropCollection("employee_skills");
        mongoTemplate.dropCollection("onboarding_tasks");
        mongoTemplate.dropCollection("reporting_hierarchy");
        mongoTemplate.dropCollection("notifications");
        mongoTemplate.dropCollection("registration_requests");
        mongoTemplate.dropCollection("documents");
        mongoTemplate.dropCollection("system_settings");
        mongoTemplate.dropCollection("support_tickets");

        System.out.println("All previous tables and collections dropped successfully.");

        // 1. Seed Roles (MySQL)
        System.out.println("Seeding MySQL Roles...");
        
        // Admin permissions
        List<Role.Permission> adminPerms = Arrays.asList(
            new Role.Permission("Directory Listing Search", true),
            new Role.Permission("Own Profile Bio & Skills Write", true),
            new Role.Permission("Own Private Documents Upload", true),
            new Role.Permission("HR Operations Wizard Access", true),
            new Role.Permission("Financial Salary Details Edit", true),
            new Role.Permission("Directory DB Core settings", true)
        );
        Role adminRole = new Role("Admin", "var(--danger)", adminPerms);
        roleRepository.save(adminRole);

        // HR permissions
        List<Role.Permission> hrPerms = Arrays.asList(
            new Role.Permission("Directory Listing Search", true),
            new Role.Permission("Own Profile Bio & Skills Write", true),
            new Role.Permission("Own Private Documents Upload", true),
            new Role.Permission("HR Operations Wizard Access", true),
            new Role.Permission("Financial Salary Details Edit", true),
            new Role.Permission("Directory DB Core settings", false)
        );
        Role hrRole = new Role("HR", "var(--warning)", hrPerms);
        roleRepository.save(hrRole);

        // Employee permissions
        List<Role.Permission> empPerms = Arrays.asList(
            new Role.Permission("Directory Listing Search", true),
            new Role.Permission("Own Profile Bio & Skills Write", true),
            new Role.Permission("Own Private Documents Upload", true),
            new Role.Permission("HR Operations Wizard Access", false),
            new Role.Permission("Financial Salary Details Edit", false),
            new Role.Permission("Directory DB Core settings", false)
        );
        Role empRole = new Role("Employee", "var(--info)", empPerms);
        roleRepository.save(empRole);

        // 2. Seed Departments & Designations (MongoDB Atlas)
        System.out.println("Seeding MongoDB Departments & Designations...");
        departmentRepository.save(new Department("Engineering", "ENG", "Sarah Jenkins"));
        departmentRepository.save(new Department("Human Resources", "HR", "Michael Chen"));
        departmentRepository.save(new Department("Finance", "FIN", "Sarah Jenkins"));

        designationRepository.save(new Designation("Software Engineer", "Engineering"));
        designationRepository.save(new Designation("Senior Software Engineer", "Engineering"));
        designationRepository.save(new Designation("HR Associate", "Human Resources"));
        designationRepository.save(new Designation("HR Manager", "Human Resources"));
        designationRepository.save(new Designation("Financial Analyst", "Finance"));

        // 3. Seed Skills Master Collection (MongoDB Atlas)
        System.out.println("Seeding MongoDB Master Skills...");
        skillRepository.save(new Skill("Java", "Languages"));
        skillRepository.save(new Skill("React", "Frameworks"));
        skillRepository.save(new Skill("Spring Boot", "Frameworks"));
        skillRepository.save(new Skill("MongoDB", "Databases"));
        skillRepository.save(new Skill("MySQL", "Databases"));
        skillRepository.save(new Skill("Recruiting", "HR Skills"));
        skillRepository.save(new Skill("Financial Modeling", "Finance Skills"));

        // 4. Seed default System Settings (MongoDB Atlas)
        System.out.println("Seeding default system settings...");
        systemSettingRepository.save(new SystemSetting("StaffBase Inc.", 30, false));

        // 5. Seed Employees & Users (Syncing MySQL and MongoDB Atlas)
        System.out.println("Seeding Synchronized Employees and Users...");

        // Seed Admin Profile
        Employee sarah = new Employee("EMP-101", "Sarah Jenkins", "sarah@admin.com", 
            "Principal Administrator and Lead Software Architect.", "Engineering", "Senior Software Engineer", 
            "2024-01-10", "Active", "#3B82F6");
        sarah.getSkills().addAll(Arrays.asList("Java", "Spring Boot", "React", "MySQL"));
        
        sarah.getTimeline().add(new Employee.TimelineEvent("2024-01-10", "Joined StaffBase", "Sarah entered the workforce as a senior technical leader."));
        sarah.getTimeline().add(new Employee.TimelineEvent("2025-01-15", "System Admin Clearance Elevation", "Granted full administrative coordinates for security audits."));
        
        sarah.getEmergencyContacts().add(new Employee.EmergencyContact("James Jenkins", "Spouse", "+1 (555) 019-2834", "james@gmail.com"));
        sarah.setBankingInfo(new Employee.BankingInfo("Apex Capital Bank", "Sarah Jenkins", "•••• •••• •••• 9876", "APEX00018", 120000.00));
        employeeRepository.save(sarah);

        User sarahUser = new User("sarah@admin.com", passwordEncoder.encode("password123"), "EMP-101");
        sarahUser.getRoles().add(adminRole);
        userRepository.save(sarahUser);

        // Seed HR Profile
        Employee michael = new Employee("EMP-102", "Michael Chen", "michael@hr.com", 
            "Corporate Talent Acquisition and HR Operations Lead.", "Human Resources", "HR Manager", 
            "2024-02-15", "Active", "#10B981");
        michael.getSkills().addAll(Arrays.asList("Recruiting", "HR Strategy"));
        michael.getTimeline().add(new Employee.TimelineEvent("2024-02-15", "Joined StaffBase", "Michael signed corporate induction to lead HR segment."));
        michael.getEmergencyContacts().add(new Employee.EmergencyContact("Lily Chen", "Sister", "+1 (555) 039-4822", "lily@gmail.com"));
        michael.setBankingInfo(new Employee.BankingInfo("Standard Trust Bank", "Michael Chen", "•••• •••• •••• 5432", "STB000109", 85000.00));
        employeeRepository.save(michael);

        User michaelUser = new User("michael@hr.com", passwordEncoder.encode("password123"), "EMP-102");
        michaelUser.getRoles().add(hrRole);
        userRepository.save(michaelUser);

        // Seed regular Employee Profile (On Probation)
        Employee john = new Employee("EMP-103", "John Doe", "john@employee.com", 
            "Junior Full-Stack Web Developer. Enthusiastic about Javascript, CSS, and modern web designs.", 
            "Engineering", "Software Engineer", "2026-05-01", "On Probation", "#EF4444");
        john.getSkills().addAll(Arrays.asList("React", "MySQL"));
        john.getTimeline().add(new Employee.TimelineEvent("2026-05-01", "Commenced Onboarding", "Assigned systems access cards and equipment credentials."));
        john.getEmergencyContacts().add(new Employee.EmergencyContact("Mary Doe", "Mother", "+1 (555) 012-7654", "mary@doe.com"));
        john.setBankingInfo(new Employee.BankingInfo("Apex Capital Bank", "John Doe", "•••• •••• •••• 1234", "APEX00018", 55000.00));
        employeeRepository.save(john);

        User johnUser = new User("john@employee.com", passwordEncoder.encode("password123"), "EMP-103");
        johnUser.getRoles().add(empRole);
        userRepository.save(johnUser);

        // Seed David Miller (Employee)
        Employee david = new Employee("EMP-104", "David Miller", "david@employee.com",
            "Frontend specialist focusing on responsive web pages and premium CSS styling.", "Engineering", "Software Engineer",
            "2026-06-01", "Active", "#F59E0B");
        david.getSkills().addAll(Arrays.asList("React", "MySQL"));
        david.getTimeline().add(new Employee.TimelineEvent("2026-06-01", "Joined StaffBase", "David joined the engineering division."));
        david.getEmergencyContacts().add(new Employee.EmergencyContact("Sarah Miller", "Spouse", "+1 (555) 045-8712", "sarah.m@gmail.com"));
        david.setBankingInfo(new Employee.BankingInfo("Apex Capital Bank", "David Miller", "•••• •••• •••• 4567", "APEX00018", 65000.00));
        employeeRepository.save(david);

        User davidUser = new User("david@employee.com", passwordEncoder.encode("password123"), "EMP-104");
        davidUser.getRoles().add(empRole);
        userRepository.save(davidUser);

        // Seed Emily Watson (Employee)
        Employee emily = new Employee("EMP-105", "Emily Watson", "emily@employee.com",
            "Database administrator specializing in SQL query optimizations and MongoDB replication.", "Finance", "Financial Analyst",
            "2026-05-10", "Active", "#EC4899");
        emily.getSkills().add("MySQL");
        emily.getTimeline().add(new Employee.TimelineEvent("2026-05-10", "Joined StaffBase", "Emily joined the finance division."));
        emily.getEmergencyContacts().add(new Employee.EmergencyContact("George Watson", "Father", "+1 (555) 078-4321", "george@watson.com"));
        emily.setBankingInfo(new Employee.BankingInfo("Apex Capital Bank", "Emily Watson", "•••• •••• •••• 8901", "APEX00018", 70000.00));
        employeeRepository.save(emily);

        User emilyUser = new User("emily@employee.com", passwordEncoder.encode("password123"), "EMP-105");
        emilyUser.getRoles().add(empRole);
        userRepository.save(emilyUser);

        // Seed Robert Taylor (Employee)
        Employee robert = new Employee("EMP-106", "Robert Taylor", "robert@employee.com",
            "Backend engineer skilled in Spring Boot REST APIs and microservice architecture.", "Engineering", "Software Engineer",
            "2026-06-03", "On Probation", "#8B5CF6");
        robert.getSkills().addAll(Arrays.asList("Java", "Spring Boot"));
        robert.getTimeline().add(new Employee.TimelineEvent("2026-06-03", "Commenced Onboarding", "Robert commenced onboarding tasks."));
        robert.getEmergencyContacts().add(new Employee.EmergencyContact("Helen Taylor", "Mother", "+1 (555) 089-1122", "helen@taylor.com"));
        robert.setBankingInfo(new Employee.BankingInfo("Apex Capital Bank", "Robert Taylor", "•••• •••• •••• 2345", "APEX00018", 62000.00));
        employeeRepository.save(robert);

        User robertUser = new User("robert@employee.com", passwordEncoder.encode("password123"), "EMP-106");
        robertUser.getRoles().add(empRole);
        userRepository.save(robertUser);

        // Seed Jessica Green (HR)
        Employee jessica = new Employee("EMP-107", "Jessica Green", "jessica@hr.com",
            "Senior HR operations specialist managing employee clearance and documentation compliance.", "Human Resources", "HR Manager",
            "2025-11-01", "Active", "#10B981");
        jessica.getSkills().add("HR Strategy");
        jessica.getTimeline().add(new Employee.TimelineEvent("2025-11-01", "Joined StaffBase", "Jessica signed corporate HR orientation."));
        jessica.getEmergencyContacts().add(new Employee.EmergencyContact("Mark Green", "Brother", "+1 (555) 067-9876", "mark@green.com"));
        jessica.setBankingInfo(new Employee.BankingInfo("Standard Trust Bank", "Jessica Green", "•••• •••• •••• 7654", "STB000109", 88000.00));
        employeeRepository.save(jessica);

        User jessicaUser = new User("jessica@hr.com", passwordEncoder.encode("password123"), "EMP-107");
        jessicaUser.getRoles().add(hrRole);
        userRepository.save(jessicaUser);

        // Seed Daniel Brown (HR)
        Employee daniel = new Employee("EMP-108", "Daniel Brown", "daniel@hr.com",
            "HR coordinator driving team orientation sessions, onboarding onboarding pipelines, and training.", "Human Resources", "HR Associate",
            "2026-02-01", "Active", "#10B981");
        daniel.getSkills().add("Recruiting");
        daniel.getTimeline().add(new Employee.TimelineEvent("2026-02-01", "Joined StaffBase", "Daniel joined the HR division."));
        daniel.getEmergencyContacts().add(new Employee.EmergencyContact("Alice Brown", "Mother", "+1 (555) 012-3498", "alice@brown.com"));
        daniel.setBankingInfo(new Employee.BankingInfo("Standard Trust Bank", "Daniel Brown", "•••• •••• •••• 3210", "STB000109", 58000.00));
        employeeRepository.save(daniel);

        User danielUser = new User("daniel@hr.com", passwordEncoder.encode("password123"), "EMP-108");
        danielUser.getRoles().add(hrRole);
        userRepository.save(danielUser);

        // 6. Seed Hierarchy, Onboarding and Skills mappings in MongoDB
        reportingHierarchyRepository.save(new ReportingHierarchy("EMP-102", "EMP-101", "Human Resources"));
        reportingHierarchyRepository.save(new ReportingHierarchy("EMP-103", "EMP-101", "Engineering"));
        reportingHierarchyRepository.save(new ReportingHierarchy("EMP-104", "EMP-101", "Engineering"));
        reportingHierarchyRepository.save(new ReportingHierarchy("EMP-105", "EMP-101", "Finance"));
        reportingHierarchyRepository.save(new ReportingHierarchy("EMP-106", "EMP-101", "Engineering"));
        reportingHierarchyRepository.save(new ReportingHierarchy("EMP-107", "EMP-101", "Human Resources"));
        reportingHierarchyRepository.save(new ReportingHierarchy("EMP-108", "EMP-107", "Human Resources"));

        onboardingTaskRepository.save(new OnboardingTask("EMP-103", "IT Assets & Workspace Provisioning", "Completed"));
        onboardingTaskRepository.save(new OnboardingTask("EMP-103", "Corporate NDA & Security Signoff", "Completed"));
        onboardingTaskRepository.save(new OnboardingTask("EMP-103", "Financial Banking & Payroll Audit", "Pending"));
        onboardingTaskRepository.save(new OnboardingTask("EMP-103", "Formal Orientation & Team Syncs", "Pending"));

        onboardingTaskRepository.save(new OnboardingTask("EMP-106", "IT Assets & Workspace Provisioning", "Pending"));
        onboardingTaskRepository.save(new OnboardingTask("EMP-106", "Corporate NDA & Security Signoff", "Pending"));
        onboardingTaskRepository.save(new OnboardingTask("EMP-106", "Financial Banking & Payroll Audit", "Pending"));

        employeeSkillRepository.save(new EmployeeSkill("EMP-101", "Java", "Expert", 5));
        employeeSkillRepository.save(new EmployeeSkill("EMP-101", "Spring Boot", "Expert", 4));
        employeeSkillRepository.save(new EmployeeSkill("EMP-101", "React", "Intermediate", 2));
        employeeSkillRepository.save(new EmployeeSkill("EMP-102", "Recruiting", "Expert", 6));
        employeeSkillRepository.save(new EmployeeSkill("EMP-103", "React", "Beginner", 1));
        employeeSkillRepository.save(new EmployeeSkill("EMP-104", "React", "Expert", 4));
        employeeSkillRepository.save(new EmployeeSkill("EMP-105", "MySQL", "Expert", 4));
        employeeSkillRepository.save(new EmployeeSkill("EMP-106", "Spring Boot", "Intermediate", 3));
        employeeSkillRepository.save(new EmployeeSkill("EMP-107", "HR Strategy", "Expert", 5));

        // Seed initial notifications
        notificationRepository.save(new Notification(
            "Document Audit Required", 
            "Employee John Doe uploaded a new certification document awaiting HR verification.", 
            "warning", 
            null
        ));
        notificationRepository.save(new Notification(
            "System Maintenance Complete", 
            "Security patches applied to MongoDB Cluster0 successfully.", 
            "info", 
            null
        ));

        System.out.println("====== Database Seeding Completed Successfully ======");
    }
}
