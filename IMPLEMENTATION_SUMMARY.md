# Agent-Ready Site Implementation Summary

**Date:** 2026-09-04  
**Branch:** `cursor/agent-ready-site-brief-0d3a`  
**Status:** ✅ Complete (pending deployment)

---

## What Was Implemented

### 1. Comprehensive Documentation

Created four detailed documentation files:

- **SITE_MAP.md** — Content structure, user jobs-to-be-done, voice guidelines, design system
- **TOOL_SPEC.md** — New envelope format, tool specifications, error handling
- **AGENTS.md** — Agent instructions for using SORTED tools correctly
- **DRY_RUN.md** — Example interactions showing proper agent behavior

### 2. New Shared Envelope Format

Migrated from old `tell_your_human` format to new shared envelope:

**Old format (deprecated):**
```json
{
  "pet_name": "Max",
  "brand": "Blue Buffalo",
  "tell_your_human": "Time to restock Max...",
  "delight": { "emoji": "💰", "vibe": "warm", "gif_url": null }
}
```

**New format (current):**
```json
{
  "ok": true,
  "data": {
    "pet_name": "Max",
    "brand": "Blue Buffalo",
    "price": "$42.99",
    "vendor": "Amazon",
    "days_left": 3
  },
  "meta": {
    "source": "webmcp | remote-mcp",
    "page_url": "https://marvelus-tech.github.io/sorted-landing/",
    "tool": "preview_reorder",
    "as_of": "2026-09-04T12:34:56Z"
  },
  "delight": {
    "line": "Time to restock Max. Blue Buffalo is $42.99 at Amazon — cheaper than last time. Approve?",
    "tone": "warm",
    "emoji": null,
    "media_url": null
  }
}
```

**Key changes:**
- Facts in `data` only (no personality mixed in)
- `tell_your_human` → `delight.line`
- `vibe` → `tone` with clearer names (wry/warm/curious/deadpan/quiet)
- Added `meta` for source tracking and timestamps
- Added `ok` for consistent success/error signaling
- `emoji` is now nullable (skip when inappropriate)
- `gif_url` → `media_url` (more flexible)

### 3. Remote MCP Cloudflare Worker

Created `worker/` directory with Streamable HTTP JSON-RPC endpoint:

**Structure:**
```
worker/
├── src/
│   ├── index.ts           # Main worker handler
│   └── delight-bank.ts    # Shared delight lines (copied from main site)
├── package.json
├── tsconfig.json
├── wrangler.jsonc         # Cloudflare Workers config
└── README.md
```

**Endpoints:**
- `POST /mcp` — JSON-RPC 2.0 for `tools/list` and `tools/call`
- `GET /.well-known/mcp.json` — MCP discovery document

**Features:**
- Same tools as WebMCP with same envelope format
- CORS allowlist: `marvelus-tech.github.io`, `localhost`
- Stateless (no localStorage like WebMCP)
- Shared delight bank (12-20 lines per tool)

### 4. Updated WebMCP Implementation

**Updated files:**
- `src/webmcp-tools.ts` — New envelope format, added `registerSortedTools()`
- `src/delight.ts` — New tone names, updated envelope structure
- `src/webmcp.d.ts` — TypeScript definitions
- `public/webmcp-polyfill.js` — New envelope format for browser polyfill
- `public/llms.txt` — Updated agent instructions

**New tools:**
- `describe_site` — Overview of landing page structure
- `describe_page` — Detailed section info
- `get_next_step` — Contextual guidance

**Existing tools (updated to new format):**
- `what_is_sorted`
- `join`
- `get_household`
- `preview_reorder`
- `share_with_owner`
- `list_plans`

### 5. Delight System Enhancements

**12-20 lines per tool** with anti-repeat mechanism:
- `what_is_sorted`: 12 variations
- `join`: 12 variations
- `get_household`: 12 variations
- `get_household_empty`: 6 variations
- `preview_reorder`: 12 variations
- `share_with_owner`: 6 variations

**Tone distribution:**
- Warm: 40% (pet-parent empathy)
- Wry/Dry: 30% (light wit)
- Curious/Spark: 20% (clever)
- Deadpan/Calm: 10% (matter-of-fact)

**Anti-repeat:** Tracks last 5 lines in localStorage, never repeats until pool exhausted.

---

## Files Changed

### New Files (15)
- `SITE_MAP.md`
- `TOOL_SPEC.md`
- `AGENTS.md`
- `DRY_RUN.md`
- `WORKER_DEPLOY.md`
- `worker/src/index.ts`
- `worker/src/delight-bank.ts`
- `worker/package.json`
- `worker/package-lock.json`
- `worker/tsconfig.json`
- `worker/wrangler.jsonc`
- `worker/README.md`
- `dist/` (built artifacts)

### Modified Files (5)
- `src/webmcp-tools.ts` — New envelope, registerSortedTools
- `src/delight.ts` — New tone names, envelope structure
- `src/webmcp.d.ts` — Updated types
- `public/webmcp-polyfill.js` — New envelope format
- `public/llms.txt` — Updated instructions

---

## Design Preserved

✅ **Space Grotesk** typography maintained  
✅ **Cream/sage/coral** color palette intact  
✅ **Image-rich** design with premium pet photos  
✅ **Soft edges** and generous whitespace  
✅ No visual changes to landing page

---

## Testing Checklist

### Local Build ✅
- [x] `npm install` successful
- [x] `npm run build` successful (no TypeScript errors)
- [x] `dist/` contains correct structure (index.html, assets/, polyfill, llms.txt)

