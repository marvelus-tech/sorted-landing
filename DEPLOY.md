# SORTED Landing Page — Deployment Ready

## Build Status
✅ **Built successfully** — `dist/` folder ready for deployment

## Deployment Options

### Option 1: GitHub Pages (Recommended)
**Requires**: Create repo `marvelus-tech/sorted-pet` on GitHub

```bash
# After creating the repo:
git remote set-url origin https://github.com/marvelus-tech/sorted-pet.git
git push -u origin main

# Then enable GitHub Pages in repo settings:
# Settings → Pages → Source: Deploy from branch → main /root
```

**Live URL will be**: `https://marvelus-tech.github.io/sorted-pet/`

### Option 2: Netlify Drop (Instant, No Repo)
1. Go to https://app.netlify.com/drop
2. Drag and drop the `dist/` folder
3. Live in 30 seconds

### Option 3: Vercel
1. Go to https://vercel.com/new
2. Import from GitHub (after creating repo)
3. Auto-deploys on every push

## Current Build
- **Base path**: `/sorted-pet/` (configured in vite.config.ts)
- **Files**: index.html, assets/, favicon.svg, icons.svg
- **Size**: ~350KB total (gzipped)

## File Locations

| File | Path |
|------|------|
| Source code | `/Users/oktos/.openclaw/workspace/sorted-landing/src/` |
| Build output | `/Users/oktos/.openclaw/workspace/sorted-landing/dist/` |
| Zip package | `/Users/oktos/.openclaw/workspace/sorted-landing/sorted-landing-deploy.zip` |
| Imagery prompts | `/Users/oktos/.openclaw/workspace/sorted-landing/IMAGERY_PROMPTS.md` |

## What Cody Needs to Do

1. Create repo `marvelus-tech/sorted-pet` on GitHub
2. Push this code:
   ```bash
   cd /Users/oktos/.openclaw/workspace/sorted-landing
   git remote set-url origin https://github.com/marvelus-tech/sorted-pet.git
   git push -u origin main
   ```
3. Enable GitHub Pages in repo settings
4. Site will be live at: `https://marvelus-tech.github.io/sorted-pet/`

## OR — Immediate Deployment

Use the zip file `sorted-landing-deploy.zip` and upload to:
- Netlify Drop: https://app.netlify.com/drop
- Cloudflare Pages
- Any static hosting

---

**Note**: The repo `sorted-pet` doesn't exist yet on GitHub. Create it first, then push.
