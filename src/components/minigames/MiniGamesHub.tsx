import React, { useState, useEffect, useRef } from 'react';
import { soundEffects } from '../../utils/audio';
import { useGame } from '../../context/GameContext';
import { QUIZ_QUESTIONS, PLANETS_DATA } from '../../data/gameData';
import { Trophy, Rocket, Sparkles, Brain, Shield, Grid, RotateCcw, Check, ArrowLeft } from 'lucide-react';

type MiniGameTab = 'rocket' | 'dodge' | 'matching' | 'memory' | 'quiz';

export const MiniGamesHub: React.FC<{ onBackToHub: () => void }> = ({ onBackToHub }) => {
  const [activeTab, setActiveTab] = useState<MiniGameTab>('rocket');

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '88vh',
        padding: '24px 16px',
        maxWidth: '1020px',
        margin: '0 auto',
      }}
    >
      {/* Top Header & Navigation Tabs */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <button
          onClick={() => {
            soundEffects.click();
            onBackToHub();
          }}
          className="game-btn game-btn-secondary game-btn-sm"
        >
          <ArrowLeft size={16} /> Exit to Hub
        </button>

        <div className="d-flex align-items-center gap-2">
          <span
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
              color: '#fff',
              padding: '6px 16px',
              borderRadius: '12px',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1rem',
            }}
          >
            SPACE ACADEMY MINI-GAMES 🎮
          </span>
        </div>
      </div>

      {/* Mini-Game Tab Selector Pills */}
      <div className="d-flex flex-wrap gap-2 mb-4 justify-content-center">
        {[
          { id: 'rocket', name: 'Build a Rocket', icon: <Rocket size={16} /> },
          { id: 'dodge', name: 'Asteroid Dodge', icon: <Shield size={16} /> },
          { id: 'matching', name: 'Planet Matching', icon: <Grid size={16} /> },
          { id: 'memory', name: 'Cosmic Memory', icon: <Sparkles size={16} /> },
          { id: 'quiz', name: 'Space Quiz', icon: <Brain size={16} /> },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundEffects.click();
                setActiveTab(tab.id as MiniGameTab);
              }}
              className={`game-btn game-btn-sm ${isActive ? 'game-btn-accent' : 'game-btn-secondary'}`}
              style={{ padding: '8px 16px' }}
            >
              {tab.icon} {tab.name}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      {activeTab === 'rocket' && <BuildRocketGame />}
      {activeTab === 'dodge' && <AsteroidDodgeGame />}
      {activeTab === 'matching' && <PlanetMatchingGame />}
      {activeTab === 'memory' && <CosmicMemoryGame />}
      {activeTab === 'quiz' && <SpaceQuizGame />}
    </div>
  );
};

/* =========================================================================
   1. BUILD A ROCKET MINI-GAME
   ========================================================================= */
const ROCKET_STAGES = [
  { id: 'fins', name: '1. Aerodynamic Stabilizer Fins', icon: '📐', hint: 'Keeps rocket pointed straight through dense Earth atmosphere' },
  { id: 'booster', name: '2. Main Heavy Rocket Booster (RS-25)', icon: '🔥', hint: 'Provides 2 million pounds of thrust to escape gravity' },
  { id: 'fuel', name: '3. Liquid Oxygen & Hydrogen Fuel Tank', icon: '⛽', hint: 'Stores cryogenic fuel to power the orbital climb' },
  { id: 'capsule', name: '4. Orion Crew Capsule & Heat Shield', icon: '👨‍🚀', hint: 'Pressurized cabin where astronauts live and work safely' },
  { id: 'tower', name: '5. Launch Escape Tower System', icon: '🗼', hint: 'Safety rocket at the very top that can pull astronauts to safety' },
];

