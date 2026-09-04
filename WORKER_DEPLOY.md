# Worker Deployment Guide

## Prerequisites

1. **Cloudflare account** with Workers enabled
2. **Wrangler CLI** authenticated (see below)

## Deploy Remote MCP Worker

### 1. Authenticate Wrangler

```bash
cd worker
npx wrangler login
```

This opens a browser to authenticate with your Cloudflare account.

### 2. Update Worker Name (Optional)

Edit `worker/wrangler.jsonc` to set your preferred worker name:

```jsonc
{
  "name": "sorted-landing-mcp",  // Change this if desired
  "main": "src/index.ts",
  "compatibility_date": "2026-09-04",
  "node_compat": true,
  "observability": {
    "enabled": true
  }
}
```

### 3. Deploy Worker

```bash
cd worker
npm run deploy
```

This compiles TypeScript and deploys to Cloudflare Workers.

**Expected output:**
```
✨  Built successfully, built project size is 45 KiB.
✨  Successfully published your script to
    https://sorted-landing-mcp.<your-subdomain>.workers.dev
```

### 4. Verify Deployment

**Test discovery endpoint:**
```bash
curl https://sorted-landing-mcp.<your-subdomain>.workers.dev/.well-known/mcp.json
```

**Test tools/list:**
```bash
curl -X POST https://sorted-landing-mcp.<your-subdomain>.workers.dev/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
```

**Test a tool:**
```bash
curl -X POST https://sorted-landing-mcp.<your-subdomain>.workers.dev/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "what_is_sorted",
      "arguments": {"pet_name": "Max"}
    },
    "id": 1
  }'
```

### 5. Update AGENTS.md

Add your worker URL to `AGENTS.md`:

```markdown
**Remote MCP endpoint:** `https://sorted-landing-mcp.<your-subdomain>.workers.dev/mcp`
```

---

## Deploy GitHub Pages (deploy-root branch)

### 1. Build Site

```bash
npm run build
```

This creates `dist/` with base path `/sorted-landing/`.

### 2. Promote to deploy-root Branch

**Switch to deploy-root:**
```bash
git fetch origin deploy-root:deploy-root
git checkout deploy-root
```

**Copy dist contents to ROOT (not in a subfolder):**
```bash
# Remove old files (keep .git)
find . -maxdepth 1 ! -name '.' ! -name '..' ! -name '.git' -exec rm -rf {} +

# Copy dist contents to root
cp -r ../cursor/agent-ready-site-brief-0d3a/dist/* .
```

**Verify index.html is in root:**
```bash
ls -la
# Should show: index.html, assets/, favicon.svg, icons.svg, etc.
```

**Commit and push:**
```bash
git add -A
git commit -m "Deploy: Update site with new envelope format and Remote MCP"
git push origin deploy-root
```

### 3. Verify GitHub Pages

Visit: `https://marvelus-tech.github.io/sorted-landing/`

**Check WebMCP tools:**
Open browser console and run:
```javascript
window.__webmcp.listTools()
// Should return: ['describe_site', 'describe_page', 'what_is_sorted', ...]

window.__webmcp.execute('what_is_sorted', { pet_name: 'Max' })
// Should return new envelope format with ok, data, meta, delight
```

---

## Troubleshooting

### Worker Deploy Fails

**Error:** "No such package"
- Check `worker/package.json` — ensure wrangler version is valid (3.90.0 works)
- Run `npm install` in worker/ first

**Error:** "Not authenticated"
- Run `npx wrangler login` in worker/
- Verify authentication: `npx wrangler whoami`

### GitHub Pages Not Updating

**Check deploy-root branch:**
```bash
git log deploy-root --oneline -5
```

**Ensure GitHub Pages settings:**
- Go to repo Settings → Pages
- Source: Deploy from branch
- Branch: `deploy-root` / (root)

**Force refresh browser:**
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Clear cache and reload

### WebMCP Tools Not Loading

**Check browser console for errors:**
```javascript
console.log(window.__webmcp_loaded)  // Should be true
console.log(window.__webmcp.version) // Should be "2.0.0"
```

**Verify polyfill is loaded:**
- View page source, ensure `<script src="/webmcp-polyfill.js"></script>` is present
- Check network tab — polyfill.js should return 200

---

## Environment-Specific URLs

Update these in your documentation after deployment:

- **Worker URL:** `https://sorted-landing-mcp.<your-subdomain>.workers.dev/mcp`
- **GitHub Pages:** `https://marvelus-tech.github.io/sorted-landing/`
- **llms.txt:** `https://marvelus-tech.github.io/sorted-landing/llms.txt`

---

## Next Steps

1. ✅ Deploy worker to Cloudflare
2. ✅ Update AGENTS.md with worker URL
3. ✅ Deploy site to deploy-root
4. ✅ Test WebMCP tools on live site
5. ✅ Test Remote MCP endpoint with curl
6. 📝 Create PR from `cursor/agent-ready-site-brief-0d3a` to `main`
7. 🎉 Merge and celebrate

---

*Last updated: 2026-09-04*
