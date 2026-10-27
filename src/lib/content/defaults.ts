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
    | "select"
    | "radio"
    | "multiselect" = "text",
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
 * The structure is real; the PDF is not — there's no case-study document to
 * link to until one is uploaded in /admin, so this leaves `pdf` empty. A
 * project with no PDF yet still gets its tile on the site; the tile just
 * isn't a link until then.
 */
const proj = (
  name: string,
  industry: string,
  service: string,
  thumb: string,
  hero: string,
) => ({
  name,
  industry,
  service,
  year: "",
  client: name,
  image: thumb,
  heroImage: hero,
  pdf: "",
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
  body: `<p>Replace this with the full post.</p>`,
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
        { label: "Digital Marketplace", href: "/digital-ecosystem" },
        { label: "Media Services", href: "/media-services" },
        { label: "PR & Events", href: "/pr" },
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
    // No number seeded on purpose — the button stays off the live site until
    // a real one is entered in Site-wide → Floating WhatsApp button.
    whatsapp: {
      enabled: true,
      number: "",
      message: "Hi Betaminds Africa, I'd like to talk about a project.",
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
     * The opening slider, used in two places: full-screen at `/` as the splash
     * a visitor lands on, and again as the homepage's own hero once they are
     * inside the site. One set of slides drives both, so the opening moment
     * carries through instead of dropping to an unrelated still.
     *
     * `enabled` only controls the splash. Switching it off sends `/` straight
     * to the homepage, where these slides still open the page.
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
          eyebrow: "Digital marketplace",
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
    /** Lines for the scrolling statement band. Kept short — they run at
     *  display scale and have to be readable while moving. */
    statement: {
      lines: [
        "One partner",
        "One unified strategy",
        "Multiple digital solutions",
        "Better results",
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
      heading: "We take the idea *all the way*, not just the _pretty part_.",
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
      members: [
        {
          name: "Ileriayo S. Okunrotifa",
          role: "MD / Founder",
          image: "/team/ileriayo-okunrotifa.jpg",
          instagram: "",
          linkedin: "",
        },
        {
          name: "Ryzer Uffort",
          role: "Brand Identity Designer / Betaminds Academy Facilitator",
          image: "/team/ryzer-uffort.jpg",
          instagram: "",
          linkedin: "",
        },
        {
          name: "Adefolaju Michael",
          role: "DOP / Betaminds Academy Facilitator",
          image: "/team/adefolaju-michael.jpg",
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
        // Role left blank — to be filled in from /admin once titles are
        // confirmed.
        {
          name: "Adebola Titilola",
          role: "",
          image: "/team/adebola-titilola.jpg",
          instagram: "",
          linkedin: "",
        },
        {
          name: "Okeke Munachimso Favour",
          role: "",
          image: "/team/okeke-munachimso-favour.jpg",
          instagram: "",
          linkedin: "",
        },
        {
          name: "Olamide Odutolu",
          role: "",
          image: "/team/olamide-odutolu.jpg",
          instagram: "",
          linkedin: "",
        },
        {
          name: "Oyewole Asifat",
          role: "",
          image: "/team/oyewole-asifat.jpg",
          instagram: "",
          linkedin: "",
        },
      ],
    },
    pr: {
      eyebrow: "PR & events",
      heading: "Your brand has a story — let's make sure the right people hear it.",
      body: "You and your brand deserve more than visibility—you deserve credibility and meaningful connection. We help businesses, founders, organizations, and events build a trusted reputation through strategic storytelling, media engagement, and effective communication.",
      items: [
        "Public relations packages",
        "Event PR and event coverage",
        "The Pinnacle Magazine",
        "Press (newspaper/magazine) publication",
        "Billboard placement",
      ],
      ctaLabel: "Learn more",
      ctaHref: "/pr",
    },
    marketplace: {
      eyebrow: "Digital marketplace",
      heading: "Build. Scale. Sell. Grow.",
      body: "Not a pile of standalone services. One commerce ecosystem: branding, content, website, ads, customer experience and analytics, planned and run together.",
      ctaLabel: "Learn more",
      ctaHref: "/digital-ecosystem",
    },
    media: {
      eyebrow: "Media services",
      heading: "Seven packages. Click one to see the deliverables.",
      linkLabel: "Learn more →",
      enquireLabel: "Enquire",
    },
    summit: {
      eyebrow: "The Summit",
      heading: "Betaminds Africa Creative Empowerment Summit",
      body: "More than an annual event. It's a movement turning creative talent into careers and businesses that last.",
      image: IMG(8761808, 1800),
      imageAlt: "Summit attendee",
      ctaLabel: "Learn more →",
      ctaHref: "/summit",
    },
    portfolio: {
      eyebrow: "Projects",
      heading: "Selected work.",
      note: "Hover for industry & service.",
      viewLabel: "View project",
      /** How many of the projects to show on the homepage grid. */
      limit: 6,
      allLinkLabel: "Learn more →",
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
      ctaLabel: "Learn more →",
      ctaHref: "/academy",
      /**
       * Real courses from the schools below, not generic training formats —
       * a visitor should see what they'd actually be learning, not a label
       * like "Masterclass" that could describe any of them.
       */
      grid: [
        { label: "Photography", image: IMG(3184291, 600) },
        { label: "Videography", image: IMG(2529159, 600) },
        { label: "Content Creation", image: IMG(3869639, 600) },
        { label: "Digital Marketing", image: IMG(7793169, 600) },
        { label: "UI/UX Design", image: IMG(8761715, 600) },
      ],
    },
    commercials: {
      eyebrow: "See it in motion",
      heading: "Two sides of the studio, on camera.",
      marketplace: {
        label: "Digital Marketplace",
        video: "",
        poster: "",
        posterAlt: "",
      },
      academy: {
        label: "Betaminds Academy",
        video: "",
        poster: "",
        posterAlt: "",
      },
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
    list: {
      items: [
        proj("Sunset Hospitality", "Hospitality", "Brand identity", IMG(9490631, 800), IMG(9490631, 1800)),
        proj("Nourish Med", "Healthcare", "Content & ads", IMG(8730849, 800), IMG(8730849, 1800)),
        proj("Charoite Homes", "Real estate", "Property film", IMG(12179670, 800), IMG(12179670, 1800)),
        proj("Mama Africa Foods", "FMCG", "Commerce ecosystem", IMG(9301528, 800), IMG(9301528, 1800)),
        proj("MKR Logistics", "Logistics", "Website design", IMG(5058927, 800), IMG(5058927, 1800)),
        proj("Glams Beauty", "Beauty", "Social management", IMG(4183516, 800), IMG(4183516, 1800)),
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
      title: "Digital Marketplace — Betaminds Africa",
      description:
        "Build. Scale. Sell. Grow. One integrated digital commerce solution: branding, content, website, ads, customer experience and analytics.",
    },
    hero: {
      image: IMG(5060980, 1800),
      imageAlt: "Building a digital marketplace",
      eyebrow: "Digital marketplace",
      heading: "Digital Marketplace",
      accentLine: "Build. Scale. Sell. Grow.",
      lead: "Growth is driven by visibility, strategy, technology and customer experience. We help businesses build, launch, market and grow their online presence through one integrated solution instead of a pile of standalone services.",
      ctaLabel: "Book a discovery call →",
      ctaHref: "#book",
    },
    statement: {
      lines: [
        "One partner",
        "One unified strategy",
        "Multiple digital solutions",
        "Better results",
      ],
    },
    promo: {
      label: "See it in motion",
      heading: "What a Digital Marketplace build looks like",
      body: "A walkthrough of a recent build: the strategy, the storefront, the launch.",
      video: "",
      poster: "",
      posterAlt: "",
    },
    plans: {
      heading: "Engagement plans",
      lead: "Bundled packages, not a pile of standalone services — every tier below carries everything in the one before it.",
      /** The Growth plan is highlighted — index 1, matching the prototype's `plan: 1`. */
      featuredIndex: 1,
      selectLabel: "Select Plan",
      items: [
        {
          name: "Starter Partnership",
          tag: "Establish",
          duration: "3 months",
          short:
            "For businesses establishing, repositioning, or accelerating their digital presence with a focused commerce strategy and execution plan.",
        },
        {
          name: "Growth Partnership",
          tag: "Most chosen",
          duration: "6 months",
          short:
            "For businesses seeking sustained digital growth, stronger market positioning, and continuous optimization across the ecosystem.",
        },
        {
          name: "Strategic Partnership",
          tag: "Scale",
          duration: "1 year",
          short:
            "A long-term engagement for businesses scaling digital operations, deepening customer relationships, and driving consistent growth.",
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
      body: "A few direct questions — about a minute — so we can prepare for the call.",
      steps: [
        "Answer a few quick questions.",
        "You get a link to pick a time on our calendar.",
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
      submitLabel: "Book a consultation session",
      successHeading: "Thank you. We have your answers.",
      successBody:
        "We review every questionnaire before the call. You'll hear from us within one working day with your scheduling link and, where a booking fee applies, the payment details.",
      /**
       * The outline shown beside the form is derived from these labels, so
       * there is one source of truth.
       */
      groups: [
        {
          title: "Your business",
          fields: [
            f("businessName", "Business name", "text", {
              required: true,
              half: true,
            }),
            f("email", "Email", "email", {
              required: true,
              half: true,
              placeholder: "you@brand.com",
            }),
            f("phone", "Phone", "tel", { required: true, half: true }),
            f("location", "Business location", "text", {
              required: true,
              half: true,
            }),
            f("overview", "Briefly tell us about your business", "textarea", {
              required: true,
            }),
          ],
        },
        {
          title: "Where you are now",
          fields: [
            f(
              "businessType",
              "What best describes your business?",
              "radio",
              {
                required: true,
                options: [
                  "I'm launching a new business",
                  "I need a digital presence",
                  "I'm looking to grow my existing online business",
                  "I need better systems/processes",
                  "I'm repositioning/rebranding",
                ],
              },
            ),
            f("primaryGoal", "What is your primary goal right now?", "radio", {
              required: true,
              options: [
                "Build brand & digital presence",
                "Launch an online store/marketplace",
                "Increase sales & customer acquisition",
                "Improve existing digital platforms",
                "Scale my online business",
                "Build a stronger long-term digital strategy",
              ],
            }),
            f(
              "hasWebsite",
              "Do you currently have a website or online store?",
              "radio",
              {
                required: true,
                options: [
                  "No, starting from scratch",
                  "Yes, but it needs improvement",
                  "Yes, but it's not generating enough sales",
                  "Yes, and I want to scale it",
                ],
              },
            ),
            f(
              "websiteDetail",
              "If yes, share the link or tell us a little more",
              "text",
            ),
            f(
              "socialActivity",
              "How active is your business on social media?",
              "radio",
              {
                required: true,
                options: [
                  "Not active",
                  "Somewhat active",
                  "Very active, but not converting",
                  "Active and generating sales",
                ],
              },
            ),
            f("socialHandle", "Your social media handle", "text", {
              half: true,
            }),
          ],
        },
        {
          title: "What you need",
          fields: [
            f(
              "helpNeeded",
              "What do you need the most help with? Select all that apply.",
              "multiselect",
              {
                required: true,
                options: [
                  "Brand identity & positioning",
                  "Website/e-commerce development",
                  "Social media management",
                  "Content creation",
                  "Digital advertising",
                  "SEO",
                  "Customer experience",
                  "Sales/conversion",
                  "Analytics & performance tracking",
                  "Complete digital growth solution",
                ],
              },
            ),
            f("stage", "What stage is your business currently in?", "radio", {
              required: true,
              options: [
                "Idea/Pre-launch",
                "New business",
                "Growing business",
                "Established business",
                "Scaling business",
              ],
            }),
          ],
        },
        {
          title: "Partnership & investment",
          fields: [
            // Options are replaced with the live engagement plans at render
            // time; these names are only the floor if that list is ever empty.
            f(
              "plan",
              "What level of support are you looking for?",
              "radio",
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
            f(
              "investment",
              "What is your expected investment level for digital growth?",
              "radio",
              {
                required: true,
                options: [
                  "₦500,000 – ₦1,500,000",
                  "₦1,500,000 – ₦3,000,000",
                  "₦3,000,000 – ₦5,000,000",
                  "I'm open to a recommended plan",
                ],
              },
            ),
            f("startTiming", "When would you like to start?", "radio", {
              required: true,
              options: [
                "Immediately",
                "Within 1 month",
                "Within 1–3 months",
                "I'm still planning",
              ],
            }),
          ],
        },
        {
          title: "Anything else",
          fields: [
            f(
              "notes",
              "Any other information or details you would like us to know",
              "textarea",
            ),
          ],
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
    proof: {
      heading: "The work behind the packages",
      linkLabel: "All projects",
    },
    packages: {
      contentsLabel: "In this page",
      deliverablesLabel: "Deliverables",
      enquirePrefix: "Enquire about",
      rateCardLabel: "View rate card",
      items: [
        {
          label: "Brand identity",
          blurb:
            "An identity system your team can actually use, not a logo file and good luck.",
          // Reuses the Brand identity project's own photo (Sunset Hospitality)
          // for visual continuity between the two.
          image: IMG(9490631, 900),
          items: [
            "Discovery & positioning workshop",
            "Logo suite and responsive marks",
            "Colour, type and layout system",
            "Brand guidelines document",
            "Stationery and social templates",
          ],
          // Pending upload via /admin.
          rateCard: "",
        },
        {
          label: "Company profile",
          blurb: "The document that opens doors before you walk in the room.",
          // Pending a real photo via /admin — falls back to no banner.
          image: "",
          items: [
            "Copywriting and narrative structure",
            "Editorial design and layout",
            "Infographics and data visuals",
            "Print-ready and digital versions",
          ],
          rateCard: "",
        },
        {
          label: "Content creation",
          blurb:
            "Commercial-grade content built around a calendar, not a whim.",
          // Reuses the Academy's Content Creation course photo.
          image: IMG(3869639, 900),
          items: [
            "Creative direction and shot list",
            "Photography, studio or on location",
            "Video production and editing",
            "Copy and caption bank",
            "Monthly content calendar",
          ],
          rateCard: "",
        },
        {
          label: "Website design",
          blurb:
            "Fast, clear sites designed to convert and easy for you to update.",
          // Reuses the Website design project's own photo (MKR Logistics).
          image: IMG(5058927, 900),
          items: [
            "UX structure and wireframes",
            "Responsive UI design",
            "Build, launch and handover",
            "SEO foundations",
            "Payment and analytics integration",
          ],
          rateCard: "",
        },
        {
          label: "Social media management",
          blurb: "Consistent presence, community and measurable growth.",
          // Reuses the Social management project's own photo (Glams Beauty).
          image: IMG(4183516, 900),
          items: [
            "Channel strategy and tone of voice",
            "Content scheduling and publishing",
            "Community management",
            "Influencer coordination",
            "Monthly analytics report",
          ],
          rateCard: "",
        },
        {
          label: "Property photography & videography",
          blurb: "Listings and developments that sell on sight.",
          // Reuses the Property film project's own photo (Charoite Homes).
          image: IMG(12179670, 900),
          items: [
            "Interior and exterior photography",
            "Walkthrough and drone video",
            "Twilight and lifestyle sets",
            "Retouching and delivery in listing formats",
          ],
          rateCard: "",
        },
        {
          label: "Ads campaign placement",
          blurb: "Paid media planned against a target, not a hunch.",
          // Reuses the Nourish Med project's photo (tagged "Content & ads").
          image: IMG(8730849, 900),
          items: [
            "Campaign strategy and audience mapping",
            "Creative production for ad formats",
            "Meta, Google and TikTok placement",
            "Budget management and pacing",
            "Weekly optimization and reporting",
          ],
          rateCard: "",
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
          image: IMG(3184291, 1400),
          imageAlt: "Students in a Betaminds Academy creative media class",
          courses: [
            {
              name: "Photography",
              icon: "camera",
              duration: "10 weeks",
              mode: "Hybrid",
              // Reuses the same placeholder as the homepage's academy grid,
              // for visual continuity between the two.
              image: IMG(3184291, 900),
              description:
                "Camera fundamentals, lighting and composition through to a portfolio-ready editorial shoot.",
            },
            {
              name: "Videography",
              icon: "video",
              duration: "12 weeks",
              mode: "Physical",
              image: IMG(2529159, 900),
              description:
                "Camera operation, shot-listing and on-set craft for narrative, commercial and event film.",
            },
            {
              name: "Content Creation",
              icon: "pen",
              duration: "8 weeks",
              mode: "Hybrid",
              image: IMG(3869639, 900),
              description:
                "Planning, filming and editing short-form content for brands and personal platforms.",
            },
            {
              name: "Animation",
              icon: "film",
              duration: "12 weeks",
              mode: "Virtual",
              // No placeholder picked for this one — pending a real or
              // stock photo added through /admin. Falls back to the icon.
              image: "",
              description:
                "2D animation principles, storyboarding and production workflow from concept to render.",
            },
            {
              name: "Motion Graphics",
              icon: "sparkle",
              duration: "10 weeks",
              mode: "Hybrid",
              image: "",
              description:
                "Typography, compositing and animation for title sequences, ads and social content.",
            },
          ],
        },
        {
          name: "School of Digital Technology",
          image: IMG(4144923, 1400),
          imageAlt: "Students in a Betaminds Academy digital technology class",
          courses: [
            {
              name: "Digital Marketing",
              icon: "megaphone",
              duration: "12 weeks",
              mode: "Hybrid",
              image: IMG(7793169, 900),
              description:
                "Strategy, paid media, social and analytics for running campaigns that convert.",
            },
            {
              name: "UI/UX Design",
              icon: "layout",
              duration: "12 weeks",
              mode: "Hybrid",
              image: IMG(8761715, 900),
              description:
                "Research, wireframing and prototyping toward a shippable, user-tested product design.",
            },
            {
              name: "Website Development",
              icon: "code",
              duration: "16 weeks",
              mode: "Hybrid",
              image: "",
              description:
                "Front-end and back-end fundamentals through to a deployed, full-stack project.",
            },
            {
              name: "AI Productivity",
              icon: "cpu",
              duration: "6 weeks",
              mode: "Virtual",
              image: "",
              description:
                "Practical AI tooling for research, writing, design and workflow automation.",
            },
            {
              name: "SEO",
              icon: "search",
              duration: "6 weeks",
              mode: "Virtual",
              image: "",
              description:
                "Technical, on-page and content SEO to grow organic search visibility.",
            },
          ],
        },
      ],
    },
    crashCourses: {
      heading: "Crash courses",
      body: "Short, intensive sessions for one specific skill — two to three days, hands-on, no long commitment.",
      items: [
        {
          name: "Reels Editing Intensive",
          icon: "video",
          duration: "2 days",
          mode: "Physical",
          image: IMG(2529159, 400),
          description:
            "Hook, pace and edit short-form video that holds attention, using footage you bring on day one.",
        },
        {
          name: "AI Prompt Workshop",
          icon: "cpu",
          duration: "2 days",
          mode: "Virtual",
          image: "",
          description:
            "Practical prompting for research, writing and design work, with tools you'll use the same week.",
        },
        {
          name: "Portfolio Sprint",
          icon: "layout",
          duration: "3 days",
          mode: "Hybrid",
          image: "",
          description:
            "Leave with a finished, presentable portfolio built and critiqued over three focused days.",
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
        "Our admissions team will be in touch within one working day with next steps, fees and start dates. Payment information and prompts will be sent to your email after submission.",
      /**
       * The 'course' and 'format' dropdowns are filled from the Courses
       * section and the hero's learning formats at render time, so adding a
       * course or format here makes it available without touching this list.
       */
      groups: [
        {
          title: "Personal information",
          fields: [
            f("name", "Full name", "text", { required: true, half: true }),
            f("email", "Email address", "email", {
              required: true,
              half: true,
            }),
            f("phone", "Phone / WhatsApp number", "tel", {
              required: true,
              half: true,
            }),
            f("country", "Country of residence", "text", {
              required: true,
              half: true,
            }),
            f("cityState", "City / State", "text", {
              required: true,
              half: true,
            }),
            f("ageRange", "Age range", "radio", {
              required: true,
              options: ["Under 18", "18–24", "25–34", "35–44", "45 and above"],
            }),
            f("gender", "Gender", "radio", {
              required: true,
              options: ["Female", "Male", "Prefer not to say"],
            }),
          ],
        },
        {
          title: "Course selection",
          fields: [
            f("course", "Which course are you registering for?", "select", {
              required: true,
            }),
            f("format", "Preferred format", "select", { half: true }),
            f("whyCourse", "Why do you want to take this course?", "textarea", {
              required: true,
            }),
            f(
              "goals",
              "What do you hope to achieve after completing this course?",
              "textarea",
              { required: true },
            ),
            f(
              "hasExperience",
              "Do you already have experience in this area?",
              "radio",
              { required: true, options: ["Yes", "No"] },
            ),
            f(
              "experienceDetail",
              "If yes, briefly describe your previous experience",
              "textarea",
            ),
          ],
        },
        {
          title: "Experience & readiness",
          fields: [
            f(
              "skillLevel",
              "How would you rate your current skill level?",
              "radio",
              {
                required: true,
                options: ["Beginner", "Basic", "Intermediate", "Advanced"],
              },
            ),
            f(
              "occupation",
              "What is your current occupation/status?",
              "radio",
              {
                required: true,
                options: [
                  "Student",
                  "Employed",
                  "Self-employed/Business owner",
                  "Freelancer",
                  "Unemployed",
                  "Other",
                ],
              },
            ),
            f(
              "deviceAccess",
              "Do you have reliable access to a smartphone or computer and internet?",
              "radio",
              { required: true, options: ["Yes", "No"] },
            ),
          ],
        },
        {
          title: "Payment & enrolment",
          fields: [
            f(
              "paymentMethod",
              "How do you intend to pay for the course?",
              "text",
              { required: true },
            ),
            f("paymentCompleted", "Have you completed payment?", "radio", {
              required: true,
              options: ["Yes", "No"],
            }),
          ],
        },
        {
          title: "Commitment & confirmation",
          fields: [
            f(
              "hearAbout",
              "How did you hear about Betaminds Africa Academy?",
              "radio",
              {
                required: true,
                options: [
                  "Facebook",
                  "Instagram",
                  "WhatsApp",
                  "LinkedIn",
                  "TikTok",
                  "Referral",
                  "Website",
                  "Other",
                ],
              },
            ),
            f(
              "agreeComms",
              "Do you agree to receive important course-related communication from Betaminds Africa Academy via email/WhatsApp?",
              "radio",
              { required: true, options: ["Yes", "No"] },
            ),
          ],
        },
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
      nextLabel: "Third edition",
      nextDetail: "1 May 2027 · The Business of Creativity",
      ctaPrimary: "Register interest",
      ctaSecondary: "View sponsorship proposal",
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
          // The real event photos, not stock — pulled from the two Google
          // Drive folders shared for the first edition, and served as
          // static assets from this project rather than hotlinked: the
          // googleusercontent.com hotlink this replaced worked reliably
          // from curl and from this project's own test tooling, but failed
          // to load on a real phone in practice.
          gallery: [
            "/summit/first-edition/img-0334.jpg",
            "/summit/first-edition/img-0410.jpg",
            "/summit/first-edition/img-0458.jpg",
            "/summit/first-edition/img-0582.jpg",
            "/summit/first-edition/mo-00661.jpg",
            "/summit/first-edition/mo-00702.jpg",
          ],
          // "#" until a real gallery/album link is set — same placeholder
          // convention as the footer socials below.
          viewMoreLabel: "View more media",
          viewMoreHref: "#",
        },
        {
          edition: "Second edition",
          theme: "Turning creativity into careers",
          date: "17 July 2026",
          venue: "Gracetone Studio, Yaba, Lagos",
          /**
           * Still placeholder. The real photos are the two Pixieset
           * galleries (creative2career.pixieset.com and
           * betaminds.pixieset.com), which sit behind both a Cloudflare
           * bot challenge and their own password gate — not something to
           * script past, and proofing-gallery photography is typically
           * still the photographer's copyright even once a client has the
           * viewing password, so it needs a human decision either way.
           * Download the selects from Pixieset (the codes already shared)
           * and upload them in /admin → Summit → Editions.
           */
          gallery: [5466279, 9490631, 8761715, 7792860, 9301528, 5060991].map(
            (id) => IMG(id, 600),
          ),
          viewMoreLabel: "View more media",
          // The fuller Pixieset gallery this edition's uploaded selects come
          // from — gated, but a real destination rather than a placeholder.
          viewMoreHref: "https://creative2career.pixieset.com",
        },
      ],
      /**
       * The next edition — announced, not yet happened, so no gallery.
       * Rendered as its own card beneath the two above rather than folded
       * into that grid, since a photo-gallery card with no photos would
       * read as broken rather than upcoming.
       */
      upcoming: {
        edition: "Third edition",
        theme:
          "The Business of Creativity: Monetization, Innovation, and Lasting Impact",
        date: "1 May 2027",
        venue: "",
        ctaLabel: "Register interest →",
      },
    },
    press: {
      heading: "From the press",
      lead: "Coverage from past editions.",
      readLabel: "Read publication",
      items: [
        { title: "Punch Newspaper", cover: "", href: "" },
        { title: "Independent Newspaper", cover: "", href: "" },
      ],
    },
    /**
     * Real partner logos from the shared Drive folder, served as static
     * assets from this project (see the First edition gallery comment above
     * for why this moved off hotlinking).
     *
     * The folder held 16 files; this keeps 12. Dropped: two logos that were
     * byte-for-byte duplicates of another file in the set, one brand's two
     * colour variants (kept the one with dark marks, since the white-on-dark
     * variant would be invisible on this strip's light background), and one
     * logo that turned out to be a white/light-coloured mark on a
     * transparent background for the same reason — not missing, just not
     * usable here without a dark backing it doesn't have in this set.
     * No link URLs were supplied, so none of these are clickable yet.
     */
    participants: {
      label: "Partners & participants",
      logos: [
        { name: "Scream Media Africa", logo: "/partners/scream-media-africa.png", href: "" },
        { name: "Finex Branding Agency", logo: "/partners/finex-branding-agency.png", href: "" },
        { name: "BAT Events and Chops", logo: "/partners/bat-events-and-chops.png", href: "" },
        { name: "Café One", logo: "/partners/cafe-one.jpg", href: "" },
        { name: "Zorion Scent", logo: "/partners/zorion-scent.png", href: "" },
        { name: "Gracetone Digital Studio", logo: "/partners/gracetone-digital-studio.png", href: "" },
        { name: "Zam Zar TV", logo: "/partners/zam-zar-tv.png", href: "" },
        { name: "Swift Sip", logo: "/partners/swift-sip.jpg", href: "" },
        { name: "Leadway Assurance", logo: "/partners/leadway-assurance.png", href: "" },
        { name: "MKR", logo: "/partners/mkr.png", href: "" },
        { name: "Penmorph", logo: "/partners/penmorph.png", href: "" },
        { name: "Right Events", logo: "/partners/right-events.png", href: "" },
      ],
    },
    videos: {
      heading: "Watch highlights",
      lead: "Moments from past editions.",
      items: [{ title: "", youtubeUrl: "" }],
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
      ctaPrimary: "View proposal",
      ctaDownload: "Download proposal",
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
        f("name", "Full name", "text", { required: true, half: true }),
        f("email", "Email", "email", { required: true, half: true }),
        f("phone", "WhatsApp / Phone number", "tel", {
          required: true,
          half: true,
        }),
        f("cityState", "City & State", "text", { required: true, half: true }),
        f("describesYou", "What best describes you?", "radio", {
          required: true,
          options: [
            "Creative / Artist",
            "Entrepreneur",
            "Student",
            "Professional / Employee",
            "Organisation / Brand representative",
            "Other",
          ],
        }),
        f(
          "occupation",
          "Occupation / Business / Organisation",
          "text",
          { required: true, half: true },
        ),
        f("sector", "Creative / Professional sector", "text", {
          required: true,
          half: true,
        }),
        f("experienceYears", "Years of experience", "radio", {
          required: true,
          options: [
            "Under 1 year",
            "1–3 years",
            "3–5 years",
            "5–10 years",
            "10+ years",
          ],
        }),
        f("whyAttend", "Why do you want to attend?", "textarea", {
          required: true,
        }),
        f(
          "hopeToGain",
          "What do you hope to gain from the summit?",
          "textarea",
          { required: true },
        ),
        f(
          "biggestChallenge",
          "What is your biggest current challenge?",
          "textarea",
          { required: true },
        ),
        f("hearAbout", "How did you hear about the summit?", "radio", {
          required: true,
          options: [
            "Facebook",
            "Instagram",
            "WhatsApp",
            "LinkedIn",
            "TikTok",
            "Referral",
            "Website",
            "Other",
          ],
        }),
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
      stepsLabel: "What happens next",
      steps: [
        "You send the brief, or book a call.",
        "We reply within one working day.",
        "We tell you what we'd do first, and what it costs.",
      ],
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

  pr: {
    seo: {
      title: "PR & Event Coverage — Betaminds Africa",
      description:
        "Public relations packages, event PR and coverage, The Pinnacle Magazine, press features and billboard placements.",
    },
    hero: {
      image: IMG(3184291, 1800),
      imageAlt: "Press conference under lights",
      eyebrow: "Public relations",
      heading: "Your brand has a story — let's make sure the right people hear it",
      accentTail: ".",
      lead: "You and your brand deserve more than visibility—you deserve credibility and meaningful connection. We help businesses, founders, organizations, and events build a trusted reputation through strategic storytelling, media engagement, and effective communication.",
      ctaLabel: "Talk to the PR team →",
      ctaHref: "/lets-work?need=Public%20relations",
    },
    services: {
      heading: "Our PR Services Include:",
      items: [
        "Media Relations & Press Coverage",
        "Press Release Writing & Distribution",
        "Brand Storytelling",
        "Corporate Communications",
        "Event PR & Media Coverage",
        "Crisis Communication Support",
        "Influencer & Stakeholder Engagement",
        "Reputation Management",
      ],
      body1:
        "We help brands tell stories that matter. Through strategic public relations, we position your brand before the right audience, enhance its reputation, and build meaningful relationships with customers, stakeholders, and the media.",
      body2:
        "From product launches and corporate announcements to event publicity and brand reputation management, Betaminds Africa develops tailored PR strategies that increase visibility, strengthen credibility, and create lasting impact.",
    },
    packages: {
      heading: "PR packages",
      lead: "Five ways to work with us — three monthly retainers, plus a one-off launch package and a personal engagement for the person in front of the brand.",
      selectLabel: "Enquire →",
      bestForLabel: "Best for",
      deliverablesLabel: "Deliverables",
      featuredIndex: 1,
      items: [
        {
          name: "Starter",
          tag: "Establish",
          short: "For startups, SMEs and emerging brands.",
          items: [
            "PR strategy and monthly media plan",
            "1 professionally written press release",
            "3–5 online media placements",
            "Brand/company profile feature",
            "Social media PR amplification",
            "PR performance report",
          ],
          bestFor:
            "Brands looking to establish credibility and begin building media presence.",
        },
        {
          name: "Growth",
          tag: "Build",
          short: "For growing businesses ready for stronger visibility.",
          items: [
            "Everything in Starter",
            "2 press releases",
            "6–10 media placements",
            "1 executive interview opportunity",
            "Digital PR campaign",
            "Influencer/creator outreach",
            "Social media amplification",
            "Media opportunity sourcing",
            "Brand reputation monitoring",
            "Monthly PR strategy meeting",
            "Detailed monthly performance report",
          ],
          bestFor:
            "SMEs, founders, startups, real estate, hospitality, technology, creative and lifestyle brands.",
        },
        {
          name: "Authority",
          tag: "Lead",
          short: "For established brands, executives and organisations.",
          items: [
            "Everything in Growth",
            "3–4 strategic press releases",
            "10–15+ targeted media placements",
            "TV/Radio interview pitching",
            "Opinion/editorial placements",
            "Podcast and digital interview opportunities",
            "Awards & recognition strategy",
            "Speaking opportunity sourcing",
            "Influencer/KOL partnerships",
            "Detailed monthly performance report",
          ],
          bestFor:
            "CEOs, corporate brands, institutions and organisations seeking industry authority.",
        },
        {
          name: "Launch PR Package",
          tag: "One-off",
          short:
            "For product, company, service, event or brand launches.",
          items: [
            "Launch PR strategy",
            "Press release development",
            "5–9 media placements",
            "Founder/CEO interview positioning",
            "Online publication features",
            "Influencer/creator amplification",
            "Event videography",
            "Photography",
            "Red carpet hosting",
            "Post-launch media report",
          ],
          bestFor:
            "New business launches, product launches, events and campaigns.",
        },
        {
          name: "Founder & Executive PR",
          tag: "Personal",
          short: "For the person in front of the brand.",
          items: [
            "Media profile",
            "Monthly opinion article",
            "Media interview pitching",
            "Podcast opportunities",
            "Speaking opportunity sourcing",
            "Personal reputation monitoring",
            "Executive media coaching",
          ],
          bestFor: "",
        },
      ],
    },
    event: {
      eyebrow: "Event PR",
      heading: "Event PR and event coverage",
      body: "One package covering the run-up, the day itself and everything published straight after.",
      items: [
        "Story post of the event poster before the day",
        "2 feed posts of the event before the day (graphics & reel)",
        "Story post of the event activities during the day",
        "Event coverage — 6 posts of the event, published within 12 hours",
        "Red carpet hosting",
      ],
      ctaLabel: "Enquire about event PR",
      ctaHref: "/lets-work?need=PR%20%E2%80%94%20Event%20PR%20and%20coverage",
    },
    magazine: {
      eyebrow: "The Pinnacle Magazine",
      heading: "Read the latest issue",
      body: "The Pinnacle Magazine is Africa's premier publication dedicated to spotlighting visionary leaders, innovative brands, entrepreneurs, creatives, and impactful stories shaping Africa's future. Through compelling features, interviews, and industry insights, we provide a credible platform for individuals and businesses to share their journey, amplify their influence, and connect with a wider audience. We are dedicated to quality storytelling around African culture, fashion, music, governance, women of impact, innovation in tech and business, youth empowerment and Next-Gen sustainability.",
      // Pending upload via /admin — the first-edition PDF is a 400MB file,
      // too large to host as a static asset in this repo. The cover and a
      // gallery (also pending) follow once that's in place.
      cover: "",
      coverAlt: "The Pinnacle Magazine, latest issue cover",
      pdf: "",
      ctaLabel: "Read the magazine →",
      gallery: [] as string[],
    },
    press: {
      eyebrow: "In the press",
      heading: "Press",
      lead: "Newspaper and magazine features we have placed and appeared in.",
      // Pending upload via /admin.
      featuredImage: "",
      featuredImageAlt: "",
      readLabel: "Read more",
      items: [
        {
          title:
            "Funke Ajayi: Reimagining African Fashion Through Clothings by FMK's Heritage-Inspired Designs",
          cover: "",
          href: "https://www.thisdaylive.com/2026/09/19/funke-ajayi-reimagining-african-fashion-through-clothings-by-fmks-heritage-inspired-designs/",
        },
        {
          title:
            "Made King Realties Redefines Short-Let Hospitality With All-in-One Guest Experience",
          cover: "",
          href: "https://www.thisdaylive.com/2026/02/07/made-king-realties-redefines-short-let-hospitality-with-all-in-one-guest-experience/",
        },
        {
          title:
            "Benson Awoyinka, Funke Akindele, Stephen Akintayo & Others Honoured as Person of the Year",
          cover: "",
          href: "https://www.vanguardngr.com/2025/01/benson-awoyinka-funke-akindele-stephen-akintayo-others-honoured-as-person-of-the-year/",
        },
        {
          title:
            "Turning Creativity Into Careers: Betaminds Africa Champions Youth Empowerment",
          cover: "",
          href: "https://independent.ng/turning-creativity-into-careers-betaminds-africa-champions-youth-empowerment/",
        },
        {
          title: "Olubukola Adenugba Wins Fashion Award",
          cover: "",
          href: "https://punchng.com/olubukola-adenugba-wins-fashion-award/",
        },
        {
          title:
            "NCC Chairman Idris Olorunnimbe Honoured at the West Africa On Point's Person of the Year Awards 2025",
          cover: "",
          href: "https://guardian.ng/news/ncc-chairman-idris-olorunnimbe-honoured-at-the-west-africa-on-points-person-of-the-year-awards-2025/",
        },
        {
          title: "Firm Unveils Initiative to Empower Young Nigerian Creatives",
          cover: "",
          href: "https://punchng.com/firm-unveils-initiative-to-empower-young-nigerian-creatives/",
        },
        {
          title:
            "Umunubo, Arogundade, Sir Uyi, Don Jazzy & Others Receive West Africa On Point Person of the Year Honours",
          cover: "",
          href: "https://guardian.ng/saturday-magazine/youth-magazine/umunubo-arogundade-sir-uyi-don-jazzy-others-receive-west-africa-on-point-person-of-the-year-honours/",
        },
        {
          title:
            "Making It Stand Worthwhile Is Biggest Challenge for Start-ups — Okunrotifa Ileriayo",
          cover: "",
          href: "https://www.vanguardngr.com/2023/01/making-it-stand-worthwhile-is-biggest-challenge-for-start-ups-okunrotifa-ileriayo/",
        },
        {
          title:
            "Creativity as a Tool for Business Socio-Economic Growth — Okunrotifa Ileriayo",
          cover: "",
          href: "https://independent.ng/creativity-as-a-tool-for-business-socio-economic-growth-okunrotifa-ileriayo/",
        },
      ],
    },
    billboards: {
      heading: "Billboard placements",
      lead: "Out-of-home work, in market.",
      images: [] as string[],
    },
  },
};

export type ContentDefaults = typeof defaults;
export type DocId = keyof ContentDefaults;

export const DOC_IDS = Object.keys(defaults) as DocId[];
