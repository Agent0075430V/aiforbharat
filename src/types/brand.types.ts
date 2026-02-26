import type {
  ContentFormat,
  Platform,
  Niche,
  CreatorArchetype,
} from './profile.types';
import type { PlatformStats } from './analytics.types';

export type DealStatus =
  | 'inquiry'
  | 'negotiating'
  | 'brief_received'
  | 'draft_submitted'
  | 'approved'
  | 'live'
  | 'completed';

export interface Deliverable {
  id: string;
  type: ContentFormat;
  platform: Platform;
  description: string;
  dueDate: string;
  isCompleted: boolean;
  draftId?: string;
}

export interface BrandDeal {
  id: string;
  brandName: string;
  brandLogoUrl?: string;
  campaignName: string;
  objective: string;
  status: DealStatus;
  deliverables: Deliverable[];
  startDate: string;
  endDate: string;
  agreedFee?: number;
  paymentStatus?: 'unpaid' | 'partial' | 'paid';
  notes?: string;
  contactEmail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaKit {
  userId: string;
  displayName: string;
  bio: string;
  niche: Niche;
  archetype: CreatorArchetype;
  platforms: PlatformStats[];
  primaryAudience: string;
  topContentFormats: ContentFormat[];
  collaborationTypes: string[];
  contactEmail: string;
  generatedAt: string;
}

