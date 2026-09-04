# SORTED — Agent Tool Specification

## Envelope Format (New Standard)

All WebMCP and Remote MCP tools now return a **shared envelope** with consistent structure:

```json
{
  "ok": true,
  "data": {
    // Factual information only (prices, products, household data, etc.)
  },
  "meta": {
    "source": "webmcp | remote-mcp",
    "page_url": "https://marvelus-tech.github.io/sorted-landing/",
    "tool": "preview_reorder",
    "as_of": "2026-09-04T12:34:56.789Z"
  },
  "delight": {
    "line": "Time to restock Max. Blue Buffalo is $42.99 at Amazon — cheaper than last time. Approve?",
    "tone": "warm",
    "emoji": null,
    "media_url": null
  }
}
```

### Envelope Fields

#### `ok` (boolean, required)
- `true` — Tool executed successfully
- `false` — Error occurred (see `error` field in data)

#### `data` (object, required)
**Factual information only.** No personality, no prose. Examples:
- Product names, prices, vendors
- Household members, pet profiles
- Inventory levels, days remaining
- Error details (if `ok: false`)

**Do not mix facts with personality.** Facts go in `data`, personality goes in `delight`.

#### `meta` (object, required)
**Metadata about the tool call:**
- `source` — `"webmcp"` or `"remote-mcp"`
- `page_url` — URL of the page (WebMCP) or empty (Remote MCP)
- `tool` — Tool name (e.g., `"preview_reorder"`)
- `as_of` — ISO-8601 timestamp of execution

#### `delight` (object, optional)
**Personality layer** — Optional aside for character, never mixed with facts.

- `line` (string | null) — A single sentence with SORTED's personality
- `tone` (string) — `"wry" | "warm" | "curious" | "deadpan" | "quiet"`
- `emoji` (string | null) — Single emoji (e.g., `"🐾"`) or `null`
- `media_url` (string | null) — URL to GIF/image/video (future) or `null`

**When to include `delight`:**
- ✅ Read-only queries (what_is_sorted, get_household, preview_reorder)
- ✅ Low-stakes demos (join, share_with_owner — localStorage only)
- ❌ Errors or failures (never add personality to errors)
- ❌ Consequential writes (if we ever add real account creation — skip delight)

**Rotation:** `delight.line` rotates from a bank of 12-20 lines per tool. Anti-repeat mechanism prevents same line twice in a row.

---

## Migration from Old Format

### Old Format (Deprecated)
```json
{
  "pet_name": "Max",
  "brand": "Blue Buffalo",
  "price": "$42.99",
  "tell_your_human": "Time to restock Max. Blue Buffalo is $42.99...",
  "delight": {
    "emoji": "💰",
    "vibe": "warm",
    "gif_url": null
  }
}
```

### New Format (Current)
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
    "source": "webmcp",
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

### Changes
1. **Facts moved to `data`** — Clean separation from personality
2. **`tell_your_human` → `delight.line`** — Clearer naming
3. **`vibe` → `tone`** — More descriptive
4. **Added `meta`** — Source tracking, timestamps, tool name
5. **Added `ok`** — Consistent success/error signaling
6. **`gif_url` → `media_url`** — More flexible (supports images, videos)
7. **`emoji` is now nullable** — Skip emoji when inappropriate

### Backward Compatibility (Optional)
For tools that need to support old clients:
```json
{
  "ok": true,
  "data": { /* ... */ },
  "meta": { /* ... */ },
  "delight": { "line": "...", "tone": "warm", "emoji": null, "media_url": null },
  "tell_your_human": "..."  // Duplicate of delight.line for old clients
}
```

**Preferred approach:** Drop `tell_your_human` entirely. Old clients can read `delight.line` or `data`.

---

## Tool Specifications

### 1. `describe_site`

**Description:** High-level overview of the SORTED landing page structure.

**Parameters:** None

**Returns:**
```json
{
  "ok": true,
  "data": {
    "site_name": "SORTED",
    "tagline": "Your pet's life, sorted",
    "sections": [
      "Hero",
      "The Problem",
      "The SORTED Way",
      "How It Works",
      "Features",
      "Pricing",
      "FAQ",
      "Footer"
    ],
    "primary_cta": "Copy Prompt for My Agent",
    "available_tools": [
      "describe_site",
      "describe_page",
      "what_is_sorted",
      "join",
      "get_household",
      "preview_reorder",
      "share_with_owner",
      "get_next_step",
      "list_plans"
    ]
  },
  "meta": {
    "source": "webmcp",
    "page_url": "https://marvelus-tech.github.io/sorted-landing/",
    "tool": "describe_site",
    "as_of": "2026-09-04T12:00:00Z"
  }
}
```

