-- =============================================================================
-- EMPLOYEE RESPONSIBILITY HANDOVER & TRANSITION MANAGEMENT SYSTEM
-- Seed Sample Data: Demo Accounts, Departments, Staff, Transitions & Tasks
-- Compatible with: MySQL 8.0+
-- =============================================================================

USE employee_handover;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE handover_history;
TRUNCATE TABLE handover_comments;
TRUNCATE TABLE handover_tasks;
TRUNCATE TABLE handovers;
TRUNCATE TABLE employees;
TRUNCATE TABLE departments;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- 1. Insert Predefined Users (Academic Plaintext Passwords)
-- -----------------------------------------------------------------------------
INSERT INTO users (id, username, email, password, role) VALUES
(1, 'admin', 'admin@organization.com', 'admin123', 'ADMIN'),
(2, 'manager', 'm.brody@organization.com', 'manager123', 'MANAGER'),
(3, 'sarah', 's.jenkins@organization.com', 'sarah123', 'EMPLOYEE'),
(4, 'david', 'd.kim@organization.com', 'david123', 'EMPLOYEE'),
(5, 'elena', 'e.rostova@organization.com', 'elena123', 'MANAGER'),
(6, 'michael', 'm.chang@organization.com', 'michael123', 'EMPLOYEE'),
(7, 'amara', 'a.okafor@organization.com', 'amara123', 'EMPLOYEE'),
(8, 'liam', 'l.vance@organization.com', 'liam123', 'EMPLOYEE');

-- -----------------------------------------------------------------------------
-- 2. Insert Departments (Initial without manager link)
-- -----------------------------------------------------------------------------
INSERT INTO departments (id, department_name, description, manager_employee_id) VALUES
(1, 'Engineering', 'Software development, cloud infrastructure, quality assurance and architecture.', NULL),
(2, 'Product', 'Product lifecycle management, user research, UI/UX design, and feature strategy.', NULL),
(3, 'Operations', 'Enterprise IT systems, compliance, office administration and facilities.', NULL),
(4, 'Finance', 'Corporate accounts, payroll processing, budget planning and fiscal audits.', NULL),
(5, 'Human Resources', 'Talent acquisition, employee relations, learning & development and benefits.', NULL);

-- -----------------------------------------------------------------------------
-- 3. Insert Employees
-- -----------------------------------------------------------------------------
INSERT INTO employees (id, employee_code, first_name, last_name, email, phone, designation, department_id, joining_date, employment_status, user_id) VALUES
(101, 'EMP-101', 'Marcus', 'Brody', 'm.brody@organization.com', '+1 (555) 234-5678', 'Engineering Director', 1, '2021-03-15', 'ACTIVE', 2),
(102, 'EMP-102', 'Sarah', 'Jenkins', 's.jenkins@organization.com', '+1 (555) 876-5432', 'Senior Lead Engineer', 1, '2022-06-01', 'ON_NOTICE', 3),
(103, 'EMP-103', 'David', 'Kim', 'd.kim@organization.com', '+1 (555) 345-6789', 'Software Engineer', 1, '2023-09-15', 'ACTIVE', 4),
(104, 'EMP-104', 'Elena', 'Rostova', 'e.rostova@organization.com', '+1 (555) 456-7890', 'Product Director', 2, '2022-11-10', 'ACTIVE', 5),
(105, 'EMP-105', 'Michael', 'Chang', 'm.chang@organization.com', '+1 (555) 567-8901', 'Senior Product Manager', 2, '2023-01-20', 'ON_NOTICE', 6),
(106, 'EMP-106', 'Amara', 'Okafor', 'a.okafor@organization.com', '+1 (555) 678-9012', 'Operations Lead', 3, '2021-08-05', 'ON_LEAVE', 7),
(107, 'EMP-107', 'Liam', 'Vance', 'l.vance@organization.com', '+1 (555) 789-0123', 'IT Systems Specialist', 3, '2023-04-12', 'ACTIVE', 8);

-- Update Departments with assigned managers
UPDATE departments SET manager_employee_id = 101 WHERE id = 1; -- Marcus Brody heads Engineering
UPDATE departments SET manager_employee_id = 104 WHERE id = 2; -- Elena Rostova heads Product
UPDATE departments SET manager_employee_id = 106 WHERE id = 3; -- Amara Okafor heads Operations

-- -----------------------------------------------------------------------------
-- 4. Insert Handovers
-- -----------------------------------------------------------------------------
INSERT INTO handovers (id, handover_code, from_employee_id, to_employee_id, department_id, reason, description, additional_notes, last_working_date, status, created_at) VALUES
(1, 'HO-2026-001', 102, 103, 1, 'RESIGNATION', 
 'Transferring primary backend services, AWS IAM credentials, and Kubernetes cluster maintenance prior to my last working day.',
 'All credentials have been staged in 1Password engineering vault. Bastion host access list updated.',
 '2026-11-15', 'PENDING_MANAGER', '2026-10-28 10:30:00'),

(2, 'HO-2026-002', 105, 104, 2, 'DEPARTMENT_TRANSFER',
 'Handing over Q4 product roadmap, enterprise customer feedback dossiers, and user persona analytics.',
 'Shared Figma workspace edit access and updated Linear product board permissions.',
 '2026-11-08', 'PENDING_RECEIVER', '2026-10-25 14:00:00'),

