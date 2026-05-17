#!/usr/bin/env node
// PreToolUse hook: block Write / Edit / MultiEdit calls that would assign a
// secret-like value to an EXPO_PUBLIC_* env variable.
//
// Expo inlines EXPO_PUBLIC_* into the JavaScript bundle that ships with every
// install (web and native), so a secret behind that prefix is shipped to every
// user of the app and is trivially extractable from the .ipa / .apk. There is
// NO "public-to-the-app-only" tier.
//
// Input: JSON on stdin from Claude Code (PreToolUse payload).
// Output: JSON on stdout. To block, print {"decision":"block","reason":"..."} and exit 0.
// To allow, exit 0 with empty stdout.

import { readFileSync } from 'node:fs';

function readStdin() {
  try {
    return readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function allow() {
  process.stdout.write('');
  process.exit(0);
}

function block(reason) {
  process.stdout.write(JSON.stringify({ decision: 'block', reason }));
  process.exit(0);
}

const raw = readStdin();
if (!raw.trim()) allow();

let payload;
try {
  payload = JSON.parse(raw);
} catch {
  allow();
}

const input = payload?.tool_input ?? {};
const candidates = [];

if (typeof input.content === 'string') candidates.push(input.content);
if (typeof input.new_string === 'string') candidates.push(input.new_string);
if (Array.isArray(input.edits)) {
  for (const e of input.edits) {
    if (typeof e?.new_string === 'string') candidates.push(e.new_string);
  }
}
if (candidates.length === 0) allow();

const SECRET_PREFIX_RE =
  /(sk_|pk_live_|AKIA|AGPA|ASIA|ghp_|gho_|ghu_|ghs_|github_pat_|sk-ant-api03-|sk-ant-|sk-proj-|glpat-|xoxb-|xoxp-|xapp-|xoxs-|hf_|nvapi-|rk_live_|rk_test_|EAACE|EAAG)/;
const LONG_TOKEN_RE = /[A-Za-z0-9_\-]{40,}/;
const SECRET_WORD_RE =
  /\b(secret|service[_-]?role|private[_-]?key|jwt[_-]?secret|api[_-]?key|password)\b/i;
const ASSIGN_RE = /EXPO_PUBLIC_[A-Z0-9_]+\s*[:=]\s*['"`]?([^'"`\r\n,;}]+?)['"`]?(?=[\r\n,;}]|$)/gm;
const ALLOWLIST_TAIL_RE =
  /^(true|false|null|undefined|[0-9]+(\.[0-9]+)?|http:\/\/[^\s]+|https?:\/\/[^\s]+)$/i;
const PLACEHOLDER_TAIL_RE =
  /^(your[-_]?|placeholder|changeme|todo|fixme|example|\$\{|process\.env\.)/i;

function looksSecret(value) {
  const v = value.trim();
  if (!v) return false;
  if (ALLOWLIST_TAIL_RE.test(v)) return false;
  if (PLACEHOLDER_TAIL_RE.test(v)) return false;
  if (SECRET_PREFIX_RE.test(v)) return true;
  if (SECRET_WORD_RE.test(v)) return true;
  if (
    LONG_TOKEN_RE.test(v) &&
    /[a-z]/.test(v) &&
    /[A-Z0-9]/.test(v) &&
    !/^[a-z]+([_-][a-z]+)*$/i.test(v)
  ) {
    return true;
  }
  return false;
}

const violations = [];
for (const text of candidates) {
  ASSIGN_RE.lastIndex = 0;
  let m;
  while ((m = ASSIGN_RE.exec(text)) !== null) {
    const value = (m[1] ?? '').trim();
    if (looksSecret(value)) {
      const snippet = m[0].length > 120 ? m[0].slice(0, 117) + '...' : m[0];
      violations.push(snippet);
    }
  }
}

if (violations.length === 0) allow();

const reason = [
  'Refused to write an EXPO_PUBLIC_* environment variable with a secret-looking value.',
  'EXPO_PUBLIC_* vars are inlined into the JavaScript bundle that ships with every install.',
  'Anyone with the .ipa / .apk can extract them — there is no "public to the app only" tier.',
  '',
  'Matched:',
  ...violations.slice(0, 5).map((v) => `  - ${v}`),
  '',
  'Fix one of these ways:',
  '  1. If the value is genuinely public (e.g., a public app URL), rename it so it does not match a secret pattern.',
  '  2. If the value is a secret, drop the EXPO_PUBLIC_ prefix and read it from a server you own (via fetch).',
  '  3. For build-time secrets (Sentry, EAS), store them in EAS Secrets, not in source.',
  '  4. If the heuristic is wrong (false positive), edit .claude/hooks/scripts/expo-public-env-guard.mjs to allowlist this specific case.',
].join('\n');

block(reason);
