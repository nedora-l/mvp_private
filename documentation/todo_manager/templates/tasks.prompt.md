Hello! We are initiating the implementation phase of our Next.js Application Localization Project.

**Primary Goal:**
Implement the comprehensive localization plan as detailed in `documentation/todos_manager/todo.tasks.localization.md`. This involves setting up the necessary infrastructure, systematically extracting all user-facing text from the existing codebase, creating translation files for all supported locales (English, French, Arabic), refactoring components and pages to use the new i18n system, and implementing a language switching mechanism, all while adhering to best practices and ensuring the application remains stable.

**Mode of Operation:**
Please operate in "agent mode." This means you should proactively:
1.  Follow the tasks outlined in `documentation/todos_manager/todo.tasks.localization.md` phase by phase, group by group, and task by task.
2.  Utilize your available tools to read files, analyze code, create new files, insert/edit code, and run necessary terminal commands (e.g., for installing dependencies).
3.  Refer to `documentation/brainstorming/localization.readme.md` for the established architectural guidelines and `documentation/todos_manager/context/localization/` (once created as per the plan) for ongoing context.
4.  Begin with **Phase 3: Implementation**, specifically **Tasks Group 4: Core Localization Setup**, as Phase 1 and 2 are primarily research and planning.
5.  For **Tasks Group 5: Text Extraction and Code Refactoring**, proceed iteratively through components and pages as listed in the project structure. For each, identify hardcoded strings, define translation keys, update translation files, and refactor the code to use the i18n utilities (`getDictionary` for Server Components, `useI18n` hook for Client Components).
6.  When creating or modifying files, ensure you are using the correct file paths relative to the workspace root `c:\Users\T.Rachid\dev\WebDevPersonal\CheckPara\dev`.
7.  Update the task statuses in `documentation/todos_manager/todo.tasks.localization.md` as you complete them (e.g., changing `[ ]` to `[x]`).
8.  If you encounter ambiguities or need to make a decision not explicitly covered in the plan (e.g., specific key naming if the convention is not yet detailed enough for a particular case), please state your proposed solution, explain your reasoning based on best practices, and proceed. Document significant decisions.
9.  If a task requires external information or a command execution, please describe what you intend to do before proceeding.

**Initial Context & Files:**
-   **Main Plan:** `c:\Users\T.Rachid\dev\WebDevPersonal\CheckPara\dev\documentation\todos_manager\todo.tasks.localization.md`
-   **Localization Strategy Guide:** `c:\Users\T.Rachid\dev\WebDevPersonal\CheckPara\dev\documentation\brainstorming\localization.readme.md`
-   **Project Workspace:** `c:\Users\T.Rachid\dev\WebDevPersonal\CheckPara\dev`

**Starting Point:**
Please begin with **Phase 3, Task Group 4, Task 1: "Implement Localization Infrastructure - Install dependencies: negotiator, @formatjs/intl-localematcher"**.

Let me know if you have any questions before you begin. Proceed with the first task when ready.