// SORTED Remote MCP Worker — Streamable HTTP JSON-RPC endpoint
// Implements same tools as WebMCP with shared envelope format

import { pickDelight } from './delight-bank';

// Demo data (matches WebMCP)
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

// Shared envelope builder
function buildEnvelope(
  ok: boolean,
  data: Record<string, unknown>,
  tool: string,
  delight?: { line: string; tone: string } | null
) {
  return {
    ok,
    data,
    meta: {
      source: 'remote-mcp',
      page_url: '',
      tool,
      as_of: new Date().toISOString(),
    },
    ...(delight && { delight: { ...delight, emoji: null, media_url: null } }),
  };
}

// Tool implementations
const tools = {
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

  describe_page(args: { section?: string }) {
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
  },

  what_is_sorted(args: { pet_name?: string }) {
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
  },

  join(args: { pet_name?: string; email?: string }) {
    const pet_name = args.pet_name || DEMO_DATA.pets[0].name;

    const facts = {
      status: 'onboarding_started',
      demo_mode: true,
      next_step: 'Provide pet details (breed, age, weight, current food)',
      pet_name,
      note: 'Demo only — no backend (Remote MCP is stateless)',
    };

    const delight = pickDelight('join', facts);
    return buildEnvelope(true, facts, 'join', delight);
  },

  get_household(args: { pet_id?: string }) {
    const pet_id = args.pet_id || '1';
    const pet = DEMO_DATA.pets.find(p => p.id === pet_id) || DEMO_DATA.pets[0];
    const household = DEMO_DATA.households[pet_id as keyof typeof DEMO_DATA.households];

    if (!household || household.count === 0) {
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
  },

  preview_reorder(args: { pet_id?: string }) {
    const pet_id = args.pet_id || '1';
    const pet = DEMO_DATA.pets.find(p => p.id === pet_id) || DEMO_DATA.pets[0];
    const pricing = DEMO_DATA.prices[pet.food as keyof typeof DEMO_DATA.prices];

    const facts = {
      pet_id,
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

    const delight = pickDelight('preview_reorder', facts);
    return buildEnvelope(true, facts, 'preview_reorder', delight);
  },

  share_with_owner(args: { pet_id?: string; email?: string }) {
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
      note: 'Demo only — no real invite sent',
    };

    const delight = pickDelight('share_with_owner', facts);
    return buildEnvelope(true, facts, 'share_with_owner', delight);
  },

  get_next_step(args: { current_context?: string }) {
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

// MCP tool discovery (JSON-RPC tools/list)
function listTools() {
  return {
    tools: [
      {
        name: 'describe_site',
        description: 'High-level overview of the SORTED landing page structure. Relay data first; if delight.line present, brief aside after facts; never alter facts.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'describe_page',
        description: 'Detailed information about a specific page section. Relay data first; if delight.line present, brief aside after facts; never alter facts.',
        inputSchema: {
          type: 'object',
          properties: {
            section: {
              type: 'string',
              description: 'Section name (e.g., "Features", "Pricing")',
            },
          },
        },
      },
      {
        name: 'what_is_sorted',
        description: 'Explain SORTED\'s core value proposition with personality. Relay data first; if delight.line present, brief aside after facts; never alter facts.',
        inputSchema: {
          type: 'object',
          properties: {
            pet_name: {
              type: 'string',
              description: 'Pet name for personalization (optional, defaults to "Max")',
            },
          },
        },
      },
      {
        name: 'join',
        description: 'Start demo onboarding (stateless, no backend). Relay data first; if delight.line present, brief aside after facts; never alter facts.',
        inputSchema: {
          type: 'object',
          properties: {
            pet_name: {
              type: 'string',
              description: 'Pet name for demo',
            },
            email: {
              type: 'string',
              description: 'User email for demo',
            },
          },
        },
      },
      {
        name: 'get_household',
        description: 'View demo household members managing this pet\'s food. Relay data first; if delight.line present, brief aside after facts; never alter facts.',
        inputSchema: {
          type: 'object',
          properties: {
            pet_id: {
              type: 'string',
              description: 'Pet ID (defaults to "1" - Max)',
            },
          },
        },
      },
      {
        name: 'preview_reorder',
        description: 'Preview next reorder recommendation with demo pricing. Relay data first; if delight.line present, brief aside after facts; never alter facts.',
        inputSchema: {
          type: 'object',
          properties: {
            pet_id: {
              type: 'string',
              description: 'Pet ID (defaults to "1" - Max)',
            },
          },
        },
      },
      {
        name: 'share_with_owner',
        description: 'Share demo household access (stateless, no backend). Relay data first; if delight.line present, brief aside after facts; never alter facts.',
        inputSchema: {
          type: 'object',
          properties: {
            pet_id: {
              type: 'string',
              description: 'Pet ID (defaults to "1" - Max)',
            },
            email: {
              type: 'string',
              description: 'Email of person to invite (required)',
            },
          },
          required: ['email'],
        },
      },
      {
        name: 'get_next_step',
        description: 'Contextual guidance for what to do next. Relay data first; if delight.line present, brief aside after facts; never alter facts.',
        inputSchema: {
          type: 'object',
          properties: {
            current_context: {
              type: 'string',
              description: 'Where user is in journey',
            },
          },
        },
      },
      {
        name: 'list_plans',
        description: 'Return pricing tiers (read-only, no checkout). Relay data first; if delight.line present, brief aside after facts; never alter facts.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
}

// CORS headers
function corsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigins = [
    'https://marvelus-tech.github.io',
    'http://localhost:5173',
    'http://localhost:3000',
  ];

  const allowOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

// Main worker handler
export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');
    const headers = corsHeaders(origin);

    // OPTIONS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    // /.well-known/mcp.json discovery
    if (url.pathname === '/.well-known/mcp.json') {
      return new Response(
        JSON.stringify({
          version: '1.0',
          name: 'sorted-landing-mcp',
          description: 'SORTED pet food management demo tools',
          endpoint: '/mcp',
          tools_list_endpoint: '/mcp',
          protocol: 'streamable-http',
        }),
        {
          status: 200,
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // POST /mcp — JSON-RPC endpoint
    if (url.pathname === '/mcp' && request.method === 'POST') {
      try {
        const body = await request.json() as {
          jsonrpc: string;
          method: string;
          params?: { name: string; arguments?: Record<string, unknown> };
          id: number | string;
        };

        // tools/list
        if (body.method === 'tools/list') {
          return new Response(
            JSON.stringify({
              jsonrpc: '2.0',
              result: listTools(),
              id: body.id,
            }),
            {
              status: 200,
              headers: {
                ...headers,
                'Content-Type': 'application/json',
              },
            }
          );
        }

        // tools/call
        if (body.method === 'tools/call') {
          const toolName = body.params?.name;
          const args = body.params?.arguments || {};

          if (!toolName || !(toolName in tools)) {
            return new Response(
              JSON.stringify({
                jsonrpc: '2.0',
                error: {
                  code: -32601,
                  message: `Unknown tool: ${toolName}`,
                },
                id: body.id,
              }),
              {
                status: 200,
                headers: {
                  ...headers,
                  'Content-Type': 'application/json',
                },
              }
            );
          }

          const tool = tools[toolName as keyof typeof tools] as (args: Record<string, unknown>) => unknown;
          const result = tool(args);

          return new Response(
            JSON.stringify({
              jsonrpc: '2.0',
              result,
              id: body.id,
            }),
            {
              status: 200,
              headers: {
                ...headers,
                'Content-Type': 'application/json',
              },
            }
          );
        }

        // Unknown method
        return new Response(
          JSON.stringify({
            jsonrpc: '2.0',
            error: {
              code: -32601,
              message: `Unknown method: ${body.method}`,
            },
            id: body.id,
          }),
          {
            status: 200,
            headers: {
              ...headers,
              'Content-Type': 'application/json',
            },
          }
        );
      } catch (err) {
        return new Response(
          JSON.stringify({
            error: 'Invalid JSON-RPC request',
            message: err instanceof Error ? err.message : 'Unknown error',
          }),
          {
            status: 400,
            headers: {
              ...headers,
              'Content-Type': 'application/json',
            },
          }
        );
      }
    }

    // 404 for other routes
    return new Response('Not Found', {
      status: 404,
      headers,
    });
  },
};
