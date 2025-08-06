<!-- filepath: [Your Project Path]/documentation/todos_manager/todo.tasks.management.template.md -->
# Plan for [Main Goal]

## Overview

This document outlines the plan for achieving [Main Goal]. It details the phases, tasks, and context management strategies for working with AI agents to accomplish this objective.

## Task Status Legend

- [ ] To Do
- [x] Completed
- [⏳] In Progress
- [!] Blocked

## AI Agent Context Management

To maintain context and ensure effective collaboration with AI assistants throughout this project, we'll implement the following strategies:

### Memory Architecture

We'll use a multi-layered memory approach to maintain context:

1. **Session Memory**: Captures immediate context during development sessions.
2. **Task Memory**: Maintains summaries of completed work and decisions made.
3. **Project Knowledge Base**: Stores semantic understanding of code structures, patterns, and project-specific information.

### Smart Prompt Templates

When working with AI on specific tasks, use these standardized prompt structures:

#### Implementation Prompt Template

```text
I need to implement [feature/task] for [Project/Module Name].

Context:
- Current progress: [task status]
- Related files: [file paths]
- Design patterns/Guidelines: [patterns to follow or relevant guidelines]

Requirements:
- [Specific functionality needed]
- [Key considerations, e.g., security, performance]
- [UI/UX requirements, if applicable]

Please help me with: [specific assistance needed, e.g., code generation, a specific function, an algorithm]
```

#### Review Prompt Template

```text
Please review my implementation of [feature/component] for [Project/Module Name].

Context:
- Files changed: [file paths]
- Implementation approach: [brief description]
- Specific concerns: [any areas needing extra attention or questions you have]

Evaluation criteria:
- [Relevant standards, e.g., security, coding best practices]
- [Performance considerations]
- [Code quality metrics or style guides]
```

### Context Persistence

To maintain continuity across development sessions:

1. **Task Checkpoints**: Each task will include a "Last State" section that captures progress.
2. **Decision Log**: Important architectural, design, or strategic decisions will be documented.
3. **Knowledge Transfer**: Insights from AI interactions (e.g., useful code snippets, explanations, alternative approaches) will be captured in task documentation or a shared knowledge base.

### Task Progress Tracking with Context

Tasks will include additional metadata to support continuity:

```text
Task: [Task Name]
Status: [Status]
Progress: [Percentage or Description]
Last Session Summary: [Brief recap of last work session related to this task]
Key Decisions: [Important choices made relevant to this task]
Next Steps: [Clear direction for continuation of this task]
Context References: [Related files, documents, previous discussions, or AI chat logs]
```

## Phase 1: Research & Analysis

### Tasks Group 1: Initial Research & Understanding

- [ ] Research [topic/domain] best practices and common patterns
  - [ ] Analyze existing solutions or similar projects (if applicable)
  - [ ] Document key requirements and objectives for [Main Goal]
  - [ ] Research relevant standards, tools, or technologies
  - [ ] Identify UX best practices for [relevant interfaces/outputs] (if applicable)
  - [ ] Research accessibility considerations for [relevant interfaces/outputs] (if applicable)

- [ ] Analyze existing [system/codebase/process] structure and design patterns (if applicable)
  - [ ] Examine current [layouts/organization/workflows]
  - [ ] Identify reusable [components/modules/strategies]
  - [ ] Document [specific implementation pattern, e.g., internationalization, state management] (if applicable)
  - [ ] Analyze current [data handling/security approach] for [relevant data] (if applicable)

- [ ] Define [Feature Name/Project Scope] requirements
  - [ ] Create user stories or use cases for [Feature Name]
  - [ ] Define technical requirements and constraints
  - [ ] Outline security requirements and compliance needs (if applicable)
  - [ ] Document performance and scalability considerations (if applicable)
  - [ ] Prepare AI prompt for generating detailed specifications for [Feature Name]

    ```text
    Generate comprehensive specifications for [Feature Name] including:
    1. Core functional requirements
    2. Non-functional requirements (e.g., security, performance, usability)
    3. Technical implementation considerations (e.g., language, frameworks, APIs)
    4. Data management strategy (if applicable)
    5. Error handling and reporting
    ```

## Phase 2: Design & Planning

### Tasks Group 2: [Aspect, e.g., UI/UX, Architecture] Design

- [ ] Create wireframes/mockups/diagrams for [Feature Name/System Component]
  - [ ] Design [specific view/layout/form 1]
  - [ ] Design [specific view/layout/form 2]
  - [ ] Design [specific interaction/control 1]
  - [ ] Design [specific visualization/report 1]
  - [ ] Prepare AI prompt for [wireframe/diagram] feedback

    ```text
    Review these [wireframes/diagrams] for [Feature Name/System Component] and provide feedback on:
    1. Clarity, usability, and intuitive design
    2. Alignment with modern [UI/UX/architectural] practices
    3. [Specific concerns, e.g., Security UX, data flow, scalability]
    4. Potential improvements or alternative approaches
    5. Consistency with existing [application/system] design patterns (if applicable)
    ```

