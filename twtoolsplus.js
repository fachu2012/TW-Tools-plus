// TW Tools+ — Copyright (c) 2026
// Licensed under the Mozilla Public License 2.0
// https://www.mozilla.org/en-US/MPL/2.0/
//
// A large utility extension for TurboWarp adding ~100 new blocks:
// Math, Text, Lists, JSON, Storage, Sprite/Stage, Input, Time,
// Debug, Color, Camera, Dictionaries, Network, Audio, Control flow,
// Geometry and misc helpers.
//
// This extension is UNSANDBOXED. It must be loaded with
// "Run extension without sandbox" enabled, or hosted and loaded
// as a trusted/unsandboxed extension.

(function (Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('TW Tools+ must be run unsandboxed');
  }

  const BaseColor = '#4C97FF'; // pick your base color here

  // ---------------------------------------------------------------------
  // Small internal helpers (not exposed as blocks)
  // ---------------------------------------------------------------------
  const toNumber = (v) => Number(v) || 0;

  const savedKeys = new Map(); // used by Storage category (in-memory + localStorage)

  function storageKey(key) {
    return `twtoolsplus:${key}`;
  }

  // ---------------------------------------------------------------------
  // Category separator helper
  // Uses Scratch.BlockType.LABEL (TurboWarp-only) to visually separate
  // groups of blocks within the single-color palette.
  // ---------------------------------------------------------------------
  function label(text) {
    return {
      blockType: Scratch.BlockType.LABEL,
      text
    };
  }

  class TWToolsPlus {
    constructor() {
      this.runtime = Scratch.vm.runtime;

      // ---- Input state ----
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

      // ---- Sprite / clones ----
      this._cloneCounters = new Map(); // originalTarget -> next clone number

      // ---- Timers ----
      this._timers = new Map(); // id -> Date.now() at start/reset

      // ---- Logical camera (coordinate helper only, see Camera section) ----
      this._camera = { x: 0, y: 0, zoom: 1 };

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

      // Mouse buttons/scroll are attached to the stage canvas, since that's
      // the element that actually receives these events.
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
      // The renderer's canvas may not exist yet at extension load time.
      setTimeout(attachToCanvas, 500);
    }

    _setupFrameHook() {
      // Fires once per rendered frame, before scripts execute for that
      // frame. Used to snapshot "this frame" input events.
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
      // Real scratch-vm event, fired whenever any target (including
      // clones) is created.
      this.runtime.on('targetWasCreated', (newTarget, sourceTarget) => {
        if (!newTarget.isOriginal && sourceTarget) {
          const current = this._cloneCounters.get(sourceTarget) || 0;
          const next = current + 1;
          this._cloneCounters.set(sourceTarget, next);
          newTarget.__twToolsCloneNumber = next;
        }
      });
    }

    getInfo() {
      return {
        id: 'twtoolsplus',
        name: 'Tools+',
        color1: BaseColor,
        menuIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAIEklEQVR4nO1aT4xeVRX/nfvnfXUodCwgpDFRXIhIILaGaHHDQmMMERIXYsS4MJqaSJQNG1eouDayIP5dGXSDxEQTpAuBFYp1YWKNVow0UStI2gozbe8999yfi3ffzJuvM7b9PqYd4vdLbuZ9791z3zn3/L9vgAUWWGCBBRZYYIEF/j8hV5qBASQdADe+BaCKCK8QS9sPkkIykNxSEST9/3o+L66YBZD0ImJrv8/xPcWXm0XkBjNj13XHAfxeRF6+UjxuG0h6ADh9+vRbSykPWbHfaVblFEqxkznnH5JcbtayY1x2ZgzCl5Q+acVeGoRVVWrOqjlnzZo155JzNpLMuRxqtOHKcj8nBuFV9ZFB8NyjqKppzrUfWnPOylpZSvnXuXPnbmkW4C70jh2LkfBfJ8mi2gvehM5rwueqOStJmtkrKaX9Y/o3JUbCf7yZe9acRxpfH7kJX0p5OaX0voF+2v/fNPFgCF4kd6vqS2ZWx5rfTHgzO5FSur3Rx2Gd0XquXe98lxgCV875EEn2Qe584TXnQpJW7B8p8dZGG8fRf6x1ksvT92bB5djBCgAi8hn01d15pR0BOufEzP6mRT8ymchRklFEtNFycKMjR45EVX0cwLFSyn3jZzsOI83dqDm/Xs04RPupoJdJMqX0rTZ/MrWOG6rGUsrPRqnzheH5rDxutwU4AFDVm0KMu82sklyzALYBEUcSzrl7SV4FQEeb59q0YGY/9d7fq6qp1koA7zh16tSyiNRZXeGyBBERuQYAOciLqRqcdFZKCSHcVFL5mIhUAB3JDgBxFNHMnvTe36NZVYAIQEDsXl5evhoAHn744Z2XFQbfPHv27F2t6Cn5/MjfX6uqmVVVfZ7k3mGNY8eOTUouvyDJnNYCqFUz5pxfX11d3dfeNdMGbHdp2ax91/FSSnbOdaysQDNvjCyB9LVWhhA+aGZ/VNVfSa1PVZH7ffQfVVUVafyKUJyD1HpyaWnp5DwMbrvZNM24UspvQwj7VdWkud4QC8ZMEGCMcYNrjmnaHIsxelV9quu6u6c7y0vB5WgunIiYqmYAEAgJnh8HGgQQVa0AansuMh2r2IcS59wT62SzYVstYMjlqvphJ/JLEqisTjBl/hjuNLreR+poKTdMJ1C9967W+vcQwnsBrAJ9rTALj9tmASSDiGhKab+I/ISAIzlodcrsidGmWIwxYKT1aoZaqwEQgVTnnK+1PigiK/OYP7BNG9CELyml/d77p73310378dpcrG+GAAwxhqLlnwL5Q0XNLYXeEWJ8i5VSfAixlPLNGOOT8wq/LRhq/5TSgVLKv1v9r1vU/+tDtdRaqapfG+r80Zq3FC2/qbWy5PJQu7fzyt814VfSASs2El435P3pWmDo/1X1kWGtdghy5+rq6tvb2vtIHmzXO68LHGl+/4U0n6c03wqgEySvIhlz1u+bWalWaWYnSymfHr1nB2t+E+Hz1lo37Y/DEsmaUz4MAKp6d7MGG84Hcs4nT58+vXezg5F5MXcQHAW8A0PAK6oFgAe2zLPVh+BFZN2UBUZSVPVmABVkEUhQVQJY3rNnzw0icnLUHL0hmGsD1oRfWTkQfHjaebcm/MY8vwE1xOjNyikR94Na63MhhFMk/wPAOecyANdnPEAgAtJSStLM342tYN4sMPMGtBQ0aP6w8+7ai9F8L7wdLcU+sWtXPDY9IaV0znuPqQQpk8nk9SbsBoFJyjyfz2byJ5JORGpK6Vbv/TPe++vHwm9F5pwDgRXv/ftF5MV8Jh/0E/8FktejghXVRORdInIbayUHMwBA8Dnn3Gu1VnFwFC9mZoe7rvvOvJtwqcILSffqq69eU1T/3Lep6cJ5vp36aNbvtXXuMLNVboLcvg2M6Teb1+Z+ua03U3aYxQW8iJSc8wM+hHcX1Swi/ckt1k3qvBgg/S9x8muSUkr5XAhhqaieRX/AMUS21vxsVGizsDW0jjCIyGcBPIqNvcNFY5aCwlrwux9A5cjsh3p+swDYAhcBpGauywAMkNDW8NKPrXjyUyOgPxWaALM3Q5e0Ac33eebMmRtJvrPW6gQb3zy0udPcCKS2R/varb8C8AQpaMFNxNDP2wwVfQA09PMLAEfweOPtsrkAlpaWJkU1sG5tddOHHE7ga62otT7frOFRM7srxvihadrS5/6NjMY4LWCotR6PMX51ZF2XjEvKAkO0JXl10fKXEMPbVJWy3qtvtiAhUkMIQVW/1HXdY0MXR9Kr6p0isge9NZZacU+M/pAVKxA49HmfAB4QkeMAvJlxMpkogBdacXRZs0D/nS/rj1rJm7aK/DklU9WhnP1Kow/t76abn1L6fFs3q6oVVeacbWiKNuFnrsZoFmKSlBDDN8zsjA+hA6BoB1VNDQRQRESa5h/suu7bQ+UIrH3tkVbfe5KTZhlLG16G/hgthLCnzYsjGmlH6JdvA9oLnYgcY+GnWLkaYux8CA7oXSDE6EKM0XmvqvrFaeFHa1FEbKjwRMScc8CQ0tZ2lOi6ro7ntTG32c9kPiJizzzDEHfFnxcrH6i1Pl5rfcU5JxCBmZ0opfz4bCkHu6777mbCbwUzWwHg2Ef84pwYez5XZuF1WzFOPST3krw9pXQbRyc6F5uemjvIa+R1quXouNpT1cfanDf8IGTu3roxJdNdWROcl+Kjoyyz18zuq7VeKyJ/ijE+MQTNHft/g0OP0MbMG7sZ7TzrXQhv2Klw08zc2hmyA1qJ/eyzwMXGjwUWWGCBBRZYYIEFFljgovFfhi76q5mANRQAAAAASUVORK5CYII=',
        blockIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAACHUlEQVR4nNWVPWgUURSFz32TyWIhpkkhQgorWxEUrCwUf0orrbS1E0QQaxttVLAXO40pLexiIySQYCvRwkoWFRbDkuy7P3ts3sRJjOyajaCnm3lvvnvuu2dmgP9d8qcPkBQACQBEJPbVDclqX4G7qd/vHyZ5VlVPkjwwMZCkkEwkxczuRUSPRap6o6x3JilQAYCZ3S/QIEl3X+j1ejOTuk8AsLm5edTN3d1zRISZvVhbW+sAwPr6+mzO+dpeC0wBQM75Kkma6kbp4nZZn3H3pYggyUPl3rZkTo2uweTu3wCQQO3uFJG7qprM7EJd16fcrJtS2lMHNQCY2UWSNDNvZtCWuy+U/ePHuHU8x8O96+6hqtnNw8w+quotM3sWHu9JzjVpGwu+uLi4BXf3r+X8tXFsZucj4pG7Xyd5sMDH+yo0Ltpw/Ql/pwO9aWbnSqGVsY+kgZMUDngs3L8U5zkihm6+oht6OiIeuPprMzNV/RwRTyPiMcnZwvh9J82QVPVlcZ7NLJMc5pyfmNnDrbc452F70IPB4HKb0WhnTAkAQh4BQIGEADUAqapqtaqqZQB1mM1VVXXJ3bsAXqWUvg86nTeFMRzZgbtfabtT1TvtfWZ2psxgecSpb+9ARIKkiMhzVf1U1/UJM1udnp5eKsNvAtBNKX0A8LbEOQEwEeGogk0nsuP6l3xP/G+Yn5+vSE7tBmoMjJ39veivwv8p/QA8RTRqLSOEOAAAAABJRU5ErkJggg==',
        // Intended to declare what this extension uses, for a clearer
        // warning dialog on unsandboxed load. As of writing this is not
        // a stable, documented getInfo() field across all TurboWarp
        // versions — verify against the current docs.turbowarp.org
        // before relying on it; safe to leave as an empty array otherwise.
        permissions: [],
        blocks: [
          // =================================================================
          // MATH
          // =================================================================
          label('Math'),
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
            arguments: {
              SEED: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
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
          },

          // =================================================================
          // TEXT
          // =================================================================
          label('Text'),
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
              LIST: { type: Scratch.ArgumentType.STRING, defaultValue: 'my list' },
              SEPARATOR: { type: Scratch.ArgumentType.STRING, defaultValue: ', ' }
            }
          },
          {
            opcode: 'textTrim',
            blockType: Scratch.BlockType.REPORTER,
            text: 'trim [TEXT]',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: '  hi  ' }
            }
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
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'hello there world' }
            }
          },

          // =================================================================
          // LISTS / ARRAYS
          // =================================================================
          label('Lists'),
          {
            opcode: 'listReverse',
            blockType: Scratch.BlockType.REPORTER,
            text: 'reverse list [LIST]',
            arguments: { LIST: { type: Scratch.ArgumentType.STRING, defaultValue: 'my list' } }
          },
          {
            opcode: 'listShuffle',
            blockType: Scratch.BlockType.REPORTER,
            text: 'shuffle list [LIST]',
            arguments: { LIST: { type: Scratch.ArgumentType.STRING, defaultValue: 'my list' } }
          },
          {
            opcode: 'listRemoveDuplicates',
            blockType: Scratch.BlockType.REPORTER,
            text: 'remove duplicates from [LIST]',
            arguments: { LIST: { type: Scratch.ArgumentType.STRING, defaultValue: 'my list' } }
          },
          {
            opcode: 'listSort',
            blockType: Scratch.BlockType.REPORTER,
            text: 'sort list [LIST] ([MODE])',
            arguments: {
              LIST: { type: Scratch.ArgumentType.STRING, defaultValue: 'my list' },
              MODE: { type: Scratch.ArgumentType.STRING, menu: 'sortModeMenu', defaultValue: 'numeric' }
            }
          },
          {
            opcode: 'listSublist',
            blockType: Scratch.BlockType.REPORTER,
            text: 'sublist of [LIST] from [I] to [J]',
            arguments: {
              LIST: { type: Scratch.ArgumentType.STRING, defaultValue: 'my list' },
              I: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
              J: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 }
            }
          },
          {
            opcode: 'listMerge',
            blockType: Scratch.BlockType.REPORTER,
            text: 'merge list [LIST1] and [LIST2]',
            arguments: {
              LIST1: { type: Scratch.ArgumentType.STRING, defaultValue: 'list 1' },
              LIST2: { type: Scratch.ArgumentType.STRING, defaultValue: 'list 2' }
            }
          },
          {
            opcode: 'listEquals',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'is list [LIST1] equal to [LIST2]?',
            arguments: {
              LIST1: { type: Scratch.ArgumentType.STRING, defaultValue: 'list 1' },
              LIST2: { type: Scratch.ArgumentType.STRING, defaultValue: 'list 2' }
            }
          },
          {
            opcode: 'listIndexOfMinMax',
            blockType: Scratch.BlockType.REPORTER,
            text: 'index of [MODE] in [LIST]',
            arguments: {
              MODE: { type: Scratch.ArgumentType.STRING, menu: 'minMaxMenu', defaultValue: 'max' },
              LIST: { type: Scratch.ArgumentType.STRING, defaultValue: 'my list' }
            }
          },
          {
            opcode: 'listSumAverage',
            blockType: Scratch.BlockType.REPORTER,
            text: '[MODE] of [LIST]',
            arguments: {
              MODE: { type: Scratch.ArgumentType.STRING, menu: 'sumAverageMenu', defaultValue: 'sum' },
              LIST: { type: Scratch.ArgumentType.STRING, defaultValue: 'my list' }
            }
          },
          {
            opcode: 'listChunk',
            blockType: Scratch.BlockType.REPORTER,
            text: 'chunk list [LIST] into groups of [N]',
            arguments: {
              LIST: { type: Scratch.ArgumentType.STRING, defaultValue: 'my list' },
              N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2 }
            }
          },

          // =================================================================
          // JSON / STRUCTURED DATA
          // =================================================================
          label('JSON'),
          {
            opcode: 'jsonListToJson',
            blockType: Scratch.BlockType.REPORTER,
            text: 'list [LIST] to JSON',
            arguments: { LIST: { type: Scratch.ArgumentType.STRING, defaultValue: 'my list' } }
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
          },

          // =================================================================
          // STORAGE
          // =================================================================
          label('Storage'),
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
          },

          // =================================================================
          // SPRITE / STAGE
          // =================================================================
          label('Sprite / Stage'),
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
          },

          // =================================================================
          // INPUT
          // =================================================================
          label('Input'),
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
          },

          // =================================================================
          // TIME
          // =================================================================
          label('Time'),
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
          },

          // =================================================================
          // DEBUG / MISC
          // =================================================================
          label('Debug'),
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
          },

          // =================================================================
          // COLOR
          // =================================================================
          label('Color'),
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
          },

          // =================================================================
          // CAMERA / VIEWPORT
          // =================================================================
          label('Camera'),
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
          },

          // =================================================================
          // DICTIONARIES
          // =================================================================
          label('Dictionaries'),
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
          },

          // =================================================================
          // NETWORK (light helpers, no fetch wrapper duplication)
          // =================================================================
          label('Network'),
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
          },

          // =================================================================
          // AUDIO
          // =================================================================
          label('Audio'),
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
          },

          // =================================================================
          // CONTROL FLOW HELPERS
          // =================================================================
          label('Control flow'),
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
          },

          // =================================================================
          // GEOMETRY
          // =================================================================
          label('Geometry'),
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
          },

          // =================================================================
          // MISC EXTRAS
          // =================================================================
          label('Misc'),
          {
            opcode: 'miscDeepCopy',
            blockType: Scratch.BlockType.REPORTER,
            text: 'deep copy of [JSON]',
            arguments: { JSON: { type: Scratch.ArgumentType.STRING, defaultValue: '{"a":[1,2,3]}' } }
          }
        ],

        menus: {
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
        }
      };
    }

    // =====================================================================
    // MATH implementations
    // =====================================================================
    mathRound(args) {
      const factor = Math.pow(10, toNumber(args.DECIMALS));
      return Math.round(toNumber(args.N) * factor) / factor;
    }
    mathMap(args) {
      const { VALUE, A, B, C, D } = args;
      const t = (toNumber(VALUE) - toNumber(A)) / (toNumber(B) - toNumber(A));
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
      // simple mulberry32 seeded PRNG
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

    // =====================================================================
    // TEXT implementations
    // =====================================================================
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
      // LIST is expected as a JSON array string, same convention as the
      // "Lists" category below (see note there about wiring real Scratch
      // list variables instead, if that's what you want).
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

    // =====================================================================
    // LISTS implementations
    // NOTE: These stubs work on JSON-encoded arrays passed as strings.
    // Wiring them to actual Scratch list variables (by name, per target)
    // requires using this.runtime / util.target's list storage — left as
    // a TODO since it depends on how you want lists selected (dropdown
    // vs text field).
    // =====================================================================
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
      return arr.indexOf(value) + 1; // 1-indexed like Scratch
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

    // =====================================================================
    // JSON implementations
    // =====================================================================
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
        try { value = JSON.parse(args.VALUE); } catch (e) { /* keep as string */ }
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

    // =====================================================================
    // STORAGE implementations
    // =====================================================================
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

    // =====================================================================
    // SPRITE / STAGE implementations
    // =====================================================================
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

    // =====================================================================
    // INPUT implementations
    // =====================================================================
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

    // =====================================================================
    // TIME implementations
    // =====================================================================
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
      // Note: counts real display frames via requestAnimationFrame, which
      // is a close approximation but not perfectly tied to TurboWarp's
      // internal script step rate (e.g. under a custom FPS/turbo mode).
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

    // =====================================================================
    // DEBUG implementations
    // =====================================================================
    debugLog(args) { console.log('[TW Tools+]', args.VALUE); }
    debugLogLevel(args) {
      const level = args.LEVEL === 'error' ? 'error' : args.LEVEL === 'warning' ? 'warn' : 'log';
      console[level]('[TW Tools+]', args.VALUE);
    }
    debugAssert(args) {
      if (!args.CONDITION) console.error('[TW Tools+] Assertion failed:', args.TEXT);
    }

    // =====================================================================
    // COLOR implementations
    // =====================================================================
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

    // =====================================================================
    // CAMERA implementations
    // IMPORTANT: TurboWarp/Scratch has no built-in camera or stage panning.
    // This is a LOGICAL camera only: it stores an x/y/zoom and converts
    // world coordinates to screen coordinates using that state. It does
    // NOT move sprites or the stage by itself — to build an actual
    // scrolling game, use "world to screen" in your own "go to x y"
    // blocks for each sprite, updated every frame.
    // =====================================================================
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

    // =====================================================================
    // DICTIONARIES implementations (JSON-object-backed)
    // =====================================================================
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

    // =====================================================================
    // NETWORK implementations
    // =====================================================================
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

    // =====================================================================
    // AUDIO implementations
    // NOTE: Scratch doesn't track volume per individual sound, only per
    // sprite/stage — "current volume" reports the sprite's own volume.
    // Playback-rate/isPlaying/duration reach into scratch-vm's internal
    // soundBank/soundPlayers structures, which are undocumented and can
    // change between versions — every call is wrapped in try/catch so it
    // fails safely (returns a sane default) instead of throwing.
    // =====================================================================
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
      } catch (e) { /* not supported on this VM version */ }
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

    // =====================================================================
    // CONTROL FLOW implementations
    // =====================================================================
    _tasks = new Map();
    _debounceTimestamps = new Map();
    _throttleTimestamps = new Map();

    controlRunAfter(args) {
      const id = args.ID;
      const handle = setTimeout(() => {
        this._tasks.delete(id);
        // Fires a broadcast named after the task ID, so you can catch it
        // with a normal "when I receive [id]" block elsewhere.
        try {
          const stage = this.runtime.getTargetForStage();
          const broadcastVar = stage && stage.lookupBroadcastMsg(null, id);
          if (broadcastVar) {
            this.runtime.startHats('event_whenbroadcastreceived', { BROADCAST_OPTION: broadcastVar.id });
          }
        } catch (e) { /* no matching broadcast message exists in the project */ }
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

    // =====================================================================
    // GEOMETRY implementations
    // =====================================================================
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

    // =====================================================================
    // MISC implementations
    // =====================================================================
    miscDeepCopy(args) {
      try {
        return JSON.stringify(JSON.parse(JSON.stringify(JSON.parse(args.JSON))));
      } catch (e) {
        return args.JSON;
      }
    }
  }

  Scratch.extensions.register(new TWToolsPlus());
})(Scratch);
