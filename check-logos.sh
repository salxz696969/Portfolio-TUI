#!/usr/bin/env bash
# Run chafa 2x2 on all logo files in src/logos/
# Shows raw ANSI-colored output (what you see in terminal)
set -e

LOGO_DIR="$(dirname "$0")/src/logos"

run() {
  local name="$1" file="$2"
  printf "\n  %-14s → " "$name"
  chafa -s 2x2 "$file" 2>/dev/null
  echo
}

echo "=== Your downloaded logos (chafa 2x2) ==="
run "JavaScript" "$LOGO_DIR/JavaScript-logo.png"
run "TypeScript" "$LOGO_DIR/Typescript_logo_2020.svg.webp"
run "Python"     "$LOGO_DIR/Python-logo-notext.svg.webp"
run "Express"    "$LOGO_DIR/express.webp"
run "FastAPI"    "$LOGO_DIR/fastapi.svg"
run "NestJS"     "$LOGO_DIR/NestJS.svg"
run "Next.js"    "$LOGO_DIR/nextjs.png"
run "PostgreSQL" "$LOGO_DIR/Postgresql_elephant.svg.webp"
run "MongoDB"    "$LOGO_DIR/mongodb.png"
run "MySQL"      "$LOGO_DIR/mysql.png"
run "Redis"      "$LOGO_DIR/redis.webp"
run "SQLite"     "$LOGO_DIR/sqlite_logo_icon_169724.webp"
run "React"      "$LOGO_DIR/react.png "
echo
echo "=== Done ==="
echo "React, NestJS, MySQL produce blank output (too detailed for 2x2)."
echo "Fallback icons used from skillicons.dev in skills.ts."
