# 🚀 ASTU MSJ Summer Bootcamp Management System

A **MERN stack web-based platform** designed to centralize bootcamp management for admins, mentors, and students.  
This project replaces manual spreadsheets, paper attendance sheets, and scattered chat messages with a single, secure, and scalable system.

---

## 📌 Project Overview
The Bootcamp Management System manages:
- Applications & registration workflow
- Students, mentors, and admins (RBAC enforced)
- Attendance tracking & percentage calculation
- Student progress monitoring
- Assignments, submissions, grading, and feedback
- Announcements & notifications (year/role targeting)
- Direct communication (restricted mentor ↔ student, mentor ↔ admin)
- Resource sharing & weekly schedules
- Role-specific dashboards

---

## 🎯 Objectives
- Centralize bootcamp operations in one system
- Secure application intake & credential delivery
- Provide structured dashboards for each role
- Automate attendance & progress tracking
- Streamline assignment submission & grading
- Ensure secure communication & resource sharing
- Deploy a professional MERN stack solution within 3 weeks

---

## 👥 Team Members

### Backend Developers
- **Musa Abdusamed**
- **Salim Mohammed**
- **Awel Surur**

### Frontend Developers
- **Nafyad Aman**
- **Hanif Ismael**
- **Mahfuz**

---

## 🛠️ Tech Stack
- **Frontend:** React.js, React Router, Tailwind CSS, Axios
- **Backend:** Node.js, Express.js, JWT, bcrypt, Nodemailer
- **Database:** MongoDB + Mongoose
- **Architecture:** REST API, Modular controllers & middleware
- **Deployment:** Vercel (frontend), Render (backend)

---

## 📂 Core Features
- **Application Workflow:** Admin-reviewed intake, secure credential delivery
- **Authentication:** JWT, bcrypt, forced first-login credential change
- **Attendance:** Present/Absent/Late/Excused with auto-percentage calculation
- **Progress Tracking:** Topic/module-based statuses
- **Assignments:** Create, submit, grade, feedback loop
- **Announcements:** Role/year/batch targeting
- **Messaging:** Restricted mentor ↔ student, mentor ↔ admin
- **Resources & Schedule:** Mentor resources + Admin weekly curriculum
- **Dashboards:** Role-specific insights for Admin, Mentor, Student

---

## ⚙️ Constraints
- **Timeline:** 3 weeks (foundation → core features → polish & deployment)
- **Security:** User IDs immutable, credentials delivered securely
- **RBAC Enforcement:** Strict backend authorization middleware
- **Scalability:** Must support multiple batches & cohort years
- **Maintainability:** Modular, reusable codebase with centralized error handling
- **Responsiveness:** Works on desktop, tablet, and mobile

---

## 🧩 Challenges Faced
- Designing a **secure application workflow** (reject deletes data, accept provisions accounts)
- Implementing **immutable User IDs** with year-based sequences
- Enforcing **restricted communication rules** at the backend level
- Handling **attendance automation** and percentage calculations
- Managing **mentor–student assignment rules** (every mentor must have ≥1 student)
- Delivering **credential emails securely** via SMTP/Nodemailer
- Coordinating **frontend-backend integration** across a distributed team
- Ensuring **deployment stability** on Vercel & Render within the timeline

---

## 📅 Development Plan
### Week 1: Foundation
- Project setup, database design
- Application form & review flow
- User ID generation
- Credential email delivery
- Authentication (JWT, RBAC, first-login change)
- Admin user management

### Week 2: Core Features
- Attendance management
- Progress tracker
- Assignment submission & grading
- Messaging system
- Resource sharing & weekly schedule

### Week 3: Polish & Launch
- Announcements with year targeting
- Dashboards (Admin, Mentor, Student)
- Landing page
- Testing & bug fixes
- Deployment

---

## 🎥 Live Demo Preparation
To ensure a smooth demo:
1. **Demo Accounts**
   - Prepare sample Admin, Mentor, and Student accounts with preloaded data.
   - Show application intake → Admin acceptance → credential delivery → first login flow.

2. **Feature Walkthrough**
   - Admin: Review applications, assign mentors, publish announcements.
   - Mentor: Mark attendance, grade assignments, share resources.
   - Student: Submit assignments, view progress, receive announcements.

3. **Dashboards**
   - Highlight role-specific dashboards with real-time data.

4. **Messaging**
   - Demonstrate restricted communication (student ↔ mentor, mentor ↔ admin).

5. **Deployment**
   - Ensure frontend is live on **Vercel** and backend on **Render**.
   - Test responsiveness on desktop and mobile.

6. **Backup Plan**
   - Keep screenshots and short video clips ready in case of internet or deployment issues.

---

## 📜 License
This project is developed as part of the **ASTU MSJ Summer Bootcamp Final Project**.  
Feel free to extend and adapt for future cohorts.

---

### 💡 Quote
> “Code is like art — every line should have purpose and beauty.”
