import type { QuizAnswers } from './profile.types';

export type AuthStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

export type OnboardingStackParamList = {
  QuizIntro: undefined;
  QuizStep: { stepIndex: number };
  QuizAnalyzing: { answers: QuizAnswers };
  QuizResult: undefined;
  ProfileConfirm: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  Settings: undefined;
};

export type ContentStackParamList = {
  ContentHub: undefined;
  CaptionGenerator: undefined;
  HashtagStudio: undefined;
  ScriptWriter: undefined;
  DraftsList: undefined;
  DraftDetail: { draftId: string };
};

export type CalendarStackParamList = {
  Calendar: undefined;
};

export type AnalyticsStackParamList = {
  Analytics: undefined;
};

export type BrandStackParamList = {
  Brands: undefined;
  DealDetail: { dealId: string };
  MediaKit: undefined;
  PricingCalculator: undefined;
};

export type SettingsStackParamList = {
  Settings: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Onboarding: undefined;
  App: undefined;
  VoiceAgent: undefined;
};

