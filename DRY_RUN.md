# SORTED — Dry Run Examples

Example agent interactions showing the new envelope format in action.

---

## Scenario 1: User Discovers SORTED

### Conversation

**User:** "What is SORTED?"

**Agent (internal):** Calls `what_is_sorted({ pet_name: "Max" })`

**Tool Result:**
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
    "as_of": "2026-09-04T14:23:11.456Z"
  },
  "delight": {
    "line": "SORTED keeps Max's bowl full without the panic runs to the store. Think of it as your pet's personal food concierge.",
    "tone": "warm",
    "emoji": null,
    "media_url": null
  }
}
```

**Agent says to user:**

> "SORTED keeps Max's bowl full without the panic runs to the store. Think of it as your pet's personal food concierge."
> 
> It works by predicting when Max needs food, comparing prices across Amazon, Chewy, Petco, and Walmart, and sending you a one-tap approval when it's time to reorder. You can also enable full autopilot mode after building trust with 20 manual approvals.

**✅ Correct:** Agent read `delight.line` verbatim, then added factual context from `data`.

---

## Scenario 2: User Requests Demo Reorder

### Conversation

**User:** "Show me what you'd recommend for my dog"

**Agent (internal):** Calls `preview_reorder({ pet_id: "1" })`

**Tool Result:**
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
    "as_of": "2026-09-04T14:25:33.789Z"
  },
  "delight": {
    "line": "Max's running low: 3 days left. Found Blue Buffalo Adult Chicken at Amazon for $42.99. Best deal this week.",
    "tone": "calm",
    "emoji": null,
    "media_url": null
  }
}
```

**Agent says to user:**

> "Max's running low: 3 days left. Found Blue Buffalo Adult Chicken at Amazon for $42.99. Best deal this week."
> 
> This is a demo preview using fixed data. In the real product, SORTED would track your actual pet's inventory and compare live prices across 6 vendors to find the best deal at the right time.

**✅ Correct:** Agent read `delight.line` verbatim, then clarified it's a demo.

---

## Scenario 3: User Wants to Join (Demo)

### Conversation

**User:** "I want to try this"

**Agent (internal):** Calls `join({ pet_name: "Bella", email: "user@example.com" })`

**Tool Result:**
```json
{
  "ok": true,
  "data": {
    "status": "onboarding_started",
    "demo_mode": true,
    "next_step": "Provide pet details (breed, age, weight, current food)",
    "pet_name": "Bella",
    "note": "Demo only — writes to localStorage, not a real account"
  },
  "meta": {
    "source": "webmcp",
    "page_url": "https://marvelus-tech.github.io/sorted-landing/",
    "tool": "join",
    "as_of": "2026-09-04T14:27:05.123Z"
  },
  "delight": {
    "line": "Welcome! Tell me about Bella — breed, age, favorite food — and I'll start tracking their supplies.",
    "tone": "warm",
    "emoji": null,
    "media_url": null
  }
}
```

**Agent says to user:**

> "Welcome! Tell me about Bella — breed, age, favorite food — and I'll start tracking their supplies."
> 
> Just to clarify: This is a demo that writes to your browser's localStorage — not a real account. The real SORTED product works through Telegram, where you can set up actual inventory tracking and auto-ordering.
> 
> To connect to the real product, click "Copy Prompt for My Agent" on the site and paste it into your AI agent.

**✅ Correct:** Agent read `delight.line` verbatim, then clarified demo limitations and guided to CTA.

---

## Scenario 4: User Checks Household (Empty)

### Conversation

**User:** "Who else can manage my pet's food?"

**Agent (internal):** Calls `get_household({ pet_id: "2" })` (Luna has 1 member)

**Tool Result:**
```json
{
  "ok": true,
  "data": {
    "pet_id": "2",
    "pet_name": "Luna",
    "members": ["carol@example.com"],
    "member_count": 1
  },
  "meta": {
    "source": "webmcp",
    "page_url": "https://marvelus-tech.github.io/sorted-landing/",
    "tool": "get_household",
    "as_of": "2026-09-04T14:29:42.567Z"
  },
  "delight": {
    "line": "Luna's household: just you right now. Add household members if you'd like backup on Luna's food orders.",
    "tone": "calm",
    "emoji": null,
    "media_url": null
  }
}
```

