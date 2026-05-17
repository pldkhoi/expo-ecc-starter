#!/usr/bin/env bun
/**
 * Interactive template initializer.
 *
 * Renames the project, updates bundle identifiers, swaps the template README
 * for a starter project README, optionally removes sample code, and (optionally)
 * resets git history.
 *
 * Usage:
 *   bun scripts/init-template.ts                  # interactive
 *   bun scripts/init-template.ts --dry-run        # print planned changes only
 *   bun scripts/init-template.ts --yes            # accept defaults, no prompts
 *   bun scripts/init-template.ts --reset-git      # reinitialize git history
 *
 * Flags can be combined: `--yes --reset-git --dry-run`.
 */

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

type Args = {
  dryRun: boolean;
  yes: boolean;
  resetGit: boolean;
};

type Answers = {
  projectName: string;
  slug: string;
  scheme: string;
  iosBundleId: string;
  androidPackage: string;
  primaryColor: string;
  gitRemote: string;
  resetGit: boolean;
  removeSamples: boolean;
};

const REPO_ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');

const DEFAULTS = {
  projectName: basename(REPO_ROOT),
  primaryColor: '#0a7ea4',
};

const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function paint(color: keyof typeof COLORS, text: string): string {
  return `${COLORS[color]}${text}${COLORS.reset}`;
}

function parseArgs(argv: string[]): Args {
  return {
    dryRun: argv.includes('--dry-run'),
    yes: argv.includes('--yes') || argv.includes('-y'),
    resetGit: argv.includes('--reset-git'),
  };
}

function toSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toScheme(slug: string): string {
  return slug.replace(/-/g, '');
}

function isValidBundleId(value: string): boolean {
  return /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/.test(value);
}

function isValidHexColor(value: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
}

async function prompt(
  rl: ReturnType<typeof createInterface>,
  question: string,
  fallback: string,
): Promise<string> {
  const suffix = fallback ? paint('dim', ` (${fallback})`) : '';
  const answer = (await rl.question(`${paint('cyan', '?')} ${question}${suffix} `)).trim();
  return answer || fallback;
}

async function promptYesNo(
  rl: ReturnType<typeof createInterface>,
  question: string,
  defaultYes: boolean,
): Promise<boolean> {
  const hint = defaultYes ? 'Y/n' : 'y/N';
  const answer = (
    await rl.question(`${paint('cyan', '?')} ${question} ${paint('dim', `[${hint}]`)} `)
  )
    .trim()
    .toLowerCase();
  if (!answer) return defaultYes;
  return answer === 'y' || answer === 'yes';
}

async function collectAnswers(args: Args): Promise<Answers> {
  const rl = createInterface({ input, output });
  try {
    if (args.yes) {
      const slug = toSlug(DEFAULTS.projectName);
      return {
        projectName: DEFAULTS.projectName,
        slug,
        scheme: toScheme(slug),
        iosBundleId: `com.${toScheme(slug)}.app`,
        androidPackage: `com.${toScheme(slug)}.app`,
        primaryColor: DEFAULTS.primaryColor,
        gitRemote: '',
        resetGit: args.resetGit,
        removeSamples: true,
      };
    }

    console.log(paint('bold', '\n  Expo template initializer\n'));
    console.log(paint('dim', '  Press Enter to accept the default in parentheses.\n'));

    const projectName = await prompt(rl, 'Project name', DEFAULTS.projectName);
    const slug = await prompt(rl, 'Project slug (kebab-case)', toSlug(projectName));
    const scheme = await prompt(rl, 'Deep-link scheme (alphanumeric)', toScheme(slug));
    const defaultBundle = `com.${toScheme(slug)}.app`;

    let iosBundleId = await prompt(rl, 'iOS bundle identifier', defaultBundle);
    while (!isValidBundleId(iosBundleId)) {
      console.log(paint('red', '  ! Bundle identifier must be reverse-DNS, e.g. com.acme.app'));
      iosBundleId = await prompt(rl, 'iOS bundle identifier', defaultBundle);
    }

    let androidPackage = await prompt(rl, 'Android package name', iosBundleId);
    while (!isValidBundleId(androidPackage)) {
      console.log(paint('red', '  ! Package name must be reverse-DNS, e.g. com.acme.app'));
      androidPackage = await prompt(rl, 'Android package name', iosBundleId);
    }

    let primaryColor = await prompt(rl, 'Primary tint (hex)', DEFAULTS.primaryColor);
    while (!isValidHexColor(primaryColor)) {
      console.log(paint('red', '  ! Color must be a hex string, e.g. #0a7ea4'));
      primaryColor = await prompt(rl, 'Primary tint (hex)', DEFAULTS.primaryColor);
    }

    const gitRemote = await prompt(rl, 'Git remote URL (optional, blank to skip)', '');
    const removeSamples = await promptYesNo(
      rl,
      'Remove sample code (counter store, explore tab)?',
      true,
    );
    const resetGit = args.resetGit
      ? true
      : await promptYesNo(rl, 'Reset git history (start fresh repository)?', false);

    return {
      projectName,
      slug,
      scheme,
      iosBundleId,
      androidPackage,
      primaryColor,
      gitRemote,
      resetGit,
      removeSamples,
    };
  } finally {
    rl.close();
  }
}

