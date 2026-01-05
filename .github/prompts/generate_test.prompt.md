# Manual Testing Instructions

---

mode: 'agent'
description: "Manually test a site and create a report"
tools: ['changes', 'search/codebase', 'edit/editFiles', 'fetch', 'openSimpleBrowser', 'problems', 'runCommands', 'runTasks', 'runTests', 'search', 'search/searchResults', 'runCommands/terminalLastCommand', 'runCommands/terminalSelection', 'testFailure', 'microsoft/playwright-mcp/*']
model: 'Claude Sonnet 4.5'

---

# 🚀 Manual Testing Instructions

1.  **Preparation & Navigation:** Use the Playwright MCP Server to navigate to the website.
    - If no URL is provided, **ask the user to provide one.**
    - **Do not generate any test code** until you have explored the website and identified the key user flows.
2.  **Key Functionality Identification:** Take a page snapshot and analyze the key functionalities.
    - _Key functionalities_ include primary form submissions (e.g., sign-up, contact forms), core navigation links, major calls-to-action (e.g., 'Buy Now', 'Download'), and critical filtering/sorting controls.
3.  **Perform Test Scenario:** Navigate to the URL provided by the user and perform the described interactions. If no scenario is provided, ask the user to provide one.
4.  **Observation & Verification:** Observe and verify the expected behavior, focusing explicitly on three key areas:
    - **Accessibility:** Check for correct keyboard focus order, appropriate use of semantic HTML tags (like `h1-h6`, `button`), and the presence of descriptive `alt` attributes for images.
    - **UI Structure:** Verify layout stability, responsiveness (if applicable), and correct element rendering.
    - **User Experience:** Check for clear feedback messages (e.g., success banners, validation errors), ease of interaction, and expected navigation.
    - _Handling Forms:_ When testing forms, ensure you check both **valid** and **invalid** input scenarios. An expected outcome for invalid input should be a clear, user-friendly error message.

---

## 📝 Report Generation

5.  **Report Structure:** Report back in clear, natural language, strictly adhering to the following sections:
    - What steps you performed (navigation, interactions, assertions).
    - What you observed (outcomes, UI changes, accessibility results).
    - Any issues, unexpected behaviors, or accessibility concerns found.
    - Reference URLs, element roles, and relevant details to support your findings.

6.  **Report Formatting (Example):**

    ```markdown
    **Scenario:** [Brief description of the test goal, e.g., "Attempt to submit the contact form with missing required fields."]
    **Steps Taken:**

    - Navigated to the Contact Us page at [URL].
    - Typed "Test User" into the Name field (Locator: `[id='name-input']`).
    - Clicked the Submit button (Locator: `button:has-text('Send Message')`).
      **Outcome:** [What happened, including any assertions or accessibility checks. E.g., "The form submission failed. An inline error message appeared next to the email input."]
      **Issues Found:** [List any problems or unexpected results. If none, state "None found."]
    ```

7.  **Locator Requirement:** For **Steps Taken** and **Issues Found**, **always include the precise CSS selector or Playwright locator** for the element that caused or was part of the action/issue (e.g., `button[data-testid='login']` or `input#email-field`).

8.  **Output File:** Generate a `.md` file with the report in the **`playwright-mcp /manual-tests`** directory and include any relevant screenshots or snapshots.

9.  **Screenshots:** Take screenshots or snapshots of the page if necessary to illustrate issues or confirm expected behavior.

10. **Cleanup:** Close the browser after completing the manual test.

11. **Code Generation:** Once the manual test is complete and the report is generated:

- Implement a Playwright test that automates the scenario you just tested manually.
- Ensure to use the observations and locators from your report to inform the test steps.
- Save the test file in the tests directory.
- Name the test file according to the scenario tested (e.g., `contact-form-validation.spec.ts`).
- Ensure the test includes appropriate assertions to verify expected outcomes.
- Follow best practices for Playwright test structure and organization.

---
