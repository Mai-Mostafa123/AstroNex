import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { OpeningScene } from './components/three/OpeningScene';
import { HubScene } from './components/three/HubScene';
import { SolarSystemScene } from './components/three/SolarSystemScene';
import { MoonDashMission } from './components/missions/MoonDashMission';
import { MarsMysteryMission } from './components/missions/MarsMysteryMission';
import { SaveStationMission } from './components/missions/SaveStationMission';
import { MiniGamesHub } from './components/minigames/MiniGamesHub';
import { AstronautProfile } from './components/character/AstronautProfile';
import { CosmoChatModal } from './components/cosmo/CosmoChatModal';
import { soundEffects } from './utils/audio';
import { MISSIONS } from './data/gameData';
import {
  Rocket,
  Compass,
  MapPin,
  Gamepad2,
  User,
  Volume2,
  VolumeX,
  MessageCircle,
  Play,
  Trophy,
  Sparkles,
  Home,
} from 'lucide-react';

type ScreenView =
  | 'home'
  | 'hub'
  | 'explore'
  | 'missions'
  | 'mission-moon'
  | 'mission-mars'
  | 'mission-station'
  | 'minigames'
  | 'astronaut';

function MainGameApp() {
  const { progress, activeCosmoDialog, closeCosmoMessage, currentCompanion } = useGame();

  const [currentScreen, setCurrentScreen] = useState<ScreenView>('home');
  const [isMuted, setIsMuted] = useState(() => soundEffects.isMuted());
  const [isCosmoOpen, setIsCosmoOpen] = useState(false);

  const toggleSound = () => {
    const muted = soundEffects.toggleMute();
    setIsMuted(muted);
    soundEffects.click();
  };

  const navigateTo = (screen: ScreenView) => {
    soundEffects.click();
    setCurrentScreen(screen);
  };

  const handleDestinationSelect = (destId: string) => {
    if (destId === 'moon-base') navigateTo('mission-moon');
    else if (destId === 'mars-outpost') navigateTo('mission-mars');
    else if (destId === 'space-station') navigateTo('mission-station');
    else if (destId === 'rocket-training') navigateTo('minigames');
    else if (destId === 'alien-planet') {
      setIsCosmoOpen(true);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100vw', minHeight: '100vh', backgroundColor: '#0a051b' }}>
      {/* Background Starfield Glow */}
      <div className="space-bg-wrap">
        <div className="nebula-glow nebula-1" />
        <div className="nebula-glow nebula-2" />
        <div className="nebula-glow nebula-3" />
      </div>

      {/* Persistent Floating Navigation Bar (Visible on all screens except opening home intro) */}
      {currentScreen !== 'home' && (
        <nav className="game-nav d-flex align-items-center gap-1 gap-md-2" aria-label="Game Navigation">
          <button
            onClick={() => navigateTo('home')}
            className="nav-link-btn"
            title="Intro Launch Screen"
          >
            <Home size={18} />
            <span>Home</span>
          </button>

          <button
            onClick={() => navigateTo('hub')}
            className={`nav-link-btn ${currentScreen === 'hub' ? 'active' : ''}`}
            title="Space Adventure Hub"
          >
            <MapPin size={18} />
            <span>Hub</span>
          </button>

          <button
            onClick={() => navigateTo('explore')}
            className={`nav-link-btn ${currentScreen === 'explore' ? 'active' : ''}`}
            title="Explore 3D Solar System"
          >
            <Compass size={18} />
            <span>Explore Space</span>
          </button>

          <button
            onClick={() => navigateTo('missions')}
            className={`nav-link-btn ${currentScreen.startsWith('mission') ? 'active' : ''}`}
            title="All Missions"
          >
            <Rocket size={18} />
            <span>Missions</span>
          </button>

          <button
            onClick={() => navigateTo('minigames')}
            className={`nav-link-btn ${currentScreen === 'minigames' ? 'active' : ''}`}
            title="Space Academy Mini-Games"
          >
            <Gamepad2 size={18} />
            <span>Mini-Games</span>
          </button>

          <button
            onClick={() => navigateTo('astronaut')}
            className={`nav-link-btn ${currentScreen === 'astronaut' ? 'active' : ''}`}
            title="My Astronaut & Badges"
          >
            <User size={18} />
            <span>My Astronaut</span>
          </button>

          {/* Audio Mute Toggle */}
          <button
            onClick={toggleSound}
            className="audio-control-btn ms-1"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label="Toggle Audio"
          >
            {isMuted ? <VolumeX size={18} color="#f87171" /> : <Volume2 size={18} color="#34d399" />}
          </button>
        </nav>
      )}

      {/* Screen Views */}
      <main style={{ position: 'relative', zIndex: 1, paddingTop: currentScreen !== 'home' ? '70px' : 0 }}>
        {/* 1. Opening Intro Scene */}
        {currentScreen === 'home' && (
          <OpeningScene
            onLaunchComplete={() => navigateTo('hub')}
            onExploreSpace={() => navigateTo('explore')}
          />
        )}

        {/* 2. Space Adventure Hub */}
        {currentScreen === 'hub' && (
          <HubScene onSelectDestination={handleDestinationSelect} />
        )}

        {/* 3. Explore Space (Solar System) */}
        {currentScreen === 'explore' && <SolarSystemScene />}

        {/* 4. Missions Menu List */}
        {currentScreen === 'missions' && (
          <div style={{ maxWidth: '960px', margin: '0 auto', padding: '30px 20px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <div>
                <h2 style={{ color: '#fff', fontWeight: 900, margin: 0 }}>🚀 ASTRONAUT MISSIONS</h2>
                <p style={{ color: '#c4b5fd', margin: 0 }}>
                  Select an active expedition to train, explore alien worlds, and earn badges!
                </p>
              </div>

              <span className="xp-badge">
                <Trophy size={16} /> Total XP: {progress.xp}
              </span>
            </div>

            <div className="row g-4">
              {MISSIONS.map((mission) => {
                const isDone = progress.completedMissions.includes(mission.id);

                return (
                  <div key={mission.id} className="col-12 col-md-6 col-lg-4">
                    <div
                      className="game-card p-4 h-100 d-flex flex-column justify-content-between"
                      style={{ borderColor: mission.color }}
                    >
                      <div>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <span style={{ fontSize: '2.4rem' }}>{mission.icon}</span>
                          <span
                            style={{
                              backgroundColor: 'rgba(255,255,255,0.1)',
                              color: '#ffd60a',
                              padding: '4px 10px',
                              borderRadius: '10px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                            }}
                          >
                            {mission.difficulty}
                          </span>
                        </div>

                        <h4 style={{ color: '#fff', fontWeight: 800, marginBottom: '6px' }}>
                          {mission.title}
                        </h4>

                        <div style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '10px' }}>
                          📍 {mission.location}
                        </div>

                        <p style={{ color: '#e2e8f0', fontSize: '0.9rem', lineHeight: 1.4, marginBottom: '16px' }}>
                          {mission.tagline}
                        </p>
                      </div>

                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="xp-badge" style={{ fontSize: '0.85rem', padding: '4px 10px' }}>
                            <Trophy size={14} /> +{mission.rewardXP} XP
                          </span>

                          {isDone && (
                            <span style={{ color: '#34d399', fontSize: '0.85rem', fontWeight: 800 }}>
                              ✓ COMPLETED
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            soundEffects.click();
                            if (mission.id === 'moon-dash') navigateTo('mission-moon');
                            else if (mission.id === 'mars-mystery') navigateTo('mission-mars');
                            else if (mission.id === 'save-station') navigateTo('mission-station');
                          }}
                          className={`game-btn ${isDone ? 'game-btn-secondary' : 'game-btn-primary'} w-100`}
                        >
                          <Play size={18} /> {isDone ? 'Replay Mission' : 'Start Mission'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Playable Mission 1: Moon Dash */}
        {currentScreen === 'mission-moon' && (
          <MoonDashMission onBackToHub={() => navigateTo('hub')} />
        )}

        {/* Playable Mission 2: Mars Mystery */}
        {currentScreen === 'mission-mars' && (
          <MarsMysteryMission onBackToHub={() => navigateTo('hub')} />
        )}

        {/* Playable Mission 3: Save Station */}
        {currentScreen === 'mission-station' && (
          <SaveStationMission onBackToHub={() => navigateTo('hub')} />
        )}

        {/* Mini-Games Section */}
        {currentScreen === 'minigames' && (
          <MiniGamesHub onBackToHub={() => navigateTo('hub')} />
        )}

        {/* My Astronaut Section */}
        {currentScreen === 'astronaut' && <AstronautProfile />}
      </main>

      {/* Floating Cosmo Space Buddy Trigger Button */}
      <div className="cosmo-floating-bubble">
        <button
          onClick={() => {
            soundEffects.click();
            setIsCosmoOpen(true);
          }}
          className="cosmo-btn-trigger"
          title="Chat with Cosmo AI Space Buddy"
          aria-label="Open Cosmo AI Space Buddy"
        >
          <span style={{ fontSize: '2rem' }}>👾</span>
          <span className="cosmo-badge-ping" />
        </button>
      </div>

      {/* Cosmo Pop-up Toast Message when achievements or tips are triggered */}
      {activeCosmoDialog && (
        <div
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '24px',
            zIndex: 1050,
            maxWidth: '380px',
            background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.96) 0%, rgba(30, 58, 138, 0.96) 100%)',
            border: '2px solid #00f0ff',
            borderRadius: '20px',
            padding: '16px 20px',
            boxShadow: '0 12px 35px rgba(0,0,0,0.6), 0 0 20px rgba(0, 240, 255, 0.3)',
            color: '#fff',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>👾</span>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#ffd60a', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.85rem' }}>
              {currentCompanion.name} SAYS:
            </div>
            <div style={{ fontSize: '0.9rem', lineHeight: 1.4, marginTop: '2px' }}>
              {activeCosmoDialog}
            </div>
          </div>
          <button
            onClick={closeCosmoMessage}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#c4b5fd',
              cursor: 'pointer',
              padding: '2px',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Cosmo AI Chat Modal */}
      <CosmoChatModal
        isOpen={isCosmoOpen}
        onClose={() => setIsCosmoOpen(false)}
        missionContext={currentScreen}
      />
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <MainGameApp />
    </GameProvider>
  );
}
