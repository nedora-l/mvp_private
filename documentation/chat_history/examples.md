taryaoui: use sequentialthinking and web search to understand and plan ahead 


the finale goal is to have a new page in `./app/[locale]/passwordManager/` that respect the best practices with the same structure as the other pages like directory or teams or home, that has great modern features and good design 


before starting the creating let's update `todos_manager\todo.tasks.management.md` and thinking carefully of the best plan to do from researching to thinking and planning 

and make the  `todos_manager\todo.tasks.management.md`  as the ai agents tasks manager md file.


Note : All I want for now is the best version of `todos_manager\todo.tasks.management.md` to be the best plan (from searching , thinking, planning to executing and implementning with clear ai prompts an dinstructions )

GitHub Copilot: I'll help you develop a comprehensive plan for creating a new password manager page in your Next.js application. Let's use sequential thinking to break down this task and create a thorough roadmap in your task management file.I'm now researching and analyzing the best approach for creating a password manager feature in your Next.js application. Let me continue my thought process.I'm analyzing the existing application structure and researching password management best practices to create a comprehensive plan for your new password manager page. Let me continue my thought process.I'm continuing to develop a comprehensive plan for your password manager page. Let me analyze specific implementation details and security considerations to include in the plan.I'm continuing to develop a comprehensive plan for your password manager page. Let me examine the technical implementation details and finalize the task structure.I'm continuing to develop a comprehensive plan for your password manager page. Let me now finalize my thinking and create the detailed task management document.Based on my thorough analysis, I've developed a comprehensive plan for creating a new password manager page in your Next.js application. I'll now update your task management file with a detailed roadmap that covers everything from research to implementation.
````
# Plan to add new features to our Nextjs App

## Overview

We have a working application, the next step is to add new features and pages to the application. While respecting the current structure of the app and the design.

## Task Status Legend

- [ ] To Do
- [x] Completed
- [⏳] In Progress
- [!] Blocked

## Phase 1: Research & Analysis

### Tasks Group 1: Password Manager Research

- [ ] Research modern password management features and security best practices
  - [ ] Analyze competing password management solutions
  - [ ] Document key features required for organization password sharing
  - [ ] Research encryption standards and security implementations
  - [ ] Identify UX best practices for password management interfaces
  - [ ] Research accessibility considerations for password interfaces

- [ ] Analyze existing app structure and design patterns
  - [ ] Examine current page layouts and component organization
  - [ ] Identify reusable components for password management UI
  - [ ] Document the internationalization implementation pattern
  - [ ] Analyze current state management approach for secure data

- [ ] Define password manager requirements
  - [ ] Create user stories for password management features
  - [ ] Define technical requirements and constraints
  - [ ] Outline security requirements and compliance needs
  - [ ] Document performance and scalability considerations
  - [ ] Prepare AI prompt for generating detailed feature specifications
    ```
    Generate comprehensive specifications for an organization password manager feature including:
    1. Security requirements (encryption, access controls, etc.)
    2. Core features (storage, sharing, categorization)
    3. User experience requirements
    4. Technical implementation considerations
    5. Performance and scalability requirements
    ```

## Phase 2: Design & Planning

### Tasks Group 2: Password Manager UI/UX Design

- [ ] Create wireframes for password manager UI
  - [ ] Design main password list/grid view layout
  - [ ] Design password detail view
  - [ ] Design password creation/edit forms
  - [ ] Design sharing and permission controls
  - [ ] Design password generator interface
  - [ ] Design password health and strength visualization
  - [ ] Prepare AI prompt for wireframe feedback
    ```
    Review these wireframes for an organizational password manager and provide feedback on:
    1. Usability and intuitive design
    2. Alignment with modern UI/UX practices
    3. Security UX considerations
    4. Accessibility improvements
    5. Consistency with existing application design patterns
    ```

- [ ] Plan component structure and hierarchy
  - [ ] Identify new components needed for password management
  - [ ] Document component props and state requirements
  - [ ] Plan component relationships and data flow
  - [ ] Determine reusable vs. specific components
  - [ ] Prepare AI prompt for component structure review
    ```
    Review this component structure for a password manager feature and provide feedback on:
    1. Component organization and hierarchy
    2. State management approach
    3. Reusability of components
    4. Performance considerations
    5. Adherence to React/Next.js best practices
    ```

### Tasks Group 3: Technical Architecture Planning