**Agent says to user:**

> "Luna's household: just you right now. Add household members if you'd like backup on Luna's food orders."
> 
> In the real product, you can invite family members, roommates, or pet sitters. Everyone gets notifications when food is low and can approve orders. It's perfect for busy households where multiple people might need to handle the reorder.

**✅ Correct:** Agent read `delight.line` verbatim, then explained the feature.

---

## Scenario 5: User Shares Household (Demo)

### Conversation

**User:** "Add my partner to help manage Max's food. Their email is partner@example.com"

**Agent (internal):** Calls `share_with_owner({ pet_id: "1", email: "partner@example.com" })`

**Tool Result:**
```json
{
  "ok": true,
  "data": {
    "pet_id": "1",
    "pet_name": "Max",
    "email": "partner@example.com",
    "status": "shared",
    "access_level": "full",
    "demo_mode": true,
    "note": "Demo only — writes to localStorage, no real invite sent"
  },
  "meta": {
    "source": "webmcp",
    "page_url": "https://marvelus-tech.github.io/sorted-landing/",
    "tool": "share_with_owner",
    "as_of": "2026-09-04T14:31:18.890Z"
  },
  "delight": {
    "line": "Sent Max's details to partner@example.com. They'll get notifications and can approve orders now.",
    "tone": "warm",
    "emoji": null,
    "media_url": null
  }
}
```

**Agent says to user:**

> "Sent Max's details to partner@example.com. They'll get notifications and can approve orders now."
> 
> This is a demo (localStorage only) — no real invite was sent. In the real SORTED product, partner@example.com would receive a Telegram invite to join Max's household, giving them full access to approve orders, view inventory, and get notifications.

**✅ Correct:** Agent read `delight.line` verbatim, then clarified demo behavior.

---

## Scenario 6: User Checks Pricing

### Conversation

**User:** "How much does SORTED cost?"

**Agent (internal):** Calls `list_plans()`

**Tool Result:**
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
    "as_of": "2026-09-04T14:33:55.234Z"
  }
}
```

**Agent says to user:**

> SORTED has three pricing tiers:
> 
> **Starter (Free)** — Perfect for trying it out
> - Up to 2 pets
> - Approval mode only (you approve every order)
> - Price comparison across vendors
> - Basic scheduling
> 
> **Autopilot ($9.99/month) — Most Popular**
> - Unlimited pets
> - Full autopilot mode (auto-approves after 20 manual approvals)
> - Smart bundling (combines orders for free shipping)
> - Family sharing (up to 4 members)
> 
> **Multi-Pet ($19.99/month)** — For households with 3+ pets or breeders
> - Everything in Autopilot
> - Up to 10 pets
> - Bulk ordering
> - API access
> 
> There's no checkout on this landing page — it's a demo. To sign up for real, you'll connect through Telegram.

**✅ Correct:** Agent presented pricing clearly, no `delight` (pricing is factual), clarified no checkout.

---

## Scenario 7: Error Handling (Missing Parameter)

### Conversation

**User:** "Share Max's household"

**Agent (internal):** Calls `share_with_owner({ pet_id: "1" })` (missing email)

**Tool Result:**
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
    "as_of": "2026-09-04T14:35:27.678Z"
  }
}
```

**Agent says to user:**

> To share Max's household, I'll need the email address of the person you want to invite. Who should I add?

**✅ Correct:** Agent handled error gracefully, asked for missing parameter.

---

## Scenario 8: Agent Reads Delight Verbatim (Rotation Test)

### First Call

**User:** "What is SORTED?"

**Agent calls:** `what_is_sorted({ pet_name: "Max" })`

