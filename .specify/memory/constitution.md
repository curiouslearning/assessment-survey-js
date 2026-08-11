<!--
Sync Impact Report
==================
Version change: (unversioned template) → 1.0.0
Bump rationale: Initial ratification — first concrete constitution replacing the
placeholder template. Semantic version starts at 1.0.0 (MAJOR) per adoption.

Modified principles:
  - [PRINCIPLE_1_NAME] → I. OOP and FP Where Applicable
  - [PRINCIPLE_2_NAME] → II. SOLID and Pure Functions Where Applicable
  - [PRINCIPLE_3_NAME] → III. Gherkin-Style Specs Over Tests
  - [PRINCIPLE_4_NAME] → IV. Green Quality Gates (lint, test, build)
  - [PRINCIPLE_5_NAME] → (removed; not requested)

Added sections: none beyond the three principles.
Removed sections:
  - [SECTION_2_NAME] / [SECTION_2_CONTENT] (not requested)
  - [SECTION_3_NAME] / [SECTION_3_CONTENT] (not requested)
  - Governance (explicitly excluded by author: "No governance")

Follow-up TODOs:
  - TODO(RATIFICATION_DATE): Confirm the true original adoption date. Placeholder
    set to first-fill date 2026-08-11.
-->

# Assessment Survey Constitution

## Core Principles

### I. OOP and FP Where Applicable

Code MUST use the paradigm that best fits the problem rather than forcing a single style.
Object-oriented design MUST be used where identity, encapsulated mutable state, or polymorphic
behavior is the natural model (e.g. survey/assessment domain entities, stateful UI components).
Functional style MUST be used where data transformation, composition, and statelessness are the
natural model (e.g. scoring, mapping, validation, formatting pipelines). Mixing the two is
allowed and expected; the choice for any given unit MUST be justifiable by which model reduces
incidental complexity.

Rationale: A TypeScript survey/assessment codebase spans stateful UI/domain objects and
stateless data transforms; mandating one paradigm everywhere adds friction without value.

### II. SOLID and Pure Functions Where Applicable

Object-oriented units MUST follow SOLID: single responsibility per class, extension without
modification, substitutable subtypes, narrow client-specific interfaces, and dependency on
abstractions rather than concretions. Functional units MUST prefer pure functions — deterministic
output for given input, no side effects, no reliance on external mutable state. Side effects
(I/O, DOM, network, Firebase, analytics) MUST be isolated at the boundaries and kept out of pure
transformation logic.

Rationale: SOLID keeps object graphs maintainable and testable; pure functions make transforms
trivially testable and composable. Isolating side effects at boundaries keeps the testable core
large and the untestable shell thin.

### III. Gherkin-Style Specs Over Tests

Behavior MUST be described in Gherkin-style Given/When/Then form. Specification (`.spec`) files
are the primary, preferred expression of expected behavior and take precedence over ad-hoc test
(`.test`) files. Each behavioral scenario MUST read as Given (context) / When (action) / Then
(expected outcome), so scenarios are legible to non-implementers and map one-to-one to observable
behavior.

Rationale: Gherkin scenarios document intent in domain language, keep tests behavior-focused
rather than implementation-focused, and give a single canonical place to define expected behavior.

### IV. Green Quality Gates (lint, test, build)

Every change MUST leave the project in a green state before it is considered complete. The
project MUST pass linting, the full test suite (`npm test`), and a successful build
(`npm run build`). No change MUST be merged or shipped with a failing lint, test, or build.
Failures MUST be fixed at their source; they MUST NOT be silenced, skipped, or bypassed to force
a gate green.

Rationale: Lint, test, and build passing together is the minimum objective evidence that a change
is safe to integrate; keeping the three gates green at all times prevents defects and breakage
from accumulating.

---

**Version**: 1.0.0 | **Ratified**: 2026-08-11 | **Last Amended**: 2026-08-11
