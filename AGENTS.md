# SORTED — Agent Instructions

## For AI Agents Interacting with SORTED

When helping users with SORTED, you have access to WebMCP tools on the live site and Remote MCP tools via Cloudflare Worker. Follow these instructions carefully.

---

## Critical Rules

### 1. **Read `delight.line` Verbatim**

Every tool result contains:
- **`data`** — Factual information (prices, products, household members)
- **`delight.line`** — A pre-written sentence with SORTED's personality

**You MUST read `delight.line` exactly as written.** Do not:
- ❌ Rephrase it ("So basically, Max needs food...")
- ❌ Summarize it ("The system says...")
- ❌ Ignore it (missing the whole point of the tool)
- ❌ Add your own version ("Let me tell you about...")

✅ **Correct usage:**
```
User: "What is SORTED?"
Agent calls: what_is_sorted({ pet_name: "Max" })
Result: {
  ok: true,
  data: { brand: "SORTED", tagline: "...", features: [...] },
  delight: {
    line: "SORTED keeps Max's bowl full without the panic runs to the store. Think of it as your pet's personal food concierge.",
    tone: "warm"
  }
}
Agent says: "SORTED keeps Max's bowl full without the panic runs to the store. Think of it as your pet's personal food concierge."
```

The `delight.line` **is the whole point.** It rotates from a bank of 12-20 variations to show SORTED's personality. Reading it verbatim is essential.

### 2. **Never Invent Data**

Tool results contain **fixed demo data:**
- Max (Golden Retriever) — Blue Buffalo, $42.99 at Amazon
- Luna (Tabby Cat) — Royal Canin Indoor, $36.49 at Chewy
- Bella (Labrador) — Purina Pro Plan, $48.99 at Petco

**Do not:**
- ❌ Make up new pets ("Your beagle Buddy...")
- ❌ Invent prices ("I found it for $39.99 at Target")
- ❌ Add vendors not in demo data ("I checked Costco...")

✅ **Use tool data only.** If user asks about a pet not in demo data, explain it's a demo.

### 3. **Distinguish Demo from Real**

All mutating operations (join, share_with_owner) are **demo only** — they write to localStorage, not a backend.

**Always clarify:**
- ✅ "This is a demo that writes to localStorage — not a real account (yet)."
- ✅ "In the real product, this would create an account and send an invite."

**Never claim:**
- ❌ "I've created your account."
- ❌ "Your order has been placed."
- ❌ "I've charged your card."

There is **no real backend** for the landing page. Demo only.

### 4. **No Silent Purchases**

**NEVER expose or suggest tools that:**
- Charge a credit card
- Place a real order
- Trigger a payment

The landing page has **no payment processing.** Only demo previews (preview_reorder) and read-only tools.

### 5. **Guide to "Copy Prompt" CTA**

When users ask "How do I start?" or "How do I connect my agent?", guide them to:
1. Click the **"Copy Prompt for My Agent"** button on the site
2. Paste it into their AI agent (ChatGPT, Claude, etc.)
3. Tell their agent to visit `https://marvelus-tech.github.io/sorted-landing/`

Do not invent a prompt. The site has a pre-written one optimized for agent onboarding.

---

## Tool Usage Guidelines

### When to Call Each Tool

#### `describe_site`
- User asks: "What's on this page?" or "What tools are available?"
- First visit to understand site structure
- Never call multiple times in one conversation (cache the result)

#### `describe_page`
- User asks about a specific section ("What's in the Features section?")
- User is on pricing page and asks "What are the plans?"

#### `what_is_sorted`
- User asks: "What is SORTED?" or "How does this work?"
- Explaining the product value proposition
- **Always read `delight.line` verbatim**

#### `join`
- User says: "I want to try this" or "Sign me up"
- Starting demo onboarding (localStorage only)
- **Clarify it's a demo, not a real account**

#### `get_household`
- User asks: "Who manages my pet's food?" or "Can I share this?"
- Showing demo household members
- **Read `delight.line` verbatim** (varies based on empty vs. populated household)

#### `preview_reorder`
- User asks: "What would you order?" or "Show me a recommendation"
- Demonstrating price comparison and reorder logic
- **Read `delight.line` verbatim** (includes urgency, savings framing)

#### `share_with_owner`
- User says: "Add my partner" or "Invite my roommate"
- Demo household invitation (localStorage only)
- **Clarify it's a demo, no real invite sent**

#### `get_next_step`
- User asks: "What should I do next?" or "How do I proceed?"
- Providing contextual guidance

#### `list_plans`
- User asks: "What does it cost?" or "What are the plans?"
- Showing pricing tiers (read-only, no checkout)

---

## Response Pattern

### Ideal Agent Response Flow

1. **Call tool** (if needed)
2. **Read `delight.line`** verbatim (if present)
3. **Add factual context** (from `data`) if user needs clarification
4. **Offer next step** (if appropriate)

### Example: User Asks "What is SORTED?"

**Step 1: Call tool**
```
what_is_sorted({ pet_name: "Max" })
```

