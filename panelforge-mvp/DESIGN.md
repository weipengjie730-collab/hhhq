# PanelForge MVP Design

## 1. Visual Theme & Atmosphere

PanelForge MVP is a mobile-first comic creation flow. The first version should feel light, quick, and creator-friendly, not like a professional desktop editor. The page should make the user feel: "I can type one sentence and get a usable 4-panel comic draft."

Keywords: mobile-first, warm creative tool, simple workflow, comic preview, publish-ready.

Interaction level: L1 polished static with clear loading and state changes. No heavy animation is needed for this MVP.

## 2. Color Palette & Roles

```css
:root {
  --color-bg: #f7f3ee;
  --color-surface: #fffaf4;
  --color-surface-strong: #ffffff;
  --color-text: #211f1b;
  --color-muted: #736b61;
  --color-line: #e3d8ca;
  --color-primary: #e8563f;
  --color-primary-dark: #c73b2a;
  --color-accent: #2f7f77;
  --color-accent-soft: #dff0ea;
  --color-warn: #b77816;
  --rgb-primary: 232, 86, 63;
  --rgb-accent: 47, 127, 119;
}
```

Roles:
- Background: warm paper tone.
- Primary CTA: coral red for the main creation action.
- Accent: teal for generated/ready states.
- Surface: paper cards and comic panels.

## 3. Typography Rules

Use system fonts for speed and deployment simplicity.

```css
font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Scale:
- App title: 30-36px, 800 weight.
- Section title: 20-24px, 750 weight.
- Body: 15-16px, 450 weight.
- Caption: 12-13px, 500 weight.

Do not use narrow fonts, decorative fonts, or tiny dense text in the first MVP.

## 4. Component Stylings

Buttons:
- Height at least 48px on mobile.
- Primary button uses coral background, white text, 14px radius.
- Secondary button uses white surface, 1px line border.
- Disabled state uses muted text and low contrast background.

Cards:
- Radius 16px for tool panels.
- Comic panels use 14px radius and a 2px ink-like border.
- Avoid nested card stacks except for repeated comic panels.

Inputs:
- Textarea should be large enough for one sentence plus edit room.
- Focus state uses primary outline.

## 5. Layout Principles

The MVP is a single mobile-first flow:
1. Hero and project input.
2. Generated story and storyboard.
3. Four-panel preview.
4. Export checklist.

Desktop should center a phone-width app shell inside a quiet background.

Mobile width target: 390px.
Max app width: 460px.
Spacing: 12px, 16px, 24px, 32px.

## 6. Depth & Elevation

Use soft shadows only:

```css
--shadow-soft: 0 18px 50px rgba(33, 31, 27, 0.12);
--shadow-card: 0 10px 26px rgba(33, 31, 27, 0.08);
```

No glassmorphism, no large blur effects, no decorative orb backgrounds.

## 7. Animation & Interaction

L1 only:
- Button hover/active translate by 1px.
- Generated result fades in through CSS class.
- Loading uses text state and progress chips, not complex skeletons.

## 8. Do's and Don'ts

Do:
- Keep the flow obvious from input to export.
- Make the first CTA visible without scrolling.
- Keep mobile tap targets large.
- Show generated output as structured comic panels.
- Keep export as a real end state, even if it is a placeholder.

Don't:
- Do not build a marketing landing page instead of the usable tool.
- Do not add login, pricing, dashboard, or role library in the first step.
- Do not use PC canvas editing as the MVP center.
- Do not make the first version depend on installing packages.
- Do not bury the core input below decorative content.
- Do not use one-color-only palettes.

## 9. Responsive Behavior

Mobile:
- Full width app, fixed bottom safe spacing for CTA.
- Comic panels in one column.

Desktop:
- Center app shell at max 460px.
- Use background only as quiet framing.

Touch:
- All buttons at least 44px high.
- Text must wrap naturally inside cards and buttons.
