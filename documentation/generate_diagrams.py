import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

output_dir = r"C:\Users\CORAL\.gemini\antigravity\scratch\employee-handover-system\documentation\diagrams"
os.makedirs(output_dir, exist_ok=True)

# ---------------------------------------------------------------------------
# 1. System Architecture Diagram
# ---------------------------------------------------------------------------
def create_architecture_diagram():
    fig, ax = plt.subplots(figsize=(10, 6), dpi=300)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 7)
    ax.axis('off')

    # Title
    ax.text(5, 6.6, "System Architecture: 3-Tier Enterprise Web Application", 
            ha='center', va='center', fontsize=14, fontweight='bold', color='#17232D')

    # Client Tier
    client_box = patches.FancyBboxPatch((0.5, 3.8), 2.5, 2.3, boxstyle="round,pad=0.2", 
                                        ec="#426B72", fc="#F5F6F4", lw=2)
    ax.add_patch(client_box)
    ax.text(1.75, 5.8, "Client Tier (Frontend)", ha='center', va='center', fontsize=11, fontweight='bold', color='#25364A')
    ax.text(1.75, 5.3, "• React 18 (SPA)\n• Vite Build Tool\n• Tailwind CSS Theme\n• Lucide Icons\n• Recharts Dashboard\n• Axios REST Client", 
            ha='center', va='center', fontsize=8.5, color='#263238')

    # Arrow 1
    ax.annotate("", xy=(3.8, 5.0), xytext=(2.9, 5.0),
                arrowprops=dict(arrowstyle="<->", color="#426B72", lw=2))
    ax.text(3.35, 5.3, "REST / JSON\nHTTP (CORS: 5173)", ha='center', va='center', fontsize=7.5, color='#426B72', fontweight='bold')

    # Application Tier
    app_box = patches.FancyBboxPatch((3.8, 1.2), 3.2, 4.9, boxstyle="round,pad=0.2", 
                                     ec="#25364A", fc="#FFFFFF", lw=2)
    ax.add_patch(app_box)
    ax.text(5.4, 5.8, "Application Tier (Spring Boot 3.x)", ha='center', va='center', fontsize=11, fontweight='bold', color='#25364A')

    # Layers inside Spring Boot
    layers = [
        ("REST Controllers Layer", "AuthController, EmployeeController,\nHandoverController, ReportController", 5.0, "#D7E2DF"),
        ("Service Business Logic", "AuthService, HandoverWorkflowService,\nTaskService, DashboardService", 3.8, "#E5E8E5"),
        ("Spring Data JPA / Hibernate", "JpaRepository interfaces,\nQuery Methods, ORM Entity Mapping", 2.6, "#D7E2DF"),
        ("Security & Configuration", "CorsConfig, ExceptionHandler,\nDataInitializer, Environment Props", 1.5, "#E5E8E5")
    ]
    for title, desc, y, col in layers:
        l_box = patches.FancyBboxPatch((4.0, y - 0.4), 2.8, 0.85, boxstyle="round,pad=0.1", 
                                       ec="#77818A", fc=col, lw=1)
        ax.add_patch(l_box)
        ax.text(5.4, y + 0.25, title, ha='center', va='center', fontsize=8.5, fontweight='bold', color='#25364A')
        ax.text(5.4, y - 0.08, desc, ha='center', va='center', fontsize=7, color='#263238')

    # Arrow 2
    ax.annotate("", xy=(7.7, 3.8), xytext=(6.9, 3.8),
                arrowprops=dict(arrowstyle="<->", color="#25364A", lw=2))
    ax.text(7.3, 4.15, "JDBC Driver\nTCP :3306", ha='center', va='center', fontsize=7.5, color='#25364A', fontweight='bold')

    # Database Tier
    db_box = patches.FancyBboxPatch((7.7, 2.2), 2.0, 3.2, boxstyle="round,pad=0.2", 
                                    ec="#10B981", fc="#F5F6F4", lw=2)
    ax.add_patch(db_box)
    ax.text(8.7, 5.1, "Database Tier\n(MySQL 8.0)", ha='center', va='center', fontsize=10.5, fontweight='bold', color='#065F46')
    ax.text(8.7, 3.8, "Database: `employee_handover`\n\n• users\n• departments\n• employees\n• handovers\n• handover_tasks\n• handover_comments\n• handover_history", 
            ha='center', va='center', fontsize=7.5, color='#263238')

    # Bottom notes
    ax.text(5, 0.4, "Figure 2.1: System Architecture of the Employee Handover & Transition System", 
            ha='center', va='center', fontsize=10, fontstyle='italic', color='#555555')

    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "architecture_diagram.png"), bbox_inches='tight')
    plt.close()

