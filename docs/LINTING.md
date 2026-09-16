# HDL Linting in LogicForge

LogicForge includes a static HDL linter (`HDLLintService`) to analyze Verilog code for common synthesis errors, latent latch inferences, and signal mismatch issues prior to invoking Yosys synthesis.

## Rule Matrix

| Rule ID | Severity | Description | Actionable Guidance |
|---|---|---|---|
| `LF-LINT-001` | `WARNING` | Combinational `always` block missing sensitivity signals | Use `always @(*)` or ensure all read signals are included |
| `LF-LINT-002` | `WARNING` | Signal width mismatch in assignment | Match vector bit widths to prevent silent truncation |
| `LF-LINT-004` | `INFO` | Undriven wire declaration | Connect wire to logic driving source or eliminate unused signal |

## CLI Execution

Run linting across a project via CLI:

```bash
logicforge lint --json
```

