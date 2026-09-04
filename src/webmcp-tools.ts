// WebMCP tools for SORTED landing page (NEW envelope format)
// Agents call these tools via document.modelContext

import { pickDelight } from './delight';

// Demo data: fixed facts for consistent tool behavior
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
  vendors: ['Amazon', 'Chewy', 'Petco', 'Walmart'],
  prices: {
    'Blue Buffalo Adult Chicken': { price: '$42.99', vendor: 'Amazon' },
    'Royal Canin Indoor': { price: '$36.49', vendor: 'Chewy' },
    'Purina Pro Plan': { price: '$48.99', vendor: 'Petco' },
  },
};

// Shared envelope builder
interface Envelope {
  ok: boolean;
  data: Record<string, unknown>;
  meta: {
    source: string;
    page_url: string;
    tool: string;
    as_of: string;
  };
  delight?: {
    line: string;
    tone: string;
    emoji: null;
    media_url: null;
  };
}

function buildEnvelope(
  ok: boolean,
  data: Record<string, unknown>,
  tool: string,
  delight?: { line: string; tone: string; emoji: null; media_url: null } | null
): Envelope {
  const envelope: Envelope = {
    ok,
    data,
    meta: {
      source: 'webmcp',
      page_url: window.location.href,
      tool,
      as_of: new Date().toISOString(),
    },
  };

  if (delight) {
    envelope.delight = delight;
  }

  return envelope;
}

// Tool: describe_site
export function describeSite(): Envelope {
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
}

// Tool: describe_page
export function describePage(args: { section?: string }): Envelope {
  const section = args.section || 'Hero';
  
  // Simplified — return feature section as example
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
          {
            name: 'Trust-First Design',
            description: 'Start in approval mode. Unlock autopilot after 20 approvals.',
          },
        ],
      },
      'describe_page'
    );
  }

  return buildEnvelope(
    true,
    {
      section,
      note: 'Section details available for: Hero, Features, Pricing, FAQ',
    },
    'describe_page'
  );
}

// Tool: what_is_sorted
export function whatIsSorted(args: { pet_name?: string }): Envelope {
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
  
  const delight = pickDelight('what_is_sorted', facts);
  return buildEnvelope(true, facts, 'what_is_sorted', delight);
}

// Tool: join
export function join(args: { pet_name?: string; email?: string }): Envelope {
  const pet_name = args.pet_name || DEMO_DATA.pets[0].name;
  
  const facts = {
    status: 'onboarding_started',
    demo_mode: true,
    next_step: 'Provide pet details (breed, age, weight, current food)',
    pet_name,
    note: 'Demo only — writes to localStorage, not a real account',
  };
  
  const delight = pickDelight('join', facts);
  return buildEnvelope(true, facts, 'join', delight);
}

// Tool: get_household
export function getHousehold(args: { pet_id?: string }): Envelope {
  const pet_id = args.pet_id || '1';
  const pet = DEMO_DATA.pets.find(p => p.id === pet_id) || DEMO_DATA.pets[0];
  const household = DEMO_DATA.households[pet_id as keyof typeof DEMO_DATA.households];
  
  if (!household || household.count === 0) {
    // Empty household case
    const facts = {
      pet_id,
      pet_name: pet.name,
      members: [],
      member_count: 0,
    };
    
    const delight = pickDelight('get_household_empty', facts);
    return buildEnvelope(true, facts, 'get_household', delight);
  }
  
  const facts = {
    pet_id,
    pet_name: pet.name,
    members: household.members,
    member_count: household.count,
  };
  
  const delight = pickDelight('get_household', facts);
  return buildEnvelope(true, facts, 'get_household', delight);
}

// Tool: preview_reorder
export function previewReorder(args: { pet_id?: string }): Envelope {
  const pet_id = args.pet_id || '1';
  const pet = DEMO_DATA.pets.find(p => p.id === pet_id) || DEMO_DATA.pets[0];
  const pricing = DEMO_DATA.prices[pet.food as keyof typeof DEMO_DATA.prices];
  
  const facts = {
    pet_id,
    pet_name: pet.name,
    brand: pet.food,
    vendor: pricing.vendor,
    price: pricing.price,
    days_left: Math.floor(Math.random() * 5) + 2, // Random 2-6 days for variety
    product: {
      name: pet.food,
      size: '15 lb bag',
      delivery: 'Arrives Thursday',
    },
    demo_mode: true,
    note: 'Demo prices — not a real order',
  };
  
  const delight = pickDelight('preview_reorder', facts);
  return buildEnvelope(true, facts, 'preview_reorder', delight);
}

