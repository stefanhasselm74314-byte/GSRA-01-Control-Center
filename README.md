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

## Current public interface

- interactive GS-01 mission/relativity calculator
- coordinate time, proper time, Lorentz factor and specific kinetic energy
- idealized symmetric constant-proper-acceleration envelope
- travel-time trade chart
- public status view for all 20 GSRA solver workstreams
- evidence/status architecture
- explicit HZT firewall (`HZT propulsion = BLOCKED`)
- responsive desktop/mobile layout

## Scientific firewall

The interface must preserve these non-equivalences:

`kinematic solution != propulsion feasibility != energy/thermal closure != engineering realizability`

Publishing a value here does not promote it to a frozen GSRA architecture result.

## GitHub Pages

The site is structured for publication from:

- Branch: `main`
- Folder: `/(root)`

Expected URL after Pages is enabled:

`https://stefanhasselm74314-byte.github.io/GSRA-01-Control-Center/`

## Version

Control Center `v0.1`.
