import type { InfluencerProfile } from '../types/profile.types';
import type { Draft, Caption, HashtagItem, ContentScript } from '../types/content.types';
import type { CalendarDay } from '../types/calendar.types';
import type { AnalyticsData } from '../types/analytics.types';
import type { BrandDeal, MediaKit } from '../types/brand.types';

export const mockInfluencerProfile: InfluencerProfile = {
  userId: 'user-placeholder',
  displayName: 'Creator',
  archetype: 'EDUCATOR',
  niche: 'education',
  tone: 'informative_clear',
  language: 'English',
  platforms: ['instagram'],
  primaryPlatform: 'instagram',
  contentFormats: ['reel', 'carousel'],
  postingFrequency: '3_4_per_week',
  primaryGoal: 'thought_leadership',
  audienceLocation: 'india_tier1',
  quizAnswers: {
    creatorType: 'educator',
    audienceLocation: 'india_tier1',
    platforms: ['instagram'],
    postingFrequency: '3_4_per_week',
    biggestChallenge: 'captions',
    tone: 'informative_clear',
    contentFormats: ['reel', 'carousel'],
    primaryGoal: 'thought_leadership',
  },
  followerCounts: {
    instagram: 0,
  },
  socialHandles: {
    instagram: '@your.handle',
  },
  bio: 'Turning ideas into engaging content.',
  completedAt: new Date().toISOString(),
};

export const mockContentHealth = {
  score: 84,
  quality: true,
  consistency: true,
  engagementUp: true,
  tip: 'Post 2 more times this week to hit your streak goal.',
};

export const mockHomeStats = {
  drafts: 12,
  postedThisWeek: 5,
  streakDays: 6,
};

export const mockTodaySuggestion = {
  platform: 'instagram',
  topic: '3 things I wish I knew before starting content creation',
  captionPreview:
    'Swipe through to see the mistakes I made in my first year creating online...',
  bestTimeToPost: '6:30 PM',
};

export const mockWeekStreak = {
  currentStreak: 6,
  target: 7,
};

export const mockTrendingNow: Array<{ tag: string; volume: string }> = [
  { tag: '#ContentCreatorTips', volume: '2.3M' },
  { tag: '#ReelIdeas', volume: '1.1M' },
  { tag: '#StudyWithMe', volume: '890K' },
  { tag: '#MorningRoutine', volume: '2.0M' },
];

