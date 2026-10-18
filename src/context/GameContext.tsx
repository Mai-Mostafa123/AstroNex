import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { BADGES, COMPANIONS } from '../data/gameData';
import { Badge, GameProgress, SuitColor } from '../types/game';
import { soundEffects } from '../utils/audio';

const STORAGE_KEY = 'astro_quest_save_v1';

const defaultProgress: GameProgress = {
  xp: 120,
  rank: 'Junior Cadet',
  suitColor: 'cyan',
  companionId: 'cosmo',
  completedMissions: [],
  unlockedBadges: ['first-launch'],
  collectedArtifacts: ['Cosmic Compass'],
  exploredPlanets: ['earth'],
  completedRepairs: [],
  stats: {
    crystalsCollected: 0,
    quizzesAnswered: 0,
    correctAnswers: 0,
    rocketsBuilt: 0,
    planetsExplored: 1,
  }
};

function calculateRank(xp: number): string {
  if (xp >= 1200) return 'Cosmic Legend 🌟';
  if (xp >= 800) return 'Space Commander 🛸';
  if (xp >= 500) return 'Flight Specialist 🚀';
  if (xp >= 250) return 'Astro Explorer 🪐';
  if (xp >= 100) return 'Lunar Scout 🌕';
  return 'Junior Cadet 🛰️';
}