# ---------------------------------------------------------------------------
# 2. Use Case Diagram
# ---------------------------------------------------------------------------
def create_use_case_diagram():
    fig, ax = plt.subplots(figsize=(11, 7.5), dpi=300)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 9.5)
    ax.axis('off')

    ax.text(5.5, 9.1, "Use Case Diagram: Employee Handover & Transition System", 
            ha='center', va='center', fontsize=14, fontweight='bold', color='#17232D')

    # System boundary
    sys_box = patches.Rectangle((2.6, 0.8), 5.8, 7.9, linewidth=1.5, edgecolor='#25364A', facecolor='#FAFAFA', linestyle='--')
    ax.add_patch(sys_box)
    ax.text(5.5, 8.4, "Handover Transition Management System Boundary", ha='center', va='center', fontsize=10, fontweight='bold', color='#426B72')

    # Actors
    actors = [
        ("Employee\n(Outgoing / Successor)", 1.2, 5.5, '#25364A'),
        ("Manager\n(Department Lead)", 1.2, 2.5, '#426B72'),
        ("Admin\n(HR / System Admin)", 9.7, 4.5, '#065F46')
    ]

    for name, x, y, col in actors:
        # draw stick figure head and body
        circle = patches.Circle((x, y + 0.35), 0.22, ec=col, fc='#FFFFFF', lw=2)
        ax.add_patch(circle)
        ax.plot([x, x], [y + 0.13, y - 0.25], color=col, lw=2) # body
        ax.plot([x - 0.25, x + 0.25], [y, y], color=col, lw=2) # arms
        ax.plot([x, x - 0.2], [y - 0.25, y - 0.55], color=col, lw=2) # leg L
        ax.plot([x, x + 0.2], [y - 0.25, y - 0.55], color=col, lw=2) # leg R
        ax.text(x, y - 0.8, name, ha='center', va='top', fontsize=8.5, fontweight='bold', color=col)

    # Use cases
    use_cases = [
        ("Login & Profile Management", 5.5, 7.8),
        ("Create & Edit Handover Request", 4.3, 6.9),
        ("Itemize Tasks & Credentials Checklist", 4.3, 6.0),
        ("Save Draft / Submit for Manager Review", 4.3, 5.1),
        ("Review Department Transitions", 6.7, 4.4),
        ("Approve / Reject Handover with Reason", 4.3, 3.5),
        ("Review Incoming Duties & Accept Transfer", 4.3, 2.6),
        ("Request Handover Clarification", 4.3, 1.7),
        ("Manage Staff, Roles & Departments", 6.8, 6.8),
        ("Audit Workflow History & Post Comments", 6.8, 5.6),
        ("Generate Analytics & SLA Reports", 6.8, 2.8)
    ]

    uc_patches = {}
    for text, cx, cy in use_cases:
        ellipse = patches.Ellipse((cx, cy), 2.2, 0.6, ec='#426B72', fc='#FFFFFF', lw=1.5)
        ax.add_patch(ellipse)
        ax.text(cx, cy, text, ha='center', va='center', fontsize=7.2, color='#263238', weight='semibold')
        uc_patches[text] = (cx, cy)

    # Actor associations (Employee)
    emp_conns = [
        "Login & Profile Management", "Create & Edit Handover Request",
        "Itemize Tasks & Credentials Checklist", "Save Draft / Submit for Manager Review",
        "Review Incoming Duties & Accept Transfer", "Request Handover Clarification",
        "Audit Workflow History & Post Comments"
    ]
    for uc in emp_conns:
        cx, cy = uc_patches[uc]
        ax.plot([1.4, cx - 1.0], [5.5, cy], color='#77818A', lw=1, linestyle='-')

    # Actor associations (Manager)
    mgr_conns = [
        "Login & Profile Management", "Review Department Transitions",
        "Approve / Reject Handover with Reason", "Audit Workflow History & Post Comments",
        "Generate Analytics & SLA Reports"
    ]
    for uc in mgr_conns:
        cx, cy = uc_patches[uc]
        ax.plot([1.4, cx - 1.0], [2.5, cy], color='#426B72', lw=1, linestyle='-')

    # Actor associations (Admin)
    adm_conns = [
        "Login & Profile Management", "Manage Staff, Roles & Departments",
        "Review Department Transitions", "Generate Analytics & SLA Reports",
        "Audit Workflow History & Post Comments"
    ]
    for uc in adm_conns:
        cx, cy = uc_patches[uc]
        ax.plot([9.5, cx + 1.0], [4.5, cy], color='#065F46', lw=1, linestyle='-')

    ax.text(5.5, 0.3, "Figure 2.2: Use Case Diagram for the Employee Handover & Transition System", 
            ha='center', va='center', fontsize=10, fontstyle='italic', color='#555555')

    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "use_case_diagram.png"), bbox_inches='tight')
    plt.close()