**Delight:** None (structural query, no personality)

**Read-only:** Yes

---

### 2. `describe_page`

**Description:** Detailed information about the current page section the user is viewing.

**Parameters:**
- `section` (string, optional) — Section name (e.g., "Features", "Pricing")

**Returns:**
```json
{
  "ok": true,
  "data": {
    "section": "Features",
    "headline": "Smarter than any subscription",
    "features": [
      {
        "name": "Predictive Intelligence",
        "description": "AI learns your pet's consumption patterns..."
      },
      {
        "name": "Smart Price Comparison",
        "description": "Check Amazon, Chewy, Petco, local retailers..."
      }
    ]
  },
  "meta": {
    "source": "webmcp",
    "page_url": "https://marvelus-tech.github.io/sorted-landing/#features",
    "tool": "describe_page",
    "as_of": "2026-09-04T12:00:00Z"
  }
}
```

**Delight:** None (structural query)

**Read-only:** Yes

---

### 3. `what_is_sorted`

**Description:** Explains SORTED's core value proposition with personality.

**Parameters:**
- `pet_name` (string, optional, default: "Max") — Pet name for personalization

**Returns:**
```json
{
  "ok": true,
  "data": {
    "brand": "SORTED",
    "tagline": "AI-powered pet food management",
    "features": [
      "Predictive reordering",
      "Price comparison across vendors",
      "One-tap approval or autopilot",
      "Never run out"
    ],
    "pet_name": "Max"
  },
  "meta": {
    "source": "webmcp",
    "page_url": "https://marvelus-tech.github.io/sorted-landing/",
    "tool": "what_is_sorted",
    "as_of": "2026-09-04T12:00:00Z"
  },
  "delight": {
    "line": "SORTED keeps Max's bowl full without the panic runs to the store. Think of it as your pet's personal food concierge.",
    "tone": "warm",
    "emoji": null,
    "media_url": null
  }
}
```

**Delight:** Rotates through 12+ warm/dry/curious variations

**Read-only:** Yes

---

### 4. `join`

**Description:** Start demo onboarding flow (writes localStorage only, not a real account).

**Parameters:**
- `pet_name` (string, optional, default: "Max") — Pet name for demo
- `email` (string, optional) — User email for demo

**Returns:**
```json
{
  "ok": true,
  "data": {
    "status": "onboarding_started",
    "demo_mode": true,
    "next_step": "Provide pet details (breed, age, weight, current food)",
    "pet_name": "Max",
    "note": "Demo only — writes to localStorage, not a real account"
  },
  "meta": {
    "source": "webmcp",
    "page_url": "https://marvelus-tech.github.io/sorted-landing/",
    "tool": "join",
    "as_of": "2026-09-04T12:00:00Z"
  },
  "delight": {
    "line": "Welcome! Tell me about Max — breed, age, favorite food — and I'll start tracking their supplies.",
    "tone": "warm",
    "emoji": null,
    "media_url": null
  }
}
```

**Delight:** Rotates through 12+ welcoming variations

**Read-only:** No (writes localStorage)

**Demo only:** Clearly marked in response

---

### 5. `get_household`

**Description:** View demo household members managing this pet's food.

**Parameters:**
- `pet_id` (string, optional, default: "1") — Pet ID (defaults to Max)

**Returns (with members):**
```json
{
  "ok": true,
  "data": {
    "pet_id": "1",
    "pet_name": "Max",
    "members": ["alice@example.com", "bob@example.com"],
    "member_count": 2
  },
  "meta": {
    "source": "webmcp",
    "page_url": "https://marvelus-tech.github.io/sorted-landing/",
    "tool": "get_household",
    "as_of": "2026-09-04T12:00:00Z"
  },
  "delight": {
    "line": "Here's Max's household: 2 members managing supplies together. Everyone stays in sync.",
    "tone": "calm",
    "emoji": null,
    "media_url": null
  }
}
```

**Returns (empty household):**
```json
{
  "ok": true,
  "data": {
    "pet_id": "1",
    "pet_name": "Max",
    "members": [],
    "member_count": 0
  },
  "meta": {
    "source": "webmcp",
    "page_url": "https://marvelus-tech.github.io/sorted-landing/",
    "tool": "get_household",
    "as_of": "2026-09-04T12:00:00Z"
  },
  "delight": {
    "line": "No household set up yet for Max. Want to invite family or roommates to help manage supplies?",
    "tone": "warm",
    "emoji": null,
    "media_url": null
  }
}
```

