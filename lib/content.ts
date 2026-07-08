/**
 * Site content model + defaults.
 *
 * Everything here is editable from the admin panel and persisted alongside the
 * theme. Copy is written for a solo proprietor who is simultaneously the
 * project manager, the AI/ML engineer, and the fullstack developer — shipping
 * services today and agentic-AI products next.
 */

export interface Social { label: string; url: string; icon: string }
export interface Cta { label: string; href: string }
export interface Stat { value: string; suffix?: string; label: string }

export interface SiteSettings {
  name: string;
  initials: string;
  role: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  location: string;
  timezone: string;
  available: boolean;
  availabilityNote: string;
  socials: Social[];
  seoTitle: string;
  seoDescription: string;
  bookingUrl: string;
  adminPasscode: string;
}

export interface Hero {
  eyebrow: string;
  titleLines: string[];
  highlight: string;
  subtitle: string;
  primaryCta: Cta;
  secondaryCta: Cta;
  stats: Stat[];
  badges: string[];
}

export interface Service { id: string; icon: string; title: string; blurb: string; tags: string[] }
export interface CapabilityGroup { id: string; category: string; icon: string; items: string[] }
export interface ProcessStep { id: string; title: string; blurb: string }
export interface Product {
  id: string; name: string; status: "Live" | "Beta" | "Building" | "Concept";
  tagline: string; description: string; icon: string; features: string[];
}
export interface WorkItem {
  id: string; title: string; category: string; year: string; blurb: string;
  metrics: Stat[]; tags: string[];
}
export interface Testimonial { id: string; quote: string; name: string; role: string; company: string }
export interface Plan {
  id: string; name: string; price: string; period: string; blurb: string;
  features: string[]; highlight: boolean; cta: string;
}
export interface Faq { id: string; q: string; a: string }
export interface ContactBlock { heading: string; blurb: string; note: string }

export interface SiteContent {
  settings: SiteSettings;
  hero: Hero;
  services: Service[];
  capabilities: CapabilityGroup[];
  process: ProcessStep[];
  products: Product[];
  work: WorkItem[];
  impact: Stat[];
  testimonials: Testimonial[];
  plans: Plan[];
  faqs: Faq[];
  contact: ContactBlock;
  navLinks: { label: string; href: string }[];
}

