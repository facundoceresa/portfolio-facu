# Core Composition Lovable Visual Notes

Source: https://core-composition.lovable.app/

Captured routes:

- `/contacto`
- `/privacidad`
- unmatched route for 404

## Contact

- Header uses a short operational title: `PING DIRECTO_`.
- Only one word receives strong glow; surrounding title remains mint with lower perceived opacity.
- Form is framed as a versioned technical panel with a left luminous rail, hard double shadow, no radius, and a faint grid surface.
- Text inputs are simple rectangular fields: dark navy fill, 1px mint border at low opacity, muted placeholders.
- Scope and budget are chip controls instead of native selects. Active chip flips to solid mint with navy text.
- Footer row balances response expectation on the left and submit action on the right.
- Side column uses compact contact cards with icon squares, muted labels, bright value text, and small northeast arrows.

## Privacy

- Page is a structured legal/read surface, not a generic text article.
- Hero contains direct plain-language copy and a small update chip.
- Each section has an index, a large uppercase heading, a horizontal rule, body copy, and a right-side summary module.
- Summary modules use a left mint rule, compact mono labels, and low-opacity bullet text.
- The page closes with a framed direct-contact panel.

## Not Found

- 404 view is a standalone error state.
- Large translucent `404` sits behind a resolver/trace console.
- Console includes command-like lines, direct explanation, primary home action, secondary broken-link action.
- Suggested route cards sit below the console with labels, titles, and arrows.

## Applied Locally

- Preserved local project content, email, backend field names, Turnstile behavior, and current routes.
- Rebuilt visual treatment for contact, privacy/terms, global 404, and case-not-found fallbacks.
- Added text glow utilities and stronger opacity hierarchy without changing `ScrollReveal` opacity behavior.
- Follow-up tone pass removed glow from the base display style. Default titles now sit at lower mint opacity; only selected words/spans receive strong or soft glow so emphasis is selective.
