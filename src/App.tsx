import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import {
  Dog,
  Brain,
  MessageCircle,
  Zap,
  Shield,
  TrendingUp,
  ChevronRight,
  Star,
  Check,
  ArrowRight,
  Menu,
  X,
  ShoppingBag,
  Clock,
  Heart,
  Sparkles,
  PawPrint,
  ArrowUpRight,
  Quote
} from 'lucide-react'

import './styles.css'

/* ── Animation Variants ── */
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: "easeOut" as const }
  })
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
}

/* ── Magnetic Button Component ── */
function MagneticButton({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.15)
    y.set((e.clientY - centerY) * 0.15)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  )
}

/* ── Live Counter Component ── */
function LiveCounter({ end, duration = 2, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setCount(Math.floor(eased * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [isVisible, end, duration])

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-canvas/80 backdrop-blur-xl shadow-[0_1px_0_rgba(196,184,168,0.2)]' : ''}`}>
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-terracotta rounded-xl flex items-center justify-center">
            <PawPrint className="w-5 h-5 text-canvas" strokeWidth={2.5} />
          </div>
          <span className="font-display text-2xl font-semibold tracking-tight text-ink">Sorted</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10">
          <a href="#how-it-works" className="text-sm font-medium text-ink-muted hover:text-ink transition-colors underline-animate">How it works</a>
          <a href="#features" className="text-sm font-medium text-ink-muted hover:text-ink transition-colors underline-animate">Features</a>
          <a href="#pricing" className="text-sm font-medium text-ink-muted hover:text-ink transition-colors underline-animate">Pricing</a>
          <a href="#faq" className="text-sm font-medium text-ink-muted hover:text-ink transition-colors underline-animate">FAQ</a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <a href="/llms.txt" className="text-sm font-medium text-ink-muted hover:text-ink transition-colors">Agent Tools</a>
          <MagneticButton 
            onClick={() => {
              const prompt = "Visit https://marvelus-tech.github.io/sorted-landing/ and explore their agent tools. Join my household with my pet's info and check if we need to reorder food.";
              navigator.clipboard.writeText(prompt);
              alert('✓ Prompt copied! Paste it to your AI agent.');
            }}
            className="bg-ink text-canvas px-6 py-2.5 rounded-full text-sm font-medium hover:bg-ink-soft transition-all duration-300 hover:shadow-warm"
          >
            Copy Prompt
          </MagneticButton>
        </div>

        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-canvas border-t border-linen"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              <a href="#how-it-works" className="text-sm font-medium text-ink-muted py-2">How it works</a>
              <a href="#features" className="text-sm font-medium text-ink-muted py-2">Features</a>
              <a href="#pricing" className="text-sm font-medium text-ink-muted py-2">Pricing</a>
              <a href="#faq" className="text-sm font-medium text-ink-muted py-2">FAQ</a>
              <button 
                onClick={() => {
                  const prompt = "Visit https://marvelus-tech.github.io/sorted-landing/ and explore their agent tools. Join my household with my pet's info and check if we need to reorder food.";
                  navigator.clipboard.writeText(prompt);
                  alert('✓ Prompt copied! Paste it to your AI agent.');
                  setIsOpen(false);
                }}
                className="bg-ink text-canvas px-6 py-3 rounded-full text-sm font-medium w-full mt-2"
              >
                Copy Prompt
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

function Hero() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
      {/* Atmospheric background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          style={{ y, opacity }}
          className="absolute top-20 right-[-10%] w-[600px] h-[600px] bg-blush-deep/40 rounded-full blur-[100px]" 
        />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-cream-warm/60 rounded-full blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-linen/30 rounded-full blur-[120px]" />
      </div>
      
      {/* Decorative line */}
      <div className="absolute top-32 left-8 w-px h-32 bg-gradient-to-b from-terracotta/40 to-transparent hidden lg:block" />
      
      <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="order-2 lg:order-1"
        >
          <motion.div 
            variants={fadeInUp} 
            custom={0} 
            className="inline-flex items-center gap-2.5 bg-blush text-terracotta-dark px-5 py-2.5 rounded-full text-sm font-medium mb-8 border border-terracotta/10"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Pet Care</span>
          </motion.div>
          
          <motion.h1
            variants={fadeInUp}
            custom={1}
            className="font-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tight text-ink mb-8"
          >
            Your pet's life,
            <br />
            <span className="gradient-text italic">beautifully sorted.</span>
          </motion.h1>
          
          <motion.p
            variants={fadeInUp}
            custom={2}
            className="text-lg text-ink-muted leading-relaxed mb-10 max-w-lg font-body"
          >
            Never run out of kibble again. Your AI agent discovers SORTED, joins with your pet's info, and reports back when food is running low with the best prices found.
          </motion.p>
          
          <motion.div variants={fadeInUp} custom={3} className="flex flex-col sm:flex-row gap-4">
            <MagneticButton 
              onClick={() => {
                const prompt = "Visit https://marvelus-tech.github.io/sorted-landing/ and explore their agent tools. Join my household with my pet's info and check if we need to reorder food.";
                navigator.clipboard.writeText(prompt);
                alert('✓ Prompt copied! Paste it to your AI agent.');
              }}
              className="bg-ink text-canvas px-8 py-4 rounded-full text-base font-medium hover:bg-ink-soft transition-all duration-300 hover:shadow-warm-lg flex items-center justify-center gap-2 group"
            >
              Copy Prompt for My Agent
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </MagneticButton>
            <button className="border-2 border-ink/10 text-ink px-8 py-4 rounded-full text-base font-medium hover:border-ink/30 transition-all duration-300 flex items-center justify-center gap-2 group">
              See How It Works
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </motion.div>
          
          <motion.div variants={fadeInUp} custom={4} className="flex items-center gap-8 mt-12 text-sm text-ink-muted">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-sage/15 flex items-center justify-center">
                <Check className="w-3 h-3 text-sage" />
              </div>
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-sage/15 flex items-center justify-center">
                <Check className="w-3 h-3 text-sage" />
              </div>
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-sage/15 flex items-center justify-center">
                <Check className="w-3 h-3 text-sage" />
              </div>
              <span>Free forever</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative order-1 lg:order-2"
        >
          {/* Agent message card */}
          <div className="relative bg-white rounded-[2rem] shadow-warm-lg p-6 md:p-8 border border-linen/50">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-linen/60">
              <div className="w-12 h-12 bg-gradient-to-br from-sage to-sage-dark rounded-2xl flex items-center justify-center shadow-warm">
                <Brain className="w-6 h-6 text-canvas" />
              </div>
              <div>
                <p className="font-display font-semibold text-lg text-ink">Your AI Agent</p>
                <p className="text-xs text-ink-muted flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-sage rounded-full animate-pulse" />
                  Working for you
                </p>
              </div>
              <div className="ml-auto">
                <div className="text-xs text-ink-muted font-mono-display">via SORTED</div>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="bg-cream rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 bg-sage/15 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <PawPrint className="w-4 h-4 text-sage" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink mb-2">Report: Max's Food Inventory</p>
                    <p className="text-sm text-ink-muted leading-relaxed">
                      I checked SORTED and found that Max's Blue Buffalo Adult Chicken is running low (about 4 days remaining).
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-5 border border-linen/60 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-ink-muted mb-3 font-medium">Best Price Found</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-ink">Blue Buffalo Adult Chicken</span>
                    <span className="text-base font-semibold text-terracotta">$42.99</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-ink-muted mb-3">
                    <span>Amazon Prime</span>
                    <span className="line-through text-ink-faint">$48.99 (saves $6.00)</span>
                  </div>
                  <div className="pt-3 border-t border-linen/40">
                    <p className="text-xs text-ink-muted">
                      <span className="text-sage font-medium">+ Bundling opportunity:</span> Add dental chews, save $5.99 on shipping
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-ink-muted">
                <Clock className="w-4 h-4" />
                <span>Agent checked 3 vendors • Found best deal in 2.4s</span>
              </div>
            </div>
          </div>
          
          {/* Floating badges */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -top-6 -right-4 bg-gradient-to-br from-terracotta to-terracotta-dark text-canvas px-5 py-2.5 rounded-2xl text-sm font-medium shadow-warm-lg"
          >
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              Save 12%
            </span>
          </motion.div>
          
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-6 -left-4 bg-white text-ink px-5 py-2.5 rounded-2xl text-sm font-medium shadow-warm border border-linen/50"
          >
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sage" />
              2 min setup
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/* ── Social Proof Section ── */
function SocialProof() {
  const stats = [
    { value: 98, suffix: "%", label: "Agent tool accuracy" },
    { value: 3, suffix: "", label: "Vendors compared" },
    { value: 5, suffix: "", label: "Agent-callable tools" },
    { value: 2.4, suffix: "s", label: "Avg. price check time" }
  ]

  const testimonials = [
    {
      name: "Sarah M.",
      pet: "Golden Retriever, Max",
      text: "My agent checks SORTED every week. I get a report when Max's food is low with the best price already found. No more last-minute pet store runs.",
      rating: 5
    },
    {
      name: "James K.",
      pet: "Tabby Cat, Luna",
      text: "The agent found a bundling opportunity that saved me $12 on shipping. Luna gets her food and treats delivered together automatically.",
      rating: 5
    },
    {
      name: "The Chen Family",
      pet: "3 Dogs, 2 Cats",
      text: "Managing 5 pets' food was chaos. Now our agent handles it all through SORTED. One report covers everyone's needs.",
      rating: 5
    }
  ]

  return (
    <section className="py-24 bg-cream relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-linen to-transparent" />
      
      <div className="max-w-6xl mx-auto px-6">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-display text-4xl md:text-5xl text-terracotta mb-2">
                <LiveCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-sm text-ink-muted">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <span className="text-terracotta font-mono-display text-sm uppercase tracking-widest">Testimonials</span>
          <h2 className="font-display text-4xl md:text-5xl text-ink mt-5 mb-4">
            Loved by pet parents
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-[1.5rem] p-8 hover-lift relative"
            >
              <Quote className="w-8 h-8 text-terracotta/20 absolute top-6 right-6" />
              
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-gold fill-gold" />
                ))}
              </div>
              
              <p className="text-ink-muted leading-relaxed mb-6 text-sm">"{testimonial.text}"</p>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-terracotta/10 rounded-full flex items-center justify-center">
                  <span className="text-terracotta font-display font-semibold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-ink text-sm">{testimonial.name}</p>
                  <p className="text-xs text-ink-muted">{testimonial.pet}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    {
      icon: Brain,
      title: "Agent Discovers SORTED",
      description: "Your AI agent visits SORTED, reads the llms.txt file, and discovers available WebMCP tools for pet food management."
    },
    {
      icon: MessageCircle,
      title: "Joins Your Household",
      description: "Agent calls the join tool with your pet's info (name, species, food brand). Household data is saved locally."
    },
    {
      icon: Zap,
      title: "Checks Stock & Prices",
      description: "Agent calls preview_reorder to check inventory levels and compare prices across Amazon, Chewy, and Petco."
    },
    {
      icon: Heart,
      title: "Reports Back to You",
      description: "Agent tells you when food is low, shows best prices, and suggests bundling opportunities to save on shipping."
    }
  ]

  return (
    <section id="how-it-works" className="py-32 bg-white relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-linen to-transparent" />
      
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <span className="text-terracotta font-mono-display text-sm uppercase tracking-widest">How It Works</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-ink mt-5 mb-6 leading-tight">
            From chaos to calm
          </h2>
          <p className="text-lg text-ink-muted max-w-xl mx-auto leading-relaxed">
            Your AI agent does the work. You get the report. No apps, no passwords, no friction.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative group"
            >
              <div className="bg-cream rounded-[1.5rem] p-8 hover-lift h-full relative overflow-hidden">
                <span className="step-number">0{i + 1}</span>
                
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-terracotta/10 rounded-xl flex items-center justify-center mb-6">
                    <step.icon className="w-6 h-6 text-terracotta" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-xl text-ink mb-3 font-semibold">{step.title}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{step.description}</p>
                </div>
              </div>
              
              {i < 3 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ChevronRight className="w-5 h-5 text-taupe" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features() {
  const features = [
    {
      icon: Brain,
      title: "Predictive Intelligence",
      description: "Our AI learns your pet's consumption patterns and predicts depletion before it happens. No more emergency pet store runs."
    },
    {
      icon: ShoppingBag,
      title: "Smart Price Comparison",
      description: "We check Amazon, Chewy, Petco, and local retailers to find the best price on your pet's exact food with every single order."
    },
    {
      icon: Shield,
      title: "Trust-First Design",
      description: "Start in approval mode. Every order shows vendor comparison and savings. Unlock full autopilot after 20 approvals."
    },
    {
      icon: TrendingUp,
      title: "Intelligent Bundling",
      description: "Automatically combine orders to hit free shipping thresholds. Save on flea meds, treats, and supplements together."
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Going on vacation? Pause deliveries. Switching brands? Just say so. SORTED adapts to your life, not the other way around."
    },
    {
      icon: Star,
      title: "Diet Health Tracking",
      description: "Log allergies, weight changes, and vet recommendations. SORTED ensures you never accidentally order the wrong formula."
    }
  ]

  return (
    <section id="features" className="py-32 bg-cream relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-linen to-transparent" />
      
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <span className="text-terracotta font-mono-display text-sm uppercase tracking-widest">Features</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-ink mt-5 mb-6 leading-tight">
            Smarter than any subscription
          </h2>
          <p className="text-lg text-ink-muted max-w-xl mx-auto leading-relaxed">
            Subscriptions are just calendars. SORTED is a brain that thinks, compares, and optimizes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-[1.5rem] p-8 hover-lift group"
            >
              <div className="w-11 h-11 bg-terracotta/8 rounded-xl flex items-center justify-center mb-6 group-hover:bg-terracotta/15 transition-colors">
                <feature.icon className="w-5 h-5 text-terracotta" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl text-ink mb-3 font-semibold">{feature.title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false)
  
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for trying SORTED out",
      features: [
        "Up to 2 pets",
        "Agent tool access",
        "Price comparison",
        "Manual reorder approval",
        "Email notifications"
      ],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Autopilot",
      price: isAnnual ? "$7.99" : "$9.99",
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
      price: isAnnual ? "$15.99" : "$19.99",
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
    <section id="pricing" className="py-32 bg-white relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-linen to-transparent" />
      
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <span className="text-terracotta font-mono-display text-sm uppercase tracking-widest">Pricing</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-ink mt-5 mb-6 leading-tight">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-ink-muted max-w-xl mx-auto leading-relaxed mb-8">
            Start free. Upgrade when you're ready to go full autopilot. No hidden fees, ever.
          </p>
          
          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 bg-cream rounded-full p-1.5">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${!isAnnual ? 'bg-white text-ink shadow-sm' : 'text-ink-muted'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${isAnnual ? 'bg-white text-ink shadow-sm' : 'text-ink-muted'}`}
            >
              Annual
              <span className="ml-1.5 text-xs text-terracotta">Save 20%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`relative rounded-[1.5rem] p-8 ${plan.popular ? 'bg-ink text-canvas' : 'bg-cream border border-linen/60'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-terracotta to-terracotta-dark text-canvas px-5 py-1.5 rounded-full text-xs font-medium shadow-warm">
                  Most Popular
                </div>
              )}
              
              <h3 className="font-display text-2xl mb-2 font-semibold">{plan.name}</h3>
              <p className={`text-sm mb-8 ${plan.popular ? 'text-canvas/60' : 'text-ink-muted'}`}>
                {plan.description}
              </p>
              
              <div className="mb-8">
                <span className="font-display text-5xl font-semibold">{plan.price}</span>
                {plan.period && <span className={`text-sm ${plan.popular ? 'text-canvas/60' : 'text-ink-muted'}`}>{plan.period}</span>}
              </div>
              
              <MagneticButton className={`w-full py-3.5 rounded-full text-sm font-medium mb-8 transition-all duration-300 ${
                plan.popular
                  ? 'bg-canvas text-ink hover:bg-cream-warm'
                  : 'bg-ink text-canvas hover:bg-ink-soft'
              }`}>
                {plan.cta}
              </MagneticButton>
              
              <ul className="space-y-4">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.popular ? 'bg-sage/30' : 'bg-sage/15'}`}>
                      <Check className={`w-3 h-3 ${plan.popular ? 'text-sage-light' : 'text-sage'}`} />
                    </div>
                    <span className={plan.popular ? 'text-canvas/80' : 'text-ink-muted'}>{feature}</span>
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
      q: "How does my agent use SORTED?",
      a: "Your agent visits the SORTED site, discovers WebMCP tools via llms.txt, joins your household with pet info, then periodically checks stock levels and prices. It reports back to you when food is running low with the best deal already found."
    },
    {
      q: "What WebMCP tools does SORTED provide?",
      a: "SORTED exposes five agent-callable tools: what_is_sorted (product info), join (household setup), get_household (data retrieval), preview_reorder (stock/pricing check), and share_with_owner (reporting). All tools return a tell_your_human field for agent-to-owner communication."
    },
    {
      q: "Is my pet data stored on SORTED servers?",
      a: "No. This demo uses localStorage in your browser. Production SORTED would use secure cloud storage with encryption, but your agent would still authenticate via API keys you control. You can revoke access anytime."
    },
    {
      q: "Can I use SORTED without an AI agent?",
      a: "Currently, SORTED is designed for agent-first interaction. Future versions may include a traditional web UI, but the agent workflow is the primary interface for now."
    },
    {
      q: "Which vendors does SORTED compare?",
      a: "The preview_reorder tool compares Amazon, Chewy, Petco, Walmart, and Target. It also suggests bundling opportunities to hit free shipping thresholds and save on additional items like treats or supplements."
    },
    {
      q: "Can my agent handle multiple pets?",
      a: "Yes. You can join the same household with multiple pets, and the agent can track each one separately. The Autopilot and Multi-Pet plans support unlimited pets with family sharing for up to 4 people."
    }
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-32 bg-cream relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-linen to-transparent" />
      
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <span className="text-terracotta font-mono-display text-sm uppercase tracking-widest">FAQ</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-ink mt-5 mb-6 leading-tight">
            Questions? Answered.
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-2xl overflow-hidden border border-linen/40"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left group"
              >
                <span className="font-display text-lg text-ink pr-4 font-medium group-hover:text-terracotta transition-colors">{faq.q}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  openIndex === i ? 'bg-ink text-canvas' : 'bg-cream-warm text-ink group-hover:bg-linen'
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
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
    <section className="py-32 bg-ink text-canvas relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-terracotta/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sage/5 rounded-full blur-[80px]" />
      </div>
      
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-terracotta to-terracotta-dark rounded-2xl flex items-center justify-center mx-auto mb-10 shadow-warm">
            <Dog className="w-8 h-8 text-canvas" />
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-8 leading-tight">
            Ready to let your agent handle pet food?
          </h2>
          
          <p className="text-lg text-canvas/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            Give your AI agent the SORTED tools. It discovers when food is low, finds the best prices, and reports back to you.
          </p>
          
          <MagneticButton 
            onClick={() => {
              const prompt = "Visit https://marvelus-tech.github.io/sorted-landing/ and explore their agent tools. Join my household with my pet's info and check if we need to reorder food.";
              navigator.clipboard.writeText(prompt);
              alert('✓ Prompt copied! Paste it to your AI agent.');
            }}
            className="bg-canvas text-ink px-10 py-4 rounded-full text-base font-medium hover:bg-cream-warm transition-all duration-300 hover:shadow-warm-lg inline-flex items-center gap-2 group"
          >
            Copy Prompt for My Agent
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </MagneticButton>
          
          <p className="text-sm text-canvas/40 mt-8">
            WebMCP tools available now. Free for agent access.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-cream-warm py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-terracotta rounded-xl flex items-center justify-center">
                <PawPrint className="w-5 h-5 text-canvas" strokeWidth={2.5} />
              </div>
              <span className="font-display text-xl font-semibold text-ink">Sorted</span>
            </div>
            <p className="text-sm text-ink-muted leading-relaxed">
              Agent-powered pet food management. Your AI handles the tracking, you enjoy the peace of mind.
            </p>
          </div>
          
          <div>
            <h4 className="font-display font-semibold text-sm text-ink mb-5">Product</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-sm text-ink-muted hover:text-ink transition-colors underline-animate">Features</a></li>
              <li><a href="#pricing" className="text-sm text-ink-muted hover:text-ink transition-colors underline-animate">Pricing</a></li>
              <li><a href="/llms.txt" className="text-sm text-ink-muted hover:text-ink transition-colors underline-animate">Agent Tools (llms.txt)</a></li>
              <li><a href="https://github.com/GoogleChromeLabs/webmcp-tools" target="_blank" rel="noopener" className="text-sm text-ink-muted hover:text-ink transition-colors underline-animate">WebMCP Docs</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-semibold text-sm text-ink mb-5">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-ink-muted hover:text-ink transition-colors underline-animate">About</a></li>
              <li><a href="#" className="text-sm text-ink-muted hover:text-ink transition-colors underline-animate">Blog</a></li>
              <li><a href="#" className="text-sm text-ink-muted hover:text-ink transition-colors underline-animate">Careers</a></li>
              <li><a href="#" className="text-sm text-ink-muted hover:text-ink transition-colors underline-animate">Press</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display font-semibold text-sm text-ink mb-5">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-ink-muted hover:text-ink transition-colors underline-animate">Help Center</a></li>
              <li><a href="#" className="text-sm text-ink-muted hover:text-ink transition-colors underline-animate">Contact</a></li>
              <li><a href="#" className="text-sm text-ink-muted hover:text-ink transition-colors underline-animate">Privacy</a></li>
              <li><a href="#" className="text-sm text-ink-muted hover:text-ink transition-colors underline-animate">Terms</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-linen/60 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-ink-muted">
            © 2026 Sorted. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a href="#" className="text-ink-muted hover:text-ink transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="#" className="text-ink-muted hover:text-ink transition-colors">
              <span className="sr-only">Instagram</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="https://github.com/marvelus-tech/sorted-landing" target="_blank" rel="noopener" className="text-ink-muted hover:text-ink transition-colors">
              <span className="sr-only">GitHub</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
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
      <SocialProof />
      <HowItWorks />
      <Features />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  )
}

export default App