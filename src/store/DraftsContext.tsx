import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Draft, Caption, ContentScript } from '../types/content.types';
import type { ContentFormat, Platform } from '../types/profile.types';
import { getDrafts as fetchDraftsFromDB } from '../services/aws/mediora.service';

const DRAFTS_KEY = 'mediora_drafts';

function makeDraftId(): string {
  return `draft-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface DraftsContextValue {
  drafts: Draft[];
  addDraft: (draft: Omit<Draft, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  addDraftFromCaption: (topic: string, caption: Caption, platform: Platform, format?: ContentFormat) => Promise<void>;
  addDraftFromScript: (script: ContentScript) => Promise<void>;
  removeDraft: (id: string) => Promise<void>;
  getDraft: (id: string) => Draft | undefined;
  isLoading: boolean;
  syncFromServer: (userId: string) => Promise<void>;
}

const DraftsContext = createContext<DraftsContextValue | null>(null);

export const DraftsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const persist = useCallback(async (next: Draft[]) => {
    setDrafts(next);
    await AsyncStorage.setItem(DRAFTS_KEY, JSON.stringify(next));
  }, []);

  const addDraft = useCallback(
    async (draft: Omit<Draft, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const newDraft: Draft = {
        ...draft,
        id: makeDraftId(),
        createdAt: now,
        updatedAt: now,
      };
      await persist([...drafts, newDraft]);
    },
    [drafts, persist]
  );

  const addDraftFromCaption = useCallback(
    async (topic: string, caption: Caption, platform: Platform, format: ContentFormat = 'reel') => {
      await addDraft({
        topic,
        caption,
        hashtags: [],
        platform,
        format,
        status: 'draft',
        bestTimeToPost: '',
        engagementScore: caption.engagementScore ?? 0,
      });
    },
    [addDraft]
  );

  const addDraftFromScript = useCallback(
    async (script: ContentScript) => {
      const now = new Date().toISOString();
      const placeholderCaption: Caption = {
        id: `cap-${script.id}`,
        type: 'medium',
        text: script.hook + (script.body?.length ? '\n\n' + script.body.join('\n\n') : ''),
        engagementScore: 0,
        scoreBreakdown: { hookStrength: 0, toneMatch: 0, ctaStrength: 0, relatability: 0, languageQuality: 0 },
        improvementTip: '',
        platform: script.platform,
        language: 'English',
        generatedAt: now,
      };
      const newDraft: Draft = {
        id: makeDraftId(),
        topic: script.topic,
        caption: placeholderCaption,
        hashtags: [],
        platform: script.platform,
        format: script.format,
        status: 'draft',
        bestTimeToPost: '',
        engagementScore: 0,
        createdAt: now,
        updatedAt: now,
        script,
      };
      await persist([...drafts, newDraft]);
    },
    [drafts, persist]
  );

  const removeDraft = useCallback(
    async (id: string) => {
      await persist(drafts.filter((d) => d.id !== id));
    },
    [drafts, persist]
  );

  const getDraft = useCallback(
    (id: string) => drafts.find((d) => d.id === id),
    [drafts]
  );

  /** Pull drafts from DynamoDB and merge with local (server wins on conflict) */
  const syncFromServer = useCallback(async (userId: string) => {
    try {
      const serverRecords = await fetchDraftsFromDB(userId);
      if (!serverRecords?.length) return;
      // Convert DraftRecord → Draft shape
      const serverDrafts: Draft[] = serverRecords.map((r) => ({
        id: r.draftId,
        topic: r.caption_en?.slice(0, 40) ?? 'Untitled',
        caption: {
          id: r.draftId,
          type: 'short' as const,
          text: r.caption_en ?? '',
          engagementScore: r.engagementScore ?? 0,
          scoreBreakdown: { hookStrength: 0, toneMatch: 0, ctaStrength: 0, relatability: 0, languageQuality: 0 },
          improvementTip: '',
          platform: (r.platform ?? 'instagram') as Platform,
          language: 'English',
          generatedAt: r.createdAt ?? new Date().toISOString(),
        },
        hashtags: Array.isArray(r.hashtags) ? r.hashtags : [],
        platform: (r.platform ?? 'instagram') as Platform,
        format: (r.format ?? 'reel') as ContentFormat,
        status: r.status ?? 'draft',
        bestTimeToPost: '',
        engagementScore: r.engagementScore ?? 0,
        createdAt: r.createdAt ?? new Date().toISOString(),
        updatedAt: r.createdAt ?? new Date().toISOString(),
      }));
      // Merge: server drafts take precedence; keep local-only drafts
      setDrafts((prev) => {
        const serverIds = new Set(serverDrafts.map((d) => d.id));
        const localOnly = prev.filter((d) => !serverIds.has(d.id));
        const merged = [...serverDrafts, ...localOnly].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        AsyncStorage.setItem(DRAFTS_KEY, JSON.stringify(merged)).catch(() => { });
        return merged;
      });
    } catch (err) {
      console.warn('[DraftsContext] syncFromServer failed (non-fatal):', err);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(DRAFTS_KEY).then((raw) => {
      if (!mounted) return;
      try {
        const parsed = raw ? (JSON.parse(raw) as Draft[]) : [];
        setDrafts(Array.isArray(parsed) ? parsed : []);
      } catch {
        setDrafts([]);
      }
      setIsLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  const value: DraftsContextValue = {
    drafts,
    addDraft,
    addDraftFromCaption,
    addDraftFromScript,
    removeDraft,
    getDraft,
    isLoading,
    syncFromServer,
  };

  return <DraftsContext.Provider value={value}>{children}</DraftsContext.Provider>;
};

export function useDrafts(): DraftsContextValue {
  const ctx = useContext(DraftsContext);
  if (!ctx) throw new Error('useDrafts must be used within DraftsProvider');
  return ctx;
}
