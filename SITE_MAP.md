# SORTED — Agent-Ready Site Map

## Product Overview

**SORTED** is an AI-powered pet food management system that predicts when pets need food, compares prices across vendors, and handles ordering. The landing page demonstrates this through WebMCP tools that agents can call directly from the browser.

### Core Value Proposition

"Your pet's life, sorted" — SORTED removes the mental load of pet food management entirely. No more 9pm realizations that you're out of kibble. No more emergency pet store runs. No more overpaying under pressure.

---

## Content Structure

### 1. Hero Section
**Headline:** "Your pet's life. Sorted."  
**Subhead:** "Never run out of kibble again. SORTED predicts what your pet needs, finds the best price, and reports back — your AI agent handles it through WebMCP tools."  
**CTAs:**
- Primary: "Copy Prompt for My Agent"
- Secondary: "See How It Works"
**Trust badges:** "No credit card • Cancel anytime • Free forever plan"

### 2. The Problem
**Headline:** "The 9pm realization."  
**Pain points:**
- ✕ Emergency pet store runs (The worst timing, every time)
- ✕ Overpaying under pressure (No time to compare prices)
- ✕ Constant mental overhead ('Do we have enough?' — every week)

### 3. The SORTED Way
**Headline:** "Calm. Automated. Cheap."  
**Benefits:**
- ✓ Predictive alerts (Know before you run out)
- ✓ Automatic price comparison (Best deal, every single order)
- ✓ One-tap or autopilot (You're always in control)

### 4. How It Works
**Headline:** "From chaos to calm in 4 steps"  
**Steps:**
1. **Connect your agent** — Point your AI agent at SORTED with pet info
2. **AI Learns Your Routine** — Track consumption, predict depletion, monitor prices
3. **One-Tap Approval** — Get message when it's time to reorder
4. **Never Worry Again** — Food arrives before you run out

### 5. Features
**Headline:** "Smarter than any subscription"  
**Core features:**
- **Predictive Intelligence** — AI learns consumption patterns, no emergency runs
- **Smart Price Comparison** — Check Amazon, Chewy, Petco, local retailers
- **Trust-First Design** — Approval mode first, autopilot after 20 orders
- **Intelligent Bundling** — Combine orders for free shipping
- **Flexible Scheduling** — Pause, switch brands, adapt to your life
- **Diet Health Tracking** — Log allergies, weight, vet recommendations

### 6. Pricing
**Plans:**
- **Starter** (Free) — Up to 2 pets, approval mode only, price comparison, basic scheduling
- **Autopilot** ($9.99/month, Most Popular) — Unlimited pets, full autopilot, smart bundling, family sharing (up to 4)
- **Multi-Pet** ($19.99/month) — Everything in Autopilot + up to 10 pets, bulk ordering, API access

### 7. FAQ
**Common questions:**
- How does SORTED know when my pet needs food?
- Can I choose which stores SORTED buys from?
- What if I want to change brands or try something new?
- Is my payment information safe?
- What happens if there's a problem with an order?
- Can multiple people manage the same pet?

### 8. Footer
**Product:** Features, Pricing, llms.txt, API  
**Company:** About, Blog, Careers, Press  
**Support:** Help Center, Contact, Privacy, Terms

---

## User Jobs-to-be-Done

### Primary Jobs
1. **Learn about the product** — "What is SORTED?" → Use `what_is_sorted` tool
2. **Copy agent prompt** — Get prompt to connect AI agent → CTA button copies prompt
3. **Join household (demo)** — Set up pet for tracking → Use `join` tool (localStorage demo)
4. **View household members** — See who manages pet's food → Use `get_household` tool
5. **Preview next reorder** — See upcoming order with pricing → Use `preview_reorder` tool
6. **Share with owner (demo)** — Invite household member → Use `share_with_owner` tool

### Secondary Jobs
1. **Compare plans** — Understand pricing tiers → Read pricing section
2. **Understand how it works** — Learn the 4-step process → Read "How It Works" section
3. **Check FAQ** — Get answers to common questions → Read FAQ section
4. **Get next step guidance** — "What should I do next?" → Use `get_next_step` tool (if implemented)

### Non-Jobs (Out of Scope)
- **Real account creation** — Demo only, no backend (yet)
- **Real payment processing** — No Stripe checkout on landing page
- **Silent purchase/charge** — NEVER expose this; demo previews only
- **Smart feeder integration** — "Coming soon" placeholder only

---

## Agent Tool Surface

### Available WebMCP Tools

1. **describe_site** — Overview of entire landing page structure
2. **describe_page** — Detailed info about current page section
3. **what_is_sorted** (or `get_offering`) — Product explanation with personality
4. **join** — Start demo onboarding (writes localStorage only)
5. **get_household** — View demo household members
6. **preview_reorder** — Show demo reorder recommendation with pricing
7. **share_with_owner** — Share demo household access (writes localStorage)
8. **get_next_step** — Contextual guidance for what to do next
9. **list_plans** — Read pricing tiers from page (if on pricing section)

### Mutating Operations (Demo Only)
- `join` — Writes pet profile to localStorage (clearly marked as demo)
- `share_with_owner` — Writes household member to localStorage (clearly marked as demo)

**All mutations are localStorage demos only.** No real account creation, no payments, no API calls.

### Sensitive Operations (Prohibited)
- ❌ NO `run_javascript` or `click_selector` tools
- ❌ NO `silent_purchase` or `charge_card` tools
- ❌ NO real payment processing
- ❌ NO backend writes (no database, no API)

Only demo operations that read or write localStorage for demonstration purposes.

---

## Voice & Personality

### Brand Voice Characteristics

**SORTED speaks with warm, witty empathy for pet parents:**

#### Tone Dimensions
1. **Warm** (40%) — Pet-parent empathy without being saccharine
   - "Your pet's food arrives before you realize it's low"
   - "Keep Max's bowl full without the panic runs"
   
2. **Wry/Dry** (30%) — Light wit, never cutesy or alarmist
   - "The 9pm realization"
   - "Think subscription boxes but smarter"
   
3. **Curious/Spark** (20%) — Clever without showing off
   - "Your pet's personal food concierge"
   - "Like having a very attentive grocery assistant"
   
4. **Deadpan/Calm** (10%) — Reassuring, matter-of-fact
   - "Simple."
   - "That's SORTED in one sentence."

#### Voice Guidelines

**Do:**
- Use second person ("your pet," "you stay sane")
- Lead with benefits over features
- Acknowledge the mental load ("constant mental overhead")
- Show personality through word choice, not forced humor
- Vary tone across different tools/contexts

**Don't:**
- Use baby talk or overly cutesy language ("puppers," "floofs")
- Create artificial urgency or fear ("Don't let your dog starve!")
- Over-explain or use corporate jargon
- Force emojis into every sentence
- Make the same joke twice

#### Sample Phrases from Live Site

- "Never run out of kibble again"
- "The 9pm realization" (problem framing)
- "Calm. Automated. Cheap." (benefit triple)
- "From chaos to calm in 4 steps"
- "Smarter than any subscription"
- "Your pet's life, sorted" (tagline)
- "Think of it as your pet's personal food concierge"
- "The calm parent who actually remembers to buy groceries. For pets."

#### Delight Line Examples

When tools return `delight.line`, they should sound like:
- "SORTED keeps Max's bowl full without the panic runs to the store. Think of it as your pet's personal food concierge." (warm)
- "Max gets fed, you save money, nobody runs out at midnight. That's SORTED in one sentence." (dry)
- "Welcome! Tell me about Max — breed, age, favorite food — and I'll start tracking their supplies." (warm)
- "Time to restock Max. Blue Buffalo is $42.99 at Amazon — cheaper than last time. Approve?" (warm)

---

## Design System

### Typography
- **Headings:** Space Grotesk (current font, keep it)
- **Body:** Inter or similar clean sans-serif
- **Monospace:** JetBrains Mono for code/data

### Color Palette
**Primary colors:**
- **Cream:** #FFFEF2 (backgrounds)
- **Sage:** #8B9D83, #6B7D63 (accents, CTAs)
- **Coral:** #E07A5F (highlights, pricing badges)

**Supporting colors:**
- **Charcoal:** #2D3142 (text, headings)
- **Soft White:** #F9F9F9 (cards, sections)
- **Muted Green:** #B8C5B0 (hover states)

### Visual Style
- **Image-rich:** Photos of pets, premium pet food, happy pet parents
- **Whitespace:** Generous padding, uncluttered layouts
- **Soft edges:** Rounded corners (8-12px), subtle shadows
- **Icons:** Lucide React icons (consistent with current implementation)

### Content Images
Current imagery shows:
- Premium pet food ingredients (fresh meat, vegetables, kibble)
- Happy pets (Max the Golden Retriever, Luna the Tabby Cat)
- Clean, modern UI mockups (Telegram bot conversations)
- Calm, organized home environments

**Keep this aesthetic.** Avoid stock photo clichés or overly clinical product shots.

---

## Navigation & Metadata

### Site Navigation
- How it works
- Features
- Pricing
- FAQ
- Sign in (placeholder)
- Get Started (primary CTA)

### SEO Metadata
**Title:** "SORTED — Your Pet's Life, Sorted"  
**Meta Description:** "AI-powered pet food management through WebMCP. Your agent tracks inventory, finds the best prices, and reports when food is low."  
**Keywords:** AI pet care, pet food subscription, predictive ordering, price comparison, WebMCP

**Open Graph:**
- og:title — "SORTED — Your Pet's Life, Sorted"
- og:description — "Never run out of pet food. AI-powered inventory tracking and price comparison."
- og:image — Social share image (hero pet photo)

### llms.txt
Public file at `/llms.txt` with:
- Product overview
- Available tools
- Voice guidelines
- Demo vs. real behavior (clearly marked)

---

## Demo Data

### Fixed Demo Pets
1. **Max** — Golden Retriever, Blue Buffalo Adult Chicken, $42.99 at Amazon
2. **Luna** — Tabby Cat, Royal Canin Indoor, $36.49 at Chewy
3. **Bella** — Labrador, Purina Pro Plan, $48.99 at Petco

### Demo Households
- Household 1 (Max): alice@example.com, bob@example.com (2 members)
- Household 2 (Luna): carol@example.com (1 member)
- Household 3 (Bella): dave@example.com, eve@example.com, frank@example.com (3 members)

### Demo Vendors
- Amazon
- Chewy
- Petco
- Walmart

**All data is consistent across tool calls.** Only the `delight.line` rotates to show personality variety.

---

## Success Metrics (for agents)

### Agent Should Be Able To:
1. ✅ Read live site and understand product offering
2. ✅ Call WebMCP tools and receive consistent data
3. ✅ Relay `delight.line` verbatim to user (not rephrase)
4. ✅ Distinguish demo from real behavior (never claim real accounts exist)
5. ✅ Guide user through "Copy Prompt" CTA
6. ✅ Answer FAQ questions using site content

### Agent Should NOT:
1. ❌ Invent prices or product data
2. ❌ Claim to create real accounts
3. ❌ Attempt payment processing
4. ❌ Rephrase or summarize `delight.line` (always read verbatim)
5. ❌ Offer features not mentioned on site (e.g., smart feeder integration)

---

## Technical Implementation Notes

### WebMCP Integration
- Polyfill: `public/webmcp-polyfill.js` (loaded in `index.html`)
- TypeScript tools: `src/webmcp-tools.ts` (registers via `registerSortedTools()`)
- Delight system: `src/delight.ts` (randomized personality)

### Remote MCP Worker
- Worker location: `worker/` directory (new)
- Endpoint: `https://sorted-landing.marvelus.workers.dev/mcp` (or `sorted.marvelus.workers.dev`)
- Protocol: Streamable HTTP JSON-RPC (POST /mcp)
- Discovery: `/.well-known/mcp.json` on worker

### Deploy Process
1. Build: `npm run build` (Vite outputs to `dist/` with base `/sorted-landing/`)
2. Promote: Copy `dist/*` to `deploy-root` branch ROOT (never leave Vite source files)
3. Worker: `wrangler deploy` from `worker/` directory
4. Test: Verify WebMCP tools work on live GitHub Pages site

---

*Last updated: 2026-09-04*
*For implementation details, see: TOOL_SPEC.md, AGENTS.md, DRY_RUN.md*
