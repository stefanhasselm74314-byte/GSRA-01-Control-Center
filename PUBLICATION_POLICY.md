# GSRA-01 Public Publication Policy

## Purpose

`GSRA-01-Control-Center` is a publication and visualization layer only. It is not the canonical research repository.

## Allowed content

- static HTML/CSS/JavaScript required by the public interface
- explicitly released solver status summaries
- derived visualization values that are already approved for public display
- public scientific/evidence labels

## Prohibited content

- credentials, tokens, private URLs containing access material, secrets or environment values
- unpublished/private project documents
- private raw data not explicitly cleared for publication
- private solver implementation copied merely for convenience
- any runtime dependency on the private GSRA research repository

## Trust boundary

The information flow is one way unless a later interface contract is explicitly ratified:

`private research core -> reviewed public export -> Control Center`

The public site must continue to function if the private repository is unavailable.

## Evidence firewall

A public visualization does not change scientific status. In particular:

- kinematic solution != propulsion feasibility
- numerical success != physical validation
- mathematical consistency != engineering realizability
- HZT-derived candidates remain non-mission-critical unless separately promoted through GSRA governance