# ---------------------------------------------------------------------------
# 3. UML Class Diagram
# ---------------------------------------------------------------------------
def create_class_diagram():
    fig, ax = plt.subplots(figsize=(11, 7.5), dpi=300)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 8.5)
    ax.axis('off')

    ax.text(5.5, 8.1, "UML Class Diagram: Core Domain Entities & Relationships", 
            ha='center', va='center', fontsize=13, fontweight='bold', color='#17232D')

    def draw_class(x, y, w, h, name, attrs, methods):
        # Header
        box = patches.Rectangle((x, y - h), w, h, ec='#25364A', fc='#FFFFFF', lw=1.5)
        ax.add_patch(box)
        header = patches.Rectangle((x, y - 0.45), w, 0.45, ec='#25364A', fc='#25364A', lw=1.5)
        ax.add_patch(header)
        ax.text(x + w/2, y - 0.23, name, ha='center', va='center', color='#FFFFFF', fontsize=8.5, fontweight='bold')
        
        # Attributes
        attr_text = "\n".join(attrs)
        ax.text(x + 0.1, y - 0.6, attr_text, ha='left', va='top', fontsize=6.8, color='#263238', family='monospace')
        
        # Line
        line_y = y - 0.55 - len(attrs)*0.16
        ax.plot([x, x + w], [line_y, line_y], color='#E5E8E5', lw=1)
        
        # Methods
        meth_text = "\n".join(methods)
        ax.text(x + 0.1, line_y - 0.1, meth_text, ha='left', va='top', fontsize=6.8, color='#426B72', family='monospace')

    # Draw classes
    draw_class(0.5, 7.3, 2.2, 2.2, "User", 
               ["- id: Long", "- username: String", "- email: String", "- password: String", "- role: Role"], 
               ["+ getRole(): Role", "+ getUsername()"])

    draw_class(3.4, 7.3, 2.5, 2.6, "Department", 
               ["- id: Long", "- departmentName: String", "- description: String", "- manager: Employee", "- createdAt: LocalDateTime"], 
               ["+ getManager(): Employee", "+ setManager(Employee)"])

    draw_class(6.8, 7.3, 2.7, 3.2, "Employee", 
               ["- id: Long", "- employeeCode: String", "- firstName: String", "- lastName: String", "- email: String", "- designation: String", "- department: Department", "- status: EmploymentStatus", "- user: User"], 
               ["+ getFullName(): String", "+ getDepartment()", "+ getUser(): User"])

    draw_class(3.8, 4.3, 3.2, 3.4, "Handover", 
               ["- id: Long", "- handoverCode: String", "- fromEmployee: Employee", "- toEmployee: Employee", "- department: Department", "- reason: HandoverReason", "- lastWorkingDate: LocalDate", "- status: HandoverStatus", "- tasks: List<HandoverTask>", "- comments: List<Comment>"], 
               ["+ addTask(HandoverTask)", "+ submit()", "+ approve()", "+ reject(reason)", "+ accept()"])

    draw_class(0.5, 3.4, 2.5, 2.4, "HandoverTask", 
               ["- id: Long", "- handover: Handover", "- title: String", "- priority: Priority", "- dueDate: LocalDate", "- status: TaskStatus"], 
               ["+ toggleStatus()", "+ getPriority()"])

    draw_class(7.8, 3.6, 2.6, 2.4, "HandoverHistory", 
               ["- id: Long", "- handover: Handover", "- action: String", "- description: String", "- performedBy: User", "- createdAt: LocalDateTime"], 
               ["+ logEvent()", "+ getAction()"])

    # Connection lines
    ax.annotate("", xy=(6.8, 6.2), xytext=(2.7, 6.2), arrowprops=dict(arrowstyle="->", color='#426B72', lw=1.2)) # User to Employee
    ax.annotate("", xy=(3.4, 6.5), xytext=(5.9, 6.5), arrowprops=dict(arrowstyle="->", color='#426B72', lw=1.2)) # Department to Employee
    ax.annotate("", xy=(5.4, 4.3), xytext=(7.5, 4.3), arrowprops=dict(arrowstyle="->", color='#25364A', lw=1.2)) # Handover to Employee
    ax.annotate("", xy=(3.8, 2.6), xytext=(3.0, 2.6), arrowprops=dict(arrowstyle="->", color='#25364A', lw=1.2)) # Handover to Task
    ax.annotate("", xy=(7.0, 2.6), xytext=(7.8, 2.6), arrowprops=dict(arrowstyle="->", color='#25364A', lw=1.2)) # Handover to History

    ax.text(5.5, 0.4, "Figure 2.3: UML Class Diagram depicting Domain Model and Associations", 
            ha='center', va='center', fontsize=10, fontstyle='italic', color='#555555')

    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "class_diagram.png"), bbox_inches='tight')
    plt.close()

