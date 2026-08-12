# Contract: `build_and_sync` CircleCI reusable command

The interface this feature exposes to the rest of the pipeline. Any job may invoke this command to
build via an npm script and mirror the output to an S3 destination.

## Parameter schema

```yaml
commands:
  build_and_sync:
    description: Build via an npm script, then sync the build folder to an S3 destination.
    parameters:
      to:
        type: string
        description: S3 destination URI (e.g. s3://globallit-aws-s3-static-webapp-test-us-west-2).
      build-script:
        type: string
        description: npm script name defined in package.json (e.g. build).
      from:
        type: string
        default: "./build"
        description: Source build folder to synchronize from.
      region:
        type: env_var_name
        default: AWS_DEFAULT_REGION
        description: Name of the env var holding the AWS region (per-environment).
    steps:
      # Assumes the calling job has already run `checkout` + `node/install-packages`
      # so gated jobs (lint/test) can share the same checkout/deps without repeating them.
      - run: npm run << parameters.build-script >>
      - aws-s3/sync:
          arguments: |
            --acl public-read \
            --cache-control "max-age=86400"
          aws-access-key-id: AWS_ACCESS_KEY
          aws-region: << parameters.region >>
          aws-secret-access-key: AWS_SECRET_ACCESS_KEY
          from: << parameters.from >>
          to: << parameters.to >>
```

> The YAML above is the contract shape (parameters, defaults, step order), not the final
> hand-tuned config. Region var, ACL, and cache-control mirror the existing `.circleci/config.yml`
> conventions and may be adjusted during implementation.

## Contract guarantees

| ID   | Guarantee                                                                                      | Spec ref |
|------|------------------------------------------------------------------------------------------------|----------|
| C-1  | `to` fully determines the S3 destination; no destination is hard-coded in the command body.     | FR-008   |
| C-2  | `build-script` is executed as `npm run <build-script>`; build logic stays in `package.json`.    | FR-009   |
| C-3  | `from` determines exactly which folder is synchronized; defaults to `./build`.                  | FR-010   |
| C-4  | If `npm run <build-script>` exits non-zero, the command fails and `aws-s3/sync` does not run.    | FR-004   |
| C-5  | Sync mirrors `from` to `to`, removing destination files not present in `from`.                  | FR-006   |
| C-6  | AWS credentials are read from env vars, never from committed values.                            | FR-011   |

## Consumer contract: test-environment job

```yaml
jobs:
  s3-deploy-test:
    executor: { name: node/default, tag: '24.10' }
    steps:
      - checkout
      - node/install-packages: { cache-path: ~/project/node_modules }
      - run: npm run lint      # gate 1
      - run: npm test          # gate 2
      - build_and_sync:        # gate 3 (build) + publish
          build-script: build
          from: ./build
          to: s3://globallit-aws-s3-static-webapp-test-us-west-2
          region: AWS_TEST_REGION   # set to us-west-2 in the CircleCI test context
```

- The job MUST run `lint`, then `test`, then `build_and_sync`, in that order (FR-002).
- The workflow MUST restrict this job to the test-environment branch (FR-001).

## Backward-compatibility note

Existing jobs `s3-deploy` (develop → `assessment-and-survey-development`) and `s3-deploy-prod`
(main → `assessment-and-survey-production`) MAY be refactored to call `build_and_sync` with their
respective `to` values. Doing so MUST preserve their current branch filters and destinations.