- [ ] Define data models and schema
  - [ ] Design password data structure with encryption considerations
  - [ ] Design category/folder structure
  - [ ] Design sharing and permissions model
  - [ ] Define metadata and audit requirements
  - [ ] Prepare AI prompt for data model review
    ```
    Review this data model for a password manager and suggest improvements for:
    1. Security and encryption implementation
    2. Data integrity and validation
    3. Scalability and performance
    4. Flexibility for future feature additions
    5. Compliance with security best practices
    ```

- [ ] Plan API endpoints and integration
  - [ ] Define API routes for password CRUD operations
  - [ ] Design authentication and authorization requirements
  - [ ] Plan secure data transmission approach
  - [ ] Document API error handling and validation
  - [ ] Prepare AI prompt for API security review
    ```
    Review these API endpoint specifications for a password manager and provide feedback on:
    1. Security vulnerabilities or concerns
    2. Authentication and authorization approach
    3. Data validation requirements
    4. Error handling strategies
    5. Compliance with API best practices
    ```

## Phase 3: Implementation

### Tasks Group 4: Core Structure Implementation

- [ ] Create page structure following Next.js routing
  - [ ] Set up passwordManager folder in app/[locale]
  - [ ] Create layout file with proper metadata
  - [ ] Implement basic page component
  - [ ] Add internationalization support
  - [ ] Prepare AI prompt for page structure review
    ```
    Review this Next.js page structure for a password manager and suggest improvements for:
    1. Alignment with Next.js app router best practices
    2. Internationalization implementation
    3. Metadata and SEO considerations
    4. Layout and structure organization
    5. Code quality and maintainability
    ```

- [ ] Implement state management for password data
  - [ ] Create context provider for password state
  - [ ] Implement actions for password operations
  - [ ] Add secure storage mechanisms for encryption keys
  - [ ] Implement password encryption/decryption logic
  - [ ] Prepare AI prompt for state management review
    ```
    Review this state management implementation for a password manager and provide feedback on:
    1. Security of the implementation
    2. Performance considerations
    3. State organization and structure
    4. Error handling approach
    5. Adherence to React best practices
    ```

### Tasks Group 5: UI Component Implementation

- [ ] Implement core password list/grid component
  - [ ] Create password card/row component
  - [ ] Add sorting and filtering functionality
  - [ ] Implement search capability
  - [ ] Add responsive design support
  - [ ] Implement pagination or virtual scrolling
  - [ ] Prepare AI prompt for UI component review
    ```
    Review these password list/grid components and suggest improvements for:
    1. UI design and visual appeal
    2. Performance with large datasets
    3. Responsiveness and mobile usability
    4. Accessibility compliance
    5. Code quality and maintainability
    ```

- [ ] Implement password detail and editing components
  - [ ] Create password view component with masked/revealed fields
  - [ ] Add copy-to-clipboard functionality
  - [ ] Implement password editing form
  - [ ] Add password strength visualization
  - [ ] Implement field validation and error handling
  - [ ] Prepare AI prompt for form implementation review
    ```
    Review these password detail and editing components and provide feedback on:
    1. Form validation and error handling
    2. Security considerations
    3. User experience and usability
    4. Accessibility compliance
    5. Alignment with application design patterns
    ```

- [ ] Implement password generation and analysis
  - [ ] Create password generator with configurable options
  - [ ] Add password strength analyzer
  - [ ] Implement password health check feature
  - [ ] Add password reuse detection
  - [ ] Create password expiration notifications
  - [ ] Prepare AI prompt for password security features review
    ```
    Review these password generation and analysis features and suggest improvements for:
    1. Security effectiveness
    2. User guidance on password best practices
    3. Algorithm implementation quality
    4. User experience and clarity
    5. Modern security standard compliance
    ```

### Tasks Group 6: Sharing and Permissions

- [ ] Implement password sharing functionality
  - [ ] Create sharing interface for individual passwords
  - [ ] Add user/group permission selection
  - [ ] Implement permission level controls (view, edit, admin)
  - [ ] Add notification system for shared passwords
  - [ ] Create audit log for shared password access
  - [ ] Prepare AI prompt for sharing feature review
    ```
    Review these password sharing features and provide feedback on:
    1. Security of the sharing implementation
    2. User experience and simplicity
    3. Permission model effectiveness
    4. Notification and audit approach
    5. Potential security vulnerabilities
    ```

### Tasks Group 7: API Integration

