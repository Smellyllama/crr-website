// Guards the seam between the two schemas.
//
// src/content.config.ts and public/admin/config.yml describe the same content
// twice. Astro already shouts when a file breaks its own schema, so the failure
// it cannot see is the opposite one: a frontmatter key that no CMS field
// declares. That key is invisible in the editor, and because Sveltia rebuilds
// each file from the fields it knows about, editing such an entry through the
// CMS can drop the key on save — losing content that nothing in the build
// would have flagged.
//
// So: walk every content file, and assert each frontmatter key is declared by
// the collection's CMS fields. Runs before `astro build`.
//
// A change to one schema is a change to both, in the same commit.

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parse } from 'yaml';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CONFIG = join(ROOT, 'public/admin/config.yml');
const CONTENT = join(ROOT, 'src/content');

const red = (s) => `[31m${s}[0m`;
const yellow = (s) => `[33m${s}[0m`;
const dim = (s) => `[2m${s}[0m`;

/** Frontmatter is everything between the first pair of `---` lines. */
const readFrontMatter = (file) => {
  const match = readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? parse(match[1]) : null;
};

/** Every dotted path a collection's field list declares, e.g. `races.distance.unit`. */
const declaredPaths = (fields, prefix = '') => {
  const out = new Set();
  for (const field of fields ?? []) {
    const path = prefix ? `${prefix}.${field.name}` : field.name;
    out.add(path);
    // Object and list sub-fields, plus the variable-type `types` form.
    const children = field.fields ?? field.types?.flatMap((t) => t.fields ?? []);
    for (const child of declaredPaths(children, path)) out.add(child);
  }
  return out;
};

/**
 * Every dotted path a parsed frontmatter object actually uses. List indices are
 * collapsed, so `races[0].name` and `races[1].name` both read as `races.name` —
 * the CMS declares one field for the whole list.
 */
const usedPaths = (value, prefix, out) => {
  if (Array.isArray(value)) {
    value.forEach((item) => usedPaths(item, prefix, out));
  } else if (value && typeof value === 'object' && !(value instanceof Date)) {
    for (const [key, child] of Object.entries(value)) {
      const path = prefix ? `${prefix}.${key}` : key;
      out.add(path);
      usedPaths(child, path, out);
    }
  }
  return out;
};

const markdownIn = (dir) =>
  readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .map((name) => join(dir, name));

const config = parse(readFileSync(CONFIG, 'utf8'));
const problems = [];
const covered = new Set();

for (const collection of config.collections) {
  if (collection.folder) {
    const dir = join(ROOT, collection.folder);
    covered.add(collection.folder);
    if (!existsSync(dir)) {
      problems.push(`Collection "${collection.name}" points at ${collection.folder}, which does not exist.`);
      continue;
    }
    const declared = declaredPaths(collection.fields);
    for (const file of markdownIn(dir)) {
      const frontMatter = readFrontMatter(file);
      if (!frontMatter) {
        problems.push(`${relative(ROOT, file)} has no frontmatter.`);
        continue;
      }
      for (const path of usedPaths(frontMatter, '', new Set())) {
        if (!declared.has(path)) {
          problems.push(
            `${relative(ROOT, file)} uses "${path}", which no field in the ` +
              `"${collection.name}" CMS collection declares.`,
          );
        }
      }
    }
  } else {
    for (const entry of collection.files ?? []) {
      covered.add(entry.file.replace(/\/[^/]+$/, ''));
      const file = join(ROOT, entry.file);
      if (!existsSync(file)) {
        problems.push(`Collection file "${collection.name}/${entry.name}" points at ${entry.file}, which does not exist.`);
        continue;
      }
      const declared = declaredPaths(entry.fields);
      const frontMatter = readFrontMatter(file);
      if (!frontMatter) {
        problems.push(`${relative(ROOT, file)} has no frontmatter.`);
        continue;
      }
      for (const path of usedPaths(frontMatter, '', new Set())) {
        if (!declared.has(path)) {
          problems.push(
            `${relative(ROOT, file)} uses "${path}", which no field in the ` +
              `"${collection.name}/${entry.name}" CMS collection declares.`,
          );
        }
      }
    }
  }
}

// A whole collection added to src/content/ but never given a CMS collection is
// the same failure one level up: nobody can edit it, and nobody finds out.
for (const name of readdirSync(CONTENT)) {
  const dir = join(CONTENT, name);
  if (!statSync(dir).isDirectory()) continue;
  if (!markdownIn(dir).length) continue; // e.g. the images/ folders
  const asConfigured = `src/content/${name}`;
  if (![...covered].some((path) => path === asConfigured)) {
    problems.push(`${asConfigured} holds Markdown but no CMS collection covers it.`);
  }
}

if (problems.length) {
  console.error(red(`\n✗ CMS schema drift — ${problems.length} problem(s)\n`));
  for (const problem of problems) console.error(`  ${red('•')} ${problem}`);
  console.error(
    yellow(
      '\n  public/admin/config.yml and src/content.config.ts have to describe the\n' +
        '  same fields. Add the missing field(s) to the CMS config.\n',
    ),
  );
  process.exit(1);
}

console.log(dim('✓ CMS schema mirrors the content — no undeclared frontmatter keys.'));
