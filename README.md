# Jobino — Job Board Platform

> A full-stack job board platform built with Next.js, TypeScript, Prisma, Better Auth, and PostgreSQL.

Jobino is a full-stack job board application designed around realistic hiring workflows between **job seekers** and **employers**.

The project focuses not only on UI implementation, but also on authentication, authorization, database relationships, validation, file uploads, search, testing, accessibility, and reliable end-to-end workflows.

---

## ✨ Features

### 👤 Authentication & Roles

* User registration and authentication
* Separate **Candidate** and **Employer** roles
* Role-based access control
* Protected dashboard routes
* Session-based authentication with Better Auth
* Ownership checks for employer resources

### 💼 Job Management

Employers can:

* Create job listings
* Edit existing jobs
* Manage published jobs
* View applicants
* Review candidate applications
* Update application statuses

Candidates can:

* Browse available jobs
* Search and filter jobs
* View detailed job information
* Apply to jobs
* Withdraw applications
* Save jobs for later
* Track application status

### 📄 Applications & Resumes

* Cover letter support
* Application status workflow
* Resume upload support
* PDF resume validation
* Secure file URL handling
* Candidate application history

Application workflow:

```text
PENDING
   ↓
REVIEWED
   ↓
ACCEPTED
```

Candidates can also withdraw an application when the current status allows it.

### 🔎 Search & Filtering

Job search supports:

* Keyword search
* Location filtering
* Remote-work filtering
* Salary filtering
* Pagination
* Persian text normalization

The search implementation handles Persian text variations such as:

* نیم‌فاصله
* فاصله معمولی
* ZWNJ variants

This makes search more reliable for Persian job titles and descriptions.

### 🛡️ Validation & Security

The application uses server-side validation and authorization checks throughout the main workflows.

Implemented protections include:

* Zod schema validation
* Role-based authorization
* Resource ownership checks
* HTTP/HTTPS URL validation
* Protection against unsafe URL schemes
* Safe JSON-LD generation
* Database uniqueness constraints
* Handling Prisma unique-constraint conflicts
* Protected E2E cleanup endpoint
* Rate-limit control for automated E2E execution

### 🧪 Testing

Jobino uses two testing layers.

#### Unit Tests — Vitest

Unit tests cover pure application logic including:

* Salary formatting
* Relative date formatting
* Remote type labels
* Persian search normalization
* Search filter parsing
* Salary range matching
* Job validation
* Application validation
* Application status validation
* URL validation

Current unit-test coverage includes **62 tests**.

#### End-to-End Tests — Playwright

The E2E suite tests a realistic hiring workflow:

```text
Register Employer
       ↓
Register Candidate
       ↓
Create Jobs
       ↓
Apply to Jobs
       ↓
Save / Withdraw
       ↓
Review Application
       ↓
Accept Application
       ↓
Verify Candidate Status
```

The E2E environment also includes automatic cleanup of test records.

---

## 🧰 Tech Stack

### Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS
* Lucide React
* Vazirmatn / Persian font support

### Backend

* Next.js server-side architecture
* Prisma ORM
* PostgreSQL
* Better Auth
* Zod

### Testing & Code Quality

* Vitest
* Playwright
* ESLint
* TypeScript
* Husky
* lint-staged

---

## 🏗️ Architecture

The project follows a feature-oriented Next.js application structure.

```text
jobboard/
├── e2e/
│   ├── fixtures/
│   ├── global-teardown.ts
│   └── jobboard.spec.ts
│
├── prisma/
│   └── schema.prisma
│
├── public/
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── candidate/
│   │   ├── employer/
│   │   ├── jobs/
│   │   └── ...
│   │
│   ├── components/
│   ├── lib/
│   └── ...
│
├── middleware.ts
├── next.config.ts
├── playwright.config.ts
├── prisma.config.ts
├── vitest.config.ts
└── package.json
```

---

## 🔄 Main User Flows

### Candidate Flow

```text
Register
  ↓
Candidate Dashboard
  ↓
Browse Jobs
  ↓
Search / Filter
  ↓
View Job
  ↓
Apply
  ↓
Track Application
  ↓
Accepted / Rejected / Withdrawn
```

### Employer Flow

```text
Register
  ↓
Employer Dashboard
  ↓
Create Job
  ↓
Manage Jobs
  ↓
View Applicants
  ↓
Review Application
  ↓
Update Status
```

---

## 🗄️ Database

Prisma is used as the ORM for database access and relational data management.

The application models core entities such as:

* Users
* Sessions
* Jobs
* Applications
* Saved Jobs
* Candidate profiles
* Company profiles

Database-level constraints are used alongside application validation to maintain data integrity.

For example, duplicate applications are handled both through validation logic and database uniqueness constraints.

---

## 📁 Resume Upload

Jobino supports resume uploads through Vercel Blob.

The upload flow includes:

1. File type validation
2. File size validation
3. Upload to Blob storage
4. Secure URL handling
5. Association with the candidate application

The E2E suite also supports testing resume uploads when the required Blob environment variable is available.

---

## ♿ Accessibility

The UI has been reviewed with accessibility in mind, including:

* Semantic HTML
* Accessible form labels
* Keyboard navigation
* Focus states
* Button states
* Error messaging
* Loading states
* Empty states
* Accessible interactive elements

---

## 🔍 SEO

The application includes:

* Dynamic metadata
* Sitemap
* Robots configuration
* Job structured data
* JSON-LD generation for job pages

Job structured data is generated carefully to avoid unsafe content being injected into the page.

---

## ⚡ Error & Loading States

Important application states are handled explicitly:

* Loading states
* Empty states
* Form validation errors
* Application errors
* Authentication errors
* Not-found states
* Server errors

The goal is to avoid leaving users with ambiguous or broken UI states.

---

## 🧪 Running Tests

### Unit Tests

```bash
npm run test:unit
```

### End-to-End Tests

```bash
npm run test:e2e
```

### Lint

```bash
npm run lint
```

### Type Check

```bash
npx tsc --noEmit
```

> Make sure the local database and required environment variables are configured before running the E2E suite.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mina-gharzi/jobboard.git

cd jobboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file based on the required project environment variables.

Typical configuration includes database and authentication settings.

### 4. Prepare the database

Run the required Prisma database setup for your local environment.

```bash
npx prisma generate
```

Then apply the Prisma schema to your configured database.

### 5. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🧹 Code Quality

The project uses:

* ESLint for static analysis
* TypeScript for type safety
* Husky for Git hooks
* lint-staged for checking staged TypeScript files

This helps keep the codebase consistent and catch issues before commits.

---

## 🎯 Project Goals

Jobino was built as a portfolio-grade full-stack application with emphasis on:

* Real-world user flows
* Type-safe development
* Secure authentication
* Database integrity
* Server-side validation
* Practical testing
* Accessibility
* SEO
* Maintainable architecture
* Production-oriented UX

Rather than focusing only on visual implementation, the project demonstrates how a complete web application can be designed across the **frontend, backend, database, authentication, validation, and testing layers**.

---

## 📌 Future Improvements

Possible future improvements include:

* Expanded automated coverage for server actions
* More comprehensive file-upload test coverage
* Additional performance optimizations
* CI-based automated test execution
* Further production monitoring and observability

---

## 👩‍💻 Author

**Mina Gharzi**

Frontend Developer

GitHub:

https://github.com/mina-gharzi
