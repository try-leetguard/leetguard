export const applyUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

export type JobPosting = {
  title: string;
  team: string;
  location: string;
  mode: string;
  eyebrow: string;
  headline: string;
  summary: string;
  intro: string;
  sections: ReadonlyArray<{
    title: string;
    paragraphs?: ReadonlyArray<string>;
    bullets?: ReadonlyArray<string>;
  }>;
  ownership: ReadonlyArray<string>;
  signals: ReadonlyArray<string>;
  notThis: ReadonlyArray<string>;
};

export const jobs = {
  backendEngineer: {
    title: "Backend Engineer",
    team: "Engineering",
    location: "United States",
    mode: "Remote",
    eyebrow: "systems that do not blink",
    headline: "Make the focus rules stay true.",
    summary:
      "Own the FastAPI, PostgreSQL, auth, and data integrity layer behind LeetGuard's daily unlock loop.",
    intro:
      "The backend role is about trust. If a user solves one problem, the system should know it, remember it, and unlock the day without drama. You would care about the boring parts because the boring parts are where product confidence lives.",
    sections: [
      {
        title: "Role Summary",
        paragraphs: [
          "LeetGuard's backend supports a simple promise: when a user earns progress, the product should recognize it consistently across the dashboard, extension, and blocking flow.",
          "In this role, you would work on the API, database schema, migrations, authentication boundaries, and the data contracts that keep the focus loop reliable. The work is not flashy, but it is foundational: progress must be accurate, duplicate state must be prevented, and failure modes should be understandable.",
        ],
      },
      {
        title: "Core Responsibilities",
        bullets: [
          "Design and maintain API behavior for blocklists, activity history, daily goals, user settings, and unlock state.",
          "Own database integrity through constraints, migrations, normalized inputs, and deterministic cleanup paths.",
          "Build tests around edge cases such as duplicate submissions, legacy status values, stale auth, and retried extension calls.",
          "Partner with frontend and extension work so product behavior is consistent across every surface.",
        ],
      },
      {
        title: "Ideal Background",
        bullets: [
          "Experience building production APIs with Python, FastAPI, or similar backend frameworks.",
          "Comfort with PostgreSQL, SQLAlchemy, Alembic, and the discipline required to evolve a schema safely.",
          "A strong instinct for idempotency, validation, normalization, and clear backend contracts.",
          "A careful approach to using AI: fast exploration, followed by verification, tests, and human judgment.",
        ],
      },
      {
        title: "What You Get",
        bullets: [
          "Ownership of the systems that make the product feel trustworthy.",
          "A small-team environment where good backend decisions immediately shape user experience.",
          "A culture that treats quality, correctness, and thoughtful tradeoffs as product work.",
        ],
      },
    ],
    ownership: [
      "Design API behavior for blocklists, activity, goals, and user settings.",
      "Harden schema changes so fresh databases and migrated databases both behave.",
      "Write tests around the edge cases users will never thank us for preventing.",
      "Use AI for speed, then verify the consequences with senior-level suspicion.",
    ],
    signals: [
      "You can explain why a migration is safe before you run it.",
      "You think idempotency, normalization, and duplicate prevention are product features.",
      "You are comfortable moving between Python, SQLAlchemy, Alembic, and Postgres.",
      "You prefer clear contracts over clever backend magic.",
    ],
    notThis: [
      "A role for treating the API like a thin pass-through.",
      "A place to ship unreviewed AI output because tests happened to pass once.",
      "A job where data integrity can be fixed later.",
    ],
  },
  frontendEngineer: {
    title: "Frontend Engineer",
    team: "Engineering",
    location: "United States",
    mode: "Remote",
    eyebrow: "interfaces with taste",
    headline: "Make focus feel usable.",
    summary:
      "Build the Next.js surfaces, dashboard states, marketing pages, and browser-adjacent flows users actually touch.",
    intro:
      "The frontend role is where product taste becomes visible. LeetGuard needs pages that load cleanly, controls that feel obvious, and states that make the user's next move feel calm instead of confusing.",
    sections: [
      {
        title: "Role Summary",
        paragraphs: [
          "The frontend role owns the surfaces users actually feel: marketing pages, dashboard screens, progress states, settings, and the visual language around the browser extension loop.",
          "This is a role for someone who cares about clarity and polish in equal measure. The product should feel sharp without becoming loud, useful without becoming plain, and fast without hiding unfinished UI behind motion.",
        ],
      },
      {
        title: "Core Responsibilities",
        bullets: [
          "Build and refine Next.js pages, React components, dashboard views, and marketing surfaces.",
          "Create responsive layouts that hold up across desktop, mobile, loading states, and empty states.",
          "Improve perceived performance through optimized assets, stable dimensions, and intentional progressive loading.",
          "Collaborate with product and backend work so user-facing states match the underlying source of truth.",
        ],
      },
      {
        title: "Ideal Background",
        bullets: [
          "Strong experience with React, TypeScript, Next.js, and component-driven frontend development.",
          "A good eye for typography, spacing, hierarchy, and interface states.",
          "Comfort working with animation and motion only when it improves comprehension or polish.",
          "A practical understanding of frontend performance, static export constraints, and responsive QA.",
        ],
      },
      {
        title: "What You Get",
        bullets: [
          "A chance to define a young product's interface language across marketing and product surfaces.",
          "Room to use AI for speed while keeping taste, judgment, and final quality in human hands.",
          "Direct impact on whether LeetGuard feels like a serious tool or another forgettable extension.",
        ],
      },
    ],
    ownership: [
      "Build Next.js pages and components with stable layout, clean motion, and tight spacing.",
      "Use the design language consistently across marketing, dashboard, and extension-inspired surfaces.",
      "Keep performance sharp through image optimization, static export constraints, and careful animation.",
      "Turn rough product ideas into interfaces that feel like they were designed on purpose.",
    ],
    signals: [
      "You notice when text is two pixels too cramped and when a transition is doing too much.",
      "You can ship React and TypeScript without turning every component into a committee.",
      "You understand performance as user experience, not just a Lighthouse number.",
      "You can use AI to move faster while still keeping taste in the driver's seat.",
    ],
    notThis: [
      "A role for dumping components onto a page and calling it design.",
      "A place for one-note visual systems or flashy motion without product meaning.",
      "A job where mobile polish is someone else's problem.",
    ],
  },
  fullStackEngineer: {
    title: "Full-Stack Engineer",
    team: "Engineering",
    location: "United States",
    mode: "Remote",
    eyebrow: "the whole loop",
    headline: "Own the path from click to unlock.",
    summary:
      "Work across the extension, dashboard, API, and database so LeetGuard behaves like one coherent product.",
    intro:
      "This role is for someone who likes the whole system. A browser event becomes an API call, an API call becomes progress, progress becomes an unlock, and every layer has a chance to drift if nobody owns the contract.",
    sections: [
      {
        title: "Role Summary",
        paragraphs: [
          "The Full-Stack Engineer role owns the product loop end to end. A browser event becomes an API call, an API call updates progress, progress changes the dashboard and extension, and each layer has to agree.",
          "This role is intentionally broad. You would move across the Next.js app, FastAPI backend, PostgreSQL database, and extension-adjacent flows to make the product behave like one coherent system.",
        ],
      },
      {
        title: "Core Responsibilities",
        bullets: [
          "Build features across the dashboard, backend API, extension flow, and persistence layer.",
          "Debug issues through the entire stack instead of stopping at the first plausible explanation.",
          "Maintain shared contracts so frontend types, backend behavior, and extension events stay aligned.",
          "Improve product reliability around auth, progress sync, blocklist behavior, and deployment constraints.",
        ],
      },
      {
        title: "Ideal Background",
        bullets: [
          "Experience with React, TypeScript, Python APIs, relational databases, and browser behavior.",
          "A strong instinct for tracing product bugs across UI, network, backend, and data state.",
          "Comfort taking ambiguous product ideas and turning them into shipped, testable workflows.",
          "Judgment around when to move quickly and when to slow down because the contract matters.",
        ],
      },
      {
        title: "What You Get",
        bullets: [
          "Ownership over a complete product loop, not just isolated tickets.",
          "A high-leverage environment where technical decisions become visible user experience quickly.",
          "A culture that values systems thinking, clean implementation, and product taste together.",
        ],
      },
    ],
    ownership: [
      "Build features across Next.js, FastAPI, extension code, and Postgres.",
      "Trace bugs through the whole system instead of stopping at the first plausible cause.",
      "Keep legacy compatibility while tightening the product's source of truth.",
      "Use AI as leverage for exploration, then finish with human judgment and tests.",
    ],
    signals: [
      "You can debug a user-facing issue across browser APIs, network calls, and database state.",
      "You care about naming contracts because mismatched words become real bugs.",
      "You can move fast without treating production as the first integration test.",
      "You like product ownership as much as code ownership.",
    ],
    notThis: [
      "A role for living in only one layer.",
      "A place to hide behind abstractions when the product is broken.",
      "A job where 'works on my machine' counts as done.",
    ],
  },
  productDesigner: {
    title: "Product Designer",
    team: "Product",
    location: "United States",
    mode: "Remote",
    eyebrow: "taste with consequences",
    headline: "Design restraint that still feels sharp.",
    summary:
      "Shape the product language for focus: dashboard, extension moments, marketing pages, and the small states between them.",
    intro:
      "LeetGuard is not trying to look busy. The design challenge is sharper: make discipline feel clean, make blocking feel fair, and make progress feel earned without turning the app into a lecture.",
    sections: [
      {
        title: "Role Summary",
        paragraphs: [
          "The Product Designer role shapes how LeetGuard feels across the marketing site, dashboard, and extension moments. The challenge is to make discipline feel clean instead of punitive.",
          "You would work on flows, states, layout systems, copy moments, and the small interaction details that help a user understand what is blocked, what is earned, and what happens next.",
        ],
      },
      {
        title: "Core Responsibilities",
        bullets: [
          "Design product flows for blocklists, progress, unlocks, settings, onboarding, and extension handoffs.",
          "Define reusable patterns that keep LeetGuard visually consistent across marketing and product surfaces.",
          "Partner closely with engineering so implementation quality matches the design intent.",
          "Use motion, hierarchy, and restraint to make important states easy to understand.",
        ],
      },
      {
        title: "Ideal Background",
        bullets: [
          "Experience designing SaaS, productivity, developer tool, or browser-adjacent product surfaces.",
          "Strong visual taste with practical awareness of what can be implemented cleanly.",
          "Comfort moving from broad product thinking to tiny details like spacing, affordances, and state labels.",
          "A preference for thoughtful restraint over decoration for its own sake.",
        ],
      },
      {
        title: "What You Get",
        bullets: [
          "A chance to influence the product language before it hardens into legacy decisions.",
          "A team that treats design as product judgment, not surface cleanup.",
          "Space to use AI for exploration while keeping taste and responsibility with the designer.",
        ],
      },
    ],
    ownership: [
      "Design flows for blocklists, progress, unlocks, settings, and extension handoffs.",
      "Turn rough product principles into reusable visual patterns.",
      "Partner with engineering to make the implemented version as strong as the mockup.",
      "Use AI for exploration without outsourcing taste or product intent.",
    ],
    signals: [
      "You care about typography, spacing, and state design as much as hero screenshots.",
      "You can explain why a design should be quieter, not just prettier.",
      "You know when to add motion and when to let the interface breathe.",
      "You like designing around behavior, not only screens.",
    ],
    notThis: [
      "A role for decorative design without product logic.",
      "A place to paste trend boards onto a utility app.",
      "A job where the dashboard can be less considered than the landing page.",
    ],
  },
  marketingGrowth: {
    title: "Marketing / Growth",
    team: "Go-to-market",
    location: "United States",
    mode: "Remote",
    eyebrow: "make the pain obvious",
    headline: "Tell coders what the tab is costing them.",
    summary:
      "Build the story, experiments, content, and distribution around LeetGuard's solve-first philosophy.",
    intro:
      "The marketing role is not about pretending LeetCode is magical. It is about naming a very real loop: one tab becomes the session, momentum disappears, and the problem stays unsolved. LeetGuard gives that story a product shape.",
    sections: [
      {
        title: "Role Summary",
        paragraphs: [
          "The Marketing / Growth role is responsible for making the LeetGuard story clear to people who already know the pain: one quick tab becomes the whole session, and the problem stays unsolved.",
          "This role sits between positioning, content, launch planning, growth experiments, and community. The goal is not to make exaggerated claims. The goal is to make the product's behavior and point of view instantly legible.",
        ],
      },
      {
        title: "Core Responsibilities",
        bullets: [
          "Develop messaging that explains the solve-first loop in a way that feels native to coders.",
          "Plan and ship content across landing pages, short-form ideas, launch notes, and community channels.",
          "Turn real product moments into proof, examples, and conversion paths.",
          "Run lightweight experiments without making the brand feel desperate or generic.",
        ],
      },
      {
        title: "Ideal Background",
        bullets: [
          "Experience with copywriting, content strategy, growth experiments, or developer-facing products.",
          "A strong sense for what sounds human, specific, and credible to technical users.",
          "Comfort moving between brand voice, funnel thinking, and tactical execution.",
          "A bias toward measured learning without sacrificing taste.",
        ],
      },
      {
        title: "What You Get",
        bullets: [
          "A clear product story with emotional tension and concrete behavior behind it.",
          "Room to shape the voice of an early product before the market decides it for us.",
          "A team that values original thinking over recycled startup language.",
        ],
      },
    ],
    ownership: [
      "Write messaging that makes the distraction problem feel instantly recognizable.",
      "Plan content and growth experiments around interview prep, focus, and developer tools.",
      "Work with product to turn real product moments into marketing assets.",
      "Use AI to draft, vary, and test ideas while keeping the voice human and sharp.",
    ],
    signals: [
      "You can write a headline that sounds like a person actually said it.",
      "You understand developer skepticism and do not try to out-hype it.",
      "You can turn a feature into a story without making fake promises.",
      "You like measuring response, but you still care about brand taste.",
    ],
    notThis: [
      "A role for generic SaaS copy.",
      "A place for growth tricks that make the product feel cheap.",
      "A job where every channel gets the same recycled post.",
    ],
  },
  anythingElse: {
    title: "Open Application",
    team: "Open lane",
    location: "United States",
    mode: "Remote",
    eyebrow: "useful people rarely fit clean boxes",
    headline: "Bring the angle we forgot to name.",
    summary:
      "A general lane for product-minded builders, operators, writers, designers, researchers, and unusual contributors.",
    intro:
      "Some of the best work does not arrive wearing the right job title. If you understand the product, care about quality, and can raise the bar somewhere specific, this lane exists for that conversation.",
    sections: [
      {
        title: "Role Summary",
        paragraphs: [
          "The Open Application lane exists for people whose strongest contribution does not fit one of the named roles. That might mean product research, writing, design, operations, community, partnerships, or a very specific idea we have not described yet.",
          "This is still a role page, not a suggestion box. The strongest application will make a clear case for the problem you would own, the work you would do, and why it matters to LeetGuard now.",
        ],
      },
      {
        title: "Core Responsibilities",
        bullets: [
          "Identify a useful area where LeetGuard could become sharper, clearer, more trusted, or more visible.",
          "Propose and execute focused work with a concrete outcome.",
          "Collaborate with the team in a way that improves the product, not just the conversation around it.",
          "Use AI as leverage while maintaining a clear personal point of view.",
        ],
      },
      {
        title: "Ideal Background",
        bullets: [
          "Evidence of finished work that made something better, clearer, faster, or more useful.",
          "Strong written communication and the ability to explain your proposed contribution plainly.",
          "Interest in focus, developer tools, interview prep, productivity, or early-stage product building.",
          "Comfort operating without a perfect job description while still creating structure for yourself.",
        ],
      },
      {
        title: "What You Get",
        bullets: [
          "A flexible lane to define the contribution you believe is missing.",
          "A team that cares more about usefulness, taste, and proof than credentials alone.",
          "Room to turn a strong point of view into a visible part of the product or company story.",
        ],
      },
    ],
    ownership: [
      "Name the problem you would take on and why it matters.",
      "Show taste, judgment, and a bias toward useful finished work.",
      "Help us see a lane that is currently under-described.",
      "Use AI well, but do not let it flatten your point of view.",
    ],
    signals: [
      "You can point to work that made something clearer, faster, sharper, or more trusted.",
      "You have a reason for caring about focus, developer tools, or interview prep.",
      "You can explain your contribution without needing a perfect org chart.",
      "You prefer proving value to defending credentials.",
    ],
    notThis: [
      "A role for sending a vague 'I can help with anything' note.",
      "A place for pure enthusiasm with no proposed contribution.",
      "A job where title matters more than taste and usefulness.",
    ],
  },
} as const satisfies Record<string, JobPosting>;
