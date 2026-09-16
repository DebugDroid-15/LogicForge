# LogicForge Phase 6 — Integrated FPGA IDE, Hardware Debug & Ecosystem Expansion

LogicForge Phase 6 transforms LogicForge into a cohesive, professional FPGA development environment with workspace panel layouts, inline quick fixes, plugin architecture, and hardware debug probe capabilities.

## Architecture Highlights

1. **Workspace Layout Engine (`WorkspaceService`)**: Manages dockable panels, active open files, and layout persistence state.
2. **Diagnostic Quick Fix Framework (`QuickFixService`)**: Emits deterministic code fixes for common HDL lint diagnostics (`LF-LINT-001`, `LF-LINT-002`).
3. **Formal Plugin SDK (`PluginService`)**: Extensible registry for backend tools, custom boards, simulators, and debuggers.
4. **Hardware Debug Probe Architecture (`DebugArchitectureService`)**: Probe capability detection interface (`DebugProbeCapability`, `LogicAnalyzerSession`).

## CLI Subcommands Supported

```bash
logicforge ci-report [--json]
logicforge plugins [--json]
logicforge debug-info [--json]
```