**Delight line (random pick #1):**
> "SORTED keeps Max's bowl full without the panic runs to the store. Think of it as your pet's personal food concierge."

**Agent says:** [reads verbatim]

---

### Second Call (Same Tool, Different Result)

**User:** "Tell my friend what SORTED is"

**Agent calls:** `what_is_sorted({ pet_name: "Buddy" })`

**Delight line (random pick #2, different from #1):**
> "Buddy gets fed, you save money, nobody runs out at midnight. That's SORTED in one sentence."

**Agent says:** [reads verbatim]

---

**✅ Correct:** Agent read different `delight.line` each time (rotation working). Facts stayed consistent (brand, features), personality varied (warm vs. dry tone).

---

## Scenario 9: Remote MCP Call (Same Envelope)

### User connects via Remote MCP (not on page)

**User:** "Check Max's food status"

**Agent calls Remote MCP:** `POST https://sorted-landing.marvelus.workers.dev/mcp`
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "preview_reorder",
    "arguments": { "pet_id": "1" }
  },
  "id": 1
}
```

**Worker responds:**
```json
{
  "jsonrpc": "2.0",
  "result": {
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
      "source": "remote-mcp",
      "page_url": "",
      "tool": "preview_reorder",
      "as_of": "2026-09-04T14:40:12.345Z"
    },
    "delight": {
      "line": "Time to restock Max. Blue Buffalo is $42.99 at Amazon — cheaper than last time. Approve?",
      "tone": "warm",
      "emoji": null,
      "media_url": null
    }
  },
  "id": 1
}
```

**Agent says to user:**

> "Time to restock Max. Blue Buffalo is $42.99 at Amazon — cheaper than last time. Approve?"
> 
> Based on Max's consumption rate, you have about 3 days left. SORTED found the best deal at Amazon for a 15 lb bag, arriving Thursday.

**✅ Correct:** Remote MCP returned same envelope format. Agent read `delight.line` verbatim.

---

## Anti-Patterns (What NOT to Do)

### ❌ Wrong: Agent Rephrases Delight Line

**User:** "What is SORTED?"

**Tool returns delight.line:** "SORTED keeps Max's bowl full without the panic runs to the store. Think of it as your pet's personal food concierge."

**Agent says:** "So basically, SORTED is an AI service that helps you manage your pet's food by predicting when you need to reorder..."

**Why wrong:** Agent ignored `delight.line` and wrote boring prose. Lost SORTED's personality.

---

### ❌ Wrong: Agent Invents Data

**User:** "Show me a reorder for my beagle Buddy"

**Agent says:** "Buddy needs Purina Pro Plan in 4 days. I found it at Target for $38.99."

**Why wrong:**
1. Buddy is not in demo data (only Max, Luna, Bella)
2. Target is not in demo vendors
3. $38.99 is not a demo price
4. Agent made up facts instead of calling tool

**✅ Correct response:** Call `preview_reorder()`, use demo data, clarify it's a fixed demo.

---

### ❌ Wrong: Agent Claims Real Account Created

**User:** "Sign me up"

**Agent calls:** `join()`

**Agent says:** "Done! I've created your SORTED account and you're all set to start ordering."

**Why wrong:** 
1. `join` is demo only (localStorage)
2. No real account was created
3. No backend exists

**✅ Correct response:** Read `delight.line`, clarify demo, guide to "Copy Prompt" CTA.

---

### ❌ Wrong: Agent Adds Delight to Error

**Tool returns error:** `{ ok: false, data: { error: "invalid_parameter", message: "Email required" } }`

**Agent says:** "Oops! 🐾 Looks like I need an email to share Max's household. Who should I invite?"

**Why wrong:** Agent added emoji/personality to error. Errors should be factual, no delight.

**✅ Correct response:** "To share Max's household, I'll need the email address of the person you want to invite. Who should I add?"

---

## Key Takeaways

### For Agents

1. **Read `delight.line` verbatim** — It's the whole point
2. **Use demo data only** — Never invent pets, prices, vendors
3. **Clarify demo vs. real** — localStorage only, no backend
4. **Handle errors gracefully** — Ask for missing parameters, don't blame the tool
5. **Guide to CTA** — "Copy Prompt for My Agent" is the real onboarding path

### For Tool Developers

1. **Facts in `data`** — No personality mixed with facts
2. **Personality in `delight`** — Rotate lines, skip on errors
3. **Metadata in `meta`** — Source, timestamp, tool name
4. **Consistent envelope** — WebMCP and Remote MCP use same format
5. **Demo warnings** — Always mark localStorage demos in `data.note`

---

*Last updated: 2026-09-04*  
*For tool specs, see: TOOL_SPEC.md*  
*For agent instructions, see: AGENTS.md*
