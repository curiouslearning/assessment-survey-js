# Research: CLT-176

See "Key findings" in [plan.md](./plan.md).

- **Decision**: change the "l" and "a" items' `itemName` + `itemText` to "L" / "A" in hausa-lettersounds.json only, and bump `contentVersion`.
- **Rationale**: scoring compares `itemName` with the target's `itemText`; audio is resolved from lowercase `itemName`, so it is unchanged.
- **Alternatives considered**: tailed-"l" font subset (dropped: UI/font change); display-only uppercase transform in code (rejected: needs code in two UIs for a content problem).