**Delight:** Rotates through 12+ variations (separate pools for with/without members)

**Read-only:** Yes

---

### 6. `preview_reorder`

**Description:** Preview next reorder recommendation with pricing (demo data).

**Parameters:**
- `pet_id` (string, optional, default: "1") — Pet ID (defaults to Max)

**Returns:**
```json
{
  "ok": true,
  "data": {
    "pet_id": "1",
    "pet_name": "Max",
    "brand": "Blue Buffalo Adult Chicken",
    "vendor": "Amazon",
    "price": "$42.99",
    "days_left": 3,
    "product": {
      "name": "Blue Buffalo Adult Chicken",
      "size": "15 lb bag",
      "delivery": "Arrives Thursday"
    },
    "demo_mode": true,
    "note": "Demo prices — not a real order"
  },
  "meta": {
    "source": "webmcp",
    "page_url": "https://marvelus-tech.github.io/sorted-landing/",
    "tool": "preview_reorder",
    "as_of": "2026-09-04T12:00:00Z"
  },
  "delight": {
    "line": "Max's running low: 3 days left. Found Blue Buffalo Adult Chicken at Amazon for $42.99. Best deal this week.",
    "tone": "calm",
    "emoji": null,
    "media_url": null
  }
}
```

**Delight:** Rotates through 12+ variations with urgency/savings framing

**Read-only:** Yes (demo only, no real order placed)

---

### 7. `share_with_owner`

**Description:** Share demo household access with another person (writes localStorage only).

**Parameters:**
- `pet_id` (string, optional, default: "1") — Pet ID
- `email` (string, required) — Email of person to invite

**Returns:**
```json
{
  "ok": true,
  "data": {
    "pet_id": "1",
    "pet_name": "Max",
    "email": "friend@example.com",
    "status": "shared",
    "access_level": "full",
    "demo_mode": true,
    "note": "Demo only — writes to localStorage, no real invite sent"
  },
  "meta": {
    "source": "webmcp",
    "page_url": "https://marvelus-tech.github.io/sorted-landing/",
    "tool": "share_with_owner",
    "as_of": "2026-09-04T12:00:00Z"
  },
  "delight": {
    "line": "Sent Max's details to friend@example.com. They'll get notifications and can approve orders now.",
    "tone": "warm",
    "emoji": null,
    "media_url": null
  }
}
```

**Delight:** Rotates through 6+ collaboration-focused variations

**Read-only:** No (writes localStorage)

**Demo only:** Clearly marked in response

---

### 8. `get_next_step`

**Description:** Contextual guidance for what the user should do next.

**Parameters:**
- `current_context` (string, optional) — Where user is in journey (e.g., "viewed_pricing", "previewed_reorder")

**Returns:**
```json
{
  "ok": true,
  "data": {
    "step": "copy_prompt",
    "action": "Copy the agent prompt to connect your AI agent",
    "cta_text": "Copy Prompt for My Agent",
    "next_steps": [
      "Point your AI agent at SORTED",
      "Tell it about your pet",
      "Let it track your inventory"
    ]
  },
  "meta": {
    "source": "webmcp",
    "page_url": "https://marvelus-tech.github.io/sorted-landing/",
    "tool": "get_next_step",
    "as_of": "2026-09-04T12:00:00Z"
  }
}
```

**Delight:** None (actionable guidance, no personality)

**Read-only:** Yes

---

### 9. `list_plans`

**Description:** Return pricing tiers from the page (read-only, no checkout).

**Parameters:** None

**Returns:**
```json
{
  "ok": true,
  "data": {
    "plans": [
      {
        "name": "Starter",
        "price": "Free",
        "billing": "forever",
        "features": [
          "Up to 2 pets",
          "Approval mode only",
          "Price comparison",
          "Basic scheduling"
        ]
      },
      {
        "name": "Autopilot",
        "price": "$9.99",
        "billing": "monthly",
        "badge": "Most Popular",
        "features": [
          "Unlimited pets",
          "Full autopilot mode",
          "Smart bundling",
          "Family sharing (up to 4)"
        ]
      },
      {
        "name": "Multi-Pet",
        "price": "$19.99",
        "billing": "monthly",
        "features": [
          "Everything in Autopilot",
          "Up to 10 pets",
          "Bulk ordering",
          "API access"
        ]
      }
    ]
  },
  "meta": {
    "source": "webmcp",
    "page_url": "https://marvelus-tech.github.io/sorted-landing/#pricing",
    "tool": "list_plans",
    "as_of": "2026-09-04T12:00:00Z"
  }
}
```

