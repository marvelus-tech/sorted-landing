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
          <button className="text-sm font-medium text-ink-muted hover:text-ink transition-colors">Sign in</button>
          <MagneticButton className="bg-ink text-canvas px-6 py-2.5 rounded-full text-sm font-medium hover:bg-ink-soft transition-all duration-300 hover:shadow-warm">
            Get Started
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
              <button className="bg-ink text-canvas px-6 py-3 rounded-full text-sm font-medium w-full mt-2">
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
            Never run out of kibble again. SORTED predicts what your pet needs, 
            finds the best price, and orders it — all through a simple message.
          </motion.p>
          
          <motion.div variants={fadeInUp} custom={3} className="flex flex-col sm:flex-row gap-4">
            <MagneticButton className="bg-ink text-canvas px-8 py-4 rounded-full text-base font-medium hover:bg-ink-soft transition-all duration-300 hover:shadow-warm-lg flex items-center justify-center gap-2 group">
              Start Free on Telegram
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
          {/* Main chat card */}
          <div className="relative bg-white rounded-[2rem] shadow-warm-lg p-6 md:p-8 border border-linen/50">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-linen/60">
              <div className="w-12 h-12 bg-gradient-to-br from-terracotta to-terracotta-dark rounded-2xl flex items-center justify-center shadow-warm">
                <Dog className="w-6 h-6 text-canvas" />
              </div>
              <div>
                <p className="font-display font-semibold text-lg text-ink">Sorted Agent</p>
                <p className="text-xs text-ink-muted flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-sage rounded-full animate-pulse" />
                  Always online
                </p>
              </div>
              <div className="ml-auto flex gap-1">
                <div className="w-2 h-2 bg-sage rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-sage/50 rounded-full animate-pulse delay-75" />
                <div className="w-2 h-2 bg-sage/25 rounded-full animate-pulse delay-150" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-cream rounded-2xl rounded-tl-sm p-5 max-w-[85%]">
                <p className="text-sm text-ink leading-relaxed">Hey! Max's kibble is running low — about 4 days left. Want me to handle it?</p>
              </div>
              
              <div className="bg-terracotta/8 rounded-2xl rounded-tr-sm p-5 max-w-[85%] ml-auto">
                <p className="text-sm text-ink leading-relaxed">Yes please! Same as last time?</p>
              </div>
              
              <div className="bg-cream rounded-2xl rounded-tl-sm p-5 max-w-[90%]">
                <p className="text-sm text-ink mb-4 font-medium">Found the best deal:</p>
                <div className="bg-white rounded-xl p-4 mb-3 border border-linen/60 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-ink">Blue Buffalo Adult Chicken</span>
                    <span className="text-sm font-semibold text-terracotta">$42.99</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-ink-muted">
                    <span>Amazon Prime • Arrives Thursday</span>
                    <span className="line-through text-ink-faint">$48.99</span>
                  </div>
                </div>
                <p className="text-xs text-ink-muted">Also bundled: Dental chews (save $5.99 on shipping)</p>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button className="flex-1 bg-ink text-canvas py-3.5 rounded-xl text-sm font-medium hover:bg-ink-soft transition-colors">
                  ✓ Approve
                </button>
                <button className="flex-1 bg-cream-warm text-ink py-3.5 rounded-xl text-sm font-medium hover:bg-linen transition-colors">
                  ✎ Modify
                </button>
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
    { value: 5000, suffix: "+", label: "Happy pet parents" },
    { value: 12000, suffix: "+", label: "Pets fed" },
    { value: 98, suffix: "%", label: "Satisfaction rate" },
    { value: 2.5, suffix: "M", label: "Saved on pet food" }
  ]

  const testimonials = [
    {
      name: "Sarah M.",
      pet: "Golden Retriever, Max",
      text: "I used to stress about running out of food. Now I just get a message, tap approve, and it arrives. It's like magic.",
      rating: 5
    },
    {
      name: "James K.",
      pet: "Tabby Cat, Luna",
      text: "Saved $47 in the first month alone. The bundling feature is genius — Luna gets her food, I get her treats, free shipping.",
      rating: 5
    },
    {
      name: "The Chen Family",
      pet: "3 Dogs, 2 Cats",
      text: "We have 5 pets. SORTED handles all of them. The family sharing means my wife and I both get notifications.",
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
            No apps to download. No passwords to remember. Just Telegram — the app you already use.
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
      description: "We check Amazon, Chewy, Petco, and local retailers to find the best price on your pet's exact food — every single order."
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
            Ready to never worry about pet food again?
          </h2>
          
          <p className="text-lg text-canvas/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join 5,000+ pet parents who've sorted their pet's life. 
            Start free on Telegram — no credit card required.
          </p>
          
          <MagneticButton className="bg-canvas text-ink px-10 py-4 rounded-full text-base font-medium hover:bg-cream-warm transition-all duration-300 hover:shadow-warm-lg inline-flex items-center gap-2 group">
            Start on Telegram
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </MagneticButton>
          
          <p className="text-sm text-canvas/40 mt-8">
            Free forever plan available. Upgrade to Autopilot anytime.
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
              Your pet's life, sorted. AI-powered food management for modern pet parents.
            </p>
          </div>
          
          <div>
            <h4 className="font-display font-semibold text-sm text-ink mb-5">Product</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-sm text-ink-muted hover:text-ink transition-colors underline-animate">Features</a></li>
              <li><a href="#pricing" className="text-sm text-ink-muted hover:text-ink transition-colors underline-animate">Pricing</a></li>
              <li><a href="#" className="text-sm text-ink-muted hover:text-ink transition-colors underline-animate">Telegram Bot</a></li>
              <li><a href="#" className="text-sm text-ink-muted hover:text-ink transition-colors underline-animate">API</a></li>
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