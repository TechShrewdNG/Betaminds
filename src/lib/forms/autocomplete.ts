import type { FormField } from "@/lib/forms/definition";

/**
 * The autocomplete token for a CMS-defined form field.
 *
 * Fields are configured by an editor — a key and a label, not an HTML contract
 * — so none of the four public forms carried an autocomplete attribute and no
 * browser could fill any of them. Every visitor retyped their name, email and
 * phone number by hand.
 *
 * Matching is on the field's type first (which the editor picks explicitly and
 * is therefore the stronger signal) and then on its key, against the tokens in
 * the HTML spec's autofill list. Anything unrecognised returns undefined rather
 * than a guess: a wrong token is worse than none, because the browser will
 * confidently fill the wrong value.
 */
export function autocompleteFor(field: FormField): string | undefined {
  if (field.type === "email") return "email";
  if (field.type === "tel") return "tel";
  if (field.type === "url") return "url";

  const key = field.key.toLowerCase();

  // Name. "brandName" and "companyName" are the organisation, not the person,
  // so the organisation check has to come first.
  if (/(brand|company|organi[sz]ation|organisation|business)/.test(key)) {
    return "organization";
  }
  if (/^(full ?name|name|your ?name|contact ?name)$/.test(key) || key === "fullname") {
    return "name";
  }
  if (/first ?name/.test(key)) return "given-name";
  if (/last ?name|surname/.test(key)) return "family-name";

  if (/role|title|position|jobtitle/.test(key)) return "organization-title";
  if (/website|url|site/.test(key)) return "url";
  if (/city|town/.test(key)) return "address-level2";
  if (/region|state|province/.test(key)) return "address-level1";
  if (/postcode|postal|zip/.test(key)) return "postal-code";
  if (/country/.test(key)) return "country-name";

  return undefined;
}