**Delight:** None (pricing is factual, no personality)

**Read-only:** Yes

---

## Error Handling

### Error Response Format
```json
{
  "ok": false,
  "data": {
    "error": "invalid_parameter",
    "message": "Email is required for share_with_owner",
    "field": "email"
  },
  "meta": {
    "source": "webmcp",
    "page_url": "https://marvelus-tech.github.io/sorted-landing/",
    "tool": "share_with_owner",
    "as_of": "2026-09-04T12:00:00Z"
  }
}
```

**No `delight` on errors.** Errors are factual, no personality.

### Common Error Types
- `invalid_parameter` — Missing or invalid parameter
- `tool_not_found` — Unknown tool name
- `demo_only` — Operation not available (real backend needed)
- `internal_error` — Unexpected failure

---

## Delight Bank

12-20 lines per tool, rotated to avoid repetition. **Anti-repeat mechanism:** Track last 5 lines used in localStorage, never repeat until pool is exhausted.

### Tone Distribution (Target)
- **Warm:** 40% (empathy, reassurance)
- **Wry/Dry:** 30% (wit, understatement)
- **Curious/Spark:** 20% (clever, insightful)
- **Deadpan/Calm:** 10% (matter-of-fact, zen)

### Example Lines (preview_reorder)

**Warm (40%):**
- "Time to restock Max. Blue Buffalo is $42.99 at Amazon — cheaper than last time. Approve?"
- "Max will be out in 3 days. Best option: Blue Buffalo from Amazon, $42.99. One tap to approve."
- "Heads up: Max's food hits zero in 3 days. Blue Buffalo is $42.99 at Amazon right now."

**Dry (30%):**
- "Max needs food in 3 days. Amazon has Blue Buffalo for $42.99. Solid price."
- "Max: 3 days remaining. Blue Buffalo at Amazon, $42.99. Checked everywhere; this is the best deal."
- "Max reorder: 3 days out. Amazon has Blue Buffalo for $42.99. No better option available."

**Spark (20%):**
- "Alert: Max's stash is at 3 days. I found Blue Buffalo for $42.99 at Amazon. Ready to order?"
- "Reorder window: Max needs Blue Buffalo in 3 days. Amazon is selling for $42.99 — lowest I've seen."

**Calm (10%):**
- "Max's running low: 3 days left. Found Blue Buffalo at Amazon for $42.99. Best deal this week."

### Voice Guidelines for Delight Lines
- **Use pet name** — Personalize every line ("Max's running low...")
- **Lead with context** — State the situation before the ask
- **Be specific** — Mention vendor, price, days left (facts from `data`)
- **No filler** — Cut "just wanted to let you know," "I'm here to help"
- **Natural flow** — Conversational, not corporate

---

## Tool Description Footers (Agent Instructions)

Each tool description (in WebMCP/Remote MCP discovery) should include:

> **Relay data first.** If `delight.line` is present, you may share it as a brief aside after presenting the facts. Never alter facts to match the delight line's framing.

This ensures agents:
1. Prioritize factual data in their response
2. Optionally share delight line for personality
3. Never conflate facts with personality

---

## Remote MCP Differences

### Same Tools, Same Envelope
Remote MCP (Cloudflare Worker) implements the **same tools** with the **same envelope format**.

### Differences from WebMCP:
1. **No page_url in meta** — Remote MCP is not on a page
2. **CORS allowlist** — Only `marvelus-tech.github.io` and `localhost`
3. **POST /mcp endpoint** — Streamable HTTP JSON-RPC
4. **Discovery at `/.well-known/mcp.json`**

### Shared Delight Bank
Worker copies the delight bank module from the main site to ensure consistent personality.

---

## Testing

### WebMCP Test Checklist
- [ ] All tools return new envelope format
- [ ] `data` contains only facts (no personality)
- [ ] `delight.line` rotates (no immediate repeats)
- [ ] Errors return `ok: false` with no `delight`
- [ ] Demo operations clearly marked in `data.note`
- [ ] `registerSortedTools()` exposes tools to `document.modelContext`

### Remote MCP Test Checklist
- [ ] POST /mcp responds to `tools/list` and `tools/call`
- [ ] CORS allows `marvelus-tech.github.io` and `localhost`
- [ ] `/.well-known/mcp.json` returns valid discovery document
- [ ] Delight bank matches WebMCP (same lines, same rotation)
- [ ] Worker logs tool calls (for debugging)

---

*Last updated: 2026-09-04*
*For agent instructions, see: AGENTS.md*
*For dry-run examples, see: DRY_RUN.md*
