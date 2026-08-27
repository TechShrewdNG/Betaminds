/**
 * The editing schema.
 *
 * This describes the shape of every content document so the admin can render a
 * form for it generically — there are no hand-written editor screens. It mirrors
 * `defaults.ts`: same document ids, same section keys, same field keys. When you
 * add a field, add it in both places.
 */

export type Field =
  | { kind: "text"; label: string; help?: string; mono?: boolean }
  | { kind: "textarea"; label: string; rows?: number; help?: string }
  | { kind: "number"; label: string; help?: string }
  | { kind: "boolean"; label: string; help?: string }
  | { kind: "image"; label: string; ratio?: string; help?: string }
  | { kind: "video"; label: string; help?: string }
  | { kind: "images"; label: string; help?: string }
  | { kind: "list"; label: string; help?: string; placeholder?: string }
  | { kind: "select"; label: string; options: string[]; help?: string }
  | { kind: "group"; label: string; fields: Fields; help?: string }
  | {
      kind: "repeater";
      label: string;
      itemLabel: string;
      /** Field key used as the row title in the collapsed admin list. */
      titleKey: string;
      fields: Fields;
      help?: string;
    };

export type Fields = Record<string, Field>;

export type SectionSchema = {
  key: string;
  title: string;
  note?: string;
  fields: Fields;
};

export type DocSchema = {
  id: string;
  title: string;
  route: string | null;
  blurb: string;
  sections: SectionSchema[];
};

/* -- shared field fragments ------------------------------------------------ */

const seo: SectionSchema = {
  key: "seo",
  title: "Search & social",
  note: "Shown in search results and link previews.",
  fields: {
    title: { kind: "text", label: "Page title" },
    description: { kind: "textarea", label: "Meta description", rows: 3 },
  },
};

const linkFields: Fields = {
  label: { kind: "text", label: "Label" },
  href: { kind: "text", label: "Link" },
};

/**
 * The editable definition of one form field. Reused by every form so the studio
 * meets the same controls wherever they are.
 */
const formFieldSchema: Fields = {
  label: { kind: "text", label: "Question / label" },
  key: {
    kind: "text",
    label: "Field key",
    mono: true,
    help: "The stable name this answer is stored under. Renaming the label is free; changing the key orphans answers already collected under the old one.",
  },
  type: {
    kind: "select",
    label: "Type",
    options: ["text", "email", "tel", "date", "url", "textarea", "select"],
  },
  options: {
    kind: "list",
    label: "Dropdown options",
    help: "Only used when the type is 'select'. A select with no options falls back to a text box.",
  },
  required: { kind: "boolean", label: "Required" },
  placeholder: { kind: "text", label: "Placeholder" },
  width: {
    kind: "select",
    label: "Width",
    options: ["full", "half"],
    help: "Two consecutive half-width fields sit side by side on desktop.",
  },
};

const formFieldsRepeater = (label: string, help?: string): Field => ({
  kind: "repeater",
  label,
  itemLabel: "Field",
  titleKey: "label",
  fields: formFieldSchema,
  help,
});

const faqSection = (note: string): SectionSchema => ({
  key: "faq",
  title: "FAQ",
  note,
  fields: {
    heading: { kind: "text", label: "Heading" },
    items: {
      kind: "repeater",
      label: "Questions",
      itemLabel: "Question",
      titleKey: "q",
      fields: {
        q: { kind: "text", label: "Question" },
        a: { kind: "textarea", label: "Answer", rows: 6 },
      },
    },
  },
});

const heroImage = (ratio: string, help?: string): Fields => ({
  image: { kind: "image", label: "Background photograph", ratio, help },
  imageAlt: {
    kind: "text",
    label: "Image description",
    help: "Read aloud by screen readers. Describe what the photo shows.",
  },
});

/* -- documents ------------------------------------------------------------- */

