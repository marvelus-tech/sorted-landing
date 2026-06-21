import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dog,
  Brain,
  ChevronRight,
  Check,
  ArrowRight,
  X,
  Clock,
  Heart,
  Star,
  Shield,
  Package,
  Calendar,
  Sparkles
} from 'lucide-react'

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
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

/* ── Chat Simulation Component ── */
function ChatSimulation({ messages, isDemo = false }: { messages: ChatMessage[]; isDemo?: boolean }) {
  const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const timeoutsRef = useRef<number[]>([])

  const startChat = () => {
    // Clear existing timeouts
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
              className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed animate-message-${msg.sender === 'user' ? 'right' : 'left'} ${
                msg.sender === 'user'
                  ? 'bg-sorted-500 text-white rounded-br-md'
                  : 'bg-white text-stone-700 border border-stone-100 rounded-bl-md shadow-sm'
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
            <div className="bg-white border border-stone-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-stone-300 animate-typing" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-stone-300 animate-typing" style={{ animationDelay: '200ms' }} />
                <div className="w-2 h-2 rounded-full bg-stone-300 animate-typing" style={{ animationDelay: '400ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {isDemo && (
        <div className="text-center mt-6">
          <button 
            onClick={startChat}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-stone-200 text-stone-700 font-semibold hover:border-stone-300 hover:bg-stone-50 transition-all hover:-translate-y-0.5"
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
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav 
      id="navbar"
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between h-16 backdrop-blur-xl bg-white/80 border border-stone-200/60 rounded-2xl mt-4 px-6 shadow-sm shadow-stone-900/5">
          <a href="#" className="font-extrabold text-xl tracking-tight text-stone-900">SORTED</a>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-500">
            <a href="#how-it-works" className="hover:text-stone-900 transition-colors duration-200">How it Works</a>
            <a href="#features" className="hover:text-stone-900 transition-colors duration-200">Features</a>
            <a href="#pricing" className="hover:text-stone-900 transition-colors duration-200">Pricing</a>
            <a href="#faq" className="hover:text-stone-900 transition-colors duration-200">FAQ</a>
          </div>
          <a 
            href="#start" 
            className="bg-sorted-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-sorted-700 transition-all duration-300 hover:shadow-lg hover:shadow-sorted-500/20 hover:-translate-y-0.5 active:translate-y-0"
          >
            Start Free
          </a>
        </div>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
      {/* Ambient background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] w-96 h-96 bg-sorted-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[5%] w-[30rem] h-[30rem] bg-warm-100/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-stone-100/40 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Copy */}
        <div className="space-y-8 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sorted-50 border border-sorted-100 text-sorted-700 text-xs font-bold uppercase tracking-wider animate-spring">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sorted-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sorted-500" />
            </span>
            Now in Telegram
          </div>

          <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.05] text-stone-900">
            Never worry about<br />
            <span className="text-gradient">pet food again.</span>
          </h1>

          <p className="text-lg lg:text-xl text-stone-500 leading-relaxed">
            SORTED predicts when you'll run out, compares prices across vendors, and orders through Telegram — so you can focus on walks, not Walmart runs.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a 
              href="#start" 
              className="group inline-flex items-center gap-2 bg-sorted-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-sorted-700 transition-all duration-300 hover:shadow-xl hover:shadow-sorted-500/20 hover:-translate-y-0.5 active:translate-y-0"
            >
              Start Free on Telegram
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
            <a 
              href="#demo" 
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg text-stone-700 bg-white border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
            >
              <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              See It in Action
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-stone-400 pt-2">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-sorted-500" />
              No credit card
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-sorted-500" />
              2 min setup
            </span>
            <span className="flex items-center gap-2">
              <X className="w-4 h-4 text-sorted-500" />
              Cancel anytime
            </span>
          </div>
        </div>

        {/* Right: Telegram Chat (The Wow Moment) */}
        <div className="relative lg:pl-8">
          {/* Phone Frame */}
          <div className="relative mx-auto max-w-[340px] bg-white rounded-[2.5rem] shadow-2xl shadow-stone-900/10 border border-stone-100 overflow-hidden">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-stone-900 rounded-b-2xl z-20" />
            {/* Status Bar */}
            <div className="bg-white pt-8 pb-2 px-6 flex items-center justify-between text-[10px] font-semibold text-stone-900 z-10 relative">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
              </div>
            </div>
            {/* Chat Header */}
            <div className="bg-white border-b border-stone-100 pb-3 px-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sorted-100 flex items-center justify-center text-sorted-600 font-bold text-lg">S</div>
              <div>
                <div className="font-bold text-stone-900 text-sm">SORTED</div>
                <div className="text-[11px] text-sorted-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sorted-500 animate-gentle-pulse" />
                  Online
                </div>
              </div>
            </div>
            {/* Chat Messages */}
            <ChatSimulation messages={heroChatMessages} />
            {/* Input Area */}
            <div className="bg-white border-t border-stone-100 p-3 flex items-center gap-2">
              <div className="flex-1 h-10 bg-stone-50 rounded-full border border-stone-100 flex items-center px-4 text-stone-400 text-sm">
                Message...
              </div>
              <div className="w-10 h-10 rounded-full bg-sorted-500 flex items-center justify-center text-white shadow-lg shadow-sorted-500/30">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Floating Stats Cards */}
          <div className="absolute -top-2 -right-4 lg:right-0 bg-white rounded-2xl shadow-xl shadow-stone-900/5 p-4 border border-stone-100 animate-float z-10">
            <div className="text-[10px] text-stone-400 uppercase tracking-wider font-bold mb-1">Saved this month</div>
            <div className="text-2xl font-extrabold text-warm-600">$23.40</div>
            <div className="text-[10px] text-stone-400 mt-1">vs. last month</div>
          </div>
          <div className="absolute -bottom-2 -left-4 lg:left-0 bg-white rounded-2xl shadow-xl shadow-stone-900/5 p-4 border border-stone-100 animate-float-delayed z-10">
            <div className="text-[10px] text-stone-400 uppercase tracking-wider font-bold mb-1">Next delivery</div>
            <div className="text-2xl font-extrabold text-sorted-600">Thu, Jun 25</div>
            <div className="text-[10px] text-stone-400 mt-1">Royal Canin 30lb</div>
          </div>
        </div>
      </div>
    </section>
  )
}

function TrustBar() {
  return (
    <section className="py-10 bg-white border-y border-stone-100">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-sm font-bold text-stone-400 uppercase tracking-wider">Trusted by 5,000+ pet parents</div>
          <div className="flex items-center gap-10 opacity-30">
            <span className="text-lg font-extrabold text-stone-900 tracking-tight">Chewy</span>
            <span className="text-lg font-extrabold text-stone-900 tracking-tight">Amazon</span>
            <span className="text-lg font-extrabold text-stone-900 tracking-tight">Petco</span>
            <span className="text-lg font-extrabold text-stone-900 tracking-tight">PetSmart</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProblemValue() {
  return (
    <section className="py-24 lg:py-32 bg-warm-50" id="problem">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Before */}
          <div className="space-y-6" data-animate="spring">
            <div className="text-warm-600 font-bold text-sm uppercase tracking-wider">The Problem</div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900">The 9pm<br />realization.</h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              You're on the couch. Your dog looks at their empty bowl. The stores are closed. Tomorrow morning is going to be a scramble. This mental load — remembering, comparing, ordering — is the invisible tax of pet parenthood.
            </p>
            <div className="space-y-4 pt-4">
              {[
                { title: "Emergency pet store runs", desc: "The worst timing, every time" },
                { title: "Overpaying under pressure", desc: "No time to compare prices" },
                { title: "Constant mental overhead", desc: "'Do we have enough?' — every week" }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-warm-100">
                  <div className="w-8 h-8 rounded-full bg-warm-100 flex items-center justify-center text-warm-600 text-sm font-bold shrink-0">✕</div>
                  <div>
                    <div className="font-semibold text-stone-900">{item.title}</div>
                    <div className="text-sm text-stone-500">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* After */}
          <div className="space-y-6 lg:mt-16" data-animate="spring">
            <div className="text-sorted-600 font-bold text-sm uppercase tracking-wider">The SORTED Way</div>
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900">Calm.<br />Automated.<br />Cheap.</h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              SORTED removes the mental load entirely. It lives in Telegram, learns your pet's consumption, and makes sure the bowl is never empty — at the best possible price, without you lifting a finger.
            </p>
            <div className="space-y-4 pt-4">
              {[
                { title: "Predictive alerts", desc: "Know before you run out" },
                { title: "Automatic price comparison", desc: "Best deal, every single order" },
                { title: "One-tap or autopilot", desc: "You're always in control" }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-sorted-100 hover:border-sorted-200 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-sorted-100 flex items-center justify-center text-sorted-600 text-sm font-bold shrink-0">✓</div>
                  <div>
                    <div className="font-semibold text-stone-900">{item.title}</div>
                    <div className="text-sm text-stone-500">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { num: "01", title: "Connect on Telegram", desc: "Add SORTED to your Telegram. Tell us about your pet — breed, age, diet, favorite brands." },
    { num: "02", title: "AI Learns Your Routine", desc: "We track consumption patterns, predict depletion, and monitor prices across vendors." },
    { num: "03", title: "One-Tap Approval", desc: "Get a message when it's time to reorder. One tap to approve — we handle the rest." },
    { num: "04", title: "Never Worry Again", desc: "Food arrives before you run out. Switch to full autopilot mode whenever you're ready." }
  ]

  return (
    <section className="py-24 lg:py-32" id="how-it-works">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-3xl mx-auto mb-20" data-animate>
          <div className="text-sorted-600 font-bold text-sm uppercase tracking-wider mb-4">How It Works</div>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 mb-6">From chaos to calm<br />in four steps.</h2>
          <p className="text-lg text-stone-500">No apps to download. No passwords to remember. Just Telegram — the app you already use.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8" data-stagger>
          {steps.map((step, i) => (
            <div key={i} className="relative group" data-animate="spring">
              <div className="w-14 h-14 rounded-2xl bg-sorted-50 border-2 border-sorted-100 flex items-center justify-center text-sorted-600 font-extrabold text-xl mb-6 group-hover:scale-110 group-hover:border-sorted-300 transition-all duration-300">{step.num}</div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">{step.title}</h3>
              <p className="text-stone-500 leading-relaxed">{step.desc}</p>
              {i < 3 && (
                <div className="hidden md:block absolute top-7 left-full w-full h-0.5 bg-gradient-to-r from-sorted-200 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features() {
  const features = [
    { icon: Brain, title: "Predictive Intelligence", desc: "Our AI learns your pet's consumption patterns and predicts depletion before it happens. No more emergency pet store runs.", badge: "Learns in ~2 weeks", large: true, color: "sorted" },
    { icon: Sparkles, title: "Smart Price Comparison", desc: "We check Amazon, Chewy, Petco, and local retailers to find the best price on your pet's exact food — every single order.", large: true, color: "warm" },
    { icon: Shield, title: "Trust-First Design", desc: "Start in approval mode. Every order shows vendor comparison and savings. Unlock full autopilot after 20 approvals.", large: false, color: "sorted" },
    { icon: Package, title: "Intelligent Bundling", desc: "Automatically combine orders to hit free shipping thresholds. Save on flea meds, treats, and supplements together.", large: false, color: "sorted" },
    { icon: Calendar, title: "Flexible Scheduling", desc: "Going on vacation? Pause deliveries. Switching brands? Just say so. SORTED adapts to your life, not the other way around.", large: false, color: "sorted" },
    { icon: Heart, title: "Diet Health Tracking", desc: "Log allergies, weight changes, and vet recommendations. SORTED ensures you never accidentally order the wrong formula.", large: false, color: "sorted" }
  ]

  return (
    <section className="py-24 lg:py-32 bg-white" id="features">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-3xl mx-auto mb-20" data-animate>
          <div className="text-sorted-600 font-bold text-sm uppercase tracking-wider mb-4">Features</div>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 mb-6">Smarter than any subscription.</h2>
          <p className="text-lg text-stone-500">Subscriptions are just calendars. SORTED is a brain that thinks, compares, and optimizes.</p>
        </div>

        <div className="bento-grid" data-stagger>
          {features.map((feature, i) => (
            <div 
              key={i} 
              className={`${feature.large ? 'bento-large' : 'bento-small'} bg-stone-50 rounded-3xl p-8 border border-stone-100 hover:border-${feature.color === 'warm' ? 'warm' : 'sorted'}-200 hover-lift relative overflow-hidden group`}
              data-animate="spring"
            >
              <div className="relative z-10 max-w-md">
                <div className={`w-12 h-12 rounded-2xl ${feature.color === 'warm' ? 'bg-warm-100 text-warm-600' : 'bg-sorted-100 text-sorted-600'} flex items-center justify-center mb-5 text-2xl`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-stone-900 mb-3">{feature.title}</h3>
                <p className="text-stone-500 leading-relaxed">{feature.desc}</p>
                {feature.badge && (
                  <div className="mt-6 inline-flex items-center gap-2 text-sorted-600 font-semibold text-sm">
                    <span className="w-2 h-2 rounded-full bg-sorted-500 animate-pulse" />
                    {feature.badge}
                  </div>
                )}
                {feature.title === "Smart Price Comparison" && (
                  <div className="mt-6 flex items-center gap-3">
                    <div className="px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-bold text-stone-600">Amazon</div>
                    <div className="px-3 py-1 rounded-full bg-warm-50 border border-warm-200 text-xs font-bold text-warm-600">Chewy -12%</div>
                    <div className="px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-bold text-stone-600">Petco</div>
                  </div>
                )}
              </div>
              <div className={`absolute bottom-0 right-0 w-80 h-80 ${feature.color === 'warm' ? 'bg-warm-50' : 'bg-sorted-50'} rounded-full -mr-20 -mb-20 opacity-60 group-hover:scale-110 transition-transform duration-700`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Demo() {
  return (
    <section className="py-24 lg:py-32 bg-sorted-50" id="demo">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-3xl mx-auto mb-16" data-animate>
          <div className="text-sorted-600 font-bold text-sm uppercase tracking-wider mb-4">See It In Action</div>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 mb-6">This is what calm feels like.</h2>
          <p className="text-lg text-stone-500">Watch SORTED handle a real reorder scenario — from prediction to delivery confirmation.</p>
        </div>

        <div className="max-w-xl mx-auto" data-animate="spring">
          <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-stone-900/10 border border-stone-100 overflow-hidden">
            {/* Phone Header */}
            <div className="bg-white border-b border-stone-100 pt-8 pb-4 px-6 flex items-center justify-center relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-stone-900 rounded-b-2xl" />
              <div className="text-center">
                <div className="font-bold text-stone-900">SORTED</div>
                <div className="text-xs text-sorted-500 flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sorted-500 animate-gentle-pulse" />
                  Online
                </div>
              </div>
            </div>
            {/* Chat Area */}
            <ChatSimulation messages={demoChatMessages} isDemo />
          </div>
        </div>
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
      color: "sorted"
    },
    {
      stars: 5,
      text: "We have three cats with different diets. SORTED bundles their orders perfectly and always finds the cheapest vendor. The Telegram interface is genius — I don't need another app.",
      name: "David K.",
      role: "Multi-cat dad, Seattle",
      initials: "DK",
      color: "warm"
    },
    {
      stars: 5,
      text: "The approval mode made me feel safe at first. After 20 orders, I switched to autopilot and haven't looked back. It's like having a personal assistant for my dog.",
      name: "Amanda R.",
      role: "French Bulldog owner, Miami",
      initials: "AR",
      color: "sorted"
    }
  ]

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-3xl mx-auto mb-20" data-animate>
          <div className="text-sorted-600 font-bold text-sm uppercase tracking-wider mb-4">Loved by Pet Parents</div>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 mb-6">5,000+ bowls kept full.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8" data-stagger>
          {testimonials.map((t, i) => (
            <div 
              key={i} 
              className="bg-stone-50 rounded-3xl p-8 border border-stone-100 hover:border-sorted-200 hover-lift"
              data-animate="spring"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="w-5 h-5 text-warm-500 fill-warm-500" />
                ))}
              </div>
              <p className="text-stone-600 leading-relaxed mb-6">{t.text}</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${t.color === 'warm' ? 'bg-warm-100 text-warm-600' : 'bg-sorted-100 text-sorted-600'} flex items-center justify-center font-bold`}>
                  {t.initials}
                </div>
                <div>
                  <div className="font-semibold text-stone-900 text-sm">{t.name}</div>
                  <div className="text-xs text-stone-400">{t.role}</div>
                </div>
              </div>
            </div>
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
    <section className="py-24 lg:py-32 bg-stone-50" id="pricing">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-3xl mx-auto mb-20" data-animate>
          <div className="text-sorted-600 font-bold text-sm uppercase tracking-wider mb-4">Pricing</div>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 mb-6">Simple, transparent pricing.</h2>
          <p className="text-lg text-stone-500">Start free. Upgrade when you're ready to go full autopilot. No hidden fees, ever.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start" data-stagger>
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`bg-white rounded-3xl p-8 border ${plan.popular ? 'border-sorted-200 ring-2 ring-sorted-100' : 'border-stone-200 hover:border-stone-300'} hover-lift`}
              data-animate="spring"
            >
              {plan.popular && (
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sorted-50 border border-sorted-100 text-sorted-700 text-xs font-bold uppercase tracking-wider mb-4">
                  <Star className="w-3 h-3 fill-sorted-500 text-sorted-500" />
                  Most Popular
                </div>
              )}
              
              <h3 className="text-xl font-bold text-stone-900 mb-2">{plan.name}</h3>
              <p className="text-sm text-stone-500 mb-6">{plan.description}</p>
              
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-stone-900">{plan.price}</span>
                {plan.period && <span className="text-sm text-stone-500">{plan.period}</span>}
              </div>
              
              <button className={`w-full py-3 rounded-full text-sm font-semibold mb-8 transition-all hover:-translate-y-0.5 active:translate-y-0 ${
                plan.popular
                  ? 'bg-sorted-600 text-white hover:bg-sorted-700 hover:shadow-lg hover:shadow-sorted-500/20'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}>
                {plan.cta}
              </button>
              
              <ul className="space-y-3">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.popular ? 'text-sorted-500' : 'text-stone-400'}`} />
                    <span className="text-stone-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
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
    <section id="faq" className="py-24 lg:py-32 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16" data-animate>
          <div className="text-sorted-600 font-bold text-sm uppercase tracking-wider mb-4">FAQ</div>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 mb-6">Questions? Answered.</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className="bg-stone-50 rounded-2xl overflow-hidden border border-stone-100"
              data-animate="spring"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-stone-100/50 transition-colors"
              >
                <span className="font-semibold text-stone-900 pr-4">{faq.q}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  openIndex === i ? 'bg-sorted-600 text-white rotate-90' : 'bg-white text-stone-400 border border-stone-200'
                }`}>
                  <ChevronRight className="w-4 h-4" />
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
                    <p className="px-6 pb-6 text-sm text-stone-600 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="py-24 lg:py-32 bg-warm-50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div data-animate>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sorted-50 border border-sorted-100 text-sorted-700 text-xs font-bold uppercase tracking-wider mb-8">
            <Sparkles className="w-3 h-3" />
            Start with 20 approvals. Then go full autopilot.
          </div>
          
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-stone-900 mb-6">
            Ready to never worry<br />about pet food again?
          </h2>
          
          <p className="text-lg text-stone-500 mb-10 max-w-2xl mx-auto">
            Join 5,000+ pet parents who've sorted their pet's life. Start free on Telegram — no credit card required.
          </p>
          
          <a 
            href="#start" 
            className="inline-flex items-center gap-2 bg-sorted-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-sorted-700 transition-all hover:shadow-xl hover:shadow-sorted-500/20 hover:-translate-y-0.5 active:translate-y-0"
          >
            Start on Telegram
            <ArrowRight className="w-5 h-5" />
          </a>
          
          <p className="text-sm text-stone-400 mt-6">
            Free forever plan available. Upgrade to Autopilot anytime.
          </p>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-sorted-600 rounded-lg flex items-center justify-center">
                <Dog className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-lg text-white">SORTED</span>
            </div>
            <p className="text-sm">
              Your pet's life, sorted. AI-powered food management for modern pet parents.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm text-white mb-4">Product</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-sm hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-sm hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Telegram Bot</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">API</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Press</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © 2026 SORTED. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <span className="sr-only">Instagram</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <span className="sr-only">Telegram</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ── Main App ── */
function App() {
  useScrollReveal()

  return (
    <div className="grain">
      <Navbar />
      <Hero />
      <TrustBar />
      <ProblemValue />
      <HowItWorks />
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
