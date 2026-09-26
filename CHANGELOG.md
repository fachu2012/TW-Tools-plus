# Changelog

All notable changes to TW Tools+ are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project uses [Semantic Versioning](https://semver.org/).

## [1.4.1] — 2026-09-25

### Added
- Split distribution into multiple entry points:
  - `twtoolsplus.js` — full pack (all mother categories)
  - `twtoolsplus-math.js` — Math + Geometry
  - `twtoolsplus-text.js` — Text + Lists
  - `twtoolsplus-data.js` — JSON + Dictionaries + Storage
  - `twtoolsplus-sprite.js` — Sprite/Stage + Camera + Input
  - `twtoolsplus-time.js` — Time + Control flow + Debug
  - `twtoolsplus-bullets.js` — Bullets only
  - `twtoolsplus-extra.js` — Color + Audio + Network + Misc
- `unregisterIfExists(id)` before each `register`: reloading the same extension id replaces the previous version instead of duplicating it

### Changed
- Mother categories are separate TurboWarp extensions (each with its own color)
- README documents full pack vs per-category files and reload behavior

### Notes
- Each `.js` file is self-contained (can be loaded alone)
- Still requires **Run extension without sandbox**

---

## [1.4.0] — 2026-09-25

### Added
- Seven colored mother packs (single-file build at the time):
  - Tools+ Math (green), Text (purple), Data (orange), Sprite (blue), Time (amber), Bullets (red), Extra (teal)
- Labels inside each pack for sub-sections
- White in-block icon; menu icon with dark rounded background for light-mode visibility

### Changed
- Moved from one gray extension to multiple colored extension ids in one script

---

## [1.3.0] — 2026-09-25

### Added
- **Bullets** category: velocity toward point, direction, spread, circle pattern, homing turn, accelerate, lifetime, off-stage, move by velocity
- Large utility set across Math, Text, Lists, JSON, Storage, Sprite, Input, Time, Debug, Color, Camera, Dict, Network, Audio, Control, Geometry, Misc
- Helpers such as lerp, smooth damp, cooldowns, stopwatch, tween, once, list filter/map/stack, type-style text tools, color HSL/contrast/palette

### Changed
- Single extension, dark-gray block color, icon inside blocks

---

## [1.2.0] — 2026-09-25

### Added
- Initial large Tools+ feature set (math, text, lists, JSON, storage, sprite, input, time, etc.)
- Unsandboxed requirement and localStorage-backed storage

---

## [1.0.0] — 2026-09-25

### Added
- First public Tools+ release under MPL-2.0

---

[1.4.1]: https://github.com/YOUR_USER/YOUR_REPO/releases/tag/v1.4.1
[1.4.0]: https://github.com/YOUR_USER/YOUR_REPO/releases/tag/v1.4.0
[1.3.0]: https://github.com/YOUR_USER/YOUR_REPO/releases/tag/v1.3.0
[1.2.0]: https://github.com/YOUR_USER/YOUR_REPO/releases/tag/v1.2.0
[1.0.0]: https://github.com/YOUR_USER/YOUR_REPO/releases/tag/v1.0.0
