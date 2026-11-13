# To-Do App | QA Automation Portfolio

QA portfolio project by **Lautaro Costa Peralta**, combining manual test design, bug reporting, and end-to-end automation with Playwright and TypeScript.

The system under test is the [Ensolvers to-do application](https://qa-challenge.ensolvers.com). My work in this repository covers its authentication, folders, to-do items, and account settings. The application itself belongs to Ensolvers.

## Project Highlights

- Use case documentation covering standard and alternative user flows.
- **11 bug reports** with reproduction steps, expected results, actual results, and supporting evidence.
- A Playwright suite organized around the **Page Object Model** with shared fixtures.
- API authentication and reusable browser storage state for functional tests.
- Generated test data using Faker and timestamps.
- GitHub Actions integration with HTML reports and failure evidence.

## Documentation

- [Test strategy and coverage](TEST_STRATEGY.md)
- [Manual use cases and bug reports](docs/use-cases-and-bugs.pdf)

The PDF preserves the original test findings and evidence. Its references to the QA Challenge identify the application being tested.

## Stack and Structure

**TypeScript · Playwright · Faker · GitHub Actions**

```text
.github/workflows/  CI workflow
docs/             Manual use cases and bug reports
fixtures/         Shared Playwright fixtures
pages/            Page Objects
support/          API authentication and global setup
tests/
  auth/           Login, registration, password reset, logout
  folders/        Folder management
  todos/          To-do item management
  settings/       Account settings validation
TEST_STRATEGY.md  Scope, approach, and known limitations
```

## Run Locally

Install Node.js compatible with the versions in `package-lock.json`, then install the dependencies and browsers:

```bash
npm ci
npx playwright install --with-deps
```

Copy `.env.example` to `.env` and set:

```dotenv
BASE_URL=https://qa-challenge.ensolvers.com/
E2E_USERNAME=your_username_here
E2E_PASSWORD=your_password_here
```

Run the full suite or a functional area:

```bash
npm test
npm run test:auth
npm run test:folders
npm run test:todos
npm run test:settings
```

Run a single scenario or open the report:

```bash
npx playwright test tests/auth/login-ui.spec.ts --grep "successful login"
npm run report
```

The tests exercise the hosted application and create or modify records. Some generated records remain after execution, including those from the bulk folder creation scenario.

## Continuous Integration

The [GitHub Actions workflow](.github/workflows/playwright.yml) runs on pushes and pull requests targeting `main` or `master`.

Configure these repository secrets under **Settings > Secrets and variables > Actions**:

| Secret | Value |
| --- | --- |
| `BASE_URL` | Application base URL |
| `E2E_USERNAME` | Test account username |
| `E2E_PASSWORD` | Test account password |

CI runs the `auth`, `folders`, and `todos` projects. The same command is available locally as `npm run test:ci`. Each run uploads `playwright-report/` and `test-results/` with a 30-day retention period.

## Known Limitations

- The `settings` project can behave intermittently because of UI validation timing and remains outside the CI command.
- Some scenarios use `test.fail()` to document known application bugs. An unexpected pass is reported as a test failure so the expectation can be reviewed.
- The suite depends on the availability and behavior of the hosted application.
- Manual findings reflect the application at the time of testing; they may change as the application evolves.
