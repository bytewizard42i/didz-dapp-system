# DIDz review and repair punch list

Clara, September 5, 2026. Reviewed revision: `3ed1fc23262cd1c57455754f871d6b4557f311a3`.

## High priority: build errors are swallowed

`didz-contract/package.json:29` ends its entire build chain with `|| true`. In an isolated fixture, a simulated compiler exit of 42 produced an overall success exit of 0. This was a shell-control reproduction, not a contract compilation. A consumer can be told the package built when declarations or compiled bindings are missing.

Repair: make compilation failure fatal; treat generated-artifact copying explicitly and fail if required exported files are absent. Preserve the original package manifest. Done means a deliberately failing compiler causes a failing build, missing required managed outputs fail, and a real supported-toolchain build produces every exported target.

## Integration boundary

The shared kernel still serves granted rows to a suspended identity in the synthetic reference-provider reproduction. Ownership and identity facts are not sufficient by themselves to authorize a read. Require active lifecycle state and exact-request authorization at the boundary. See the monolith review for reproduction details and done criteria.

## Compatibility follow-up

The contract package declares Compact runtime `0.14.0`; the [official support matrix](https://docs.midnight.network/relnotes/support-matrix), checked September 5, lists `0.16.0` in the tested combinations. This identifies drift, not proof the older package is broken. Reconcile compiler, generated bindings, runtime and ledger together before upgrading. Dependencies were not installed or changed in this pass.

The two pending artwork files were visually inspected before backup. Their exact names and contents are preserved.
