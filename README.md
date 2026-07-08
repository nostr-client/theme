# theme

The nostr-client design system: **one CSS file of tokens**. No build step.
[`theme.css`](theme.css).

Part of [nostr-client](https://github.com/nostr-client) — a modular, composable
nostr client where each repo does one thing.

**Live demo:** https://nostr-client.github.io/theme/

## How it works

Custom properties inherit through shadow DOM. Every nostr-client component
styles itself with `var(--nc-*, fallback)` — good-looking defaults with no
theme present, fully reskinnable when one is:

```html
<link rel="stylesheet" href="https://nostr-client.github.io/theme/theme.css">
```

Reskin a whole client by overriding tokens:

```css
:root {
  --nc-accent: #0b7a4b;
  --nc-font-content: Georgia, serif;  /* what the zen client does */
}
```

## Tokens

| group | tokens |
|---|---|
| type | `--nc-font`, `--nc-font-content` (note bodies), `--nc-mono` |
| surfaces | `--nc-bg` (warm paper), `--nc-surface` (cards), `--nc-inset` (wells) |
| ink | `--nc-ink`, `--nc-soft`, `--nc-faint` |
| lines/accent | `--nc-line`, `--nc-accent`, `--nc-accent-ink`, `--nc-accent-soft`, `--nc-ok`, `--nc-danger` |
| shape | `--nc-radius`, `--nc-radius-sm`, `--nc-shadow`, `--nc-shadow-pop` |

Plus optional page helpers: `.nc-card`, `.nc-btn`, `.nc-btn-ghost`,
`.nc-muted`, `.nc-faint`, and base styles for body/headings/code.

## License

AGPL-3.0-or-later
