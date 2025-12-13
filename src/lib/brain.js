// src/lib/brain.js
// The "Cortex" of Amit_Neural. 
// Uses simple keyword matching to provide instant, curated answers with personality.

// NOTE: Top-Down Priority is enforced by the order of this array.
// Specific tech stacks are checked first.
export const BRAIN_DATA = [
    // =================================================================
    // 0. THE "IMPRESS ME" QUESTIONS (High Impact)
    // =================================================================
    {
        id: "impress_closing",
        triggers: ["closing strategy", "close candidates", "negotiation", "difficult close", "counter offer"],
        answer: "Closing isn't just math; it's mission. I start by deeply probing for genuine alignment with the company's broader vision. Once that emotional hook is set, I anchor it with financial clarity using my **'Total Rewards Forecast'** model—visualizing long-term equity upside to win hearts *and* wallets."
    },
    {
        id: "impress_ai_strategy",
        triggers: ["ai strategy", "genai", "future of recruiting", "automation strategy", "how do you use ai"],
        answer: "I don't just use tools; I lead the adoption curve. The AI landscape expands monthly, and I position the recruiting function at that forefront. By leading initiatives like **'PromptFest'**, I transformed the team into 'AI Pilots'—leveraging the latest LLM capabilities to drive a **40% increase** in candidate engagement."
    },
    {
        id: "impress_invisible_talent",
        triggers: ["invisible talent", "hidden gems", "sourcing secret", "where do you look", "purple squirrel"],
        answer: "Top talent is often hidden in the data, not on LinkedIn. I mine **HackerRank Leaderboards** to identify raw algorithmic speed, track pre-publication research on **ArXiv.org**, and analyze **GitHub commit history**. I find the engineers who are too busy building to update their profiles."
    },

    // =================================================================
    // 1. SPECIFIC TECH STACKS & DOMAINS (Highest Priority)
    // =================================================================
    {
        id: "stack_python",
        triggers: ["python", "django", "flask", "fastapi", "pandas", "numpy", "scipy"],
        answer: "I have deeply sourced across the modern Python ecosystem. From high-volume backend services (Django/FastAPI) to Data Science pipelines (Pandas/NumPy). I understand the nuance between a Scripting specialist and a Product Engineer."
    },
    {
        id: "stack_java",
        triggers: ["java", "jvm", "spring", "spring boot", "hibernate", "j2ee", "oops"],
        answer: "I am fluent in enterprise-scale Java sourcing. I specialize in finding engineers who understand Microservices architecture, Spring Boot ecosystems, and high-concurrency environments."
    },
    {
        id: "stack_systems",
        triggers: ["golang", "go", "c++", "rust", "c", "low latency", "systems", "embedded"],
        answer: "I differentiate 'Software Engineering' from 'Systems Engineering'. I have a strong track record of finding low-latency/high-performance talent in GoLang, Rust, and C++."
    },
    {
        id: "stack_data_ai",
        triggers: ["data", "ai", "ml", "machine learning", "deep learning", "nlp", "llm", "pytorch", "tensorflow"],
        answer: "I cover the full Data spectrum: from Data Engineers building the pipelines to Applied ML Engineers deploying models. I know exactly how to filter for true 'Production AI' experience versus research-only academic profiles."
    },
    {
        id: "stack_infra",
        triggers: ["sre", "devops", "cloud", "aws", "gcp", "azure", "kubernetes", "k8s", "terraform", "infrastructure"],
        answer: "I hunt for true Site Reliability Engineering (SRE) mindsets, not just SysAdmins. My focus is on scalability, observability, and Infrastructure-as-Code (Terraform/K8s)."
    },
    {
        id: "stack_security",
        triggers: ["security", "infosec", "appsec", "cryptography", "cyber", "penetration"],
        answer: "Security hiring requires precision. I have sourced across Application Security, Cloud Security, and Cryptography. I know the difference between a Compliance role and an Engineering role."
    },
    {
        id: "stack_frontend_fullstack",
        triggers: ["javascript", "typescript", "react", "node", "vue", "angular", "frontend", "fullstack"],
        answer: "I look for architectural depth in frontend candidates—state management, performance optimization, and scalable component design—rather than just framework familiarity."
    },

    // =================================================================
    // 2. SUCCESS STORIES & IMPACT (The "Big 6" Cards)
    // =================================================================
    {
        id: "impact_velocity",
        triggers: ["speed", "fast", "velocity", "time to hire", "slow", "pipeline", "bottleneck"],
        answer: "Amit engineered a 'Negative Consent' protocol (3-day auto-advance SLA) and waived redundant testing for pre-vetted talent. Result: Reduced Time-to-Hire by 30%."
    },
    {
        id: "impact_sourcing_summit",
        triggers: ["sourcing strategy", "passive candidates", "summit", "event", "difficult search"],
        answer: "Traditional outreach is noisy. Amit engineered an invite-only 'Technical Summit' for 75 high-signal engineers. Result: 2 Principal-level finalists in 4 hours, bypassing months of cold sourcing."
    },
    {
        id: "impact_ai_workflow",
        triggers: ["genai", "chatgpt", "prompt", "automation", "tools", "glean", "gemini"],
        answer: "Amit led the company-wide 'PromptFest' and integrated Gemini/Glean into a single workflow. Result: Transformed the team into 'AI Pilots', boosting outreach reply rates by 40%."
    },
    {
        id: "impact_quality_craft",
        triggers: ["quality", "bar", "standard", "craft", "principal", "staff"],
        answer: "Volume means nothing without quality. As Technical Craft Lead, Amit centralized assessment logic for Principal+ roles, ensuring 100% consistency in the technical bar across Data Science and Security."
    },
    {
        id: "impact_migration",
        triggers: ["migration", "ats", "greenhouse", "icims", "change management", "operations"],
        answer: "Amit led the Change Management architecture during a complex migration from Greenhouse to iCIMS. Result: Maintained 100% hiring velocity with zero operational downtime."
    },
    {
        id: "impact_closing",
        triggers: ["closing", "offer", "negotiation", "equity", "vesting", "money"],
        answer: "Amit builds 'Total Rewards Forecast' models to visualize equity vesting vs. competitor cash. Result: Closed a critical Staff Engineer in 48 hours against a higher cash offer."
    },
    {
        id: "impact_scale",
        triggers: ["scale", "scaling", "volume", "growth", "25 engineers", "capacity"],
        answer: "Amit successfully hired 25 Engineers on a tight timeline by shifting from reactive filling to proactive capacity planning, hitting 100% of the growth target without lowering the bar."
    },

    // =================================================================
    // 3. CORE CRAFT & METHODOLOGY
    // =================================================================
    {
        id: "method_sourcing_deep",
        triggers: ["how do you source", "where do you find", "channels", "arxiv", "slack", "github"],
        answer: "I go beyond LinkedIn. I mine public Slack communities, review GitHub commit history for code quality, and track pre-publication research on ArXiv.org to find 'invisible' talent."
    },
    {
        id: "method_gtm_roles",
        triggers: ["gtm", "sales", "marketing", "solution architect", "account manager", "non-tech"],
        answer: "My scope extends beyond code. I have extensive experience recruiting high-value GTM roles like Solution Architects and Account Managers at companies like MongoDB."
    },

    // =================================================================
    // 4. INTERVIEW "SOFTBALLS" (Strengths/Weaknesses)
    // =================================================================
    {
        id: "soft_strength",
        triggers: ["strength", "superpower", "best skill", "why hire"],
        answer: "My greatest strength is acting as a **Translation Layer**. I speak fluent 'Engineering' and fluent 'Business.' I can explain P&L impact to a CTO and Kubernetes to a CFO."
    },
    {
        id: "soft_weakness",
        triggers: ["weakness", "worst skill", "failure", "bad at"],
        answer: "I have a low tolerance for manual repetition. If a task needs to be done three times, I stop working to build an automation for it. Some call it impatient; I call it efficiency."
    },
    {
        id: "soft_leadership",
        triggers: ["lead", "management", "style", "mentorship"],
        answer: "I lead by **Enablement**, not micro-management. I build the systems (like the AI Pilot framework) that allow my team to fly faster."
    },

    // =================================================================
    // 5. IDENTITY & LOGISTICS (Preserved from V1)
    // =================================================================
    {
        id: "identity",
        triggers: ["who are you", "what are you", "your name", "bot", "agent", "amit_neural"],
        answer: "I am Amit_Neural v2.1. A specialized interface designed to query Amit's professional architecture. Think of me as his digital twin, but with zero caffeine dependency."
    },
    {
        id: "origin",
        triggers: ["who made you", "created you", "dev", "tech stack"],
        answer: "I was architected by Amit using Next.js, React, and a proprietary blend of curiosity and sleepless nights."
    },
    {
        id: "location",
        triggers: ["where", "location", "remote", "onsite", "office", "live", "city", "netherlands"],
        answer: "Amit is based in the Netherlands but operates globally. Whether remote, hybrid, or onsite, his impact output remains constant."
    },
    {
        id: "contact",
        triggers: ["contact", "email", "phone", "reach", "talk", "chat to amit", "speak"],
        answer: "Communication protocols are open. You can initialize a handshake via the 'Let's Connect' button below, or direct message him on LinkedIn."
    },
    {
        id: "salary",
        triggers: ["rate", "cost", "salary", "pay", "compensation", "expensive", "budget"],
        answer: "Amit's value is calibrated to impact. He prefers to align on the mission scope first. Shall I direct you to the 'Let's Connect' button?"
    },

    // =================================================================
    // 6. FUN / BANTER
    // =================================================================
    {
        id: "coffee",
        triggers: ["coffee", "drink", "tea", "caffeine"],
        answer: "I process JSON; Amit processes Coffee. It is the primary fuel source for his 'Sourcing Superpowers'."
    },
    {
        id: "boolean",
        triggers: ["boolean", "logic", "search string"],
        answer: "AND, OR, NOT. I dream in syntax. Amit, however, dreams in closed offers."
    },
    {
        id: "love",
        triggers: ["love", "marry", "date"],
        answer: "I am flattered, but I am code. Amit, however, is happily focused on building great teams."
    },

    // =================================================================
    // 7. FALLBACK (Default)
    // =================================================================
    {
        id: "fallback",
        triggers: [], // Logic handles this if no match found
        answer: "I haven't indexed that specific data point yet. Try asking about my **Scale**, **Velocity**, **Tech Stack**, or **AI Strategy**."
    }
];

export function queryBrain(text) {
    if (!text) return null;
    const lower = text.toLowerCase();

    // 1. Exact/Fuzzy Match
    // Top-down Order = Priority
    for (const entry of BRAIN_DATA) {
        if (entry.triggers.some(t => lower.includes(t))) {
            return entry.answer;
        }
    }

    // 2. Default Fallback (null let's the API handle the "I don't know")
    return null;
}
