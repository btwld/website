#!/bin/bash
# Vercel build script for fluttermix.com
#
# This script runs during Vercel's auto-deploy to:
# 1. Install Flutter SDK
# 2. Build the Flutter preview bundle (interactive widget examples)
# 3. Build the Next.js website
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

fail() { echo "ERROR: $*" >&2; exit 1; }

echo "==> Project root: $PROJECT_DIR"

# ============================================================================
# Install Flutter SDK
# ============================================================================
[ -f "$PROJECT_DIR/.fvmrc" ] || fail ".fvmrc not found at $PROJECT_DIR/.fvmrc"

FLUTTER_VERSION=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$PROJECT_DIR/.fvmrc','utf8')).flutter)")
[ -z "$FLUTTER_VERSION" ] && fail "Could not read Flutter version from .fvmrc"

FLUTTER_DIR="$HOME/flutter"

echo "==> Installing Flutter $FLUTTER_VERSION..."

if [ -d "$FLUTTER_DIR" ] && "$FLUTTER_DIR/bin/flutter" --version 2>/dev/null | grep -q "$FLUTTER_VERSION"; then
    echo "    Flutter $FLUTTER_VERSION already installed (cached)"
else
    rm -rf "$FLUTTER_DIR"
    git clone https://github.com/flutter/flutter.git --branch "$FLUTTER_VERSION" --depth 1 "$FLUTTER_DIR" \
        || fail "Failed to clone Flutter SDK $FLUTTER_VERSION"
fi

export PATH="$FLUTTER_DIR/bin:$FLUTTER_DIR/bin/cache/dart-sdk/bin:$HOME/.pub-cache/bin:$PATH"

command -v flutter >/dev/null 2>&1 || fail "Flutter not found on PATH after install"
command -v dart >/dev/null 2>&1    || fail "Dart not found on PATH after install"

echo "    $(flutter --version | head -1)"

# ============================================================================
# Install Flutter dependencies
# ============================================================================
echo "==> Installing Flutter dependencies..."
cd "$PROJECT_DIR/packages/mix_docs_preview"
flutter pub get

# ============================================================================
# Build Flutter preview bundle
# ============================================================================
echo "==> Building Flutter preview bundle..."
cd "$PROJECT_DIR"
bash "$PROJECT_DIR/packages/mix_docs_preview/scripts/build_web_previews.sh" --local

# Verify the build produced the expected artifacts
BUILD_DIR="$PROJECT_DIR/packages/mix_docs_preview/build/web"
[ -f "$BUILD_DIR/main.dart.js" ]           || fail "Flutter web build missing: main.dart.js"
[ -f "$BUILD_DIR/flutter_bootstrap.js" ]   || fail "Flutter web build missing: flutter_bootstrap.js"
[ -f "$BUILD_DIR/previews-manifest.json" ] || fail "Flutter web build missing: previews-manifest.json"

echo "    Build verified: main.dart.js, flutter_bootstrap.js, previews-manifest.json"

# ============================================================================
# Copy preview bundle to website
# ============================================================================
echo "==> Copying preview bundle to public/previews/..."
rm -rf "$PROJECT_DIR/public/previews"
mkdir -p "$PROJECT_DIR/public/previews"
cp -r "$BUILD_DIR"/* "$PROJECT_DIR/public/previews/"

# Verify the copy succeeded
[ -f "$PROJECT_DIR/public/previews/previews-manifest.json" ] \
    || fail "Preview manifest not found after copy to public/previews/"
[ -f "$PROJECT_DIR/public/previews/main.dart.js" ] \
    || fail "main.dart.js not found after copy to public/previews/"

MANIFEST_ENTRIES=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$PROJECT_DIR/public/previews/previews-manifest.json','utf8')).entries.length)")
echo "    Copied preview bundle ($MANIFEST_ENTRIES preview entries)"

# ============================================================================
# Validate preview manifest
# ============================================================================
echo "==> Validating preview manifest..."
cd "$PROJECT_DIR"
pnpm run check:previews

# ============================================================================
# Mirror Ack's llms.txt from btwld/ack
# ============================================================================
echo "==> Syncing public/ack/llms.txt from btwld/ack..."
cd "$PROJECT_DIR"
node scripts/sync-ack-llms.mjs

# ============================================================================
# Build Next.js
# ============================================================================
echo "==> Building Next.js site..."
pnpm run build

echo "==> Build complete!"
