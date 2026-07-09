# Terraform modules (HelixChain integration)

This app provisions its shared-data-plane infrastructure from the central
**DIDzM Terraform module compendium**, not by hand.

- **Compendium repo**: `bytewizard42i/terraform-modules`
- **Full usage guide**: see the compendium's `CONSUMING.md`
- **Companion doc**: `docs/HELIXCHAIN_INTEGRATION.md` (which tables this app touches)

## Module for this app: `helixchain-integration`

Provisions, for DIDz-io: a per-app CockroachDB database, a least-privilege login
role, table grants, and (optionally) the connection string in AWS Secrets
Manager. As the root identity layer, DIDz-io owns identity writes.

### Recommended: direct git source (pin a version tag)

```hcl
# infra/terraform/main.tf
module "helixchain" {
  source = "git::https://github.com/bytewizard42i/terraform-modules.git//modules/helixchain-integration?ref=v0.1.0"

  app_name     = "didz_io"
  db_password  = var.didz_io_db_password   # TF_VAR_didz_io_db_password
  cluster_host = var.cluster_host
  grants = {
    identities  = ["SELECT", "INSERT", "UPDATE"]   # canonical identity registry
    credentials = ["SELECT"]
  }
}
```

### Alternative: vendored submodule (offline/pinned local copy)

```bash
git submodule add https://github.com/bytewizard42i/terraform-modules.git \
  infra/terraform/vendor/didzm-modules
# then source = "./vendor/didzm-modules/modules/helixchain-integration"
```

## Rules

1. Never hard-code `db_password` — use `TF_VAR_*` or a secrets backend.
2. Configure an S3 + DynamoDB remote backend before `apply`.
3. `terraform plan` and review every resource before `terraform apply`.
4. Apply DB schema with `psql` after apply — schema is not managed by Terraform.