export const schemas: DocSchema[] = [
  {
    id: "global",
    title: "Site-wide",
    route: null,
    blurb:
      "Logo, navigation, contact details, socials and the footer. Appears on every page.",
    sections: [
      {
        key: "brand",
        title: "Brand",
        fields: {
          logo: {
            kind: "image",
            label: "Logo",
            help: "876×400 source. The header crops it to a mark; the footer uses the full lockup. Supply an SVG when you have one.",
          },
          wordmark: { kind: "text", label: "Wordmark" },
          wordmarkSub: { kind: "text", label: "Wordmark second line" },
          tagline: { kind: "textarea", label: "Footer tagline", rows: 2 },
        },
      },
      {
        key: "nav",
        title: "Navigation",
        fields: {
          items: {
            kind: "repeater",
            label: "Links",
            itemLabel: "Link",
            titleKey: "label",
            fields: linkFields,
          },
          ctaLabel: { kind: "text", label: "Header button label" },
          ctaHref: { kind: "text", label: "Header button link" },
        },
      },
      {
        key: "contact",
        title: "Contact details",
        note: "Used on Let's Work, inside the footer flap, and in the footer.",
        fields: {
          rows: {
            kind: "repeater",
            label: "Details",
            itemLabel: "Detail",
            titleKey: "label",
            fields: {
              label: { kind: "text", label: "Label" },
              value: { kind: "text", label: "Value" },
            },
          },
          socialsLabel: { kind: "text", label: "Socials heading" },
          socials: {
            kind: "repeater",
            label: "Social links",
            itemLabel: "Social",
            titleKey: "label",
            fields: {
              label: {
                kind: "text",
                label: "Short label",
                help: "Two letters, e.g. IG, IN, X.",
              },
              href: { kind: "text", label: "Profile URL" },
            },
          },
        },
      },
      {
        key: "whatsapp",
        title: "Floating WhatsApp button",
        note: "Shown bottom-right on every public page once a number is set. Turning this off hides it even with a number saved.",
        fields: {
          enabled: { kind: "boolean", label: "Show the button" },
          number: {
            kind: "text",
            label: "WhatsApp number",
            mono: true,
            help: "Include the country code, e.g. 2348012345678. Spaces, dashes and a leading + are fine — they're stripped automatically.",
          },
          message: {
            kind: "textarea",
            label: "Pre-filled message",
            rows: 2,
            help: "Opens already typed into the chat, ready to send.",
          },
        },
      },
      {
        key: "footer",
        title: "Footer",
        note: "The envelope flap opens to reveal the back face.",
        fields: {
          columns: {
            kind: "repeater",
            label: "Quick-link columns",
            itemLabel: "Column",
            titleKey: "title",
            fields: {
              title: { kind: "text", label: "Column heading" },
              links: {
                kind: "repeater",
                label: "Links",
                itemLabel: "Link",
                titleKey: "label",
                fields: linkFields,
              },
            },
          },
          flapHintClosed: { kind: "text", label: "Flap hint (closed)" },
          flapHintOpen: { kind: "text", label: "Flap hint (open)" },
          flapFront: { kind: "textarea", label: "Front face line", rows: 2 },
          flapBack: { kind: "textarea", label: "Back face line", rows: 3 },
          flapCtaLabel: { kind: "text", label: "Flap button label" },
          flapCtaHref: { kind: "text", label: "Flap button link" },
          copyright: { kind: "text", label: "Copyright line" },
          legalLinks: {
            kind: "repeater",
            label: "Legal links",
            itemLabel: "Link",
            titleKey: "label",
            fields: linkFields,
          },
        },
      },
    ],
  },

  {
    id: "home",
    title: "Homepage",
    route: "/",
    blurb: "Positions the brand and routes visitors to the three business lines.",
    sections: [
      seo,
      {
        key: "heroSlider",
        title: "Opening slider",
        note: "These slides run twice: as the full-screen splash visitors land on at betaminds.africa, and as the homepage hero once they are inside the site.",
        fields: {
          enabled: {
            kind: "boolean",
            label: "Show the splash screen",
            help: "Off sends visitors straight to the homepage. The slides still open the homepage itself — this only controls the full-screen splash at the front.",
          },
          autoplay: {
            kind: "boolean",
            label: "Advance automatically",
            help: "Visitors who ask their device to reduce motion never get autoplay, whatever this is set to.",
          },
          interval: {
            kind: "number",
            label: "Seconds per slide",
            help: "Only used when advancing automatically. Below 2 is ignored.",
          },
          overlay: {
            kind: "number",
            label: "Background tint (0-100)",
            help: "How much the picture or video is faded behind the words. Lower shows more of it; raise it if a headline gets hard to read against busy footage. The tint is weighted to the bottom, so the top of the frame always stays clearer.",
          },
          slides: {
            kind: "repeater",
            label: "Slides",
            itemLabel: "Slide",
            titleKey: "heading",
            fields: {
              eyebrow: { kind: "text", label: "Pill label", mono: true },
              heading: { kind: "textarea", label: "Headline", rows: 2 },
              body: { kind: "textarea", label: "Body", rows: 3 },
              video: {
                kind: "video",
                label: "Background video",
                help: "Plays muted and looping, cropped to cover. Leave empty to use the picture instead. Keep it short and compressed — visitors download it before they see anything.",
              },
              image: {
                kind: "image",
                label: "Background picture",
                ratio: "16 / 9",
                help: "Shown while the video loads, when there's no video, and on devices that won't autoplay it. Always set one.",
              },
              imageAlt: { kind: "text", label: "Picture alt text" },
              primaryLabel: { kind: "text", label: "Button label" },
              primaryHref: { kind: "text", label: "Button link" },
              secondaryLabel: {
                kind: "text",
                label: "Second button label",
                help: "Leave empty for a single button.",
              },
              secondaryHref: { kind: "text", label: "Second button link" },
            },
          },
        },
      },
      {
        key: "statement",
        title: "Statement band",
        note: "A scrolling strip of short brand lines, set large on ink between two sections. Keep them short — they move while you read them. Empty the list to remove the band.",
        fields: {
          lines: { kind: "list", label: "Lines" },
        },
      },
      {
        key: "trusted",
        title: "Trusted by",
        note: "Scrolling client-logo strip. Leave a logo empty to show the name in a dashed placeholder box.",
        fields: {
          label: { kind: "text", label: "Strip label", mono: true },
          logos: {
            kind: "repeater",
            label: "Clients",
            itemLabel: "Client",
            titleKey: "name",
            fields: {
              name: { kind: "text", label: "Client name" },
              logo: { kind: "image", label: "Logo" },
            },
          },
        },
      },
      {
        key: "about",
        title: "01 / Who we are",
        fields: {
          eyebrow: { kind: "text", label: "Eyebrow", mono: true },
          heading: { kind: "textarea", label: "Heading", rows: 2 },
          body1: { kind: "textarea", label: "First paragraph", rows: 4 },
          body2: { kind: "textarea", label: "Second paragraph", rows: 2 },
          ctaLabel: { kind: "text", label: "Button label" },
          ctaHref: { kind: "text", label: "Button link" },
          image: { kind: "image", label: "Photograph", ratio: "16 / 10" },
          imageAlt: { kind: "text", label: "Image description" },
          pillars: {
            kind: "repeater",
            label: "Pillar cards",
            itemLabel: "Pillar",
            titleKey: "kicker",
            fields: {
              kicker: { kind: "text", label: "Kicker", mono: true },
              body: { kind: "textarea", label: "Body", rows: 3 },
            },
          },
          notForTitle: { kind: "text", label: "Panel heading", mono: true },
          notFor: { kind: "list", label: "Bullets" },
        },
      },
      {
        key: "team",
        title: "02 / Meet the spark",
        note: "Portraits are 3/4. Hovering a card reveals the social buttons.",
        fields: {
          eyebrow: { kind: "text", label: "Eyebrow", mono: true },
          heading: { kind: "text", label: "Heading" },
          members: {
            kind: "repeater",
            label: "Team",
            itemLabel: "Member",
            titleKey: "name",
            fields: {
              name: { kind: "text", label: "Name" },
              role: { kind: "text", label: "Role" },
              image: { kind: "image", label: "Portrait", ratio: "3 / 4" },
              instagram: { kind: "text", label: "Instagram URL" },
              linkedin: { kind: "text", label: "LinkedIn URL" },
            },
          },
        },
      },
      {
        key: "marketplace",
        title: "03 / Digital marketplace",
        note: "The three plan cards on the right are pulled from Digital Marketplace → Engagement plans, so there is one place to edit them.",
        fields: {
          eyebrow: { kind: "text", label: "Eyebrow", mono: true },
          heading: { kind: "text", label: "Heading" },
          body: { kind: "textarea", label: "Body", rows: 3 },
          ctaLabel: { kind: "text", label: "Button label" },
          ctaHref: { kind: "text", label: "Button link" },
        },
      },
      {
        key: "media",
        title: "04 / Media services",
        note: "The tabs and deliverables come from the Media Services page.",
        fields: {
          eyebrow: { kind: "text", label: "Eyebrow", mono: true },
          heading: { kind: "textarea", label: "Heading", rows: 2 },
          linkLabel: { kind: "text", label: "Link label" },
          enquireLabel: { kind: "text", label: "Enquire button label" },
        },
      },
      {
        key: "summit",
        title: "05 / The Summit",
        note: "The stat row is pulled from the Summit page.",
        fields: {
          eyebrow: { kind: "text", label: "Eyebrow", mono: true },
          heading: { kind: "textarea", label: "Heading", rows: 2 },
          body: { kind: "textarea", label: "Body", rows: 3 },
          ...heroImage("16 / 9"),
          ctaLabel: { kind: "text", label: "Button label" },
          ctaHref: { kind: "text", label: "Button link" },
        },
      },
      {
        key: "portfolio",
        title: "Projects",
        note: "The tiles come from the Projects document, so each one links to its own case study. This section only controls the heading and how many are shown.",
        fields: {
          eyebrow: { kind: "text", label: "Eyebrow", mono: true },
          heading: { kind: "text", label: "Heading" },
          note: { kind: "text", label: "Aside" },
          viewLabel: { kind: "text", label: "Hover button label" },
          limit: {
            kind: "number",
            label: "How many to show",
            help: "The rest are still on /projects.",
          },
          allLinkLabel: { kind: "text", label: "Link to all work" },
        },
      },
      {
        key: "testimonials",
        title: "Testimonials",
        note: "Shown one at a time with prev/next controls.",
        fields: {
          label: { kind: "text", label: "Panel label", mono: true },
          items: {
            kind: "repeater",
            label: "Testimonials",
            itemLabel: "Testimonial",
            titleKey: "name",
            fields: {
              quote: { kind: "textarea", label: "Quote", rows: 3 },
              name: { kind: "text", label: "Name" },
              company: { kind: "text", label: "Company" },
              image: { kind: "image", label: "Avatar", ratio: "1 / 1" },
            },
          },
        },
      },
      {
        key: "academy",
        title: "07 / Betaminds Academy",
        fields: {
          eyebrow: { kind: "text", label: "Eyebrow", mono: true },
          heading: { kind: "text", label: "Heading" },
          ctaLabel: { kind: "text", label: "Button label" },
          ctaHref: { kind: "text", label: "Button link" },
          grid: {
            kind: "repeater",
            label: "Portrait grid",
            itemLabel: "Tile",
            titleKey: "label",
            fields: {
              label: { kind: "text", label: "Caption" },
              image: { kind: "image", label: "Photograph", ratio: "3 / 4" },
            },
          },
        },
      },
      {
        key: "commercials",
        title: "Commercials",
        note: "Two videos, side by side. A side with no video is skipped, and the whole section disappears if both are empty.",
        fields: {
          eyebrow: { kind: "text", label: "Eyebrow", mono: true },
          heading: { kind: "text", label: "Heading" },
          marketplace: {
            kind: "group",
            label: "Digital Marketplace commercial",
            fields: {
              label: { kind: "text", label: "Caption", mono: true },
              video: { kind: "video", label: "Video" },
              poster: { kind: "image", label: "Poster frame", ratio: "16 / 9" },
              posterAlt: { kind: "text", label: "Poster description" },
            },
          },
          academy: {
            kind: "group",
            label: "Academy commercial",
            fields: {
              label: { kind: "text", label: "Caption", mono: true },
              video: { kind: "video", label: "Video" },
              poster: { kind: "image", label: "Poster frame", ratio: "16 / 9" },
              posterAlt: { kind: "text", label: "Poster description" },
            },
          },
        },
      },
      {
        key: "finalCta",
        title: "08 / Final CTA",
        fields: {
          eyebrow: { kind: "text", label: "Eyebrow", mono: true },
          heading: { kind: "textarea", label: "Heading", rows: 2 },
          ctaLabel: { kind: "text", label: "Button label" },
          ctaHref: { kind: "text", label: "Button link" },
          ...heroImage("16 / 9"),
        },
      },
    ],
  },

  {
    id: "projects",
    title: "Projects",
    route: "/projects",
    blurb:
      "Case studies. Each project gets its own page at /projects/<slug>, and the homepage grid is drawn from this list.",
    sections: [
      seo,
      {
        key: "index",
        title: "Projects index page",
        fields: {
          eyebrow: { kind: "text", label: "Eyebrow", mono: true },
          heading: { kind: "text", label: "Heading" },
          accentTail: { kind: "text", label: "Heading accent tail" },
          lead: { kind: "textarea", label: "Lead paragraph", rows: 3 },
          readLabel: { kind: "text", label: "Card link label" },
          emptyMessage: {
            kind: "textarea",
            label: "Shown when nothing is published",
            rows: 2,
          },
        },
      },
      {
        key: "detail",
        title: "Case-study page labels",
        note: "Section headings used on every project page.",
        fields: {
          briefLabel: { kind: "text", label: "Brief label", mono: true },
          challengeLabel: { kind: "text", label: "Challenge heading" },
          approachLabel: { kind: "text", label: "Approach heading" },
          outcomeLabel: { kind: "text", label: "Outcome heading" },
          resultsLabel: { kind: "text", label: "Results heading" },
          videoLabel: { kind: "text", label: "Commercial label", mono: true },
          galleryLabel: { kind: "text", label: "Gallery heading" },
          nextLabel: { kind: "text", label: "Next-project label", mono: true },
          ctaHeading: { kind: "text", label: "Closing CTA heading" },
          ctaLabel: { kind: "text", label: "Closing CTA button" },
          ctaHref: { kind: "text", label: "Closing CTA link" },
        },
      },
      {
        key: "list",
        title: "Projects",
        note: "Untick Published to keep a project off the site while you write it.",
        fields: {
          items: {
            kind: "repeater",
            label: "Projects",
            itemLabel: "Project",
            titleKey: "name",
            fields: {
              name: { kind: "text", label: "Project / client name" },
              slug: {
                kind: "text",
                label: "URL slug",
                mono: true,
                help: "Lowercase words separated by hyphens — this becomes /projects/<slug>. Changing it breaks any link already shared.",
              },
              published: { kind: "boolean", label: "Published" },
              industry: { kind: "text", label: "Industry" },
              service: { kind: "text", label: "Service" },
              year: { kind: "text", label: "Year" },
              client: { kind: "text", label: "Client (if different)" },
              image: { kind: "image", label: "Grid thumbnail", ratio: "4 / 3" },
              heroImage: {
                kind: "image",
                label: "Case-study hero",
                ratio: "16 / 9",
                help: "Falls back to the thumbnail if empty.",
              },
              summary: { kind: "textarea", label: "Summary", rows: 3 },
              challenge: { kind: "textarea", label: "The challenge", rows: 5 },
              approach: { kind: "textarea", label: "What we did", rows: 5 },
              outcome: { kind: "textarea", label: "The outcome", rows: 5 },
              results: {
                kind: "repeater",
                label: "Results",
                itemLabel: "Result",
                titleKey: "label",
                help: "Only add figures the client is happy to publish.",
                fields: {
                  n: { kind: "text", label: "Figure" },
                  label: { kind: "text", label: "Label" },
                },
              },
              gallery: { kind: "images", label: "Gallery" },
              video: {
                kind: "video",
                label: "Commercial",
                help: "A promo or campaign video for this project. Shown on the case study with the hero image as its poster. Leave empty to skip it.",
              },
              quote: { kind: "textarea", label: "Client quote", rows: 3 },
              quoteAuthor: { kind: "text", label: "Quote attribution" },
            },
          },
        },
      },
    ],
  },

  {
    id: "blog",
    title: "Blog",
    route: "/blog",
    blurb:
      "Posts. Each one gets its own page at /blog/<slug>, listed newest-first as added below.",
    sections: [
      seo,
      {
        key: "index",
        title: "Blog index page",
        fields: {
          eyebrow: { kind: "text", label: "Eyebrow", mono: true },
          heading: { kind: "text", label: "Heading" },
          accentTail: { kind: "text", label: "Heading accent tail" },
          lead: { kind: "textarea", label: "Lead paragraph", rows: 3 },
          readLabel: { kind: "text", label: "Card link label" },
          emptyMessage: {
            kind: "textarea",
            label: "Shown when nothing is published",
            rows: 2,
          },
        },
      },
      {
        key: "detail",
        title: "Post page labels",
        note: "Section labels used on every post page.",
        fields: {
          backLabel: { kind: "text", label: "Back-to-index label", mono: true },
          nextLabel: { kind: "text", label: "Next-post label", mono: true },
          ctaHeading: { kind: "text", label: "Closing CTA heading" },
          ctaLabel: { kind: "text", label: "Closing CTA button" },
          ctaHref: { kind: "text", label: "Closing CTA link" },
        },
      },
      {
        key: "list",
        title: "Posts",
        note: "Untick Published to keep a post off the site while you write it. New posts add to the end of this list — reorder rows to change display order.",
        fields: {
          items: {
            kind: "repeater",
            label: "Posts",
            itemLabel: "Post",
            titleKey: "title",
            fields: {
              title: { kind: "text", label: "Title" },
              slug: {
                kind: "text",
                label: "URL slug",
                mono: true,
                help: "Lowercase words separated by hyphens — this becomes /blog/<slug>. Changing it breaks any link already shared.",
              },
              published: { kind: "boolean", label: "Published" },
              author: { kind: "text", label: "Author" },
              date: {
                kind: "text",
                label: "Date",
                help: "Free text, e.g. \"January 2026\" — shown as written.",
              },
              coverImage: { kind: "image", label: "Cover image", ratio: "16 / 9" },
              excerpt: { kind: "textarea", label: "Excerpt", rows: 3 },
              body: {
                kind: "textarea",
                label: "Post body",
                rows: 12,
                help: "A blank line starts a new paragraph.",
              },
            },
          },
        },
      },
    ],
  },

  {
    id: "ecosystem",
    title: "Digital Marketplace",
    route: "/digital-ecosystem",
    blurb:
      "Digital Commerce & Marketplace Solutions, engagement plans and the discovery questionnaire.",
    sections: [
      seo,
      {
        key: "hero",
        title: "Hero",
        fields: {
          ...heroImage("16 / 9"),
          eyebrow: { kind: "text", label: "Eyebrow", mono: true },
          heading: { kind: "textarea", label: "Headline", rows: 2 },
          accentLine: {
            kind: "text",
            label: "Accent line",
            help: "Large light-weight line under the headline, in gold.",
          },
          lead: { kind: "textarea", label: "Lead paragraph", rows: 4 },
          ctaLabel: { kind: "text", label: "Button label" },
          ctaHref: { kind: "text", label: "Button link" },
        },
      },
      {
        key: "solution",
        title: "Our Digital Commerce Solution",
        fields: {
          heading: { kind: "text", label: "Heading" },
          body: { kind: "textarea", label: "Body", rows: 3 },
          items: {
            kind: "repeater",
            label: "Capabilities",
            itemLabel: "Capability",
            titleKey: "name",
            fields: {
              name: { kind: "text", label: "Name" },
              body: { kind: "textarea", label: "Body", rows: 3 },
            },
          },
        },
      },
      {
        key: "promo",
        title: "Commercial",
        note: "Shown before the engagement plans. Leave the video empty to skip this section entirely.",
        fields: {
          label: { kind: "text", label: "Eyebrow", mono: true },
          heading: { kind: "text", label: "Heading" },
          body: { kind: "textarea", label: "Body", rows: 3 },
          video: { kind: "video", label: "Video" },
          poster: {
            kind: "image",
            label: "Poster frame",
            ratio: "16 / 9",
            help: "Shown before the visitor presses play.",
          },
          posterAlt: { kind: "text", label: "Poster description" },
        },
      },
      {
        key: "plans",
        title: "Engagement plans",
        note: "Also rendered on the homepage. The featured plan gets the accent border and tint.",
        fields: {
          heading: { kind: "text", label: "Heading" },
          featuredIndex: {
            kind: "number",
            label: "Featured plan",
            help: "Zero-based. 1 highlights the second card (Growth), as designed.",
          },
          selectLabel: {
            kind: "text",
            label: "Select-plan button label",
            help: "Jumps to the questionnaire below with this plan pre-selected.",
          },
          items: {
            kind: "repeater",
            label: "Plans",
            itemLabel: "Plan",
            titleKey: "name",
            fields: {
              name: { kind: "text", label: "Name" },
              tag: { kind: "text", label: "Tag", mono: true },
              short: { kind: "textarea", label: "Summary", rows: 3 },
              includes: { kind: "list", label: "What's included" },
            },
          },
        },
      },
      {
        key: "notes",
        title: "Booking notes",
        fields: {
          paidLabel: { kind: "text", label: "Paid-session label", mono: true },
          paidBody: { kind: "textarea", label: "Paid-session body", rows: 4 },
          freeLabel: { kind: "text", label: "Free-slot label", mono: true },
          freeHeading: { kind: "text", label: "Free-slot heading" },
          freeBody: { kind: "textarea", label: "Free-slot body", rows: 3 },
        },
      },
      {
        key: "questionnaire",
        title: "Discovery questionnaire",
        note: "The eight-part form. Answers land in Submissions → Discovery consultation.",
        fields: {
          eyebrow: { kind: "text", label: "Eyebrow", mono: true },
          heading: { kind: "text", label: "Heading" },
          body: { kind: "textarea", label: "Body", rows: 3 },
          steps: { kind: "list", label: "How it works" },
          ctaLabel: { kind: "text", label: "Open-form button label" },
          schedulingUrl: {
            kind: "text",
            label: "Calendly / scheduling URL",
            help: "Shown on the success screen as the next step. Leave empty to hide it.",
          },
          submitLabel: { kind: "text", label: "Submit button label" },
          successHeading: { kind: "text", label: "Success heading" },
          successBody: { kind: "textarea", label: "Success body", rows: 4 },
          groups: {
            kind: "repeater",
            label: "Form sections",
            itemLabel: "Section",
            titleKey: "title",
            help: "These are the actual form fields. The outline shown beside the form is generated from them, so there is nothing to keep in sync.",
            fields: {
              title: { kind: "text", label: "Section title" },
              fields: formFieldsRepeater("Fields"),
            },
          },
        },
      },
    ],
  },

  {
    id: "media",
    title: "Media Services",
    route: "/media-services",
    blurb: "Seven packages, each expanding to its deliverables.",
    sections: [
      seo,
      {
        key: "hero",
        title: "Hero",
        fields: {
          ...heroImage("16 / 9"),
          eyebrow: { kind: "text", label: "Eyebrow", mono: true },
          heading: { kind: "textarea", label: "Headline", rows: 2 },
          accentTail: { kind: "text", label: "Headline accent tail" },
          lead: { kind: "textarea", label: "Lead paragraph", rows: 3 },
        },
      },
      {
        key: "proof",
        title: "Work",
        note: "Shows the three newest published projects.",
        fields: {
          heading: { kind: "text", label: "Heading" },
          linkLabel: { kind: "text", label: "Link label" },
        },
      },
      {
        key: "packages",
        title: "Packages",
        note: "Also drives the homepage media tabs.",
        fields: {
          contentsLabel: {
            kind: "text",
            label: "Hero contents label",
            mono: true,
            help: "Sits above the package list in the hero rail.",
          },
          deliverablesLabel: {
            kind: "text",
            label: "Deliverables label",
            mono: true,
          },
          enquirePrefix: {
            kind: "text",
            label: "Enquire button prefix",
            help: 'Rendered as "<prefix> <package name>".',
          },
          items: {
            kind: "repeater",
            label: "Packages",
            itemLabel: "Package",
            titleKey: "label",
            fields: {
              label: { kind: "text", label: "Package name" },
              blurb: { kind: "textarea", label: "Blurb", rows: 2 },
              items: { kind: "list", label: "Deliverables" },
            },
          },
        },
      },
    ],
  },

  {
    id: "academy",
    title: "Betaminds Academy",
    route: "/academy",
    blurb: "Courses, pathway, stats, student quotes and FAQ.",
    sections: [
      seo,
      {
        key: "hero",
        title: "Hero",
        fields: {
          image: { kind: "image", label: "Photograph", ratio: "4 / 5" },
          imageAlt: { kind: "text", label: "Image description" },
          eyebrow: { kind: "text", label: "Eyebrow", mono: true },
          heading: { kind: "text", label: "Headline" },
          subhead: { kind: "text", label: "Subhead" },
          lead: { kind: "textarea", label: "Lead paragraph", rows: 3 },
          formatsLabel: { kind: "text", label: "Formats label", mono: true },
          formats: { kind: "list", label: "Learning formats" },
          ctaLabel: { kind: "text", label: "Button label" },
          ctaHref: { kind: "text", label: "Button link" },
        },
      },
      {
        key: "courses",
        title: "Courses",
        note: "Each school becomes a tab.",
        fields: {
          heading: { kind: "text", label: "Heading" },
          certificateLabel: { kind: "text", label: "Certificate chip label" },
          enrolLabel: { kind: "text", label: "Enrol button label" },
          schools: {
            kind: "repeater",
            label: "Schools",
            itemLabel: "School",
            titleKey: "name",
            fields: {
              name: { kind: "text", label: "School name" },
              image: {
                kind: "image",
                label: "Classroom photo",
                ratio: "16 / 9",
              },
              imageAlt: { kind: "text", label: "Photo description" },
              courses: {
                kind: "repeater",
                label: "Courses",
                itemLabel: "Course",
                titleKey: "name",
                fields: {
                  name: { kind: "text", label: "Course" },
                  icon: {
                    kind: "select",
                    label: "Icon",
                    options: [
                      "camera", "video", "pen", "film", "sparkle",
                      "megaphone", "layout", "code", "cpu", "search",
                      "chart", "share", "identity", "strategy", "spark",
                    ],
                    help: "Shown on the course card and in its pop-up.",
                  },
                  duration: { kind: "text", label: "Duration" },
                  mode: { kind: "text", label: "Format" },
                  description: {
                    kind: "textarea",
                    label: "Description",
                    help: "Shown in the course's detail pop-up.",
                  },
                },
              },
            },
          },
        },
      },
      {
        key: "crashCourses",
        title: "Crash courses",
        note: "Short, 2-3 day sessions shown in their own row below the main schools — not a tab of their own.",
        fields: {
          heading: { kind: "text", label: "Heading" },
          body: { kind: "textarea", label: "Intro", rows: 2 },
          items: {
            kind: "repeater",
            label: "Crash courses",
            itemLabel: "Course",
            titleKey: "name",
            fields: {
              name: { kind: "text", label: "Course" },
              icon: {
                kind: "select",
                label: "Icon",
                options: [
                  "camera", "video", "pen", "film", "sparkle",
                  "megaphone", "layout", "code", "cpu", "search",
                  "chart", "share", "identity", "strategy", "spark",
                ],
              },
              duration: { kind: "text", label: "Duration", help: "e.g. \"2 days\"" },
              mode: { kind: "text", label: "Format" },
              description: {
                kind: "textarea",
                label: "Description",
                help: "Shown in the course's detail pop-up.",
              },
            },
          },
        },
      },
      {
        key: "why",
        title: "Why Betaminds Academy",
        fields: {
          heading: { kind: "text", label: "Heading" },
          items: { kind: "list", label: "Benefits" },
        },
      },
      {
        key: "pathway",
        title: "From choice to employment",
        fields: {
          heading: { kind: "text", label: "Heading" },
          steps: { kind: "list", label: "Steps" },
        },
      },
      {
        key: "stats",
        title: "Statistics",
        fields: {
          heading: { kind: "textarea", label: "Heading", rows: 2 },
          items: {
            kind: "repeater",
            label: "Stats",
            itemLabel: "Stat",
            titleKey: "label",
            fields: {
              n: { kind: "text", label: "Figure" },
              label: { kind: "text", label: "Label" },
            },
          },
        },
      },
      {
        key: "quotes",
        title: "Student quotes",
        fields: {
          items: {
            kind: "repeater",
            label: "Quotes",
            itemLabel: "Quote",
            titleKey: "name",
            fields: {
              quote: { kind: "textarea", label: "Quote", rows: 3 },
              name: { kind: "text", label: "Name" },
              course: { kind: "text", label: "Course · cohort" },
              image: { kind: "image", label: "Avatar", ratio: "1 / 1" },
            },
          },
        },
      },
      faqSection("Five rows, one open at a time."),
      {
        key: "partners",
        title: "Partners",
        fields: {
          eyebrow: { kind: "text", label: "Eyebrow", mono: true },
          heading: { kind: "text", label: "Heading" },
          logos: {
            kind: "repeater",
            label: "Partner logos",
            itemLabel: "Partner",
            titleKey: "name",
            fields: {
              name: { kind: "text", label: "Name" },
              logo: { kind: "image", label: "Logo" },
            },
          },
        },
      },
      {
        key: "foundation",
        title: "Creative Foundations",
        fields: {
          eyebrow: { kind: "text", label: "Eyebrow", mono: true },
          heading: { kind: "textarea", label: "Heading", rows: 2 },
          body: { kind: "textarea", label: "Body", rows: 4 },
          points: { kind: "list", label: "Points" },
        },
      },
      {
        key: "apply",
        title: "Application form",
        note: "Applications land in Submissions → Academy application.",
        fields: {
          heading: { kind: "text", label: "Heading" },
          body: { kind: "textarea", label: "Body", rows: 3 },
          submitLabel: { kind: "text", label: "Submit button label" },
          successHeading: { kind: "text", label: "Success heading" },
          successBody: { kind: "textarea", label: "Success body", rows: 3 },
          fields: formFieldsRepeater(
            "Fields",
            "The 'course' and 'format' dropdowns are filled from the Courses section and the hero's learning formats, so you don't list them twice.",
          ),
        },
      },
    ],
  },

  {
    id: "summit",
    title: "Creative Empowerment Summit",
    route: "/summit",
    blurb: "Editions and galleries, agenda, highlights, FAQ and sponsorship.",
    sections: [
      seo,
      {
        key: "hero",
        title: "Hero",
        fields: {
          ...heroImage("16 / 9"),
          eyebrow: { kind: "text", label: "Eyebrow", mono: true },
          heading: { kind: "textarea", label: "Headline", rows: 2 },
          accentTail: { kind: "text", label: "Headline accent tail" },
          lead: { kind: "textarea", label: "Lead paragraph", rows: 3 },
          nextLabel: { kind: "text", label: "Next-edition label", mono: true },
          nextDetail: { kind: "text", label: "Next-edition date & venue" },
          ctaPrimary: { kind: "text", label: "Primary button label" },
          ctaSecondary: { kind: "text", label: "Secondary button label" },
          deckUrl: {
            kind: "text",
            label: "Sponsorship deck URL",
            help: "Upload the PDF or paste a link. Empty hides the deck buttons.",
          },
        },
      },
      {
        key: "movement",
        title: "A movement, not a conference",
        fields: {
          heading: { kind: "text", label: "Heading" },
          body1: { kind: "textarea", label: "First paragraph", rows: 4 },
          body2: { kind: "textarea", label: "Second paragraph", rows: 3 },
          missionLabel: { kind: "text", label: "Mission label", mono: true },
          mission: { kind: "textarea", label: "Mission", rows: 5 },
        },
      },
      {
        key: "stats",
        title: "Event highlights",
        note: "The first four also appear on the homepage summit band.",
        fields: {
          items: {
            kind: "repeater",
            label: "Highlights",
            itemLabel: "Highlight",
            titleKey: "label",
            fields: {
              n: { kind: "text", label: "Figure" },
              label: { kind: "text", label: "Label" },
            },
          },
        },
      },
      {
        key: "why",
        title: "Why attend?",
        fields: {
          heading: { kind: "text", label: "Heading" },
          items: {
            kind: "repeater",
            label: "Reasons",
            itemLabel: "Reason",
            titleKey: "title",
            fields: {
              title: { kind: "text", label: "Title" },
              body: { kind: "textarea", label: "Body", rows: 3 },
            },
          },
        },
      },
      {
        key: "editions",
        title: "Editions",
        note: "Galleries are square crops, three per row.",
        fields: {
          items: {
            kind: "repeater",
            label: "Editions",
            itemLabel: "Edition",
            titleKey: "edition",
            fields: {
              edition: { kind: "text", label: "Edition" },
              theme: { kind: "textarea", label: "Theme", rows: 2 },
              date: { kind: "text", label: "Date" },
              venue: { kind: "text", label: "Venue" },
              gallery: { kind: "images", label: "Picture gallery" },
            },
          },
        },
      },
      {
        key: "press",
        title: "From the press",
        fields: {
          label: { kind: "text", label: "Label", mono: true },
          items: {
            kind: "repeater",
            label: "Mentions",
            itemLabel: "Mention",
            titleKey: "name",
            fields: {
              name: { kind: "text", label: "Publication" },
              href: { kind: "text", label: "Article URL" },
            },
          },
        },
      },
      {
        key: "agenda",
        title: "Agenda",
        fields: {
          heading: { kind: "text", label: "Heading" },
          steps: { kind: "list", label: "Timeline" },
        },
      },
      {
        key: "stories",
        title: "Success stories",
        fields: {
          items: {
            kind: "repeater",
            label: "Stories",
            itemLabel: "Story",
            titleKey: "name",
            fields: {
              quote: { kind: "textarea", label: "Quote", rows: 3 },
              name: { kind: "text", label: "Attribution" },
              image: { kind: "image", label: "Avatar", ratio: "1 / 1" },
            },
          },
        },
      },
      faqSection("Five rows, one open at a time."),
      {
        key: "sponsor",
        title: "Sponsorship CTA",
        fields: {
          heading: { kind: "textarea", label: "Heading", rows: 2 },
          body: { kind: "textarea", label: "Body", rows: 3 },
          ctaPrimary: { kind: "text", label: "Deck button label" },
          ctaSecondary: { kind: "text", label: "Secondary button label" },
          ctaSecondaryHref: { kind: "text", label: "Secondary button link" },
        },
      },
      {
        key: "register",
        title: "Registration note",
        fields: {
          label: { kind: "text", label: "Label", mono: true },
          body: { kind: "textarea", label: "Body", rows: 3 },
        },
      },
      {
        key: "newsletter",
        title: "Newsletter",
        note: "Signups land in Submissions → Newsletter.",
        fields: {
          heading: { kind: "text", label: "Heading" },
          body: { kind: "textarea", label: "Body", rows: 2 },
          placeholder: { kind: "text", label: "Field placeholder" },
          ctaLabel: { kind: "text", label: "Button label" },
          successMessage: { kind: "text", label: "Success message" },
        },
      },
      {
        key: "interest",
        title: "Register interest form",
        note: "Registrations land in Submissions → Summit interest.",
        fields: {
          heading: { kind: "text", label: "Heading" },
          body: { kind: "textarea", label: "Body", rows: 3 },
          submitLabel: { kind: "text", label: "Submit button label" },
          successHeading: { kind: "text", label: "Success heading" },
          successBody: { kind: "textarea", label: "Success body", rows: 3 },
          fields: formFieldsRepeater("Fields"),
        },
      },
    ],
  },

  {
    id: "work",
    title: "Let's Work",
    route: "/lets-work",
    blurb: "Contact page and the project-brief form.",
    sections: [
      seo,
      {
        key: "hero",
        title: "Hero",
        note: "Full-width office photograph.",
        fields: {
          ...heroImage("16 / 9", "Your office space."),
          eyebrow: { kind: "text", label: "Eyebrow", mono: true },
          heading: { kind: "textarea", label: "Headline", rows: 2 },
          lead: { kind: "textarea", label: "Lead paragraph", rows: 3 },
          ctaLabel: { kind: "text", label: "Button label" },
          ctaHref: { kind: "text", label: "Button link" },
          stepsLabel: { kind: "text", label: "Steps label", mono: true },
          steps: {
            kind: "list",
            label: "What happens next",
            help: "Shown beside the headline. Three works best.",
          },
        },
      },
      {
        key: "form",
        title: "Brief form",
        note: "Briefs land in Submissions → Project brief. Address, email and phone come from Site-wide → Contact details.",
        fields: {
          heading: { kind: "text", label: "Heading" },
          body: { kind: "text", label: "Sub-line" },
          submitLabel: { kind: "text", label: "Submit button label" },
          successHeading: { kind: "text", label: "Success heading" },
          successBody: { kind: "textarea", label: "Success body", rows: 3 },
          labels: {
            kind: "group",
            label: "Field labels",
            fields: {
              name: { kind: "text", label: "Name" },
              email: { kind: "text", label: "Email" },
              company: { kind: "text", label: "Company" },
              need: { kind: "text", label: "Need" },
              project: { kind: "text", label: "Project" },
            },
          },
          hints: {
            kind: "group",
            label: "Field placeholders",
            fields: {
              name: { kind: "text", label: "Name" },
              email: { kind: "text", label: "Email" },
              company: { kind: "text", label: "Company" },
              need: { kind: "text", label: "Need" },
              project: { kind: "text", label: "Project" },
            },
          },
        },
      },
    ],
  },
];

export const schemaById = new Map(schemas.map((s) => [s.id, s]));
