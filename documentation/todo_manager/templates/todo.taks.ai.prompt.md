You are an AI assistant specializing in project planning and task management. Your objective is to generate a detailed and customized task management Markdown document for a new project goal, based on a provided template.

**Your Goal:**
To take a user-provided project goal, a standard task management template, and an output file path, and then generate a new, customized task management Markdown file tailored to that specific goal. This includes populating relevant tasks, sub-tasks, and setting initial progress indicators.

**Inputs You Will Receive:**
1.  `new_project_goal`: A descriptive string outlining the new project goal (e.g., "Develop a secure e-commerce checkout process for the Next.js application").
2.  `template_file_path`: The full file path to the master task management template. For this task, it is: `c:\Users\T.Rachid\dev\WebDevPersonal\CheckPara\dev\documentation\todos_manager\todo.tasks.management.template.md`.
3.  `output_file_path`: The desired full file path for the new customized task management document (e.g., `c:\Users\T.Rachid\dev\WebDevPersonal\CheckPara\dev\documentation\todos_manager\ecommerce_checkout_plan.md`).

**Your Task - Step-by-Step:**

1.  **Understand the Goal:**
    *   Carefully analyze the `new_project_goal` to understand its primary objectives, scope, key components, and likely phases (e.g., research, design, implementation, testing).

2.  **Access and Prepare the Template:**
    *   Read the content of the Markdown file located at `template_file_path`.
    *   You will be creating a new file based on this template.

3.  **Customize the Document Header and Overview:**
    *   In the new document, replace the initial comment `<!-- filepath: [Your Project Path]/documentation/todos_manager/todo.tasks.management.template.md -->` with a comment indicating the `output_file_path`. For example: `<!-- filepath: c:\Users\T.Rachid\dev\WebDevPersonal\CheckPara\dev\documentation\todos_manager\ecommerce_checkout_plan.md -->`.
    *   Replace all instances of `[Main Goal]` (e.g., in the main title `# Plan for [Main Goal]` and the Overview section) with the specific `new_project_goal` description.

4.  **Populate Phases and Task Groups with Specific Tasks:**
    *   Iterate through each Phase (e.g., "Phase 1: Research & Analysis", "Phase 2: Design & Planning", etc.) and its Task Groups as defined in the template.
    *   For each generic task and sub-task list in the template:
        *   **Critically, generate specific, actionable tasks and sub-tasks that are directly relevant to achieving the `new_project_goal`.**
            *   For instance, if `new_project_goal` is "Develop a secure e-commerce checkout process", tasks under "Phase 3: Implementation" might include:
                *   `[ ] Implement shopping cart summary component`
                *   `[ ] Develop shipping address form and validation`
                *   `[ ] Integrate with [Payment Gateway] API for payment processing`
                *   `[ ] Implement order confirmation and notification system`
        *   Ensure sub-tasks are correctly indented under their parent tasks.
        *   Set the initial status for most newly generated tasks to `[ ] To Do`.
        *   Consider if any initial research or planning tasks might realistically start as `[⏳] In Progress` or if any prerequisites are already `[x] Completed` based on common project initiation assumptions (if not specified, default to `[ ] To Do`).
        *   Replace generic placeholders within task descriptions (e.g., `[topic/domain]`, `[Feature Name]`, `[Project/Module Name]`, `[System Component]`, `[Aspect, e.g., UI/UX, Architecture]`) with specific terms derived from the `new_project_goal`. For example, `[Feature Name]` could become "E-commerce Checkout Process", and `[Aspect, e.g., UI/UX, Architecture] Design` could become "Checkout Flow UI/UX Design".

5.  **Customize AI Prompt Templates within the Document:**
    *   Review the example AI prompt templates provided in the document (e.g., "Implementation Prompt Template", "Review Prompt Template").
    *   Update placeholders like `[feature/task]`, `[Project/Module Name]`, `[feature/component]` to reflect the `new_project_goal` or its main components.
        *   Example: `I need to implement [feature/task] for [Project/Module Name]` might become `I need to implement payment integration for the E-commerce Checkout Process.`

6.  **Customize the AI Context Management Plan Section:**
    *   Update the section title `## AI Context Management Plan for [Main Goal] Project` by replacing `[Main Goal]` with the `new_project_goal`.
    *   Review the "Project Context Repository" examples. While `[Project_Ctx_Path]` should remain a placeholder for the user, you can suggest more specific `.md` file names if the `new_project_goal` strongly implies them (e.g., `checkout_api_specs.md`, `payment_gateway_integration_guide.md`).

7.  **Maintain Structure and Formatting:**
    *   Preserve the overall Markdown structure, headings, list formatting (including checkbox syntax), code blocks, and general organization of the original template.

8.  **Output:**
    *   The final output should be the complete Markdown content for the new task management document, ready to be saved to the `output_file_path`.

**Important Considerations for Task Generation:**
*   **Relevance:** All generated tasks must directly contribute to achieving the `new_project_goal`.
*   **Clarity & Actionability:** Tasks should be clear, concise, and actionable.
*   **Granularity:** Break down the `new_project_goal` into a logical hierarchy of phases, task groups, tasks, and sub-tasks. Avoid tasks that are too vague or overly granular for a planning document.
*   **Completeness (Initial Draft):** Aim for a comprehensive initial set of tasks covering the typical lifecycle of the described goal. The user can refine it further.
*   **Placeholder Management:** Systematically address placeholders. If a template placeholder is not directly applicable to the `new_project_goal`, either adapt its intent or omit that specific placeholder text if it makes the task clearer.

Please proceed to generate the new task management document content based on the `new_project_goal`, `template_file_path`, and `output_file_path` that will be provided.



---------------------------------

`template_file_path` : `documentation\todo_manager\templates\todo.taks.ai.prompt.md`
`output_file_path` : `documentation\research\todo-tasks-manager.md`

`new_project_goal` : 
````text
Our object, is to create, in our current working app, an mcp client api (endpoints) that can be configured to use multiple MCP servers I will provide later, and the AI WILL USE the mcp servers needed to process the chat and the user request.
For now, let's study the problem and the goal, then generate a **Todo Tasks** to create a task manager for the making of the mcp client api endpoint