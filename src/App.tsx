import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dog,
  Brain,
  MessageCircle,
  Zap,
  ChevronRight,
  Check,
  ArrowRight,
  Menu,
  X,
  Bot,
  Clock,
  Heart,
  Star
} from 'lucide-react'

import heroFlatlay from './assets/hero-flatlay.png'
import predictiveIntelligence from './assets/features/predictive-intelligence.png'
import smartPriceComparison from './assets/features/smart-price-comparison.png'
import trustFirstDesign from './assets/features/trust-first-design.png'
import intelligentBundling from './assets/features/intelligent-bundling.png'
import flexibleScheduling from './assets/features/flexible-scheduling.png'
import dietHealthTracking from './assets/features/diet-health-tracking.png'

import './assets/pet-imagery.css'

/* ── Types ── */
interface ChatMessage {
  id: number
  text: string
  sender: 'user' | 'sorted'
  delay: number
}

/* ── Chat Simulation Data ── */
const heroChatMessages: ChatMessage[] = [
  { id: 1, text: "Hey SORTED, how's my dog Max doing on food?", sender: 'user', delay: 800 },
  { id: 2, text: "Hi! Max has about 3 days of kibble left. I've found a great deal:", sender: 'sorted', delay: 1200 },
  { id: 3, text: "🎯 Royal Canin Large Adult 30lb\n💰 $47.99 at Chewy (was $54.99)\n📦 Free shipping + 5% autoship discount", sender: 'sorted', delay: 1800 },
  { id: 4, text: "That sounds perfect! Can you order it?", sender: 'user', delay: 1000 },
  { id: 5, text: "✅ Order placed!\n📅 Arriving Thursday, Jun 25\n💳 Charged $47.99 to your card ending in 4242\n📊 You'll save $14 vs. your last order", sender: 'sorted', delay: 1500 },
]

const demoChatMessages: ChatMessage[] = [
  { id: 1, text: "SORTED: Good morning! Your cat Luna's wet food is running low. I've checked prices:", sender: 'sorted', delay: 1000 },
  { id: 2, text: "🐱 Fancy Feast Variety Pack (24 cans)\nAmazon: $18.99\nChewy: $16.49 ✓ (Best price)\nPetco: $19.99", sender: 'sorted', delay: 1500 },
  { id: 3, text: "Also noticed you need flea meds. Want me to bundle for free shipping?", sender: 'sorted', delay: 1200 },
  { id: 4, text: "Yes please!", sender: 'user', delay: 800 },
  { id: 5, text: "🎉 Bundle created!\n• Fancy Feast 24-pack: $16.49\n• Frontline Plus 6-pack: $42.99\n📦 Free shipping unlocked!\n💰 Total: $59.48 (saved $8.50)", sender: 'sorted', delay: 1800 },
  { id: 6, text: "Approve this order?", sender: 'sorted', delay: 800 },
  { id: 7, text: "👍 Approved!", sender: 'user', delay: 600 },
  { id: 8, text: "✅ Order confirmed!\n📅 Delivered Tuesday, Jun 30\n💳 $59.48\n🔄 Want me to schedule this as a recurring order?", sender: 'sorted', delay: 1500 },
]

/* ── Scroll Reveal Hook ── */
// function useScrollReveal() {
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add('revealed')
//           }
//         })
//       },
//       { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
//     )

//     document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el))
//     return () => observer.disconnect()
//   }, [])
// }

