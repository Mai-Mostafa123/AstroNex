export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'mission' | 'minigame' | 'quiz' | 'explorer';
}

export type SuitColor = 'white' | 'orange' | 'cyan' | 'purple' | 'gold' | 'neon-pink';

export interface Companion {
  id: string;
  name: string;
  species: string;
  description: string;
  color: string;
  accent: string;
  perk: string;
}

export interface GameProgress {
  xp: number;
  rank: string;
  suitColor: SuitColor;
  companionId: string;
  completedMissions: string[];
  unlockedBadges: string[];
  collectedArtifacts: string[];
  exploredPlanets: string[];
  completedRepairs: string[];
  stats: {
    crystalsCollected: number;
    quizzesAnswered: number;
    correctAnswers: number;
    rocketsBuilt: number;
    planetsExplored: number;
  };
}

export interface MissionData {
  id: string;
  title: string;
  location: string;
  tagline: string;
  difficulty: 'Easy' | 'Medium' | 'Challenging';
  rewardXP: number;
  badgeId: string;
  description: string;
  color: string;
  icon: string;
}
