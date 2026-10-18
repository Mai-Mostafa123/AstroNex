import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createSpaceStation, createRocket, createRover, createCosmoAlien } from './proceduralModels';
import { soundEffects } from '../../utils/audio';
import { useGame } from '../../context/GameContext';
import { Sparkles, Trophy, ArrowRight, Play, Eye } from 'lucide-react';

interface HubSceneProps {
  onSelectDestination: (destId: string) => void;
}

interface DestinationHotspot {
  id: string;
  name: string;
  category: string;
  color: string;
  position: [number, number, number];
  missionId?: string;
  rewardXP: number;
  description: string;
}

const DESTINATIONS: DestinationHotspot[] = [
  {
    id: 'moon-base',
    name: 'Moon Base Artemis',
    category: 'Mission 1',
    color: '#94a3b8',
    position: [-4.2, 0.4, 2.2],
    missionId: 'moon-dash',
    rewardXP: 150,
    description: 'Drive the Apollo rover, collect glowing ice crystals, and test low lunar gravity!',
  },
  {
    id: 'mars-outpost',
    name: 'Mars Outpost Jezero',
    category: 'Mission 2',
    color: '#f97316',
    position: [4.2, 0.4, 2.0],
    missionId: 'mars-mystery',
    rewardXP: 250,
    description: 'Explore the red terrain, drill mineral samples, and solve ancient water clues!',
  },
  {
    id: 'space-station',
    name: 'Orbital Habitat Alpha',
    category: 'Mission 3',
    color: '#06b6d4',
    position: [0, 3.8, -4.5],
    missionId: 'save-station',
    rewardXP: 350,
    description: 'Fix power relays, reset life support, and coordinate with the station crew bot!',
  },
  {
    id: 'rocket-training',
    name: 'Rocket Training Zone',
    category: 'Mini-Game',
    color: '#ff2a85',
    position: [-2.5, 0.5, -3.2],
    rewardXP: 120,
    description: 'Test Newton’s laws, assemble rocket stages, and launch test boosters!',
  },
  {
    id: 'alien-planet',
    name: 'Exo-Planet Nebula X',
    category: 'Cosmic Lab',
    color: '#a855f7',
    position: [3.2, 0.6, -3.0],
    rewardXP: 180,
    description: 'Meet Cosmo’s friendly alien friends, learn about exoplanets, and solve cosmic puzzles!',
  },
];

