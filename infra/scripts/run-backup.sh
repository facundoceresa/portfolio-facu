#!/bin/sh
set -eu
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
out="/backup/out/portfolio-${stamp}.dump"
export PGPASSWORD="$(cat /run/secrets/postgres_password)"
pg_dump -h db -U portfolio -d portfolio -Fc -f "$out"
test -s "$out"
echo "$out"