# ---------------------------------------------------------------------------
# 4. Activity / Workflow Diagram
# ---------------------------------------------------------------------------
def create_activity_diagram():
    fig, ax = plt.subplots(figsize=(10, 7.5), dpi=300)
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 9.5)
    ax.axis('off')

    ax.text(5, 9.1, "Activity Diagram: Complete Transition Handover Lifecycle", 
            ha='center', va='center', fontsize=13, fontweight='bold', color='#17232D')

    # Lanes: Outgoing Employee, Manager, Successor
    ax.plot([3.3, 3.3], [1.0, 8.6], color='#E5E8E5', lw=1.5, linestyle=':')
    ax.plot([6.6, 6.6], [1.0, 8.6], color='#E5E8E5', lw=1.5, linestyle=':')

    ax.text(1.65, 8.5, "Outgoing Employee", ha='center', va='center', fontsize=10, fontweight='bold', color='#25364A')
    ax.text(5.0, 8.5, "Department Manager", ha='center', va='center', fontsize=10, fontweight='bold', color='#426B72')
    ax.text(8.3, 8.5, "Receiving Successor", ha='center', va='center', fontsize=10, fontweight='bold', color='#065F46')

    # Initial start
    start = patches.Circle((1.65, 7.9), 0.18, fc='#25364A', ec='#25364A')
    ax.add_patch(start)

    def draw_act(x, y, text, col='#FFFFFF', border='#25364A'):
        box = patches.FancyBboxPatch((x - 1.25, y - 0.3), 2.5, 0.6, boxstyle="round,pad=0.1", ec=border, fc=col, lw=1.2)
        ax.add_patch(box)
        ax.text(x, y, text, ha='center', va='center', fontsize=7.5, color='#263238', weight='semibold')

    def draw_decision(x, y, text):
        diamond = patches.Polygon([[x, y+0.35], [x+0.5, y], [x, y-0.35], [x-0.5, y]], ec='#F59E0B', fc='#FEF3C7', lw=1.2)
        ax.add_patch(diamond)
        ax.text(x, y, text, ha='center', va='center', fontsize=7, color='#92400E', weight='bold')

    draw_act(1.65, 7.1, "1. Create Handover & Itemize Tasks")
    draw_act(1.65, 5.9, "2. Save Draft or Submit\n(PENDING_MANAGER)")
    
    # Arrow down
    ax.annotate("", xy=(1.65, 6.25), xytext=(1.65, 6.8), arrowprops=dict(arrowstyle="->", color='#25364A', lw=1.2))
    # Arrow to Manager
    ax.annotate("", xy=(3.75, 5.9), xytext=(2.9, 5.9), arrowprops=dict(arrowstyle="->", color='#426B72', lw=1.2))

    draw_act(5.0, 5.9, "3. Manager Reviews\nTransferred Duties")
    draw_decision(5.0, 4.6, "Approved?")

    ax.annotate("", xy=(5.0, 4.95), xytext=(5.0, 5.55), arrowprops=dict(arrowstyle="->", color='#426B72', lw=1.2))
    
    # Manager Rejects
    draw_act(5.0, 3.4, "REJECTED_BY_MANAGER\n(Mandatory Reason)")
    ax.annotate("No", xy=(5.0, 3.75), xytext=(5.0, 4.25), arrowprops=dict(arrowstyle="->", color='#DC2626', lw=1.2))
    ax.annotate("", xy=(1.65, 5.55), xytext=(3.75, 3.4), arrowprops=dict(arrowstyle="->", color='#DC2626', lw=1.2, connectionstyle="arc3,rad=-0.2"))

    # Manager Approves
    ax.annotate("Yes", xy=(7.05, 4.6), xytext=(5.5, 4.6), arrowprops=dict(arrowstyle="->", color='#059669', lw=1.2))
    draw_act(8.3, 4.6, "4. Successor Reviews\n(PENDING_RECEIVER)")
    
    draw_decision(8.3, 3.2, "Accept?")
    ax.annotate("", xy=(8.3, 3.55), xytext=(8.3, 4.25), arrowprops=dict(arrowstyle="->", color='#065F46', lw=1.2))

    # Clarification
    draw_act(8.3, 1.9, "CLARIFICATION_REQUESTED\n(Requires Post Details)")
    ax.annotate("Clarify", xy=(8.3, 2.25), xytext=(8.3, 2.85), arrowprops=dict(arrowstyle="->", color='#F59E0B', lw=1.2))
    ax.annotate("Address & Resubmit", xy=(1.65, 6.5), xytext=(7.05, 1.9), 
                arrowprops=dict(arrowstyle="->", color='#F59E0B', lw=1.2, connectionstyle="arc3,rad=0.35"))

    # Accept / Complete
    draw_act(5.0, 1.9, "5. Handover Accepted\n(COMPLETED)", col='#D1FAE5', border='#059669')
    ax.annotate("Yes", xy=(6.25, 1.9), xytext=(7.8, 3.2), arrowprops=dict(arrowstyle="->", color='#059669', lw=1.2, connectionstyle="arc3,rad=0.2"))

    # Final end
    final_outer = patches.Circle((5.0, 0.9), 0.22, ec='#059669', fc='#FFFFFF', lw=2)
    final_inner = patches.Circle((5.0, 0.9), 0.14, ec='#059669', fc='#059669')
    ax.add_patch(final_outer)
    ax.add_patch(final_inner)
    ax.annotate("", xy=(5.0, 1.15), xytext=(5.0, 1.55), arrowprops=dict(arrowstyle="->", color='#059669', lw=1.2))

    ax.text(5, 0.3, "Figure 2.4: Activity Diagram illustrating the Multi-Tier Handover & Transition Workflow", 
            ha='center', va='center', fontsize=10, fontstyle='italic', color='#555555')

    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "activity_diagram.png"), bbox_inches='tight')
    plt.close()

