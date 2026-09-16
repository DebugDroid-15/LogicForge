# Formal Verification Engine

LogicForge integrates formal property checking using SymbiYosys and SMT solvers through `FormalService`.

## Supported Property Types

* `assert(...)`: Verification assertions that must hold true on specified clock edges.
* `assume(...)`: Environmental constraints for formal solvers.
* `cover(...)`: Trace reachability conditions.

## CLI Command

Execute formal proof check:
```bash
logicforge formal
```

