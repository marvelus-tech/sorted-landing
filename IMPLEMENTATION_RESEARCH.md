# SORTED — Implementation Research: Affiliate Links vs Direct Payments

## Research Date: 2026-06-19
## Context: SORTED pet food management MVP

---

## OPTION 1: Affiliate Links Route (Recommended for MVP)

### How It Works
```
User Approves Order → SORTED Generates Affiliate Link → User Clicks → 
Vendor Checkout → SORTED Earns Commission → User Confirms Delivery
```

### Major Pet Food Affiliate Programs

#### Amazon Associates
- **Commission**: 1-3% for pet food (varies by category)
- **Cookie Duration**: 24 hours
- **Pros**: 
  - Massive selection, Prime shipping
  - Trusted by consumers
  - Easy API (Product Advertising API)
  - Reliable tracking
- **Cons**:
  - Low commission on pet food (~1-2%)
  - 24-hour cookie is short
  - Need to drive traffic within 24hrs of click
- **Requirements**: Website with content, approved application
- **API**: Product Advertising API 5.0 (requires AWS account)

#### Chewy Affiliate Program
- **Commission**: 4-8% (higher than Amazon)
- **Cookie Duration**: 15 days
- **Pros**:
  - Pet-specific (better conversion)
  - Higher commission rates
  - Longer cookie duration
  - Auto-ship subscriptions (recurring revenue potential)
- **Cons**:
  - Smaller selection than Amazon
  - Need to apply and get approved
  - Less brand recognition than Amazon
- **Network**: Partnerize or Impact Radius
- **Requirements**: Website, traffic minimums

#### Petco Partners
- **Commission**: 4-6%
- **Cookie Duration**: 7 days
- **Pros**:
  - Physical stores + online (BOPIS)
  - PALS rewards integration
  - Same-day delivery in some areas
- **Cons**:
  - Lower brand trust than Chewy
  - Smaller online presence
- **Network**: Commission Junction (CJ)

#### Walmart Affiliate
- **Commission**: 1-4%
- **Cookie Duration**: 3 days
- **Pros**:
  - Low prices, free pickup
  - Huge reach
- **Cons**:
  - Very low commission on grocery/pet
  - Limited tracking reliability
- **Network**: Impact Radius

#### Target Partners
- **Commission**: 1-5%
- **Cookie Duration**: 7 days
- **Pros**:
  - RedCard discounts
  - Drive Up pickup
- **Cons**:
  - Limited pet food selection
  - Lower commission
- **Network**: Impact Radius

### Implementation Workflow

```typescript
// Affiliate Link Generation
interface AffiliateLinkGenerator {
  // Amazon
  generateAmazonLink(product: Product): string {
    // Format: https://www.amazon.com/dp/{ASIN}?tag={ASSOCIATE_TAG}
    return `https://www.amazon.com/dp/${product.asin}?tag=sorted0f-20`;
  }
  
  // Chewy
  generateChewyLink(product: Product): string {
    // Format: https://www.chewy.com/...?utm_source=affiliate&utm_medium=sorted
    return `https://www.chewy.com/${product.slug}?utm_source=affiliate&utm_medium=sorted&utm_campaign=petfood`;
  }
  
  // Petco
  generatePetcoLink(product: Product): string {
    return `https://www.petco.com/...?affiliate_id=SORTED`;
  }
}

