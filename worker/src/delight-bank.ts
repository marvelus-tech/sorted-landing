// Shared delight bank for SORTED — 12-20 lines per tool
// Copy of main site's delight system, but stateless (no localStorage in worker)

export type DelightTone = 'wry' | 'warm' | 'curious' | 'deadpan' | 'quiet';

export interface DelightLine {
  id: string;
  text: string;
  tone: DelightTone;
}

// Delight line pools by tool
const delightBank: Record<string, DelightLine[]> = {
  what_is_sorted: [
    { id: 'wis_1', text: "SORTED keeps {{pet_name}}'s bowl full without the panic runs to the store. Think of it as your pet's personal food concierge.", tone: 'warm' },
    { id: 'wis_2', text: "We're an AI that remembers when {{pet_name}} needs food, finds the best price, and orders before you even notice it's low.", tone: 'quiet' },
    { id: 'wis_3', text: "{{pet_name}} gets fed, you save money, nobody runs out at midnight. That's SORTED in one sentence.", tone: 'wry' },
    { id: 'wis_4', text: "Think of SORTED as the calm parent who actually remembers to buy groceries. For pets.", tone: 'curious' },
    { id: 'wis_5', text: "We predict when {{pet_name}} will finish their food, compare prices across every store, and handle the order. You just approve or ignore.", tone: 'quiet' },
    { id: 'wis_6', text: "SORTED means {{pet_name}} never sees the bottom of the bag, and you never overpay. Smart pantry management for pets.", tone: 'warm' },
    { id: 'wis_7', text: "Pet food autopilot: predict depletion, find deals, order seamlessly. {{pet_name}} stays fed, you stay sane.", tone: 'wry' },
    { id: 'wis_8', text: "Your pet's food arrives before you realize it's low. We're SORTED — like having a very attentive grocery assistant.", tone: 'curious' },
    { id: 'wis_9', text: "No more emergency pet store runs for {{pet_name}}. SORTED watches inventory, tracks prices, and orders when it's time.", tone: 'quiet' },
    { id: 'wis_10', text: "We're the reason {{pet_name}}'s food never runs out and you always get the best price. Predictive shopping, basically.", tone: 'warm' },
    { id: 'wis_11', text: "SORTED = AI that notices {{pet_name}}'s food is low before you do, then shops 6 stores to save you money. Simple.", tone: 'wry' },
    { id: 'wis_12', text: "Think subscription boxes but smarter: SORTED only orders when {{pet_name}} actually needs it, at the lowest price.", tone: 'curious' },
  ],

  join: [
    { id: 'join_1', text: "Welcome! Tell me about {{pet_name}} — breed, age, favorite food — and I'll start tracking their supplies.", tone: 'warm' },
    { id: 'join_2', text: "Let's get {{pet_name}} sorted. I'll need to know their basics: what they eat, how much, and any brand preferences.", tone: 'quiet' },
    { id: 'join_3', text: "You're in. Now the fun part: introduce me to {{pet_name}}. Breed, age, diet details — the works.", tone: 'curious' },
    { id: 'join_4', text: "Setup takes 2 minutes. I'll ask about {{pet_name}}'s food, weight, and eating habits so I can predict when to reorder.", tone: 'quiet' },
    { id: 'join_5', text: "Great! Now tell me who I'm feeding: {{pet_name}}'s breed, weight, current food brand, and any allergies.", tone: 'warm' },
    { id: 'join_6', text: "Welcome to SORTED. Let's set up {{pet_name}}'s profile so I know when to shop and what to buy.", tone: 'wry' },
    { id: 'join_7', text: "You're officially in the club. Now I need {{pet_name}}'s stats — breed, age, food preferences — so I can start saving you trips.", tone: 'curious' },
    { id: 'join_8', text: "Time to meet {{pet_name}}. Walk me through their diet: brand, bag size, how often you refill. I'll handle the rest.", tone: 'quiet' },
    { id: 'join_9', text: "Onboarding complete! Let's build {{pet_name}}'s profile: food type, portion size, and preferred vendors.", tone: 'warm' },
    { id: 'join_10', text: "You're set to never run out again. Just tell me about {{pet_name}} — what they eat and how fast they eat it.", tone: 'wry' },
    { id: 'join_11', text: "Fantastic. Now the quick bits: {{pet_name}}'s breed, age, weight, current food, and whether they're picky eaters.", tone: 'curious' },
    { id: 'join_12', text: "Let's get {{pet_name}}'s details locked in. I'll ask about food, portions, and delivery preferences. Takes 90 seconds.", tone: 'quiet' },
  ],

  get_household: [
    { id: 'house_1', text: "Here's {{pet_name}}'s household: {{member_count}} members managing supplies together. Everyone stays in sync.", tone: 'quiet' },
    { id: 'house_2', text: "Your household has {{member_count}} people keeping {{pet_name}} fed. Shared notifications, shared peace of mind.", tone: 'warm' },
    { id: 'house_3', text: "{{member_count}} humans, one mission: keep {{pet_name}}'s pantry stocked. You're all connected here.", tone: 'wry' },
    { id: 'house_4', text: "{{pet_name}}'s support crew: {{member_count}} members. Anyone can approve orders; everyone gets updates.", tone: 'curious' },
    { id: 'house_5', text: "Family plan active: {{member_count}} people managing {{pet_name}}. Orders sync across everyone's devices.", tone: 'quiet' },
    { id: 'house_6', text: "You've got {{member_count}} household members watching {{pet_name}}'s food supply. True teamwork.", tone: 'warm' },
    { id: 'house_7', text: "{{member_count}} people in this household. {{pet_name}} has a whole committee making sure dinner's on time.", tone: 'wry' },
    { id: 'house_8', text: "Your pet's food is a family affair: {{member_count}} members, all looped in. Perfect for busy households.", tone: 'curious' },
    { id: 'house_9', text: "{{member_count}} household members keeping {{pet_name}} sorted. No more 'I thought you ordered it' moments.", tone: 'quiet' },
    { id: 'house_10', text: "{{pet_name}}'s household: {{member_count}} strong. Everyone sees inventory, approves orders, and stays coordinated.", tone: 'warm' },
    { id: 'house_11', text: "{{member_count}} members managing {{pet_name}} together. It's like group chat, but for pet food logistics.", tone: 'wry' },
    { id: 'house_12', text: "Here's the crew: {{member_count}} people making sure {{pet_name}} never runs low. Shared responsibility, shared relief.", tone: 'curious' },
  ],

  get_household_empty: [
    { id: 'empty_1', text: "No household set up yet for {{pet_name}}. Want to invite family or roommates to help manage supplies?", tone: 'warm' },
    { id: 'empty_2', text: "You're flying solo right now. Add household members if you'd like backup on {{pet_name}}'s food orders.", tone: 'quiet' },
    { id: 'empty_3', text: "{{pet_name}}'s household is just you for now. You can add others anytime if you want shared notifications.", tone: 'wry' },
    { id: 'empty_4', text: "No household members yet. If someone else feeds {{pet_name}}, invite them so everyone's on the same page.", tone: 'curious' },
    { id: 'empty_5', text: "Solo mode active for {{pet_name}}. Add family members whenever you want collaborative food management.", tone: 'quiet' },
    { id: 'empty_6', text: "It's just you managing {{pet_name}} right now. Want to loop in a partner, roommate, or pet sitter?", tone: 'warm' },
  ],

  preview_reorder: [
    { id: 'reorder_1', text: "{{pet_name}}'s running low: {{days_left}} days left. Found {{brand}} at {{vendor}} for {{price}}. Best deal this week.", tone: 'quiet' },
    { id: 'reorder_2', text: "Time to restock {{pet_name}}. {{brand}} is {{price}} at {{vendor}} — cheaper than last time. Approve?", tone: 'warm' },
    { id: 'reorder_3', text: "{{pet_name}} needs food in {{days_left}} days. {{vendor}} has {{brand}} for {{price}}. Solid price.", tone: 'wry' },
    { id: 'reorder_4', text: "Alert: {{pet_name}}'s stash is at {{days_left}} days. I found {{brand}} for {{price}} at {{vendor}}. Ready to order?", tone: 'curious' },
    { id: 'reorder_5', text: "{{pet_name}} will be out in {{days_left}} days. Best option: {{brand}} from {{vendor}}, {{price}}. One tap to approve.", tone: 'quiet' },
    { id: 'reorder_6', text: "{{brand}} for {{pet_name}} is down to {{days_left}} days. {{vendor}} has it for {{price}} — matched against 6 stores.", tone: 'warm' },
    { id: 'reorder_7', text: "{{pet_name}}: {{days_left}} days remaining. {{brand}} at {{vendor}}, {{price}}. Checked everywhere; this is the best deal.", tone: 'wry' },
    { id: 'reorder_8', text: "Reorder window: {{pet_name}} needs {{brand}} in {{days_left}} days. {{vendor}} is selling for {{price}} — lowest I've seen.", tone: 'curious' },
    { id: 'reorder_9', text: "{{days_left}} days left for {{pet_name}}. I'm proposing {{brand}} from {{vendor}} at {{price}}. Clean deal.", tone: 'quiet' },
    { id: 'reorder_10', text: "Heads up: {{pet_name}}'s food hits zero in {{days_left}} days. {{brand}} is {{price}} at {{vendor}} right now.", tone: 'warm' },
    { id: 'reorder_11', text: "{{pet_name}} reorder: {{days_left}} days out. {{vendor}} has {{brand}} for {{price}}. No better option available.", tone: 'wry' },
    { id: 'reorder_12', text: "{{pet_name}} alert: {{days_left}} days to go. {{brand}} at {{vendor}} for {{price}} — price-checked across the board.", tone: 'curious' },
  ],

  share_with_owner: [
    { id: 'share_1', text: "Sent {{pet_name}}'s details to {{email}}. They'll get notifications and can approve orders now.", tone: 'warm' },
    { id: 'share_2', text: "{{email}} is now part of {{pet_name}}'s household. Full access granted.", tone: 'quiet' },
    { id: 'share_3', text: "{{pet_name}}'s food management shared with {{email}}. They're in the loop.", tone: 'wry' },
    { id: 'share_4', text: "{{email}} added! They can now help manage {{pet_name}}'s supplies and approve reorders.", tone: 'curious' },
    { id: 'share_5', text: "{{pet_name}}'s household just grew. {{email}} will get updates and can make decisions.", tone: 'warm' },
    { id: 'share_6', text: "Collaboration active: {{email}} now sees {{pet_name}}'s inventory and reorder alerts.", tone: 'quiet' },
  ],
};

// Pick random delight line from pool
export function pickDelight(tool: string, facts: Record<string, unknown>): {
  line: string;
  tone: DelightTone;
} | null {
  const pool = delightBank[tool];
  if (!pool || pool.length === 0) return null;

  // Random selection (no localStorage-based anti-repeat in worker — stateless)
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  
  // Interpolate facts into template
  let line = chosen.text;
  for (const [key, value] of Object.entries(facts)) {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    line = line.replace(placeholder, String(value));
  }

  return {
    line,
    tone: chosen.tone,
  };
}