export const HubScene: React.FC<HubSceneProps> = ({ onSelectDestination }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { progress } = useGame();
  const [selectedDest, setSelectedDest] = useState<DestinationHotspot | null>(DESTINATIONS[0]);

  // Raycaster state
  const mouseRef = useRef(new THREE.Vector2());
  const clickableObjects = useRef<THREE.Object3D[]>([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0e0724, 0.016);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 7.5, 12);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x6d28d9, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(8, 12, 10);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const cyanRim = new THREE.DirectionalLight(0x00f0ff, 1.5);
    cyanRim.position.set(-8, 6, -8);
    scene.add(cyanRim);

    // Floating Space Island Base
    const islandGroup = new THREE.Group();
    scene.add(islandGroup);

    // Central Floating Asteroid Citadel / Hub Platform
    const islandGeo = new THREE.CylinderGeometry(6.2, 4.0, 1.8, 32);
    const islandMat = new THREE.MeshStandardMaterial({
      color: 0x2e1065,
      roughness: 0.6,
      metalness: 0.2,
    });
    const islandBase = new THREE.Mesh(islandGeo, islandMat);
    islandBase.position.y = -0.9;
    islandBase.receiveShadow = true;
    islandGroup.add(islandBase);

    // Glowing Neon Hex Grid Floor on island
    const floorGeo = new THREE.CylinderGeometry(6.0, 6.0, 0.08, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      roughness: 0.3,
      metalness: 0.5,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = 0.04;
    islandGroup.add(floorMesh);

    // Island Energy Ring
    const ringGeo = new THREE.TorusGeometry(6.4, 0.08, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.8 });
    const energyRing = new THREE.Mesh(ringGeo, ringMat);
    energyRing.rotation.x = Math.PI / 2;
    energyRing.position.y = 0.1;
    islandGroup.add(energyRing);

    // 1. Destination: Moon Base (Left front)
    const moonBaseGroup = new THREE.Group();
    moonBaseGroup.position.set(-4.2, 0.05, 2.2);
    moonBaseGroup.userData = { destId: 'moon-base' };

    // Lunar dome
    const domeGeo = new THREE.SphereGeometry(1.0, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshPhysicalMaterial({
      color: 0xe2e8f0,
      roughness: 0.2,
      metalness: 0.4,
      clearcoat: 0.8,
    });
    const dome = new THREE.Mesh(domeGeo, domeMat);
    moonBaseGroup.add(dome);

    // Mini cute rover parked outside
    const miniRover = createRover(0xffffff, 0x1e293b);
    miniRover.scale.set(0.4, 0.4, 0.4);
    miniRover.position.set(1.1, 0, 0.5);
    miniRover.rotation.y = -Math.PI / 4;
    moonBaseGroup.add(miniRover);

    // Solar panels for moon base
    const moonSolar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.04, 0.4), new THREE.MeshStandardMaterial({ color: 0x1d4ed8, metalness: 0.8 }));
    moonSolar.position.set(-0.8, 0.4, 0.8);
    moonSolar.rotation.x = 0.3;
    moonBaseGroup.add(moonSolar);

    islandGroup.add(moonBaseGroup);

    // 2. Destination: Mars Outpost (Right front)
    const marsGroup = new THREE.Group();
    marsGroup.position.set(4.2, 0.05, 2.0);
    marsGroup.userData = { destId: 'mars-outpost' };

    // Red soil mound
    const marsMound = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.6, 0.3, 16),
      new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.9 })
    );
    marsMound.position.y = 0.15;
    marsGroup.add(marsMound);

    // Mars Habitat Module (inflatable sphere)
    const habGeo = new THREE.SphereGeometry(0.85, 20, 20);
    habGeo.scale(1.2, 0.8, 1.0);
    const habMat = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.4 });
    const hab = new THREE.Mesh(habGeo, habMat);
    hab.position.y = 0.65;
    marsGroup.add(hab);

    // Communications dish
    const commDish = new THREE.Mesh(
      new THREE.ConeGeometry(0.35, 0.12, 16, 1, true),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    commDish.position.set(0, 1.4, 0);
    commDish.rotation.x = -0.4;
    marsGroup.add(commDish);

    islandGroup.add(marsGroup);

    // 3. Destination: Space Station Alpha (High in orbit above back)
    const stationGroup = new THREE.Group();
    stationGroup.position.set(0, 3.8, -4.5);
    stationGroup.scale.set(0.85, 0.85, 0.85);
    stationGroup.userData = { destId: 'space-station' };

    const spaceStationMesh = createSpaceStation();
    stationGroup.add(spaceStationMesh);
    scene.add(stationGroup);

    // 4. Destination: Rocket Training Zone (Left back)
    const rocketZoneGroup = new THREE.Group();
    rocketZoneGroup.position.set(-2.5, 0.05, -3.2);
    rocketZoneGroup.userData = { destId: 'rocket-training' };

    // Launchpad Gantry tower
    const towerGeo = new THREE.BoxGeometry(0.4, 2.2, 0.4);
    const towerMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.6 });
    const gantry = new THREE.Mesh(towerGeo, towerMat);
    gantry.position.set(0.7, 1.1, 0);
    rocketZoneGroup.add(gantry);

    const testRocket = createRocket(0xff2a85, 0xffffff);
    testRocket.scale.set(0.45, 0.45, 0.45);
    testRocket.position.set(0, 0, 0);
    rocketZoneGroup.add(testRocket);

    islandGroup.add(rocketZoneGroup);

    // 5. Destination: Alien Planet Nebula X (Right back)
    const alienZoneGroup = new THREE.Group();
    alienZoneGroup.position.set(3.2, 0.05, -3.0);
    alienZoneGroup.userData = { destId: 'alien-planet' };

    // Bioluminescent crystal clusters
    const alienFlora = new THREE.Group();
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const crystalGeo = new THREE.ConeGeometry(0.18, 0.7, 5);
      const crystalMat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0xa855f7 : 0x00f0ff });
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      crystal.position.set(Math.cos(angle) * 0.6, 0.35, Math.sin(angle) * 0.6);
      crystal.rotation.z = (Math.random() - 0.5) * 0.3;
      alienFlora.add(crystal);
    }
    alienZoneGroup.add(alienFlora);

    const cosmoMini = createCosmoAlien(0x9333ea, 0x06b6d4);
    cosmoMini.scale.set(0.45, 0.45, 0.45);
    cosmoMini.position.set(0, 0.4, 0);
    alienZoneGroup.add(cosmoMini);

    islandGroup.add(alienZoneGroup);

    // Collect clickable objects for raycasting
    clickableObjects.current = [
      moonBaseGroup,
      marsGroup,
      stationGroup,
      rocketZoneGroup,
      alienZoneGroup,
    ];

    // Starfield Background
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 900;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 140;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const stars = new THREE.Points(starsGeo, new THREE.PointsMaterial({ color: 0x93c5fd, size: 0.25 }));
    scene.add(stars);

    // Mouse / Touch Interaction for Orbiting Hub
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        targetRotationY += deltaX * 0.005;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const raycaster = new THREE.Raycaster();

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

      const intersects = raycaster.intersectObjects(clickableObjects.current, true);
      if (intersects.length > 0) {
        // Find top group with userData.destId
        let cur: THREE.Object3D | null = intersects[0].object;
        while (cur && !cur.userData?.destId && cur.parent) {
          cur = cur.parent;
        }
        if (cur && cur.userData?.destId) {
          const dest = DESTINATIONS.find((d) => d.id === cur?.userData?.destId);
          if (dest) {
            soundEffects.click();
            setSelectedDest(dest);
          }
        }
      }
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('click', onClick);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth damped island rotation
      islandGroup.rotation.y = THREE.MathUtils.damp(islandGroup.rotation.y, targetRotationY, 4, delta);

      // Station slowly orbiting
      stationGroup.rotation.y += delta * 0.3;
      stationGroup.position.y = 3.8 + Math.sin(time * 0.8) * 0.15;

      // Cosmo mini bobbing
      cosmoMini.position.y = 0.4 + Math.sin(time * 2.5) * 0.08;

      // Stars slow rotation
      stars.rotation.y += 0.0002;

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
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('click', onClick);
      cancelAnimationFrame(animId);
      renderer.dispose();
      starsGeo.dispose();
      islandGeo.dispose();
      islandMat.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '85vh', overflow: 'hidden' }}>
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, cursor: 'grab' }} />

      {/* Top Floating Badge Bar */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          pointerEvents: 'none',
          textAlign: 'center',
          maxWidth: '90vw',
        }}
      >
        <span
          style={{
            background: 'rgba(26, 15, 60, 0.9)',
            border: '2px solid rgba(168, 85, 247, 0.5)',
            borderRadius: '16px',
            padding: '8px 22px',
            color: '#fff',
            fontFamily: 'var(--font-display)',
            fontSize: '1.15rem',
            fontWeight: 700,
            boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Sparkles size={20} color="#ffd60a" />
          SPACE ADVENTURE HUB • CHOOSE YOUR EXPEDITION
        </span>
        <div style={{ color: '#c4b5fd', fontSize: '0.85rem', marginTop: '6px' }}>
          💡 Drag to rotate the 3D Island • Click any outpost to view mission briefing
        </div>
      </div>

      {/* Quick Destination Selectors (Buttons) */}
      <div
        style={{
          position: 'absolute',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '8px',
          maxWidth: '95vw',
        }}
      >
        {DESTINATIONS.map((dest) => {
          const isSelected = selectedDest?.id === dest.id;
          const isDone = dest.missionId && progress.completedMissions.includes(dest.missionId);

          return (
            <button
              key={dest.id}
              onClick={() => {
                soundEffects.click();
                setSelectedDest(dest);
              }}
              className="game-btn game-btn-sm"
              style={{
                background: isSelected
                  ? 'linear-gradient(135deg, #a855f7 0%, #06b6d4 100%)'
                  : 'rgba(30, 18, 64, 0.85)',
                borderColor: isSelected ? '#ffd60a' : 'rgba(168, 85, 247, 0.4)',
                color: '#fff',
                boxShadow: isSelected ? '0 0 16px rgba(6, 182, 212, 0.5)' : undefined,
              }}
            >
              {isDone ? '✅ ' : ''}
              {dest.name}
            </button>
          );
        })}
      </div>

      {/* Selected Destination Mission Card (Collapsible bottom dock) */}
      {selectedDest && (
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            width: 'min(780px, 92vw)',
            background: 'rgba(22, 13, 50, 0.94)',
            border: `3px solid ${selectedDest.color}`,
            borderRadius: '24px',
            padding: '20px 24px',
            boxShadow: `0 15px 40px rgba(0,0,0,0.7), 0 0 25px ${selectedDest.color}40`,
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span
                  style={{
                    backgroundColor: selectedDest.color,
                    color: '#fff',
                    padding: '3px 10px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                  }}
                >
                  {selectedDest.category}
                </span>

                <span className="xp-badge" style={{ padding: '2px 8px', fontSize: '0.8rem' }}>
                  <Trophy size={14} /> +{selectedDest.rewardXP} XP
                </span>

                {selectedDest.missionId && progress.completedMissions.includes(selectedDest.missionId) && (
                  <span style={{ color: '#34d399', fontSize: '0.85rem', fontWeight: 700 }}>
                    ⭐ MISSION COMPLETED
                  </span>
                )}
              </div>

              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.4rem', color: '#fff' }}>
                {selectedDest.name}
              </h3>

              <p style={{ margin: 0, color: '#e2e8f0', fontSize: '0.95rem', lineHeight: 1.4 }}>
                {selectedDest.description}
              </p>
            </div>

            <div className="d-flex gap-2 align-self-end align-self-md-center">
              <button
                onClick={() => {
                  soundEffects.click();
                  onSelectDestination(selectedDest.id);
                }}
                className="game-btn game-btn-primary"
                style={{ padding: '12px 24px', whiteSpace: 'nowrap' }}
              >
                <Play size={20} /> ENTER OUTPOST
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
