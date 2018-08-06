# Cloudflare workers scripts

This repo contains a versioned list of scripts for use with cloudflare's workers.

## CI/CD

Automated deployments are handled using bitbucket pipelines, the detail of which can be seen in `bitbucket-pipelines.yml` in the root of the repo (pretty simple to repurpose for Gitlab CI). This runner runs two tasks:

- Deploy updated scripts to cloudflare, using the [Enterprise API](https://developers.cloudflare.com/workers/api/config-api-for-enterprise/)
- Deploy json configuration to azure blob storage using the SAS key generated on this container.

In order to use this functionality you will need to add the following variables to Bitbucket pipelines:

- AZURE_ACCESS_KEY
- AZURE_CONTAINER_NAME
- AZURE_STORAGE_ACCOUNT
- CF_ACCOUNT_TAG (found in Cloudflare dashboard)
- CF_AUTH_KEY (found in Cloudflare portal auth)
- CF_LOGIN_EMAIL
