#!/usr/bin/env node
// Idempotently asserts that this Vercel project has no SSO/password/deployment
// protection before deploy. Defends against team-default drift (Vercel has been
// observed auto-applying ssoProtection to new projects on the Hobby plan).
//
// Run via: npm run ensure-no-sso (or transitively via npm run deploy).
// Reads project linkage from .vercel/project.json and CLI auth token from
// the standard Vercel CLI location.

import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const PROJECT = JSON.parse(fs.readFileSync(".vercel/project.json", "utf8"));
const AUTH = JSON.parse(
  fs.readFileSync(
    path.join(os.homedir(), ".local/share/com.vercel.cli/auth.json"),
    "utf8"
  )
);
const url = `https://api.vercel.com/v9/projects/${PROJECT.projectId}?teamId=${PROJECT.orgId}`;
const headers = {
  Authorization: `Bearer ${AUTH.token}`,
  "Content-Type": "application/json",
};

const before = await (await fetch(url, { headers })).json();
console.log(
  `[ensure-no-sso] before: ssoProtection=${JSON.stringify(before.ssoProtection)} passwordProtection=${JSON.stringify(before.passwordProtection)} deploymentProtection=${JSON.stringify(before.deploymentProtection)}`
);

const patch = await fetch(url, {
  method: "PATCH",
  headers,
  body: JSON.stringify({
    ssoProtection: null,
    passwordProtection: null,
  }),
});
if (!patch.ok) {
  console.error(
    `[ensure-no-sso] PATCH failed: ${patch.status} ${await patch.text()}`
  );
  process.exit(1);
}
const after = await patch.json();
if (after.ssoProtection !== null || after.passwordProtection !== null) {
  console.error(
    `[ensure-no-sso] FAILED — protection still set after PATCH:`,
    JSON.stringify({
      ssoProtection: after.ssoProtection,
      passwordProtection: after.passwordProtection,
    })
  );
  process.exit(1);
}
console.log(
  `[ensure-no-sso] verified: ssoProtection=null passwordProtection=null (project=${PROJECT.projectId})`
);
