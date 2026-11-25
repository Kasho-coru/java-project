-- =============================================================================
-- EMPLOYEE RESPONSIBILITY HANDOVER & TRANSITION MANAGEMENT SYSTEM
-- Database Schema: employee_handover
-- Compatible with: MySQL 8.0+
-- =============================================================================

CREATE DATABASE IF NOT EXISTS employee_handover
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE employee_handover;

-- Disable foreign key checks during schema re-creation if needed
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS handover_history;
DROP TABLE IF EXISTS handover_comments;
DROP TABLE IF EXISTS handover_tasks;
DROP TABLE IF EXISTS handovers;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- 1. Table: users
-- Simple academic credentials storage for Admin, Managers, and Employees
-- -----------------------------------------------------------------------------
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role ENUM('ADMIN', 'MANAGER', 'EMPLOYEE') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. Table: departments
-- Functional business divisions; incorporates manager_employee_id (FK to employees)
-- -----------------------------------------------------------------------------
CREATE TABLE departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    manager_employee_id BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. Table: employees
-- Staff member profiles linked to user accounts and departments
-- -----------------------------------------------------------------------------
CREATE TABLE employees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_code VARCHAR(20) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    designation VARCHAR(100) NOT NULL,
    department_id BIGINT NOT NULL,
    joining_date DATE NOT NULL,
    employment_status ENUM('ACTIVE', 'ON_NOTICE', 'TRANSFERRED', 'RESIGNED', 'ON_LEAVE') DEFAULT 'ACTIVE',
    user_id BIGINT UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_emp_department FOREIGN KEY (department_id) 
        REFERENCES departments(id) ON DELETE RESTRICT,
    CONSTRAINT fk_emp_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add deferred foreign key for departments.manager_employee_id -> employees.id
ALTER TABLE departments
    ADD CONSTRAINT fk_dept_manager FOREIGN KEY (manager_employee_id) 
        REFERENCES employees(id) ON DELETE SET NULL;

-- -----------------------------------------------------------------------------
-- 4. Table: handovers
-- Root workflow transition records between outgoing staff and successors
-- -----------------------------------------------------------------------------
CREATE TABLE handovers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    handover_code VARCHAR(30) NOT NULL UNIQUE,
    from_employee_id BIGINT NOT NULL,
    to_employee_id BIGINT NOT NULL,
    department_id BIGINT NOT NULL,
    reason ENUM('RESIGNATION', 'DEPARTMENT_TRANSFER', 'EXTENDED_LEAVE', 'ROLE_CHANGE', 'OTHER') NOT NULL,
    description TEXT NOT NULL,
    additional_notes TEXT,
    last_working_date DATE NOT NULL,
    status ENUM('DRAFT', 'PENDING_MANAGER', 'PENDING_RECEIVER', 'CLARIFICATION_REQUESTED', 'REJECTED_BY_MANAGER', 'COMPLETED') DEFAULT 'DRAFT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_handover_from_emp FOREIGN KEY (from_employee_id) 
        REFERENCES employees(id) ON DELETE RESTRICT,
    CONSTRAINT fk_handover_to_emp FOREIGN KEY (to_employee_id) 
        REFERENCES employees(id) ON DELETE RESTRICT,
    CONSTRAINT fk_handover_dept FOREIGN KEY (department_id) 
        REFERENCES departments(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. Table: handover_tasks
-- Itemized responsibilities, documentation handoffs, and credential checklists
-- -----------------------------------------------------------------------------
CREATE TABLE handover_tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    handover_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    priority ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'MEDIUM',
    due_date DATE NOT NULL,
    task_status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED') DEFAULT 'PENDING',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tasks_handover FOREIGN KEY (handover_id) 
        REFERENCES handovers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. Table: handover_comments
-- Collaboration and clarification dialogue between staff, manager, and successor
-- -----------------------------------------------------------------------------
CREATE TABLE handover_comments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    handover_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comments_handover FOREIGN KEY (handover_id) 
        REFERENCES handovers(id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. Table: handover_history
-- Immutable audit trail tracking workflow lifecycle events
-- -----------------------------------------------------------------------------
CREATE TABLE handover_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    handover_id BIGINT NOT NULL,
    action VARCHAR(60) NOT NULL,
    description TEXT NOT NULL,
    performed_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_history_handover FOREIGN KEY (handover_id) 
        REFERENCES handovers(id) ON DELETE CASCADE,
    CONSTRAINT fk_history_user FOREIGN KEY (performed_by) 
        REFERENCES users(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indexing for high-performance dashboard aggregation and search
CREATE INDEX idx_emp_dept ON employees(department_id);
CREATE INDEX idx_handover_status ON handovers(status);
CREATE INDEX idx_handover_from ON handovers(from_employee_id);
CREATE INDEX idx_handover_to ON handovers(to_employee_id);
CREATE INDEX idx_tasks_handover ON handover_tasks(handover_id);
CREATE INDEX idx_tasks_status ON handover_tasks(task_status);
