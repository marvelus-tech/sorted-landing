# SORTED Landing Page — Handoff to Cody

## Context
User wants Cody to deploy the SORTED landing page to GitHub Pages under the **MarvelUs** account (not ok3to). Looking at our codebase, we already push projects to GitHub Pages — see the workspace `.git` remote: `https://github.com/marvelus-tech/rank-rent-ideas.git`

## What's Built

**Location**: `/Users/oktos/.openclaw/workspace/sorted-landing/`

**Tech Stack**:
- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Framer Motion animations
- Space Grotesk font (matches reference images)

**Features**:
- Wieden+Kennedy inspired editorial design
- Telegram chat mockup in hero
- 3-tier pricing (Free, Autopilot $9.99, Multi-Pet $19.99)
- SEO copy with pet food keywords
- Fully responsive

**Build Status**: ✅ Ready in `sorted-landing/dist/`

## What Cody Needs to Do

1. **Create GitHub repo** under MarvelUs account:
   - Name: `sorted-landing` (or `sorted`)
   - Make it public
   
2. **Push the code**:
   ```bash
   cd /Users/oktos/.openclaw/workspace/sorted-landing
   git remote set-url origin https://github.com/marvelus-tech/sorted-landing.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Repo Settings → Pages → Source: Deploy from branch → main /root
   - Or use GitHub Actions workflow (see below)

4. **Vite base path** is already set in `vite.config.ts`:
   ```ts
   base: '/sorted-landing/',
   ```

## GitHub Actions Workflow (if needed)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Next Task: Pet Imagery

After deployment, Cody should generate pet imagery for the landing page:
- Highly realistic DSLR style
- Pet owner lifestyle shots
- Scenes: happy dog owner with Telegram notification, premium pet food aesthetic, person relaxing while SORTED handles ordering, excited pet with delivery

## Zillow Skill

Already built at `/Users/oktos/.openclaw/workspace/skills/zillow-builder-leads/` — separate task, not Cody's responsibility unless instructed.
