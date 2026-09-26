# TW Tools+

A [TurboWarp](https://turbowarp.org/) extension with 160+ extra blocks: math, text, lists, bullets, colors, timers, and more.

---

## How to use it

1. Open the [TurboWarp editor](https://turbowarp.org/editor).
2. Click **Add Extension** (bottom-left, the block icon).
3. Choose **Custom Extension**.
4. Paste this link (or your own GitHub raw URL if you host the file):

```text
https://raw.githubusercontent.com/YOUR_USER/YOUR_REPO/main/twtoolsplus.js
```

5. Turn on **Run extension without sandbox**.
6. Confirm.

You should see **Tools+** in the block palette (wrench icon). All blocks are dark gray and show the extension icon on the left.

---

## What’s included

| Section | What it’s for |
|--------|----------------|
| **Math** | Rounding, mapping ranges, distances, Roman numerals, chance, smoothing |
| **Text** | Case changes, replace, truncate, Base64, random IDs |
| **Lists** | Sort, shuffle, filter, stack (push/pop), weighted random pick |
| **JSON / Dict** | Structured data as text |
| **Storage** | Save high scores and other data between sessions (in the browser) |
| **Sprite / Stage** | Distance to sprites, bounce on edges, smooth follow, wrap around stage |
| **Input** | Key pressed this frame, right-click, scroll, double-click |
| **Time** | Multiple timers, cooldowns, tweens, “every N frames” |
| **Bullets** | Velocity toward a point, spread shots, homing, lifetime (great for shooters) |
| **Color** | Mix colors, HSL, contrast, palettes |
| **Camera** | Logical camera for scrolling games |
| **Audio / Control / Geometry / Debug** | Sound helpers, scheduled tasks, geometry, and console logs |

---

## Quick example (bullets)

1. Create a clone.
2. On the clone, use **velocity X/Y towards (player) at speed 5**.
3. In a loop: **move by velocity** → if **is off stage** → delete the clone.

---

## Important

- Must be loaded **without the sandbox**. If that option is off, the extension will not work.
- Projects that use this extension **cannot be uploaded to the Scratch website**.
- List blocks use JSON text like `["a","b","c"]`, not Scratch’s built-in list variables directly.

---

## License

[Mozilla Public License 2.0](LICENSE) — free to use and modify under the license terms.
