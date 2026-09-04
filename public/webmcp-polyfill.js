// WebMCP polyfill for SORTED landing page (NEW envelope format)
// Exposes demo tools to AI agents browsing the site

(function() {
  'use strict';

  // Check if already loaded
  if (window.__webmcp_loaded) {
    console.log('[WebMCP] Already loaded, skipping');
    return;
  }

  console.log('[WebMCP] Initializing SORTED tools...');

  // Demo data (matches webmcp-tools.ts)
  const DEMO_DATA = {
    pets: [
      { id: '1', name: 'Max', breed: 'Golden Retriever', food: 'Blue Buffalo Adult Chicken' },
      { id: '2', name: 'Luna', breed: 'Tabby Cat', food: 'Royal Canin Indoor' },
      { id: '3', name: 'Bella', breed: 'Labrador', food: 'Purina Pro Plan' },
    ],
    households: {
      '1': { members: ['alice@example.com', 'bob@example.com'], count: 2 },
      '2': { members: ['carol@example.com'], count: 1 },
      '3': { members: ['dave@example.com', 'eve@example.com', 'frank@example.com'], count: 3 },
    },
    prices: {
      'Blue Buffalo Adult Chicken': { price: '$42.99', vendor: 'Amazon' },
      'Royal Canin Indoor': { price: '$36.49', vendor: 'Chewy' },
      'Purina Pro Plan': { price: '$48.99', vendor: 'Petco' },
    },
  };

  // Delight templates (subset for polyfill)
  const TEMPLATES = {
    what_is_sorted: [
      { text: "SORTED keeps {{pet_name}}'s bowl full without the panic runs to the store. Think of it as your pet's personal food concierge.", tone: 'warm' },
      { text: "We're an AI that remembers when {{pet_name}} needs food, finds the best price, and orders before you even notice it's low.", tone: 'quiet' },
      { text: "{{pet_name}} gets fed, you save money, nobody runs out at midnight. That's SORTED in one sentence.", tone: 'wry' },
    ],
    join: [
      { text: "Welcome! Tell me about {{pet_name}} — breed, age, favorite food — and I'll start tracking their supplies.", tone: 'warm' },
      { text: "Let's get {{pet_name}} sorted. I'll need to know their basics: what they eat, how much, and any brand preferences.", tone: 'quiet' },
    ],
    get_household: [
      { text: "Here's {{pet_name}}'s household: {{member_count}} members managing supplies together. Everyone stays in sync.", tone: 'quiet' },
      { text: "Your household has {{member_count}} people keeping {{pet_name}} fed. Shared notifications, shared peace of mind.", tone: 'warm' },
    ],
    get_household_empty: [
      { text: "No household set up yet for {{pet_name}}. Want to invite family or roommates to help manage supplies?", tone: 'warm' },
      { text: "You're flying solo right now. Add household members if you'd like backup on {{pet_name}}'s food orders.", tone: 'quiet' },
    ],
    preview_reorder: [
      { text: "{{pet_name}}'s running low: {{days_left}} days left. Found {{brand}} at {{vendor}} for {{price}}. Best deal this week.", tone: 'quiet' },
      { text: "Time to restock {{pet_name}}. {{brand}} is {{price}} at {{vendor}} — cheaper than last time. Approve?", tone: 'warm' },
    ],
    share_with_owner: [
      { text: "Sent {{pet_name}}'s details to {{email}}. They'll get notifications and can approve orders now.", tone: 'warm' },
      { text: "{{email}} is now part of {{pet_name}}'s household. Full access granted.", tone: 'quiet' },
    ],
  };

  // Pick random template
  function pickTemplate(pool) {
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // Interpolate facts
  function interpolate(text, facts) {
    let result = text;
    for (const [key, value] of Object.entries(facts)) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
    }
    return result;
  }

  // Pick delight
  function pickDelight(tool, facts) {
    const pool = TEMPLATES[tool];
    if (!pool || pool.length === 0) return null;
    
    const template = pickTemplate(pool);
    return {
      line: interpolate(template.text, facts),
      tone: template.tone,
      emoji: null,
      media_url: null,
    };
  }

  // Build envelope (NEW format)
  function buildEnvelope(ok, data, tool, delight) {
    const envelope = {
      ok: ok,
      data: data,
      meta: {
        source: 'webmcp',
        page_url: window.location.href,
        tool: tool,
        as_of: new Date().toISOString(),
      },
    };
    
    if (delight) {
      envelope.delight = delight;
    }
    
    return envelope;
  }

  // Tool handlers
  const handlers = {
    describe_site() {
      return buildEnvelope(
        true,
        {
          site_name: 'SORTED',
          tagline: 'Your pet\'s life, sorted',
          sections: [
            'Hero',
            'The Problem',
            'The SORTED Way',
            'How It Works',
            'Features',
            'Pricing',
            'FAQ',
            'Footer',
          ],
          primary_cta: 'Copy Prompt for My Agent',
          available_tools: [
            'describe_site',
            'describe_page',
            'what_is_sorted',
            'join',
            'get_household',
            'preview_reorder',
            'share_with_owner',
            'get_next_step',
            'list_plans',
          ],
        },
        'describe_site'
      );
    },

    describe_page(args) {
      const section = args.section || 'Hero';
      
      if (section === 'Features') {
        return buildEnvelope(
          true,
          {
            section: 'Features',
            headline: 'Smarter than any subscription',
            features: [
              {
                name: 'Predictive Intelligence',
                description: 'AI learns your pet\'s consumption patterns and predicts depletion before it happens.',
              },
              {
                name: 'Smart Price Comparison',
                description: 'Check Amazon, Chewy, Petco, local retailers to find the best price.',
              },
            ],
          },
          'describe_page'
        );
      }

      return buildEnvelope(
        true,
        { section: section, note: 'Section details available for: Hero, Features, Pricing, FAQ' },
        'describe_page'
      );
    },

    what_is_sorted(args) {
      const pet_name = args.pet_name || DEMO_DATA.pets[0].name;
      const facts = {
        brand: 'SORTED',
        tagline: 'AI-powered pet food management',
        features: [
          'Predictive reordering',
          'Price comparison across vendors',
          'One-tap approval or autopilot',
          'Never run out',
        ],
        pet_name: pet_name,
      };
      return buildEnvelope(true, facts, 'what_is_sorted', pickDelight('what_is_sorted', facts));
    },

    join(args) {
      const pet_name = args.pet_name || DEMO_DATA.pets[0].name;
      const facts = {
        status: 'onboarding_started',
        demo_mode: true,
        next_step: 'Provide pet details (breed, age, weight, current food)',
        pet_name: pet_name,
        note: 'Demo only — writes to localStorage, not a real account',
      };
      return buildEnvelope(true, facts, 'join', pickDelight('join', facts));
    },

    get_household(args) {
      const pet_id = args.pet_id || '1';
      const pet = DEMO_DATA.pets.find(p => p.id === pet_id) || DEMO_DATA.pets[0];
      const household = DEMO_DATA.households[pet_id];

      if (!household || household.count === 0) {
        const facts = { pet_id: pet_id, pet_name: pet.name, members: [], member_count: 0 };
        return buildEnvelope(true, facts, 'get_household', pickDelight('get_household_empty', facts));
      }

      const facts = {
        pet_id: pet_id,
        pet_name: pet.name,
        members: household.members,
        member_count: household.count,
      };
      return buildEnvelope(true, facts, 'get_household', pickDelight('get_household', facts));
    },

    preview_reorder(args) {
      const pet_id = args.pet_id || '1';
      const pet = DEMO_DATA.pets.find(p => p.id === pet_id) || DEMO_DATA.pets[0];
      const pricing = DEMO_DATA.prices[pet.food];

      const facts = {
        pet_id: pet_id,
        pet_name: pet.name,
        brand: pet.food,
        vendor: pricing.vendor,
        price: pricing.price,
        days_left: Math.floor(Math.random() * 5) + 2,
        product: {
          name: pet.food,
          size: '15 lb bag',
          delivery: 'Arrives Thursday',
        },
        demo_mode: true,
        note: 'Demo prices — not a real order',
      };
      return buildEnvelope(true, facts, 'preview_reorder', pickDelight('preview_reorder', facts));
    },

    share_with_owner(args) {
      const pet_id = args.pet_id || '1';
      const pet = DEMO_DATA.pets.find(p => p.id === pet_id) || DEMO_DATA.pets[0];
      const email = args.email;

      if (!email) {
        return buildEnvelope(
          false,
          {
            error: 'invalid_parameter',
            message: 'Email is required for share_with_owner',
            field: 'email',
          },
          'share_with_owner'
        );
      }

      const facts = {
        pet_id: pet_id,
        pet_name: pet.name,
        email: email,
        status: 'shared',
        access_level: 'full',
        demo_mode: true,
        note: 'Demo only — writes to localStorage, no real invite sent',
      };
      return buildEnvelope(true, facts, 'share_with_owner', pickDelight('share_with_owner', facts));
    },

    get_next_step(args) {
      return buildEnvelope(
        true,
        {
          step: 'copy_prompt',
          action: 'Copy the agent prompt to connect your AI agent',
          cta_text: 'Copy Prompt for My Agent',
          next_steps: [
            'Point your AI agent at SORTED',
            'Tell it about your pet',
            'Let it track your inventory',
          ],
        },
        'get_next_step'
      );
    },

    list_plans() {
      return buildEnvelope(
        true,
        {
          plans: [
            {
              name: 'Starter',
              price: 'Free',
              billing: 'forever',
              features: [
                'Up to 2 pets',
                'Approval mode only',
                'Price comparison',
                'Basic scheduling',
              ],
            },
            {
              name: 'Autopilot',
              price: '$9.99',
              billing: 'monthly',
              badge: 'Most Popular',
              features: [
                'Unlimited pets',
                'Full autopilot mode',
                'Smart bundling',
                'Family sharing (up to 4)',
              ],
            },
            {
              name: 'Multi-Pet',
              price: '$19.99',
              billing: 'monthly',
              features: [
                'Everything in Autopilot',
                'Up to 10 pets',
                'Bulk ordering',
                'API access',
              ],
            },
          ],
        },
        'list_plans'
      );
    },
  };

  // Execute tool
  function executeTool(toolName, args) {
    const handler = handlers[toolName];
    if (!handler) {
      return buildEnvelope(
        false,
        {
          error: 'tool_not_found',
          message: `Unknown tool: ${toolName}`,
        },
        toolName
      );
    }
    return handler(args || {});
  }

  // Expose WebMCP API
  window.__webmcp = {
    version: '2.0.0', // Updated for new envelope format
    brand: 'sorted',
    tools: handlers,
    execute: executeTool,
    listTools() {
      return Object.keys(handlers);
    },
    getTool(name) {
      return handlers[name];
    },
  };

  window.__webmcp_loaded = true;
  console.log('[WebMCP] SORTED tools loaded:', Object.keys(handlers));
})();
