/**
 * Default content for every page.
 *
 * Copy here is taken verbatim from the design prototype
 * (`Betaminds Africa Site.dc.html`) and `structure.txt` — the handoff states the
 * copy is final. Saved edits from the admin are deep-merged *over* this object,
 * so any field an editor has never touched keeps its handoff wording, and adding
 * a new field later never breaks an existing row.
 *
 * Every `pexels.com` URL is a documented placeholder. Replace them by uploading
 * real photography in /admin/media and repointing the field; keep the crop
 * ratios noted in the handoff (hero 16/9, about 16/10, portraits 3/4,
 * avatars 1/1, academy grid portrait, summit galleries square).
 */

/** The prototype's placeholder-image helper, preserved so the defaults match. */
const IMG = (id: number, w = 900) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

/**
 * Shorthand for a form-field definition, so the defaults below stay readable.
 * See src/lib/forms/definition.ts for what each property does.
 */
const f = (
  key: string,
  label: string,
  type:
    | "text"
    | "email"
    | "tel"
    | "date"
    | "url"
    | "textarea"
    | "select" = "text",
  extra: {
    required?: boolean;
    half?: boolean;
    options?: string[];
    placeholder?: string;
  } = {},
) => ({
  key,
  label,
  type,
  options: extra.options ?? [],
  required: extra.required ?? false,
  placeholder: extra.placeholder ?? "",
  width: (extra.half ? "half" : "full") as "full" | "half",
});

/**
 * Shorthand for a case-study project.
 *
 * The structure is real; the narrative copy is placeholder, and `results` is left
 * empty on purpose. Inventing performance figures for a client's case study would
 * put fabricated claims on a live marketing site — the editor fills those in with
 * numbers they can stand behind.
 */
const proj = (
  slug: string,
  name: string,
  industry: string,
  service: string,
  thumb: string,
  hero: string,
) => ({
  slug,
  name,
  industry,
  service,
  year: "",
  client: name,
  image: thumb,
  heroImage: hero,
  summary: `A ${service.toLowerCase()} engagement for ${name}. Replace this with the real project summary.`,
  challenge: "What the brand was up against when they came to us.",
  approach: "What we did, in the order we did it, and why.",
  outcome: "What changed for the business afterwards.",
  results: [] as { n: string; label: string }[],
  gallery: [] as string[],
  quote: "",
  quoteAuthor: "",
  published: true,
});

/**
 * Shorthand for a blog post.
 *
 * The structure is real; the body copy is placeholder. The editor replaces it
 * with the actual post before publishing.
 */
const post = (
  slug: string,
  title: string,
  author: string,
  date: string,
  cover: string,
) => ({
  slug,
  title,
  excerpt: `Replace this with a one- or two-line summary of "${title}".`,
  coverImage: cover,
  body: "Replace this with the full post. A blank line starts a new paragraph.",
  author,
  date,
  published: true,
});

