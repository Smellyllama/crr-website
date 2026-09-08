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