(3, 'HO-2026-003', 106, 107, 3, 'EXTENDED_LEAVE',
 'Operational oversight transfer for global office badge access systems and backup generators during 3-month leave.',
 'Building facility manager contact numbers provided in handover notes.',
 '2026-10-25', 'COMPLETED', '2026-10-10 09:15:00'),

(4, 'HO-2026-004', 103, 102, 1, 'ROLE_CHANGE',
 'Internal role transition to Distributed Systems Specialist; reallocating legacy client maintenance tasks.',
 'Client accounts list attached in Confluence.',
 '2026-11-30', 'DRAFT', '2026-10-30 16:45:00');

-- -----------------------------------------------------------------------------
-- 5. Insert Handover Tasks / Responsibilities
-- -----------------------------------------------------------------------------
INSERT INTO handover_tasks (id, handover_id, title, description, priority, due_date, task_status, notes) VALUES
(1, 1, 'Transfer AWS Root Production Credentials & Bastion Access', 
 'Verify IAM permissions, revoke old keys, and provision new credentials for David.', 'HIGH', '2026-11-05', 'PENDING', 'Coordinate with Infosec officer.'),
(2, 1, 'Conduct CI/CD Pipeline Architecture Walkthrough', 
 'Review GitHub Actions workflows, Docker image build pipelines, and staging deploy webhooks.', 'MEDIUM', '2026-11-08', 'IN_PROGRESS', 'Recorded meeting link added to team Confluence.'),
(3, 1, 'Customer Data Migration SOP Documentation', 
 'Write runbook for scheduled database schema migrations and rollbacks.', 'LOW', '2026-11-12', 'PENDING', 'Draft saved in Notion.'),
(4, 1, 'Transfer Third-Party API Developer Keys (Stripe, Twilio)',
 'Reassign admin roles to David in vendor console dashboards.', 'HIGH', '2026-11-14', 'PENDING', 'Requires 2FA confirmation from Marcus Brody.'),

(5, 2, 'Q4 Enterprise Feature Prioritization Matrix',
 'Review outstanding customer feature requests and sprint estimates with product team.', 'HIGH', '2026-11-04', 'COMPLETED', 'Reviewed and aligned in sprint planning.'),
(6, 2, 'Figma Design System Component Library Ownership',
 'Transfer ownership of Design System workspace to Elena.', 'MEDIUM', '2026-11-06', 'IN_PROGRESS', 'Designers informed.'),
(7, 2, 'Customer Interview Recording Transcripts Archive',
 'Upload user test recordings to shared Google Drive repository.', 'LOW', '2026-11-07', 'PENDING', 'Approx 15 GB of media.'),

(8, 3, 'Facilities Emergency Generator Bi-Weekly Test Protocol',
 'Conduct physical walkthrough with diesel maintenance technicians.', 'HIGH', '2026-10-18', 'COMPLETED', 'Successfully verified on Oct 18.'),
(9, 3, 'Keycard Access Control Server Firmware Update',
 'Apply security patch to door controller central controller.', 'MEDIUM', '2026-10-22', 'COMPLETED', 'Completed without downtime.');

-- -----------------------------------------------------------------------------
-- 6. Insert Comments
-- -----------------------------------------------------------------------------
INSERT INTO handover_comments (id, handover_id, user_id, comment, created_at) VALUES
(1, 1, 4, 'I reviewed the initial checklist. Can we schedule the AWS IAM walkthrough for this Thursday?', '2026-10-29 14:15:00'),
(2, 1, 3, 'Thursday 2 PM works perfectly. I will send an invite with the runbook attached.', '2026-10-29 15:00:00'),
(3, 2, 5, 'Please ensure the Stripe API keys are migrated before Friday so monthly invoicing is uninterrupted.', '2026-10-26 11:20:00');

-- -----------------------------------------------------------------------------
-- 7. Insert Handover History Logs
-- -----------------------------------------------------------------------------
INSERT INTO handover_history (id, handover_id, action, description, performed_by, created_at) VALUES
(1, 1, 'Handover Created', 'Handover request initiated by Sarah Jenkins with 4 itemized responsibilities.', 3, '2026-10-28 10:30:00'),
(2, 1, 'Submitted for Approval', 'Handover submitted for Engineering Manager review (Marcus Brody).', 3, '2026-10-28 10:35:00'),
(3, 2, 'Handover Created', 'Handover request initiated by Michael Chang.', 6, '2026-10-25 14:00:00'),
(4, 2, 'Submitted for Approval', 'Handover submitted for Product Director review.', 6, '2026-10-25 14:05:00'),
(5, 2, 'Manager Approved', 'Elena Rostova approved the handover. Transition dispatched to receiver review.', 5, '2026-10-26 09:30:00'),
(6, 3, 'Handover Created', 'Leave handover initiated by Amara Okafor.', 7, '2026-10-10 09:15:00'),
(7, 3, 'Submitted for Approval', 'Submitted for review.', 7, '2026-10-10 09:20:00'),
(8, 3, 'Manager Approved', 'Approved by Operations Management.', 1, '2026-10-11 11:00:00'),
(9, 3, 'Receiver Accepted', 'Liam Vance accepted all incoming responsibilities. Handover COMPLETED.', 8, '2026-10-25 17:00:00');
