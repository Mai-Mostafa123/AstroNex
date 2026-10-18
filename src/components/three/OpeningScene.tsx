import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createAstronaut, createRocket, SUIT_COLORS } from './proceduralModels';
import { soundEffects } from '../../utils/audio';
import { useGame } from '../../context/GameContext';
import { Rocket, Sparkles, Compass, FastForward } from 'lucide-react';

interface OpeningSceneProps {
  onLaunchComplete: () => void;
  onExploreSpace: () => void;
}

export const OpeningScene: React.FC<OpeningSceneProps> = ({ onLaunchComplete, onExploreSpace }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { progress } = useGame();

  const [launching, setLaunching] = useState(false);
  const [countdownText, setCountdownText] = useState<string | null>(null);

  // Mutable animation state in refs
  const stateRef = useRef({
    launching: false,
    launchProgress: 0,
    countdown: 3,
    skip: false,
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0d0722, 0.015);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Studio Lights
    const ambientLight = new THREE.AmbientLight(0x7c3aed, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const cyanRim = new THREE.DirectionalLight(0x00f0ff, 1.8);
    cyanRim.position.set(-6, 2, -4);
    scene.add(cyanRim);

    const pinkFill = new THREE.PointLight(0xff2a85, 2, 20);
    pinkFill.position.set(0, -3, 3);
    scene.add(pinkFill);

    // Starfield Particle System
    const starsCount = 1200;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starsCount * 3);
    const starColors = new Float32Array(starsCount * 3);

    const palette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0x00f0ff),
      new THREE.Color(0xffd60a),
      new THREE.Color(0xc084fc),
    ];

    for (let i = 0; i < starsCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 160;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 120;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 160 - 20;

      const c = palette[Math.floor(Math.random() * palette.length)];
      starColors[i * 3] = c.r;
      starColors[i * 3 + 1] = c.g;
      starColors[i * 3 + 2] = c.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Drifting Distant Planet
    const planetGeo = new THREE.SphereGeometry(2.4, 32, 32);
    const planetMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      roughness: 0.6,
      metalness: 0.1,
    });
    const distantPlanet = new THREE.Mesh(planetGeo, planetMat);
    distantPlanet.position.set(-8, 3.5, -16);
    scene.add(distantPlanet);

    // Saturn-like planet in background
    const saturnGeo = new THREE.SphereGeometry(1.6, 24, 24);
    const saturnMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 });
    const saturn = new THREE.Mesh(saturnGeo, saturnMat);
    saturn.position.set(9, -2, -20);
    const saturnRing = new THREE.Mesh(
      new THREE.RingGeometry(2.1, 3.2, 32),
      new THREE.MeshBasicMaterial({ color: 0xfde68a, side: THREE.DoubleSide, transparent: true, opacity: 0.7 })
    );
    saturnRing.rotation.x = Math.PI / 2.3;
    saturn.add(saturnRing);
    scene.add(saturn);

    // 3D Astronaut
    const suitHex = SUIT_COLORS[progress.suitColor] || 0x06b6d4;
    const astronaut = createAstronaut(suitHex);
    astronaut.position.set(-1.6, 0.4, 1.2);
    astronaut.rotation.y = 0.45;
    scene.add(astronaut);

    // 3D Rocket
    const rocket = createRocket(0xff2a85, 0xffffff);
    rocket.position.set(1.5, -0.6, 0.8);
    rocket.rotation.z = -0.08;
    scene.add(rocket);

    const flameMesh = rocket.getObjectByName('flame') as THREE.Mesh;
    const innerFlameMesh = rocket.getObjectByName('innerFlame') as THREE.Mesh;
    const rightArm = astronaut.getObjectByName('rightArmGroup') as THREE.Group;

    // Launch Exhaust Particle Emitters
    const exhaustParticlesCount = 180;
    const exhaustGeo = new THREE.BufferGeometry();
    const exhaustPositions = new Float32Array(exhaustParticlesCount * 3);
    const exhaustScales = new Float32Array(exhaustParticlesCount);
    for (let i = 0; i < exhaustParticlesCount; i++) {
      exhaustPositions[i * 3] = (Math.random() - 0.5) * 0.4;
      exhaustPositions[i * 3 + 1] = -0.5 - Math.random() * 2;
      exhaustPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
      exhaustScales[i] = Math.random();
    }
    exhaustGeo.setAttribute('position', new THREE.BufferAttribute(exhaustPositions, 3));
    const exhaustMat = new THREE.PointsMaterial({
      color: 0xffd60a,
      size: 0.4,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const exhaustCloud = new THREE.Points(exhaustGeo, exhaustMat);
    rocket.add(exhaustCloud);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Gentle continuous planetary rotation
      distantPlanet.rotation.y += 0.003;
      saturn.rotation.y += 0.004;
      starField.rotation.y += 0.0003;

      const { launching: isLaunching, launchProgress, skip } = stateRef.current;

      if (!isLaunching) {
        // Astronaut floating bobbing in zero-g
        astronaut.position.y = 0.4 + Math.sin(time * 1.5) * 0.12;
        astronaut.rotation.z = Math.sin(time * 0.8) * 0.05;
        astronaut.rotation.x = Math.cos(time * 0.7) * 0.04;

        // Idle gentle arm breathing
        if (rightArm) {
          rightArm.rotation.z = 0.2 + Math.sin(time * 2) * 0.08;
        }

        // Rocket floating gently
        rocket.position.y = -0.6 + Math.sin(time * 1.2 + 1) * 0.08;
        rocket.rotation.z = -0.08 + Math.cos(time * 1.2) * 0.02;
      } else {
        // Rocket Launch Sequence!
        if (skip) {
          cancelAnimationFrame(animId);
          onLaunchComplete();
          return;
        }

        stateRef.current.launchProgress += delta;
        const p = stateRef.current.launchProgress;

        // Astronaut enthusiastic waving
        if (rightArm) {
          rightArm.rotation.z = 2.2 + Math.sin(time * 12) * 0.45;
          rightArm.rotation.x = Math.sin(time * 6) * 0.2;
        }

        // Countdown shaking phase (p < 3.2s)
        if (p < 3.2) {
          const shake = (p / 3.2) * 0.08;
          rocket.position.x = 1.5 + (Math.random() - 0.5) * shake;
          rocket.position.z = 0.8 + (Math.random() - 0.5) * shake;

          if (flameMesh && innerFlameMesh) {
            flameMesh.visible = true;
            innerFlameMesh.visible = true;
            const flicker = 0.8 + Math.random() * 0.4;
            flameMesh.scale.set(flicker, (p / 3.2) * 1.2, flicker);
            innerFlameMesh.scale.set(flicker * 0.8, (p / 3.2) * 1.0, flicker * 0.8);
          }
          exhaustMat.opacity = THREE.MathUtils.damp(exhaustMat.opacity, 0.7, 5, delta);
        } else {
          // BLASTOFF! Rocket accelerates upward
          const flyProgress = p - 3.2;
          const speed = Math.pow(flyProgress, 2) * 4.5;

          rocket.position.y += speed * delta;
          rocket.position.x += delta * 0.5;

          // Camera zooms into warp starfield
          camera.position.z -= delta * 18;
          camera.fov = THREE.MathUtils.lerp(camera.fov, 75, delta * 2);
          camera.updateProjectionMatrix();

          // Accelerate stars warp speed
          const pos = starGeo.attributes.position.array as Float32Array;
          for (let i = 0; i < starsCount; i++) {
            pos[i * 3 + 2] += delta * 60;
            if (pos[i * 3 + 2] > 20) {
              pos[i * 3 + 2] = -120;
            }
          }
          starGeo.attributes.position.needsUpdate = true;

          if (flameMesh) {
            flameMesh.scale.set(1.4, 2.5 + Math.random() * 0.8, 1.4);
          }

          if (flyProgress > 2.8) {
            cancelAnimationFrame(animId);
            onLaunchComplete();
            return;
          }
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
      starGeo.dispose();
      starMat.dispose();
      planetGeo.dispose();
      planetMat.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [progress.suitColor, onLaunchComplete]);

  // Handle Launch Click
  const handleStartLaunch = () => {
    if (launching) return;
    setLaunching(true);
    stateRef.current.launching = true;
    soundEffects.click();

    // 3, 2, 1, BLASTOFF countdown
    setCountdownText('3');
    soundEffects.countdown(440);

    setTimeout(() => {
      setCountdownText('2');
      soundEffects.countdown(520);
    }, 1000);

    setTimeout(() => {
      setCountdownText('1');
      soundEffects.countdown(660);
    }, 2000);

    setTimeout(() => {
      setCountdownText('🚀 BLAST OFF! 🚀');
      soundEffects.launchWhoosh();
    }, 3000);
  };

  const handleSkip = () => {
    stateRef.current.skip = true;
    onLaunchComplete();
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} style={{ position: 'absolute', inset: 0, zIndex: 1 }} />

      {/* Hero UI Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '32px 24px',
        }}
      >
        {/* Top Header Badge */}
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <span
              style={{
                background: 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.9rem',
                border: '2px solid rgba(255,255,255,0.4)',
              }}
            >
              MISSION CONTROL 🛸
            </span>
          </div>

          {launching && (
            <button
              onClick={handleSkip}
              className="game-btn game-btn-secondary game-btn-sm"
              style={{ pointerEvents: 'auto' }}
            >
              <FastForward size={16} /> Skip Launch
            </button>
          )}
        </div>

        {/* Center Title & Subtitle */}
        <div className="text-center" style={{ maxWidth: '820px', margin: '0 auto', pointerEvents: 'auto' }}>
          {!launching ? (
            <>
              <div className="mb-2">
                <span
                  style={{
                    color: '#ffd60a',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    textShadow: '0 0 12px rgba(255, 214, 10, 0.6)',
                  }}
                >
                  ✨ Astronaut Training Adventure for Kids ✨
                </span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                  fontWeight: 900,
                  margin: '0 0 12px 0',
                  background: 'linear-gradient(180deg, #ffffff 0%, #38bdf8 50%, #9333ea 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 6px 16px rgba(147, 51, 234, 0.6))',
                  lineHeight: 1.05,
                }}
              >
                ASTRO QUEST
              </h1>

              <p
                style={{
                  fontSize: 'clamp(1.15rem, 2.4vw, 1.6rem)',
                  color: '#e2e8f0',
                  fontWeight: 600,
                  textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                  marginBottom: '28px',
                }}
              >
                “Your universe. Your adventure. Your mission!”
              </p>

              {/* Two Large Chunky Buttons */}
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <button
                  onClick={handleStartLaunch}
                  className="game-btn game-btn-primary game-btn-lg"
                  aria-label="Start Rocket Launch Countdown"
                >
                  <Rocket size={28} /> LET'S LAUNCH!
                </button>

                <button
                  onClick={onExploreSpace}
                  className="game-btn game-btn-secondary game-btn-lg"
                  aria-label="Explore Solar System"
                >
                  <Compass size={28} /> EXPLORE SPACE
                </button>
              </div>

              <div className="mt-4">
                <span
                  style={{
                    background: 'rgba(24, 13, 56, 0.75)',
                    padding: '8px 18px',
                    borderRadius: '16px',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    color: '#c4b5fd',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Sparkles size={16} color="#ffd60a" /> Ages 8–14 • 3D Solar System • Real Physics & Rover Missions
                </span>
              </div>
            </>
          ) : (
            /* Animated Launch Countdown Banner */
            <div
              style={{
                background: 'rgba(26, 15, 60, 0.88)',
                border: '3px solid #ff2a85',
                borderRadius: '24px',
                padding: '30px 40px',
                boxShadow: '0 0 40px rgba(255, 42, 133, 0.4)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div
                style={{
                  color: '#00f0ff',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  marginBottom: '10px',
                }}
              >
                THRUSTERS IGNITING...
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3.5rem, 9vw, 6rem)',
                  fontWeight: 900,
                  color: '#ffd60a',
                  textShadow: '0 0 30px rgba(255, 214, 10, 0.8)',
                  animation: 'pulseGlow 1s infinite alternate',
                }}
              >
                {countdownText}
              </div>

              <div style={{ color: '#f8fafc', fontSize: '1.1rem', marginTop: '8px' }}>
                Wave to Cadet Alex! Next stop: Space Adventure Hub!
              </div>
            </div>
          )}
        </div>

        {/* Bottom subtle credit */}
        <div className="text-center" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
          Interactive 3D WebGL • Real Planetary Science
        </div>
      </div>
    </div>
  );
};
