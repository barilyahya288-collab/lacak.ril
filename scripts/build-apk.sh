#!/bin/bash
set -e

echo "=== Installing dependencies ==="
npm install

echo "=== Generating PWA icons ==="
node scripts/generate-icons.js

echo "=== Preparing web assets ==="
mkdir -p www/icons
cp index.html manifest.json sw.js www/
cp icons/*.png www/icons/

echo "=== Adding Android platform ==="
if [ ! -d "android" ]; then
  npx cap add android
fi

echo "=== Generating Android icons ==="
npx @capacitor/assets generate --android || true

echo "=== Syncing Capacitor ==="
npx cap sync android

echo "=== Building APK ==="
cd android
./gradlew assembleDebug

echo "=== Copying APK ==="
cp app/build/outputs/apk/debug/app-debug.apk ../lacak-ai-pro-debug.apk
echo "APK built: lacak-ai-pro-debug.apk"
