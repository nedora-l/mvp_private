# Ticket

## Jira Projects Management MVP – Frontend & BFF (Mock) Implementation

### 1. Objective

Build an MVP for integrated Jira projects management inside the DAWS app (projects). This MVP will use mock data and BFF (Next.js API routes) to simulate backend responses, preparing for future integration with the real Spring Boot backend.

---

### 2. App Structure Overview

**Location:**  
projects

**Key Folders/Files to Create:**

- projects
  - `index.tsx` (Projects dashboard)
  - `jira/` (Jira integration pages)
    - `index.tsx` (Jira projects list)
    - `[projectId]/` (Single Jira project)
      - `index.tsx` (Project overview)
      - `issues/` (Issues list)
        - `index.tsx`
        - `[issueId]/index.tsx` (Issue details)
      - `board/` (Kanban/Scrum board)
        - `index.tsx`
      - `sprints/`
        - `index.tsx` (Sprints list)
        - `[sprintId]/index.tsx` (Sprint details)
      - `settings/index.tsx` (Project settings)
  - `components/jira/` (Reusable Jira UI components)
    - `ProjectCard.tsx`
    - `IssueList.tsx`
    - `IssueCard.tsx`
    - `Board.tsx`
    - `SprintList.tsx`
    - `SprintCard.tsx`
    - `JiraStatusBadge.tsx`
    - `JiraUserAvatar.tsx`
    - `JiraProjectSettingsForm.tsx`
  - `api/jira/` (BFF API routes for mock data)
    - `projects/`
      - `route.ts` (GET: list projects, POST: create project)
      - `[projectId]/route.ts` (GET: project details, PATCH: update, DELETE: remove)
      - `[projectId]/issues/route.ts` (GET: list issues, POST: create issue)
      - `[projectId]/issues/[issueId]/route.ts` (GET: issue details, PATCH, DELETE)
      - `[projectId]/board/route.ts` (GET: board data)
      - `[projectId]/sprints/route.ts` (GET: sprints, POST: create sprint)
      - `[projectId]/sprints/[sprintId]/route.ts` (GET: sprint details, PATCH, DELETE)
      - `[projectId]/settings/route.ts` (GET/POST project settings)

---

### 3. Pages & Components to Implement

#### a. Pages

- **Jira Projects List:**  
  `/apps/projects/jira`  
  - List all Jira projects (mocked)
  - Button to create new project

- **Jira Project Overview:**  
  `/apps/projects/jira/[projectId]`  
  - Project summary, team, stats, quick links

- **Issues List:**  
  `/apps/projects/jira/[projectId]/issues`  
  - Table/list of issues (filter, search, status, assignee)
  - Button to create new issue

- **Issue Details:**  
  `/apps/projects/jira/[projectId]/issues/[issueId]`  
  - Full issue view: description, comments, status, history

- **Board (Kanban/Scrum):**  
  `/apps/projects/jira/[projectId]/board`  
  - Drag-and-drop columns for issue statuses

- **Sprints:**  
  `/apps/projects/jira/[projectId]/sprints`  
  - List of sprints, create new sprint

- **Sprint Details:**  
  `/apps/projects/jira/[projectId]/sprints/[sprintId]`  
  - Sprint backlog, progress, issues

- **Project Settings:**  
  `/apps/projects/jira/[projectId]/settings`  
  - Edit project info, team, permissions

#### b. Components

- **ProjectCard** – Card for project summary
- **IssueList** – List/table of issues
- **IssueCard** – Card for single issue (for board)
- **Board** – Kanban/Scrum board UI
- **SprintList/SprintCard** – Sprint overviews
- **JiraStatusBadge** – Status indicator
- **JiraUserAvatar** – User/assignee avatar
- **JiraProjectSettingsForm** – Project settings form

---

### 4. BFF (API Routes) – Mock Data

- All API routes under `/api/jira/` should return mock data (JSON) matching Jira’s REST API structure.
- Use TypeScript interfaces for:
  - Project
  - Issue
  - Sprint
  - Board
  - User
  - Comment
- Each route should support GET (fetch), POST (create), PATCH (update), DELETE (remove) as appropriate.
- Example:  
  - `GET /api/jira/projects` → list of projects  
  - `GET /api/jira/projects/[projectId]/issues` → issues for a project  
  - `POST /api/jira/projects/[projectId]/issues` → create new issue

---

### 5. API Contracts (to be expected from real backend)

- Document the expected shape of responses for each endpoint (see [Jira Cloud REST API docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/)).
- Example:
  - **Project:** `{ id, key, name, lead, description, ... }`
  - **Issue:** `{ id, key, summary, description, status, assignee, reporter, comments, ... }`
  - **Sprint:** `{ id, name, state, startDate, endDate, issues, ... }`
  - **Board:** `{ id, name, type, columns, ... }`

---

### 6. Future Integration Notes

- All data fetching should be via the BFF API routes, so switching to the real backend is just a matter of updating the API route implementations.
- Keep all mock data and logic in the API routes for easy replacement.
- Use environment variables or config to toggle between mock and real backend in the future.

---

### 7. UI/UX Guidelines

- Follow existing DAWS design system (Tailwind, component patterns)
- Responsive: desktop and mobile
- Accessibility: ARIA, keyboard navigation
- Internationalization: use existing i18n setup

---

### 8. Assignment Checklist

- [ ] Create all pages and components as described
- [ ] Implement all BFF API routes with mock data
- [ ] Use TypeScript for all types/interfaces
- [ ] Document API contracts in this file
- [ ] Prepare for easy backend integration

---

**References:**

- [Jira Cloud REST API Docs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/)  
- DAWS internal design and API patterns

---

This document provides all the context and structure needed for a developer to start the Jira projects management MVP on the frontend, with clear separation for future backend integration.
