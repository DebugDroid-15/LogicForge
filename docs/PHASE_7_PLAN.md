# Phase 7 Plan — Ecosystem Expansion & Advanced Hardware Debug

Phase 7 expands **LogicForge** into an extensible FPGA ecosystem platform with hardware debug infrastructure, Gowin open-toolchain backend architecture support, device search database tooling, project import/export portability, and automated hardware testing.

## Proposed Subsystems & Extensions

### 1. Advanced Hardware Debug & Probe Service (`@logicforge/core`)
- **`debugService.ts`**: Probe capability discovery, debug session lifecycle manager, trigger engine, logic analyzer sample buffer capture model (`DebugCaptureArtifact`).

### 2. Ecosystem Services (`@logicforge/core`)
- **`backendRegistry.ts`**: Machine-readable capability matrix for backends (`iCE40`, `ECP5`, `Gowin`).
- **`deviceSearchService.ts`**: Device database query & validation engine (`logicforge devices search/show/validate`).
- **`ipValidationService.ts`**: IP manifest, port, dependency & license validator (`logicforge ip validate`).
- **`portableProjectService.ts`**: Portable ZIP/bundle project export/import engine (`logicforge export/import`).
- **`hardwareTestService.ts`**: Automated hardware test executor & report generator (`logicforge hardware test`).

### 3. Headless CLI Subcommands (`apps/cli`)
- Subcommands: `backends`, `environment`, `devices search/show/validate`, `boards import/validate`, `ip validate`, `hardware test`, `export`, `import`, `validate-project`.

### 4. Tests & Golden Examples
- Create unit tests: `tests/debugSession.test.js`, `tests/backendRegistry.test.js`, `tests/deviceSearch.test.js`, `tests/hardwareTest.test.js`.
- Create examples: `examples/26_hardware_test`, `examples/27_debug_session`, `examples/28_plugin_backend`, `examples/31_reproducible_build`.

### 5. Documentation
- Create `docs/PHASE_7.md`, `docs/HARDWARE_DEBUG.md`, `docs/FPGA_BACKEND_SDK.md`, `docs/BOARD_ECOSYSTEM.md`, `docs/IP_ECOSYSTEM.md`, `docs/REPRODUCIBLE_BUILDS.md`.
- Update `README.md` and `CHANGELOG.md` to `v0.7.0-alpha`.
