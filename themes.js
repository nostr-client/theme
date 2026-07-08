/**
 * themes.js — named themes for the whole nostr-client ecosystem.
 * Your content. Your vibe. Your rules. No build step.
 *
 * Part of https://github.com/nostr-client — License: AGPL-3.0-or-later
 *
 * A theme is just values for the --nc-* tokens (see theme.css). Applying one
 * sets inline custom properties on <html>, which outranks every stylesheet —
 * so it reskins any nostr-client page, and persists across the whole origin.
 *
 *   import { applyTheme, restoreTheme } from 'https://nostr-client.github.io/theme/themes.js'
 *   restoreTheme()          // early in a client, before first paint settles
 *   applyTheme('moss')      // or drop <nostr-theme-picker> in a settings page
 */

const T = (accent, accentSoft, extra = {}) => ({
  '--nc-accent': accent, '--nc-accent-soft': accentSoft, '--nc-accent-ink': '#ffffff', ...extra,
})

export const THEMES = {
  violet: { label: 'Violet', vibe: 'the original', ...{ tokens: T('#7c3aed', '#f2ecfd') } },
  moss: { label: 'Moss', vibe: 'calm forest', tokens: T('#4a7d5f', '#ecf3ee') },
  bitcoin: { label: 'Bitcoin', vibe: 'number go up', tokens: T('#f7931a', '#fdeed8') },
  sky: { label: 'Sky', vibe: 'blue horizons', tokens: T('#1083fe', '#e7f1ff') },
  rose: { label: 'Rose', vibe: 'warm & soft', tokens: T('#d64570', '#fbeaf0') },
  ocean: { label: 'Ocean', vibe: 'deep teal', tokens: T('#0e7f8a', '#e3f3f5') },
  ember: { label: 'Ember', vibe: 'burnt orange', tokens: T('#c2451e', '#faeae3') },
  ink: { label: 'Ink', vibe: 'just black', tokens: T('#201d26', '#eceaf0') },
  paper: {
    label: 'Paper', vibe: 'serif reading room',
    tokens: T('#a05e2c', '#f6ede2', {
      '--nc-bg': '#f7f3ec', '--nc-surface': '#fffdf9', '--nc-inset': '#efe9df',
      '--nc-line': '#e5ddd0', '--nc-font-content': '"Iowan Old Style", Palatino, Georgia, serif',
    }),
  },
  midnight: {
    label: 'Midnight', vibe: 'lights off', dark: true,
    tokens: T('#a78bfa', '#2e2745', {
      '--nc-bg': '#141318', '--nc-surface': '#1d1c23', '--nc-inset': '#26242e',
      '--nc-ink': '#eceaf2', '--nc-soft': '#a9a5b8', '--nc-faint': '#6f6b80',
      '--nc-line': '#2e2c38',
      '--nc-shadow': '0 1px 2px rgb(0 0 0 / 40%)',
      '--nc-shadow-pop': '0 8px 32px rgb(0 0 0 / 60%)',
    }),
  },
}

const STORAGE_KEY = 'nostr-client:theme'
const MANAGED = ['--nc-accent', '--nc-accent-soft', '--nc-accent-ink', '--nc-bg', '--nc-surface',
  '--nc-inset', '--nc-ink', '--nc-soft', '--nc-faint', '--nc-line', '--nc-shadow',
  '--nc-shadow-pop', '--nc-font-content']

export function applyTheme(name, { persist = true } = {}) {
  const theme = THEMES[name]
  if (!theme) throw new Error('unknown theme: ' + name)
  const root = document.documentElement
  for (const token of MANAGED) root.style.removeProperty(token)
  for (const [token, value] of Object.entries(theme.tokens)) root.style.setProperty(token, value)
  root.style.colorScheme = theme.dark ? 'dark' : 'light'
  if (persist) { try { localStorage.setItem(STORAGE_KEY, name) } catch {} }
  window.dispatchEvent(new CustomEvent('nostr:theme', { detail: { name } }))
  return theme
}

export function currentTheme() {
  try { return localStorage.getItem(STORAGE_KEY) || 'violet' } catch { return 'violet' }
}

/** Apply the saved theme (no-op on default). Call early in a client. */
export function restoreTheme() {
  const name = currentTheme()
  if (name !== 'violet' && THEMES[name]) applyTheme(name, { persist: false })
}

// ---------------------------------------------------------------- picker

const TEMPLATE = /* html */ `
<style>
  :host { display: block;
    font-family: var(--nc-font, ui-sans-serif, system-ui, sans-serif);
    color: var(--nc-ink, #201d26); }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr)); gap: .6rem; }
  button { font: inherit; cursor: pointer; text-align: left; display: grid; gap: .45rem;
    background: var(--nc-surface, #fff); border: 1.5px solid var(--nc-line, #e9e6e0);
    border-radius: var(--nc-radius, 14px); padding: .7rem .8rem; color: inherit; }
  button:hover { border-color: var(--nc-faint, #a8a4b0); }
  button.active { border-color: var(--nc-accent, #7c3aed); }
  .strip { display: flex; height: 1.4rem; border-radius: 7px; overflow: hidden;
    border: 1px solid var(--nc-line, #e9e6e0); }
  .strip span { flex: 1; }
  strong { font-size: .9rem; }
  .vibe { font-size: .74rem; color: var(--nc-faint, #a8a4b0); }
</style>
<div class="grid" id="grid"></div>
`

class NostrThemePicker extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' }).innerHTML = TEMPLATE
  }

  connectedCallback() {
    const grid = this.shadowRoot.getElementById('grid')
    for (const [name, theme] of Object.entries(THEMES)) {
      const b = document.createElement('button')
      if (name === currentTheme()) b.classList.add('active')
      const strip = document.createElement('div')
      strip.className = 'strip'
      const bg = theme.tokens['--nc-bg'] ?? '#faf9f7'
      const surface = theme.tokens['--nc-surface'] ?? '#ffffff'
      const ink = theme.tokens['--nc-ink'] ?? '#201d26'
      for (const color of [bg, surface, theme.tokens['--nc-accent'], theme.tokens['--nc-accent-soft'], ink]) {
        const s = document.createElement('span')
        s.style.background = color
        strip.append(s)
      }
      const label = document.createElement('strong')
      label.textContent = theme.label
      const vibe = document.createElement('span')
      vibe.className = 'vibe'
      vibe.textContent = theme.vibe
      b.append(strip, label, vibe)
      b.onclick = () => {
        applyTheme(name)
        for (const x of grid.children) x.classList.toggle('active', x === b)
      }
      grid.append(b)
    }
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('nostr-theme-picker')) {
  customElements.define('nostr-theme-picker', NostrThemePicker)
}
