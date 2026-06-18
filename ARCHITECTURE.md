# SORTED — Technical Architecture & Workflow

## Product Overview

SORTED is an AI-powered pet food management system that operates primarily through Telegram. It predicts when pets need food, compares prices across vendors, and handles ordering — all through a simple chat interface.

---

## Core Workflow (User Journey)

```
┌─────────────────────────────────────────────────────────────────┐
│  USER WORKFLOW                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. ONBOARDING                                                  │
│     ├── User adds SORTED bot on Telegram                        │
│     ├── Bot asks: pet name, breed, age, weight, diet           │
│     ├── User sets: preferred brands, vendors, budget           │
│     └── Account linked to Telegram ID + optional email         │
│                                                                 │
│  2. DAILY OPERATION (Background)                                │
│     ├── AI calculates consumption rate based on pet profile    │
│     ├── System tracks "days remaining" for each food item      │
│     ├── Price monitoring runs across configured vendors        │
│     └── Predictive model alerts when reorder threshold hit     │
│                                                                 │
│  3. REORDER TRIGGER                                             │
│     ├── Bot: "Max's kibble ~4 days left. Reorder?"           │
│     ├── User: "Yes" or "Modify" or "Snooze 3 days"           │
│     ├── (Autopilot: Auto-approves after 20 manual approvals)   │
│     └── System: Finds best price → Places order → Confirms     │
│                                                                 │
│  4. DELIVERY & TRACKING                                         │
│     ├── Order confirmation with tracking link                  │
│     ├── Delivery notifications                                 │
│     └── "Food arrived! Update inventory?"                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  Telegram Bot (Primary Interface)                               │
│  ├── Webhook receives messages                                  │
│  ├── Bot API sends responses                                    │
│  └── Inline keyboards for approvals/modifications               │
│                                                                 │
│  Web Dashboard (Future)                                         │
│  ├── React/Vue frontend                                         │
│  ├── View order history, pet profiles, analytics                │
│  └── Manage family sharing, autopilot settings                  │
│                                                                 │
│  Landing Page (Current)                                         │
│  └── Static site → GitHub Pages (marvelus-tech.github.io)       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  Telegram   │  │   Web API   │  │   Background Jobs       │ │
│  │   Handler   │  │   Server    │  │   (Cron/Queue)          │ │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘ │
│         │                │                     │               │
│         └────────────────┼─────────────────────┘               │
│                          │                                     │
│                          ▼                                     │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Core Business Logic                         │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐   │  │
│  │  │   Pet AI    │ │  Pricing    │ │   Order Mgr     │   │  │
│  │  │   Engine    │ │  Engine     │ │   (State Mach)  │   │  │
│  │  └─────────────┘ └─────────────┘ └─────────────────┘   │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────────┐   │  │
│  │  │  Inventory  │ │  Vendor     │ │  Notification   │   │  │
│  │  │  Tracker    │ │  Adapters   │ │  Service        │   │  │
│  │  └─────────────┘ └─────────────┘ └─────────────────┘   │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  PostgreSQL │  │    Redis    │  │    External APIs        │ │
│  │  (Primary)  │  │   (Cache)   │  │                         │ │
│  │             │  │             │  │  • Amazon Product API   │ │
│  │  Users      │  │  Sessions   │  │  • Chewy API            │ │
│  │  Pets       │  │  Rate Limits│  │  • Petco API            │ │
│  │  Orders     │  │  Price Cache│  │  • Walmart API          │ │
│  │  Vendors    │  │  Job Queues │  │  • Stripe (Payments)    │ │
│  │  Inventory  │  │             │  │  • SendGrid (Email)     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack Recommendations

### Option A: Lean MVP (Recommended for YC)
**Fast to build, easy to iterate**

| Layer | Technology | Why |
|-------|-----------|-----|
| **Bot Framework** | Node.js + `node-telegram-bot-api` | Simple, fast, great ecosystem |
| **API Server** | Express.js or Fastify | Lightweight, proven |
| **Database** | PostgreSQL + Prisma ORM | Reliable, structured data, migrations |
| **Cache** | Redis (Upstash) | Sessions, price caching, job queues |
| **AI/ML** | OpenAI GPT-4o + Simple heuristics | Natural language, no training needed |
| **Hosting** | Railway or Render | Zero DevOps, auto-deploy from Git |
| **Payments** | Stripe | Industry standard |
| **Monitoring** | Sentry + Railway logs | Error tracking, observability |
| **Cron Jobs** | Railway cron or GitHub Actions | Price checking, inventory alerts |

**Estimated MVP Cost:** $50-100/month

---

### Option B: Scalable Architecture
**For post-PMF, high volume**

| Layer | Technology | Why |
|-------|-----------|-----|
| **Bot Framework** | Python + `python-telegram-bot` | Better ML ecosystem |
| **API Server** | FastAPI (Python) or Go | Performance, type safety |
| **Database** | PostgreSQL (RDS/Neon) + read replicas | Scale horizontally |
| **Cache** | Redis Cluster (ElastiCache) | High availability |
| **Queue** | BullMQ or RabbitMQ | Reliable job processing |
| **AI/ML** | Custom models (scikit-learn/xgboost) + GPT-4 | Cost reduction at scale |
| **Hosting** | AWS/GCP with Kubernetes | Full control, cost optimization |
| **CDN** | CloudFront/Cloudflare | Static assets, API caching |

**Estimated Cost:** $500-2000/month (depends on scale)

---

## Data Models (Core)

```typescript
// User (linked to Telegram)
interface User {
  id: string;
  telegramId: string;
  email?: string;
  stripeCustomerId?: string;
  plan: 'starter' | 'autopilot' | 'multi-pet';
  createdAt: Date;
}

