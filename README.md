# ChordPad downloads

Download page and release assets for **ChordPad**, a chord-chart practice looper for Android.

- Page: https://kickstomp.github.io/chordpad/
- Latest APK: https://github.com/KickStomp/chordpad/releases/latest/download/chordpad.apk
- Versioned APK: https://github.com/KickStomp/chordpad/releases/latest/download/chordpad-1.1.1.apk

## What is in this repo

- `index.html` — the static download page (no build step, no external assets).
- `screenshot-practice.png`, `screenshot-settings.png`, `screenshot-library.png`.
- `README.md` — this file.

The APK is **not** committed here; it is attached to a GitHub Release so the repository stays small
and each version keeps a permanent URL.

## Publishing a new version

1. Build and sign the release APK, then copy it to `chordpad-<version>.apk`.
2. Create a release tagged `v<version>` and attach the APK twice: once as
   `chordpad-<version>.apk` (permanent) and once as `chordpad.apk` (stable alias used by the
   download button).
3. Update the version, size, SHA-256 and "New in" section in `index.html`.
4. Commit the page change; GitHub Pages serves `main` directly.

Because the button uses `releases/latest/download/chordpad.apk`, it keeps working across versions
as long as the stable alias is attached to each release.

## Install

Download the APK on the Android device and open it. Android asks once to allow installs from the
browser (Settings → Apps → Special access → Install unknown apps). ChordPad needs no account, no
network and no runtime permissions.

Existing 1.0 installs were signed with a temporary development key and may not upgrade in place:
export the library (LIB → EXPORT) first, then install; if Android refuses, uninstall and import the
JSON afterwards. 1.1.1 and later opt out of Android's cloud backup, so uninstall really removes the
data — the JSON export is the only safety net.

## Verification

- APK SHA-256 (1.1.1):
  `56a6127a637cd29c488316299e34dd30bf186620295a0b7593aff6286e83dd06`
- Signing certificate SHA-256 (CN=ChordPad):
  `77:67:97:AA:1A:B3:D4:6C:16:C5:54:1B:3E:27:8E:29:85:BB:B4:1A:A0:14:2A:A7:FF:30:E3:D8:BA:00:AE:EF`

Keep the signing key and its password private and backed up offline. Losing them means future
releases cannot update an installed 1.1+ in place.

## Compatibility

Android 10 (API 29) or newer; built and tested on Android 15. API 29–34 is supported by the build
but has not been device-verified.