# ---------------------------------------------------------------------------
# 5. Entity-Relationship (ER) Diagram
# ---------------------------------------------------------------------------
def create_er_diagram():
    fig, ax = plt.subplots(figsize=(11, 7.5), dpi=300)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 8.5)
    ax.axis('off')

    ax.text(5.5, 8.1, "Entity-Relationship (ER) Diagram: Relational Database Schema", 
            ha='center', va='center', fontsize=13, fontweight='bold', color='#17232D')

    def draw_entity(x, y, w, h, name, fields):
        box = patches.Rectangle((x, y - h), w, h, ec='#25364A', fc='#FFFFFF', lw=1.5)
        ax.add_patch(box)
        header = patches.Rectangle((x, y - 0.4), w, 0.4, ec='#25364A', fc='#25364A', lw=1.5)
        ax.add_patch(header)
        ax.text(x + w/2, y - 0.2, name, ha='center', va='center', color='#FFFFFF', fontsize=8, fontweight='bold')
        
        field_text = "\n".join(fields)
        ax.text(x + 0.1, y - 0.55, field_text, ha='left', va='top', fontsize=6.8, color='#263238', family='monospace')

    draw_entity(0.5, 7.2, 2.2, 1.9, "users", 
                ["PK id: BIGINT", "UK username: VARCHAR", "UK email: VARCHAR", "   password: VARCHAR", "   role: ENUM"])

    draw_entity(3.4, 7.2, 2.5, 2.1, "departments", 
                ["PK id: BIGINT", "UK department_name", "   description: TEXT", "FK manager_employee_id", "   created_at: TIMESTAMP"])

    draw_entity(6.8, 7.2, 2.6, 2.6, "employees", 
                ["PK id: BIGINT", "UK employee_code", "   first_name, last_name", "UK email: VARCHAR", "   designation: VARCHAR", "FK department_id", "FK user_id", "   employment_status"])

    draw_entity(3.5, 4.3, 3.2, 2.6, "handovers", 
                ["PK id: BIGINT", "UK handover_code", "FK from_employee_id", "FK to_employee_id", "FK department_id", "   reason, description", "   last_working_date", "   status: ENUM"])

    draw_entity(0.5, 3.6, 2.4, 2.2, "handover_tasks", 
                ["PK id: BIGINT", "FK handover_id", "   title: VARCHAR", "   priority: ENUM", "   due_date: DATE", "   task_status: ENUM"])

    draw_entity(7.6, 3.6, 2.6, 2.0, "handover_history", 
                ["PK id: BIGINT", "FK handover_id", "   action: VARCHAR", "   description: TEXT", "FK performed_by: BIGINT", "   created_at: TIMESTAMP"])

    draw_entity(4.0, 1.3, 2.6, 1.8, "handover_comments", 
                ["PK id: BIGINT", "FK handover_id", "FK user_id: BIGINT", "   comment: TEXT", "   created_at: TIMESTAMP"])

    # Relationships Lines
    ax.plot([2.7, 6.8], [6.8, 6.8], color='#426B72', lw=1.2, linestyle='-') # user -> emp
    ax.text(4.8, 6.9, "1 : 0..1", fontsize=7, color='#426B72', fontweight='bold')

    ax.plot([5.9, 6.8], [6.3, 6.3], color='#426B72', lw=1.2, linestyle='-') # dept -> emp
    ax.text(6.3, 6.4, "1 : N", fontsize=7, color='#426B72', fontweight='bold')

    ax.plot([5.1, 7.5], [4.3, 4.6], color='#25364A', lw=1.2, linestyle='-') # handover -> emp
    ax.text(6.4, 4.6, "N : 1", fontsize=7, color='#25364A', fontweight='bold')

    ax.plot([2.9, 3.5], [2.8, 3.0], color='#25364A', lw=1.2, linestyle='-') # handover -> tasks
    ax.text(3.1, 3.0, "1 : N", fontsize=7, color='#25364A', fontweight='bold')

    ax.plot([6.7, 7.6], [3.0, 3.0], color='#25364A', lw=1.2, linestyle='-') # handover -> history
    ax.text(7.1, 3.1, "1 : N", fontsize=7, color='#25364A', fontweight='bold')

    ax.plot([5.1, 5.1], [1.7, 1.3], color='#25364A', lw=1.2, linestyle='-') # handover -> comments
    ax.text(5.2, 1.5, "1 : N", fontsize=7, color='#25364A', fontweight='bold')

    ax.text(5.5, 0.2, "Figure 2.5: Entity-Relationship Diagram depicting MySQL Relational Schema", 
            ha='center', va='center', fontsize=10, fontstyle='italic', color='#555555')

    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "er_diagram.png"), bbox_inches='tight')
    plt.close()

if __name__ == '__main__':
    create_architecture_diagram()
    create_use_case_diagram()
    create_class_diagram()
    create_activity_diagram()
    create_er_diagram()
    print("All 5 diagrams successfully generated in:", output_dir)