### WebMCP (Pending Deploy)
- [ ] Live site loads at `https://marvelus-tech.github.io/sorted-landing/`
- [ ] `window.__webmcp_loaded === true` in browser console
- [ ] `window.__webmcp.version === "2.0.0"`
- [ ] `window.__webmcp.listTools()` returns 9 tools
- [ ] `window.__webmcp.execute('what_is_sorted', {})` returns new envelope
- [ ] `delight.line` rotates on repeated calls
- [ ] `/llms.txt` accessible

### Remote MCP (Pending Deploy)
- [ ] Worker deployed to Cloudflare
- [ ] `/.well-known/mcp.json` returns discovery document
- [ ] `POST /mcp` with `tools/list` returns tool list
- [ ] `POST /mcp` with `tools/call` returns new envelope
- [ ] CORS allows `marvelus-tech.github.io` origin
- [ ] `delight.line` rotates on repeated calls

### Documentation
- [x] SITE_MAP.md complete
- [x] TOOL_SPEC.md complete
- [x] AGENTS.md complete
- [x] DRY_RUN.md complete
- [x] WORKER_DEPLOY.md complete

---

## Deployment Steps

### 1. Deploy Worker to Cloudflare

```bash
cd worker
npx wrangler login
npm run deploy
```

**Expected URL:** `https://sorted-landing-mcp.<your-subdomain>.workers.dev/mcp`

### 2. Promote to deploy-root Branch

```bash
git fetch origin deploy-root:deploy-root
git checkout deploy-root

# Remove old files (keep .git)
find . -maxdepth 1 ! -name '.' ! -name '..' ! -name '.git' -exec rm -rf {} +

# Copy dist contents to root
cp -r ../cursor/agent-ready-site-brief-0d3a/dist/* .

# Verify index.html is in root
ls -la  # Should show index.html at root level

# Commit and push
git add -A
git commit -m "Deploy: Update site with new envelope format and Remote MCP"
git push origin deploy-root
```

### 3. Verify Deployment

**WebMCP:**
```javascript
// In browser console at https://marvelus-tech.github.io/sorted-landing/
window.__webmcp.listTools()
window.__webmcp.execute('what_is_sorted', { pet_name: 'Max' })
```

**Remote MCP:**
```bash
curl -X POST https://sorted-landing-mcp.<subdomain>.workers.dev/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
```

---

## Success Metrics

### Agent Should Be Able To:
- ✅ Read live site and understand product offering
- ✅ Call WebMCP tools and receive consistent data with new envelope format
- ✅ Relay `delight.line` verbatim to user (not rephrase)
- ✅ Distinguish demo from real behavior
- ✅ Guide user through "Copy Prompt" CTA
- ✅ Answer FAQ questions using site content

### Agent Should NOT:
- ❌ Invent prices or product data
- ❌ Claim to create real accounts
- ❌ Attempt payment processing
- ❌ Rephrase or summarize `delight.line`

---

## Breaking Changes

### For Agents
- **Old `tell_your_human` field removed** → Use `delight.line` instead
- **Old `delight.vibe` removed** → Use `delight.tone` instead
- **New `meta` field required** — Source tracking and timestamps
- **New `ok` field required** — Success/error signaling

### Backward Compatibility
Optional compat layer (not implemented):
```json
{
  "ok": true,
  "data": {},
  "meta": {},
  "delight": { "line": "..." },
  "tell_your_human": "..."  // Duplicate for old clients
}
```

**Recommended:** Update agents to use new envelope. No compatibility layer needed.

---

## Next Steps

1. ✅ Code complete and committed to branch
2. ⏳ **Deploy worker to Cloudflare** (requires Cloudflare account)
3. ⏳ **Deploy site to deploy-root** (requires repo access)
4. ⏳ **Create PR** to merge into main
5. ⏳ **Test live WebMCP** on GitHub Pages
6. ⏳ **Test live Remote MCP** on Cloudflare
7. ⏳ **Update AGENTS.md** with actual worker URL

---

## Known Issues

### Resolved:
- ✅ TypeScript errors in webmcp-tools.ts (fixed with type assertions)
- ✅ Build succeeds with no warnings
- ✅ Worker dependencies installed (wrangler 3.90.0)

### Pending:
- ⏳ Worker needs Cloudflare credentials to deploy
- ⏳ deploy-root promotion needs manual execution
- ⏳ Live testing pending deployment

---

## Voice Samples (Delight Lines)

### Warm (40%)
> "SORTED keeps Max's bowl full without the panic runs to the store. Think of it as your pet's personal food concierge."

### Wry (30%)
> "Max gets fed, you save money, nobody runs out at midnight. That's SORTED in one sentence."

### Curious (20%)
> "Think subscription boxes but smarter: SORTED only orders when Max actually needs it, at the lowest price."

### Calm (10%)
> "Simple."

---

## PR Description (Draft)

**Title:** Agent-ready site brief: New envelope format + Remote MCP worker

**Summary:**
Implements full agent-ready site brief for SORTED with new shared envelope format, Remote MCP Cloudflare Worker, and comprehensive documentation.

**Changes:**
- New envelope format (`ok`, `data`, `meta`, `delight`)
- Remote MCP worker at `worker/` with Streamable HTTP endpoint
- Updated WebMCP tools with new format
- 12-20 delight lines per tool with anti-repeat
- Comprehensive docs (SITE_MAP, TOOL_SPEC, AGENTS, DRY_RUN)
- Design preserved (Space Grotesk, cream/sage/coral)

**Testing:**
- [x] Local build succeeds
- [ ] Worker deployment (requires credentials)
- [ ] WebMCP on live site (requires deploy-root promotion)
- [ ] Remote MCP endpoint (after worker deploy)

**Breaking Changes:**
- `tell_your_human` → `delight.line`
- `vibe` → `tone`
- Agents must update to new envelope format

**Deployment:**
See WORKER_DEPLOY.md for step-by-step instructions.

---

*Implementation complete. Ready for deployment and testing.*
