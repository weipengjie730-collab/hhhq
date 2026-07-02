# PanelForge MVP

This is the first tiny MVP used to practice the full launch flow.

Goal:

```text
Open website -> enter one sentence -> generate a 4-panel comic script -> preview -> export/check final state
```

This version is intentionally tiny. The front end is static, and the optional Vercel API function can call a text model when environment variables are configured.

## Files

- `index.html` - mobile-first product page
- `styles.css` - visual system and responsive layout
- `app.js` - mock generation flow
- `api/generate-comic.js` - optional Vercel API function for text Agent generation
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
- Optional text Agent API on Vercel

Not included yet:

- Login
- Real image generation
- Database
- Payment
- Character library

## Vercel Agent API

The endpoint is:

```text
POST /api/generate-comic
```

Request:

```json
{ "seed": "下雨天，她在校门口捡到一只会说话的猫" }
```

Response:

```json
{
  "story": "补齐后的短剧情",
  "panels": [
    {
      "title": "第 1 格：事件发生",
      "scene": "画面描述",
      "dialogue": "对白"
    }
  ]
}
```

Environment variables on Vercel:

```text
AI_API_KEY=your_key
AI_MODEL=gpt-4o-mini
AI_API_BASE_URL=https://api.openai.com/v1
```

`AI_API_BASE_URL` and `AI_MODEL` can be changed if you use another OpenAI-compatible provider. If `AI_API_KEY` is missing or the API fails, the endpoint returns fallback mock content so the MVP flow does not break.

## Next Steps

1. Verify the static flow on mobile and desktop.
2. Deploy as a static site.
3. Configure Vercel environment variables for the text Agent.
4. Redeploy and test `/api/generate-comic`.
5. Add visible API error states and usage logs.