// Order Flow (Affiliate Mode)
async function handleOrderApproval(user: User, order: Order) {
  // 1. Find best price across vendors
  const bestDeal = await priceEngine.findBestDeal(order.items);
  
  // 2. Generate affiliate link for that vendor
  const affiliateLink = affiliateGenerator.generateLink(bestDeal);
  
  // 3. Send to user via Telegram
  await telegramBot.sendMessage(user.telegramId, {
    text: `Order ready! Click to complete purchase on ${bestDeal.vendor}:`,
    buttons: [[{ text: "🛒 Complete Order", url: affiliateLink }]]
  });
  
  // 4. Track click (our own analytics)
  await analytics.trackClick(user.id, order.id, bestDeal.vendor);
  
  // 5. Wait for user confirmation (manual)
  // User comes back to Telegram: "done" or "ordered"
  // We can't verify automatically with affiliate links
}
```

### Revenue Model (Affiliate)

| Scenario | Order Value | Commission Rate | Revenue |
|----------|-------------|-----------------|---------|
| Small bag (5kg) | $25 | 2% | $0.50 |
| Large bag (15kg) | $50 | 2% | $1.00 |
| Monthly auto-ship | $45 | 4% (Chewy) | $1.80 |
| Premium brand | $80 | 2% | $1.60 |

**Average per order**: ~$1.00-1.50
**Break-even**: Need ~500-1000 active users ordering monthly to cover $50-100/month costs

### Pros of Affiliate Route
✅ **Fast to implement** (days, not weeks)
✅ **No payment processing** (Stripe not needed for MVP)
✅ **No inventory risk**
✅ **No shipping/logistics**
✅ **Legal simplicity** (not a merchant of record)
✅ **Can launch immediately** after affiliate approvals

### Cons of Affiliate Route
❌ **Lower revenue per order** ($1 vs $5-10 with markup)
❌ **No control over fulfillment** (vendor handles everything)
❌ **Can't guarantee delivery** (user might not complete purchase)
❌ **Limited tracking** (can't verify if order was placed)
❌ **Cookie attribution risk** (user clicks, buys later = no commission)
❌ **Commission changes** (Amazon slashed rates in 2020)
❌ **Geographic limits** (Amazon Associates US ≠ UK ≠ AU)

---

## OPTION 2: Direct Payments / Marketplace Route

### How It Works
```
User Approves Order → SORTED Charges Card → SORTED Places Order via API → 
Vendor Ships → SORTED Tracks → User Gets Delivery
```

### Implementation Approaches

#### A) Stripe Connect (Marketplace Model)

**Architecture:**
```
User → SORTED (Platform) → Stripe Connect → Vendor
```

**How It Works:**
1. SORTED creates Stripe Connect account (platform)
2. Each vendor connects their Stripe account (or we create sub-accounts)
3. User pays SORTED
4. SORTED splits payment: Vendor gets 90%, SORTED keeps 10%
5. SORTED uses vendor API to place order

**Stripe Connect Types:**
- **Standard**: Vendor has full Stripe account, we just facilitate
- **Express**: Lightweight, vendor onboarding in minutes
- **Custom**: Full control, more compliance burden

**Code Example:**
```typescript
// Stripe Connect Setup
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a connected account for vendor
const account = await stripe.accounts.create({
  type: 'express',
  capabilities: {
    card_payments: { requested: true },
    transfers: { requested: true }
  }
});

// Create payment intent with transfer
const paymentIntent = await stripe.paymentIntents.create({
  amount: 4999, // $49.99 in cents
  currency: 'usd',
  customer: user.stripeCustomerId,
  transfer_data: {
    destination: vendor.stripeAccountId,
    amount: 4499 // 90% to vendor
  },
  application_fee_amount: 500 // 10% to SORTED
});
```

**Pros:**
✅ Full control over transaction
✅ Higher margins (10-20% vs 2-4% affiliate)
✅ Verified order completion
✅ Can offer refunds/chargebacks
✅ Unified customer experience
✅ Data ownership (order history, preferences)

**Cons:**
❌ Complex setup (Stripe Connect, vendor onboarding)
❌ Compliance burden (1099s, tax, KYC)
❌ Vendor API required (need partnerships)
❌ Chargeback liability
❌ Higher fees (Stripe 2.9% + 30¢ + Connect fees)
❌ Slower to launch (weeks/months)

---

#### B) Stripe Direct + Manual Ordering (Hybrid)

**Architecture:**
```
User → SORTED → Stripe (charge user) → SORTED manually orders → Vendor
```

**How It Works:**
1. User approves order
2. SORTED charges user's card via Stripe
3. SORTED employee or automation places order on vendor site
4. Vendor ships to user
5. SORTED tracks delivery

**Implementation:**
```typescript
// Direct Stripe Charge
const charge = await stripe.paymentIntents.create({
  amount: calculateTotal(order.items),
  currency: 'usd',
  customer: user.stripeCustomerId,
  metadata: {
    orderId: order.id,
    petId: order.petId,
    items: JSON.stringify(order.items)
  }
});

