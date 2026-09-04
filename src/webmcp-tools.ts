// WebMCP tools for SORTED landing page
// Demo tools showing agent personality through randomized voice packs

import { pickDelight, type DelightResult } from './delight';

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

// Tool result type: facts + delight
interface ToolResult extends DelightResult {
  [key: string]: unknown;
}

// Tool: what_is_sorted
export function whatIsSorted(args: { pet_name?: string }): ToolResult {
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
  
  return {
    ...facts,
    ...delight,
  };
}

// Tool: join
export function join(args: { pet_name?: string }): ToolResult {
  const pet_name = args.pet_name || DEMO_DATA.pets[0].name;
  
  const facts = {
    status: 'onboarding_started',
    next_step: 'Provide pet details (breed, age, weight, current food)',
    pet_name,
  };
  
  const delight = pickDelight('join', facts);
  
  return {
    ...facts,
    ...delight,
  };
}

// Tool: get_household
export function getHousehold(args: { pet_id?: string }): ToolResult {
  const pet_id = args.pet_id || '1';
  const pet = DEMO_DATA.pets.find(p => p.id === pet_id) || DEMO_DATA.pets[0];
  const household = DEMO_DATA.households[pet_id as keyof typeof DEMO_DATA.households];
  
  if (!household || household.count === 0) {
    // Empty household case
    const facts = {
      pet_name: pet.name,
      members: [],
      member_count: 0,
    };
    
    const delight = pickDelight('get_household_empty', facts);
    
    return {
      ...facts,
      ...delight,
    };
  }
  
  const facts = {
    pet_name: pet.name,
    members: household.members,
    member_count: household.count,
  };
  
  const delight = pickDelight('get_household', facts);
  
  return {
    ...facts,
    ...delight,
  };
}

// Tool: preview_reorder
export function previewReorder(args: { pet_id?: string }): ToolResult {
  const pet_id = args.pet_id || '1';
  const pet = DEMO_DATA.pets.find(p => p.id === pet_id) || DEMO_DATA.pets[0];
  const pricing = DEMO_DATA.prices[pet.food as keyof typeof DEMO_DATA.prices];
  
  const facts = {
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
  };
  
  const delight = pickDelight('preview_reorder', facts);
  
  return {
    ...facts,
    ...delight,
  };
}

// Tool: share_with_owner
export function shareWithOwner(args: { pet_id?: string; email?: string }): ToolResult {
  const pet_id = args.pet_id || '1';
  const pet = DEMO_DATA.pets.find(p => p.id === pet_id) || DEMO_DATA.pets[0];
  const email = args.email || 'friend@example.com';
  
  const facts = {
    pet_name: pet.name,
    email,
    status: 'shared',
    access_level: 'full',
  };
  
  const delight = pickDelight('share_with_owner', facts);
  
  return {
    ...facts,
    ...delight,
  };
}

// WebMCP tool executor: routes tool name to handler
export function executeWebMcpTool(toolName: string, args: Record<string, unknown>): ToolResult {
  switch (toolName) {
    case 'what_is_sorted':
      return whatIsSorted(args);
    case 'join':
      return join(args);
    case 'get_household':
      return getHousehold(args);
    case 'preview_reorder':
      return previewReorder(args);
    case 'share_with_owner':
      return shareWithOwner(args);
    default:
      // Unknown tool fallback
      return {
        error: `Unknown tool: ${toolName}`,
        tell_your_human: "Sorry, that tool isn't available yet.",
        delight: {
          emoji: '🤷',
          vibe: 'calm',
          gif_url: null,
        },
      };
  }
}

// Export tool metadata for discovery
export const WEBMCP_TOOLS = {
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
