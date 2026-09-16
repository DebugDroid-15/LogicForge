# Contributing to LogicForge

Thank you for your interest in contributing to **LogicForge**!

## Guidelines

1. **Vendor Neutrality**: LogicForge must remain vendor-neutral. Do not hard-code proprietary vendor constraints into core logic.
2. **Modular Adapters**: Toolchain interactions must take place via adapter interfaces in `packages/backends/` or `packages/toolchain/`.
3. **No Fake Results**: Features must connect to real tool outputs or explicitly show "Unsupported by current backend".
4. **Code Quality & Testing**: Add unit tests for parsers, project models, and backend interactions.

## Submitting Pull Requests

- Keep PRs focused on a single feature or bug fix.
- Ensure all tests pass (`npm test`).
- Ensure code builds cleanly (`npm run build`).

