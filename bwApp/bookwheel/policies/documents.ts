import terms from "./2026-09-21/terms.json";
import privacy from "./2026-09-21/privacy.json";
import collectionConsent from "./2026-09-21/collection-consent.json";

export type PolicyDocument = {
  version: string;
  title: string;
  effectiveDate: string;
  sections: { title: string; segments: { text: string; bold?: boolean }[] }[];
  footer: string;
};

// Initial release in preparation; freeze these documents when the release is published.
export const policyDocuments: Record<"terms" | "privacy" | "collectionConsent", PolicyDocument> = {
  terms,
  privacy,
  collectionConsent,
};

export function matchesDisplayedPolicies(
  policies: { termsVersion: string; privacyVersion: string } | null,
): boolean {
  return policies?.termsVersion === terms.version &&
    policies?.privacyVersion === collectionConsent.version;
}