// Tool: share_with_owner
export function shareWithOwner(args: { pet_id?: string; email?: string }): Envelope {
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
    pet_id,
    pet_name: pet.name,
    email,
    status: 'shared',
    access_level: 'full',
    demo_mode: true,
    note: 'Demo only — writes to localStorage, no real invite sent',
  };
  
  const delight = pickDelight('share_with_owner', facts);
  return buildEnvelope(true, facts, 'share_with_owner', delight);
}

// Tool: get_next_step
export function getNextStep(_args: { current_context?: string }): Envelope {
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
}

// Tool: list_plans
export function listPlans(): Envelope {
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
}

// Register tools with WebMCP (document.modelContext)
export function registerSortedTools(): void {
  if (!window.modelContext) {
    console.warn('[WebMCP] modelContext not available — tools will not register');
    return;
  }

  console.log('[WebMCP] Registering SORTED tools...');

  // Tool definitions for discovery
  const tools = [
    {
      name: 'describe_site',
      description: 'High-level overview of the SORTED landing page structure. Relay data first; if delight.line present, brief aside after facts; never alter facts.',
      parameters: {
        type: 'object' as const,
        properties: {} as Record<string, unknown>,
      },
      handler: describeSite,
    },
    {
      name: 'describe_page',
      description: 'Detailed information about a specific page section. Relay data first; if delight.line present, brief aside after facts; never alter facts.',
      parameters: {
        type: 'object' as const,
        properties: {
          section: {
            type: 'string',
            description: 'Section name (e.g., "Features", "Pricing")',
          },
        } as Record<string, unknown>,
      },
      handler: describePage,
    },
    {
      name: 'what_is_sorted',
      description: 'Explain SORTED\'s core value proposition with personality. Relay data first; if delight.line present, brief aside after facts; never alter facts.',
      parameters: {
        type: 'object' as const,
        properties: {
          pet_name: {
            type: 'string',
            description: 'Pet name for personalization (optional, defaults to "Max")',
          },
        } as Record<string, unknown>,
      },
      handler: whatIsSorted,
    },
    {
      name: 'join',
      description: 'Start demo onboarding (writes localStorage only, not a real account). Relay data first; if delight.line present, brief aside after facts; never alter facts.',
      parameters: {
        type: 'object' as const,
        properties: {
          pet_name: {
            type: 'string',
            description: 'Pet name for demo',
          },
          email: {
            type: 'string',
            description: 'User email for demo',
          },
        } as Record<string, unknown>,
      },
      handler: join,
    },
    {
      name: 'get_household',
      description: 'View demo household members managing this pet\'s food. Relay data first; if delight.line present, brief aside after facts; never alter facts.',
      parameters: {
        type: 'object' as const,
        properties: {
          pet_id: {
            type: 'string',
            description: 'Pet ID (defaults to "1" - Max)',
          },
        } as Record<string, unknown>,
      },
      handler: getHousehold,
    },
    {
      name: 'preview_reorder',
      description: 'Preview next reorder recommendation with demo pricing. Relay data first; if delight.line present, brief aside after facts; never alter facts.',
      parameters: {
        type: 'object' as const,
        properties: {
          pet_id: {
            type: 'string',
            description: 'Pet ID (defaults to "1" - Max)',
          },
        } as Record<string, unknown>,
      },
      handler: previewReorder,
    },
    {
      name: 'share_with_owner',
      description: 'Share demo household access (writes localStorage only, no real invite sent). Relay data first; if delight.line present, brief aside after facts; never alter facts.',
      parameters: {
        type: 'object' as const,
        properties: {
          pet_id: {
            type: 'string',
            description: 'Pet ID (defaults to "1" - Max)',
          },
          email: {
            type: 'string',
            description: 'Email of person to invite (required)',
          },
        } as Record<string, unknown>,
        required: ['email'],
      },
      handler: shareWithOwner,
    },
    {
      name: 'get_next_step',
      description: 'Contextual guidance for what to do next. Relay data first; if delight.line present, brief aside after facts; never alter facts.',
      parameters: {
        type: 'object' as const,
        properties: {
          current_context: {
            type: 'string',
            description: 'Where user is in journey',
          },
        } as Record<string, unknown>,
      },
      handler: getNextStep,
    },
    {
      name: 'list_plans',
      description: 'Return pricing tiers (read-only, no checkout). Relay data first; if delight.line present, brief aside after facts; never alter facts.',
      parameters: {
        type: 'object' as const,
        properties: {} as Record<string, unknown>,
      },
      handler: listPlans,
    },
  ];

  // Register each tool
  const modelContext = window.modelContext;
  tools.forEach(tool => {
    try {
      modelContext!.registerTool(
        tool.name,
        tool.description,
        tool.parameters,
        tool.handler
      );
      console.log(`[WebMCP] Registered: ${tool.name}`);
    } catch (err) {
      console.error(`[WebMCP] Failed to register ${tool.name}:`, err);
    }
  });

  console.log('[WebMCP] SORTED tools registered successfully');
}

