import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createAstronaut, SUIT_COLORS } from '../three/proceduralModels';
import { BADGES, COMPANIONS } from '../../data/gameData';
import { useGame } from '../../context/GameContext';
import { soundEffects } from '../../utils/audio';
import { SuitColor } from '../../types/game';
import { Trophy, Star, Shield, Award, RotateCcw, Sparkles } from 'lucide-react';

const SUIT_OPTIONS: { id: SuitColor; name: string; colorHex: string }[] = [
  { id: 'cyan', name: 'Cosmic Cyan', colorHex: '#06b6d4' },
  { id: 'white', name: 'Apollo Classic', colorHex: '#f8fafc' },
  { id: 'orange', name: 'Mars Flame', colorHex: '#f97316' },
  { id: 'purple', name: 'Nebula Violet', colorHex: '#9333ea' },
  { id: 'gold', name: 'Solar Gold', colorHex: '#fbbf24' },
  { id: 'neon-pink', name: 'Supernova Pink', colorHex: '#f43f5e' },
];

export const AstronautProfile: React.FC = () => {
  const { progress, setSuitColor, setCompanion, resetProgress } = useGame();
  const mountRef = useRef<HTMLDivElement>(null);
  const astroGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.2, 4.2);
    camera.lookAt(0, 1.0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xa855f7, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(3, 5, 4);
    scene.add(dirLight);

    const rimLight = new THREE.PointLight(0x00f0ff, 1.5, 10);
    rimLight.position.set(-3, 2, -2);
    scene.add(rimLight);

    // 3D Astronaut model
    const hex = SUIT_COLORS[progress.suitColor] || 0x06b6d4;
    const astronaut = createAstronaut(hex);
    astronaut.position.y = -0.1;
    scene.add(astronaut);
    astroGroupRef.current = astronaut;

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      if (astroGroupRef.current) {
        astroGroupRef.current.rotation.y = Math.sin(time * 0.8) * 0.35;
        astroGroupRef.current.position.y = -0.1 + Math.sin(time * 2) * 0.08;

        const rightArm = astroGroupRef.current.getObjectByName('rightArmGroup');
        if (rightArm) {
          rightArm.rotation.z = 1.8 + Math.sin(time * 4) * 0.3;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [progress.suitColor]);

  // Rank thresholds
  const nextRankThreshold =
    progress.xp < 100
      ? 100
      : progress.xp < 250
      ? 250
      : progress.xp < 500
      ? 500
      : progress.xp < 800
      ? 800
      : progress.xp < 1200
      ? 1200
      : 2000;
  const progressPercent = Math.min(100, Math.floor((progress.xp / nextRankThreshold) * 100));

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '88vh',
        padding: '30px 20px',
        maxWidth: '1080px',
        margin: '0 auto',
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 style={{ color: '#fff', fontWeight: 900, margin: 0 }}>👨‍🚀 MY ASTRONAUT HEADQUARTERS</h2>
          <p style={{ color: '#c4b5fd', margin: 0, fontSize: '0.95rem' }}>
            Customize your flight suit, view unlocked mission badges, and track astronaut rank!
          </p>
        </div>

        <button onClick={resetProgress} className="game-btn game-btn-secondary game-btn-sm">
          <RotateCcw size={16} /> Reset Training Log
        </button>
      </div>

      <div className="row g-4">
        {/* Left Column: 3D Interactive Astronaut & Suit Selector */}
        <div className="col-12 col-lg-5">
          <div className="game-card p-4 text-center h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="rank-badge">{progress.rank}</span>
              <span className="xp-badge">
                <Star size={16} fill="#ffd60a" color="#ffd60a" /> {progress.xp} XP Stars
              </span>
            </div>

            {/* 3D Model Canvas Mount */}
            <div
              ref={mountRef}
              style={{
                width: '100%',
                height: '280px',
                margin: '0 auto 16px auto',
                borderRadius: '20px',
                background: 'radial-gradient(circle, rgba(147, 51, 234, 0.25) 0%, rgba(10, 5, 27, 0) 70%)',
              }}
            />

            <h5 style={{ color: '#ffd60a', fontWeight: 800, marginBottom: '12px' }}>
              CHOOSE SUIT COLOR:
            </h5>

            <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
              {SUIT_OPTIONS.map((suit) => {
                const isSelected = progress.suitColor === suit.id;
                return (
                  <button
                    key={suit.id}
                    onClick={() => setSuitColor(suit.id)}
                    className="game-btn game-btn-sm"
                    style={{
                      background: isSelected ? suit.colorHex : 'rgba(30, 18, 64, 0.85)',
                      color: isSelected && suit.id === 'white' ? '#0f172a' : '#fff',
                      borderColor: isSelected ? '#ffd60a' : 'rgba(255,255,255,0.2)',
                      padding: '6px 14px',
                      fontSize: '0.85rem',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: suit.colorHex,
                        marginRight: '6px',
                        border: '1px solid #fff',
                      }}
                    />
                    {suit.name}
                  </button>
                );
              })}
            </div>

            {/* Next Rank Progress Bar */}
            <div style={{ textAlign: 'left', marginTop: '16px' }}>
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span style={{ color: '#c4b5fd', fontSize: '0.8rem', fontWeight: 700 }}>
                  RANK ADVANCEMENT PROGRESS:
                </span>
                <span style={{ color: '#34d399', fontSize: '0.85rem', fontWeight: 800 }}>
                  {progress.xp} / {nextRankThreshold} XP ({progressPercent}%)
                </span>
              </div>
              <div style={{ width: '100%', height: '10px', background: '#1e293b', borderRadius: '6px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${progressPercent}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #ec4899, #ffd60a)',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Companions & Badges Gallery */}
        <div className="col-12 col-lg-7">
          {/* Companion Selection */}
          <div className="game-card p-4 mb-4">
            <h4 style={{ color: '#fff', fontWeight: 800, marginBottom: '14px' }}>
              🛸 ACTIVE SPACE COMPANION
            </h4>
            <div className="row g-2">
              {COMPANIONS.map((comp) => {
                const isSelected = progress.companionId === comp.id;
                return (
                  <div key={comp.id} className="col-12 col-sm-6">
                    <div
                      onClick={() => setCompanion(comp.id)}
                      style={{
                        background: isSelected ? 'rgba(147, 51, 234, 0.35)' : 'rgba(24, 13, 56, 0.8)',
                        border: `2px solid ${isSelected ? '#ffd60a' : 'rgba(168, 85, 247, 0.3)'}`,
                        borderRadius: '16px',
                        padding: '12px 14px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>
                          {comp.name}
                        </span>
                        {isSelected && (
                          <span style={{ color: '#ffd60a', fontSize: '0.8rem', fontWeight: 800 }}>
                            ACTIVE ⭐
                          </span>
                        )}
                      </div>
                      <div style={{ color: '#c4b5fd', fontSize: '0.75rem', marginBottom: '4px' }}>
                        {comp.species}
                      </div>
                      <div style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 600 }}>
                        {comp.perk}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges Gallery */}
          <div className="game-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 style={{ color: '#fff', fontWeight: 800, margin: 0 }}>🏆 UNLOCKED SPACE BADGES</h4>
              <span style={{ color: '#34d399', fontWeight: 800, fontSize: '0.9rem' }}>
                {progress.unlockedBadges.length} / {BADGES.length} Badges
              </span>
            </div>

            <div className="row g-2">
              {BADGES.map((badge) => {
                const isUnlocked = progress.unlockedBadges.includes(badge.id);
                return (
                  <div key={badge.id} className="col-12 col-sm-6">
                    <div
                      style={{
                        background: isUnlocked ? 'rgba(30, 20, 68, 0.85)' : 'rgba(15, 10, 35, 0.5)',
                        border: `2px solid ${isUnlocked ? 'rgba(255, 214, 10, 0.6)' : 'rgba(255, 255, 255, 0.1)'}`,
                        borderRadius: '16px',
                        padding: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        opacity: isUnlocked ? 1 : 0.45,
                      }}
                    >
                      <span style={{ fontSize: '2rem' }}>{badge.icon}</span>
                      <div>
                        <div style={{ color: isUnlocked ? '#fff' : '#94a3b8', fontWeight: 800, fontSize: '0.95rem' }}>
                          {badge.title}
                        </div>
                        <div style={{ color: '#c4b5fd', fontSize: '0.75rem', lineHeight: 1.3 }}>
                          {badge.description}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
