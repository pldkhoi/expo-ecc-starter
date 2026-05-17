#!/usr/bin/env bash
# Wrapper around `agentshield scan --baseline ... --gate`.
#
# ecc-agentshield 1.4 exits with code 2 whenever the report contains any
# CRITICAL finding, even when the gate comparison says
# "Gate: PASSED - No regressions detected". We carry one baselined CRITICAL
# (a false positive: the `--no-verify` literal inside a `deny` rule in
# .claude/settings.json) that cannot be removed without weakening security.
# This wrapper translates that specific combination (exit 2 + PASSED gate)
# into exit 0 while still propagating real regressions (exit 3) and any
# unexpected non-zero exit untouched.

set +e
output=$(agentshield scan --baseline .agentshield/baseline.json --gate 2>&1)
code=$?
printf '%s\n' "$output"

if [ "$code" -eq 0 ]; then
  exit 0
fi

if [ "$code" -eq 2 ] && printf '%s' "$output" | grep -q "Gate: PASSED"; then
  printf '\n[security-gate] Exit 2 from agentshield ignored: gate passed; only baselined CRITICAL findings present.\n'
  exit 0
fi

exit "$code"