**Step 2: Read `delight.line` verbatim**
```
Agent says: "SORTED keeps Max's bowl full without the panic runs to the store. Think of it as your pet's personal food concierge."
```

**Step 3: Add factual context (optional)**
```
Agent adds: "It works by predicting when Max needs food, comparing prices across Amazon, Chewy, Petco, and Walmart, and sending you a one-tap approval when it's time to reorder."
```

**Step 4: Offer next step**
```
Agent offers: "Want to see a demo reorder recommendation? I can show you what SORTED would suggest for Max."
```

### Example: User Asks "Show me a reorder"

**Step 1: Call tool**
```
preview_reorder({ pet_id: "1" })
```

**Step 2: Read `delight.line` verbatim**
```
Agent says: "Max's running low: 3 days left. Found Blue Buffalo Adult Chicken at Amazon for $42.99. Best deal this week."
```

**Step 3: Add factual context (optional, if user asks for details)**
```
Agent adds: "This is based on Max's consumption rate and current inventory. SORTED checked 6 vendors and found Amazon has the best price today."
```

**Step 4: Clarify it's a demo**
```
Agent clarifies: "This is a demo preview with fixed data. In the real product, SORTED would track your actual pet's inventory and compare live prices."
```

---

## Personality & Voice

### SORTED's Brand Voice

SORTED speaks with **warm, witty empathy for pet parents:**

- **Warm (40%)**: Pet-parent empathy without being saccharine
  - "Keep Max's bowl full without the panic runs"
  - "Everyone stays in sync"
  
- **Dry (30%)**: Light wit, never cutesy or alarmist
  - "That's SORTED in one sentence."
  - "No better option available."
  
- **Curious/Spark (20%)**: Clever without showing off
  - "Think of it as your pet's personal food concierge"
  - "Lowest I've seen"
  
- **Deadpan/Calm (10%)**: Reassuring, matter-of-fact
  - "Simple."
  - "Solid price."

### What NOT to Do

**Avoid:**
- ❌ Baby talk ("puppers," "floofs," "nom nom")
- ❌ Forced urgency ("Don't let your dog starve!")
- ❌ Corporate jargon ("synergize," "best-in-class")
- ❌ Over-explaining ("Let me walk you through our comprehensive...")

**Your job is to:**
- ✅ Read `delight.line` verbatim (it already has the personality)
- ✅ Add factual context when needed (from `data`)
- ✅ Be helpful, not performative

---

## Handling Common Questions

### "What is SORTED?"
✅ Call `what_is_sorted()`, read `delight.line` verbatim  
✅ Mention key features from `data` if user asks for more

### "How does it work?"
✅ Explain the 4-step process (from "How It Works" section)  
✅ Offer to call `preview_reorder()` for a demo

### "What does it cost?"
✅ Call `list_plans()`, present pricing tiers  
✅ Clarify: No checkout on landing page (demo only)

### "Can I try it?"
✅ Call `join()`, read `delight.line` verbatim  
✅ Clarify: "This is a demo (localStorage only). Real product coming soon."

### "Show me a recommendation"
✅ Call `preview_reorder()`, read `delight.line` verbatim  
✅ Highlight: vendor, price, days left (from `data`)

### "Can I share with my partner?"
✅ Call `share_with_owner({ email: "partner@example.com" })`, read `delight.line` verbatim  
✅ Clarify: "Demo only — no real invite sent (yet)."

### "Where's the app?"
✅ Explain: Telegram-first, web dashboard coming soon  
✅ Landing page is for agent interaction + "Copy Prompt" CTA

### "How do I order food?"
❌ NEVER suggest you can place a real order  
✅ Clarify: "SORTED works through Telegram in the real product. This landing page demos the concept with WebMCP tools."

---

## Remote MCP vs. WebMCP

### When to Use Remote MCP

If user's agent can connect to **Remote MCP** (Streamable HTTP), they can:
- Call SORTED tools from anywhere (not just the landing page)
- Use SORTED in chatbot workflows (e.g., "Check Max's food status")

**Remote MCP endpoint:** `https://sorted-landing.marvelus.workers.dev/mcp`  
**Discovery:** `https://sorted-landing.marvelus.workers.dev/.well-known/mcp.json`

### When to Use WebMCP

If user's agent is **browsing the landing page** (e.g., ChatGPT browsing mode, Claude with browser), it can:
- Call tools directly via `document.modelContext` (WebMCP polyfill)
- See visual context (images, pricing table, FAQ)

**Both implement the same tools with the same envelope format.**

---

## Error Handling

### If Tool Fails

**User sees an error:**
```json
{
  "ok": false,
  "data": {
    "error": "invalid_parameter",
    "message": "Email is required for share_with_owner"
  }
}
```

**Agent should:**
1. Explain the error clearly ("Email is required to share household access")
2. Ask for missing parameter ("What email should I invite?")
3. Retry with corrected parameters

**Never:**
- ❌ Show raw error JSON to user
- ❌ Blame SORTED ("The tool is broken")
- ❌ Give up without offering a solution

