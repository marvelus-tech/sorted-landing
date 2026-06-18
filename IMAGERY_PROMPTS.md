# SORTED Pet Imagery — Generation Prompts

## Hero Section Image
**Location**: Replace `src/assets/hero.png`
**Purpose**: Main visual for hero section — emotional connection, lifestyle

### Prompt 1: Happy Dog Owner with Phone (Recommended)
```
A happy woman in her 30s sitting on a modern couch, looking at her phone with a smile, golden retriever sitting next to her looking content. Bright, airy living room with natural light. Premium pet food bag visible on kitchen counter in background. Lifestyle photography, DSLR, 85mm lens, shallow depth of field, warm tones, editorial style. The phone screen shows a Telegram chat with a friendly AI assistant message about pet food delivery.
```

### Prompt 2: Premium Pet Food Aesthetic
```
A beautifully arranged flat lay of premium dog food and treats on a marble countertop. Kibble in a ceramic bowl, fresh vegetables, meat cuts, and a smartphone showing a delivery app. Soft natural lighting, food photography style, muted earth tones with sage green accents. Clean, minimalist, Instagram-worthy.
```

---

## How It Works Section (4 Images)
**Location**: Add to `src/assets/steps/`

### Step 1: Connect on Telegram
```
A smartphone showing the Telegram app with a friendly chat interface. A cute corgi avatar for the bot. Clean UI, modern design. The chat shows a welcoming message. Soft gradient background in sage green and cream. Product photography style, studio lighting.
```

### Step 2: AI Learns
```
Abstract visualization of AI learning — a dog silhouette filled with flowing data streams, charts, and gentle glowing nodes. Minimalist, tech-meets-organic style. Sage green and ink black color palette. Digital art, clean lines, editorial illustration style.
```

### Step 3: One-Tap Approval
```
Close-up of a finger tapping an "Approve" button on a phone screen. The screen shows a pet food order summary with savings highlighted. Bokeh background of a cozy living room. Macro photography, shallow depth of field, warm lighting.
```

### Step 4: Happy Pet
```
A golden retriever happily eating from a premium ceramic bowl, tail wagging. Modern kitchen background with soft natural light. The dog looks healthy and content. Lifestyle pet photography, 50mm lens, warm tones, editorial style.
```

---

## Features Section (6 Icons/Illustrations)
**Location**: Add to `src/assets/features/`

### Predictive Intelligence
```
A stylized brain icon merged with a paw print. Minimalist line art, sage green on cream background. Clean vector style, suitable for icon use. Geometric, modern, friendly.
```

### Smart Price Comparison
```
A smartphone displaying price tags with arrows pointing to the lowest price. A happy dog in the background. Flat illustration style, sage green and coral accents. Clean, modern, app-like aesthetic.
```

### Trust-First Design
```
A shield icon with a paw print in the center. Minimalist line art, sage green. Clean vector style. Represents security and trust.
```

### Intelligent Bundling
```
A box with pet food, treats, and toys being packed together with a smiley face. Flat illustration, sage green and cream. Friendly, approachable style.
```

### Flexible Scheduling
```
A calendar with paw print markers and a clock. Flat illustration style. Shows flexibility and planning. Sage green accents.
```

### Diet Health Tracking
```
A heart icon with a paw print, surrounded by healthy food icons (vegetables, meat). Flat illustration, warm colors. Health and wellness vibe.
```

---

## Pricing Section Background
**Location**: Add subtle background texture
```
Soft abstract gradient with organic shapes in sage green, cream, and coral. Very subtle, doesn't distract from pricing cards. Watercolor-like texture, minimal, calming.
```

---

## CTA Section
**Location**: Background for final call-to-action
```
A happy dog looking directly at camera with a slight head tilt, as if saying "what are you waiting for?" Soft studio lighting, clean background in sage green gradient. Professional pet photography, 85mm lens, sharp focus on eyes.
```

---

## Social Proof/Testimonials (Optional)
```
A collage of 4-5 happy pet owners with their dogs/cats, each in their own home environment. Natural lighting, candid moments. Diverse group of people. Lifestyle photography, documentary style.
```

---

## Technical Specs for All Images

| Spec | Value |
|------|-------|
| Resolution | 1920x1080 minimum (hero), 800x800 (icons) |
| Format | PNG with transparency (icons), JPG (photos) |
| Color Palette | Sage green (#7C8B6F), Cream (#F5F1E8), Ink (#1A1A1A), Coral (#E07A5F) |
| Style | DSLR photography for photos, flat illustration for icons |
| Mood | Warm, trustworthy, modern, friendly |

---

## Where to Generate

1. **Midjourney** — Best for artistic/lifestyle shots
2. **DALL-E 3** — Best for precise compositions
3. **Stable Diffusion** — Best for local generation, fine control
4. **Adobe Firefly** — Best for commercial use, safe for brands

---

## Implementation Notes

After generating images:
1. Save to `src/assets/` with descriptive names
2. Update `App.tsx` to import and use them
3. Add `alt` text for accessibility
4. Optimize with `npm run build` (Vite handles this)

---

## Quick Start

Generate these 3 first (highest impact):
1. **Hero image** — Happy dog owner with phone
2. **Step 4 image** — Happy pet eating
3. **CTA image** — Dog looking at camera

Then generate the 4 step images for "How It Works"
Finally, generate 6 feature icons
