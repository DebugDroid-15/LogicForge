# LogicForge — Timing Analysis Specification

LogicForge extracts timing reports directly from place-and-route outputs (such as `nextpnr` timing analysis).

---

## Timing Metrics & Slack Calculation

- **Required Period ($T_{req}$)**: Target clock period derived from constraint files or target frequency (e.g. 10.00 ns for 100MHz).
- **Actual Period ($T_{act}$)**: Longest propagation delay along critical paths.
- **Worst Setup Slack ($S_{setup}$)**:
  $$S_{setup} = T_{req} - T_{act}$$

### Status Evaluation Rules
- **Pass**: $S_{setup} \ge 0.00\text{ ns}$
- **Fail / Violation**: $S_{setup} < 0.00\text{ ns}$

---

## Critical Path Element Decomposition

Critical paths are represented as ordered DAG elements:
1. Source Flip-Flop (`FF` clock-to-q delay)
2. Logic Primitive Combinational Delays (`LUT4`, `BRAM`)
3. Interconnect Net Routing Delays (`NET`)
4. Destination Flip-Flop (`FF` setup time)