export const defaults = {
  global: {
    brand: {
      logo: "/BETAMINDS-AFRICA.png",
      wordmark: "Betaminds",
      wordmarkSub: "Africa",
      tagline: "We add the spark that makes brands move.",
    },
    nav: {
      items: [
        { label: "Home", href: "/home" },
        { label: "Projects", href: "/projects" },
        { label: "Digital Ecosystem", href: "/digital-ecosystem" },
        { label: "Media Services", href: "/media-services" },
        { label: "Academy", href: "/academy" },
        { label: "Summit", href: "/summit" },
        { label: "Blog", href: "/blog" },
        { label: "Let's Work", href: "/lets-work" },
      ],
      ctaLabel: "Let's Work",
      ctaHref: "/lets-work",
    },
    contact: {
      rows: [
        { label: "Studio address", value: "Lekki Phase 1, Lagos, Nigeria" },
        { label: "Email", value: "hello@betaminds.africa" },
        { label: "Phone", value: "+234 000 000 0000" },
        { label: "Website", value: "betaminds.africa" },
      ],
      socialsLabel: "Follow the studio",
      socials: [
        { label: "IG", href: "#" },
        { label: "IN", href: "#" },
        { label: "X", href: "#" },
        { label: "FB", href: "#" },
        { label: "YT", href: "#" },
      ],
    },
    footer: {
      columns: [
        {
          title: "Explore",
          links: [
            { label: "Home", href: "/home" },
            { label: "Digital marketplace", href: "/digital-ecosystem" },
            { label: "Media services", href: "/media-services" },
          ],
        },
        {
          title: "Grow",
          links: [
            { label: "Betaminds Academy", href: "/academy" },
            { label: "Betaminds Summit", href: "/summit" },
            { label: "Creative Foundations", href: "/academy" },
          ],
        },
        {
          title: "Connect",
          links: [
            { label: "Let's work", href: "/lets-work" },
            { label: "Projects", href: "/projects" },
            { label: "Blog", href: "/blog" },
            { label: "Book a discovery call", href: "/digital-ecosystem#book" },
          ],
        },
      ],
      flapHintClosed: "Click the flap to open",
      flapHintOpen: "Click to close",
      flapFront: "Sealed with a spark. Open it.",
      flapBack:
        "You've reached the end of our story. Let's add a spark to yours.",
      flapCtaLabel: "Let's work →",
      flapCtaHref: "/lets-work",
      copyright: "© 2026 Betaminds Africa. All rights reserved.",
      legalLinks: [
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
      ],
    },
  },

  home: {
    seo: {
      title: "Betaminds Africa — We add the spark that makes brands move",
      description:
        "A Lagos creative and digital commerce agency. We build brands, the digital commerce systems behind them, and the people who run both.",
    },
    /**
     * The splash screen at `/` — the full-screen slider a visitor lands on
     * before the site itself. Switching `enabled` off removes the splash
     * entirely: `/` then serves the homepage, which has its own static hero
     * below, so turning this off can never leave the site headless.
     *
     * `video` is empty on every seeded slide on purpose: there is no stock
     * footage to ship, and an empty value falls back to the slide's still. Upload
     * real footage in the CMS (Home → Opening slider) to switch each one over.
     */
    heroSlider: {
      enabled: true,
      autoplay: true,
      interval: 7,
      overlay: 45,
      slides: [
        {
          eyebrow: "Creative × Digital × Commerce",
          heading: "We add the spark that makes brands move",
          body: "We build brands, the digital commerce systems behind them, and the people who run both. Based in Lagos, working across the continent.",
          video: "",
          image: IMG(5466279, 1800),
          imageAlt: "Betaminds creative team in session",
          primaryLabel: "Explore digital ecosystem",
          primaryHref: "/digital-ecosystem",
          secondaryLabel: "Explore media services",
          secondaryHref: "/media-services",
        },
        {
          eyebrow: "Digital ecosystem",
          heading: "Commerce systems that actually convert",
          body: "Storefronts, payments and the operations behind them — built to be measured, and rebuilt when the numbers say so.",
          video: "",
          image: IMG(3184292, 1800),
          imageAlt: "Team reviewing analytics on a screen",
          primaryLabel: "See how we build",
          primaryHref: "/digital-ecosystem",
          secondaryLabel: "View our work",
          secondaryHref: "/projects",
        },
        {
          eyebrow: "Betaminds Academy",
          heading: "And the people who run both",
          body: "We train the creatives and operators African brands are short of — practical, cohort-based, taught by people still doing the work.",
          video: "",
          image: IMG(7683740, 1800),
          imageAlt: "Academy cohort in a workshop",
          primaryLabel: "Explore the Academy",
          primaryHref: "/academy",
          secondaryLabel: "Talk to us",
          secondaryHref: "/lets-work",
        },
      ],
    },
    hero: {
      image: IMG(5466279, 1800),
      imageAlt: "Betaminds creative team in session",
      eyebrow: "Creative × Digital × Commerce",
      heading: "We add the spark that makes brands move",
      accentTail: ".",
      lead: "We build brands, the digital commerce systems behind them, and the people who run both. Based in Lagos, working across the continent.",
      promise: "Strategy first. Craft always. Growth you can measure.",
      ctas: [
        {
          label: "Explore digital ecosystem",
          href: "/digital-ecosystem",
          style: "accent",
        },
        {
          label: "Explore media services",
          href: "/media-services",
          style: "outline",
        },
        { label: "Betaminds Academy", href: "/academy", style: "outline" },
      ],
    },
    trusted: {
      label: "Trusted by brands across Africa",
      logos: [
        { name: "Sunset", logo: "" },
        { name: "MKR", logo: "" },
        { name: "Glams", logo: "" },
        { name: "Mama Africa", logo: "" },
        { name: "Charoite", logo: "" },
        { name: "Nourish Med", logo: "" },
      ],
    },
    about: {
      eyebrow: "Who we are",
      heading: "We take the idea all the way, not just the pretty part.",
      body1:
        "Creativity meets strategy. We help brands establish a distinct identity and connect with their audience in ways that actually convert. Identity, content, commerce, and the systems that keep all of it running.",
      body2: "One team, from the first workshop to the campaign report.",
      ctaLabel: "Let's work",
      ctaHref: "/lets-work",
      image: IMG(3869639, 1200),
      imageAlt: "Betaminds studio team",
      pillars: [
        {
          kicker: "Our mission",
          body: "Tailored branding, marketing and creative services that help clients stand out, connect, and grow sustainably.",
        },
        {
          kicker: "Our vision",
          body: "To be a trusted creative powerhouse shaping the future of African brands.",
        },
        {
          kicker: "Why work with us",
          body: "Strategy, craft and execution under one roof. No handoffs, no gaps, no guesswork.",
        },
      ],
      notForTitle: "Brands we don't work with",
      notFor: [
        "Brands unwilling to invest in strategy before assets.",
        "Anyone asking us to copy a competitor outright.",
        "Products that mislead or exploit the audiences we serve.",
      ],
    },
    team: {
      eyebrow: "Meet the spark",
      heading: "The people behind the work.",
      note: "Hover a portrait for socials.",
      members: [
        {
          name: "Ileriayo S. Okunrotifa",
          role: "MD / Founder",
          image: IMG(29387557, 700),
          instagram: "",
          linkedin: "",
        },
        {
          name: "Ryzer Uffort",
          role: "Brand Identity Designer / Betaminds Academy Facilitator",
          image: IMG(5466267, 700),
          instagram: "",
          linkedin: "",
        },
        {
          name: "Adefolaju Michael",
          role: "DOP / Betaminds Academy Facilitator",
          image: IMG(7792860, 700),
          instagram: "",
          linkedin: "",
        },
        {
          name: "Uchegbu Stanley Chibuzo",
          role: "Virtual Designer",
          image: IMG(5439174, 700),
          instagram: "",
          linkedin: "",
        },
        {
          name: "Benita Oseremi Obajuobalo",
          role: "Copywriter",
          image: IMG(3869639, 700),
          instagram: "",
          linkedin: "",
        },
        {
          name: "Ayanleye Ayodeji",
          role: "Visual Artist / Betaminds Academy Facilitator",
          image: IMG(5934188, 700),
          instagram: "",
          linkedin: "",
        },
      ],
    },
    marketplace: {
      eyebrow: "Digital marketplace",
      heading: "Build. Scale. Sell. Grow.",
      body: "Not a pile of standalone services. One commerce ecosystem: branding, content, website, ads, customer experience and analytics, planned and run together.",
      ctaLabel: "Book a discovery call",
      ctaHref: "/digital-ecosystem",
    },
    media: {
      eyebrow: "Media services",
      heading: "Seven packages. Click one to see the deliverables.",
      linkLabel: "All media services →",
      enquireLabel: "Enquire",
    },
    summit: {
      eyebrow: "The Summit",
      heading: "Betaminds Africa Creative Empowerment Summit",
      body: "More than an annual event. It's a movement turning creative talent into careers and businesses that last.",
      image: IMG(8761808, 1800),
      imageAlt: "Summit attendee",
      ctaLabel: "Explore the summit →",
      ctaHref: "/summit",
    },
    portfolio: {
      eyebrow: "Projects",
      heading: "Selected work.",
      note: "Hover for industry & service.",
      viewLabel: "View project",
      /** How many of the projects to show on the homepage grid. */
      limit: 6,
      allLinkLabel: "All work →",
    },
    testimonials: {
      label: "What clients say",
      items: [
        {
          quote:
            "They took the whole thing off our hands: brand, site, content. Our online orders doubled in one quarter.",
          name: "Adaeze O.",
          company: "Mama Africa Foods",
          image: IMG(5934188, 300),
        },
        {
          quote:
            "The strategy session alone changed how we talk about ourselves. The work that followed just made it obvious.",
          name: "Tunde A.",
          company: "MKR Logistics",
          image: IMG(29387557, 300),
        },
        {
          quote:
            "Our property films finally look like the calibre of homes we sell. Enquiries have never been higher.",
          name: "Ifeoma N.",
          company: "Charoite Homes",
          image: IMG(5439174, 300),
        },
      ],
    },
    academy: {
      eyebrow: "Betaminds Academy",
      heading: "Learn. Build. Earn.",
      ctaLabel: "Visit academy →",
      ctaHref: "/academy",
      grid: [
        { label: "Masterclass", image: IMG(9363120, 600) },
        { label: "Training", image: IMG(8761715, 600) },
        { label: "Workshop", image: IMG(7793169, 600) },
        { label: "Community", image: IMG(3869639, 600) },
        { label: "Bootcamp", image: IMG(5060991, 600) },
      ],
    },
    finalCta: {
      eyebrow: "Let's work",
      heading: "Let's add the spark to your vision.",
      ctaLabel: "Let's work →",
      ctaHref: "/lets-work",
      image: IMG(8761735, 1800),
      imageAlt: "Client strategy session",
    },
  },

  projects: {
    seo: {
      title: "Selected work — Betaminds Africa",
      description:
        "Brand identity, commerce ecosystems, content and property film for brands across Africa.",
    },
    index: {
      eyebrow: "Projects",
      heading: "Selected work",
      accentTail: ".",
      lead: "Identity, commerce, content and film. A few of the engagements we can talk about.",
      emptyMessage: "Case studies are on their way. In the meantime, tell us what you're building.",
      readLabel: "Read the case study →",
    },
    detail: {
      briefLabel: "The brief",
      challengeLabel: "The challenge",
      approachLabel: "What we did",
      outcomeLabel: "The outcome",
      resultsLabel: "Results",
      galleryLabel: "From the work",
      nextLabel: "Next project",
      ctaHeading: "Something like this in mind?",
      ctaLabel: "Let's work →",
      ctaHref: "/lets-work",
    },
    list: {
      items: [
        proj("sunset-hospitality", "Sunset Hospitality", "Hospitality", "Brand identity", IMG(9490631, 800), IMG(9490631, 1800)),
        proj("nourish-med", "Nourish Med", "Healthcare", "Content & ads", IMG(8730849, 800), IMG(8730849, 1800)),
        proj("charoite-homes", "Charoite Homes", "Real estate", "Property film", IMG(12179670, 800), IMG(12179670, 1800)),
        proj("mama-africa-foods", "Mama Africa Foods", "FMCG", "Commerce ecosystem", IMG(9301528, 800), IMG(9301528, 1800)),
        proj("mkr-logistics", "MKR Logistics", "Logistics", "Website design", IMG(5058927, 800), IMG(5058927, 1800)),
        proj("glams-beauty", "Glams Beauty", "Beauty", "Social management", IMG(4183516, 800), IMG(4183516, 1800)),
      ],
    },
  },

  blog: {
    seo: {
      title: "Blog — Betaminds Africa",
      description:
        "Notes on brand, content, commerce and craft from the Betaminds Africa studio.",
    },
    index: {
      eyebrow: "Blog",
      heading: "From the studio",
      accentTail: ".",
      lead: "Field notes on brand, content, commerce and craft — from the team building it.",
      emptyMessage: "Nothing published yet. Check back soon.",
      readLabel: "Read the post →",
    },
    detail: {
      backLabel: "All posts",
      nextLabel: "Next post",
      ctaHeading: "Got a project in mind?",
      ctaLabel: "Let's work →",
      ctaHref: "/lets-work",
    },
    list: {
      items: [
        post(
          "building-brands-that-travel",
          "Building brands that travel across African markets",
          "Betaminds Studio",
          "January 2026",
          IMG(3869639, 1200),
        ),
        post(
          "content-that-converts",
          "Content that converts: what we learned from a year of campaigns",
          "Betaminds Studio",
          "January 2026",
          IMG(8761735, 1200),
        ),
        post(
          "why-commerce-ecosystems-beat-standalone-sites",
          "Why commerce ecosystems beat standalone websites",
          "Betaminds Studio",
          "December 2025",
          IMG(8761808, 1200),
        ),
      ],
    },
  },

  ecosystem: {
    seo: {
      title: "Digital Commerce & Marketplace Solutions — Betaminds Africa",
      description:
        "Build. Scale. Sell. Grow. One integrated digital commerce solution: branding, content, website, ads, customer experience and analytics.",
    },
    hero: {
      image: IMG(5060980, 1800),
      imageAlt: "Building a digital commerce ecosystem",
      eyebrow: "Digital ecosystem",
      heading: "Digital Commerce & Marketplace Solutions",
      accentLine: "Build. Scale. Sell. Grow.",
      lead: "Growth is driven by visibility, strategy, technology and customer experience. We help businesses build, launch, market and grow their online presence through one integrated solution instead of a pile of standalone services.",
      ctaLabel: "Book a discovery call →",
      ctaHref: "#book",
    },
    solution: {
      heading: "Our Digital Commerce Solution",
      body: "The essential components required to build and grow a successful online business over time.",
      items: [
        {
          name: "Brand identity development & refresh",
          body: "Positioning, naming, identity systems and the guidelines that keep them consistent.",
        },
        {
          name: "Brand strategy & planning",
          body: "Where you play, how you win, and the quarterly plan that makes it happen.",
        },
        {
          name: "Content creation & commercial production",
          body: "Photography, film and copy produced at commercial standard, on a calendar.",
        },
        {
          name: "Website design & management",
          body: "Designed, built, maintained. Fast, clear and easy for your team to update.",
        },
        {
          name: "Search engine optimization",
          body: "Technical foundations and content that make you findable where buyers look.",
        },
        {
          name: "Payment integration",
          body: "Checkout that works for local and cross-border customers alike.",
        },
        {
          name: "Social media management",
          body: "Channel strategy, publishing, community and influencer coordination.",
        },
        {
          name: "Sponsored ad placement",
          body: "Meta, Google and TikTok campaigns planned against a target and optimized weekly.",
        },
        {
          name: "Customer experience management",
          body: "Enquiry handling, response systems and retention that protect the revenue you win.",
        },
        {
          name: "Performance analytics",
          body: "One dashboard, plain-language reporting, decisions you can defend.",
        },
      ],
    },
    plans: {
      heading: "Engagement plans",
      /** The Growth plan is highlighted — index 1, matching the prototype's `plan: 1`. */
      featuredIndex: 1,
      selectLabel: "Select Plan",
      items: [
        {
          name: "Starter Partnership",
          tag: "Establish",
          short:
            "For businesses establishing, repositioning, or accelerating their digital presence with a focused commerce strategy and execution plan.",
          includes: [
            "Brand identity development or refresh",
            "Digital commerce strategy document",
            "Website design (up to 5 pages)",
            "Content shoot (one production day)",
            "Social media setup & 30-day calendar",
            "Payment integration",
            "Monthly performance report",
          ],
        },
        {
          name: "Growth Partnership",
          tag: "Most chosen",
          short:
            "For businesses seeking sustained digital growth, stronger market positioning, and continuous optimization across the ecosystem.",
          includes: [
            "Everything in Starter",
            "Brand strategy & quarterly planning",
            "Ongoing content production (monthly)",
            "Website management & SEO",
            "Full social media management",
            "Sponsored ad placement & management",
            "Customer experience management",
            "Bi-weekly performance analytics",
          ],
        },
        {
          name: "Strategic Partnership",
          tag: "Scale",
          short:
            "A long-term engagement for businesses scaling digital operations, deepening customer relationships, and driving consistent growth.",
          includes: [
            "Everything in Growth",
            "Dedicated account & strategy lead",
            "Commercial production at scale",
            "Marketplace expansion (Jumia, IG Shop, WhatsApp)",
            "Conversion rate optimization programme",
            "Customer retention & loyalty systems",
            "Quarterly business review with leadership",
          ],
        },
      ],
    },
    notes: {
      paidLabel: "A paid session, credited to your package",
      paidBody:
        "Discovery calls carry a small booking fee. If you move forward with a service package, the fee is fully deducted from your package cost. You're never charged twice.",
      freeLabel: "Monthly free slot · first working day",
      freeHeading: "One free consultation, every new month",
      freeBody:
        "We open a complimentary consultation slot on the first working day of each month for one brand. That could be you.",
    },
    questionnaire: {
      eyebrow: "Before you book",
      heading: "Tell us about your brand",
      body: "A few quick questions help us prepare a Digital Commerce Strategy that's actually relevant to your business before we sit down on the call.",
      steps: [
        "Fill in the questionnaire. It takes about three minutes.",
        "You get a link to pick a time on our calendar.",
        "We review your answers before your session.",
        "We meet, discuss, and recommend a plan.",
      ],
      ctaLabel: "Start the questionnaire →",
      /**
       * Calendly link shown after the questionnaire is submitted. The handoff
       * calls for Calendly + payment integration on "Book a discovery call";
       * paste the scheduling URL here and it becomes the next step on the
       * success screen.
       */
      schedulingUrl: "",
      submitLabel: "Submit and get my scheduling link",
      successHeading: "Thank you. We have your answers.",
      successBody:
        "We review every questionnaire before the call. You'll hear from us within one working day with your scheduling link and, where a booking fee applies, the payment details.",
      /**
       * The eight parts from structure.txt, as editable field definitions.
       * Starred fields in the brief are the `required: true` ones here. The
       * outline shown beside the form is derived from these labels, so there is
       * one source of truth.
       */
      groups: [
        {
          title: "Contact & brand",
          fields: [
            f("email", "Email", "email", { required: true, half: true, placeholder: "you@brand.com" }),
            f("brandName", "Brand name", "text", { required: true, half: true }),
            f("phone", "Phone", "tel", { required: true, half: true }),
            f("website", "Website / social media", "text", {
              required: true,
              half: true,
              placeholder: "brand.com or @brand",
            }),
          ],
        },
        {
          title: "Where is your brand based?",
          fields: [
            f("address1", "Address line 1", "text", { half: true }),
            f("city", "City", "text", { half: true }),
            f("region", "State / province / region", "text", { half: true }),
            f("country", "Country", "text", { required: true, half: true }),
          ],
        },
        {
          title: "About your business",
          fields: [
            f("sells", "What does your brand sell?", "select", {
              half: true,
              options: ["Products", "Services", "Both"],
            }),
            f("industry", "Industry / category", "text", { half: true }),
            f("yearsTrading", "How long have you been in business?", "text", {
              required: true,
              half: true,
              placeholder: "e.g. 3 years",
            }),
            f("channel", "Do you sell online, offline, or both?", "select", {
              half: true,
              options: ["Online", "Offline", "Both"],
            }),
            f(
              "reach",
              "Do you sell locally, nationally, or across borders?",
              "select",
              { half: true, options: ["Locally", "Nationally", "Across borders"] },
            ),
          ],
        },
        {
          title: "Current digital presence",
          fields: [
            f("marketplaces", "Marketplaces you currently sell through", "textarea", {
              placeholder: "Jumia, Instagram Shop, WhatsApp Business…",
            }),
            f("paidAds", "Do you currently run paid ads anywhere?", "textarea"),
            f("brandAssets", "Existing brand assets", "textarea", {
              placeholder: "Logo, guidelines, product photos…",
            }),
          ],
        },
        {
          title: "Team & decision-making",
          fields: [
            f("teamStructure", "What is your team's structure?", "textarea", {
              required: true,
            }),
            f(
              "internalOrOutsource",
              "Internal team we'd work alongside, or fully outsourcing?",
              "select",
              {
                options: [
                  "We have an internal team",
                  "Fully outsourcing to you",
                  "A mix of both",
                ],
              },
            ),
            f("whoElseDecides", "Who else is involved in this decision?", "text", {
              half: true,
              placeholder: "Just me / a co-founder / a team",
            }),
            f(
              "budgetAuthority",
              "Are you the sole decision-maker for budget approval?",
              "select",
              { half: true, options: ["Yes", "No", "Shared"] },
            ),
          ],
        },
        {
          title: "Why now?",
          fields: [
            f("whyNow", "What's prompting you to reach out now?", "textarea", {
              required: true,
              placeholder: "A launch, a rebrand, stalled sales…",
            }),
          ],
        },
        {
          title: "Engagement details",
          fields: [
            f(
              "plan",
              "What partnership plan are you interested in?",
              "select",
              {
                required: true,
                options: [
                  "Starter Partnership",
                  "Growth Partnership",
                  "Strategic Partnership",
                  "Not sure yet. Recommend one.",
                ],
              },
            ),
            f("startDate", "Ideal services start date", "date", {
              required: true,
              half: true,
            }),
            f("budget", "What is your budget?", "text", {
              required: true,
              half: true,
              placeholder: "Range is fine",
            }),
          ],
        },
        {
          title: "Just one more",
          fields: [f("howHeard", "How did you hear about us?", "text")],
        },
      ],
    },
  },

  media: {
    seo: {
      title: "Media Services — Betaminds Africa",
      description:
        "Seven media packages, each with a defined scope and defined deliverables: brand identity, company profile, content, websites, social, property film and paid ads.",
    },
    hero: {
      image: IMG(7793825, 1800),
      imageAlt: "Creative director on set",
      eyebrow: "Media services",
      heading: "Craft that carries your brand",
      accentTail: ".",
      lead: "Seven packages, each with a defined scope and defined deliverables. Pick one, or let us shape a combination around the brief.",
    },
    packages: {
      deliverablesLabel: "Deliverables",
      enquirePrefix: "Enquire about",
      items: [
        {
          label: "Brand identity",
          blurb:
            "An identity system your team can actually use, not a logo file and good luck.",
          items: [
            "Discovery & positioning workshop",
            "Logo suite and responsive marks",
            "Colour, type and layout system",
            "Brand guidelines document",
            "Stationery and social templates",
          ],
        },
        {
          label: "Company profile",
          blurb: "The document that opens doors before you walk in the room.",
          items: [
            "Copywriting and narrative structure",
            "Editorial design and layout",
            "Infographics and data visuals",
            "Print-ready and digital versions",
          ],
        },
        {
          label: "Content creation",
          blurb:
            "Commercial-grade content built around a calendar, not a whim.",
          items: [
            "Creative direction and shot list",
            "Photography, studio or on location",
            "Video production and editing",
            "Copy and caption bank",
            "Monthly content calendar",
          ],
        },
        {
          label: "Website design",
          blurb:
            "Fast, clear sites designed to convert and easy for you to update.",
          items: [
            "UX structure and wireframes",
            "Responsive UI design",
            "Build, launch and handover",
            "SEO foundations",
            "Payment and analytics integration",
          ],
        },
        {
          label: "Social media management",
          blurb: "Consistent presence, community and measurable growth.",
          items: [
            "Channel strategy and tone of voice",
            "Content scheduling and publishing",
            "Community management",
            "Influencer coordination",
            "Monthly analytics report",
          ],
        },
        {
          label: "Property photography & videography",
          blurb: "Listings and developments that sell on sight.",
          items: [
            "Interior and exterior photography",
            "Walkthrough and drone video",
            "Twilight and lifestyle sets",
            "Retouching and delivery in listing formats",
          ],
        },
        {
          label: "Ads campaign placement",
          blurb: "Paid media planned against a target, not a hunch.",
          items: [
            "Campaign strategy and audience mapping",
            "Creative production for ad formats",
            "Meta, Google and TikTok placement",
            "Budget management and pacing",
            "Weekly optimization and reporting",
          ],
        },
      ],
    },
  },

  academy: {
    seo: {
      title: "Betaminds Academy — Learn. Build. Earn.",
      description:
        "Transform your creative skills into a career. Practical skills, mentorship, industry exposure, internships and career opportunities.",
    },
    hero: {
      image: IMG(9363120, 1000),
      imageAlt: "Betaminds Academy student",
      eyebrow: "Betaminds Academy",
      heading: "Learn. Build. Earn.",
      subhead: "Transform your creative skills into a career.",
      lead: "Gain practical skills, mentorship, industry exposure, internships and career opportunities through Betaminds Academy.",
      formatsLabel: "Learning formats",
      formats: [
        "Physical classes",
        "Live virtual classes",
        "Self-paced online",
        "Weekend boot camps",
        "Corporate training",
      ],
      ctaLabel: "Apply now →",
      ctaHref: "#apply",
    },
    courses: {
      heading: "Academy courses",
      certificateLabel: "Certificate",
      enrolLabel: "Enrol",
      schools: [
        {
          name: "School of Creative Media",
          courses: [
            {
              name: "Photography",
              weeks: "10 weeks",
              mode: "Hybrid",
              description:
                "Camera fundamentals, lighting and composition through to a portfolio-ready editorial shoot.",
            },
            {
              name: "Videography",
              weeks: "12 weeks",
              mode: "Physical",
              description:
                "Camera operation, shot-listing and on-set craft for narrative, commercial and event film.",
            },
            {
              name: "Content Creation",
              weeks: "8 weeks",
              mode: "Hybrid",
              description:
                "Planning, filming and editing short-form content for brands and personal platforms.",
            },
            {
              name: "Animation",
              weeks: "12 weeks",
              mode: "Virtual",
              description:
                "2D animation principles, storyboarding and production workflow from concept to render.",
            },
            {
              name: "Motion Graphics",
              weeks: "10 weeks",
              mode: "Hybrid",
              description:
                "Typography, compositing and animation for title sequences, ads and social content.",
            },
          ],
        },
        {
          name: "School of Digital Technology",
          courses: [
            {
              name: "Digital Marketing",
              weeks: "12 weeks",
              mode: "Hybrid",
              description:
                "Strategy, paid media, social and analytics for running campaigns that convert.",
            },
            {
              name: "UI/UX Design",
              weeks: "12 weeks",
              mode: "Hybrid",
              description:
                "Research, wireframing and prototyping toward a shippable, user-tested product design.",
            },
            {
              name: "Website Development",
              weeks: "16 weeks",
              mode: "Hybrid",
              description:
                "Front-end and back-end fundamentals through to a deployed, full-stack project.",
            },
            {
              name: "AI Productivity",
              weeks: "6 weeks",
              mode: "Virtual",
              description:
                "Practical AI tooling for research, writing, design and workflow automation.",
            },
            {
              name: "SEO",
              weeks: "6 weeks",
              mode: "Virtual",
              description:
                "Technical, on-page and content SEO to grow organic search visibility.",
            },
          ],
        },
      ],
    },
    why: {
      heading: "Why Betaminds Academy",
      items: [
        "Certifications",
        "Internship placements",
        "Freelance opportunities",
        "Portfolio development",
        "Career coaching",
        "CV and social media optimization",
        "Mock interviews",
      ],
    },
    pathway: {
      heading: "From choice to employment",
      steps: [
        "Choose course",
        "Register",
        "Learn",
        "Projects",
        "Certification",
        "Internship",
        "Employment",
      ],
    },
    stats: {
      heading: "We don't just teach. We build careers.",
      items: [
        { n: "100+", label: "Students trained" },
        { n: "50+", label: "Internships" },
        { n: "85%", label: "Employment rate" },
        { n: "50+", label: "Creative projects" },
      ],
    },
    quotes: {
      items: [
        {
          quote:
            "I got my first job two weeks after completing the Digital Marketing programme.",
          name: "Chidera E.",
          course: "Digital Marketing · 2025 cohort",
          image: IMG(5466267, 260),
        },
        {
          quote:
            "I created my own brand before I finished the course, and my first three clients came from the community.",
          name: "Samuel B.",
          course: "Content Creation · 2025 cohort",
          image: IMG(7793169, 260),
        },
      ],
    },
    faq: {
      heading: "Frequently asked questions",
      items: [
        {
          q: "Who can apply?",
          a: "Anyone passionate about building a career in the creative and digital industries. That includes students and recent graduates, aspiring and established creatives, entrepreneurs, working professionals upskilling or switching careers, freelancers and content creators, and corporate teams. Whatever your level of experience, there is a programme designed to take you from where you are.",
        },
        {
          q: "Are classes online?",
          a: "Yes, and more than that. Depending on the programme, classes run as live instructor-led online sessions, self-paced online learning, physical classroom sessions, or a hybrid of online and in-person. That flexibility lets participants from across Nigeria and Africa learn conveniently.",
        },
        {
          q: "How much is tuition?",
          a: "Tuition varies by course, duration and learning format. We work hard to keep programmes affordable while delivering industry-relevant training. Visit the page for your selected programme, or contact admissions for current fees, payment plans, scholarships and promotional offers.",
        },
        {
          q: "Do you provide certificates?",
          a: "Yes. Participants who complete their course requirements (attendance, assignments and practical projects where applicable) receive a Betaminds Africa Academy Certificate of Completion. Selected programmes also include opportunities to earn industry-recognised certifications through our partners.",
        },
        {
          q: "Do you offer internships?",
          a: "Yes. Bridging learning and employment is a core objective. Eligible students can access internship opportunities, industry mentorship, portfolio development, freelance projects, career coaching, networking events and job placement support through our employer network. Placement depends on programme requirements, performance and partner availability.",
        },
      ],
    },
    partners: {
      eyebrow: "Partners",
      heading: "Trusted by the institutions that hire our graduates",
      logos: [
        { name: "Logo", logo: "" },
        { name: "Logo", logo: "" },
        { name: "Logo", logo: "" },
        { name: "Logo", logo: "" },
        { name: "Logo", logo: "" },
        { name: "Logo", logo: "" },
      ],
    },
    foundation: {
      eyebrow: "Coming soon · Betaminds Creative Foundations",
      heading: "Unlocking rural and less-privileged potential",
      body: "Free training, mentorship and tools for aspiring creatives in rural areas, orphanages and motherless baby homes, opening a real path into media and digital careers.",
      points: [
        "Introduces creative-industry career paths",
        "Free training and mentorship",
        "Tools and resources to start earning",
      ],
    },
    apply: {
      heading: "Apply to the Academy",
      body: "Tell us which course you want and how you'd like to learn. Admissions replies within one working day.",
      submitLabel: "Submit application →",
      successHeading: "Application received.",
      successBody:
        "Our admissions team will be in touch within one working day with next steps, fees and start dates.",
      /**
       * The course dropdown is filled from the schools above at render time, so
       * adding a course makes it applicable for without touching this list.
       */
      fields: [
        f("name", "Your name", "text", { required: true, half: true }),
        f("email", "Email", "email", { required: true, half: true }),
        f("phone", "Phone", "tel", { half: true }),
        f("format", "Preferred format", "select", { half: true }),
        f("course", "Which course?", "select", { required: true }),
        f("background", "Tell us about your background", "textarea", {
          placeholder: "Where you are now, and what you want to be doing.",
        }),
      ],
    },
  },

  summit: {
    seo: {
      title: "Creative Empowerment Summit — Betaminds Africa",
      description:
        "Turning creativity into careers. A premier platform empowering Africa's next generation of creatives, innovators and entrepreneurs.",
    },
    hero: {
      image: IMG(5466267, 1800),
      imageAlt: "Creative Empowerment Summit",
      eyebrow: "Creative Empowerment Summit",
      heading: "Turning creativity into careers",
      accentTail: ".",
      lead: "A premier platform empowering Africa's next generation of creatives, innovators, entrepreneurs and young professionals. More than an annual event. A movement.",
      nextLabel: "Second edition",
      nextDetail: "17 July 2026 · Gracetone Studio, Yaba, Lagos",
      ctaPrimary: "Register interest",
      ctaSecondary: "Download sponsorship deck",
      /** Point this at the real deck (upload it, or paste an external URL). */
      deckUrl: "",
    },
    movement: {
      heading: "A movement, not a conference",
      body1:
        "Every year we bring together industry leaders, entrepreneurs, creative professionals, policymakers, investors and aspiring talent for an immersive experience of learning, inspiration, networking and collaboration.",
      body2:
        "Keynotes, panels, masterclasses, workshops and mentorship, plus the connections that move a career forward.",
      missionLabel: "Our mission",
      mission:
        "To close the gap between talent and opportunity by giving participants the skills, mindset and networks to thrive in a fast-moving creative and digital economy. Africa's greatest resource is its people.",
    },
    stats: {
      items: [
        { n: "500+", label: "Attendees" },
        { n: "30+", label: "Speakers" },
        { n: "20+", label: "Sponsors" },
        { n: "15+", label: "Workshops" },
        { n: "10+", label: "Partner institutions" },
      ],
    },
    why: {
      heading: "Why attend?",
      items: [
        {
          title: "Learn from industry leaders",
          body: "Keynotes and masterclasses from people running the businesses you want to build.",
        },
        {
          title: "Networking opportunities",
          body: "Structured sessions designed to put you in front of the right rooms.",
        },
        {
          title: "Hands-on workshops",
          body: "Leave with work you made, not just notes you took.",
        },
        {
          title: "Career opportunities",
          body: "Recruiters, internships and portfolio reviews on the day.",
        },
        {
          title: "Business growth",
          body: "Practical strategy for founders scaling creative businesses.",
        },
        {
          title: "Creative showcase",
          body: "A stage for your work in front of investors and partners.",
        },
      ],
    },
    editions: {
      items: [
        {
          edition: "First edition",
          theme: "Choose a passion-driven career in the creative industry",
          date: "1 May 2025",
          venue: "Cafeone, Ikate, Lekki, Lagos",
          gallery: [7793169, 3869639, 5060987, 8730849, 5058927, 12179670].map(
            (id) => IMG(id, 600),
          ),
        },
        {
          edition: "Second edition",
          theme: "Turning creativity into careers",
          date: "17 July 2026",
          venue: "Gracetone Studio, Yaba, Lagos",
          gallery: [5466279, 9490631, 8761715, 7792860, 9301528, 5060991].map(
            (id) => IMG(id, 600),
          ),
        },
      ],
    },
    press: {
      label: "From the press",
      items: [
        { name: "Punch Newspaper", href: "" },
        { name: "Independent Newspaper", href: "" },
      ],
    },
    agenda: {
      heading: "Summit agenda",
      steps: [
        "Registration",
        "Opening ceremony",
        "Keynote address",
        "Panel discussion",
        "Networking break",
        "Breakout sessions",
        "Creative showcase",
        "Awards",
        "Closing ceremony",
      ],
    },
    stories: {
      items: [
        {
          quote: "Attending the summit helped me secure my first internship.",
          name: "Blessing U. · 2025 attendee",
          image: IMG(8761715, 240),
        },
        {
          quote:
            "My business grew after applying what I learned in the breakout sessions.",
          name: "Emeka D. · Founder, 2025 attendee",
          image: IMG(5060987, 240),
        },
      ],
    },
    faq: {
      heading: "Frequently asked questions",
      items: [
        {
          q: "Who should attend?",
          a: "Anyone looking to grow, innovate and build a career in the creative and digital economy. That includes students and graduates, creatives at any stage, content creators and influencers, entrepreneurs, marketing, media and communications professionals, tech and digital professionals, educators and mentors, and corporate or development partners.",
        },
        {
          q: "Is registration free?",
          a: "Yes. Registration is free for all participants, but it is mandatory and spaces are limited, so register early to secure your spot. Some exclusive masterclasses, workshops or VIP experiences may require separate registration.",
        },
        {
          q: "How do I become a sponsor?",
          a: "Complete the sponsorship inquiry form, or email our partnerships team, and request the Sponsorship & Partnership Deck. Opportunities include brand visibility, exhibition space, speaking slots, product showcases, media exposure and direct engagement with attendees.",
        },
        {
          q: "Will certificates be issued?",
          a: "Yes. Participants who register, attend and meet any applicable participation requirements receive a Certificate of Participation from Betaminds Africa, issued electronically after the event.",
        },
        {
          q: "How do I volunteer?",
          a: "Complete the Volunteer Application Form with your details, skills and areas of interest, then await onboarding from our volunteer coordination team. Volunteers gain event management experience, leadership development, mentorship and a certificate of service.",
        },
      ],
    },
    sponsor: {
      heading: "Partner with Africa's leading creative movement",
      body: "Position your brand before thousands of students, professionals and entrepreneurs.",
      ctaPrimary: "Download sponsorship deck",
      ctaSecondary: "Speak to our team",
      ctaSecondaryHref: "/lets-work",
    },
    register: {
      label: "Register now",
      body: "Registration for the next edition is not yet open. Join the list and you'll be first to know.",
    },
    newsletter: {
      heading: "Stay updated",
      body: "Summit news, speaker announcements and opportunities.",
      placeholder: "Email address",
      ctaLabel: "Subscribe",
      successMessage: "You're on the list. Watch your inbox.",
    },
    interest: {
      heading: "Register your interest",
      body: "Tell us how you'd like to take part and we'll be in touch when the next edition opens.",
      submitLabel: "Register interest →",
      successHeading: "You're registered.",
      successBody:
        "We'll email you as soon as registration for the next edition opens.",
      fields: [
        f("name", "Your name", "text", { required: true, half: true }),
        f("email", "Email", "email", { required: true, half: true }),
        f("organisation", "Organisation", "text", { half: true }),
        f("role", "Role", "text", { half: true }),
        f("interest", "How would you like to take part?", "select", {
          required: true,
          options: [
            "Attend",
            "Speak",
            "Sponsor or partner",
            "Volunteer",
            "Exhibit",
          ],
        }),
        f("message", "Anything else?", "textarea"),
      ],
    },
  },

  work: {
    seo: {
      title: "Let's Work — Betaminds Africa",
      description:
        "Tell us what you're building. Office address, email, phone and a project brief form.",
    },
    hero: {
      image: IMG(5060570, 1800),
      imageAlt: "Betaminds studio",
      eyebrow: "Let's work",
      heading: "Let's add the spark to your vision.",
      lead: "Tell us what you're building. We'll tell you honestly whether we're the right team for it, and what we'd do first.",
      ctaLabel: "Book a discovery call →",
      ctaHref: "/digital-ecosystem#book",
    },
    form: {
      heading: "Send us a brief",
      body: "We reply within one working day.",
      submitLabel: "Send brief →",
      successHeading: "Brief received.",
      successBody:
        "Thank you. We read every brief ourselves and reply within one working day.",
      labels: {
        name: "Your name",
        email: "Email",
        company: "Brand / company",
        need: "What do you need?",
        project: "Tell us about the project",
      },
      hints: {
        name: "Full name",
        email: "you@company.com",
        company: "Brand name",
        need: "Brand identity, commerce ecosystem, media production…",
        project:
          "Where you are now, where you want to be, and by when.",
      },
    },
  },
};

export type ContentDefaults = typeof defaults;
export type DocId = keyof ContentDefaults;

export const DOC_IDS = Object.keys(defaults) as DocId[];