- [ ] Implement API services for passwords
  - [ ] Create service for password CRUD operations
  - [ ] Add authentication and authorization integration
  - [ ] Implement secure data transmission
  - [ ] Add error handling and retries
  - [ ] Create hooks for common password operations
  - [ ] Prepare AI prompt for API service review
    ```
    Review these password API service implementations and provide feedback on:
    1. Security implementation
    2. Error handling approach
    3. Performance optimization opportunities
    4. Code organization and reusability
    5. Alignment with API best practices
    ```

## Phase 4: Testing & Security

### Tasks Group 8: Testing

- [ ] Implement unit tests for components
  - [ ] Test password list/grid components
  - [ ] Test password detail and editing components
  - [ ] Test password generation and analysis
  - [ ] Test sharing and permissions
  - [ ] Prepare AI prompt for unit test review
    ```
    Review these unit tests for password management components and suggest improvements for:
    1. Test coverage completeness
    2. Edge case handling
    3. Test organization and structure
    4. Mocking approach
    5. Test performance and reliability
    ```

- [ ] Implement integration tests
  - [ ] Test end-to-end password workflows
  - [ ] Test API integration
  - [ ] Test authentication and authorization
  - [ ] Test error handling and recovery
  - [ ] Prepare AI prompt for integration test review
    ```
    Review these integration tests for the password manager and provide feedback on:
    1. Workflow coverage
    2. Test stability and reliability
    3. Environment setup approach
    4. Error scenario coverage
    5. Performance considerations
    ```

### Tasks Group 9: Security Audit

- [ ] Conduct security review
  - [ ] Audit encryption implementation
  - [ ] Review authentication and authorization
  - [ ] Check for common vulnerabilities (XSS, CSRF, etc.)
  - [ ] Verify secure storage of sensitive data
  - [ ] Test for information leakage
  - [ ] Prepare AI prompt for security audit assistance
    ```
    Review this password manager implementation and identify potential security vulnerabilities in:
    1. Encryption implementation
    2. Authentication and authorization
    3. Data storage and transmission
    4. Frontend security measures
    5. API endpoint security
    ```

- [ ] Perform accessibility audit
  - [ ] Test with screen readers
  - [ ] Verify keyboard navigation
  - [ ] Check color contrast and visual indicators
  - [ ] Verify form accessibility
  - [ ] Prepare AI prompt for accessibility review
    ```
    Review these password manager components for accessibility and suggest improvements for:
    1. Screen reader compatibility
    2. Keyboard navigation
    3. Visual accessibility (contrast, sizing, etc.)
    4. Form accessibility and error handling
    5. WCAG compliance
    ```

## Phase 5: Refinement & Documentation

### Tasks Group 10: Documentation

- [ ] Create user documentation
  - [ ] Write usage instructions
  - [ ] Document security features
  - [ ] Create FAQ section
  - [ ] Prepare video tutorials
  - [ ] Prepare AI prompt for documentation review
    ```
    Review this password manager user documentation and suggest improvements for:
    1. Clarity and completeness
    2. Organization and structure
    3. Visual aids and examples
    4. Security guidance
    5. User-friendliness
    ```

- [ ] Create developer documentation
  - [ ] Document component API
  - [ ] Document state management approach
  - [ ] Create security implementation details
  - [ ] Document testing approach
  - [ ] Prepare AI prompt for developer documentation review
    ```
    Review this password manager developer documentation and provide feedback on:
    1. Completeness of API documentation
    2. Code example quality
    3. Security implementation clarity
    4. Onboarding new developers effectiveness
    5. Maintenance and troubleshooting guidance
    ```

### Tasks Group 11: Final Review and Launch

- [ ] Conduct performance optimization
  - [ ] Analyze and optimize component rendering
  - [ ] Review and optimize API calls
  - [ ] Implement caching where appropriate
  - [ ] Optimize bundle size
  - [ ] Prepare AI prompt for performance review
    ```
    Review the performance metrics of this password manager implementation and suggest optimizations for:
    1. Initial load time
    2. Runtime performance
    3. Memory usage
    4. Network efficiency
    5. Bundle size optimization
    ```

- [ ] Prepare for launch
  - [ ] Conduct final QA testing
  - [ ] Prepare rollout strategy
  - [ ] Create monitoring plan
  - [ ] Plan for feedback collection
  - [ ] Prepare AI prompt for launch readiness assessment
    ```
    Review this password manager feature's launch readiness and provide feedback on:
    1. Quality assurance completeness
    2. Monitoring and alerting setup
    3. Rollout strategy appropriateness
    4. Feedback collection mechanisms
    5. Potential launch risks and mitigations
    ```
