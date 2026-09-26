# TW Tools+

A set of [TurboWarp](https://turbowarp.org/) extensions with 160+ extra blocks: math, text, lists, bullets, colors, timers, and more.

Blocks are split into **7 colored packs** so the palette stays organized:

| Pack | Color | Contains |
|------|--------|----------|
| **Tools+ Math** | Green | Math, Geometry |
| **Tools+ Text** | Purple | Text, Lists |
| **Tools+ Data** | Orange | JSON, Dictionaries, Storage |
| **Tools+ Sprite** | Blue | Sprite/Stage, Camera, Input |
| **Tools+ Time** | Amber | Time, Control flow, Debug |
| **Tools+ Bullets** | Red | Bullets (shooters / bullet hell) |
| **Tools+ Extra** | Teal | Color, Audio, Network, Misc |

---

## How to use it

1. Open the [TurboWarp editor](https://turbowarp.org/editor).
2. Click **Add Extension** (bottom-left).
3. Choose **Custom Extension**.
4. Paste this link (or your GitHub raw URL):

```text
https://raw.githubusercontent.com/YOUR_USER/YOUR_REPO/main/twtoolsplus.js
```

5. Turn on **Run extension without sandbox**.
6. Confirm.

You should see the seven **Tools+** packs in the block palette. Each pack has its own color; sub-sections are labeled inside the pack.

---

## Quick example (bullets)

1. Create a clone.
2. On the clone, use **velocity X/Y towards (player) at speed 5** (from Tools+ Bullets).
3. In a loop: **move by velocity** → if **is off stage** → delete the clone.

---

## Important

- Must be loaded **without the sandbox**.
- Projects that use these extensions **cannot be uploaded to the Scratch website**.
- List blocks use JSON text like `["a","b","c"]`, not Scratch’s built-in list variables directly.

---

## License

[Mozilla Public License 2.0](LICENSE)