// Export for legacy polyfill compatibility (if needed)
export const WEBMCP_TOOLS = {
  describe_site: describeSite,
  describe_page: describePage,
  what_is_sorted: whatIsSorted,
  join: join,
  get_household: getHousehold,
  preview_reorder: previewReorder,
  share_with_owner: shareWithOwner,
  get_next_step: getNextStep,
  list_plans: listPlans,
};

/** Register tools on document.modelContext (native WebMCP or official polyfill). */
export function registerSortedTools(): void {
  const ctx = document.modelContext;
  if (!ctx || typeof ctx.registerTool !== 'function') {
    console.warn('[SORTED] document.modelContext not available — WebMCP polyfill may not be loaded');
    return;
  }

  const defs = [
    {
      name: 'what_is_sorted',
      description:
        'Learn what SORTED does. After calling, read tell_your_human aloud to the human. Facts stay fixed; the line rotates.',
      inputSchema: {
        type: 'object',
        properties: {
          pet_name: { type: 'string', description: 'Optional pet name for personalization' },
        },
      },
      execute: async (args: Record<string, unknown>) => whatIsSorted(args as { pet_name?: string }),
    },
    {
      name: 'join',
      description:
        'Join / onboard a household for a pet. Read tell_your_human aloud. Includes delight metadata.',
      inputSchema: {
        type: 'object',
        properties: {
          pet_name: { type: 'string', description: 'Pet name' },
        },
      },
      execute: async (args: Record<string, unknown>) => join(args as { pet_name?: string }),
    },
    {
      name: 'get_household',
      description: 'Get household members for a pet. Read tell_your_human aloud.',
      inputSchema: {
        type: 'object',
        properties: {
          pet_id: { type: 'string', description: 'Pet id (defaults to demo)' },
        },
      },
      execute: async (args: Record<string, unknown>) => getHousehold(args as { pet_id?: string }),
    },
    {
      name: 'preview_reorder',
      description:
        'Preview next reorder with price and vendor. Facts fixed; tell_your_human rotates. Read it aloud.',
      inputSchema: {
        type: 'object',
        properties: {
          pet_id: { type: 'string', description: 'Pet id (defaults to demo)' },
        },
      },
      execute: async (args: Record<string, unknown>) => previewReorder(args as { pet_id?: string }),
    },
    {
      name: 'share_with_owner',
      description: 'Share household access. Read tell_your_human aloud.',
      inputSchema: {
        type: 'object',
        properties: {
          pet_id: { type: 'string' },
          email: { type: 'string' },
        },
        required: ['email'],
      },
      execute: async (args: Record<string, unknown>) =>
        shareWithOwner(args as { pet_id?: string; email?: string }),
    },
  ];

  for (const def of defs) {
    ctx.registerTool(def);
  }
  console.log('[SORTED] WebMCP tools registered:', defs.map((d) => d.name).join(', '));
}