````


Made changes.

I've updated your todo.tasks.management.md file with a comprehensive plan for creating a new password manager page that aligns with your application's design and structure.

The plan breaks down the implementation into five key phases:

1. **Research & Analysis**: Understanding modern password management features, security best practices, and analyzing your existing app structure to ensure seamless integration.

2. **Design & Planning**: Creating wireframes for the password manager UI and planning the technical architecture, including data models and API endpoints.

3. **Implementation**: Building the core structure following Next.js routing patterns, implementing state management for secure password data, and developing UI components like password lists, editors, and sharing functionality.

4. **Testing & Security**: Thorough testing of components and integration, plus dedicated security and accessibility audits to ensure a robust implementation.

5. **Refinement & Documentation**: Creating comprehensive user and developer documentation, conducting performance optimizations, and preparing for launch.

Each task includes detailed subtasks and AI prompts that you can use at different stages to get assistance with specific aspects of development. The structure follows a logical progression that ensures all security, usability, and technical considerations are addressed.

This task management document should serve as an excellent roadmap for implementing your password manager page while following best practices and maintaining consistency with your existing application.

taryaoui: should we define a way for the ai to keep context on what's working on and smart predefined prompts to pass the the Ai Agent to start on specified tasks 


Please thinking carefully about that, and try to research and thinking about other thinkgs we can add like in memory techniques,... 

GitHub Copilot: I'll help you develop a strategy for maintaining context in AI interactions and creating smart predefined prompts for your password manager project. Let me research this topic and provide a thoughtful answer.Based on my research on AI context management techniques, I'll develop a comprehensive strategy for maintaining context in your password manager project. Let me break down some key approaches and how they can be integrated into your task management system.

## AI Context Management Strategy

### 1. Memory Architecture for Your Project

From the research, it's clear that effective AI agents use multiple types of memory to maintain context across interactions. For your password manager project, I recommend implementing:

1. **Session Memory (Buffer)**: Keeps track of current user interactions during a development session
2. **Task Memory (Summarization)**: Maintains a compressed history of completed tasks and their outcomes
3. **Project Knowledge Base (Vector Store)**: Stores semantic representations of code structures, design patterns, and security implementations

This layered approach would allow your AI assistant to maintain awareness of both immediate context and the broader project history.

### 2. Smart Predefined Prompts for Your Task Management

I suggest enhancing the task management file with structured prompts that contain both context and specific instructions:

```markdown
### Smart Prompt Framework

- **Task Context**: [Brief description of where this task fits in the overall project]
- **Current State**: [Summary of what exists/has been completed]
- **Required References**: [Key files or documentation that should be consulted]
- **Expected Output**: [Clear description of deliverables]
- **Constraints**: [Security requirements, design patterns to follow, etc.]
- **Evaluation Criteria**: [How success will be measured]
```

### 3. Context Persistence Mechanisms

To maintain context between sessions, consider:

1. **State Checkpointing**: Save the AI's understanding of the project at key milestones
2. **Task Journals**: Maintain detailed logs of decisions, approaches, and outcomes for each task
3. **Progress Tracking**: Include metadata about completion percentage, blockers, and next steps

### 4. Implementation Recommendations

Let me update your task management file to incorporate these ideas:
````
# Plan to add new features to our Nextjs App

## Overview

We have a working application, the next step is to add new features and pages to the application. While respecting the current structure of the app and the design.

## Task Status Legend

- [ ] To Do
- [x] Completed
- [⏳] In Progress
- [!] Blocked

## AI Agent Context Management

To maintain context and ensure effective collaboration with AI assistants throughout this project, we'll implement the following strategies:

### Memory Architecture

We'll use a multi-layered memory approach to maintain context:

1. **Session Memory**: Captures immediate context during development sessions
2. **Task Memory**: Maintains summaries of completed work and decisions made
3. **Project Knowledge Base**: Stores semantic understanding of code structures and patterns

### Smart Prompt Templates

When working with AI on specific tasks, use these standardized prompt structures:

#### Implementation Prompt Template
```
I need to implement [feature] for our password manager page.

Context:
- Current progress: [task status]
- Related files: [file paths]
- Design patterns: [patterns to follow]

Requirements:
- [Specific functionality needed]
- [Security considerations]
- [UI/UX requirements]

Please help me with: [specific assistance needed]
```