// Pet Profile
interface Pet {
  id: string;
  userId: string;
  name: string;
  type: 'dog' | 'cat' | 'other';
  breed: string;
  age: number; // months
  weight: number; // kg
  activityLevel: 'low' | 'moderate' | 'high';
  dietaryRestrictions: string[];
  preferredBrands: string[];
  dailyCaloricNeed: number; // calculated
}

// Food Item (in inventory)
interface InventoryItem {
  id: string;
  petId: string;
  productName: string;
  brand: string;
  variant: string; // e.g., "Chicken & Rice, 15kg"
  totalWeight: number; // grams
  remainingWeight: number; // grams
  dailyConsumptionRate: number; // grams/day (AI calculated)
  daysRemaining: number; // calculated
  reorderThreshold: number; // days (default: 7)
  lastUpdated: Date;
}

// Order
interface Order {
  id: string;
  userId: string;
  petId: string;
  status: 'pending_approval' | 'approved' | 'placed' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  vendor: string;
  totalAmount: number;
  currency: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  approvedAt?: Date;
  placedAt?: Date;
  createdAt: Date;
}

interface OrderItem {
  productName: string;
  brand: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Price Tracking
interface PriceSnapshot {
  id: string;
  productName: string;
  brand: string;
  vendor: string;
  price: number;
  currency: string;
  url: string;
  inStock: boolean;
  scrapedAt: Date;
}
```

---

## Key Workflows (Detailed)

### 1. Consumption Prediction Algorithm

```
Input: Pet profile + historical data
Output: Daily consumption rate (grams/day)

Calculation:
┌────────────────────────────────────────┐
│ Base Rate (by weight)                  │
│ • Dog: 20-30g per kg body weight       │
│ • Cat: 20-25g per kg body weight       │
│                                        │
│ Adjustments:                           │
│ • Age: Puppy/Kitten ×1.5, Senior ×0.8  │
│ • Activity: Low ×0.9, High ×1.2        │
│ • Breed: Large breeds ×1.1             │
│                                        │
│ Learning:                              │
│ • Actual usage vs predicted            │
│ • User corrections (" lasted 3 weeks") │
│ • Weight trend (gaining/losing)        │
└────────────────────────────────────────┘
```

### 2. Price Comparison Engine

```
Frequency: Every 6 hours for tracked products

Vendors to Monitor:
├── Amazon (Product Advertising API)
├── Chewy (scraping or partnership)
├── Petco (scraping)
├── Walmart (Marketplace API)
├── Target (RedCircle API)
└── Local stores (manual entry or partnerships)

Logic:
1. Search each vendor for exact product match
2. Record: price, availability, shipping cost, delivery time
3. Calculate "total cost to doorstep"
4. Cache results for 6 hours
5. Alert user if price drops significantly
```

### 3. Order State Machine

```
┌─────────┐    ┌─────────────┐    ┌─────────┐    ┌─────────┐
│ TRIGGER │───→│ PENDING     │───→│ APPROVED│───→│ PLACED  │
│ (AI or  │    │ APPROVAL    │    │         │    │         │
│  manual)│    │             │    │         │    │         │
└─────────┘    └─────────────┘    └─────────┘    └────┬────┘
       │              │                    │           │
       │              │ (Autopilot skips)  │           │
       │              │                    │           ▼
       │              │              ┌─────┴────┐  ┌─────────┐
       │              │              │ AUTO-    │  │ VENDOR  │
       │              │              │ APPROVED │  │ ORDER   │
       │              │              └──────────┘  └────┬────┘
       │              │                               │
       │              ▼                               ▼
       │         ┌─────────┐                   ┌─────────┐
       │         │ SNOOZED │                   │ SHIPPED │
       │         │ (reschedule)│               │         │
       │         └─────────┘                   └────┬────┘
       │                                            │
       ▼                                            ▼
  ┌─────────┐                                 ┌─────────┐
  │ CANCELLED│                                │DELIVERED│
  └─────────┘                                 └─────────┘
```

---

## Integration Points

### Telegram Bot Commands
```
/start          → Onboarding flow
/status         → Check all pets' inventory
/order          → Manual reorder trigger
/history        → Order history
/settings       → Preferences, autopilot toggle
/help           → FAQ and support
/snooze [days]  → Delay reorder
/switch [brand] → Change preferred brand
```

### Stripe Integration
```
1. User upgrades to Autopilot
2. Create Stripe Checkout Session
3. Webhook: payment succeeded → activate plan
4. Monthly subscription billing
5. Webhook: payment failed → downgrade to Starter
```

### Vendor APIs (Future)
```
Phase 1 (MVP): Affiliate links + manual placement
  • User clicks approval → SORTED generates affiliate link
  • User completes purchase on vendor site
  • SORTED tracks via affiliate pixel (limited)

Phase 2 (Scale): Direct API ordering
  • Amazon: Product Advertising API + Amazon Pay
  • Chewy: Partnership API (need to negotiate)
  • Others: Similar partnerships

Phase 3 (Full): SORTED as marketplace
  • White-label fulfillment
  • Bulk purchasing for better margins
```

---

## Security & Compliance

```
Data Protection:
├── PCI: Stripe handles all card data (token only)
├── PII: Encrypt email, address at rest
├── Telegram: Only store chat ID, not messages
└── GDPR: Right to deletion, data export

Approval Safety:
├── Starter: Every order requires explicit approval
├── Autopilot: Requires 20 manual approvals first
├── Threshold limits: Max $/order, max $/month
└── Undo window: 15 min cancellation window

Fraud Prevention:
├── Velocity checks: Max X orders per day
├── Price anomaly: Flag if price > 150% of average
└── Address verification: Confirm shipping address
```

---

## MVP Development Roadmap

### Week 1-2: Core Bot
- [ ] Telegram bot setup with webhook
- [ ] User onboarding (pet profile collection)
- [ ] Basic conversation flow
- [ ] PostgreSQL schema + Prisma setup

### Week 3-4: AI & Prediction
- [ ] Consumption calculator (heuristics)
- [ ] Inventory tracking (manual entry)
- [ ] Reorder alerts (time-based)
- [ ] OpenAI integration for natural language

### Week 5-6: Ordering & Payments
- [ ] Price comparison (manual/scraping)
- [ ] Order approval flow (inline keyboards)
- [ ] Stripe integration
- [ ] Order confirmation & tracking

### Week 7-8: Polish & Launch
- [ ] Autopilot mode (after 20 approvals)
- [ ] Family sharing
- [ ] Analytics dashboard (basic)
- [ ] Landing page polish
- [ ] Beta launch (friends & family)

---

## Key Metrics to Track

| Metric | Target | Why |
|--------|--------|-----|
| Activation Rate | >60% | Complete onboarding + add pet |
| Weekly Engagement | >3x | Bot interactions per week |
| Approval Rate | >80% | Users approve suggested orders |
| Autopilot Adoption | >30% | Upgrade to paid plan |
| Retention (M1) | >50% | Still active after 1 month |
| NPS | >50 | Word-of-mouth growth |
| Avg Order Value | $45+ | Revenue per transaction |
| CAC | <$15 | Customer acquisition cost |

---

## Competitive Moat (Long-term)

1. **Data Network Effects**: More pets = better predictions
2. **Vendor Relationships**: Exclusive deals, early access
3. **Switching Costs**: Pet history, preferences, routines
4. **Brand Trust**: "SORTED knows my pet better than I do"
5. **Platform Play**: API for smart feeders, vet apps, insurers

---

## Questions for Cody

1. **Fulfillment**: Do you want to handle payments/ordering directly, or use affiliate links initially?
2. **Geography**: US-only launch, or Australia first?
3. **Vendors**: Which stores do you want to prioritize? (Amazon, Chewy, local?)
4. **Autopilot Risk**: What's the maximum order value you're comfortable auto-approving?
5. **Smart Feeders**: Integrate with existing devices (SureFeed, PetSafe) or build your own?

---

*Document created: 2026-06-19*
*Next: Build MVP bot + database schema*
