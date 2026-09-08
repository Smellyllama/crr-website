# Weekly rebuild

The race diary is worked out at build time. Without a rebuild it freezes:
races that have already happened stop dropping off, and the twelve-month window stops
rolling forward. This Worker rings a deploy hook once a week so that happens on
its own.

It is deployed separately from the site and shares nothing with it.

## Setting it up

Two steps, both needing the Cloudflare dashboard, and until both are done the
diary still goes stale.

**1. Create the deploy hook.** In the Cloudflare dashboard, open the
`crr-website` Worker, then **Settings → Builds → Deploy hooks**. Create one
named something like `weekly-diary-rebuild`, pointed at the `main` branch, and
copy the URL it gives you. Treat it as a secret: anyone with it can start a
build.

**2. Give it to this Worker and deploy.** From this directory:

```
npx wrangler secret put DEPLOY_HOOK_URL
```

Paste the URL when prompted, then:

```
npx wrangler deploy
```

## Setting it up without a terminal

All of the above can be done from a browser instead, phone included. Slower to
describe, but it needs nothing installed.

Create the deploy hook as in step 1, then in **Workers & Pages → Create
application**, connect the `Smellyllama/crr-website` repository and set **Root
directory** to `workers/diary-rebuild` under the build settings. Leave the
deploy command at its default `npx wrangler deploy`. Cloudflare then builds this
directory on its own machines, reading the `wrangler.jsonc` here, so the weekly
schedule comes across with it.

Then add the secret: the new Worker's **Settings → Variables and Secrets →
Add**, type **Secret**, name `DEPLOY_HOOK_URL`, paste the URL, **Deploy**.

One side effect worth knowing: connecting the repository means every push to
`main` rebuilds this Worker as well as the site. Harmless — it is twenty lines
and builds in seconds — but it will show up as a second build every time.

The cron itself can also be set or changed here, in **Settings → Triggers →
Cron Triggers**. Prefer changing `wrangler.jsonc` when you can, so the schedule
stays written down in the repository rather than living only in a dashboard
nobody thinks to look at.

## Checking it works

`npx wrangler tail crr-diary-rebuild` shows the scheduled runs. A successful one
logs "Rebuild requested"; a failure throws, so it shows up rather than passing
quietly.

To test without waiting for Monday:

```
npx wrangler dev --test-scheduled
```

then visit `http://localhost:8787/__scheduled` in another terminal or a browser.

## Changing the schedule

`triggers.crons` in `wrangler.jsonc`, standard cron syntax, UTC. Weekly is
enough: the diary only changes when a month rolls over or somebody edits an
entry, and an edit already triggers its own build.