export const mockRecentDrafts: Draft[] = [
  {
    id: 'draft-1',
    topic: 'Morning routine for focused creators',
    caption: {
      id: 'cap-1',
      type: 'short',
      text: 'Stop trying to build a “perfect” morning routine. Build one that actually fits your energy.',
      engagementScore: 87,
      scoreBreakdown: {
        hookStrength: 22,
        toneMatch: 18,
        ctaStrength: 17,
        relatability: 18,
        languageQuality: 12,
      },
      improvementTip: 'Add one question at the end to invite comments.',
      platform: 'instagram',
      language: 'English',
      generatedAt: new Date().toISOString(),
    },
    hashtags: ['#morningroutine', '#creatortips'],
    platform: 'instagram',
    format: 'reel',
    status: 'draft',
    bestTimeToPost: '7:00 AM',
    engagementScore: 87,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'draft-2',
    topic: 'Hook formulas for educational reels',
    caption: {
      id: 'cap-2',
      type: 'medium',
      text: 'Here are 3 hook formulas that turned my “okay” reels into saves-worthy content...',
      engagementScore: 82,
      scoreBreakdown: {
        hookStrength: 21,
        toneMatch: 17,
        ctaStrength: 16,
        relatability: 16,
        languageQuality: 12,
      },
      improvementTip: 'Add a save/share CTA to maximise impact.',
      platform: 'instagram',
      language: 'English',
      generatedAt: new Date().toISOString(),
    },
    hashtags: ['#reeltips', '#hookformula'],
    platform: 'instagram',
    format: 'carousel',
    status: 'draft',
    bestTimeToPost: '8:15 PM',
    engagementScore: 82,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const mockCaptionResults: Caption[] = [
  {
    id: 'gen-short-1',
    type: 'short',
    text: 'Stop scrolling. This one change doubled my engagement. 👇',
    engagementScore: 88,
    scoreBreakdown: {
      hookStrength: 23,
      toneMatch: 18,
      ctaStrength: 18,
      relatability: 17,
      languageQuality: 12,
    },
    improvementTip: 'Your opening hook is strong. Add a question at the end to boost comments.',
    platform: 'instagram',
    language: 'English',
    generatedAt: new Date().toISOString(),
  },
  {
    id: 'gen-medium-1',
    type: 'medium',
    text: 'I spent a year testing what actually works for educational content. Here are the 3 things that moved the needle—and the one myth that held me back. Save this if you\'re ready to stop guessing.',
    engagementScore: 84,
    scoreBreakdown: {
      hookStrength: 21,
      toneMatch: 17,
      ctaStrength: 17,
      relatability: 17,
      languageQuality: 12,
    },
    improvementTip: 'Consider a number in the first line to increase saves.',
    platform: 'instagram',
    language: 'English',
    generatedAt: new Date().toISOString(),
  },
  {
    id: 'gen-long-1',
    type: 'long',
    text: 'Nobody talks about this enough: your audience doesn\'t want more tips. They want to feel like they\'re in the room with you. So I stopped writing "how-to" captions and started writing "here\'s what I learned" stories. The difference? My saves went up 40% in a month. If you\'re creating educational content, try it. And tell me in the comments what shifted for you.',
    engagementScore: 79,
    scoreBreakdown: {
      hookStrength: 19,
      toneMatch: 16,
      ctaStrength: 16,
      relatability: 16,
      languageQuality: 12,
    },
    improvementTip: 'Shorten the middle paragraph for Reels; keep this length for carousels.',
    platform: 'instagram',
    language: 'English',
    generatedAt: new Date().toISOString(),
  },
];

export const mockHashtagGroups: {
  trending: HashtagItem[];
  niche: HashtagItem[];
  branded: HashtagItem[];
} = {
  trending: [
    { tag: '#ContentCreator', estimatedPosts: '2.3M', category: 'trending' },
    { tag: '#ReelIdeas', estimatedPosts: '1.1M', category: 'trending' },
    { tag: '#StudyWithMe', estimatedPosts: '890K', category: 'trending' },
    { tag: '#MorningRoutine', estimatedPosts: '2.0M', category: 'trending' },
    { tag: '#CreatorEconomy', estimatedPosts: '456K', category: 'trending' },
  ],
  niche: [
    { tag: '#EducationContent', estimatedPosts: '120K', category: 'niche' },
    { tag: '#LearnOnReels', estimatedPosts: '85K', category: 'niche' },
    { tag: '#EdTech', estimatedPosts: '92K', category: 'niche' },
    { tag: '#TeacherLife', estimatedPosts: '210K', category: 'niche' },
    { tag: '#StudyTips', estimatedPosts: '1.2M', category: 'niche' },
    { tag: '#ProductivityHacks', estimatedPosts: '340K', category: 'niche' },
  ],
  branded: [
    { tag: '#YourBrand', estimatedPosts: '—', category: 'branded' },
    { tag: '#ClearContent', estimatedPosts: '—', category: 'branded' },
    { tag: '#CreatorFirst', estimatedPosts: '—', category: 'branded' },
  ],
};

export const mockRecentHashtagSets: Array<{ id: string; label: string; tags: string[] }> = [
  { id: 'set-1', label: 'Education Reel', tags: ['#EducationContent', '#StudyTips', '#LearnOnReels'] },
  { id: 'set-2', label: 'Morning Routine', tags: ['#MorningRoutine', '#ProductivityHacks', '#CreatorEconomy'] },
  { id: 'set-3', label: 'Behind the scenes', tags: ['#ContentCreator', '#CreatorFirst', '#StudyWithMe'] },
];

export const mockScriptResult: ContentScript = {
  id: 'script-1',
  format: 'reel',
  topic: '3 hook formulas for educational reels',
  hook: 'Stop scrolling. These 3 hooks got me 10x more saves.',
  body: [
    'First: the "nobody tells you" hook. Start with something your audience thinks is true, then flip it.',
    'Second: the number hook. "3 things I wish I knew" — people love a clear promise.',
    'Third: the POV hook. "POV: you finally understand..." — instant relatability.',
  ],
  cta: 'Save this and try one in your next reel. Which hook will you use? Comment below.',
  estimatedDuration: '45–60 seconds',
  platform: 'instagram',
  generatedAt: new Date().toISOString(),
};

function buildMockCalendarDay(
  date: string,
  dayName: string,
  topic: string,
  status: 'draft' | 'scheduled' | 'posted' = 'draft'
): CalendarDay {
  return {
    date,
    dayName,
    platform: 'instagram',
    format: 'reel',
    topic,
    captionPreview: 'Stop scrolling. This one tip changed how I plan my content...',
    hashtags: ['#ContentCreator', '#CreatorTips', '#Mediora'],
    bestTimeToPost: '7:00 PM',
    engagementScore: 82,
    status,
    draftId: `draft-${date}`,
  };
}

export const mockCalendarDays: CalendarDay[] = (() => {
  const days: CalendarDay[] = [];
  const names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const base = new Date();
  for (let i = -3; i <= 10; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    const date = d.toISOString().slice(0, 10);
    const dayName = names[d.getDay() === 0 ? 6 : d.getDay() - 1];
    const status = i < 0 ? 'posted' : i === 0 ? 'scheduled' : 'draft';
    days.push(
      buildMockCalendarDay(
        date,
        dayName,
        i === 0 ? '3 hook formulas for educational reels' : `Content idea ${i + 1}`,
        status
      )
    );
  }
  return days;
})();

export const mockAnalyticsData: AnalyticsData = {
  period: 'month',
  contentHealthScore: 84,
  platformStats: [
    {
      platform: 'instagram',
      followers: 12400,
      followersGrowth: 4.2,
      engagementRate: 5.8,
      totalPosts: 28,
      avgLikes: 720,
      avgComments: 42,
      avgSaves: 89,
    },
    {
      platform: 'youtube',
      followers: 3800,
      followersGrowth: 2.1,
      engagementRate: 6.2,
      totalPosts: 12,
      avgLikes: 180,
      avgComments: 24,
      avgSaves: 45,
    },
  ],
  followerHistory: (() => {
    const points = [];
    const base = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(base);
      d.setDate(d.getDate() - i);
      const date = d.toISOString().slice(0, 10);
      const count = 12000 + i * 30 + Math.round(Math.random() * 40);
      points.push({
        date,
        count,
        gained: 40 + Math.round(Math.random() * 20),
        lost: 10 + Math.round(Math.random() * 10),
      });
    }
    return points;
  })(),
  dailyEngagement: (() => {
    const out = [];
    const base = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(base);
      d.setDate(d.getDate() - i);
      out.push({
        date: d.toISOString().slice(0, 10),
        likes: 600 + Math.round(Math.random() * 200),
        comments: 35 + Math.round(Math.random() * 15),
        saves: 70 + Math.round(Math.random() * 30),
        shares: 12 + Math.round(Math.random() * 8),
        reach: 8000 + Math.round(Math.random() * 2000),
        impressions: 12000 + Math.round(Math.random() * 3000),
      });
    }
    return out;
  })(),
  topPosts: [
    {
      id: 'tp-1',
      platform: 'instagram',
      format: 'reel',
      captionPreview: 'Stop scrolling. These 3 hooks got me 10x more saves.',
      postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 1240,
      comments: 89,
      saves: 312,
      reach: 18500,
      engagementRate: 8.2,
    },
    {
      id: 'tp-2',
      platform: 'instagram',
      format: 'carousel',
      captionPreview: 'Swipe through the mistakes I made in my first year...',
      postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 890,
      comments: 56,
      saves: 198,
      reach: 12200,
      engagementRate: 6.1,
    },
    {
      id: 'tp-3',
      platform: 'youtube',
      format: 'short',
      captionPreview: 'One tip that changed how I plan my content.',
      postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 420,
      comments: 34,
      saves: 87,
      reach: 6500,
      engagementRate: 7.4,
    },
    {
      id: 'tp-4',
      platform: 'instagram',
      format: 'reel',
      captionPreview: 'POV: you finally understand the algorithm.',
      postedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 756,
      comments: 41,
      saves: 145,
      reach: 9800,
      engagementRate: 5.9,
    },
  ],
  aiInsights: [
    'Reels drive 2.3x more saves than carousels this month — double down on hook-first reels.',
    'Your best posting window is 6–8 PM; 78% of top engagement falls in this slot.',
    'Comment reply rate is up 12% — consider pinning a question in captions to keep the thread going.',
  ],
};