- [ ] Plan [component/module/service] structure and hierarchy
  - [ ] Identify new [components/modules/services] needed for [Feature Name]
  - [ ] Document [props/state/interface/API] requirements
  - [ ] Plan relationships and data flow between [components/modules/services]
  - [ ] Determine reusable vs. specific [components/modules/services]
  - [ ] Prepare AI prompt for [component/module/service] structure review

    ```text
    Review this [component/module/service] structure for [Feature Name] and provide feedback on:
    1. Organization and hierarchy
    2. [State management/data flow/API design] approach
    3. Reusability and modularity
    4. Performance and scalability considerations
    5. Adherence to [relevant framework/language] best practices
    ```

### Tasks Group 3: Technical Architecture & Data Planning

- [ ] Define data models and schema (if applicable)
  - [ ] Design [data structure 1] with [specific considerations, e.g., encryption]
  - [ ] Design [data structure 2, e.g., category/folder structure]
  - [ ] Design [sharing/permissions/access control] model (if applicable)
  - [ ] Define metadata and audit trail requirements
  - [ ] Prepare AI prompt for data model review

    ```text
    Review this data model for [Feature Name/System Component] and suggest improvements for:
    1. Security and [specific concerns, e.g., encryption] implementation
    2. Data integrity and validation
    3. Scalability and performance
    4. Flexibility for future feature additions
    5. Compliance with [relevant data privacy/security] best practices
    ```

- [ ] Plan API endpoints and integration (if applicable)
  - [ ] Define API routes for [CRUD operations/specific functionalities]
  - [ ] Design authentication and authorization requirements for APIs
  - [ ] Plan secure data transmission approach (e.g., HTTPS, encryption)
  - [ ] Document API error handling, versioning, and validation strategies
  - [ ] Prepare AI prompt for API security and design review

    ```text
    Review these API endpoint specifications for [Feature Name/System Component] and provide feedback on:
    1. Security vulnerabilities or concerns (e.g., OWASP Top 10)
    2. Authentication and authorization approach
    3. Data validation and sanitization requirements
    4. Error handling strategies and status codes
    5. Compliance with API design best practices (e.g., RESTful principles)
    ```

## Phase 3: Implementation

### Tasks Group 4: Core Feature Development

- [ ] Implement [Sub-Feature 1 / Module 1]
  - [ ] Develop [specific function/component A]
  - [ ] Develop [specific function/component B]
  - [ ] Integrate with [dependent service/module C]
- [ ] Implement [Sub-Feature 2 / Module 2]
  - [ ] ...
- [ ] Prepare AI prompt for implementation assistance for [specific complex part]

    ```text
    I need help implementing [specific complex part] for [Sub-Feature X].
    Context:
    - Goal: [Describe what this part should do]
    - Current code (if any): [Provide snippet or link to relevant file]
    - Constraints: [Any specific constraints or requirements]
    Please provide [code suggestions/algorithm design/debugging help].
    ```

## Phase 4: Testing & Security Assurance

### Tasks Group 5: Testing and Validation

- [ ] Develop unit tests for [Module/Component A]
- [ ] Develop integration tests for [Interaction between Module A and B]
- [ ] Conduct end-to-end testing for [User Flow X]
- [ ] Perform security testing (e.g., vulnerability scanning, penetration testing if applicable)
- [ ] Prepare AI prompt for generating test cases

    ```text
    Generate test cases for [Feature Name/User Story Y].
    Consider:
    1. Positive test cases (happy paths)
    2. Negative test cases (error conditions, invalid inputs)
    3. Edge cases
    4. Security considerations
    5. Performance and usability aspects
    ```

## Phase 5: Refinement & Documentation

### Tasks Group 6: Documentation

- [ ] Create/Update user documentation for [Feature Name]
  - [ ] Write usage instructions and examples
  - [ ] Document all functionalities and options
  - [ ] Create/Update FAQ section related to [Feature Name]
  - [ ] Prepare AI prompt for user documentation review

    ```text
    Review this user documentation for [Feature Name] and suggest improvements for:
    1. Clarity, accuracy, and completeness
    2. Organization and structure
    3. Quality of visual aids and examples (if any)
    4. Guidance on [specific aspect, e.g., security, common issues]
    5. Overall user-friendliness and accessibility
    ```

