# TW Tools+

Utility extension pack for [TurboWarp](https://turbowarp.org/) with **100+ blocks** across multiple categories.

Each category is registered as its own extension so it appears with a **distinct color** in the block palette. All categories share one internal core (input state, camera, timers, storage, etc.).

**License:** [Mozilla Public License 2.0](LICENSE)

---

## Categories & colors

| Category | Palette name | Color |
|----------|--------------|-------|
| Math | Tools+ Math | Green `#59C059` |
| Text | Tools+ Text | Purple `#CF63CF` |
| Lists | Tools+ Lists | Orange `#FF8C1A` |
| JSON | Tools+ JSON | Pink `#FF6680` |
| Storage | Tools+ Storage | Yellow `#FFAB19` |
| Sprite / Stage | Tools+ Sprite | Blue `#4C97FF` |
| Input | Tools+ Input | Cyan `#5CB1D6` |
| Time | Tools+ Time | Amber `#FFBF00` |
| Debug | Tools+ Debug | Orange-red `#FF661A` |
| Color | Tools+ Color | Red `#E65C5C` |
| Camera | Tools+ Camera | Teal `#0FBD8C` |
| Dictionaries | Tools+ Dict | Orange `#FF8C1A` |
| Network | Tools+ Network | Teal `#0B8E99` |
| Audio | Tools+ Audio | Purple `#CF63CF` |
| Control flow | Tools+ Control | Yellow `#FFAB19` |
| Geometry | Tools+ Geometry | Blue `#4C97FF` |
| **Bullets** | Tools+ Bullets | Red `#E25B5B` |
| Misc | Tools+ Misc | Gray `#888888` |

---

## How to load

This extension is **unsandboxed**. It needs access to the DOM, `localStorage`, keyboard/mouse events, and the stage canvas.

### From a URL (recommended for GitHub)

1. Push `twtoolsplus.js` to your repo (e.g. GitHub Pages or raw URL).
2. Open [TurboWarp Editor](https://turbowarp.org/editor).
3. Click **Add Extension** → **Custom Extension**.
4. Paste the **raw** URL of `twtoolsplus.js`.
5. Enable **“Run extension without sandbox”**.
6. Load.

Example raw URL shape:

```text
https://raw.githubusercontent.com/YOUR_USER/YOUR_REPO/main/twtoolsplus.js
```

### Local file

1. Host the file with a local static server, or use a file URL if your browser allows it.
2. Same steps as above with the local URL.

After loading you will see **18 separate categories** in the toolbox (one per color), all sharing the same menu icon (white wrench + plus on a dark gray rounded square so it stays visible in light mode).

---

## Bullets category (new)

Designed for bullet hell / shooter games. Default speed is **5**.

| Block | Type | Notes |
|-------|------|--------|
| `velocity X towards (x,y) at speed` | reporter | From this sprite toward a point |
| `velocity Y towards (x,y) at speed` | reporter | Same for Y |
| `direction towards (x,y)` | reporter | Scratch-style direction |
| `velocity [x/y] from direction · speed` | reporter | Direction → velocity component |
| `speed from velocity (vx,vy)` | reporter | Magnitude |
| `angle difference from dir1 to dir2` | reporter | Shortest signed difference (−180…180) |
| `spread direction by spread (index i of n)` | reporter | Fan / multi-shot patterns |
| `point in direction of velocity (vx,vy)` | command | Orient sprite to motion |
| `move by velocity (vx,vy)` | command | Apply one frame of movement |
| `is this sprite off stage (margin)?` | boolean | Delete clones when off-screen |

**Typical clone loop:**

1. Create clone.
2. On clone: set `vx` / `vy` with “velocity X/Y towards player at speed 5”.
3. Forever: `move by velocity (vx, vy)` → if off stage → delete clone.
4. Optional: `point in direction of velocity` each frame.

For a spread of 5 bullets over 40°:

```text
spread direction [player direction] by [40] (index [1..5] of [5])
→ velocity from that direction at speed 5
```

---

## Notes & limitations

- **Lists / JSON / Dict** work on **JSON strings** (e.g. `["a","b"]`, `{"k":1}`), not native Scratch list variables. Convert with the JSON blocks if needed.
- **Camera** is a *logical* camera (x/y/zoom + world→screen). It does not pan the stage by itself; use the reporters in your own “go to x/y” scripts.
- **Storage** uses `localStorage` with the prefix `twtoolsplus:`.
- **Audio** playback rate / is-playing / duration use internal VM APIs and may vary by TurboWarp version; failures return safe defaults.
- **Input** “this frame” blocks snapshot on `BEFORE_EXECUTE` (once per rendered frame).
- Projects that use this extension **cannot be uploaded to the Scratch website** (unsandboxed custom extension).

---

## Repo layout

```text
/
├── twtoolsplus.js    # the extension (load this)
├── LICENSE           # MPL-2.0
├── README.md
└── Icon.png          # optional source art
```

---

## Contributing

Pull requests welcome. Keep new blocks in the appropriate category (or add a new `registerCategory(...)` call with its own id and colors). Preserve the shared `core` instance for any stateful features.
