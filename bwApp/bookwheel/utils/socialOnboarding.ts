import AsyncStorage from "@react-native-async-storage/async-storage";

import type { ConsentPolicies, RequiredConsent } from "@/api/auth";

const SOCIAL_ONBOARDING_STEP_KEY = "socialOnboardingStep";
const SOCIAL_CONSENT_KEY = "socialConsent";
const LOCAL_PROFILE_ONBOARDING_KEY = "localProfileOnboarding";

export type SocialOnboardingStep = "consent" | "profile";

export type OnboardingState = {
  socialStep: SocialOnboardingStep | null;
  isLocalProfileOnboarding: boolean;
};

const isSocialOnboardingStep = (
  value: string | null,
): value is SocialOnboardingStep => value === "consent" || value === "profile";

const isRequiredConsent = (value: unknown): value is RequiredConsent => {
  if (!value || typeof value !== "object") return false;

  const consent = value as Partial<RequiredConsent>;
  return (
    consent.termsAgreed === true &&
    consent.privacyAgreed === true &&
    consent.marketingAgreed === false &&
    typeof consent.termsVersion === "string" &&
    consent.termsVersion.length > 0 &&
    typeof consent.privacyVersion === "string" &&
    consent.privacyVersion.length > 0 &&
    consent.marketingVersion === null
  );
};

export const beginSocialOnboarding = async () => {
  await AsyncStorage.multiRemove([
    "refreshToken",
    SOCIAL_CONSENT_KEY,
    LOCAL_PROFILE_ONBOARDING_KEY,
  ]);
  await AsyncStorage.setItem(SOCIAL_ONBOARDING_STEP_KEY, "consent");
};

export const beginLocalProfileOnboarding = async () => {
  await AsyncStorage.multiRemove([
    "refreshToken",
    SOCIAL_ONBOARDING_STEP_KEY,
    SOCIAL_CONSENT_KEY,
  ]);
  await AsyncStorage.setItem(LOCAL_PROFILE_ONBOARDING_KEY, "profile");
};

export const getSocialOnboardingStep = async () => {
  const step = await AsyncStorage.getItem(SOCIAL_ONBOARDING_STEP_KEY);
  return isSocialOnboardingStep(step) ? step : null;
};

export const getOnboardingState = async (): Promise<OnboardingState> => {
  const entries = await AsyncStorage.multiGet([
    SOCIAL_ONBOARDING_STEP_KEY,
    LOCAL_PROFILE_ONBOARDING_KEY,
  ]);

  const socialStep = entries[0][1];
  return {
    socialStep: isSocialOnboardingStep(socialStep) ? socialStep : null,
    isLocalProfileOnboarding: entries[1][1] === "profile",
  };
};

export const saveSocialConsent = async (
  policies: ConsentPolicies,
): Promise<RequiredConsent> => {
  const consent: RequiredConsent = {
    termsAgreed: true,
    privacyAgreed: true,
    marketingAgreed: false,
    termsVersion: policies.termsVersion,
    privacyVersion: policies.privacyVersion,
    marketingVersion: null,
  };

  await AsyncStorage.removeItem(LOCAL_PROFILE_ONBOARDING_KEY);
  await AsyncStorage.multiSet([
    [SOCIAL_CONSENT_KEY, JSON.stringify(consent)],
    [SOCIAL_ONBOARDING_STEP_KEY, "profile"],
  ]);

  return consent;
};

export const getSavedSocialConsent = async () => {
  const storedConsent = await AsyncStorage.getItem(SOCIAL_CONSENT_KEY);
  if (!storedConsent) return null;

  try {
    const consent: unknown = JSON.parse(storedConsent);
    return isRequiredConsent(consent) ? consent : null;
  } catch {
    return null;
  }
};

export const restartSocialConsent = async () => {
  await AsyncStorage.multiRemove([
    SOCIAL_CONSENT_KEY,
    LOCAL_PROFILE_ONBOARDING_KEY,
  ]);
  await AsyncStorage.setItem(SOCIAL_ONBOARDING_STEP_KEY, "consent");
};

export const clearOnboardingState = async () => {
  await AsyncStorage.multiRemove([
    SOCIAL_ONBOARDING_STEP_KEY,
    SOCIAL_CONSENT_KEY,
    LOCAL_PROFILE_ONBOARDING_KEY,
  ]);
};