#### Review Prompt Template
```
Please review my implementation of [feature/component] for the password manager.

Context:
- Files changed: [file paths]
- Implementation approach: [brief description]
- Specific concerns: [any areas needing extra attention]

Evaluation criteria:
- [Security standards]
- [Performance considerations]
- [Code quality metrics]
```

### Context Persistence

To maintain continuity across development sessions:

1. **Task Checkpoints**: Each task will include a "Last State" section that captures progress
2. **Decision Log**: Important architectural or security decisions will be documented
3. **Knowledge Transfer**: Insights from AI interactions will be captured in task documentation

### Task Progress Tracking with Context

Tasks will include additional metadata to support continuity:

```
Task: [Task Name]
Status: [Status]
Progress: [Percentage]
Last Session Summary: [Brief recap of last work session]
Key Decisions: [Important choices made]
Next Steps: [Clear direction for continuation]
Context References: [Related files, docs, or discussions]
```

## Phase 1: Research & Analysis

// ...existing code...

## Phase 2: Design & Planning

// ...existing code...

## Phase 3: Implementation

// ...existing code...

## Phase 4: Testing & Security

// ...existing code...

## Phase 5: Refinement & Documentation

### Tasks Group 10: Documentation

// ...existing code...

### Tasks Group 11: Final Review and Launch

// ...existing code...

## AI Context Management Plan for Password Manager Project

To maximize AI assistance throughout this project, we'll implement the following context management approach:

### 1. Project Context Repository

- [ ] Create a `context/password_manager/` directory to store project context
  - [ ] `architecture.md`: Overview of the password manager architecture
  - [ ] `security_model.md`: Documentation of encryption approach and security considerations
  - [ ] `component_map.md`: Relationship between components
  - [ ] `progress_log.md`: Ongoing development journal

### 2. Task-Specific Context Files

- [ ] For each major feature, create a context file with:
  - [ ] Requirements and acceptance criteria
  - [ ] Design decisions and rationale
  - [ ] Implementation challenges and solutions
  - [ ] Testing approach and results

### 3. AI Interaction Workflow

- [ ] Define standard AI interaction patterns:
  - [ ] **Research prompts**: For gathering information on best practices
  - [ ] **Design prompts**: For creating component and data structures
  - [ ] **Implementation prompts**: For coding assistance
  - [ ] **Review prompts**: For code review and improvement
  - [ ] **Testing prompts**: For identifying test cases and approaches

### 4. Context Refreshing Strategy

- [ ] Implement techniques to maintain context across sessions:
  - [ ] Start each session with a summary of previous work
  - [ ] Reference specific context files for detailed history
  - [ ] Use task checkpoints to track progress
  - [ ] Document insights and decisions for future reference
````


Made changes.

I've updated your task management file with a comprehensive approach to AI context management for your password manager project. The additions focus on maintaining effective continuity between development sessions and maximizing AI assistance throughout the project. Here's what I've added:

## Key Elements of the AI Context Management Strategy

### 1. Memory Architecture

I've designed a multi-layered memory approach inspired by modern AI agent frameworks:
- **Session Memory**: For immediate context during development sessions
- **Task Memory**: For maintaining a history of completed work and decisions
- **Project Knowledge Base**: For storing semantic understanding of your codebase and patterns

### 2. Smart Prompt Templates

I've created standardized prompt templates for different phases of development:
- **Implementation Prompts**: With sections for context, requirements, and specific needs
- **Review Prompts**: With structured evaluation criteria and focus areas

### 3. Context Persistence Techniques

To maintain continuity between sessions, I've outlined:
- Task checkpoints to capture progress
- Decision logs to document important choices
- Knowledge transfer mechanisms to capture insights

### 4. Project Context Repository

I've added a plan to create a dedicated context directory with:
- Architecture documentation
- Security model documentation
- Component relationship maps
- Progress journals

This structure creates a dedicated "memory system" for your project that both you and AI assistants can reference to maintain context and make informed decisions throughout development.

## Benefits of This Approach

1. **Reduced Context Loss**: By documenting progress and decisions, you'll spend less time re-explaining the project state to AI assistants

2. **More Effective AI Assistance**: Structured prompts will help the AI understand exactly what you need at each stage

3. **Knowledge Preservation**: Important insights and decisions will be captured for future reference

4. **Consistent Development Approach**: Standardized patterns for AI interaction will create a more predictable workflow

