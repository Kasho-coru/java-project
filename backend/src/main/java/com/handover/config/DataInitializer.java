package com.handover.config;

import com.handover.entity.*;
import com.handover.enums.*;
import com.handover.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;
    private final HandoverRepository handoverRepository;
    private final HandoverTaskRepository taskRepository;
    private final HandoverCommentRepository commentRepository;
    private final HandoverHistoryRepository historyRepository;

    public DataInitializer(UserRepository userRepository,
                           DepartmentRepository departmentRepository,
                           EmployeeRepository employeeRepository,
                           HandoverRepository handoverRepository,
                           HandoverTaskRepository taskRepository,
                           HandoverCommentRepository commentRepository,
                           HandoverHistoryRepository historyRepository) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.employeeRepository = employeeRepository;
        this.handoverRepository = handoverRepository;
        this.taskRepository = taskRepository;
        this.commentRepository = commentRepository;
        this.historyRepository = historyRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already populated. Skipping automatic seed initialization.");
            return;
        }

        log.info("Initializing baseline academic demonstration data into MySQL...");

        // 1. Create Predefined Accounts
        User adminUser = userRepository.save(new User("admin", "admin@organization.com", "admin123", Role.ADMIN));
        User mgrUser = userRepository.save(new User("manager", "m.brody@organization.com", "manager123", Role.MANAGER));
        User sarahUser = userRepository.save(new User("sarah", "s.jenkins@organization.com", "sarah123", Role.EMPLOYEE));
        User davidUser = userRepository.save(new User("david", "d.kim@organization.com", "david123", Role.EMPLOYEE));
        User elenaUser = userRepository.save(new User("elena", "e.rostova@organization.com", "elena123", Role.MANAGER));

        // 2. Create Departments
        Department engDept = departmentRepository.save(new Department("Engineering", "Software development, cloud systems and architecture."));
        Department prodDept = departmentRepository.save(new Department("Product", "Product lifecycle, roadmaps and design."));
        Department opsDept = departmentRepository.save(new Department("Operations", "Enterprise IT systems and facilities management."));
        Department finDept = departmentRepository.save(new Department("Finance", "Corporate accounts, payroll and audits."));

        // 3. Create Employees
        Employee marcus = new Employee();
        marcus.setEmployeeCode("EMP-101");
        marcus.setFirstName("Marcus");
        marcus.setLastName("Brody");
        marcus.setEmail("m.brody@organization.com");
        marcus.setPhone("+1 (555) 234-5678");
        marcus.setDesignation("Engineering Director");
        marcus.setDepartment(engDept);
        marcus.setJoiningDate(LocalDate.of(2021, 3, 15));
        marcus.setEmploymentStatus(EmploymentStatus.ACTIVE);
        marcus.setUser(mgrUser);
        marcus = employeeRepository.save(marcus);

        // Link manager to Engineering department
        engDept.setManager(marcus);
        departmentRepository.save(engDept);

        Employee sarah = new Employee();
        sarah.setEmployeeCode("EMP-102");
        sarah.setFirstName("Sarah");
        sarah.setLastName("Jenkins");
        sarah.setEmail("s.jenkins@organization.com");
        sarah.setPhone("+1 (555) 876-5432");
        sarah.setDesignation("Senior Lead Engineer");
        sarah.setDepartment(engDept);
        sarah.setJoiningDate(LocalDate.of(2022, 6, 1));
        sarah.setEmploymentStatus(EmploymentStatus.ON_NOTICE);
        sarah.setUser(sarahUser);
        sarah = employeeRepository.save(sarah);

        Employee david = new Employee();
        david.setEmployeeCode("EMP-103");
        david.setFirstName("David");
        david.setLastName("Kim");
        david.setEmail("d.kim@organization.com");
        david.setPhone("+1 (555) 345-6789");
        david.setDesignation("Software Engineer");
        david.setDepartment(engDept);
        david.setJoiningDate(LocalDate.of(2023, 9, 15));
        david.setEmploymentStatus(EmploymentStatus.ACTIVE);
        david.setUser(davidUser);
        david = employeeRepository.save(david);

        Employee elena = new Employee();
        elena.setEmployeeCode("EMP-104");
        elena.setFirstName("Elena");
        elena.setLastName("Rostova");
        elena.setEmail("e.rostova@organization.com");
        elena.setPhone("+1 (555) 456-7890");
        elena.setDesignation("Product Director");
        elena.setDepartment(prodDept);
        elena.setJoiningDate(LocalDate.of(2022, 11, 10));
        elena.setEmploymentStatus(EmploymentStatus.ACTIVE);
        elena.setUser(elenaUser);
        elena = employeeRepository.save(elena);

        prodDept.setManager(elena);
        departmentRepository.save(prodDept);

        // 4. Create Baseline Demonstration Handovers
        Handover ho1 = new Handover();
        ho1.setHandoverCode("HO-2026-001");
        ho1.setFromEmployee(sarah);
        ho1.setToEmployee(david);
        ho1.setDepartment(engDept);
        ho1.setReason(HandoverReason.RESIGNATION);
        ho1.setDescription("Transferring primary backend services, AWS IAM credentials, and Kubernetes cluster maintenance.");
        ho1.setAdditionalNotes("All credentials staged in encrypted organizational vault. Bastion host access list updated.");
        ho1.setLastWorkingDate(LocalDate.now().plusDays(15));
        ho1.setStatus(HandoverStatus.PENDING_MANAGER);
        ho1 = handoverRepository.save(ho1);

        // Tasks for HO-2026-001
        HandoverTask t1 = new HandoverTask();
        t1.setHandover(ho1);
        t1.setTitle("Transfer AWS Root Production Credentials & Bastion Access");
        t1.setDescription("Verify IAM permissions, revoke old keys, and provision new credentials for David.");
        t1.setPriority(Priority.HIGH);
        t1.setDueDate(LocalDate.now().plusDays(5));
        t1.setTaskStatus(TaskStatus.PENDING);
        t1.setNotes("Coordinate with Infosec officer.");
        taskRepository.save(t1);

        HandoverTask t2 = new HandoverTask();
        t2.setHandover(ho1);
        t2.setTitle("Conduct CI/CD Pipeline Architecture Walkthrough");
        t2.setDescription("Review GitHub Actions workflows, Docker image build pipelines, and staging deploy webhooks.");
        t2.setPriority(Priority.MEDIUM);
        t2.setDueDate(LocalDate.now().plusDays(8));
        t2.setTaskStatus(TaskStatus.IN_PROGRESS);
        t2.setNotes("Recorded meeting link added to team Confluence.");
        taskRepository.save(t2);

        HandoverTask t3 = new HandoverTask();
        t3.setHandover(ho1);
        t3.setTitle("Customer Data Migration SOP Documentation");
        t3.setDescription("Write runbook for scheduled database schema migrations and rollbacks.");
        t3.setPriority(Priority.LOW);
        t3.setDueDate(LocalDate.now().plusDays(12));
        t3.setTaskStatus(TaskStatus.PENDING);
        taskRepository.save(t3);

        // Comments for HO-2026-001
        HandoverComment c1 = new HandoverComment();
        c1.setHandover(ho1);
        c1.setUser(davidUser);
        c1.setComment("I reviewed the initial checklist. Can we schedule the AWS IAM walkthrough for this Thursday?");
        commentRepository.save(c1);

        // History logs
        historyRepository.save(new HandoverHistory(ho1, "Handover Created", "Handover initiated by Sarah Jenkins with 3 responsibilities.", sarahUser));
        historyRepository.save(new HandoverHistory(ho1, "Submitted for Approval", "Handover submitted for Engineering Manager review (Marcus Brody).", sarahUser));

        log.info("Baseline data initialization successfully completed.");
    }
}
