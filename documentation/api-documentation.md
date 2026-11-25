# REST API Documentation

## System: Employee Responsibility Handover & Transition Management System
**Base URL**: `http://localhost:8080/api`  
**Content-Type**: `application/json`

---

## 1. Authentication Endpoints

### 1.1 POST `/api/auth/login`
Validates credentials against the MySQL `users` table and returns session profile information.

**Request Body**:
```json
{
  "username": "sarah",
  "password": "sarah123"
}
```

**Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "id": 3,
    "username": "sarah",
    "email": "s.jenkins@organization.com",
    "fullName": "Sarah Jenkins",
    "role": "EMPLOYEE",
    "employeeId": 102,
    "designation": "Senior Lead Engineer",
    "department": "Engineering"
  },
  "timestamp": "2026-10-31T01:10:00"
}
```

**Error Response (400 Bad Request)**:
```json
{
  "success": false,
  "message": "Invalid password. Please check your credentials",
  "data": null,
  "timestamp": "2026-10-31T01:10:00"
}
```

---

## 2. Employee Management Endpoints

### 2.1 GET `/api/employees`
Lists employees with optional keyword search, department filter, and status filter.

**Query Parameters**:
* `search` (optional): Filter by name, code, email, or designation
* `departmentId` (optional): Filter by department ID
* `status` (optional): Filter by status (`ACTIVE`, `ON_NOTICE`, `TRANSFERRED`, `RESIGNED`, `ON_LEAVE`)

**Success Response (200 OK)**:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": [
    {
      "id": 102,
      "employeeCode": "EMP-102",
      "firstName": "Sarah",
      "lastName": "Jenkins",
      "fullName": "Sarah Jenkins",
      "email": "s.jenkins@organization.com",
      "phone": "+1 (555) 876-5432",
      "designation": "Senior Lead Engineer",
      "departmentId": 1,
      "departmentName": "Engineering",
      "joiningDate": "2022-06-01",
      "employmentStatus": "ON_NOTICE",
      "userId": 3,
      "username": "sarah",
      "role": "EMPLOYEE",
      "createdAt": "2026-10-28T10:00:00"
    }
  ]
}
```

### 2.2 POST `/api/employees`
Creates a staff profile, optionally creating and linking a system login account simultaneously.

**Request Body**:
```json
{
  "employeeCode": "EMP-108",
  "firstName": "Priya",
  "lastName": "Sharma",
  "email": "p.sharma@organization.com",
  "phone": "+1 (555) 901-2345",
  "designation": "QA Automation Lead",
  "departmentId": 1,
  "joiningDate": "2023-02-01",
  "employmentStatus": "ACTIVE",
  "createLoginAccount": true,
  "username": "priya",
  "password": "priya123",
  "role": "EMPLOYEE"
}
```

---

## 3. Department Management Endpoints

### 3.1 GET `/api/departments`
Returns all organizational departments along with the assigned manager and employee counts.

### 3.2 POST `/api/departments`
Creates a new department division with an assigned department manager.

**Request Body**:
```json
{
  "departmentName": "Information Security",
  "description": "Enterprise compliance, cloud security posture and audits.",
  "managerEmployeeId": 101
}
```

---

## 4. Handover Transition Lifecycle Endpoints

### 4.1 POST `/api/handovers`
Initiates a new transition request with embedded initial responsibilities.

**Request Body**:
```json
{
  "fromEmployeeId": 102,
  "toEmployeeId": 103,
  "departmentId": 1,
  "reason": "RESIGNATION",
  "description": "Transferring AWS credentials, CI/CD pipeline and microservices ownership.",
  "additionalNotes": "Critical credentials staged in 1Password engineering vault.",
  "lastWorkingDate": "2026-11-15",
  "status": "PENDING_MANAGER",
  "tasks": [
    {
      "title": "Transfer AWS Root Production Credentials",
      "description": "Verify IAM permissions and provision keys for David.",
      "priority": "HIGH",
      "dueDate": "2026-11-05",
      "taskStatus": "PENDING",
      "notes": "Coordinate with Infosec."
    }
  ]
}
```

### 4.2 POST `/api/handovers/{id}/submit`
Submits a `DRAFT` or resubmits a `CLARIFICATION_REQUESTED` handover for department manager review (`PENDING_MANAGER`).

### 4.3 POST `/api/handovers/{id}/approve`
Manager authorizes the handover transition (`PENDING_RECEIVER`).

### 4.4 POST `/api/handovers/{id}/reject`
Manager rejects the handover transition with a mandatory reason (`REJECTED_BY_MANAGER`).

**Request Body**:
```json
{
  "reason": "Please include client data pipeline runbooks before approval."
}
```

### 4.5 POST `/api/handovers/{id}/accept`
Successor confirms receipt and accepts all responsibilities (`COMPLETED`).

### 4.6 POST `/api/handovers/{id}/clarification`
Successor requests clarification or additional knowledge transfer (`CLARIFICATION_REQUESTED`).

**Request Body**:
```json
{
  "comment": "Can you provide the SSH bastion host bastion.prod.org public key setup steps?"
}
```

---

## 5. Dashboard & Analytics Endpoints

* `GET /api/dashboard/admin`: Overview metrics, department throughput, status breakdown, and recent handovers.
* `GET /api/dashboard/manager?managerEmployeeId={id}`: Action inbox for manager review, pending approvals, and upcoming milestones.
* `GET /api/dashboard/employee?employeeId={id}`: Outgoing transition progress and incoming responsibility transfers.
* `GET /api/reports/summary`: Aggregate completion rates and SLA metrics.
* `GET /api/reports/departments`: Division breakdown for audits.
* `GET /api/reports/monthly`: Monthly transition volume trends.
