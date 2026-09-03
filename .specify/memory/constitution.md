<!--
Sync Impact Report
===================
Version change: [unratified template] → 1.0.0 (initial ratification)
Rationale: MAJOR — first concrete adoption of the constitution; all principles and
governance sections are newly defined (no prior ratified content existed, the file
previously held only unfilled template placeholders).

Modified principles: n/a (initial ratification, no prior named principles to rename)

Added sections:
  - Core Principles I–VI (TypeScript strict typing; hybrid OOP/FP paradigm;
    SOLID-compliant OOP; pure-function FP; composition & orchestration boundaries;
    Gherkin-style testing with happy-path coverage)
  - Quality Gates (Section 2)
  - Development Workflow (Section 3)
  - Governance (amendment procedure, versioning policy, compliance review)

Removed sections: none

Deferred / TODO placeholders: none — all template placeholders were resolved.

Templates requiring follow-up review (not modified by this command; read the
constitution at runtime):
  - .specify/templates/plan-template.md — verify its Constitution Check section
    references these six principles when next used.
  - .specify/templates/tasks-template.md — verify task categorization can express
    OOP vs. FP module boundaries and Gherkin-style spec files when next used.
  - .specify/templates/spec-template.md — no direct dependency; no action needed.
  - Command docs under .claude/commands/ (if present) — no hard-coded principle
    names found requiring update.
-->

# Assessment Survey JS Constitution

## Core Principles

### I. Strict TypeScript, No `any`
All source code MUST be written in TypeScript with strict typing enabled. The `any`
type MUST NOT be used; where a type is genuinely unknown at a boundary (e.g., parsing
external JSON), it MUST be narrowed via `unknown` plus explicit type guards or a
validated schema before use. `@ts-ignore`/`@ts-expect-error` MUST NOT be used to
suppress typing gaps introduced by new code.
**Rationale**: This library ships as a published npm package and a standalone bundle
consumed by external hosts; weak typing at the boundary propagates silently into
every integrator and is expensive to debug after release.

### II. Hybrid Paradigm: OOP for Stateful Entities, FP for Data Transformations
Code MUST be organized using a hybrid paradigm, chosen per responsibility, not per
file convenience:
- **OOP** is used for stateful, identity-based entities that own lifecycle and
  mutable state — e.g., the assessment/survey engines, UI controllers/adapters,
  audio/renderer-style managers, and other components with an observable identity
  over time.
- **FP** (pure functions) is used for data transformations that have no identity and
  no side effects — e.g., bucket/score calculations, math and search utilities,
  state reducers, and rule/eligibility evaluation.
A module MUST NOT mix the two responsibilities: a class MUST delegate its
calculations to pure functions rather than inlining transformation logic as private
methods with hidden side effects, and a pure function MUST NOT reach into mutable
object state.
**Rationale**: The engine layer (adaptive bucket search, scoring) is transformation-
heavy and benefits from pure, independently testable functions, while the
UI/audio/integration layer is inherently stateful and event-driven; conflating them
produces classes that are hard to unit test and functions with hidden dependencies.

### III. SOLID-Compliant Object-Oriented Design
Every class MUST observe SOLID:
- **Single Responsibility** — a class has one reason to change.
- **Open/Closed** — new behavior is added via extension points (interfaces,
  injected strategies), not by editing unrelated branches inside an existing class.
- **Liskov Substitution** — a subtype MUST be usable anywhere its base/interface is
  expected without altering correctness (e.g., both `AssessmentUI` implementations
  must be interchangeable behind the shared interface).
- **Interface Segregation** — consumers depend only on the methods they use; MUST
  NOT be forced to implement unused interface members.
- **Dependency Inversion** — high-level orchestration (e.g., `App`) depends on
  abstractions (interfaces/adapters), not on concrete subsystem implementations.
**Rationale**: SOLID keeps the dual-UI, multi-adapter architecture (legacy vs.
drag-drop UI, multiple host integration adapters) extensible without cascading edits
across unrelated subsystems.

