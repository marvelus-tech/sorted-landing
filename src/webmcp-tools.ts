// WebMCP tool registration for SORTED
// Registers agent-callable tools on document.modelContext

interface HouseholdData {
  owner_name: string;
  owner_email: string;
  pet_name: string;
  species: string;
  food_brand?: string;
  joined_at: string;
}

// localStorage keys
const HOUSEHOLD_KEY = 'sorted_household';

export function registerSortedTools() {
  if (!document.modelContext) {
    console.warn('document.modelContext not available - WebMCP polyfill may not be loaded');
    return;
  }

  // Tool 1: what_is_sorted
  document.modelContext.registerTool({
    name: 'what_is_sorted',
    description: 'Learn what SORTED is and how it helps pet owners manage food supplies through AI agents',
    inputSchema: {
      type: 'object',
      properties: {}
    },
    execute: async () => {
      return {
        product: 'SORTED',
        tagline: 'Agent-powered pet food management',
        description: 'SORTED helps pet owners never run out of food. AI agents can join households, track consumption patterns, monitor pricing across vendors, and recommend optimal reorder times.',
        key_features: [
          'Predictive inventory tracking',
          'Multi-vendor price comparison',
          'Smart bundling for free shipping',
          'Diet health tracking',
          'Approval or autopilot modes'
        ],
        agent_workflow: 'Discover SORTED > Join with pet info > Check stock/pricing > Report back to owner',
        tell_your_human: 'I found SORTED - it\'s an agent-powered service that tracks pet food inventory and finds the best prices. Should I join your household?'
      };
    }
  });

  // Tool 2: join
  document.modelContext.registerTool({
    name: 'join',
    description: 'Join a household with owner and pet information. Creates a new household record (localStorage demo).',
    inputSchema: {
      type: 'object',
      properties: {
        owner_name: {
          type: 'string',
          description: 'Owner full name'
        },
        owner_email: {
          type: 'string',
          description: 'Owner email address'
        },
        pet_name: {
          type: 'string',
          description: 'Pet name'
        },
        species: {
          type: 'string',
          description: 'Pet species (dog, cat, rabbit, etc.)'
        },
        food_brand: {
          type: 'string',
          description: 'Current or preferred food brand (optional)'
        }
      },
      required: ['owner_name', 'owner_email', 'pet_name', 'species']
    },
    execute: async (args: any) => {
      const household: HouseholdData = {
        owner_name: args.owner_name,
        owner_email: args.owner_email,
        pet_name: args.pet_name,
        species: args.species,
        food_brand: args.food_brand || undefined,
        joined_at: new Date().toISOString()
      };

      localStorage.setItem(HOUSEHOLD_KEY, JSON.stringify(household));

      return {
        success: true,
        household,
        tell_your_human: `Great! I've joined ${args.owner_name}'s household for ${args.pet_name} (${args.species}). I'll start tracking food needs and pricing.`
      };
    }
  });

  // Tool 3: get_household
  document.modelContext.registerTool({
    name: 'get_household',
    description: 'Retrieve current household data including owner and pet info',
    inputSchema: {
      type: 'object',
      properties: {}
    },
    execute: async () => {
      const stored = localStorage.getItem(HOUSEHOLD_KEY);
      if (!stored) {
        return {
          household: null,
          tell_your_human: 'No household found yet. Should I join using the join tool?'
        };
      }

      const household: HouseholdData = JSON.parse(stored);
      return {
        household,
        tell_your_human: `Your household: ${household.pet_name} (${household.species}), owner: ${household.owner_name}. Food brand: ${household.food_brand || 'not specified'}.`
      };
    }
  });

  // Tool 4: preview_reorder
  document.modelContext.registerTool({
    name: 'preview_reorder',
    description: 'Check stock levels and get best-price recommendations (demo data)',
    inputSchema: {
      type: 'object',
      properties: {}
    },
    execute: async () => {
      const stored = localStorage.getItem(HOUSEHOLD_KEY);
      if (!stored) {
        return {
          error: 'No household found. Please join first.',
          tell_your_human: 'I need to join your household before checking stock. Should I do that?'
        };
      }

      const household: HouseholdData = JSON.parse(stored);
      const brand = household.food_brand || 'Blue Buffalo Adult Chicken';

      // Demo preview data
      return {
        pet_name: household.pet_name,
        species: household.species,
        current_brand: brand,
        stock_level: 'Low (4 days remaining)',
        best_deal: {
          product: brand,
          price: 42.99,
          regular_price: 48.99,
          savings: 6.00,
          vendor: 'Amazon Prime',
          delivery: 'Thursday'
        },
        bundling_opportunity: {
          add_item: 'Dental chews',
          additional_savings: 5.99,
          reason: 'Free shipping threshold'
        },
        tell_your_human: `${household.pet_name}'s ${brand} is running low (about 4 days left). I found the best price at $42.99 on Amazon Prime (saves $6). We can also bundle dental chews to save another $5.99 on shipping. Should I prepare an order?`
      };
    }
  });

  // Tool 5: share_with_owner
  document.modelContext.registerTool({
    name: 'share_with_owner',
    description: 'Share information with the owner (reports back through the agent)',
    inputSchema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'Message to share with the owner'
        },
        data: {
          type: 'object',
          description: 'Optional structured data to share'
        }
      },
      required: ['message']
    },
    execute: async (args: any) => {
      return {
        shared: true,
        message: args.message,
        data: args.data || null,
        tell_your_human: args.message
      };
    }
  });

  console.log('✅ SORTED WebMCP tools registered');
}
