import "server-only";
import { getContent, defaults } from "@/lib/content";
import {
  normaliseFields,
  normaliseGroups,
  flattenGroups,
  type FormField,
  type FormGroup,
} from "./definition";

/**
 * Resolves a form's field definitions from content.
 *
 * The page renders from this and `submit()` validates against it, so the two can
 * never disagree — which matters most for selects, where validation rejects any
 * value not in the field's options. Options that come from elsewhere (Academy
 * courses, learning formats, engagement plans) are injected here rather than
 * duplicated into the field definition.
 */

export type DynamicKind = "consultation" | "academy" | "summit";

export type ResolvedForm = {
  fields: FormField[];
  /** Only the questionnaire is grouped; the others are a flat list. */
  groups?: FormGroup[];
};

/**
 * Replaces a field's options where the list is derived from other content.
 * The field keeps whatever type the editor gave it (select, radio, …) — only
 * the options are swapped in.
 */
function inject(
  fields: FormField[],
  sources: Record<string, string[]>,
): FormField[] {
  return fields.map((field) => {
    const options = sources[field.key];
    if (!options || options.length === 0) return field;
    return { ...field, options };
  });
}

/**
 * Falls back to the code defaults when an editor has emptied a form or a saved
 * document predates the field definitions. A page with no form at all would be a
 * dead end; the handoff's fields are a safer floor.
 */
function withFallback(
  normalise: (raw: unknown) => FormField[],
  saved: unknown,
  fallback: unknown,
): FormField[] {
  const fields = normalise(saved);
  return fields.length > 0 ? fields : normalise(fallback);
}

export async function resolveForm(kind: DynamicKind): Promise<ResolvedForm> {
  if (kind === "consultation") {
    const eco = await getContent("ecosystem");
    let groups = normaliseGroups(eco.questionnaire.groups);
    if (groups.length === 0) {
      groups = normaliseGroups(defaults.ecosystem.questionnaire.groups);
    }

    // The plan dropdown should always match the plans actually on offer.
    const planNames = eco.plans.items.map((plan) => plan.name);
    const sources = {
      plan:
        planNames.length > 0
          ? [...planNames, "Not sure yet. Recommend one."]
          : [],
    };

    const resolved = groups.map((group) => ({
      ...group,
      fields: inject(group.fields, sources),
    }));

    return { groups: resolved, fields: flattenGroups(resolved) };
  }

  if (kind === "academy") {
    const academy = await getContent("academy");
    let groups = normaliseGroups(academy.apply.groups);
    if (groups.length === 0) {
      groups = normaliseGroups(defaults.academy.apply.groups);
    }

    const sources = {
      course: academy.courses.schools.flatMap((school) =>
        school.courses.map((course) => course.name),
      ),
      format: academy.hero.formats,
    };

    const resolved = groups.map((group) => ({
      ...group,
      fields: inject(group.fields, sources),
    }));

    return { groups: resolved, fields: flattenGroups(resolved) };
  }

  const summit = await getContent("summit");
  return {
    fields: withFallback(
      normaliseFields,
      summit.interest.fields,
      defaults.summit.interest.fields,
    ),
  };
}