async function readJson<T>(path: string): Promise<T> {
  const raw = await readFile(path, 'utf8');
  return JSON.parse(raw) as T;
}

async function writeJson(path: string, value: unknown): Promise<void> {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function applyPackageJson(answers: Answers, dryRun: boolean): Promise<void> {
  const path = join(REPO_ROOT, 'package.json');
  const pkg = await readJson<Record<string, unknown>>(path);
  pkg.name = answers.slug;
  pkg.version = '0.0.1';
  if (dryRun) {
    console.log(
      paint('dim', `  dry-run: would update ${path} (name=${answers.slug}, version=0.0.1)`),
    );
    return;
  }
  await writeJson(path, pkg);
  console.log(paint('green', `  ✓ package.json updated`));
}

async function applyAppJson(answers: Answers, dryRun: boolean): Promise<void> {
  const path = join(REPO_ROOT, 'app.json');
  const config = await readJson<{ expo: Record<string, unknown> }>(path);
  const expo = config.expo;
  expo.name = answers.projectName;
  expo.slug = answers.slug;
  expo.scheme = answers.scheme;
  expo.version = '0.0.1';
  const ios = (expo.ios ?? {}) as Record<string, unknown>;
  ios.bundleIdentifier = answers.iosBundleId;
  expo.ios = ios;
  const android = (expo.android ?? {}) as Record<string, unknown>;
  android.package = answers.androidPackage;
  expo.android = android;
  if (dryRun) {
    console.log(paint('dim', `  dry-run: would update ${path}`));
    return;
  }
  await writeJson(path, config);
  console.log(paint('green', `  ✓ app.json updated`));
}

async function applyThemeColor(answers: Answers, dryRun: boolean): Promise<void> {
  const path = join(REPO_ROOT, 'src/theme/colors.ts');
  if (!existsSync(path)) return;
  const original = await readFile(path, 'utf8');
  const updated = original.replace(
    /const tintLight = '#[0-9a-fA-F]+';/,
    `const tintLight = '${answers.primaryColor}';`,
  );
  if (updated === original) {
    console.log(paint('yellow', `  ! could not locate tintLight in ${path}; skipped`));
    return;
  }
  if (dryRun) {
    console.log(paint('dim', `  dry-run: would set tintLight=${answers.primaryColor} in ${path}`));
    return;
  }
  await writeFile(path, updated, 'utf8');
  console.log(paint('green', `  ✓ theme primary color set to ${answers.primaryColor}`));
}

async function applyReadme(answers: Answers, dryRun: boolean): Promise<void> {
  const path = join(REPO_ROOT, 'README.md');
  const body = `# ${answers.projectName}

> Bootstrapped from the [expo-ecc-starter](https://github.com/affaan-m/everything-claude-code) template.

## Stack

Expo SDK 55 · Expo Router 6 · React 19.2 · React Native 0.83 · TypeScript 5.9 strict · Zustand 5 · TanStack Query 5 · React Hook Form + Zod · Bun 1.3

## Quickstart

\`\`\`bash
bun install
cp .env.example .env.local

bun dev          # Metro on port 8081
#   press i → iOS simulator
#   press a → Android emulator
#   press w → Web preview
\`\`\`

## Verify

\`\`\`bash
bun type-check
bun lint
bun test
bun security:scan
\`\`\`

## Project structure

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Conventions

See [CLAUDE.md](CLAUDE.md) for the full workflow, conventions, and AI agent orchestration.

## License

Choose a license and add a \`LICENSE\` file at the repo root.
`;
  if (dryRun) {
    console.log(paint('dim', `  dry-run: would rewrite ${path}`));
    return;
  }
  await writeFile(path, body, 'utf8');
  console.log(paint('green', `  ✓ README.md rewritten`));
}

async function applyChangelog(answers: Answers, dryRun: boolean): Promise<void> {
  const path = join(REPO_ROOT, 'CHANGELOG.md');
  const today = new Date().toISOString().slice(0, 10);
  const body = `# Changelog

All notable changes to ${answers.projectName} are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.0.1] - ${today}

### Added

- Bootstrapped from expo-ecc-starter template.
`;
  if (dryRun) {
    console.log(paint('dim', `  dry-run: would reset ${path}`));
    return;
  }
  await writeFile(path, body, 'utf8');
  console.log(paint('green', `  ✓ CHANGELOG.md reset`));
}

async function applyEnvLocal(dryRun: boolean): Promise<void> {
  const src = join(REPO_ROOT, '.env.example');
  const dest = join(REPO_ROOT, '.env.local');
  if (!existsSync(src) || existsSync(dest)) return;
  if (dryRun) {
    console.log(paint('dim', `  dry-run: would copy ${src} → ${dest}`));
    return;
  }
  const content = await readFile(src, 'utf8');
  await writeFile(dest, content, 'utf8');
  console.log(paint('green', `  ✓ .env.local created from .env.example`));
}

async function removeSamples(dryRun: boolean): Promise<void> {
  const targets = [
    join(REPO_ROOT, 'src/hooks/use-pokemon.ts'),
    join(REPO_ROOT, 'src/hooks/__tests__/use-pokemon.test.ts'),
    join(REPO_ROOT, 'src/lib/format-date.ts'),
    join(REPO_ROOT, 'src/lib/__tests__/format-date.test.ts'),
  ];
  for (const target of targets) {
    if (!existsSync(target)) continue;
    if (dryRun) {
      console.log(paint('dim', `  dry-run: would delete ${target}`));
      continue;
    }
    await rm(target, { force: true });
    console.log(paint('green', `  ✓ removed ${target.replace(`${REPO_ROOT}/`, '')}`));
  }
}

function runGit(args: string[], options: { dryRun: boolean; description: string }): void {
  if (options.dryRun) {
    console.log(paint('dim', `  dry-run: ${options.description}`));
    return;
  }
  try {
    execSync(`git ${args.join(' ')}`, { cwd: REPO_ROOT, stdio: 'pipe' });
    console.log(paint('green', `  ✓ ${options.description}`));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(paint('yellow', `  ! ${options.description} failed: ${message.split('\n')[0]}`));
  }
}

async function applyGit(answers: Answers, dryRun: boolean): Promise<void> {
  if (answers.resetGit) {
    if (dryRun) {
      console.log(paint('dim', `  dry-run: would delete .git/ and run "git init"`));
    } else {
      await rm(join(REPO_ROOT, '.git'), { recursive: true, force: true });
      runGit(['init', '-b', 'main'], { dryRun: false, description: 'git initialized on main' });
      runGit(['add', '.'], { dryRun: false, description: 'initial files staged' });
      runGit(['commit', '-m', `"chore: bootstrap ${answers.projectName} from expo-ecc-starter"`], {
        dryRun: false,
        description: 'initial commit created',
      });
    }
  }

  if (answers.gitRemote) {
    runGit(['remote', 'remove', 'origin'], {
      dryRun,
      description: 'removed existing origin (if any)',
    });
    runGit(['remote', 'add', 'origin', answers.gitRemote], {
      dryRun,
      description: `set git remote origin → ${answers.gitRemote}`,
    });
  }
}

function summarize(answers: Answers): void {
  console.log(paint('bold', '\n  Summary'));
  const rows: [string, string][] = [
    ['Project name', answers.projectName],
    ['Slug', answers.slug],
    ['Scheme', answers.scheme],
    ['iOS bundle ID', answers.iosBundleId],
    ['Android package', answers.androidPackage],
    ['Primary color', answers.primaryColor],
    ['Git remote', answers.gitRemote || paint('dim', '(none)')],
    ['Remove samples', answers.removeSamples ? 'yes' : 'no'],
    ['Reset git history', answers.resetGit ? 'yes' : 'no'],
  ];
  for (const [key, value] of rows) {
    console.log(`    ${paint('dim', key.padEnd(20))} ${value}`);
  }
  console.log('');
}

function printNextSteps(answers: Answers): void {
  console.log(paint('bold', '\n  Next steps\n'));
  const steps = [
    `bun install`,
    `cp .env.example .env.local  ${paint('dim', '# already copied if missing')}`,
    `bun dev`,
    `bun test`,
    `bun security:scan`,
  ];
  for (const step of steps) {
    console.log(`    ${paint('green', '→')} ${step}`);
  }
  console.log(
    `\n  Read ${paint('cyan', 'docs/SETUP.md')} for the full onboarding guide and ${paint('cyan', 'CLAUDE.md')} for the AI workflow.\n`,
  );
  console.log(
    paint(
      'dim',
      `  This script is at scripts/init-template.ts — remove it from package.json if you do not plan to re-run it.\n`,
    ),
  );
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  console.log(paint('bold', '\n  expo-ecc-starter — template initializer'));
  if (args.dryRun) console.log(paint('yellow', '  DRY RUN: no files will be modified.\n'));

  const answers = await collectAnswers(args);
  summarize(answers);

  if (!args.yes) {
    const rl = createInterface({ input, output });
    const ok = await promptYesNo(rl, 'Apply these changes?', true);
    rl.close();
    if (!ok) {
      console.log(paint('yellow', '\n  Aborted. No files modified.\n'));
      process.exit(0);
    }
  }

  console.log(paint('bold', '\n  Applying changes...\n'));
  await applyPackageJson(answers, args.dryRun);
  await applyAppJson(answers, args.dryRun);
  await applyThemeColor(answers, args.dryRun);
  await applyReadme(answers, args.dryRun);
  await applyChangelog(answers, args.dryRun);
  await applyEnvLocal(args.dryRun);
  if (answers.removeSamples) await removeSamples(args.dryRun);
  await applyGit(answers, args.dryRun);

  printNextSteps(answers);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(paint('red', `\n  ✗ Init failed: ${message}\n`));
  process.exit(1);
});

// Silence unused warning for helpers reserved for future use.
void mkdir;
