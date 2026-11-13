# Test Strategy

## Objective

Evaluate the core user flows of the [Ensolvers to-do application](https://qa-challenge.ensolvers.com) through manual test design, documented bug reports, and automated end-to-end tests.

The application is the system under test. This repository contains my QA work: use case analysis, bug documentation, a Playwright suite, and its GitHub Actions workflow.

## Coverage

| Area | Scenarios |
| --- | --- |
| Authentication | Sign in, invalid and empty credentials, sign out |
| Registration | Account creation, duplicate username, required fields, password validation |
| Password reset | Request submission, email format and length validation |
| Folders | Creation, viewing, editing, deletion, cancellation, required name validation |
| To-do items | Creation, viewing, editing, deletion, cancellation, required title validation |
| Account settings | Profile updates, required fields, email validation, name length limits |

## Approach

1. Describe the expected behavior and alternative flows as use cases.
2. Explore the application manually and record reproducible bugs with expected and actual results.
3. Automate selected scenarios with Playwright and reusable Page Objects.
4. Run the authentication, folder, and to-do projects in GitHub Actions and retain execution reports.

The [use cases and bug report](docs/use-cases-and-bugs.pdf) contain the manual analysis and evidence. The automated suite covers selected flows from that analysis; the PDF also documents issues outside the automated checks.

## Automation Design

- Page Objects encapsulate selectors and UI actions.
- Shared fixtures provide the page objects to each test.
- Authentication tests exercise the UI directly.
- Global setup authenticates through the API and saves browser storage state for the functional projects.
- Faker and timestamps generate test data.
- Assertions check navigation, validation messages, notifications, and record visibility.

## Known Issues and Execution

Some validation scenarios are marked with `test.fail()` to express known application bugs. These are expected failures rather than skipped coverage; an unexpected pass calls attention to a possible fix or a changed assumption.

The `settings` project remains available locally but is excluded from the CI command because of intermittent UI validation behavior. CI runs `auth`, `folders`, and `todos`.

The tests create and modify data in the application. Some scenarios leave generated records behind. The folder creation spec also includes a bulk scenario that creates 50 folders.

## Results

The repository includes:

- Manual use cases and 11 documented bug reports.
- Automated tests grouped by functional area.
- An API authentication helper and reusable browser state setup.
- A GitHub Actions workflow with downloadable Playwright reports and test results.

Findings describe the application at the time of testing. They are not a statement of its current behavior.
