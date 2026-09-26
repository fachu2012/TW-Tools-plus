// TW Tools+ — Copyright (c) 2026
// Licensed under the Mozilla Public License 2.0
// https://www.mozilla.org/en-US/MPL/2.0/
//
// A large utility extension pack for TurboWarp (~100+ blocks).
// Each category is registered as its own extension so it gets a distinct
// color in the block palette. They share one internal core for state
// (input, camera, timers, storage, etc.).
//
// Categories: Math, Text, Lists, JSON, Storage, Sprite/Stage, Input,
// Time, Debug, Color, Camera, Dictionaries, Network, Audio, Control,
// Geometry, Bullets, Misc.
//
// UNSANDBOXED — load with "Run extension without sandbox" enabled.

(function (Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('TW Tools+ must be run unsandboxed');
  }

  const MENU_ICON = 'data:image/png;base64,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';

  const toNumber = (v) => Number(v) || 0;
  const savedKeys = new Map();

  function storageKey(key) {
    return `twtoolsplus:${key}`;
  }

  // Shared menus used by several categories
  const SHARED_MENUS = {
    parityMenu: { items: ['even', 'odd'] },
    gcdLcmMenu: { items: ['GCD', 'LCM'] },
    numberFormatMenu: { items: ['Roman numeral', 'words'] },
    caseMenu: { items: ['UPPERCASE', 'lowercase', 'Capitalized'] },
    padSideMenu: { items: ['start', 'end'] },
    sortModeMenu: { items: ['numeric', 'alphabetical'] },
    minMaxMenu: { items: ['max', 'min'] },
    sumAverageMenu: { items: ['sum', 'average'] },
    axisMenu: { items: ['x', 'y'] },
    dimensionMenu: { items: ['width', 'height'] },
    boxSideMenu: { items: ['top', 'bottom', 'left', 'right'] },
    mouseButtonMenu: { items: ['left', 'right', 'middle'] },
    logLevelMenu: { items: ['info', 'warning', 'error'] },
    rgbComponentMenu: { items: ['r', 'g', 'b'] },
    keysValuesMenu: { items: ['keys', 'values'] },
    urlEncodeMenu: { items: ['URL-encode', 'URL-decode'] }
  };

  // =========================================================================
  // Shared core (state + all block implementations)
  // =========================================================================
  class TWToolsPlusCore {
    constructor() {
      this.runtime = Scratch.vm.runtime;

      this._keysDownNow = new Set();
      this._keysPressedBuffer = new Set();
      this._keysPressedThisFrame = new Set();
      this._keysReleasedBuffer = new Set();
      this._keysReleasedThisFrame = new Set();
      this._lastKeyPressed = '';
      this._mouseButtonsDown = { left: false, middle: false, right: false };
      this._scrollDeltaAccum = 0;
      this._scrollDeltaThisFrame = 0;
      this._doubleClickBuffer = false;
      this._doubleClickThisFrame = false;

      this._cloneCounters = new Map();
      this._timers = new Map();
      this._camera = { x: 0, y: 0, zoom: 1 };

      this._tasks = new Map();
      this._debounceTimestamps = new Map();
      this._throttleTimestamps = new Map();

      this._setupInputListeners();
      this._setupFrameHook();
      this._setupCloneTracking();
    }

    _setupInputListeners() {
      const keyName = (event) => {
        const map = {
          ' ': 'space',
          ArrowUp: 'up arrow',
          ArrowDown: 'down arrow',
          ArrowLeft: 'left arrow',
          ArrowRight: 'right arrow'
        };
        return map[event.key] || event.key.toLowerCase();
      };

      document.addEventListener('keydown', (e) => {
        const key = keyName(e);
        if (!this._keysDownNow.has(key)) this._keysPressedBuffer.add(key);
        this._keysDownNow.add(key);
        this._lastKeyPressed = key;
      });

      document.addEventListener('keyup', (e) => {
        const key = keyName(e);
        this._keysDownNow.delete(key);
        this._keysReleasedBuffer.add(key);
      });

      const attachToCanvas = () => {
        const canvas = this.runtime.renderer && this.runtime.renderer.canvas;
        if (!canvas || canvas.__twToolsPlusBound) return;
        canvas.__twToolsPlusBound = true;

        const buttonName = (n) => (n === 0 ? 'left' : n === 1 ? 'middle' : 'right');

        canvas.addEventListener('mousedown', (e) => {
          this._mouseButtonsDown[buttonName(e.button)] = true;
          if (e.button === 2) e.preventDefault();
        });
        canvas.addEventListener('mouseup', (e) => {
          this._mouseButtonsDown[buttonName(e.button)] = false;
        });
        canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        canvas.addEventListener('wheel', (e) => {
          this._scrollDeltaAccum += e.deltaY;
        });
        canvas.addEventListener('dblclick', () => {
          this._doubleClickBuffer = true;
        });
      };
      attachToCanvas();
      setTimeout(attachToCanvas, 500);
    }

    _setupFrameHook() {
      this.runtime.on('BEFORE_EXECUTE', () => {
        this._keysPressedThisFrame = this._keysPressedBuffer;
        this._keysPressedBuffer = new Set();
        this._keysReleasedThisFrame = this._keysReleasedBuffer;
        this._keysReleasedBuffer = new Set();
        this._doubleClickThisFrame = this._doubleClickBuffer;
        this._doubleClickBuffer = false;
        this._scrollDeltaThisFrame = this._scrollDeltaAccum;
        this._scrollDeltaAccum = 0;
      });
    }

    _setupCloneTracking() {
      this.runtime.on('targetWasCreated', (newTarget, sourceTarget) => {
        if (!newTarget.isOriginal && sourceTarget) {
          const current = this._cloneCounters.get(sourceTarget) || 0;
          const next = current + 1;
          this._cloneCounters.set(sourceTarget, next);
          newTarget.__twToolsCloneNumber = next;
        }
      });
    }

    // ---- Math ----
    mathRound(args) {
      const factor = Math.pow(10, toNumber(args.DECIMALS));
      return Math.round(toNumber(args.N) * factor) / factor;
    }
    mathMap(args) {
      const { VALUE, A, B, C, D } = args;
      const t = (toNumber(VALUE) - toNumber(A)) / (toNumber(B) - toNumber(A) || 1);
      return toNumber(C) + t * (toNumber(D) - toNumber(C));
    }
    mathClamp(args) {
      return Math.min(Math.max(toNumber(args.VALUE), toNumber(args.MIN)), toNumber(args.MAX));
    }
    mathDistance(args) {
      const dx = toNumber(args.X2) - toNumber(args.X1);
      const dy = toNumber(args.Y2) - toNumber(args.Y1);
      return Math.sqrt(dx * dx + dy * dy);
    }
    mathIsEvenOdd(args) {
      const isEven = toNumber(args.N) % 2 === 0;
      return args.PARITY === 'even' ? isEven : !isEven;
    }
    mathGcdLcm(args) {
      const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
      const a = Math.abs(Math.round(toNumber(args.A)));
      const b = Math.abs(Math.round(toNumber(args.B)));
      const g = gcd(a, b);
      return args.MODE === 'GCD' ? g : (g === 0 ? 0 : Math.abs(a * b) / g);
    }
    mathRandomSeed(args) {
      let seed = toNumber(args.SEED) || 1;
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    mathIsBetween(args) {
      const n = toNumber(args.N);
      return n >= toNumber(args.MIN) && n <= toNumber(args.MAX);
    }
    mathAngleBetween(args) {
      const dx = toNumber(args.X2) - toNumber(args.X1);
      const dy = toNumber(args.Y2) - toNumber(args.Y1);
      return (Math.atan2(dy, dx) * 180) / Math.PI;
    }
    mathNumberToFormat(args) {
      const n = Math.round(toNumber(args.N));
      if (args.FORMAT === 'Roman numeral') return this._toRoman(n);
      return this._toWords(n);
    }
    _toRoman(num) {
      if (num <= 0 || num > 3999) return String(num);
      const table = [
        [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
        [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
        [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
      ];
      let result = '';
      let remaining = num;
      for (const [value, symbol] of table) {
        while (remaining >= value) { result += symbol; remaining -= value; }
      }
      return result;
    }
    _toWords(num) {
      const ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
        'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
      const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
      const chunk = (n) => {
        if (n < 20) return ones[n];
        if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? '-' + ones[n % 10] : '');
        return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' ' + chunk(n % 100) : '');
      };
      if (num === 0) return 'zero';
      const negative = num < 0;
      num = Math.abs(num);
      const scales = [[1000000000, 'billion'], [1000000, 'million'], [1000, 'thousand']];
      let words = '';
      for (const [value, name] of scales) {
        if (num >= value) {
          words += chunk(Math.floor(num / value)) + ' ' + name + ' ';
          num %= value;
        }
      }
      if (num > 0) words += chunk(num);
      return (negative ? 'negative ' : '') + words.trim();
    }

    // ---- Text ----
    textCase(args) {
      const text = String(args.TEXT);
      if (args.CASE === 'UPPERCASE') return text.toUpperCase();
      if (args.CASE === 'lowercase') return text.toLowerCase();
      return text.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
    }
    textReplace(args) {
      return String(args.TEXT).split(String(args.FIND)).join(String(args.REPLACE));
    }
    textContains(args) {
      return String(args.TEXT).includes(String(args.SUBSTRING));
    }
    textSplit(args) {
      return JSON.stringify(String(args.TEXT).split(String(args.SEPARATOR)));
    }
    textJoinList(args) {
      return this._parseArray(args.LIST).join(args.SEPARATOR);
    }
    textTrim(args) {
      return String(args.TEXT).trim();
    }
    textPad(args) {
      const text = String(args.TEXT);
      const n = toNumber(args.N);
      const ch = String(args.CHAR) || ' ';
      return args.SIDE === 'start' ? text.padStart(n, ch) : text.padEnd(n, ch);
    }
    textMatchesPattern(args) {
      try {
        return new RegExp(String(args.REGEX)).test(String(args.TEXT));
      } catch (e) {
        return false;
      }
    }
    textCountOccurrences(args) {
      const sub = String(args.SUBSTRING);
      if (!sub) return 0;
      return String(args.TEXT).split(sub).length - 1;
    }
    textWordCount(args) {
      const t = String(args.TEXT).trim();
      return t ? t.split(/\s+/).length : 0;
    }

    // ---- Lists (JSON arrays) ----
    listReverse(args) { return this._withArray(args.LIST, (arr) => [...arr].reverse()); }
    listShuffle(args) {
      return this._withArray(args.LIST, (arr) => {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
      });
    }
    listRemoveDuplicates(args) { return this._withArray(args.LIST, (arr) => [...new Set(arr)]); }
    listSort(args) {
      return this._withArray(args.LIST, (arr) => {
        const copy = [...arr];
        if (args.MODE === 'numeric') copy.sort((a, b) => toNumber(a) - toNumber(b));
        else copy.sort((a, b) => String(a).localeCompare(String(b)));
        return copy;
      });
    }
    listSublist(args) {
      return this._withArray(args.LIST, (arr) => arr.slice(toNumber(args.I) - 1, toNumber(args.J)));
    }
    listMerge(args) {
      const a = this._parseArray(args.LIST1);
      const b = this._parseArray(args.LIST2);
      return JSON.stringify([...a, ...b]);
    }
    listEquals(args) {
      const a = this._parseArray(args.LIST1);
      const b = this._parseArray(args.LIST2);
      return JSON.stringify(a) === JSON.stringify(b);
    }
    listIndexOfMinMax(args) {
      const arr = this._parseArray(args.LIST).map(toNumber);
      if (!arr.length) return 0;
      const value = args.MODE === 'max' ? Math.max(...arr) : Math.min(...arr);
      return arr.indexOf(value) + 1;
    }
    listSumAverage(args) {
      const arr = this._parseArray(args.LIST).map(toNumber);
      const sum = arr.reduce((a, b) => a + b, 0);
      return args.MODE === 'sum' ? sum : (arr.length ? sum / arr.length : 0);
    }
    listChunk(args) {
      const arr = this._parseArray(args.LIST);
      const n = Math.max(1, toNumber(args.N));
      const out = [];
      for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
      return JSON.stringify(out);
    }
    _parseArray(value) {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [value];
      } catch (e) {
        return [value];
      }
    }
    _withArray(value, fn) {
      return JSON.stringify(fn(this._parseArray(value)));
    }

    // ---- JSON ----
    jsonListToJson(args) { return JSON.stringify(this._parseArray(args.LIST)); }
    jsonJsonToList(args) { return JSON.stringify(this._parseArray(args.JSON)); }
    jsonGetPath(args) {
      try {
        const obj = JSON.parse(args.JSON);
        const path = String(args.PATH).split('.');
        let cur = obj;
        for (const key of path) cur = cur == null ? undefined : cur[key];
        return cur === undefined ? '' : (typeof cur === 'object' ? JSON.stringify(cur) : String(cur));
      } catch (e) {
        return '';
      }
    }
    jsonSetPath(args) {
      try {
        const obj = JSON.parse(args.JSON || '{}');
        const path = String(args.PATH).split('.');
        let cur = obj;
        for (let i = 0; i < path.length - 1; i++) {
          if (typeof cur[path[i]] !== 'object' || cur[path[i]] === null) cur[path[i]] = {};
          cur = cur[path[i]];
        }
        let value = args.VALUE;
        try { value = JSON.parse(args.VALUE); } catch (e) { /* keep string */ }
        cur[path[path.length - 1]] = value;
        return JSON.stringify(obj);
      } catch (e) {
        return args.JSON;
      }
    }
    jsonHasKey(args) {
      try {
        return Object.prototype.hasOwnProperty.call(JSON.parse(args.JSON), args.KEY);
      } catch (e) {
        return false;
      }
    }
    jsonKeys(args) {
      try {
        return JSON.stringify(Object.keys(JSON.parse(args.JSON)));
      } catch (e) {
        return '[]';
      }
    }
    jsonPretty(args) {
      try {
        return JSON.stringify(JSON.parse(args.JSON), null, 2);
      } catch (e) {
        return args.JSON;
      }
    }

    // ---- Storage ----
    storageSave(args) {
      try { localStorage.setItem(storageKey(args.KEY), args.VALUE); } catch (e) { /* ignore */ }
      savedKeys.set(args.KEY, args.VALUE);
    }
    storageLoad(args) {
      try {
        const v = localStorage.getItem(storageKey(args.KEY));
        return v === null ? args.DEFAULT : v;
      } catch (e) {
        return savedKeys.has(args.KEY) ? savedKeys.get(args.KEY) : args.DEFAULT;
      }
    }
    storageDelete(args) {
      try { localStorage.removeItem(storageKey(args.KEY)); } catch (e) { /* ignore */ }
      savedKeys.delete(args.KEY);
    }
    storageHasKey(args) {
      try {
        return localStorage.getItem(storageKey(args.KEY)) !== null;
      } catch (e) {
        return savedKeys.has(args.KEY);
      }
    }
    storageListKeys() {
      try {
        const prefix = 'twtoolsplus:';
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const fullKey = localStorage.key(i);
          if (fullKey && fullKey.startsWith(prefix)) keys.push(fullKey.slice(prefix.length));
        }
        return JSON.stringify(keys);
      } catch (e) {
        return JSON.stringify([...savedKeys.keys()]);
      }
    }

    // ---- Sprite / Stage ----
    spriteDistanceTo(args, util) {
      const other = this.runtime.getSpriteTargetByName(args.SPRITE);
      if (!other || !util.target) return 0;
      const dx = other.x - util.target.x;
      const dy = other.y - util.target.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
    spriteTouchingEdge(args, util) {
      if (!util.target) return false;
      const bounds = util.target.getBounds();
      if (!bounds) return false;
      const halfW = this.runtime.stageWidth / 2;
      const halfH = this.runtime.stageHeight / 2;
      return bounds.left <= -halfW || bounds.right >= halfW || bounds.top >= halfH || bounds.bottom <= -halfH;
    }
    spriteRandomPosition(args) {
      const halfW = this.runtime.stageWidth / 2;
      const halfH = this.runtime.stageHeight / 2;
      return args.AXIS === 'x'
        ? Math.round(Math.random() * halfW * 2 - halfW)
        : Math.round(Math.random() * halfH * 2 - halfH);
    }
    spriteCostumeSize(args, util) {
      if (!util.target) return 0;
      const costume = util.target.sprite.costumes[util.target.currentCostume];
      if (!costume) return 0;
      const res = costume.bitmapResolution || 1;
      const scale = (util.target.size || 100) / 100;
      const dim = args.DIMENSION === 'width' ? costume.size[0] : costume.size[1];
      return Math.round((dim / res) * scale);
    }
    spriteCloneNumber(args, util) {
      if (!util.target || util.target.isOriginal) return 0;
      return util.target.__twToolsCloneNumber || 0;
    }
    spriteIsOriginalOrClone(args, util) {
      return util && util.target ? !util.target.isOriginal : false;
    }
    spritePointTowardsXY(args, util) {
      if (!util.target) return;
      const dx = toNumber(args.X) - util.target.x;
      const dy = toNumber(args.Y) - util.target.y;
      const direction = (Math.atan2(dx, dy) * 180) / Math.PI;
      util.target.setDirection(direction);
    }
    spriteBoundingBox(args, util) {
      if (!util.target) return 0;
      const b = util.target.getBounds();
      if (!b) return 0;
      return b[args.SIDE];
    }

    // ---- Input ----
    inputKeyPressedThisFrame(args) {
      return this._keysPressedThisFrame.has(String(args.KEY).toLowerCase());
    }
    inputLastKeyPressed() {
      return this._lastKeyPressed;
    }
    inputMouseButtonDown(args) {
      return !!this._mouseButtonsDown[args.BUTTON];
    }
    inputScrollDelta() {
      return this._scrollDeltaThisFrame;
    }
    inputDoubleClick() {
      return this._doubleClickThisFrame;
    }
    inputKeyReleasedThisFrame(args) {
      return this._keysReleasedThisFrame.has(String(args.KEY).toLowerCase());
    }

    // ---- Time ----
    timeTimer(args) {
      let start = this._timers.get(args.ID);
      if (start === undefined) {
        start = Date.now();
        this._timers.set(args.ID, start);
      }
      return (Date.now() - start) / 1000;
    }
    timeResetTimer(args) {
      this._timers.set(args.ID, Date.now());
    }
    timeCurrentFormatted(args) {
      const d = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const tokens = {
        YYYY: d.getFullYear(),
        MM: pad(d.getMonth() + 1),
        DD: pad(d.getDate()),
        HH: pad(d.getHours()),
        mm: pad(d.getMinutes()),
        ss: pad(d.getSeconds())
      };
      let out = String(args.FORMAT);
      for (const [token, value] of Object.entries(tokens)) out = out.split(token).join(value);
      return out;
    }
    timeWaitFrames(args) {
      const n = Math.max(0, Math.round(toNumber(args.N)));
      if (n === 0) return Promise.resolve();
      return new Promise((resolve) => {
        let count = 0;
        const step = () => {
          count++;
          if (count >= n) resolve();
          else requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }
    timeDaysBetween(args) {
      const d1 = new Date(args.DATE1);
      const d2 = new Date(args.DATE2);
      return Math.round(Math.abs(d2 - d1) / 86400000);
    }

    // ---- Debug ----
    debugLog(args) { console.log('[TW Tools+]', args.VALUE); }
    debugLogLevel(args) {
      const level = args.LEVEL === 'error' ? 'error' : args.LEVEL === 'warning' ? 'warn' : 'log';
      console[level]('[TW Tools+]', args.VALUE);
    }
    debugAssert(args) {
      if (!args.CONDITION) console.error('[TW Tools+] Assertion failed:', args.TEXT);
    }

    // ---- Color ----
    colorRgbToHex(args) {
      const clamp255 = (n) => Math.max(0, Math.min(255, Math.round(toNumber(n))));
      const toHex = (n) => clamp255(n).toString(16).padStart(2, '0');
      return `#${toHex(args.R)}${toHex(args.G)}${toHex(args.B)}`;
    }
    colorHexToRgb(args) {
      const hex = String(args.HEX).replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16) || 0;
      const g = parseInt(hex.substring(2, 4), 16) || 0;
      const b = parseInt(hex.substring(4, 6), 16) || 0;
      return { r, g, b }[args.COMPONENT];
    }
    colorMix(args) {
      const p = Math.max(0, Math.min(100, toNumber(args.PERCENT))) / 100;
      const c1 = this.colorHexToRgbObj(args.C1);
      const c2 = this.colorHexToRgbObj(args.C2);
      const mix = (a, b) => Math.round(a + (b - a) * p);
      return this.colorRgbToHex({ R: mix(c1.r, c2.r), G: mix(c1.g, c2.g), B: mix(c1.b, c2.b) });
    }
    colorHexToRgbObj(hex) {
      const h = String(hex).replace('#', '');
      return {
        r: parseInt(h.substring(0, 2), 16) || 0,
        g: parseInt(h.substring(2, 4), 16) || 0,
        b: parseInt(h.substring(4, 6), 16) || 0
      };
    }
    colorRandom() {
      return this.colorRgbToHex({
        R: Math.floor(Math.random() * 256),
        G: Math.floor(Math.random() * 256),
        B: Math.floor(Math.random() * 256)
      });
    }
    colorBrightness(args) {
      const { r, g, b } = this.colorHexToRgbObj(args.C);
      return Math.round((r * 299 + g * 587 + b * 114) / 1000);
    }
    colorIsLightDark(args) {
      return this.colorBrightness(args) > 127;
    }

    // ---- Camera ----
    cameraGetPosition(args) {
      return args.AXIS === 'x' ? this._camera.x : this._camera.y;
    }
    cameraSetPosition(args) {
      this._camera.x = toNumber(args.X);
      this._camera.y = toNumber(args.Y);
    }
    cameraGetZoom() {
      return this._camera.zoom;
    }
    cameraSetZoom(args) {
      this._camera.zoom = toNumber(args.N) || 1;
    }
    cameraWorldToScreen(args) {
      const relX = (toNumber(args.X) - this._camera.x) * this._camera.zoom;
      const relY = (toNumber(args.Y) - this._camera.y) * this._camera.zoom;
      return args.AXIS === 'x' ? relX : relY;
    }

    // ---- Dictionaries ----
    dictCreate() { return '{}'; }
    dictSet(args) {
      try {
        const obj = JSON.parse(args.DICT || '{}');
        let value = args.VALUE;
        try { value = JSON.parse(args.VALUE); } catch (e) { /* keep string */ }
        obj[args.KEY] = value;
        return JSON.stringify(obj);
      } catch (e) {
        return args.DICT;
      }
    }
    dictGet(args) {
      try {
        const obj = JSON.parse(args.DICT || '{}');
        return Object.prototype.hasOwnProperty.call(obj, args.KEY) ? obj[args.KEY] : args.DEFAULT;
      } catch (e) {
        return args.DEFAULT;
      }
    }
    dictDeleteKey(args) {
      try {
        const obj = JSON.parse(args.DICT || '{}');
        delete obj[args.KEY];
        return JSON.stringify(obj);
      } catch (e) {
        return args.DICT;
      }
    }
    dictHasKey(args) {
      try {
        return Object.prototype.hasOwnProperty.call(JSON.parse(args.DICT || '{}'), args.KEY);
      } catch (e) {
        return false;
      }
    }
    dictKeysOrValues(args) {
      try {
        const obj = JSON.parse(args.DICT || '{}');
        return JSON.stringify(args.MODE === 'keys' ? Object.keys(obj) : Object.values(obj));
      } catch (e) {
        return '[]';
      }
    }

    // ---- Network ----
    netUrlEncodeDecode(args) {
      return args.MODE === 'URL-encode' ? encodeURIComponent(args.TEXT) : decodeURIComponent(args.TEXT);
    }
    netParseQueryString(args) {
      const params = new URLSearchParams(args.TEXT);
      const obj = {};
      for (const [k, v] of params.entries()) obj[k] = v;
      return JSON.stringify(obj);
    }
    netGetQueryParam(args) {
      try {
        const url = new URL(args.URL);
        return url.searchParams.get(args.KEY) || '';
      } catch (e) {
        return '';
      }
    }

    // ---- Audio ----
    audioCurrentVolume(args, util) {
      return util.target ? util.target.volume : 100;
    }
    _findSoundPlayer(soundName, util) {
      try {
        const sound = util.target.sprite.sounds.find((s) => s.name === soundName);
        if (!sound) return null;
        return util.target.sprite.soundBank.soundPlayers[sound.soundId] || null;
      } catch (e) {
        return null;
      }
    }
    audioSetPlaybackRate(args, util) {
      const player = this._findSoundPlayer(args.SOUND, util);
      const rate = toNumber(args.N);
      try {
        if (player && player.outputNode && player.outputNode.playbackRate) {
          player.outputNode.playbackRate.value = rate;
        } else if (player && typeof player.setPlaybackRate === 'function') {
          player.setPlaybackRate(rate);
        }
      } catch (e) { /* not supported */ }
    }
    audioIsPlaying(args, util) {
      const player = this._findSoundPlayer(args.SOUND, util);
      return !!(player && player.isPlaying);
    }
    audioDuration(args, util) {
      const player = this._findSoundPlayer(args.SOUND, util);
      try {
        return player && player.buffer ? player.buffer.duration : 0;
      } catch (e) {
        return 0;
      }
    }

    // ---- Control flow ----
    controlRunAfter(args) {
      const id = args.ID;
      const handle = setTimeout(() => {
        this._tasks.delete(id);
        try {
          const stage = this.runtime.getTargetForStage();
          const broadcastVar = stage && stage.lookupBroadcastMsg(null, id);
          if (broadcastVar) {
            this.runtime.startHats('event_whenbroadcastreceived', { BROADCAST_OPTION: broadcastVar.id });
          }
        } catch (e) { /* no matching broadcast */ }
      }, toNumber(args.SECONDS) * 1000);
      this._tasks.set(id, handle);
    }
    controlCancelTask(args) {
      const handle = this._tasks.get(args.ID);
      if (handle) clearTimeout(handle);
      this._tasks.delete(args.ID);
    }
    controlDebounce(args) {
      const now = Date.now();
      const last = this._debounceTimestamps.get(args.ID) || 0;
      const ok = (now - last) / 1000 >= toNumber(args.SECONDS);
      if (ok) this._debounceTimestamps.set(args.ID, now);
      return ok;
    }
    controlThrottle(args) {
      const now = Date.now();
      const last = this._throttleTimestamps.get(args.ID) || 0;
      const ok = (now - last) / 1000 >= toNumber(args.SECONDS);
      if (ok) this._throttleTimestamps.set(args.ID, now);
      return ok;
    }
    controlTaskExists(args) { return this._tasks.has(args.ID); }

    // ---- Geometry ----
    geoPointInRect(args) {
      const { X, Y, X1, Y1, X2, Y2 } = args;
      const minX = Math.min(toNumber(X1), toNumber(X2));
      const maxX = Math.max(toNumber(X1), toNumber(X2));
      const minY = Math.min(toNumber(Y1), toNumber(Y2));
      const maxY = Math.max(toNumber(Y1), toNumber(Y2));
      return toNumber(X) >= minX && toNumber(X) <= maxX && toNumber(Y) >= minY && toNumber(Y) <= maxY;
    }
    geoPointInCircle(args) {
      const dx = toNumber(args.X) - toNumber(args.CX);
      const dy = toNumber(args.Y) - toNumber(args.CY);
      return Math.sqrt(dx * dx + dy * dy) <= toNumber(args.R);
    }
    geoRectsOverlap(args) {
      const { AX1, AY1, AX2, AY2, BX1, BY1, BX2, BY2 } = args;
      const aMinX = Math.min(toNumber(AX1), toNumber(AX2));
      const aMaxX = Math.max(toNumber(AX1), toNumber(AX2));
      const aMinY = Math.min(toNumber(AY1), toNumber(AY2));
      const aMaxY = Math.max(toNumber(AY1), toNumber(AY2));
      const bMinX = Math.min(toNumber(BX1), toNumber(BX2));
      const bMaxX = Math.max(toNumber(BX1), toNumber(BX2));
      const bMinY = Math.min(toNumber(BY1), toNumber(BY2));
      const bMaxY = Math.max(toNumber(BY1), toNumber(BY2));
      return aMinX <= bMaxX && aMaxX >= bMinX && aMinY <= bMaxY && aMaxY >= bMinY;
    }
    geoRotatePoint(args) {
      const rad = (toNumber(args.ANGLE) * Math.PI) / 180;
      const dx = toNumber(args.X) - toNumber(args.CX);
      const dy = toNumber(args.Y) - toNumber(args.CY);
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const x = toNumber(args.CX) + dx * cos - dy * sin;
      const y = toNumber(args.CY) + dx * sin + dy * cos;
      return args.AXIS === 'x' ? x : y;
    }
    geoMidpoint(args) {
      const mx = (toNumber(args.X1) + toNumber(args.X2)) / 2;
      const my = (toNumber(args.Y1) + toNumber(args.Y2)) / 2;
      return args.AXIS === 'x' ? mx : my;
    }
    geoNormalizeVector(args) {
      const x = toNumber(args.X);
      const y = toNumber(args.Y);
      const len = Math.sqrt(x * x + y * y) || 1;
      return args.AXIS === 'x' ? x / len : y / len;
    }

    // ---- Bullets ----
    _dirToRad(dir) {
      return ((90 - toNumber(dir)) * Math.PI) / 180;
    }
    bulletVelocityX(args, util) {
      const tx = toNumber(args.X), ty = toNumber(args.Y);
      const x = util.target ? util.target.x : 0;
      const y = util.target ? util.target.y : 0;
      const dx = tx - x, dy = ty - y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      return (dx / dist) * toNumber(args.SPEED);
    }
    bulletVelocityY(args, util) {
      const tx = toNumber(args.X), ty = toNumber(args.Y);
      const x = util.target ? util.target.x : 0;
      const y = util.target ? util.target.y : 0;
      const dx = tx - x, dy = ty - y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      return (dy / dist) * toNumber(args.SPEED);
    }
    bulletDirectionTowards(args, util) {
      const tx = toNumber(args.X), ty = toNumber(args.Y);
      const x = util.target ? util.target.x : 0;
      const y = util.target ? util.target.y : 0;
      return (Math.atan2(tx - x, ty - y) * 180) / Math.PI;
    }
    bulletVelocityFromDirection(args) {
      const rad = this._dirToRad(args.DIR);
      const s = toNumber(args.SPEED);
      return args.AXIS === 'x' ? Math.cos(rad) * s : Math.sin(rad) * s;
    }
    bulletSpeedFromVelocity(args) {
      const vx = toNumber(args.VX), vy = toNumber(args.VY);
      return Math.sqrt(vx * vx + vy * vy);
    }
    bulletAngleDifference(args) {
      let d = toNumber(args.DIR2) - toNumber(args.DIR1);
      d = ((d + 180) % 360 + 360) % 360 - 180;
      return d;
    }
    bulletSpreadDirection(args) {
      const n = Math.max(1, Math.round(toNumber(args.N)));
      const i = Math.max(1, Math.min(n, Math.round(toNumber(args.I))));
      const spread = toNumber(args.SPREAD);
      const center = toNumber(args.DIR);
      if (n === 1) return center;
      const step = spread / (n - 1);
      return center - spread / 2 + (i - 1) * step;
    }
    bulletPointInDirectionOfMotion(args, util) {
      if (!util.target) return;
      const dir = (Math.atan2(toNumber(args.VX), toNumber(args.VY)) * 180) / Math.PI;
      util.target.setDirection(dir);
    }
    bulletMoveByVelocity(args, util) {
      if (!util.target) return;
      util.target.setXY(
        util.target.x + toNumber(args.VX),
        util.target.y + toNumber(args.VY)
      );
    }
    bulletIsOffStage(args, util) {
      if (!util.target) return true;
      const m = toNumber(args.MARGIN);
      const halfW = this.runtime.stageWidth / 2 + m;
      const halfH = this.runtime.stageHeight / 2 + m;
      const x = util.target.x, y = util.target.y;
      return x < -halfW || x > halfW || y < -halfH || y > halfH;
    }

    // ---- Misc ----
    miscDeepCopy(args) {
      try {
        return JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(args.JSON))));
      } catch (e) {
        return args.JSON;
      }
    }
  }

  const core = new TWToolsPlusCore();

  // =========================================================================
  // Register one extension per category (distinct colors)
  // =========================================================================
  function registerCategory(id, name, color1, color2, color3, blocks) {
    const opcodes = [];
    for (const b of blocks) {
      if (b && b.opcode) opcodes.push(b.opcode);
    }
    class CategoryExtension {
      getInfo() {
        return {
          id,
          name,
          color1,
          color2,
          color3,
          menuIconURI: MENU_ICON,
          blocks,
          menus: SHARED_MENUS
        };
      }
    }
    for (const op of opcodes) {
      if (typeof core[op] === 'function') {
        CategoryExtension.prototype[op] = function (args, util) {
          return core[op](args, util);
        };
      }
    }
    Scratch.extensions.register(new CategoryExtension());
  }

  // --- Math (green) ---
  registerCategory('twtoolsplusmath', 'Tools+ Math', '#59C059', '#4ba34b', '#3e863e', [
    {
      opcode: 'mathRound',
      blockType: Scratch.BlockType.REPORTER,
      text: 'round [N] to [DECIMALS] decimal places',
      arguments: {
        N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3.14159 },
        DECIMALS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2 }
      }
    },
    {
      opcode: 'mathMap',
      blockType: Scratch.BlockType.REPORTER,
      text: 'map [VALUE] from [A] - [B] to [C] - [D]',
      arguments: {
        VALUE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 },
        A: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
        B: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
        C: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
        D: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
      }
    },
    {
      opcode: 'mathClamp',
      blockType: Scratch.BlockType.REPORTER,
      text: 'clamp [VALUE] between [MIN] and [MAX]',
      arguments: {
        VALUE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
        MIN: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
        MAX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
      }
    },
    {
      opcode: 'mathDistance',
      blockType: Scratch.BlockType.REPORTER,
      text: 'distance from ([X1],[Y1]) to ([X2],[Y2])',
      arguments: {
        X1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
        Y1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
        X2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 },
        Y2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 4 }
      }
    },
    {
      opcode: 'mathIsEvenOdd',
      blockType: Scratch.BlockType.BOOLEAN,
      text: 'is [N] [PARITY]?',
      arguments: {
        N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 4 },
        PARITY: { type: Scratch.ArgumentType.STRING, menu: 'parityMenu', defaultValue: 'even' }
      }
    },
    {
      opcode: 'mathGcdLcm',
      blockType: Scratch.BlockType.REPORTER,
      text: '[MODE] of [A] and [B]',
      arguments: {
        MODE: { type: Scratch.ArgumentType.STRING, menu: 'gcdLcmMenu', defaultValue: 'GCD' },
        A: { type: Scratch.ArgumentType.NUMBER, defaultValue: 12 },
        B: { type: Scratch.ArgumentType.NUMBER, defaultValue: 18 }
      }
    },
    {
      opcode: 'mathRandomSeed',
      blockType: Scratch.BlockType.REPORTER,
      text: 'random number with seed [SEED]',
      arguments: { SEED: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 } }
    },
    {
      opcode: 'mathIsBetween',
      blockType: Scratch.BlockType.BOOLEAN,
      text: '[N] is between [MIN] and [MAX]?',
      arguments: {
        N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
        MIN: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
        MAX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
      }
    },
    {
      opcode: 'mathAngleBetween',
      blockType: Scratch.BlockType.REPORTER,
      text: 'angle between ([X1],[Y1]) and ([X2],[Y2])',
      arguments: {
        X1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
        Y1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
        X2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
        Y2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
      }
    },
    {
      opcode: 'mathNumberToFormat',
      blockType: Scratch.BlockType.REPORTER,
      text: '[N] to [FORMAT]',
      arguments: {
        N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 14 },
        FORMAT: { type: Scratch.ArgumentType.STRING, menu: 'numberFormatMenu', defaultValue: 'Roman numeral' }
      }
    }
  ]);

  // --- Text (purple) ---
  registerCategory('twtoolsplustext', 'Tools+ Text', '#CF63CF', '#af54af', '#904590', [
    {
      opcode: 'textCase',
      blockType: Scratch.BlockType.REPORTER,
      text: '[TEXT] to [CASE]',
      arguments: {
        TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'hello world' },
        CASE: { type: Scratch.ArgumentType.STRING, menu: 'caseMenu', defaultValue: 'UPPERCASE' }
      }
    },
    {
      opcode: 'textReplace',
      blockType: Scratch.BlockType.REPORTER,
      text: 'replace [FIND] with [REPLACE] in [TEXT]',
      arguments: {
        FIND: { type: Scratch.ArgumentType.STRING, defaultValue: 'cat' },
        REPLACE: { type: Scratch.ArgumentType.STRING, defaultValue: 'dog' },
        TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'I have a cat' }
      }
    },
    {
      opcode: 'textContains',
      blockType: Scratch.BlockType.BOOLEAN,
      text: 'does [TEXT] contain [SUBSTRING]?',
      arguments: {
        TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'hello world' },
        SUBSTRING: { type: Scratch.ArgumentType.STRING, defaultValue: 'world' }
      }
    },
    {
      opcode: 'textSplit',
      blockType: Scratch.BlockType.REPORTER,
      text: 'split [TEXT] by [SEPARATOR]',
      arguments: {
        TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'a,b,c' },
        SEPARATOR: { type: Scratch.ArgumentType.STRING, defaultValue: ',' }
      }
    },
    {
      opcode: 'textJoinList',
      blockType: Scratch.BlockType.REPORTER,
      text: 'join list [LIST] with separator [SEPARATOR]',
      arguments: {
        LIST: { type: Scratch.ArgumentType.STRING, defaultValue: '["a","b","c"]' },
        SEPARATOR: { type: Scratch.ArgumentType.STRING, defaultValue: ', ' }
      }
    },
    {
      opcode: 'textTrim',
      blockType: Scratch.BlockType.REPORTER,
      text: 'trim [TEXT]',
      arguments: { TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: '  hi  ' } }
    },
    {
      opcode: 'textPad',
      blockType: Scratch.BlockType.REPORTER,
      text: 'pad [TEXT] to [N] chars with [CHAR] ([SIDE])',
      arguments: {
        TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: '5' },
        N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 },
        CHAR: { type: Scratch.ArgumentType.STRING, defaultValue: '0' },
        SIDE: { type: Scratch.ArgumentType.STRING, menu: 'padSideMenu', defaultValue: 'start' }
      }
    },
    {
      opcode: 'textMatchesPattern',
      blockType: Scratch.BlockType.BOOLEAN,
      text: 'does [TEXT] match pattern [REGEX]?',
      arguments: {
        TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'abc123' },
        REGEX: { type: Scratch.ArgumentType.STRING, defaultValue: '^[a-z]+[0-9]+$' }
      }
    },
    {
      opcode: 'textCountOccurrences',
      blockType: Scratch.BlockType.REPORTER,
      text: 'count occurrences of [SUBSTRING] in [TEXT]',
      arguments: {
        SUBSTRING: { type: Scratch.ArgumentType.STRING, defaultValue: 'a' },
        TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'banana' }
      }
    },
    {
      opcode: 'textWordCount',
      blockType: Scratch.BlockType.REPORTER,
      text: 'word count of [TEXT]',
      arguments: { TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'hello there world' } }
    }
  ]);

  // --- Lists (orange) ---
  registerCategory('twtoolspluslists', 'Tools+ Lists', '#FF8C1A', '#d87716', '#b26212', [
    {
      opcode: 'listReverse',
      blockType: Scratch.BlockType.REPORTER,
      text: 'reverse list [LIST]',
      arguments: { LIST: { type: Scratch.ArgumentType.STRING, defaultValue: '["a","b","c"]' } }
    },
    {
      opcode: 'listShuffle',
      blockType: Scratch.BlockType.REPORTER,
      text: 'shuffle list [LIST]',
      arguments: { LIST: { type: Scratch.ArgumentType.STRING, defaultValue: '["a","b","c"]' } }
    },
    {
      opcode: 'listRemoveDuplicates',
      blockType: Scratch.BlockType.REPORTER,
      text: 'remove duplicates from [LIST]',
      arguments: { LIST: { type: Scratch.ArgumentType.STRING, defaultValue: '["a","a","b"]' } }
    },
    {
      opcode: 'listSort',
      blockType: Scratch.BlockType.REPORTER,
      text: 'sort list [LIST] ([MODE])',
      arguments: {
        LIST: { type: Scratch.ArgumentType.STRING, defaultValue: '["3","1","2"]' },
        MODE: { type: Scratch.ArgumentType.STRING, menu: 'sortModeMenu', defaultValue: 'numeric' }
      }
    },
    {
      opcode: 'listSublist',
      blockType: Scratch.BlockType.REPORTER,
      text: 'sublist of [LIST] from [I] to [J]',
      arguments: {
        LIST: { type: Scratch.ArgumentType.STRING, defaultValue: '["a","b","c","d"]' },
        I: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
        J: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 }
      }
    },
    {
      opcode: 'listMerge',
      blockType: Scratch.BlockType.REPORTER,
      text: 'merge list [LIST1] and [LIST2]',
      arguments: {
        LIST1: { type: Scratch.ArgumentType.STRING, defaultValue: '["a"]' },
        LIST2: { type: Scratch.ArgumentType.STRING, defaultValue: '["b"]' }
      }
    },
    {
      opcode: 'listEquals',
      blockType: Scratch.BlockType.BOOLEAN,
      text: 'is list [LIST1] equal to [LIST2]?',
      arguments: {
        LIST1: { type: Scratch.ArgumentType.STRING, defaultValue: '["a"]' },
        LIST2: { type: Scratch.ArgumentType.STRING, defaultValue: '["a"]' }
      }
    },
    {
      opcode: 'listIndexOfMinMax',
      blockType: Scratch.BlockType.REPORTER,
      text: 'index of [MODE] in [LIST]',
      arguments: {
        MODE: { type: Scratch.ArgumentType.STRING, menu: 'minMaxMenu', defaultValue: 'max' },
        LIST: { type: Scratch.ArgumentType.STRING, defaultValue: '[1,5,3]' }
      }
    },
    {
      opcode: 'listSumAverage',
      blockType: Scratch.BlockType.REPORTER,
      text: '[MODE] of [LIST]',
      arguments: {
        MODE: { type: Scratch.ArgumentType.STRING, menu: 'sumAverageMenu', defaultValue: 'sum' },
        LIST: { type: Scratch.ArgumentType.STRING, defaultValue: '[1,2,3]' }
      }
    },
    {
      opcode: 'listChunk',
      blockType: Scratch.BlockType.REPORTER,
      text: 'chunk list [LIST] into groups of [N]',
      arguments: {
        LIST: { type: Scratch.ArgumentType.STRING, defaultValue: '[1,2,3,4]' },
        N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2 }
      }
    }
  ]);

  // --- JSON ---
  registerCategory('twtoolsplusjson', 'Tools+ JSON', '#FF6680', '#d8566c', '#b24759', [
    {
      opcode: 'jsonListToJson',
      blockType: Scratch.BlockType.REPORTER,
      text: 'list [LIST] to JSON',
      arguments: { LIST: { type: Scratch.ArgumentType.STRING, defaultValue: '["a","b"]' } }
    },
    {
      opcode: 'jsonJsonToList',
      blockType: Scratch.BlockType.REPORTER,
      text: 'JSON [JSON] to list',
      arguments: { JSON: { type: Scratch.ArgumentType.STRING, defaultValue: '["a","b","c"]' } }
    },
    {
      opcode: 'jsonGetPath',
      blockType: Scratch.BlockType.REPORTER,
      text: 'get value from [JSON] at path [PATH]',
      arguments: {
        JSON: { type: Scratch.ArgumentType.STRING, defaultValue: '{"a":{"b":1}}' },
        PATH: { type: Scratch.ArgumentType.STRING, defaultValue: 'a.b' }
      }
    },
    {
      opcode: 'jsonSetPath',
      blockType: Scratch.BlockType.REPORTER,
      text: 'set value in [JSON] at path [PATH] to [VALUE]',
      arguments: {
        JSON: { type: Scratch.ArgumentType.STRING, defaultValue: '{}' },
        PATH: { type: Scratch.ArgumentType.STRING, defaultValue: 'a.b' },
        VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: '1' }
      }
    },
    {
      opcode: 'jsonHasKey',
      blockType: Scratch.BlockType.BOOLEAN,
      text: 'does [JSON] have key [KEY]?',
      arguments: {
        JSON: { type: Scratch.ArgumentType.STRING, defaultValue: '{"a":1}' },
        KEY: { type: Scratch.ArgumentType.STRING, defaultValue: 'a' }
      }
    },
    {
      opcode: 'jsonKeys',
      blockType: Scratch.BlockType.REPORTER,
      text: 'keys of [JSON]',
      arguments: { JSON: { type: Scratch.ArgumentType.STRING, defaultValue: '{"a":1,"b":2}' } }
    },
    {
      opcode: 'jsonPretty',
      blockType: Scratch.BlockType.REPORTER,
      text: 'pretty-print [JSON]',
      arguments: { JSON: { type: Scratch.ArgumentType.STRING, defaultValue: '{"a":1}' } }
    }
  ]);

  // --- Storage ---
  registerCategory('twtoolsplusstorage', 'Tools+ Storage', '#FFAB19', '#d89115', '#b27711', [
    {
      opcode: 'storageSave',
      blockType: Scratch.BlockType.COMMAND,
      text: 'save [KEY] = [VALUE]',
      arguments: {
        KEY: { type: Scratch.ArgumentType.STRING, defaultValue: 'highscore' },
        VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: '0' }
      }
    },
    {
      opcode: 'storageLoad',
      blockType: Scratch.BlockType.REPORTER,
      text: 'load [KEY] (default [DEFAULT])',
      arguments: {
        KEY: { type: Scratch.ArgumentType.STRING, defaultValue: 'highscore' },
        DEFAULT: { type: Scratch.ArgumentType.STRING, defaultValue: '0' }
      }
    },
    {
      opcode: 'storageDelete',
      blockType: Scratch.BlockType.COMMAND,
      text: 'delete [KEY]',
      arguments: { KEY: { type: Scratch.ArgumentType.STRING, defaultValue: 'highscore' } }
    },
    {
      opcode: 'storageHasKey',
      blockType: Scratch.BlockType.BOOLEAN,
      text: 'does key [KEY] exist?',
      arguments: { KEY: { type: Scratch.ArgumentType.STRING, defaultValue: 'highscore' } }
    },
    {
      opcode: 'storageListKeys',
      blockType: Scratch.BlockType.REPORTER,
      text: 'list all saved keys'
    }
  ]);

  // --- Sprite / Stage ---
  registerCategory('twtoolsplussprite', 'Tools+ Sprite', '#4C97FF', '#4080d8', '#3569b2', [
    {
      opcode: 'spriteDistanceTo',
      blockType: Scratch.BlockType.REPORTER,
      text: 'distance from this sprite to [SPRITE]',
      arguments: { SPRITE: { type: Scratch.ArgumentType.STRING, defaultValue: 'Sprite1' } }
    },
    {
      opcode: 'spriteTouchingEdge',
      blockType: Scratch.BlockType.BOOLEAN,
      text: 'is this sprite touching the stage edge?'
    },
    {
      opcode: 'spriteRandomPosition',
      blockType: Scratch.BlockType.REPORTER,
      text: 'random position on stage ([AXIS])',
      arguments: { AXIS: { type: Scratch.ArgumentType.STRING, menu: 'axisMenu', defaultValue: 'x' } }
    },
    {
      opcode: 'spriteCostumeSize',
      blockType: Scratch.BlockType.REPORTER,
      text: 'costume [DIMENSION] in px',
      arguments: { DIMENSION: { type: Scratch.ArgumentType.STRING, menu: 'dimensionMenu', defaultValue: 'width' } }
    },
    {
      opcode: 'spriteCloneNumber',
      blockType: Scratch.BlockType.REPORTER,
      text: 'clone number of this sprite'
    },
    {
      opcode: 'spriteIsOriginalOrClone',
      blockType: Scratch.BlockType.BOOLEAN,
      text: 'is this a clone?'
    },
    {
      opcode: 'spritePointTowardsXY',
      blockType: Scratch.BlockType.COMMAND,
      text: 'point towards ([X],[Y])',
      arguments: {
        X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
        Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
      }
    },
    {
      opcode: 'spriteBoundingBox',
      blockType: Scratch.BlockType.REPORTER,
      text: 'bounding box [SIDE] of this sprite',
      arguments: { SIDE: { type: Scratch.ArgumentType.STRING, menu: 'boxSideMenu', defaultValue: 'top' } }
    }
  ]);

  // --- Input ---
  registerCategory('twtoolsplusinput', 'Tools+ Input', '#5CB1D6', '#4e96b5', '#407b95', [
    {
      opcode: 'inputKeyPressedThisFrame',
      blockType: Scratch.BlockType.BOOLEAN,
      text: 'was key [KEY] pressed this frame?',
      arguments: { KEY: { type: Scratch.ArgumentType.STRING, defaultValue: 'space' } }
    },
    {
      opcode: 'inputLastKeyPressed',
      blockType: Scratch.BlockType.REPORTER,
      text: 'last key pressed'
    },
    {
      opcode: 'inputMouseButtonDown',
      blockType: Scratch.BlockType.BOOLEAN,
      text: 'is [BUTTON] mouse button down?',
      arguments: { BUTTON: { type: Scratch.ArgumentType.STRING, menu: 'mouseButtonMenu', defaultValue: 'left' } }
    },
    {
      opcode: 'inputScrollDelta',
      blockType: Scratch.BlockType.REPORTER,
      text: 'mouse scroll delta this frame'
    },
    {
      opcode: 'inputDoubleClick',
      blockType: Scratch.BlockType.BOOLEAN,
      text: 'was double-click detected?'
    },
    {
      opcode: 'inputKeyReleasedThisFrame',
      blockType: Scratch.BlockType.BOOLEAN,
      text: 'was key [KEY] released this frame?',
      arguments: { KEY: { type: Scratch.ArgumentType.STRING, defaultValue: 'space' } }
    }
  ]);

  // --- Time ---
  registerCategory('twtoolsplustime', 'Tools+ Time', '#FFBF00', '#d8a200', '#b28500', [
    {
      opcode: 'timeTimer',
      blockType: Scratch.BlockType.REPORTER,
      text: 'timer [ID]',
      arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'main' } }
    },
    {
      opcode: 'timeResetTimer',
      blockType: Scratch.BlockType.COMMAND,
      text: 'reset timer [ID]',
      arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'main' } }
    },
    {
      opcode: 'timeCurrentFormatted',
      blockType: Scratch.BlockType.REPORTER,
      text: 'current date/time formatted [FORMAT]',
      arguments: { FORMAT: { type: Scratch.ArgumentType.STRING, defaultValue: 'YYYY-MM-DD HH:mm:ss' } }
    },
    {
      opcode: 'timeWaitFrames',
      blockType: Scratch.BlockType.COMMAND,
      text: 'wait [N] frames',
      arguments: { N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 30 } }
    },
    {
      opcode: 'timeDaysBetween',
      blockType: Scratch.BlockType.REPORTER,
      text: 'days between [DATE1] and [DATE2]',
      arguments: {
        DATE1: { type: Scratch.ArgumentType.STRING, defaultValue: '2026-01-01' },
        DATE2: { type: Scratch.ArgumentType.STRING, defaultValue: '2026-12-31' }
      }
    }
  ]);

  // --- Debug ---
  registerCategory('twtoolsplusdebug', 'Tools+ Debug', '#FF661A', '#d85616', '#b24712', [
    {
      opcode: 'debugLog',
      blockType: Scratch.BlockType.COMMAND,
      text: 'log [VALUE] to console',
      arguments: { VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: 'hello' } }
    },
    {
      opcode: 'debugLogLevel',
      blockType: Scratch.BlockType.COMMAND,
      text: 'log [LEVEL] [VALUE]',
      arguments: {
        LEVEL: { type: Scratch.ArgumentType.STRING, menu: 'logLevelMenu', defaultValue: 'info' },
        VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: 'hello' }
      }
    },
    {
      opcode: 'debugAssert',
      blockType: Scratch.BlockType.COMMAND,
      text: 'assert [CONDITION] with message [TEXT]',
      arguments: {
        CONDITION: { type: Scratch.ArgumentType.BOOLEAN, defaultValue: true },
        TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'assertion failed' }
      }
    }
  ]);

  // --- Color ---
  registerCategory('twtoolspluscolor', 'Tools+ Color', '#E65C5C', '#c34e4e', '#a14040', [
    {
      opcode: 'colorRgbToHex',
      blockType: Scratch.BlockType.REPORTER,
      text: 'RGB to hex ([R],[G],[B])',
      arguments: {
        R: { type: Scratch.ArgumentType.NUMBER, defaultValue: 255 },
        G: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
        B: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
      }
    },
    {
      opcode: 'colorHexToRgb',
      blockType: Scratch.BlockType.REPORTER,
      text: 'hex to RGB [HEX] ([COMPONENT])',
      arguments: {
        HEX: { type: Scratch.ArgumentType.STRING, defaultValue: '#ff0000' },
        COMPONENT: { type: Scratch.ArgumentType.STRING, menu: 'rgbComponentMenu', defaultValue: 'r' }
      }
    },
    {
      opcode: 'colorMix',
      blockType: Scratch.BlockType.REPORTER,
      text: 'mix color [C1] and [C2] by [PERCENT] %',
      arguments: {
        C1: { type: Scratch.ArgumentType.COLOR, defaultValue: '#ff0000' },
        C2: { type: Scratch.ArgumentType.COLOR, defaultValue: '#0000ff' },
        PERCENT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 50 }
      }
    },
    {
      opcode: 'colorRandom',
      blockType: Scratch.BlockType.REPORTER,
      text: 'random color'
    },
    {
      opcode: 'colorBrightness',
      blockType: Scratch.BlockType.REPORTER,
      text: 'brightness of color [C]',
      arguments: { C: { type: Scratch.ArgumentType.COLOR, defaultValue: '#ff0000' } }
    },
    {
      opcode: 'colorIsLightDark',
      blockType: Scratch.BlockType.BOOLEAN,
      text: 'is color [C] light?',
      arguments: { C: { type: Scratch.ArgumentType.COLOR, defaultValue: '#ff0000' } }
    }
  ]);

  // --- Camera ---
  registerCategory('twtoolspluscamera', 'Tools+ Camera', '#0FBD8C', '#0ca077', '#0a8462', [
    {
      opcode: 'cameraGetPosition',
      blockType: Scratch.BlockType.REPORTER,
      text: 'camera [AXIS] position',
      arguments: { AXIS: { type: Scratch.ArgumentType.STRING, menu: 'axisMenu', defaultValue: 'x' } }
    },
    {
      opcode: 'cameraSetPosition',
      blockType: Scratch.BlockType.COMMAND,
      text: 'set camera position to ([X],[Y])',
      arguments: {
        X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
        Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
      }
    },
    {
      opcode: 'cameraGetZoom',
      blockType: Scratch.BlockType.REPORTER,
      text: 'camera zoom'
    },
    {
      opcode: 'cameraSetZoom',
      blockType: Scratch.BlockType.COMMAND,
      text: 'set camera zoom to [N]',
      arguments: { N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 } }
    },
    {
      opcode: 'cameraWorldToScreen',
      blockType: Scratch.BlockType.REPORTER,
      text: 'world to screen [AXIS] at ([X],[Y])',
      arguments: {
        AXIS: { type: Scratch.ArgumentType.STRING, menu: 'axisMenu', defaultValue: 'x' },
        X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
        Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
      }
    }
  ]);

  // --- Dictionaries ---
  registerCategory('twtoolsplusdict', 'Tools+ Dict', '#FF8C1A', '#d87716', '#b26212', [
    {
      opcode: 'dictCreate',
      blockType: Scratch.BlockType.REPORTER,
      text: 'create empty dictionary'
    },
    {
      opcode: 'dictSet',
      blockType: Scratch.BlockType.REPORTER,
      text: 'set dict [DICT] key [KEY] to [VALUE]',
      arguments: {
        DICT: { type: Scratch.ArgumentType.STRING, defaultValue: '{}' },
        KEY: { type: Scratch.ArgumentType.STRING, defaultValue: 'name' },
        VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: 'value' }
      }
    },
    {
      opcode: 'dictGet',
      blockType: Scratch.BlockType.REPORTER,
      text: 'get dict [DICT] key [KEY] (default [DEFAULT])',
      arguments: {
        DICT: { type: Scratch.ArgumentType.STRING, defaultValue: '{}' },
        KEY: { type: Scratch.ArgumentType.STRING, defaultValue: 'name' },
        DEFAULT: { type: Scratch.ArgumentType.STRING, defaultValue: '' }
      }
    },
    {
      opcode: 'dictDeleteKey',
      blockType: Scratch.BlockType.REPORTER,
      text: 'delete key [KEY] from dict [DICT]',
      arguments: {
        KEY: { type: Scratch.ArgumentType.STRING, defaultValue: 'name' },
        DICT: { type: Scratch.ArgumentType.STRING, defaultValue: '{}' }
      }
    },
    {
      opcode: 'dictHasKey',
      blockType: Scratch.BlockType.BOOLEAN,
      text: 'does dict [DICT] have key [KEY]?',
      arguments: {
        DICT: { type: Scratch.ArgumentType.STRING, defaultValue: '{}' },
        KEY: { type: Scratch.ArgumentType.STRING, defaultValue: 'name' }
      }
    },
    {
      opcode: 'dictKeysOrValues',
      blockType: Scratch.BlockType.REPORTER,
      text: 'dict [DICT] [MODE]',
      arguments: {
        DICT: { type: Scratch.ArgumentType.STRING, defaultValue: '{}' },
        MODE: { type: Scratch.ArgumentType.STRING, menu: 'keysValuesMenu', defaultValue: 'keys' }
      }
    }
  ]);

  // --- Network ---
  registerCategory('twtoolsplusnet', 'Tools+ Network', '#0B8E99', '#097882', '#07636b', [
    {
      opcode: 'netUrlEncodeDecode',
      blockType: Scratch.BlockType.REPORTER,
      text: '[MODE] [TEXT]',
      arguments: {
        MODE: { type: Scratch.ArgumentType.STRING, menu: 'urlEncodeMenu', defaultValue: 'URL-encode' },
        TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'hello world' }
      }
    },
    {
      opcode: 'netParseQueryString',
      blockType: Scratch.BlockType.REPORTER,
      text: 'parse query string [TEXT] as JSON',
      arguments: { TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'a=1&b=2' } }
    },
    {
      opcode: 'netGetQueryParam',
      blockType: Scratch.BlockType.REPORTER,
      text: 'get query parameter [KEY] from URL [URL]',
      arguments: {
        KEY: { type: Scratch.ArgumentType.STRING, defaultValue: 'id' },
        URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'https://example.com?id=5' }
      }
    }
  ]);

  // --- Audio ---
  registerCategory('twtoolsplusaudio', 'Tools+ Audio', '#CF63CF', '#af54af', '#904590', [
    {
      opcode: 'audioCurrentVolume',
      blockType: Scratch.BlockType.REPORTER,
      text: 'current volume of sound [SOUND]',
      arguments: { SOUND: { type: Scratch.ArgumentType.STRING, defaultValue: 'pop' } }
    },
    {
      opcode: 'audioSetPlaybackRate',
      blockType: Scratch.BlockType.COMMAND,
      text: 'set playback rate of sound [SOUND] to [N]',
      arguments: {
        SOUND: { type: Scratch.ArgumentType.STRING, defaultValue: 'pop' },
        N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
      }
    },
    {
      opcode: 'audioIsPlaying',
      blockType: Scratch.BlockType.BOOLEAN,
      text: 'is sound [SOUND] currently playing?',
      arguments: { SOUND: { type: Scratch.ArgumentType.STRING, defaultValue: 'pop' } }
    },
    {
      opcode: 'audioDuration',
      blockType: Scratch.BlockType.REPORTER,
      text: 'duration of sound [SOUND]',
      arguments: { SOUND: { type: Scratch.ArgumentType.STRING, defaultValue: 'pop' } }
    }
  ]);

  // --- Control flow ---
  registerCategory('twtoolspluscontrol', 'Tools+ Control', '#FFAB19', '#d89115', '#b27711', [
    {
      opcode: 'controlRunAfter',
      blockType: Scratch.BlockType.COMMAND,
      text: 'run task [ID] after [SECONDS] seconds',
      arguments: {
        ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'task1' },
        SECONDS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
      }
    },
    {
      opcode: 'controlCancelTask',
      blockType: Scratch.BlockType.COMMAND,
      text: 'cancel scheduled task [ID]',
      arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'task1' } }
    },
    {
      opcode: 'controlDebounce',
      blockType: Scratch.BlockType.BOOLEAN,
      text: 'debounce [ID]: has [SECONDS] seconds passed since last call?',
      arguments: {
        ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'action1' },
        SECONDS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.5 }
      }
    },
    {
      opcode: 'controlThrottle',
      blockType: Scratch.BlockType.BOOLEAN,
      text: 'throttle [ID]: allow call every [SECONDS] seconds?',
      arguments: {
        ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'action1' },
        SECONDS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.5 }
      }
    },
    {
      opcode: 'controlTaskExists',
      blockType: Scratch.BlockType.BOOLEAN,
      text: 'is task [ID] still scheduled?',
      arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'task1' } }
    }
  ]);

  // --- Geometry ---
  registerCategory('twtoolsplusgeo', 'Tools+ Geometry', '#4C97FF', '#4080d8', '#3569b2', [
    {
      opcode: 'geoPointInRect',
      blockType: Scratch.BlockType.BOOLEAN,
      text: 'point ([X],[Y]) inside rectangle ([X1],[Y1]) - ([X2],[Y2])?',
      arguments: {
        X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
        Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
        X1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
        Y1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
        X2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
        Y2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
      }
    },
    {
      opcode: 'geoPointInCircle',
      blockType: Scratch.BlockType.BOOLEAN,
      text: 'point ([X],[Y]) inside circle center ([CX],[CY]) radius [R]?',
      arguments: {
        X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
        Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
        CX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
        CY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
        R: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 }
      }
    },
    {
      opcode: 'geoRectsOverlap',
      blockType: Scratch.BlockType.BOOLEAN,
      text: 'do rectangle A ([AX1],[AY1])-([AX2],[AY2]) and rectangle B ([BX1],[BY1])-([BX2],[BY2]) overlap?',
      arguments: {
        AX1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
        AY1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
        AX2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
        AY2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
        BX1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 },
        BY1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 },
        BX2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 8 },
        BY2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 8 }
      }
    },
    {
      opcode: 'geoRotatePoint',
      blockType: Scratch.BlockType.REPORTER,
      text: 'rotate point ([X],[Y]) around ([CX],[CY]) by [ANGLE] degrees ([AXIS])',
      arguments: {
        X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
        Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
        CX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
        CY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
        ANGLE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 90 },
        AXIS: { type: Scratch.ArgumentType.STRING, menu: 'axisMenu', defaultValue: 'x' }
      }
    },
    {
      opcode: 'geoMidpoint',
      blockType: Scratch.BlockType.REPORTER,
      text: 'midpoint [AXIS] between ([X1],[Y1]) and ([X2],[Y2])',
      arguments: {
        AXIS: { type: Scratch.ArgumentType.STRING, menu: 'axisMenu', defaultValue: 'x' },
        X1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
        Y1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
        X2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
        Y2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
      }
    },
    {
      opcode: 'geoNormalizeVector',
      blockType: Scratch.BlockType.REPORTER,
      text: 'normalize vector ([X],[Y]) [AXIS]',
      arguments: {
        X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 },
        Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 4 },
        AXIS: { type: Scratch.ArgumentType.STRING, menu: 'axisMenu', defaultValue: 'x' }
      }
    }
  ]);

  // --- Bullets (NEW) ---
  registerCategory('twtoolsplusbullets', 'Tools+ Bullets', '#E25B5B', '#c04d4d', '#9e3f3f', [
    {
      opcode: 'bulletVelocityX',
      blockType: Scratch.BlockType.REPORTER,
      text: 'velocity X towards ([X],[Y]) at speed [SPEED]',
      arguments: {
        X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
        Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
        SPEED: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 }
      }
    },
    {
      opcode: 'bulletVelocityY',
      blockType: Scratch.BlockType.REPORTER,
      text: 'velocity Y towards ([X],[Y]) at speed [SPEED]',
      arguments: {
        X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
        Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
        SPEED: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 }
      }
    },
    {
      opcode: 'bulletDirectionTowards',
      blockType: Scratch.BlockType.REPORTER,
      text: 'direction towards ([X],[Y])',
      arguments: {
        X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
        Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
      }
    },
    {
      opcode: 'bulletVelocityFromDirection',
      blockType: Scratch.BlockType.REPORTER,
      text: 'velocity [AXIS] from direction [DIR] speed [SPEED]',
      arguments: {
        AXIS: { type: Scratch.ArgumentType.STRING, menu: 'axisMenu', defaultValue: 'x' },
        DIR: { type: Scratch.ArgumentType.NUMBER, defaultValue: 90 },
        SPEED: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 }
      }
    },
    {
      opcode: 'bulletSpeedFromVelocity',
      blockType: Scratch.BlockType.REPORTER,
      text: 'speed from velocity ([VX],[VY])',
      arguments: {
        VX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 },
        VY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 4 }
      }
    },
    {
      opcode: 'bulletAngleDifference',
      blockType: Scratch.BlockType.REPORTER,
      text: 'angle difference from [DIR1] to [DIR2]',
      arguments: {
        DIR1: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
        DIR2: { type: Scratch.ArgumentType.NUMBER, defaultValue: 90 }
      }
    },
    {
      opcode: 'bulletSpreadDirection',
      blockType: Scratch.BlockType.REPORTER,
      text: 'spread direction [DIR] by [SPREAD] (index [I] of [N])',
      arguments: {
        DIR: { type: Scratch.ArgumentType.NUMBER, defaultValue: 90 },
        SPREAD: { type: Scratch.ArgumentType.NUMBER, defaultValue: 30 },
        I: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
        N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 }
      }
    },
    {
      opcode: 'bulletPointInDirectionOfMotion',
      blockType: Scratch.BlockType.COMMAND,
      text: 'point in direction of velocity ([VX],[VY])',
      arguments: {
        VX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 },
        VY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 4 }
      }
    },
    {
      opcode: 'bulletMoveByVelocity',
      blockType: Scratch.BlockType.COMMAND,
      text: 'move by velocity ([VX],[VY])',
      arguments: {
        VX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 },
        VY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 4 }
      }
    },
    {
      opcode: 'bulletIsOffStage',
      blockType: Scratch.BlockType.BOOLEAN,
      text: 'is this sprite off stage (margin [MARGIN])?',
      arguments: { MARGIN: { type: Scratch.ArgumentType.NUMBER, defaultValue: 20 } }
    }
  ]);

  // --- Misc ---
  registerCategory('twtoolsplusmisc', 'Tools+ Misc', '#888888', '#737373', '#5f5f5f', [
    {
      opcode: 'miscDeepCopy',
      blockType: Scratch.BlockType.REPORTER,
      text: 'deep copy of [JSON]',
      arguments: { JSON: { type: Scratch.ArgumentType.STRING, defaultValue: '{"a":[1,2,3]}' } }
    }
  ]);

})(Scratch);
