# Code quality practices

These practices combine `thermo-nuclear-code-quality-review` with [Ponytail](https://github.com/DietrichGebert/ponytail/blob/main/skills/ponytail/SKILL.md) for this small Go and browser template. Ponytail full is the default approach to coding work. They apply when implementing, refactoring, or reviewing a change. [Go conventions](go-conventions.md) and [UI conventions](ui-conventions.md) define the concrete layer contracts.

## Scope and smallest complete change

Read the affected code before editing. Identify its callers, tests, fixtures, configuration, and exports, including compatibility, data-loss, and exposure risks. Complete those necessary updates together; keep unrelated improvements outside the change.

Choose the first adequate solution: reuse the project's existing helper or component, use the standard library or browser platform, use an installed dependency, then write the minimum clear code. Add a dependency only when its benefit justifies it. A readable small diff is the goal; preserve validation, error handling, accessibility, and requested behavior.

For a bug, inspect every caller and repair the shared cause. For nontrivial new behavior, add a focused test or an assertion-based check. Document deliberate shortcuts near the code as `shortcut: <limit>, <when to upgrade>`. Explain verification and material remaining uncertainty in the handoff.

## Design for fewer moving parts

Before adding a helper, mode, flag, or branch, ask whether an existing ownership boundary or simpler data shape can remove the need for it. Prefer deleting a concept over distributing its complexity across more files. A refactor earns its place when it reduces the concepts a reader must understand while preserving behavior.

Use direct standard-library and browser APIs where they express the task clearly. Add abstractions when they hide meaningful complexity or establish a cohesive boundary. A pass-through wrapper or speculative framework needs a concrete benefit beyond uniformity.

## Keep ownership and contracts clear

Keep HTTP validation and responses at the server boundary, lifecycle management in startup/shutdown code, palette values in themes, reusable visuals in shared Vue components, and examples in the development storyboard. Use Tailwind utilities and shadcn-vue primitives for frontend styling and controls. Reuse the canonical API, theme, DOM, and notification helpers instead of near-duplicates.

Handle special cases where their meaning belongs. Avoid scattering checks for one feature across shared code. Choose one canonical state representation, such as an ARIA attribute or a validated Go configuration value, and derive related presentation from it.

Validate external input before it enters internal logic. Prefer clear Go types and explicit JavaScript object contracts over overloaded parameters, unnecessary optional fields, casts, or fallback chains that hide broken assumptions. A fallback is appropriate for an expected environmental condition, such as unavailable browser storage; it should not conceal an invalid internal state.

## Keep modules cohesive

A change taking a source file across 1,000 lines requires decomposition or a documented structural justification in the change description. Extract by responsibility, not by an arbitrary line count; splitting a tangled function into several pass-through files does not improve its design. ESLint checks this threshold for JavaScript; reviewers must apply it to Go too.

When extending code, examine repeated conditionals, duplicate helpers, and new flags as signs that the model or ownership boundary may need improvement. Prefer a small number of well-founded structural changes over cosmetic churn.

## Make orchestration deliberate

Parallelize independent operations only when it also simplifies ownership, cancellation, and error handling. Keep dependent steps explicit and ordered. Apply related state changes as one coherent transition where partial updates would be observable or misleading. Browser initializers should have an explicit lifetime, and background Go work should have an owner and a bounded shutdown path.

## Completion and review

Preserve the intended observable behavior when refactoring. Add tests for meaningful contracts and failure cases rather than mirroring implementation details. Run `make check` after a completed change; add `go test -race ./...` for concurrency changes and rebuild Docker when changing embedded assets or container inputs.

Before considering the work complete, review the diff for structural regressions, removable concepts, scattered branching, duplicate utilities, boundary leaks, and unnecessary growth. Passing tools does not prove these design properties. If an exception is justified, record the reason close to the decision or in the change description.

## Source

Adapted from the locally installed `thermo-nuclear-code-quality-review` skill, originally read from `/Users/salindae/.agents/skills/thermo-nuclear-code-quality-review/SKILL.md`. The smallest-change practices also draw on [Ponytail by DietrichGebert](https://github.com/DietrichGebert/ponytail/blob/main/skills/ponytail/SKILL.md), read on 2026-10-24. This document is self-contained; contributors do not need either skill installed.