By following this framework, you'll create a more efficient collaboration pattern with AI tools throughout the development of your password manager feature, ensuring continuity and minimizing rework due to context loss.

taryaoui: now how can I use this file the best way to start implementing step by step with wy github copilot agent in my vs code IDE agent chat ?

Workspace: It looks like you may not have tests set up in this repository yet.
Would you like to set them up?

taryaoui: @workspace /tests Accept: "It looks like you may not have tests set up in this repository yet."

Workspace: 

taryaoui: @workspace /setupTests

Workspace: Looking at your workspace structure, I can see you're working with a Next.js application using the app router pattern, TypeScript, and internationalization support.

For this type of project, I recommend the following testing frameworks:

1. **Jest with React Testing Library** - This is the standard choice for testing React components in Next.js applications. It's well-supported by the Next.js ecosystem and allows you to test components with a user-centric approach.

2. **Playwright** - This is an excellent choice for end-to-end testing. It has first-class TypeScript support, can test across multiple browsers, and handles modern web applications well, including testing across different locales which would be important for your i18n setup.

3. **Cypress** - Another solid option for end-to-end testing with an intuitive API and good developer experience. It's particularly good at testing complex user flows.

You would use Jest/RTL for component and unit tests, while Playwright or Cypress would handle your integration and end-to-end tests, giving you complete test coverage.



Pick a testing framework
Pick from these options, or use chat to tell me what you'd prefer:

taryaoui: I was asking about the file we created for tasks management using Github Copilot Agent 

todos_manager\todo.tasks.management.md

GitHub Copilot: # Using Your Task Management File with GitHub Copilot Agent

To effectively use your todo.tasks.management.md file with GitHub Copilot Agent in VS Code, follow this step-by-step approach:

## 1. Start with the Context Repository

First, set up your context repository as defined in your plan:

```bash
mkdir -p context/password_manager
touch context/password_manager/architecture.md
touch context/password_manager/security_model.md
touch context/password_manager/component_map.md
touch context/password_manager/progress_log.md
```

## 2. Begin with Research Tasks

Mark the first task as in progress in your todo file:

```markdown
- [⏳] Research modern password management features and security best practices
```

## 3. Using Copilot Agent for Research

Open the VS Code Agent and use one of your research prompts:

```
I need to research modern password management features for our application.

Context:
- Current progress: Just starting the research phase
- Related files: context/password_manager/progress_log.md

Please help me identify:
1. Key security features in modern password managers
2. Best encryption practices for password storage
3. UX patterns that balance security and usability
4. Essential sharing capabilities for organizational use
```

## 4. Document Research Findings

Document Copilot's responses in your context files. For example, add security findings to `security_model.md`.

## 5. Update Task Progress

After completing a subtask, update your task management file with:

```markdown
- [x] Analyze competing password management solutions

Task: Analyze competing password management solutions
Status: Completed
Progress: 100%
Last Session Summary: Researched 5 leading password managers, documented key features
Key Decisions: Will implement zero-knowledge encryption model
Next Steps: Research specific encryption standards
Context References: context/password_manager/security_model.md
```

## 6. Implementing Code with Copilot

When ready to implement a feature, use your implementation template:

```
I need to implement the basic password manager page structure.

Context:
- Current progress: Completed research, starting implementation
- Related files: app/[locale]/passwordManager/
- Design patterns: Following same structure as Teams and Directory pages

Requirements:
- Create basic folder structure for passwordManager route
- Implement layout.tsx with proper metadata
- Create a basic page component
- Add internationalization support

Please help me with: setting up the initial folder structure and files following Next.js app router conventions
```

## 7. Review Implementation with Copilot

After implementing a feature, use your review template:

```
Please review my implementation of the password list component.

Context:
- Files changed: app/[locale]/passwordManager/components/PasswordList.tsx
- Implementation approach: Using virtualized list for performance with large datasets
- Specific concerns: Security of displaying password data in the UI

Evaluation criteria:
- Security best practices for sensitive data display
- Performance considerations with large password collections
- Accessibility of the masked/revealed password interface
```

## 8. Track Ongoing Progress

For each working session:
1. Update the task status in your task management file
2. Document key decisions and insights
3. Update your `progress_log.md` with a session summary
4. Reference this context in your next interaction with Copilot

This structured approach will help you maintain context across development sessions and make the most of GitHub Copilot's capabilities throughout your password manager implementation.