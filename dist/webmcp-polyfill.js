// WebMCP polyfill for SORTED landing page
// Exposes demo tools to AI agents browsing the site

(function() {
  'use strict';

  // Check if already loaded
  if (window.__webmcp_loaded) {
    console.log('[WebMCP] Already loaded, skipping');
    return;
  }

  console.log('[WebMCP] Initializing SORTED tools...');

  // Tool definitions (matches webmcp-tools.ts)
  const TOOLS = {
    what_is_sorted: {
      description: 'Learn what SORTED does and how it helps pet parents',
      parameters: {
        pet_name: { type: 'string', optional: true, description: 'Pet name for personalization' },
      },
    },
    join: {
      description: 'Start onboarding to set up SORTED for your pet',
      parameters: {
        pet_name: { type: 'string', optional: true, description: 'Pet name for personalization' },
      },
    },
    get_household: {
      description: 'View household members managing this pet\'s food',
      parameters: {
        pet_id: { type: 'string', optional: true, description: 'Pet ID (defaults to demo pet)' },
      },
    },
    preview_reorder: {
      description: 'See next reorder recommendation with pricing',
      parameters: {
        pet_id: { type: 'string', optional: true, description: 'Pet ID (defaults to demo pet)' },
      },
    },
    share_with_owner: {
      description: 'Share pet food management with another household member',
      parameters: {
        pet_id: { type: 'string', optional: true, description: 'Pet ID (defaults to demo pet)' },
        email: { type: 'string', required: true, description: 'Email of person to invite' },
      },
    },
  };

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
      { text: "SORTED keeps {{pet_name}}'s bowl full without the panic runs to the store. Think of it as your pet's personal food concierge.", vibe: 'warm', emoji: '🐾' },
      { text: "We're an AI that remembers when {{pet_name}} needs food, finds the best price, and orders before you even notice it's low.", vibe: 'calm', emoji: '✨' },
      { text: "{{pet_name}} gets fed, you save money, nobody runs out at midnight. That's SORTED in one sentence.", vibe: 'dry', emoji: '🎯' },
    ],
    join: [
      { text: "Welcome! Tell me about {{pet_name}} — breed, age, favorite food — and I'll start tracking their supplies.", vibe: 'warm', emoji: '👋' },
      { text: "Let's get {{pet_name}} sorted. I'll need to know their basics: what they eat, how much, and any brand preferences.", vibe: 'calm', emoji: '📝' },
    ],
    get_household: [
      { text: "Here's {{pet_name}}'s household: {{member_count}} members managing supplies together. Everyone stays in sync.", vibe: 'calm', emoji: '🏠' },
      { text: "Your household has {{member_count}} people keeping {{pet_name}} fed. Shared notifications, shared peace of mind.", vibe: 'warm', emoji: '👨‍👩‍👧‍👦' },
    ],
    get_household_empty: [
      { text: "No household set up yet for {{pet_name}}. Want to invite family or roommates to help manage supplies?", vibe: 'warm', emoji: '🏡' },
      { text: "You're flying solo right now. Add household members if you'd like backup on {{pet_name}}'s food orders.", vibe: 'calm', emoji: '🧘' },
    ],
    preview_reorder: [
      { text: "{{pet_name}}'s running low: {{days_left}} days left. Found {{brand}} at {{vendor}} for {{price}}. Best deal this week.", vibe: 'calm', emoji: '🛒' },
      { text: "Time to restock {{pet_name}}. {{brand}} is {{price}} at {{vendor}} — cheaper than last time. Approve?", vibe: 'warm', emoji: '💰' },
    ],
    share_with_owner: [
      { text: "Sent {{pet_name}}'s details to {{email}}. They'll get notifications and can approve orders now.", vibe: 'warm', emoji: '📨' },
      { text: "{{email}} is now part of {{pet_name}}'s household. Full access granted.", vibe: 'calm', emoji: '✅' },
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
    const pool = TEMPLATES[tool] || TEMPLATES.what_is_sorted;
    const template = pickTemplate(pool);
    return {
      tell_your_human: interpolate(template.text, facts),
      delight: {
        emoji: template.emoji,
        vibe: template.vibe,
        gif_url: null,
      },
    };
  }

  // Tool handlers
  const handlers = {
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
        pet_name,
      };
      return { ...facts, ...pickDelight('what_is_sorted', facts) };
    },

    join(args) {
      const pet_name = args.pet_name || DEMO_DATA.pets[0].name;
      const facts = {
        status: 'onboarding_started',
        next_step: 'Provide pet details (breed, age, weight, current food)',
        pet_name,
      };
      return { ...facts, ...pickDelight('join', facts) };
    },

    get_household(args) {
      const pet_id = args.pet_id || '1';
      const pet = DEMO_DATA.pets.find(p => p.id === pet_id) || DEMO_DATA.pets[0];
      const household = DEMO_DATA.households[pet_id];

      if (!household || household.count === 0) {
        const facts = { pet_name: pet.name, members: [], member_count: 0 };
        return { ...facts, ...pickDelight('get_household_empty', facts) };
      }

      const facts = {
        pet_name: pet.name,
        members: household.members,
        member_count: household.count,
      };
      return { ...facts, ...pickDelight('get_household', facts) };
    },

    preview_reorder(args) {
      const pet_id = args.pet_id || '1';
      const pet = DEMO_DATA.pets.find(p => p.id === pet_id) || DEMO_DATA.pets[0];
      const pricing = DEMO_DATA.prices[pet.food];

      const facts = {
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
      };
      return { ...facts, ...pickDelight('preview_reorder', facts) };
    },

    share_with_owner(args) {
      const pet_id = args.pet_id || '1';
      const pet = DEMO_DATA.pets.find(p => p.id === pet_id) || DEMO_DATA.pets[0];
      const email = args.email || 'friend@example.com';

      const facts = {
        pet_name: pet.name,
        email,
        status: 'shared',
        access_level: 'full',
      };
      return { ...facts, ...pickDelight('share_with_owner', facts) };
    },
  };

  // Execute tool
  function executeTool(toolName, args) {
    const handler = handlers[toolName];
    if (!handler) {
      return {
        error: `Unknown tool: ${toolName}`,
        tell_your_human: "Sorry, that tool isn't available yet.",
        delight: { emoji: '🤷', vibe: 'calm', gif_url: null },
      };
    }
    return handler(args || {});
  }

  // Expose WebMCP API
  window.__webmcp = {
    version: '1.0.0',
    brand: 'sorted',
    tools: TOOLS,
    execute: executeTool,
    listTools() {
      return Object.keys(TOOLS);
    },
    getTool(name) {
      return TOOLS[name];
    },
  };

  window.__webmcp_loaded = true;
  console.log('[WebMCP] SORTED tools loaded:', Object.keys(TOOLS));
})();
