# Implementation Plan: CircleCI Test-Environment Build & Deploy

**Branch**: `001-circleci-test-deploy` (spec dir) / working branch `feature/mr-190-create-test-env` | **Date**: 2026-08-11 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-circleci-test-deploy/spec.md`

## Summary

Add an automated CircleCI flow that, on changes to the test-environment branch, runs the quality
gates (lint → test → build) and then synchronizes a production-configured build to an S3 bucket for
the test environment. The build + sync behavior is refactored into a single reusable CircleCI
command parameterized by `to` (S3 destination), `build-script` (an npm script from `package.json`),
and `from` (source build folder). The existing duplicated `s3-deploy` / `s3-deploy-prod` jobs are
candidates to be re-expressed through the same command, but the required deliverable is the
test-environment job/workflow plus the reusable command.

## Technical Context

**Language/Version**: CircleCI config `version: 2.1` (YAML); Node 24.10 executor (matches existing config)

**Primary Dependencies**: CircleCI orbs `circleci/aws-s3@3.0` and `circleci/node@7.0.0` (already declared)

**Storage**: AWS S3 bucket for the test environment (destination is a command parameter)

**Testing**: Jest via `npm test`; CircleCI config validated with `circleci config validate` / `circleci config process`

**Target Platform**: CircleCI cloud pipeline; artifacts hosted from S3 static bucket

**Project Type**: CI/CD pipeline configuration for a single web project (single `.circleci/config.yml`)

**Performance Goals**: N/A (single pipeline run per push; no throughput target)

**Constraints**: Deploy MUST NOT run if lint/test/build fails; AWS credentials MUST come from CircleCI
env/context, never committed; reusable command MUST be parameter-driven with no per-environment body edits

**Scale/Scope**: One reusable command + one test-environment job wired into a workflow with a branch
filter; optional refactor of two existing deploy jobs onto the command

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution v1.0.0 principles evaluated against this (configuration-only) feature:

- **I. OOP and FP Where Applicable** — Not directly applicable to YAML config. The spirit (choose the
  right unit of reuse) is honored by extracting one parameterized command instead of duplicated jobs.
  **PASS.**
- **II. SOLID and Pure Functions Where Applicable** — Honored by analogy: the reusable command has a
  single responsibility (build-then-sync), is open for reuse via parameters without modification, and
  depends on injected parameters rather than hard-coded values. **PASS.**
- **III. Gherkin-Style Specs Over Tests** — The spec and this feature's validation scenarios are
  expressed in Given/When/Then form (see [quickstart.md](./quickstart.md)). No application unit tests
  are added by an infra change. **PASS.**
- **IV. Green Quality Gates (lint, test, build)** — This feature *enforces* the gate in CI. **Gap:**
  `package.json` currently defines `test`, `build`, and `format`, but **no `lint` script**. To make the
  lint gate real, a `lint` script MUST be added. Resolution decided in Phase 0 research (add
  `"lint": "prettier --check ."`, reusing the already-present Prettier dependency). Tracked below; not a
  violation to justify, an action to perform. **PASS (with required action).**

No constitutional violations require justification. Complexity Tracking table omitted.

## Project Structure

### Documentation (this feature)

```text
specs/001-circleci-test-deploy/
├── plan.md              # This file (/speckit-plan command output)
├── spec.md              # Feature specification
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── build-and-sync-command.md
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

This is a configuration change, not application source. Affected files:

```text
.circleci/
└── config.yml           # Add reusable `build_and_sync` command + test-env job + workflow filter;
                         #   optionally refactor existing s3-deploy / s3-deploy-prod onto the command

package.json             # Add a `lint` script so the CI lint gate is enforceable (Principle IV)
```

**Structure Decision**: Single-project CI/CD configuration. All pipeline logic lives in the existing
`.circleci/config.yml`; the only supporting change is one added npm script in `package.json`. No new
application directories are introduced.
