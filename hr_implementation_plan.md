# Quantum Blaze ERP — HR Management Module
## Implementation Plan · Task 27 → Task 43

### HR MODULE GLOBAL DESIGN SYSTEM

#### Extended ID Engine — HR Entities
- EMP-[Dept]-YY-Seq     →  EMP-ENG-26-001     (Employees)
- INT-YY-Seq            →  INT-26-047         (Interview Records)
- JOB-[Dept]-YY-Seq     →  JOB-ENG-26-012     (Job Openings)
- CND-YY-Seq            →  CND-26-089         (Candidates)
- LEV-[EMP]-Seq         →  LEV-EMP-ENG-26-001-014  (Leave Requests)
- ATT-[EMP]-YYYYMMDD    →  ATT-EMP-ENG-26-001-20260507  (Attendance)
- SHF-[Dept]-YY-Seq     →  SHF-ENG-26-007     (Shifts)
- PAY-[EMP]-YYMM        →  PAY-EMP-ENG-26-001-2605  (Payroll Records)
- ONB-[EMP]-Seq         →  ONB-EMP-ENG-26-001-01    (Onboarding Plans)
- DOC-[EMP]-Seq         →  DOC-EMP-ENG-26-001-003   (Employee Documents)
- SKL-[EMP]-Seq         →  SKL-EMP-ENG-26-001-007   (Skill Entries)

#### HR-Specific Color Tokens
- DEPT_ENGINEERING:   #3B82F6  / #EFF6FF
- DEPT_FINANCE:       #F59E0B  / #FFFBEB
- DEPT_DESIGN:        #8B5CF6  / #F5F3FF
- DEPT_MARKETING:     #EC4899  / #FDF2F8
- DEPT_OPERATIONS:    #10B981  / #ECFDF5
- DEPT_HR:            #06B6D4  / #ECFEFF
- DEPT_SALES:         #EF4444  / #FEF2F2

---

### Phase 1: Foundation & Command Center
- **Task 27**: HR Command Center Dashboard (KPI Tiles, Charts, Activity Feed)
- **Task 28**: ATS: Job Listings & Recruitment Pipeline (Kanban + Table)
- **Task 29**: ATS: Candidate Profile & Interview Scorecard (Evaluation Forms)
- **Task 30**: ATS: Interview Scheduling & HR Calendar (Availability Panel)

### Phase 2: Employee Lifecycle
- **Task 31**: Employee Onboarding Hub (Checklists, IT Provisioning)
- **Task 32**: Core Employee Profile (Full 360° View - Personal, Employment, Compensation)
- **Task 33**: Employee Directory & Org Chart (D3 Hierarchy)
- **Task 34**: Skills Mapping & Career Growth Tracker (Radar Charts, Timeline)

### Phase 3: Time & Attendance
- **Task 35**: Attendance Dashboard & Time Tracking (Heatmaps, Logs)
- **Task 36**: Shift Management (Weekly Grid, Drag & Drop)
- **Task 37**: Leave Management: Policy Configuration (Rules Engine)
- **Task 38**: Leave Management: Request, Approval & Balances (Employee Portal)
- **Task 39**: Leave Calendar & Team View (Availability Visibility)

### Phase 4: Financial & Payroll
- **Task 40**: Payroll: Salary Structure Configuration (Earnings, Deductions, Sri Lanka PAYE)
- **Task 41**: Payroll: Monthly Payroll Run (Computation, Review, Approval)
- **Task 42**: Payslip Generator & Employee Self-Service View (PDF Generation)
