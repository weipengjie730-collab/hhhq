# PanelForge MVP

This is the first tiny MVP used to practice the full launch flow.

Goal:

```text
Open website -> enter one sentence -> generate a 4-panel comic script -> preview -> export/check final state
```

This version is intentionally static. It does not require Node.js, npm, a database, login, or real AI API keys.

## Files

- `index.html` - mobile-first product page
- `styles.css` - visual system and responsive layout
- `app.js` - mock generation flow
- `DESIGN.md` - design and scope rules

## Local Preview

Open this file in a browser:

```text
/Users/Apple/项目空间夹/panelforge-mvp/index.html
```

## MVP Scope

Included:

- Mobile-first single-page flow
- One-sentence input
- Mock story expansion
- Mock 4-panel storyboard
- Comic preview
- Real PNG export from browser canvas

Not included yet:

- Login
- Real AI API
- Real image generation
- Database
- Payment
- Character library

## Next Steps

1. Verify the static flow on mobile and desktop.
2. Deploy as a static site.
3. Replace mock generation with a real text API.
4. Add API error states and loading logs.
5. Then migrate to Next.js only when API routes and deployment workflow are needed.