/* ── Chat Simulation Component ── */
function ChatSimulation({ messages, isDemo = false }: { messages: ChatMessage[]; isDemo?: boolean }) {
  const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const timeoutsRef = useRef<number[]>([])

  const startChat = () => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
    setVisibleMessages([])
    setIsTyping(false)

    let cumulativeDelay = 500

    messages.forEach((msg) => {
      const typingTimeout = window.setTimeout(() => {
        setIsTyping(true)
      }, cumulativeDelay)
      timeoutsRef.current.push(typingTimeout)

      const messageTimeout = window.setTimeout(() => {
        setIsTyping(false)
        setVisibleMessages((prev) => [...prev, msg])
      }, cumulativeDelay + msg.delay)
      timeoutsRef.current.push(messageTimeout)

      cumulativeDelay += msg.delay + 600
    })
  }

  useEffect(() => {
    startChat()
    return () => timeoutsRef.current.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [visibleMessages, isTyping])

  return (
    <div className="relative">
      <div 
        ref={chatRef}
        className={`bg-stone-50 p-4 overflow-y-auto chat-scroll ${isDemo ? 'h-[580px]' : 'h-[420px]'}`}
      >
        {visibleMessages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-sage text-cream rounded-br-md'
                  : 'bg-white text-ink border border-cream-dark rounded-bl-md shadow-sm'
              }`}
            >
              {msg.text.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start mb-3">
            <div className="bg-white border border-cream-dark rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-ink-muted animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-ink-muted animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-ink-muted animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {isDemo && (
        <div className="text-center mt-6">
          <button 
            onClick={startChat}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-cream-dark text-ink font-semibold hover:border-ink/20 hover:bg-cream transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Replay Conversation
          </button>
        </div>
      )}
    </div>
  )
}

/* ── Components ── */
function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-cream/90 backdrop-blur-md shadow-sm' : ''}`}>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sage rounded-lg flex items-center justify-center">
            <Dog className="w-5 h-5 text-cream" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-ink">SORTED</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm font-medium text-ink-muted hover:text-ink transition-colors">How it works</a>
          <a href="#features" className="text-sm font-medium text-ink-muted hover:text-ink transition-colors">Features</a>
          <a href="#pricing" className="text-sm font-medium text-ink-muted hover:text-ink transition-colors">Pricing</a>
          <a href="#faq" className="text-sm font-medium text-ink-muted hover:text-ink transition-colors">FAQ</a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button className="text-sm font-medium text-ink-muted hover:text-ink transition-colors">Sign in</button>
          <button className="bg-ink text-cream px-5 py-2.5 rounded-full text-sm font-medium hover:bg-ink-light transition-colors">
            Get Started
          </button>
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-cream border-t border-cream-dark"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              <a href="#how-it-works" className="text-sm font-medium text-ink-muted">How it works</a>
              <a href="#features" className="text-sm font-medium text-ink-muted">Features</a>
              <a href="#pricing" className="text-sm font-medium text-ink-muted">Pricing</a>
              <a href="#faq" className="text-sm font-medium text-ink-muted">FAQ</a>
              <button className="bg-ink text-cream px-5 py-2.5 rounded-full text-sm font-medium w-full">
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-sage/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-coral/10 rounded-full blur-3xl" />
      
      <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-sage/10 text-sage-dark px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Bot className="w-4 h-4" />
            <span>AI-Powered Pet Care</span>
          </div>
          
          <h1 className="font-display font-bold text-5xl md:text-7xl leading-[0.95] tracking-tight text-ink mb-6">
            Your pet's life.
            <br />
            <span className="gradient-text">Sorted.</span>
          </h1>
          
          <p className="text-lg text-ink-muted leading-relaxed mb-8 max-w-lg">
            Never run out of kibble again. SORTED predicts what your pet needs, 
            finds the best price, and orders it — all through a simple Telegram message.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-ink text-cream px-8 py-4 rounded-full text-base font-medium hover:bg-ink-light transition-all hover:shadow-lg flex items-center justify-center gap-2">
              Start Free on Telegram
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border-2 border-ink/20 text-ink px-8 py-4 rounded-full text-base font-medium hover:border-ink/40 transition-colors">
              See How It Works
            </button>
          </div>
          
          <div className="flex items-center gap-6 mt-10 text-sm text-ink-muted">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-sage" />
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-sage" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-sage" />
              <span>Free forever plan</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          {/* Telegram Chat Demo - The Wow Moment */}
          <div className="relative mx-auto max-w-[340px] bg-white rounded-[2.5rem] shadow-2xl shadow-ink/10 border border-cream-dark overflow-hidden">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-ink rounded-b-2xl z-20" />
            {/* Status Bar */}
            <div className="bg-white pt-8 pb-2 px-6 flex items-center justify-between text-[10px] font-semibold text-ink z-10 relative">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
              </div>
            </div>
            {/* Chat Header */}
            <div className="bg-white border-b border-cream-dark pb-3 px-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center">
                <Dog className="w-5 h-5 text-sage" />
              </div>
              <div>
                <div className="font-bold text-ink text-sm">SORTED</div>
                <div className="text-[11px] text-sage flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
                  Online
                </div>
              </div>
            </div>
            {/* Chat Messages */}
            <ChatSimulation messages={heroChatMessages} />
            {/* Input Area */}
            <div className="bg-white border-t border-cream-dark p-3 flex items-center gap-2">
              <div className="flex-1 h-10 bg-cream rounded-full border border-cream-dark flex items-center px-4 text-ink-muted text-sm">
                Message...
              </div>
              <div className="w-10 h-10 rounded-full bg-sage flex items-center justify-center text-cream shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Floating Stats Cards */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute -top-4 -right-4 bg-coral text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
          >
            Save 12%
          </motion.div>
          
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-4 -left-4 bg-sage text-cream px-4 py-2 rounded-full text-sm font-medium shadow-lg"
          >
            <Clock className="w-4 h-4 inline mr-1" />
            2 min setup
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function ProblemValue() {
  return (
    <section className="py-24 lg:py-32 bg-warm/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Before */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="text-coral font-mono-display text-sm uppercase tracking-wider">The Problem</div>
            <h2 className="font-display font-bold text-4xl lg:text-5xl tracking-tight text-ink">The 9pm<br />realization.</h2>
            <p className="text-lg text-ink-muted leading-relaxed">
              You're on the couch. Your dog looks at their empty bowl. The stores are closed. Tomorrow morning is going to be a scramble. This mental load — remembering, comparing, ordering — is the invisible tax of pet parenthood.
            </p>
            <div className="space-y-4 pt-4">
              {[
                { title: "Emergency pet store runs", desc: "The worst timing, every time" },
                { title: "Overpaying under pressure", desc: "No time to compare prices" },
                { title: "Constant mental overhead", desc: "'Do we have enough?' — every week" }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-cream-dark">
                  <div className="w-8 h-8 rounded-full bg-coral/10 flex items-center justify-center text-coral text-sm font-bold shrink-0">✕</div>
                  <div>
                    <div className="font-semibold text-ink">{item.title}</div>
                    <div className="text-sm text-ink-muted">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* After */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6 lg:mt-16"
          >
            <div className="text-sage font-mono-display text-sm uppercase tracking-wider">The SORTED Way</div>
            <h2 className="font-display font-bold text-4xl lg:text-5xl tracking-tight text-ink">Calm.<br />Automated.<br />Cheap.</h2>
            <p className="text-lg text-ink-muted leading-relaxed">
              SORTED removes the mental load entirely. It lives in Telegram, learns your pet's consumption, and makes sure the bowl is never empty — at the best possible price, without you lifting a finger.
            </p>
            <div className="space-y-4 pt-4">
              {[
                { title: "Predictive alerts", desc: "Know before you run out" },
                { title: "Automatic price comparison", desc: "Best deal, every single order" },
                { title: "One-tap or autopilot", desc: "You're always in control" }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-sage/20 hover:border-sage/40 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-sage/10 flex items-center justify-center text-sage text-sm font-bold shrink-0">✓</div>
                  <div>
                    <div className="font-semibold text-ink">{item.title}</div>
                    <div className="text-sm text-ink-muted">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    {
      icon: MessageCircle,
      title: "Connect on Telegram",
      description: "Add SORTED to your Telegram. Tell us about your pet — breed, age, diet, favorite brands."
    },
    {
      icon: Brain,
      title: "AI Learns Your Routine",
      description: "We track consumption patterns, predict depletion, and monitor prices across vendors."
    },
    {
      icon: Zap,
      title: "One-Tap Approval",
      description: "Get a message when it's time to reorder. One tap to approve — we handle the rest."
    },
    {
      icon: Heart,
      title: "Never Worry Again",
      description: "Food arrives before you run out. Switch to full autopilot mode whenever you're ready."
    }
  ]

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sage font-mono-display text-sm uppercase tracking-wider">How It Works</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-ink mt-4 mb-4">
            From chaos to calm in 4 steps
          </h2>
          <p className="text-lg text-ink-muted max-w-2xl mx-auto">
            No apps to download. No passwords to remember. Just Telegram — the app you already use.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative"
            >
              <div className="bg-cream rounded-2xl p-8 hover-lift h-full">
                <div className="w-12 h-12 bg-sage/10 rounded-xl flex items-center justify-center mb-6">
                  <step.icon className="w-6 h-6 text-sage" />
                </div>
                <div className="font-mono-display text-xs text-sage mb-2">0{i + 1}</div>
                <h3 className="font-display font-semibold text-xl text-ink mb-3">{step.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{step.description}</p>
              </div>
              {i < 3 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ChevronRight className="w-6 h-6 text-cream-dark" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function LifestyleShowcase() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sage font-mono-display text-sm uppercase tracking-wider">Quality First</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-ink mt-4 mb-4">
            Only the best for your best friend
          </h2>
          <p className="text-lg text-ink-muted max-w-2xl mx-auto">
            We track premium brands, fresh ingredients, and nutritional value — so you don't have to.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl"
        >
          <img 
            src={heroFlatlay} 
            alt="Premium pet food ingredients including fresh meat, vegetables, and quality kibble"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/20 to-transparent" />
        </motion.div>
      </div>
    </section>
  )
}

function Features() {
  const features = [
    {
      image: predictiveIntelligence,
      title: "Predictive Intelligence",
      description: "Our AI learns your pet's consumption patterns and predicts depletion before it happens. No more emergency pet store runs.",
      large: true
    },
    {
      image: smartPriceComparison,
      title: "Smart Price Comparison",
      description: "We check Amazon, Chewy, Petco, and local retailers to find the best price on your pet's exact food — every single order.",
      large: true
    },
    {
      image: trustFirstDesign,
      title: "Trust-First Design",
      description: "Start in approval mode. Every order shows vendor comparison and savings. Unlock full autopilot after 20 approvals.",
      large: false
    },
    {
      image: intelligentBundling,
      title: "Intelligent Bundling",
      description: "Automatically combine orders to hit free shipping thresholds. Save on flea meds, treats, and supplements together.",
      large: false
    },
    {
      image: flexibleScheduling,
      title: "Flexible Scheduling",
      description: "Going on vacation? Pause deliveries. Switching brands? Just say so. SORTED adapts to your life, not the other way around.",
      large: false
    },
    {
      image: dietHealthTracking,
      title: "Diet Health Tracking",
      description: "Log allergies, weight changes, and vet recommendations. SORTED ensures you never accidentally order the wrong formula.",
      large: false
    }
  ]

  return (
    <section id="features" className="py-24 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sage font-mono-display text-sm uppercase tracking-wider">Features</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-ink mt-4 mb-4">
            Smarter than any subscription
          </h2>
          <p className="text-lg text-ink-muted max-w-2xl mx-auto">
            Subscriptions are just calendars. SORTED is a brain that thinks, compares, and optimizes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white rounded-2xl p-8 hover-lift ${feature.large ? 'md:col-span-2 lg:col-span-1' : ''}`}
            >
              <div className="h-40 rounded-xl overflow-hidden mb-5 bg-cream flex items-center justify-center">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <h3 className="font-display font-semibold text-lg text-ink mb-3">{feature.title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Demo() {
  return (
    <section className="py-24 lg:py-32 bg-sage/5" id="demo">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sage font-mono-display text-sm uppercase tracking-wider">See It In Action</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-ink mt-4 mb-4">
            This is what calm feels like
          </h2>
          <p className="text-lg text-ink-muted max-w-2xl mx-auto">
            Watch SORTED handle a real reorder scenario — from prediction to delivery confirmation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto"
        >
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-ink/10 border border-cream-dark overflow-hidden">
            {/* Phone Header */}
            <div className="bg-white border-b border-cream-dark pt-8 pb-4 px-6 flex items-center justify-center relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-ink rounded-b-2xl" />
              <div className="text-center">
                <div className="font-bold text-ink">SORTED</div>
                <div className="text-xs text-sage flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
                  Online
                </div>
              </div>
            </div>
            {/* Chat Area */}
            <ChatSimulation messages={demoChatMessages} isDemo />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Testimonials() {
  const testimonials = [
    {
      stars: 5,
      text: "I used to stress about running out of food every Sunday night. Now I literally never think about it. SORTED just... handles it. Saved me $40 in the first month alone.",
      name: "Jessica M.",
      role: "Golden Retriever mom, Austin",
      initials: "JM",
      color: "sage"
    },
    {
      stars: 5,
      text: "We have three cats with different diets. SORTED bundles their orders perfectly and always finds the cheapest vendor. The Telegram interface is genius — I don't need another app.",
      name: "David K.",
      role: "Multi-cat dad, Seattle",
      initials: "DK",
      color: "coral"
    },
    {
      stars: 5,
      text: "The approval mode made me feel safe at first. After 20 orders, I switched to autopilot and haven't looked back. It's like having a personal assistant for my dog.",
      name: "Amanda R.",
      role: "French Bulldog owner, Miami",
      initials: "AR",
      color: "sage"
    }
  ]

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sage font-mono-display text-sm uppercase tracking-wider">Loved by Pet Parents</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-ink mt-4 mb-4">
            5,000+ bowls kept full
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-cream rounded-2xl p-8 border border-cream-dark hover-lift"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="w-5 h-5 text-coral fill-coral" />
                ))}
              </div>
              <p className="text-ink-muted leading-relaxed mb-6">{t.text}</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${t.color === 'coral' ? 'bg-coral/10 text-coral' : 'bg-sage/10 text-sage'} flex items-center justify-center font-bold`}>
                  {t.initials}
                </div>
                <div>
                  <div className="font-semibold text-ink text-sm">{t.name}</div>
                  <div className="text-xs text-ink-muted">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for trying SORTED out",
      features: [
        "Up to 2 pets",
        "Approval mode only",
        "Price comparison",
        "Basic scheduling",
        "Telegram support"
      ],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Autopilot",
      price: "$9.99",
      period: "/month",
      description: "Full AI automation for busy pet parents",
      features: [
        "Unlimited pets",
        "Full autopilot mode",
        "Smart bundling",
        "Diet health tracking",
        "Priority support",
        "Family sharing (up to 4)"
      ],
      cta: "Start Autopilot",
      popular: true
    },
    {
      name: "Multi-Pet",
      price: "$19.99",
      period: "/month",
      description: "For households with 3+ pets or breeders",
      features: [
        "Everything in Autopilot",
        "Up to 10 pets",
        "Bulk ordering",
        "Custom delivery schedules",
        "API access",
        "Dedicated support"
      ],
      cta: "Contact Us",
      popular: false
    }
  ]

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sage font-mono-display text-sm uppercase tracking-wider">Pricing</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-ink mt-4 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-ink-muted max-w-2xl mx-auto">
            Start free. Upgrade when you're ready to go full autopilot. No hidden fees, ever.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`relative rounded-2xl p-8 ${plan.popular ? 'bg-ink text-cream' : 'bg-cream border border-cream-dark'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-coral text-white px-4 py-1 rounded-full text-xs font-medium">
                  Most Popular
                </div>
              )}
              
              <h3 className="font-display font-semibold text-xl mb-2">{plan.name}</h3>
              <p className={`text-sm mb-6 ${plan.popular ? 'text-cream/70' : 'text-ink-muted'}`}>
                {plan.description}
              </p>
              
              <div className="mb-6">
                <span className="font-display font-bold text-4xl">{plan.price}</span>
                {plan.period && <span className={`text-sm ${plan.popular ? 'text-cream/70' : 'text-ink-muted'}`}>{plan.period}</span>}
              </div>
              
              <button className={`w-full py-3 rounded-full text-sm font-medium mb-8 transition-colors ${
                plan.popular
                  ? 'bg-cream text-ink hover:bg-cream-dark'
                  : 'bg-ink text-cream hover:bg-ink-light'
              }`}>
                {plan.cta}
              </button>
              
              <ul className="space-y-3">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.popular ? 'text-sage-light' : 'text-sage'}`} />
                    <span className={plan.popular ? 'text-cream/80' : 'text-ink-muted'}>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const faqs = [
    {
      q: "How does SORTED know when my pet needs food?",
      a: "We use a combination of calibrated estimation based on your pet's breed, age, and weight, plus manual checkpoints you provide. Over time, our AI learns your specific consumption patterns and gets increasingly accurate. No smart feeder required — though we can integrate with one if you have it."
    },
    {
      q: "Can I choose which stores SORTED buys from?",
      a: "Absolutely. You can set preferred vendors, blacklist others, or let SORTED compare across all major retailers (Amazon, Chewy, Petco, Walmart, Target) and pick the best deal. You're always in control."
    },
    {
      q: "What if I want to change brands or try something new?",
      a: "Just tell SORTED. You can switch brands anytime, set dietary restrictions (grain-free, limited ingredient, etc.), or ask for recommendations. The AI will find the best options within your criteria."
    },
    {
      q: "Is my payment information safe?",
      a: "We use Stripe for all payment processing — your card details never touch our servers. We only store a secure token, and you can revoke access anytime. Plus, every order requires your approval until you explicitly enable autopilot."
    },
    {
      q: "What happens if there's a problem with an order?",
      a: "SORTED tracks every delivery. If something goes wrong — wrong item, damaged, late — we initiate the return process automatically and reorder if needed. You just get a notification that it's handled."
    },
    {
      q: "Can multiple people manage the same pet?",
      a: "Yes! Our Autopilot and Multi-Pet plans include family sharing. Up to 4 people can get notifications and approve orders. Perfect for couples, roommates, or co-parenting pet situations."
    }
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-24 bg-cream">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sage font-mono-display text-sm uppercase tracking-wider">FAQ</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-ink mt-4 mb-4">
            Questions? Answered.
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-display font-medium text-ink pr-4">{faq.q}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  openIndex === i ? 'bg-ink text-cream' : 'bg-cream-dark text-ink'
                }`}>
                  {openIndex === i ? <X className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-sm text-ink-muted leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="py-24 bg-ink text-cream">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-16 h-16 bg-sage rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Dog className="w-8 h-8 text-cream" />
          </div>
          
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">
            Ready to never worry about pet food again?
          </h2>
          
          <p className="text-lg text-cream/70 mb-10 max-w-2xl mx-auto">
            Join 5,000+ pet parents who've sorted their pet's life. 
            Start free on Telegram — no credit card required.
          </p>
          
          <button className="bg-cream text-ink px-10 py-4 rounded-full text-base font-medium hover:bg-cream-dark transition-all hover:shadow-lg inline-flex items-center gap-2">
            Start on Telegram
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <p className="text-sm text-cream/50 mt-6">
            Free forever plan available. Upgrade to Autopilot anytime.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-cream-dark py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-sage rounded-lg flex items-center justify-center">
                <Dog className="w-5 h-5 text-cream" />
              </div>
              <span className="font-display font-bold text-lg text-ink">SORTED</span>
            </div>
            <p className="text-sm text-ink-muted">
              Your pet's life, sorted. AI-powered food management for modern pet parents.
            </p>
          </div>
          
          <div>
            <h4 className="font-display font-semibold text-sm text-ink mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-sm text-ink-muted hover:text-ink transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-sm text-ink-muted hover:text-ink transition-colors">Pricing</a></li>
              <li><a href="#" className="text-sm text-ink-muted hover:text-ink transition-colors">Telegram Bot</a></li>
              <li><a href="#" className="text-sm text-ink-muted hover:text-ink transition-colors">API</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-semibold text-sm text-ink mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-ink-muted hover:text-ink transition-colors">About</a></li>
              <li><a href="#" className="text-sm text-ink-muted hover:text-ink transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-ink-muted hover:text-ink transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm text-ink-muted hover:text-ink transition-colors">Press</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-semibold text-sm text-ink mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-ink-muted hover:text-ink transition-colors">Help Center</a></li>
              <li><a href="#" className="text-sm text-ink-muted hover:text-ink transition-colors">Contact</a></li>
              <li><a href="#" className="text-sm text-ink-muted hover:text-ink transition-colors">Privacy</a></li>
              <li><a href="#" className="text-sm text-ink-muted hover:text-ink transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-cream pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-ink-muted">
            © 2026 SORTED. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-ink-muted hover:text-ink transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" className="text-ink-muted hover:text-ink transition-colors">
              <span className="sr-only">Instagram</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="#" className="text-ink-muted hover:text-ink transition-colors">
              <span className="sr-only">Telegram</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function App() {
  return (
    <div className="grain">
      <Navbar />
      <Hero />
      <ProblemValue />
      <HowItWorks />
      <LifestyleShowcase />
      <Features />
      <Demo />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  )
}

export default App