- [ ] Create/Update developer documentation for [Feature Name/Module]
  - [ ] Document [API/component interface/module architecture]
  - [ ] Document [state management/data flow/key algorithms]
  - [ ] Detail security implementation and considerations
  - [ ] Document testing approach and how to run tests
  - [ ] Prepare AI prompt for developer documentation review

    ```text
    Review this developer documentation for [Feature Name/Module] and provide feedback on:
    1. Completeness and accuracy of API/architecture documentation
    2. Quality and clarity of code examples and explanations
    3. Clarity of security implementation details
    4. Effectiveness for onboarding new developers
    5. Guidance for maintenance and troubleshooting
    ```

### Tasks Group 7: Final Review and Handoff

- [ ] Conduct performance optimization (if applicable)
  - [ ] Analyze and optimize [component rendering/algorithm efficiency/query performance]
  - [ ] Review and optimize [API calls/resource usage]
  - [ ] Implement caching or other performance-enhancing strategies where appropriate
  - [ ] Optimize [bundle size/load times] (if applicable)
  - [ ] Prepare AI prompt for performance review

    ```text
    Review the performance metrics/code for this [Feature Name/System Component] implementation and suggest optimizations for:
    1. [Specific metric, e.g., Initial load time, response time]
    2. Runtime performance and efficiency
    3. Memory usage and resource consumption
    4. [Network efficiency/Data processing speed]
    5. [Bundle size/Scalability]
    ```

- [ ] Prepare for [launch/handoff/completion]
  - [ ] Conduct final QA testing and bug fixing
  - [ ] Prepare [rollout strategy/deployment plan/summary report]
  - [ ] Create [monitoring plan/maintenance guide]
  - [ ] Plan for feedback collection and iteration (if applicable)
  - [ ] Prepare AI prompt for [launch/handoff] readiness assessment
  
    ```text
    Assess the readiness of [Feature Name/Project] for [launch/handoff].
    Consider:
    1. Completion of all core requirements
    2. Testing coverage and outstanding issues
    3. Documentation quality (user and developer)
    4. Performance and security checks
    5. [Deployment/Handoff] plan and necessary resources
    ```

## AI Context Management Plan for [Main Goal] Project

To maximize AI assistance throughout this project, we'll implement the following context management approach:

### 1. Project Context Repository

- [ ] Create a `[Project_Ctx_Path]/context/base/` directory (or similar structured location) to store project context. Examples:
  - [ ] `architecture.md`: Overview of the project architecture or system design.
  - [ ] `security_model.md`: Documentation of security considerations, threats, and mitigations.
  - [ ] `component_map.md` or `module_interactions.md`: Diagram or description of how major parts relate.
  - [ ] `progress_log.md`: Ongoing development journal or decision log.
  - [ ] `data_models.md`: Definitions of key data structures and schemas.
  - [ ] `[domain]_best_practices.md`: Best practices relevant to the project's domain (e.g., `ux_best_practices_for_financial_tools.md`).
  - [ ] `style_guide.md`: Coding style, UI style, or language style guides.
  - [ ] `glossary.md`: Definitions of project-specific terms.

### 2. Task-Specific Context Files

- [ ] For each major feature or complex task, consider creating a context file or dedicated section within this document with:
  - [ ] Detailed requirements and acceptance criteria.
  - [ ] Design decisions, rationale, and alternatives considered.
  - [ ] Implementation challenges encountered and solutions found.
  - [ ] Testing approach, specific test cases, and results.
  - [ ] Key AI interactions, prompts used, and valuable outputs received.

### 3. AI Interaction Workflow

- [ ] Define standard AI interaction patterns for different types of work:
  - [ ] **Research prompts**: For gathering information on best practices, tools, or existing solutions.
  - [ ] **Design prompts**: For assistance in creating [component/module/data] structures, algorithms, or UI mockups.
  - [ ] **Implementation prompts**: For coding assistance, debugging, or refactoring.
  - [ ] **Review prompts**: For code review, documentation review, or design critique.
  - [ ] **Testing prompts**: For generating test cases, identifying edge cases, or suggesting testing strategies.
  - [ ] **Summarization prompts**: For summarizing long documents or chat histories to refresh context.

### 4. Context Refreshing Strategy

- [ ] Implement techniques to maintain context across sessions and interactions:
  - [ ] Start each new AI interaction or work session with a brief summary of the current goal and previous relevant work.
  - [ ] Reference specific context files or sections from this document for detailed history or information.
  - [ ] Use task checkpoints (as defined above) to track progress and provide focused context.
  - [ ] Document insights, decisions, and key outputs from AI interactions for future reference and to build the project knowledge base.
  - [ ] Periodically ask the AI to summarize its understanding of the task or project to ensure alignment.