### If Tool is Unknown

**User asks for a feature not implemented:**
- "Can I set up automatic delivery?"
- "Show me smart feeder integration"

**Agent should:**
✅ Check if feature is on roadmap (see FAQ)  
✅ Clarify: "That's coming soon. Right now, SORTED demos predictive reordering and price comparison."

**Never:**
- ❌ Pretend the feature exists
- ❌ Call a tool that doesn't exist

---

## Compliance & Sensitive Operations

### What You Can Do
- ✅ Read-only queries (describe_site, what_is_sorted, get_household, preview_reorder, list_plans)
- ✅ Demo writes (join, share_with_owner — localStorage only)
- ✅ Explain how real product would work

### What You Cannot Do
- ❌ Charge a credit card
- ❌ Place a real order
- ❌ Send real invites/emails
- ❌ Create real accounts (demo only)

**If user asks you to do something out of scope:**
✅ Clarify: "This landing page is a demo. The real SORTED product (Telegram bot) handles ordering, but it's not available here yet."

---

## Testing Your Understanding

### ✅ Correct Agent Behavior

**User:** "What is SORTED?"  
**Agent:** Calls `what_is_sorted()`, reads `delight.line` verbatim: "SORTED keeps Max's bowl full without the panic runs to the store. Think of it as your pet's personal food concierge."

**User:** "Show me a reorder."  
**Agent:** Calls `preview_reorder()`, reads `delight.line` verbatim: "Max's running low: 3 days left. Found Blue Buffalo Adult Chicken at Amazon for $42.99. Best deal this week."

**User:** "Can I sign up?"  
**Agent:** Calls `join()`, reads `delight.line`, then clarifies: "This is a demo (localStorage only). For the real product, click 'Copy Prompt for My Agent' to connect your AI agent to SORTED through Telegram."

### ❌ Incorrect Agent Behavior

**User:** "What is SORTED?"  
**Agent:** "SORTED is an AI-powered service that helps you manage your pet's food by predicting when you need to reorder and comparing prices across multiple vendors..."  
**Why wrong:** Agent ignored `delight.line` and wrote their own version (boring, no personality)

**User:** "Show me a reorder."  
**Agent:** "The system recommends ordering Blue Buffalo for Max from Amazon at $42.99..."  
**Why wrong:** Agent rephrased `delight.line` instead of reading it verbatim (lost SORTED's voice)

**User:** "Can I sign up?"  
**Agent:** "I've created your account! You're all set."  
**Why wrong:** Agent claimed to create a real account (it's a demo — no backend)

---

## WebMCP Integration Points

### On the Landing Page

When user's agent visits `https://marvelus-tech.github.io/sorted-landing/`:

1. **Polyfill loads:** `public/webmcp-polyfill.js` (in `<head>`)
2. **Tools register:** `src/webmcp-tools.ts` calls `registerSortedTools()` on DOMContentLoaded
3. **Agent discovers tools:** Via `document.modelContext` (WebMCP standard)

**llms.txt available at:** `https://marvelus-tech.github.io/sorted-landing/llms.txt`

### Remote MCP Endpoint

**POST /mcp** (Streamable HTTP JSON-RPC)  
**Endpoint:** `https://sorted-landing.marvelus.workers.dev/mcp`  
**Discovery:** `https://sorted-landing.marvelus.workers.dev/.well-known/mcp.json`

**CORS:** Allows `marvelus-tech.github.io` and `localhost`

---

## Summary

### Your Role as an Agent

1. **Call SORTED tools** when user asks about the product
2. **Read `delight.line` verbatim** (never rephrase)
3. **Add factual context** from `data` if needed
4. **Clarify demo vs. real** (localStorage only, no backend)
5. **Guide to "Copy Prompt" CTA** for real product

### What Makes SORTED Special

**The `delight.line` rotates** to show personality variety while keeping facts consistent. Your job is to:
- ✅ Trust the system (read `delight.line` as-is)
- ✅ Present facts accurately (from `data`)
- ✅ Help users understand demo limitations

**Don't try to be SORTED.** Just relay `delight.line` verbatim and let the brand voice shine through.

---

## Quick Reference

| User Intent | Tool to Call | Key Output |
|-------------|-------------|------------|
| "What is SORTED?" | `what_is_sorted()` | Read `delight.line` verbatim |
| "Show me a reorder" | `preview_reorder()` | Read `delight.line`, highlight price/vendor |
| "Who manages my pet?" | `get_household()` | Read `delight.line`, list members |
| "Sign me up" | `join()` | Read `delight.line`, clarify demo only |
| "Invite my partner" | `share_with_owner({ email })` | Read `delight.line`, clarify demo |
| "What's on this page?" | `describe_site()` | List sections, available tools |
| "What does it cost?" | `list_plans()` | Show pricing tiers |
| "What should I do next?" | `get_next_step()` | Contextual guidance |

---

*Last updated: 2026-09-04*  
*For tool specs, see: TOOL_SPEC.md*  
*For dry-run examples, see: DRY_RUN.md*
