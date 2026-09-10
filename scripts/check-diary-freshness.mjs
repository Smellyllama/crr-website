// Which diary entries are running on stale evidence.
//
// Every rule in the race diary was worked out from club race reports. When the
// thirty seed entries were checked against the organisers in September 2026,
// the errors sorted themselves almost perfectly by age: every entry whose only
// evidence was a 2017 or 2018 report was wrong — dead, renamed, or moved to a
// different month — and every entry with a recent report was still real.
//
// Three of them had stopped entirely. One had moved from February to March.
// One had been renamed and shortened. That is not a coincidence, it is what
// happens to an annual race over eight years, and it will happen again to the
// entries that look fine today.
//
// So this prints the entries whose newest published report is older than the
// threshold. It does not fail the build: these entries are not wrong, they are
// unverified, and the page already says so — an approximate date renders as
// "usually the last Sunday in November" and never as a day. Failing the build
// would punish whoever pushes next for a race nobody has run since 2018.
//
// It is a worklist. Pair it with the monthly job in docs/race-diary.md.

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parse } from 'yaml';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const YEARS = 3;

const yellow = (s) => `\x1b[33m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

const frontMatter = (file) => {
  const text = readFileSync(file, 'utf8');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? (parse(match[1]) ?? {}) : {};
};

const read = (dir) =>
  readdirSync(join(ROOT, dir))
    .filter((f) => f.endsWith('.md'))
    .map((f) => ({ file: f, data: frontMatter(join(ROOT, dir, f)) }));

// Newest race date per race name, from published reports only. A draft is not
// evidence — nobody has reviewed it, and it is not on the site.
const newestByRace = new Map();
for (const { data } of read('src/content/race-reports')) {
  if (data.draft) continue;
  for (const race of data.races ?? []) {
    const date = new Date(race.raceDate);
    const current = newestByRace.get(race.name);
    if (!current || date > current) newestByRace.set(race.name, date);
  }
}

const cutoff = new Date();
cutoff.setFullYear(cutoff.getFullYear() - YEARS);

const stale = [];
for (const { file, data } of read('src/content/calendar-events')) {
  // Anything not being listed has already been decided about, and a date a
  // human has checked with the organiser needs no chasing. A confirmed date
  // that has already passed does, which is why it is compared rather than
  // trusted — the same guard the page applies before printing a day.
  const status = data.status ?? 'active';
  if (status === 'dormant' || status === 'retired') continue;

  // A fixed date cannot drift — the Chard Flyer is New Year's Day whatever the
  // year — so there is nothing for anybody to go and check.
  if (data.fixedDate) continue;
  if (data.dateConfirmed && data.date && new Date(data.date) >= new Date()) continue;

  const names = [data.name, ...(data.aliases ?? [])];
  const newest = names
    .map((name) => newestByRace.get(name))
    .filter(Boolean)
    .sort((a, b) => b - a)[0];

  if (!newest || newest < cutoff) {
    stale.push({
      file,
      name: data.name,
      newest: newest ? newest.toISOString().slice(0, 10) : 'no published report',
    });
  }
}

if (!stale.length) {
  console.log(dim(`✓ Every unconfirmed diary entry has a report from the last ${YEARS} years.`));
} else {
  console.log(
    yellow(`\n! ${stale.length} diary entr${stale.length === 1 ? 'y is' : 'ies are'} running on evidence older than ${YEARS} years`),
  );
  for (const entry of stale) {
    console.log(`  ${yellow('•')} ${entry.name.padEnd(32)} ${dim(entry.newest)}`);
  }
  console.log(
    dim(
      '\n  Not an error — these render as approximate, which is honest. But when\n' +
        '  the seed entries were checked, being this old was what predicted being\n' +
        '  wrong. Check one with the organiser, then set its date and tick\n' +
        '  dateConfirmed \u2014 or set its status to dormant or retired.\n' +
        '  See docs/race-diary.md.\n',
    ),
  );
}