function BuildRocketGame() {
  const { addXP, unlockBadge, recordRocketBuilt } = useGame();
  const [selectedSequence, setSelectedSequence] = useState<string[]>([]);
  const [isLaunched, setIsLaunched] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSelectPart = (id: string) => {
    if (selectedSequence.includes(id)) return;
    soundEffects.click();
    const nextSeq = [...selectedSequence, id];
    setSelectedSequence(nextSeq);

    // Verify ordering
    const expectedId = ROCKET_STAGES[nextSeq.length - 1].id;
    if (id !== expectedId) {
      soundEffects.gentleError();
      setFeedback('Oops! That part does not fit here. Remember: build from bottom booster to top escape tower!');
    } else {
      soundEffects.starCollect();
      setFeedback(null);
      if (nextSeq.length === ROCKET_STAGES.length) {
        soundEffects.fanfare();
        setFeedback('🚀 All stages locked and verified! Ready for orbital test liftoff!');
      }
    }
  };

  const handleReset = () => {
    soundEffects.click();
    setSelectedSequence([]);
    setIsLaunched(false);
    setFeedback(null);
  };

  const handleLaunchTest = () => {
    setIsLaunched(true);
    soundEffects.launchWhoosh();
    addXP(100, 'Assembled and launched a real multi-stage rocket!');
    unlockBadge('rocket-builder');
    recordRocketBuilt();
  };

  const isCorrectOrder =
    selectedSequence.length === ROCKET_STAGES.length &&
    selectedSequence.every((id, idx) => id === ROCKET_STAGES[idx].id);

  return (
    <div className="game-card p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3 style={{ color: '#fff', fontWeight: 800, margin: 0 }}>🛠️ BUILD A REAL MULTI-STAGE ROCKET</h3>
          <p style={{ color: '#c4b5fd', margin: 0, fontSize: '0.9rem' }}>
            Assemble the rocket stages in order from bottom boosters to top escape tower!
          </p>
        </div>
        <button onClick={handleReset} className="game-btn game-btn-secondary game-btn-sm">
          <RotateCcw size={16} /> Reset Stages
        </button>
      </div>

      <div className="row g-4 align-items-center">
        {/* Available Parts Palette */}
        <div className="col-12 col-md-6">
          <div style={{ color: '#ffd60a', fontWeight: 700, marginBottom: '8px', fontSize: '0.9rem' }}>
            AVAILABLE ROCKET COMPONENTS:
          </div>
          <div className="d-flex flex-column gap-2">
            {ROCKET_STAGES.map((part) => {
              const isUsed = selectedSequence.includes(part.id);
              return (
                <button
                  key={part.id}
                  disabled={isUsed || isLaunched}
                  onClick={() => handleSelectPart(part.id)}
                  className="game-btn game-btn-secondary"
                  style={{
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    padding: '10px 14px',
                    opacity: isUsed ? 0.35 : 1,
                  }}
                >
                  <span style={{ fontSize: '1.4rem' }}>{part.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{part.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#c4b5fd' }}>{part.hint}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Assembly Pad / Launch Gantry */}
        <div className="col-12 col-md-6 text-center">
          <div
            style={{
              background: 'linear-gradient(180deg, #1e1145 0%, #0a041f 100%)',
              border: '2px solid #a855f7',
              borderRadius: '20px',
              padding: '24px',
              minHeight: '360px',
              display: 'flex',
              flexDirection: 'column-reverse',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '8px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {isLaunched && (
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  color: '#ffd60a',
                  fontWeight: 900,
                  fontSize: '1.6rem',
                  animation: 'pulseGlow 1s infinite alternate',
                }}
              >
                🔥 LIFTOFF SUCCESSFUL! 🔥
              </div>
            )}

            {selectedSequence.map((id, idx) => {
              const part = ROCKET_STAGES.find((p) => p.id === id);
              if (!part) return null;
              return (
                <div
                  key={id}
                  style={{
                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    border: '2px solid #38bdf8',
                    borderRadius: '12px',
                    padding: '8px 20px',
                    color: '#fff',
                    fontWeight: 700,
                    width: '80%',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
                    transform: isLaunched ? 'translateY(-140px)' : 'none',
                    transition: 'transform 2s cubic-bezier(0.25, 1, 0.5, 1)',
                  }}
                >
                  {part.icon} {part.name}
                </div>
              );
            })}

            {selectedSequence.length === 0 && (
              <div style={{ color: '#94a3b8', margin: 'auto 0', fontSize: '0.95rem' }}>
                🚀 Launchpad Gantry is empty. Click a component to mount!
              </div>
            )}
          </div>

          {feedback && (
            <div
              style={{
                marginTop: '12px',
                color: isCorrectOrder ? '#34d399' : '#f87171',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
            >
              {feedback}
            </div>
          )}

          {isCorrectOrder && !isLaunched && (
            <button onClick={handleLaunchTest} className="game-btn game-btn-primary game-btn-lg mt-3 w-100">
              <Rocket size={24} /> LAUNCH TEST BOOSTERS!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   2. ASTEROID DODGE ARCADE MINI-GAME
   ========================================================================= */
function AsteroidDodgeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addXP, unlockBadge } = useGame();

  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const gameLoopRef = useRef<number | null>(null);
  const stateRef = useRef({
    playerX: 200,
    playerSpeed: 7,
    asteroids: [] as { x: number; y: number; size: number; speed: number; rot: number }[],
    stars: [] as { x: number; y: number; size: number }[],
    left: false,
    right: false,
    score: 0,
    isOver: false,
  });

  const startGame = () => {
    soundEffects.click();
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    stateRef.current.score = 0;
    stateRef.current.isOver = false;
    stateRef.current.playerX = 200;
    stateRef.current.asteroids = [];

    // Keys
    const onKey = (e: KeyboardEvent, isDown: boolean) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') stateRef.current.left = isDown;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') stateRef.current.right = isDown;
    };

    window.onkeydown = (e) => onKey(e, true);
    window.onkeyup = (e) => onKey(e, false);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastSpawn = 0;

    const tick = (time: number) => {
      if (stateRef.current.isOver) return;

      const st = stateRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Stars background
      ctx.fillStyle = '#ffffff';
      if (Math.random() < 0.2) {
        st.stars.push({ x: Math.random() * canvas.width, y: 0, size: Math.random() * 2 + 1 });
      }
      st.stars.forEach((s) => {
        s.y += 2;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      });
      st.stars = st.stars.filter((s) => s.y < canvas.height);

      // Player Movement
      if (st.left) st.playerX = Math.max(25, st.playerX - st.playerSpeed);
      if (st.right) st.playerX = Math.min(canvas.width - 25, st.playerX + st.playerSpeed);

      // Draw Cute Shuttle
      const px = st.playerX;
      const py = canvas.height - 40;
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.moveTo(px, py - 20);
      ctx.lineTo(px + 18, py + 15);
      ctx.lineTo(px - 18, py + 15);
      ctx.closePath();
      ctx.fill();

      // Shuttle cockpit
      ctx.fillStyle = '#ffd60a';
      ctx.beginPath();
      ctx.arc(px, py - 2, 6, 0, Math.PI * 2);
      ctx.fill();

      // Shuttle exhaust flames
      ctx.fillStyle = '#ff2a85';
      ctx.beginPath();
      ctx.moveTo(px - 8, py + 15);
      ctx.lineTo(px + 8, py + 15);
      ctx.lineTo(px, py + 25 + Math.random() * 8);
      ctx.closePath();
      ctx.fill();

      // Spawn Asteroids
      if (time - lastSpawn > 650) {
        lastSpawn = time;
        st.asteroids.push({
          x: 20 + Math.random() * (canvas.width - 40),
          y: -20,
          size: 16 + Math.random() * 18,
          speed: 3 + Math.random() * 3,
          rot: Math.random() * Math.PI,
        });
      }

      // Update & Draw Asteroids
      ctx.fillStyle = '#64748b';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;

      for (let i = 0; i < st.asteroids.length; i++) {
        const a = st.asteroids[i];
        a.y += a.speed;

        ctx.beginPath();
        ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Collision check
        const dist = Math.hypot(px - a.x, py - a.y);
        if (dist < a.size + 14) {
          // Game Over!
          st.isOver = true;
          setGameOver(true);
          soundEffects.gentleError();
          return;
        }
      }

      // Cleanup asteroids offscreen
      st.asteroids = st.asteroids.filter((a) => a.y < canvas.height + 30);

      // Score increment
      st.score += 1;
      setScore(Math.floor(st.score / 10));

      gameLoopRef.current = requestAnimationFrame(tick);
    };

    gameLoopRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, []);

  const [starsClaimed, setStarsClaimed] = useState(false);

  const handleClaimReward = () => {
    if (starsClaimed) return;
    setStarsClaimed(true);
    addXP(score * 2, 'Asteroid Dodge Score Reward!');
    if (score >= 30) {
      unlockBadge('asteroid-ace');
    }
  };

  return (
    <div className="game-card p-4 text-center">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 style={{ color: '#fff', fontWeight: 800, margin: 0 }}>☄️ ASTEROID BELT DODGE</h3>
        <span className="xp-badge">Score: {score}</span>
      </div>

      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
          margin: '0 auto',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '3px solid #ff2a85',
          background: '#090518',
        }}
      >
        <canvas ref={canvasRef} width={440} height={420} style={{ display: 'block', width: '100%' }} />

        {!gameStarted && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(10, 5, 27, 0.85)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <h4 style={{ color: '#ffd60a', fontWeight: 800 }}>DODGE THE METEORS!</h4>
            <p style={{ color: '#e2e8f0', fontSize: '0.9rem' }}>
              Use Left & Right Arrow keys or on-screen buttons below to steer your scout shuttle!
            </p>
            <button onClick={() => { setStarsClaimed(false); startGame(); }} className="game-btn game-btn-primary game-btn-lg">
              START FLIGHT! 🚀
            </button>
          </div>
        )}

        {gameOver && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(10, 5, 27, 0.9)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <h3 style={{ color: '#f87171', fontWeight: 900 }}>METEOR IMPACT!</h3>
            <p style={{ color: '#fff' }}>Final Score: {score}</p>
            <div className="d-flex gap-2">
              <button onClick={() => { setStarsClaimed(false); startGame(); }} className="game-btn game-btn-primary">
                Try Again
              </button>
              <button
                disabled={starsClaimed || score === 0}
                onClick={handleClaimReward}
                className="game-btn game-btn-accent"
              >
                {starsClaimed ? 'Stars Claimed ✓' : 'Claim Stars ⭐'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* On-Screen Mobile Buttons */}
      <div className="d-flex justify-content-center gap-3 mt-3">
        <button
          onPointerDown={() => { stateRef.current.left = true; }}
          onPointerUp={() => { stateRef.current.left = false; }}
          onPointerLeave={() => { stateRef.current.left = false; }}
          onPointerCancel={() => { stateRef.current.left = false; }}
          className="game-btn game-btn-secondary"
          style={{ width: '120px' }}
        >
          ◀ Steer Left
        </button>
        <button
          onPointerDown={() => { stateRef.current.right = true; }}
          onPointerUp={() => { stateRef.current.right = false; }}
          onPointerLeave={() => { stateRef.current.right = false; }}
          onPointerCancel={() => { stateRef.current.right = false; }}
          className="game-btn game-btn-secondary"
          style={{ width: '120px' }}
        >
          Steer Right ▶
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   3. PLANET MATCHING MINI-GAME (AUTHENTIC EDUCATIONAL MATCHING)
   ========================================================================= */
interface MatchItem {
  id: string;
  name: string;
  color: string;
  trait: string;
}

const MATCHING_PLANETS: MatchItem[] = [
  { id: 'earth', name: 'Earth', color: '#3b82f6', trait: 'Only known planet with liquid oceans and life' },
  { id: 'mars', name: 'Mars', color: '#ef4444', trait: 'Covered in oxidized rusty iron dust & Olympus Mons' },
  { id: 'jupiter', name: 'Jupiter', color: '#d97706', trait: 'Largest giant with 95 moons & Great Red Spot' },
  { id: 'saturn', name: 'Saturn', color: '#fbbf24', trait: 'Dazzling ring system made of icy boulders and dust' },
  { id: 'venus', name: 'Venus', color: '#eab308', trait: 'Superheated greenhouse planet with acid clouds' },
];

function PlanetMatchingGame() {
  const { addXP } = useGame();
  const [selectedPlanetId, setSelectedPlanetId] = useState<string | null>(null);
  const [selectedNameId, setSelectedNameId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Shuffle name order so they aren't parallel
  const [shuffledNames] = useState(() =>
    [...MATCHING_PLANETS].sort(() => Math.random() - 0.5)
  );

  const handleSelectPlanet = (id: string) => {
    if (matchedIds.includes(id)) return;
    soundEffects.click();
    setSelectedPlanetId(id);
    setFeedback(null);

    // If name already selected, check match
    if (selectedNameId) {
      checkMatch(id, selectedNameId);
    }
  };

  const handleSelectName = (id: string) => {
    if (matchedIds.includes(id)) return;
    soundEffects.click();
    setSelectedNameId(id);
    setFeedback(null);

    // If planet already selected, check match
    if (selectedPlanetId) {
      checkMatch(selectedPlanetId, id);
    }
  };

  const checkMatch = (pId: string, nId: string) => {
    if (pId === nId) {
      soundEffects.starCollect();
      const p = MATCHING_PLANETS.find((item) => item.id === pId);
      setMatchedIds((prev) => [...prev, pId]);
      setSelectedPlanetId(null);
      setSelectedNameId(null);
      setFeedback(`🌟 Excellent match! ${p?.name}: ${p?.trait}!`);
      addXP(30, `Matched ${p?.name}!`);
    } else {
      soundEffects.gentleError();
      const p = MATCHING_PLANETS.find((item) => item.id === pId);
      const n = MATCHING_PLANETS.find((item) => item.id === nId);
      setFeedback(`Not a match! ${n?.name} does not match ${p?.trait}. Try another!`);
      setTimeout(() => {
        setSelectedPlanetId(null);
        setSelectedNameId(null);
      }, 900);
    }
  };

  const handleReset = () => {
    soundEffects.click();
    setMatchedIds([]);
    setSelectedPlanetId(null);
    setSelectedNameId(null);
    setFeedback(null);
  };

  const allDone = matchedIds.length === MATCHING_PLANETS.length;

  return (
    <div className="game-card p-4 text-center">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 style={{ color: '#fff', fontWeight: 800, margin: 0 }}>🪐 PLANET MATCHING CHALLENGE</h3>
        <button onClick={handleReset} className="game-btn game-btn-secondary game-btn-sm">
          <RotateCcw size={16} /> Reset Matches
        </button>
      </div>

      <p style={{ color: '#c4b5fd', fontSize: '0.95rem', marginBottom: '16px' }}>
        Click a <strong>Planet Clue Card</strong> on the left, then click its matching <strong>Name Badge</strong> on the right!
      </p>

      {feedback && (
        <div
          style={{
            background: feedback.includes('Excellent') ? 'rgba(5, 150, 105, 0.25)' : 'rgba(220, 38, 38, 0.25)',
            border: `2px solid ${feedback.includes('Excellent') ? '#34d399' : '#f87171'}`,
            borderRadius: '14px',
            padding: '10px 16px',
            marginBottom: '16px',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.95rem',
          }}
        >
          {feedback}
        </div>
      )}

      {allDone && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.5) 0%, rgba(6, 182, 212, 0.5) 100%)',
            border: '2px solid #ffd60a',
            borderRadius: '20px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <div style={{ fontSize: '2.5rem' }}>🎉🏆</div>
          <h4 style={{ color: '#ffd60a', fontWeight: 900 }}>ALL PLANETS MATCHED!</h4>
          <p style={{ color: '#fff', margin: 0 }}>You have mastered the identities of our Solar System neighbors!</p>
        </div>
      )}

      <div className="row g-4 align-items-center">
        {/* Left Column: Planet Trait & Orb Cards */}
        <div className="col-12 col-md-6">
          <div style={{ color: '#ffd60a', fontWeight: 800, fontSize: '0.9rem', marginBottom: '10px' }}>
            PLANETARY CLUES:
          </div>
          <div className="d-flex flex-column gap-2">
            {MATCHING_PLANETS.map((p) => {
              const isMatched = matchedIds.includes(p.id);
              const isSelected = selectedPlanetId === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectPlanet(p.id)}
                  style={{
                    background: isMatched
                      ? 'rgba(5, 150, 105, 0.35)'
                      : isSelected
                      ? 'rgba(168, 85, 247, 0.45)'
                      : 'rgba(24, 13, 56, 0.85)',
                    border: `2px solid ${isMatched ? '#34d399' : isSelected ? '#ffd60a' : 'rgba(168, 85, 247, 0.35)'}`,
                    borderRadius: '16px',
                    padding: '12px 16px',
                    cursor: isMatched ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    textAlign: 'left',
                    opacity: isMatched ? 0.7 : 1,
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: p.color,
                      flexShrink: 0,
                      boxShadow: `0 0 10px ${p.color}`,
                    }}
                  />
                  <div style={{ color: '#e2e8f0', fontSize: '0.9rem', fontWeight: 600 }}>
                    {p.trait}
                  </div>
                  {isMatched && <div style={{ color: '#34d399', fontWeight: 800, marginLeft: 'auto' }}>✓</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Planet Name Badges */}
        <div className="col-12 col-md-6">
          <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: '0.9rem', marginBottom: '10px' }}>
            PLANET NAMES:
          </div>
          <div className="d-flex flex-column gap-2">
            {shuffledNames.map((p) => {
              const isMatched = matchedIds.includes(p.id);
              const isSelected = selectedNameId === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectName(p.id)}
                  style={{
                    background: isMatched
                      ? 'rgba(5, 150, 105, 0.35)'
                      : isSelected
                      ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)'
                      : 'rgba(24, 13, 56, 0.85)',
                    border: `2px solid ${isMatched ? '#34d399' : isSelected ? '#ffd60a' : 'rgba(56, 189, 248, 0.35)'}`,
                    borderRadius: '16px',
                    padding: '14px 20px',
                    cursor: isMatched ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    opacity: isMatched ? 0.7 : 1,
                  }}
                >
                  <span style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem' }}>
                    {p.name}
                  </span>
                  {isMatched && <span style={{ color: '#34d399', fontWeight: 800 }}>MATCHED ✓</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   4. COSMIC MEMORY CARD MINI-GAME
   ========================================================================= */
const MEMORY_CARDS = [
  { id: 1, icon: '🚀', name: 'Rocket' },
  { id: 2, icon: '🚀', name: 'Rocket' },
  { id: 3, icon: '🌕', name: 'Moon' },
  { id: 4, icon: '🌕', name: 'Moon' },
  { id: 5, icon: '🪐', name: 'Saturn' },
  { id: 6, icon: '🪐', name: 'Saturn' },
  { id: 7, icon: '👾', name: 'Alien' },
  { id: 8, icon: '👾', name: 'Alien' },
];

function CosmicMemoryGame() {
  const { addXP } = useGame();
  const [cards, setCards] = useState(() => [...MEMORY_CARDS].sort(() => Math.random() - 0.5));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);

  const handleCardClick = (idx: number) => {
    if (flipped.includes(idx) || matched.includes(idx) || flipped.length >= 2) return;
    soundEffects.click();

    const nextFlipped = [...flipped, idx];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      const c1 = cards[nextFlipped[0]];
      const c2 = cards[nextFlipped[1]];

      if (c1.name === c2.name) {
        soundEffects.starCollect();
        setMatched((prev) => [...prev, nextFlipped[0], nextFlipped[1]]);
        setFlipped([]);
        addXP(40, `Matched ${c1.name}!`);
      } else {
        setTimeout(() => {
          setFlipped([]);
        }, 900);
      }
    }
  };

  const handleRestart = () => {
    soundEffects.click();
    setCards([...MEMORY_CARDS].sort(() => Math.random() - 0.5));
    setFlipped([]);
    setMatched([]);
  };

  const isAllMatched = matched.length === cards.length;

  return (
    <div className="game-card p-4 text-center">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 style={{ color: '#fff', fontWeight: 800, margin: 0 }}>✨ COSMIC MEMORY PAIRS</h3>
        <button onClick={handleRestart} className="game-btn game-btn-secondary game-btn-sm">
          <RotateCcw size={16} /> Shuffle Cards
        </button>
      </div>

      <p style={{ color: '#c4b5fd', fontSize: '0.9rem', marginBottom: '16px' }}>
        Flip and match all 4 celestial pairs to test your astronaut memory!
      </p>

      {isAllMatched && (
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.4) 0%, rgba(6, 182, 212, 0.4) 100%)',
            border: '2px solid #34d399',
            borderRadius: '18px',
            padding: '16px',
            marginBottom: '16px',
          }}
        >
          <div style={{ color: '#ffd60a', fontWeight: 900, fontSize: '1.2rem' }}>
            🎉 MEMORY GRID CLEARED!
          </div>
          <div style={{ color: '#fff', fontSize: '0.9rem' }}>
            Superb observation skills, Cadet! +160 Total XP earned!
          </div>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          maxWidth: '460px',
          margin: '0 auto',
        }}
      >
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || matched.includes(idx);
          return (
            <div
              key={idx}
              onClick={() => handleCardClick(idx)}
              style={{
                height: '96px',
                borderRadius: '16px',
                background: isFlipped
                  ? 'linear-gradient(135deg, #7e22ce 0%, #3b82f6 100%)'
                  : 'rgba(30, 18, 64, 0.9)',
                border: `2px solid ${isFlipped ? '#ffd60a' : 'rgba(168, 85, 247, 0.4)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isFlipped ? '2.4rem' : '1.5rem',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                transform: isFlipped ? 'scale(1.05)' : 'none',
              }}
            >
              {isFlipped ? card.icon : '❓'}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================================
   5. SPACE TRIVIA QUIZ MINI-GAME
   ========================================================================= */
function SpaceQuizGame() {
  const { addXP, unlockBadge, recordQuizResult } = useGame();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const q = QUIZ_QUESTIONS[currentIdx];

  const handleSelect = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);

    const isCorrect = idx === q.correctIndex;
    recordQuizResult(isCorrect);

    if (isCorrect) {
      soundEffects.starCollect();
      setScore((s) => s + 1);
      addXP(50, 'Correct astronomy answer!');
    } else {
      soundEffects.gentleError();
    }
  };

  const handleNext = () => {
    soundEffects.click();
    setSelectedAnswer(null);
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      if (score >= 4) {
        unlockBadge('cosmic-scholar');
      }
    }
  };

  const handleRestartQuiz = () => {
    soundEffects.click();
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="game-card p-4" style={{ maxWidth: '680px', margin: '0 auto' }}>
      {!quizFinished ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span style={{ color: '#ffd60a', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
              QUESTION {currentIdx + 1} OF {QUIZ_QUESTIONS.length}
            </span>
            <span className="xp-badge">Score: {score}</span>
          </div>

          <h4 style={{ color: '#fff', fontWeight: 800, marginBottom: '20px', lineHeight: 1.4 }}>
            {q.question}
          </h4>

          <div className="d-flex flex-column gap-2 mb-3">
            {q.options.map((opt, idx) => {
              const isPicked = selectedAnswer === idx;
              const isCorrect = idx === q.correctIndex;

              let btnBg: string | undefined = undefined;
              if (selectedAnswer !== null) {
                if (isCorrect) btnBg = '#059669';
                else if (isPicked) btnBg = '#dc2626';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className="game-btn game-btn-secondary"
                  style={{
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    padding: '12px 18px',
                    fontSize: '0.95rem',
                    backgroundColor: btnBg,
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {selectedAnswer !== null && (
            <div
              style={{
                background: 'rgba(255,255,255,0.08)',
                padding: '14px 18px',
                borderRadius: '16px',
                marginBottom: '16px',
                color: '#e2e8f0',
                fontSize: '0.9rem',
              }}
            >
              💡 <strong>Scientific Explanation:</strong> {q.explanation}
            </div>
          )}

          {selectedAnswer !== null && (
            <button onClick={handleNext} className="game-btn game-btn-primary w-100">
              {currentIdx < QUIZ_QUESTIONS.length - 1 ? 'Next Question ➡️' : 'View Quiz Results 🏆'}
            </button>
          )}
        </>
      ) : (
        <div className="text-center py-4">
          <div style={{ fontSize: '3.5rem', marginBottom: '8px' }}>🧠🌟</div>
          <h2 style={{ color: '#fff', fontWeight: 900 }}>QUIZ COMPLETED!</h2>
          <p style={{ color: '#c4b5fd', fontSize: '1.1rem' }}>
            You scored {score} out of {QUIZ_QUESTIONS.length}!
          </p>
          <button onClick={handleRestartQuiz} className="game-btn game-btn-primary game-btn-lg">
            Play Quiz Again
          </button>
        </div>
      )}
    </div>
  );
}