interface GameContextType {
  progress: GameProgress;
  addXP: (amount: number, reason?: string) => void;
  completeMission: (missionId: string, badgeId?: string, xpReward?: number) => void;
  unlockBadge: (badgeId: string) => void;
  setSuitColor: (color: SuitColor) => void;
  setCompanion: (companionId: string) => void;
  recordQuizResult: (correct: boolean) => void;
  recordCrystalCollected: () => void;
  recordRocketBuilt: () => void;
  recordPlanetExplored: (planetId: string) => void;
  recordStationRepair: (repairId: string, xp?: number) => boolean;
  resetProgress: () => void;
  triggerCelebration: () => void;
  activeCosmoDialog: string | null;
  showCosmoMessage: (msg: string) => void;
  closeCosmoMessage: () => void;
  currentCompanion: typeof COMPANIONS[0];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<GameProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved game progress', e);
    }
    return defaultProgress;
  });

  const [activeCosmoDialog, setActiveCosmoDialog] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {}
  }, [progress]);

  const triggerCelebration = () => {
    soundEffects.fanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00f0ff', '#ffd60a', '#ff2a85', '#a855f7', '#34d399']
    });
  };

  const addXP = (amount: number, reason?: string) => {
    soundEffects.starCollect();
    setProgress((prev) => {
      const newXP = prev.xp + amount;
      const newRank = calculateRank(newXP);
      return {
        ...prev,
        xp: newXP,
        rank: newRank,
      };
    });
    if (reason) {
      showCosmoMessage(`+${amount} XP! ${reason} Amazing work, Cadet! 🌟`);
    }
  };

  const unlockBadge = (badgeId: string) => {
    setProgress((prev) => {
      if (prev.unlockedBadges.includes(badgeId)) return prev;
      soundEffects.fanfare();
      triggerCelebration();
      const badge = BADGES.find((b) => b.id === badgeId);
      if (badge) {
        showCosmoMessage(`BADGE UNLOCKED: ${badge.title}! ${badge.description} 🏆`);
      }
      return {
        ...prev,
        unlockedBadges: [...prev.unlockedBadges, badgeId],
      };
    });
  };

  const completeMission = (missionId: string, badgeId?: string, xpReward = 150) => {
    setProgress((prev) => {
      const alreadyDone = prev.completedMissions.includes(missionId);
      const completed = alreadyDone
        ? prev.completedMissions
        : [...prev.completedMissions, missionId];

      // Anti-duplication: full reward first time, modest replay bonus if replaying
      const addedXP = alreadyDone ? 30 : xpReward;
      const newXP = prev.xp + addedXP;
      const newRank = calculateRank(newXP);
      const badges = badgeId && !prev.unlockedBadges.includes(badgeId)
        ? [...prev.unlockedBadges, badgeId]
        : prev.unlockedBadges;

      return {
        ...prev,
        completedMissions: completed,
        unlockedBadges: badges,
        xp: newXP,
        rank: newRank,
      };
    });
    triggerCelebration();
  };

  const setSuitColor = (color: SuitColor) => {
    soundEffects.click();
    setProgress((prev) => ({ ...prev, suitColor: color }));
  };

  const setCompanion = (companionId: string) => {
    soundEffects.click();
    setProgress((prev) => ({ ...prev, companionId }));
    const companion = COMPANIONS.find((c) => c.id === companionId);
    if (companion) {
      showCosmoMessage(`Zorp! ${companion.name} is now your active space buddy! Let's explore together! 🚀`);
    }
  };

  const recordQuizResult = (correct: boolean) => {
    setProgress((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        quizzesAnswered: prev.stats.quizzesAnswered + 1,
        correctAnswers: prev.stats.correctAnswers + (correct ? 1 : 0),
      }
    }));
  };

  const recordCrystalCollected = () => {
    soundEffects.starCollect();
    setProgress((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        crystalsCollected: prev.stats.crystalsCollected + 1,
      }
    }));
  };

  const recordRocketBuilt = () => {
    setProgress((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        rocketsBuilt: prev.stats.rocketsBuilt + 1,
      }
    }));
  };

  const recordPlanetExplored = (planetId: string) => {
    setProgress((prev) => {
      const explored = prev.exploredPlanets || ['earth'];
      if (explored.includes(planetId)) return prev;

      soundEffects.starCollect();
      const updatedList = [...explored, planetId];
      const newXP = prev.xp + 50;
      const newRank = calculateRank(newXP);

      // Check if all 8 planets explored for Solar Voyager badge!
      let newBadges = prev.unlockedBadges;
      if (updatedList.length >= 8 && !newBadges.includes('solar-voyager')) {
        newBadges = [...newBadges, 'solar-voyager'];
        showCosmoMessage('BADGE UNLOCKED: Solar System Explorer! All 8 planets charted! 🪐🏆');
      }

      return {
        ...prev,
        exploredPlanets: updatedList,
        unlockedBadges: newBadges,
        xp: newXP,
        rank: newRank,
        stats: {
          ...prev.stats,
          planetsExplored: updatedList.length,
        }
      };
    });
  };

  const recordStationRepair = (repairId: string, xp = 40): boolean => {
    let wasFirstTime = false;
    setProgress((prev) => {
      const repairs = prev.completedRepairs || [];
      if (repairs.includes(repairId)) return prev;

      wasFirstTime = true;
      const updated = [...repairs, repairId];
      const newXP = prev.xp + xp;
      return {
        ...prev,
        completedRepairs: updated,
        xp: newXP,
        rank: calculateRank(newXP),
      };
    });
    return wasFirstTime;
  };

  const resetProgress = () => {
    soundEffects.click();
    setProgress(defaultProgress);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    showCosmoMessage("Mission log reset to Junior Cadet. Ready for a new countdown! 🚀");
  };

  const showCosmoMessage = (msg: string) => {
    setActiveCosmoDialog(msg);
  };

  const closeCosmoMessage = () => {
    setActiveCosmoDialog(null);
  };

  const currentCompanion = COMPANIONS.find((c) => c.id === progress.companionId) || COMPANIONS[0];

  return (
    <GameContext.Provider
      value={{
        progress,
        addXP,
        completeMission,
        unlockBadge,
        setSuitColor,
        setCompanion,
        recordQuizResult,
        recordCrystalCollected,
        recordRocketBuilt,
        recordPlanetExplored,
        recordStationRepair,
        resetProgress,
        triggerCelebration,
        activeCosmoDialog,
        showCosmoMessage,
        closeCosmoMessage,
        currentCompanion,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
};
