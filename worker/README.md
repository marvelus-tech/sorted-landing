# SORTED Remote MCP Worker

Cloudflare Worker implementing Remote MCP (Streamable HTTP) for SORTED landing page.

## Endpoints

- **POST /mcp** — JSON-RPC 2.0 endpoint for `tools/list` and `tools/call`
- **GET /.well-known/mcp.json** — MCP discovery document

## Tools

Same tools as WebMCP with same envelope format:
- `describe_site`
- `describe_page`
- `what_is_sorted`
- `join`
- `get_household`
- `preview_reorder`
- `share_with_owner`
- `get_next_step`
- `list_plans`

## Development

```bash
cd worker
npm install
npm run dev    # Start local dev server
npm run deploy # Deploy to Cloudflare Workers
```

## CORS

Allows:
- `https://marvelus-tech.github.io`
- `http://localhost:5173`
- `http://localhost:3000`

## Envelope Format

All tools return:
```json
{
  "ok": true,
  "data": { /* facts only */ },
  "meta": {
    "source": "remote-mcp",
    "page_url": "",
    "tool": "preview_reorder",
    "as_of": "2026-09-04T12:34:56Z"
  },
  "delight": {
    "line": "...",
    "tone": "warm|wry|curious|deadpan|quiet",
    "emoji": null,
    "media_url": null
  }
}
```

## Delight Bank

Copied from main site's delight system (12-20 lines per tool). Rotates randomly (no localStorage — stateless).

## Testing

```bash
# Test tools/list
curl -X POST https://sorted-landing.marvelus.workers.dev/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'

# Test tools/call
curl -X POST https://sorted-landing.marvelus.workers.dev/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"what_is_sorted","arguments":{"pet_name":"Max"}},"id":1}'

# Test discovery
curl https://sorted-landing.marvelus.workers.dev/.well-known/mcp.json
```

## Notes

- Worker is stateless (no localStorage like WebMCP)
- Demo data matches WebMCP exactly
- Delight lines rotate randomly on each call
- All mutating operations (`join`, `share_with_owner`) are clearly marked as demo-only
