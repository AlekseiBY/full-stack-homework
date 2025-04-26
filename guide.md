# 1. **General Setup Guide**

Clone the repo first.
---

## Installation & Setup

1. **Clone the project**

```bash
git clone ...
cd ...
```

2. **Install Node.js version**

I use **Node.js 18** with **pnpm** for package management.

1. **Install pnpm**

```bash
npm install -g pnpm
```

4. **Install project dependencies**

```bash
pnpm install
```

5. **Create .env and .env.test based on the example files**

---

## Docker Setup

I use **Docker** for database and app containers:

- PostgreSQL (`db`)
- Test PostgreSQL (`test-db`)
- App (`web`)
- Test App (`web-test`)
- Test runner (`test-runner`)

Make sure you have Docker and Docker Compose installed.

5. **Start all services (including DBs, apps, tests)**

```bash
docker-compose up --build
```

This will:
- Build all Docker containers
- Start `web` server (development app)
- Start `web-test` server (for running isolated tests)
- Launch a test-runner container that automatically runs tests

---

## Access the App

- Main app (frontend + API): [http://localhost:3000](http://localhost:3000)
- Numbers page: `/numbers`
- Grades page: `/grades`

---


# 2. **Key Decisions and Design Choices**

Throughout the build, here are **important decisions** we made and **why**:

| Decision | Reason |
|:---------|:-------|
| Use pnpm | default |
| Use Docker Compose | Standardize database and app environments |
| Use **two DBs**: db and test-db | Avoid production data corruption during testing |
| Add **web-test** app | So that tests target an isolated test server, not production |
| API Routes in Next.js | Easier lightweight API building inside frontend |
| Use Material UI (MUI) for UI components | Suggested |
| Implement frontend **input validation** | Avoid sending bad data from forms |
| Implement backend **input validation** | Double-check and protect the database |
| Error boundaries and Suspense | Handle loading/error states gracefully in React 18 |


**Generally speaking, preferred simplicity wherever possible. The aim was to make a simple example app, not necessarily the most scalable one.**