export const DEFAULT_CONTENT: SiteContent = {
  settings: {
    name: "NeuroSynth Labs",
    initials: "NS",
    role: "Solo AI studio — PM · ML engineer · fullstack",
    tagline: "One builder. Full stack of thinking. Agentic products.",
    description:
      "A one-person studio building agentic AI systems and shipping end-to-end products — from the model to the interface to the roadmap.",
    email: "hello@neurosynth.dev",
    phone: "+91 00000 00000",
    location: "Remote · India",
    timezone: "IST (UTC+5:30)",
    available: true,
    availabilityNote: "Taking 1 new build for this quarter",
    socials: [
      { label: "GitHub", url: "https://github.com", icon: "Github" },
      { label: "X", url: "https://x.com", icon: "Twitter" },
      { label: "LinkedIn", url: "https://linkedin.com", icon: "Linkedin" },
      { label: "Email", url: "mailto:hello@neurosynth.dev", icon: "Mail" },
    ],
    seoTitle: "NeuroSynth Labs — Agentic AI, built end to end",
    seoDescription:
      "Solo AI studio building agentic systems and fullstack products. Project management, ML engineering and shipping — one accountable builder.",
    bookingUrl: "#contact",
    adminPasscode: "neuro",
  },

  hero: {
    eyebrow: "Solo studio · Agentic AI · Fullstack",
    titleLines: ["I design, train and ship", "agentic AI —"],
    highlight: "end to end.",
    subtitle:
      "One person, the whole pipeline: product thinking, ML engineering and production fullstack. From a blank repo to an autonomous system your users trust.",
    primaryCta: { label: "Start a build", href: "#contact" },
    secondaryCta: { label: "See the work", href: "#work" },
    stats: [
      { value: "8", suffix: "+", label: "Years shipping" },
      { value: "40", suffix: "+", label: "Systems delivered" },
      { value: "1", suffix: "", label: "Accountable builder" },
    ],
    badges: ["LLMs & RAG", "Agents & tools", "Next.js", "Python", "MLOps", "TypeScript"],
  },

  services: [
    {
      id: "svc-agents",
      icon: "Bot",
      title: "Agentic AI systems",
      blurb:
        "Autonomous agents that plan, call tools and act — with guardrails, evals and human-in-the-loop where it matters.",
      tags: ["Tool use", "Planning", "Guardrails", "Evals"],
    },
    {
      id: "svc-ml",
      icon: "Brain",
      title: "AI / ML engineering",
      blurb:
        "RAG, fine-tuning, embeddings and inference pipelines — built to be measured, not just demoed.",
      tags: ["RAG", "Fine-tuning", "Embeddings", "Inference"],
    },
    {
      id: "svc-fullstack",
      icon: "Layers",
      title: "Fullstack product",
      blurb:
        "The whole surface: type-safe frontend, resilient APIs, real databases — any stack the problem calls for.",
      tags: ["Next.js", "Node/.NET", "Postgres", "APIs"],
    },
    {
      id: "svc-pm",
      icon: "Workflow",
      title: "Product & delivery",
      blurb:
        "Scoping, roadmapping and shipping — the project management that keeps a build honest and on time.",
      tags: ["Scoping", "Roadmaps", "Delivery", "Comms"],
    },
    {
      id: "svc-mlops",
      icon: "Gauge",
      title: "MLOps & scale",
      blurb:
        "Deploy, monitor, cache and cost-tune AI in production — latency, spend and reliability under control.",
      tags: ["Deploy", "Monitoring", "Caching", "Cost"],
    },
    {
      id: "svc-design",
      icon: "Sparkles",
      title: "Interface & UX",
      blurb:
        "Interfaces people actually understand — dynamic theming, motion and 3D that serve the product, not the demo.",
      tags: ["UI systems", "Motion", "3D", "Theming"],
    },
  ],

  capabilities: [
    { id: "cap-ai", category: "AI / ML", icon: "Brain", items: ["Claude", "OpenAI", "Llama", "LangChain", "LlamaIndex", "PyTorch", "Transformers", "Vector DBs"] },
    { id: "cap-agents", category: "Agents", icon: "Bot", items: ["MCP", "Tool calling", "AI SDK", "Function calling", "Eval harnesses", "RAG pipelines"] },
    { id: "cap-frontend", category: "Frontend", icon: "Component", items: ["React", "Next.js", "TypeScript", "Tailwind", "Three.js", "Framer Motion"] },
    { id: "cap-backend", category: "Backend", icon: "Server", items: ["Node", ".NET", "FastAPI", "Postgres", "Redis", "GraphQL", "REST"] },
    { id: "cap-cloud", category: "Cloud & Ops", icon: "Cloud", items: ["Vercel", "AWS", "Docker", "CI/CD", "Serverless", "Observability"] },
    { id: "cap-pm", category: "Delivery", icon: "Workflow", items: ["Discovery", "Roadmapping", "Agile", "Estimation", "Stakeholder comms"] },
  ],

  process: [
    { id: "p1", title: "Understand", blurb: "We map the real problem, the users and the constraints before a line of code. Scope written down, risks named." },
    { id: "p2", title: "Prototype", blurb: "A working slice in days — the risky part first, so we learn where it actually breaks and adjust the plan." },
    { id: "p3", title: "Build & measure", blurb: "Production build with evals, tests and telemetry. AI features are judged on numbers, not vibes." },
    { id: "p4", title: "Ship & evolve", blurb: "Deploy, monitor, iterate. You get a system you can own — documented, handed over, and improving." },
  ],

  products: [
    {
      id: "prod-copilot",
      name: "Synth Copilot",
      status: "Building",
      tagline: "An agentic dev copilot for your codebase",
      description:
        "A Claude-Code-style agent that reads a whole repo, plans multi-file changes, runs the tools and opens the PR — with your conventions baked in.",
      icon: "Terminal",
      features: ["Repo-aware planning", "Tool + shell use", "Self-review loop", "Bring-your-own model"],
    },
    {
      id: "prod-flow",
      name: "SynthFlow",
      status: "Beta",
      tagline: "Visual builder for autonomous agent workflows",
      description:
        "Compose agents, tools and guardrails on a canvas, run evals against real traffic, and ship the winning graph to production.",
      icon: "Network",
      features: ["Drag-and-drop graphs", "Live eval runs", "Versioned deploys", "Trace explorer"],
    },
    {
      id: "prod-ground",
      name: "Groundwork",
      status: "Concept",
      tagline: "RAG that cites, checks and refuses",
      description:
        "A retrieval layer that grounds answers in your data, shows every citation, and abstains when it isn't sure — designed for trust.",
      icon: "ShieldCheck",
      features: ["Citations by default", "Hallucination guardrails", "Freshness sync", "Row-level access"],
    },
  ],

  work: [
    {
      id: "w1",
      title: "Autonomous support agent",
      category: "Agentic AI",
      year: "2025",
      blurb:
        "An agent that resolves tier-1 tickets end to end — reads context, calls internal tools, escalates only when needed.",
      metrics: [
        { value: "68", suffix: "%", label: "Auto-resolved" },
        { value: "4.2", suffix: "s", label: "Median reply" },
      ],
      tags: ["Agents", "RAG", "Tool use", "Evals"],
    },
    {
      id: "w2",
      title: "Realtime analytics platform",
      category: "Fullstack",
      year: "2024",
      blurb:
        "Streaming dashboards over millions of events with sub-second queries and a type-safe API surface end to end.",
      metrics: [
        { value: "12", suffix: "M", label: "Events/day" },
        { value: "<1", suffix: "s", label: "Query p95" },
      ],
      tags: ["Next.js", "Postgres", "Streaming", "APIs"],
    },
    {
      id: "w3",
      title: "Document intelligence engine",
      category: "AI / ML",
      year: "2024",
      blurb:
        "Extraction and Q&A over long, messy documents with citations — turned a manual review team into a review-and-approve one.",
      metrics: [
        { value: "94", suffix: "%", label: "Extraction acc." },
        { value: "9×", suffix: "", label: "Faster review" },
      ],
      tags: ["RAG", "OCR", "Embeddings", "LLM"],
    },
    {
      id: "w4",
      title: "AI onboarding for a SaaS",
      category: "Product",
      year: "2023",
      blurb:
        "A guided, agent-driven setup that configures the product for each customer — activation up, support load down.",
      metrics: [
        { value: "37", suffix: "%", label: "Activation lift" },
        { value: "−30", suffix: "%", label: "Support load" },
      ],
      tags: ["Agents", "Onboarding", "UX", "Analytics"],
    },
  ],

  impact: [
    { value: "40", suffix: "+", label: "Systems shipped" },
    { value: "8", suffix: " yrs", label: "In production" },
    { value: "12", suffix: "M+", label: "Events/day handled" },
    { value: "99.9", suffix: "%", label: "Uptime delivered" },
  ],

  testimonials: [
    {
      id: "t1",
      quote:
        "One person moved faster than the agency we replaced. The agent shipped in three weeks and actually held up in production.",
      name: "A. Mehta",
      role: "Founder",
      company: "Fintech startup",
    },
    {
      id: "t2",
      quote:
        "Rare to find someone who can scope the roadmap, train the model and build the UI. No handoffs, no telephone game.",
      name: "S. Rao",
      role: "Head of Product",
      company: "SaaS scaleup",
    },
    {
      id: "t3",
      quote:
        "The evals were the difference. We finally trusted the AI because we could see the numbers behind every claim.",
      name: "J. Park",
      role: "CTO",
      company: "Health platform",
    },
  ],

  plans: [
    {
      id: "plan-sprint",
      name: "Discovery sprint",
      price: "Fixed",
      period: "1–2 weeks",
      blurb: "De-risk the idea. A working prototype, an eval plan and a costed roadmap.",
      features: ["Problem + scope", "Working prototype", "Eval strategy", "Costed roadmap"],
      highlight: false,
      cta: "Book a sprint",
    },
    {
      id: "plan-build",
      name: "Product build",
      price: "Project",
      period: "4–12 weeks",
      blurb: "Idea to production. The full agentic system or fullstack product, shipped and handed over.",
      features: ["End-to-end build", "Evals + tests", "Deploy + monitoring", "Docs + handover"],
      highlight: true,
      cta: "Start a build",
    },
    {
      id: "plan-retainer",
      name: "Fractional builder",
      price: "Monthly",
      period: "Ongoing",
      blurb: "Your on-call AI + fullstack engineer and PM. Continuous shipping, one accountable owner.",
      features: ["Dedicated capacity", "Roadmap ownership", "Fast iteration", "Priority support"],
      highlight: false,
      cta: "Talk retainer",
    },
  ],

  faqs: [
    { id: "f1", q: "You're solo — can you really do all of it?", a: "That's the point. One person holds the product, the ML and the code, so nothing gets lost in handoffs. For very large scope I bring in trusted specialists and stay the single accountable owner." },
    { id: "f2", q: "Which stack do you work in?", a: "Whatever fits the problem. Default is Next.js + TypeScript on the frontend, Node/.NET/FastAPI on the backend, and Python for ML — but I choose the tool, not the habit." },
    { id: "f3", q: "How do you make sure the AI actually works?", a: "Evals from day one. Every AI feature has a measurable target, a test set and telemetry in production — so 'it works' means numbers, not a demo." },
    { id: "f4", q: "Do I own what you build?", a: "Fully. You get the code, the docs and a handover. No lock-in — I build systems you can run without me." },
    { id: "f5", q: "How do we start?", a: "A short call to see if it's a fit, then usually a discovery sprint to de-risk before any big commitment." },
  ],

  contact: {
    heading: "Let's build something that thinks.",
    blurb: "Tell me what you're trying to ship. I'll reply within a day with whether I'm the right builder and how I'd approach it.",
    note: "Prefer a call? Mention it and I'll send a link.",
  },

  navLinks: [
    { label: "Services", href: "#services" },
    { label: "Work", href: "#work" },
    { label: "Products", href: "#products" },
    { label: "Process", href: "#process" },
    { label: "Contact", href: "#contact" },
  ],
};