// After payment confirmed, place order via vendor API
// (or manual process in early days)
await vendorAPI.placeOrder({
  items: order.items,
  shippingAddress: user.address,
  paymentMethod: 'corporate_card' // SORTED's card
});
```

**Pros:**
✅ Fast to implement (no Connect complexity)
✅ Full control
✅ Higher margins
✅ Immediate launch possible

**Cons:**
❌ Manual ordering (not scalable)
❌ Need corporate cards for each vendor
❌ Accounting complexity
❌ Risk of order errors
❌ Not truly automated

---

#### C) Full Marketplace (Long-term Vision)

**Architecture:**
```
User → SORTED Marketplace → SORTED Inventory/3PL → Delivery
```

**How It Works:**
1. SORTED buys wholesale from brands/distributors
2. Stores inventory in 3PL warehouse (ShipBob, Deliverr)
3. User orders → SORTED ships directly
4. Full control over pricing, branding, experience

**Pros:**
✅ Highest margins (30-50%)
✅ Full brand control
✅ Custom packaging, inserts
✅ Subscription optimization
✅ Data moat

**Cons:**
❌ Capital intensive (inventory)
❌ Complex operations
❌ Risk of dead stock
❌ Need warehouse partnerships
❌ Months to launch

---

## Comparison Matrix

| Factor | Affiliate | Stripe Connect | Direct + Manual | Full Marketplace |
|--------|-----------|----------------|-----------------|------------------|
| **Time to Launch** | 1-2 weeks | 4-8 weeks | 2-3 weeks | 3-6 months |
| **Revenue/Order** | $0.50-1.50 | $5-10 | $5-10 | $15-25 |
| **Setup Complexity** | Low | High | Medium | Very High |
| **Ongoing Ops** | Low | Medium | High | Very High |
| **Control** | Low | High | Medium | Full |
| **Scalability** | Medium | High | Low | High |
| **Risk** | Low | Medium | Medium | High |
| **Capital Required** | $0 | $0 | $5K-10K | $50K+ |

---

## RECOMMENDATION: Hybrid Launch Strategy

### Phase 1: Affiliate MVP (Weeks 1-2)
- Launch with Amazon + Chewy affiliate links
- Fast to market, prove demand
- Build user base, collect data
- Revenue: ~$1/order

### Phase 2: Direct Integration (Months 2-3)
- Add Stripe for premium features (Autopilot plan)
- Partner with Chewy for API ordering (they have APIs for partners)
- Revenue: ~$5-10/order + subscription fees

### Phase 3: Marketplace (Year 2+)
- White-label fulfillment
- Bulk purchasing
- Full margin capture

---

## Smart Feeders — "Coming Soon"

### Current Status: SKIP FOR MVP

**Why Skip:**
- Hardware development is 6-12 month timeline
- Need manufacturing partnerships
- FDA/regulatory considerations
- Capital intensive ($50K+ for first run)

**"Coming Soon" Implementation:**
```typescript
// In onboarding flow
if (user.asksAboutSmartFeeder) {
  await bot.sendMessage({
    text: `🚀 Smart Feeder Integration — Coming Soon!\n\n` +
          `We're working with hardware partners to build:\n` +
          `• Automatic portion control\n` +
          `• Real-time consumption tracking\n` +
          `• Low food alerts\n` +
          `• SORTED auto-reorder integration\n\n` +
          `Want to be first to know? Tap below:`,
    buttons: [[{ text: "🔔 Notify Me When Available", callback_data: "waitlist_feeder" }]]
  });
  
  // Add to waitlist
  await waitlist.add(user.id, 'smart_feeder');
}
```

**Waitlist Tracking:**
```sql
CREATE TABLE waitlist (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  interest_type VARCHAR(50), -- 'smart_feeder', 'api_access', 'mobile_app'
  created_at TIMESTAMP DEFAULT NOW(),
  notified BOOLEAN DEFAULT FALSE
);
```

**Future Partners to Explore:**
- Sure Petcare (SureFeed) — existing API?
- PetSafe — Smart Feed Automatic Pet Feeder
- Whisker (formerly AutoPets) — Litter-Robot, Feeder-Robot
- Voltaire (smart dog collar + food)

---

## Action Items

### Immediate (This Week)
1. [ ] Apply for Amazon Associates account
2. [ ] Apply for Chewy Affiliate Program (Partnerize)
3. [ ] Research: Does Chewy have a partner/wholesale API?
4. [ ] Set up Stripe account (even if not using immediately)
5. [ ] Add "Coming Soon" section for smart feeders to bot

### Short-term (Next 2 Weeks)
1. [ ] Build affiliate link generator
2. [ ] Implement price comparison engine (Amazon PA-API)
3. [ ] Create order approval flow with affiliate links
4. [ ] Add analytics tracking for clicks/conversions
5. [ ] Build waitlist system for smart feeders

### Medium-term (Month 2-3)
1. [ ] Evaluate Stripe Connect for Autopilot plan
2. [ ] Negotiate direct vendor partnerships
3. [ ] Build order placement API integrations
4. [ ] Implement subscription billing

---

## Key Metrics to Track

| Metric | Affiliate Phase | Direct Phase |
|--------|----------------|--------------|
| Click-through rate | >30% | N/A |
| Conversion rate (click to order) | >50% | >80% |
| Revenue per user/month | $2-5 | $10-20 |
| Affiliate commission earned | $500-1000/mo | N/A |
| Gross margin | 100% (no COGS) | 15-20% |

---

*Document: IMPLEMENTATION_RESEARCH.md*
*Created: 2026-06-19*
*Next: Build affiliate link MVP*