### IV. Pure Functions for Functional Code
Every function written in the FP style MUST be pure: given the same inputs it MUST
return the same output, and it MUST NOT mutate its arguments, read/write module-level
state, perform I/O, or depend on wall-clock time, randomness, or global singletons.
Any such dependency MUST be passed in explicitly as a parameter. Pure functions MUST
be exported and unit-testable in isolation, without mocking a class or the DOM.
**Rationale**: Purity is what makes the adaptive-search, scoring, and rule-evaluation
logic exhaustively testable with plain input/output assertions, and safe to reuse or
parallelize without hidden coupling.

### V. Composition & Orchestration Boundaries
Classes MUST encapsulate their internal state (private/protected fields) and expose
only explicit, intention-revealing public methods — internal state MUST NOT be
exposed directly for external mutation. Composition MUST be favored over
inheritance: shared behavior is extracted into injected collaborators or composed
interfaces rather than deep base-class hierarchies; an inheritance chain deeper than
one level (a concrete class extending a single base) requires explicit justification
in the PR description. Long method-chain call sites (chaining across more than two
calls, e.g. `a.b().c().d().e()`) MUST NOT be used inline; instead, an orchestration
method or function MUST wrap the sequence of pure/private steps and expose a single
intention-revealing call.
**Rationale**: The codebase already favors composition (BaseQuiz + PubSub,
interchangeable AssessmentUI adapters); deep inheritance and long fluent chains both
obscure control flow and make step-by-step testing and debugging harder.

### VI. Gherkin-Style Testing with Happy-Path Coverage
Unit tests MUST live in spec/test files (mirroring `src/` under `test/`, per existing
convention) and MUST be structured in Gherkin style — each test scenario is
expressed with clear Given/When/Then framing (via nested `describe`/`it` naming or
explicit Given/When/Then comments within the test body). Every unit under test MUST
have at least one scenario covering its happy path; additional edge-case and error
scenarios SHOULD be added but are not a merge blocker on their own.
**Rationale**: Gherkin-style structure keeps test intent readable as living
documentation of behavior, and a mandatory happy-path scenario is the minimum bar
that prevents shipping fully untested new behavior.

## Quality Gates

The build MUST succeed and the full test suite MUST pass before any change is
considered complete. Concretely, on every change: `npm run build:all` (or the
relevant subset, `build:standalone` / `build:package`) MUST complete without errors,
and `npm test` MUST pass with zero failing tests. A change that fails either gate
MUST NOT be merged, regardless of how minor the change appears. `npm run format`
SHOULD be run before commit to keep diffs focused on substance.

## Development Workflow

Code review (self-review or peer review) MUST verify, before merge:
1. No `any` types were introduced (Principle I).
2. New logic was placed in the correct paradigm — stateful/identity concerns in a
   class, pure transformations in a function (Principle II).
3. New/changed classes still satisfy SOLID; no unjustified inheritance depth or
   responsibility creep (Principle III, V).
4. New/changed FP-style functions remain pure and side-effect free (Principle IV).
5. New behavior has at least one Gherkin-style happy-path spec (Principle VI).
6. Build and full test suite pass locally (Quality Gates).

## Governance

This constitution supersedes any conflicting ad hoc practice for this repository.
Amendments are made by editing this file and MUST include: the specific principle or
section changed, the rationale for the change, and a version bump per the policy
below. Constitution changes MUST be reviewed the same way as a code change (PR
review) before being merged to the default branch.

**Versioning policy** (semantic versioning applied to governance):
- **MAJOR** — backward-incompatible principle removal or redefinition that
  invalidates previously-compliant code or workflow.
- **MINOR** — a new principle or section is added, or existing guidance is
  materially expanded.
- **PATCH** — wording clarifications, typo fixes, or non-semantic refinements that
  do not change what is required.

**Compliance review**: Every pull request MUST be checked against the Development
Workflow checklist above. Use [CLAUDE.md](../../CLAUDE.md) for day-to-day runtime
development guidance (commands, architecture, subsystem map); this constitution
governs the non-negotiable engineering rules that guidance must operate within. Any
exception to a principle MUST be explicitly justified in the PR description and is
subject to reviewer approval; recurring exceptions are a signal the constitution
itself needs an amendment rather than continued ad hoc waivers.

**Version**: 1.0.0 | **Ratified**: 2026-08-24 | **Last Amended**: 2026-08-24
