---
name: design-an-interface
description: Generates multiple radically different interface designs for a module using parallel sub-agents. Use when the user wants to design an API, explore interface options, compare module shapes, or mentions "design it twice".
---

# Design an Interface

Based on "Design It Twice" from _A Philosophy of Software Design_: your first idea is unlikely to be the best. Generate multiple radically different designs, then compare.

This skill designs module and API interfaces. Its output is interface shapes and caller examples; implementation is a separate task.

## Workflow

### 1. Gather requirements

Before designing, understand:

- What problem does this module solve?
- Who are the callers: other modules, external users, or tests?
- What are the key operations?
- What constraints apply: performance, compatibility, or existing patterns?
- What should be hidden internally and what must be exposed?

Read available code and requirements first. Ask the user about unresolved decisions: "What does this module need to do? Who will use it?"

### 2. Generate designs with parallel sub-agents

Spawn at least three sub-agents simultaneously using the environment's available delegation tool (Task or its equivalent). Give each agent a different design constraint so the approaches differ structurally, not just in names.

```text
Design an interface for: [module description]

Requirements: [gathered requirements]

Constraints for this design: [one distinct constraint]
- Agent 1: Minimize method count; aim for 1–3 methods.
- Agent 2: Maximize flexibility across the identified use cases.
- Agent 3: Optimize for the most common case.
- Optional Agent 4: Take inspiration from [specific paradigm/library].

Output:
1. Interface signature: types, methods, and parameters.
2. Usage example from a real caller's perspective.
3. What this design hides internally.
4. Trade-offs of the approach.
```

Each agent receives the shared requirements and its own constraint. If delegation is unavailable, report that limitation and present explicitly labeled independent alternatives; do not claim sub-agents ran.

### 3. Present designs

Show each design sequentially so the user can absorb it before comparison:

1. Interface signature: types, methods, and parameters.
2. Usage examples: how callers actually use it.
3. What it hides: complexity kept inside the module.

If the designs are substantially alike, revise them before comparing.

### 4. Compare designs

Discuss trade-offs in prose, not tables. Highlight where the designs diverge most:

- **Interface simplicity:** method count and parameter complexity.
- **General-purpose versus specialized:** flexibility across identified needs versus focus; avoid speculative generalization.
- **Implementation efficiency:** whether the interface permits efficient internals or forces awkward work.
- **Depth:** a small interface hiding significant complexity versus a large interface over a thin implementation.
- **Correct use and misuse:** how naturally callers do the right thing and which mistakes the shape permits.

Evaluate implementation efficiency, not estimated implementation effort.

### 5. Synthesize

Recommend the design that best fits the primary use case. Combine useful insights from the alternatives when that creates a clearer interface.

Ask which design fits the user's primary use case and whether elements from other designs should be incorporated. Finish with the chosen or proposed interface and the trade-offs still awaiting a decision. Keep implementation outside this design task.

## Existing UI artifacts: Impeccable follow-up

When interface exploration includes an existing web page or HTML artifact, consult [impeccable-design-polish](../impeccable-design-polish/SKILL.md). Inspect the artifact first and use its audit or critique guidance to assess hierarchy, interaction states, responsiveness, and accessibility. Preserve the current brand and scenario.

The design-only phase uses that evidence to improve the proposal. Apply polish, hardening, or animation edits when the user authorizes implementation or an artifact-polish task. A module/API design without a visual artifact needs no visual polish pass.

## Anti-patterns

- Similar designs presented as different alternatives.
- Skipping comparison or caller examples.
- Implementing the module during interface exploration.
- Scoring a design by implementation effort instead of interface quality and efficiency.
