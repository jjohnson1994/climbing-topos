# Best Practices for Writing E2E Tests for a Web App

## Purpose of E2E Tests

End-to-end (E2E) tests verify that your application works from the user’s perspective — across the UI, backend, database, and integrations. They should validate **critical user journeys**, not implementation details.

Think: _“Can a real user successfully achieve their goal?”_

---

## 1. Test User Outcomes, Not Implementation

- Focus on **user flows**, not internal functions.
- Avoid asserting on internal state, CSS classes, or database details unless essential.
- Prefer:

  - “User can sign up and see their dashboard”

- Avoid:

  - “Redux store contains X”
  - “Component method was called”

✔ Good: Assert what the user sees and can do
✘ Avoid: Testing framework internals

---

## 2. Cover Critical Paths Only

E2E tests are:

- Slower
- More brittle
- More expensive to maintain

Prioritise:

- Authentication flows
- Payments
- Core CRUD operations
- Business-critical journeys

Leave edge cases and logic branches to:

- Unit tests
- Integration tests

---

## 3. Make Tests Independent & Deterministic

Each test should:

- Run in isolation
- Not depend on other tests
- Control its own data

Best practices:

- Seed test data via API
- Avoid shared state
- Clean up after execution if needed

Flaky tests destroy trust — eliminate randomness.

---

## 4. Use Accessible Selectors (Query Priority)

Tests should query elements the same way a real user finds them. This also validates that your UI is accessible to assistive technology users.

Follow this priority order ([source](https://testing-library.com/docs/queries/about/#priority)):

### 1. Accessible to Everyone (preferred)

These reflect the experience of all users, including those using screen readers:

| Query | Use for |
|---|---|
| `getByRole` | Almost everything — buttons, links, headings, inputs, dialogs |
| `getByLabelText` | Form fields with a `<label>` |
| `getByPlaceholderText` | Inputs where no label exists (avoid if possible) |
| `getByText` | Non-interactive content (paragraphs, headings, spans) |
| `getByDisplayValue` | Filled form fields |

```js
// Preferred
page.getByRole('button', { name: 'Submit order' })
page.getByLabel('Email address')
page.getByRole('dialog', { name: 'Confirm purchase' })
```

### 2. Semantic Queries

| Query | Use for |
|---|---|
| `getByAltText` | Images |
| `getByTitle` | Elements with a `title` attribute |

### 3. Test IDs (last resort only)

Only use `data-testid` when no accessible alternative exists and the element has no meaningful role, label, or text:

```js
// Only if there is genuinely no accessible alternative
page.getByTestId('complex-canvas-element')
```

**Never use CSS classes, IDs, or DOM structure to select elements.** If you cannot select an element with the queries above, it is likely inaccessible — fix the component rather than reaching for a testid.

A passing test suite that uses accessible queries is also a basic accessibility audit.

---

## 5. Prefer Explicit Assertions

Avoid vague checks:

- “Page loads successfully”

Instead assert:

- Key content exists
- Buttons are enabled/disabled
- Redirects happen correctly
- API-driven content renders correctly

Be specific about expected outcomes.

---

## 6. Avoid Arbitrary Waits

Never use:

```js
wait(5000);
```

Instead:

- Wait for specific UI conditions
- Wait for network responses
- Wait for elements to become visible

Tests should wait for _state_, not _time_.

---

## 7. Keep Tests Readable

E2E tests double as documentation.

Use:

- Clear test names
- Arrange–Act–Assert structure
- Reusable helpers for setup
- Page object or abstraction patterns (if helpful)

Good example:

```js
it('allows a user to reset their password');
```

Anyone reading the test should understand the user story.

---

## 8. Run in CI with Production-Like Config

- Use environment variables similar to production
- Run headless in CI
- Test against a real database (not mocks where possible)
- Capture screenshots/videos on failure

Confidence comes from realism.

---

## 9. Keep the Suite Fast

Strategies:

- Parallelise tests
- Avoid unnecessary UI steps (log in via API if login isn’t under test)
- Keep flows minimal
- Remove redundant coverage

E2E tests should be **small in number but high in value**.

---

## 10. Review and Maintain Regularly

- Remove obsolete tests
- Fix flakiness immediately
- Refactor tests alongside feature changes
- Track failure rates

A flaky suite is worse than no suite.

---

# Summary Principles

- Test user behaviour
- Cover critical flows only
- Make tests deterministic
- Use stable selectors
- Avoid arbitrary waits
- Keep them few, readable, and reliable

E2E tests are a **safety net, not a microscope**. Use them to protect what matters most.