export const mockBrandDeals: BrandDeal[] = [
  {
    id: 'deal-1',
    brandName: 'EduTech Co',
    campaignName: 'Back-to-school tips',
    objective: 'Awareness + sign-ups',
    status: 'draft_submitted',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    agreedFee: 45000,
    paymentStatus: 'unpaid',
    contactEmail: 'partnerships@edutech.co',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    deliverables: [
      {
        id: 'del-1',
        type: 'reel',
        platform: 'instagram',
        description: '1x 45–60s reel: 3 study hacks',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        isCompleted: true,
        draftId: 'draft-1',
      },
      {
        id: 'del-2',
        type: 'carousel',
        platform: 'instagram',
        description: '1x carousel: product feature highlights',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        isCompleted: false,
      },
    ],
  },
  {
    id: 'deal-2',
    brandName: 'Wellness App',
    campaignName: 'Morning routine takeover',
    objective: 'App installs',
    status: 'brief_received',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    agreedFee: 60000,
    paymentStatus: 'unpaid',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    deliverables: [
      {
        id: 'del-3',
        type: 'reel',
        platform: 'instagram',
        description: '2x reels: morning routine + app demo',
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        isCompleted: false,
      },
    ],
  },
];

export const mockMediaKit: MediaKit = {
  userId: 'user-placeholder',
  displayName: mockInfluencerProfile.displayName,
  bio: mockInfluencerProfile.bio ?? '',
  niche: mockInfluencerProfile.niche,
  archetype: mockInfluencerProfile.archetype,
  platforms: mockAnalyticsData.platformStats,
  primaryAudience: 'Creators, students, educators (India)',
  topContentFormats: mockInfluencerProfile.contentFormats,
  collaborationTypes: ['Sponsored posts', 'Reels', 'Carousels', 'Long-form video', 'Affiliate'],
  contactEmail: 'hello@yourhandle.com',
  generatedAt: new Date().toISOString(),
};

