import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createRover, createScienceCrystal } from '../three/proceduralModels';
import { soundEffects } from '../../utils/audio';
import { useGame } from '../../context/GameContext';
import { Trophy, ArrowLeft, CheckCircle2, Sparkles, HelpCircle, ArrowUp, ArrowDown, ArrowLeft as LeftIcon, ArrowRight as RightIcon } from 'lucide-react';

interface MoonDashMissionProps {
  onBackToHub: () => void;
}

export const MoonDashMission: React.FC<MoonDashMissionProps> = ({ onBackToHub }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { addXP, completeMission, recordCrystalCollected } = useGame();

  const [crystalsCollected, setCrystalsCollected] = useState(0);
  const [totalCrystals] = useState(5);
  const [showQuestion, setShowQuestion] = useState(false);
  const [answeredQuestion, setAnsweredQuestion] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [missionComplete, setMissionComplete] = useState(false);

  // Mutable rover physics & input state
  const inputRef = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  const roverState = useRef({
    x: 0,
    z: 0,
    speed: 0,
    heading: 0,
    maxSpeed: 6.5,
    acceleration: 10,
    friction: 4,
    turnSpeed: 2.8,
  });

  const crystalsRef = useRef<{ id: number; mesh: THREE.Group; collected: boolean; x: number; z: number }[]>([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05030f, 0.02);

    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Deep Dark Moon Sky Lighting
    const ambientLight = new THREE.AmbientLight(0x38bdf8, 0.4);
    scene.add(ambientLight);

    // Harsh crisp sunlight (no atmosphere on the Moon!)
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
    sunLight.position.set(20, 30, 20);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // Moon Crater Terrain
    const terrainGeo = new THREE.PlaneGeometry(60, 60, 40, 40);
    terrainGeo.rotateX(-Math.PI / 2);

    // Procedural lunar bumpy surface
    const pos = terrainGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < pos.length; i += 3) {
      const x = pos[i];
      const z = pos[i + 2];
      pos[i + 1] = Math.sin(x * 0.25) * Math.cos(z * 0.25) * 0.4 - Math.sin((x + z) * 0.1) * 0.3;
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.9,
      metalness: 0.1,
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.receiveShadow = true;
    scene.add(terrain);

    // Lunar Rocks & Boulders scattered around
    const rockGeo = new THREE.DodecahedronGeometry(0.8, 1);
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.95 });
    for (let i = 0; i < 18; i++) {
      const rock = new THREE.Mesh(rockGeo, rockMat);
      const angle = Math.random() * Math.PI * 2;
      const dist = 6 + Math.random() * 18;
      rock.position.set(Math.cos(angle) * dist, 0.4, Math.sin(angle) * dist);
      const s = 0.5 + Math.random() * 1.0;
      rock.scale.set(s, s * 0.7, s);
      rock.rotation.set(Math.random(), Math.random(), Math.random());
      rock.castShadow = true;
      scene.add(rock);
    }

    // Distant Earth hanging beautifully in the lunar black sky
    const earthGeo = new THREE.SphereGeometry(3.5, 32, 32);
    const earthMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.4 });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    earth.position.set(25, 22, -35);
    scene.add(earth);

    // Glowing Science Crystals to collect
    const crystalPositions = [
      { id: 1, x: 0, z: -6 },
      { id: 2, x: 6, z: -10 },
      { id: 3, x: -7, z: -12 },
      { id: 4, x: 8, z: -4 },
      { id: 5, x: -6, z: -3 },
    ];

    const crystalItems: { id: number; mesh: THREE.Group; collected: boolean; x: number; z: number }[] = [];
    crystalPositions.forEach((cp) => {
      const crystalMesh = createScienceCrystal(0x00f0ff);
      crystalMesh.position.set(cp.x, 0, cp.z);
      scene.add(crystalMesh);
      crystalItems.push({ id: cp.id, mesh: crystalMesh, collected: false, x: cp.x, z: cp.z });
    });
    crystalsRef.current = crystalItems;

    // 3D Rover
    const rover = createRover(0xffffff, 0x1e293b);
    scene.add(rover);

    // Keyboard event listeners
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') inputRef.current.forward = true;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') inputRef.current.backward = true;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') inputRef.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') inputRef.current.right = true;
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') inputRef.current.forward = false;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') inputRef.current.backward = false;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') inputRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') inputRef.current.right = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      // Earth gentle spin
      earth.rotation.y += 0.002;

      // Crystals hover & spin
      crystalItems.forEach((c) => {
        if (!c.collected) {
          c.mesh.rotation.y += delta * 2;
          c.mesh.position.y = 0.2 + Math.sin(time * 3 + c.id) * 0.15;
        }
      });

      // Rover Physics update
      const st = roverState.current;
      const inp = inputRef.current;

      // Steering
      if (inp.left) st.heading += st.turnSpeed * delta;
      if (inp.right) st.heading -= st.turnSpeed * delta;

      // Acceleration / Braking
      if (inp.forward) {
        st.speed = Math.min(st.maxSpeed, st.speed + st.acceleration * delta);
        if (Math.random() < 0.2) soundEffects.roverMove();
      } else if (inp.backward) {
        st.speed = Math.max(-st.maxSpeed * 0.5, st.speed - st.acceleration * delta);
      } else {
        // Friction dampening
        if (st.speed > 0) st.speed = Math.max(0, st.speed - st.friction * delta);
        else if (st.speed < 0) st.speed = Math.min(0, st.speed + st.friction * delta);
      }

      // Position update
      st.x -= Math.sin(st.heading) * st.speed * delta;
      st.z -= Math.cos(st.heading) * st.speed * delta;

      // Clamp to area
      st.x = Math.max(-25, Math.min(25, st.x));
      st.z = Math.max(-25, Math.min(25, st.z));

      rover.position.set(st.x, 0, st.z);
      rover.rotation.y = st.heading;

      // Bouncy lunar 1/6th gravity suspension bob
      if (Math.abs(st.speed) > 0.1) {
        rover.position.y = Math.sin(time * 10) * 0.04;
      }

      // Check collision with crystals
      crystalItems.forEach((c) => {
        if (!c.collected) {
          const dist = Math.hypot(st.x - c.x, st.z - c.z);
          if (dist < 1.6) {
            c.collected = true;
            c.mesh.visible = false;
            soundEffects.starCollect();
            recordCrystalCollected();
            setCrystalsCollected((prev) => {
              const next = prev + 1;
              if (next === 3) {
                setShowQuestion(true); // Mid-mission science checkpoint
              } else if (next >= totalCrystals) {
                setMissionComplete(true);
                completeMission('moon-dash', 'moon-walker', 150);
              }
              return next;
            });
          }
        }
      });

      // Third-person chase camera
      const camOffset = new THREE.Vector3(
        Math.sin(st.heading) * 6,
        3.2,
        Math.cos(st.heading) * 6
      );
      camera.position.lerp(rover.position.clone().add(camOffset), delta * 5);
      camera.lookAt(rover.position.x, rover.position.y + 0.8, rover.position.z);

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
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      cancelAnimationFrame(animId);
      renderer.dispose();
      terrainGeo.dispose();
      terrainMat.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [completeMission, recordCrystalCollected, totalCrystals]);

  // Touch control helper
  const handleTouchControl = (dir: 'forward' | 'backward' | 'left' | 'right', active: boolean) => {
    inputRef.current[dir] = active;
  };

  const handleAnswerQuestion = (idx: number) => {
    if (answeredQuestion) return;
    setSelectedOption(idx);
    setAnsweredQuestion(true);
    if (idx === 1) {
      soundEffects.starCollect();
      addXP(50, 'Correct Lunar Science answer!');
    } else {
      soundEffects.gentleError();
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '88vh', overflow: 'hidden' }}>
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />

      {/* Top HUD Bar */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <button
          onClick={() => {
            soundEffects.click();
            onBackToHub();
          }}
          className="game-btn game-btn-secondary game-btn-sm"
          style={{ pointerEvents: 'auto' }}
        >
          <ArrowLeft size={16} /> Exit to Hub
        </button>

        {/* Mission Objectives HUD */}
        <div
          style={{
            background: 'rgba(22, 13, 50, 0.92)',
            border: '2px solid #00f0ff',
            borderRadius: '16px',
            padding: '8px 20px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            pointerEvents: 'auto',
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <span style={{ fontSize: '1.2rem' }}>💎</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', fontSize: '1.1rem' }}>
              Crystals: {crystalsCollected} / {totalCrystals}
            </span>
          </div>

          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '12px' }}>
            <span style={{ color: '#ffd60a', fontSize: '0.85rem', fontWeight: 600 }}>
              Gravity: 1.62 m/s² (1/6 Earth)
            </span>
          </div>
        </div>
      </div>

      {/* Touch Controls (Mobile Friendly D-Pad) */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '24px',
          zIndex: 15,
          userSelect: 'none',
        }}
      >
        <div className="touch-control-pad">
          <div />
          <button
            onPointerDown={() => handleTouchControl('forward', true)}
            onPointerUp={() => handleTouchControl('forward', false)}
            onPointerLeave={() => handleTouchControl('forward', false)}
            onPointerCancel={() => handleTouchControl('forward', false)}
            className="touch-btn"
            aria-label="Drive Forward"
          >
            <ArrowUp size={24} />
          </button>
          <div />

          <button
            onPointerDown={() => handleTouchControl('left', true)}
            onPointerUp={() => handleTouchControl('left', false)}
            onPointerLeave={() => handleTouchControl('left', false)}
            onPointerCancel={() => handleTouchControl('left', false)}
            className="touch-btn"
            aria-label="Steer Left"
          >
            <LeftIcon size={24} />
          </button>
          <button
            onPointerDown={() => handleTouchControl('backward', true)}
            onPointerUp={() => handleTouchControl('backward', false)}
            onPointerLeave={() => handleTouchControl('backward', false)}
            onPointerCancel={() => handleTouchControl('backward', false)}
            className="touch-btn"
            aria-label="Reverse"
          >
            <ArrowDown size={24} />
          </button>
          <button
            onPointerDown={() => handleTouchControl('right', true)}
            onPointerUp={() => handleTouchControl('right', false)}
            onPointerLeave={() => handleTouchControl('right', false)}
            onPointerCancel={() => handleTouchControl('right', false)}
            className="touch-btn"
            aria-label="Steer Right"
          >
            <RightIcon size={24} />
          </button>
        </div>
        <div style={{ color: '#c4b5fd', fontSize: '0.75rem', marginTop: '6px', textAlign: 'center' }}>
          Keys: W A S D / Arrows
        </div>
      </div>

      {/* Mid-Mission Science Question Modal */}
      {showQuestion && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 30,
            background: 'rgba(10, 5, 27, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(180deg, #1e1145 0%, #11092b 100%)',
              border: '3px solid #00f0ff',
              borderRadius: '24px',
              padding: '28px',
              maxWidth: '560px',
              width: '100%',
              boxShadow: '0 20px 50px rgba(0, 240, 255, 0.3)',
            }}
          >
            <div className="d-flex align-items-center gap-2 mb-2">
              <HelpCircle size={22} color="#ffd60a" />
              <span style={{ color: '#ffd60a', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                COSMO’S LUNAR SCIENCE CHECKPOINT!
              </span>
            </div>

            <h4 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '16px' }}>
              Why do astronauts bounce high and feel so light when driving across the Moon?
            </h4>

            <div className="d-flex flex-column gap-2 mb-3">
              {[
                'Because the Moon has huge fans blowing upward from craters',
                'Because the Moon has less mass than Earth, so its gravity is only 1/6th as strong',
                'Because lunar dust is made of magnetized bouncy rubber',
              ].map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerQuestion(idx)}
                  className="game-btn game-btn-secondary"
                  style={{
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    padding: '10px 16px',
                    fontSize: '0.95rem',
                    backgroundColor:
                      selectedOption === idx
                        ? idx === 1
                          ? '#059669'
                          : '#dc2626'
                        : undefined,
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>

            {answeredQuestion && (
              <div>
                <p style={{ color: selectedOption === 1 ? '#34d399' : '#f87171', fontSize: '0.95rem', fontWeight: 600 }}>
                  {selectedOption === 1
                    ? 'Spot on! Mass creates gravity! Less mass = 1/6th gravity, making rovers glide effortlessly!'
                    : 'Good try! Remember, gravity comes from mass. The Moon has less mass than Earth, so gravity is 6x weaker!'}
                </p>

                <button
                  onClick={() => setShowQuestion(false)}
                  className="game-btn game-btn-primary w-100"
                >
                  Continue Rover Mission! 🚀
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mission Complete Overlay */}
      {missionComplete && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 40,
            background: 'rgba(10, 5, 27, 0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(180deg, #2e1065 0%, #150a30 100%)',
              border: '4px solid #ffd60a',
              borderRadius: '28px',
              padding: '36px',
              maxWidth: '540px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 25px 60px rgba(255, 214, 10, 0.4)',
            }}
          >
            <div style={{ fontSize: '3.5rem', marginBottom: '8px' }}>🌕🏆</div>

            <h2 style={{ color: '#fff', fontWeight: 900, marginBottom: '8px' }}>
              MISSION ACCOMPLISHED!
            </h2>

            <p style={{ color: '#c4b5fd', fontSize: '1.1rem', marginBottom: '20px' }}>
              You navigated the South Pole crater, collected all 5 lunar science crystals, and calibrated the sensor beacon!
            </p>

            <div
              style={{
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '18px',
                padding: '16px',
                marginBottom: '24px',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <div className="d-flex justify-content-center align-items-center gap-3">
                <span className="xp-badge" style={{ fontSize: '1.1rem' }}>
                  <Trophy size={18} /> +150 XP
                </span>
                <span
                  style={{
                    background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                    color: '#fff',
                    padding: '6px 14px',
                    borderRadius: '12px',
                    fontWeight: 800,
                  }}
                >
                  BADGE: Moon Walker Champion 🌕
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                soundEffects.click();
                onBackToHub();
              }}
              className="game-btn game-btn-primary game-btn-lg w-100"
            >
              RETURN TO SPACE HUB
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
