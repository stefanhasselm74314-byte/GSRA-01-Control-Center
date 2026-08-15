# GSRA-01 Control Center

Public, static visualization layer for the **GSRA-01 — Generation Ship Reference Architecture** research program.

## Separation model

This repository is intentionally **public** and contains only material approved for web publication.

The canonical engineering/research core remains in the separate private repository `GSRA-01-Generation-Ship` and is not a runtime dependency of this site.

```text
Private Research Core
        ↓ controlled export only
Public GSRA-01 Control Center
```

No private solver implementation, unpublished project document, secret, token, or private repository content may be pulled at runtime by this site.

## Control Center v0.2

The public interface now provides:

- interactive GS-01 mission/relativity calculator
- coordinate time, proper time, Lorentz factor and specific kinetic energy
- idealized symmetric constant-proper-acceleration envelope
- travel-time trade chart
- program-level release and gate matrix
- clickable detail views for all 20 GSRA solver workstreams
- public dependency/output/next-gate metadata for each solver
- conceptual, explicitly non-dimensional ship architecture
- system budget dashboard with OPEN values instead of invented precision
- evidence/status architecture
- explicit HZT firewall (`HZT propulsion = BLOCKED`)
- responsive desktop/mobile layout
- machine-readable public state under `data/public-state.json`

## Scientific firewall

The interface must preserve these non-equivalences:

`kinematic solution != propulsion feasibility != energy/thermal closure != engineering realizability`

Publishing a value here does not promote it to a frozen GSRA architecture result.

## Current public research state

- `GS-01 Mission & Relativity`: `ACTIVE / DESIGN_ENVELOPE_v0.2`
- Cruise velocity: `OPEN / COUPLED_GATE`
- Dry mass: `OPEN`
- Population: `OPEN`
- Habitat geometry: `OPEN`
- HZT propulsion: `BLOCKED`

## GitHub Pages

Publication source:

- Branch: `main`
- Folder: `/(root)`

Live site:

`https://stefanhasselm74314-byte.github.io/GSRA-01-Control-Center/`

## Version

Control Center `v0.2`.
