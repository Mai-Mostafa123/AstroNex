import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PLANETS_DATA, PlanetInfo } from '../../data/gameData';
import { soundEffects } from '../../utils/audio';
import { useGame } from '../../context/GameContext';
import { Compass, Sparkles, Orbit, Info, CheckCircle2, RotateCcw } from 'lucide-react';

export const SolarSystemScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { progress, recordPlanetExplored } = useGame();

  const [selectedPlanet, setSelectedPlanet] = useState<PlanetInfo | null>(PLANETS_DATA[2]); // Start with Earth!
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  const sceneState = useRef({
    targetCamPos: new THREE.Vector3(0, 18, 28),
    targetLookAt: new THREE.Vector3(0, 0, 0),
    isFocusingPlanet: false,
    focusedMesh: null as THREE.Object3D | null,
    dragStart: { x: 0, y: 0 },
    isDragging: false,
    orbitAngle: 0,
    orbitDistance: 32,
    orbitHeight: 18,
  });

  const planetMeshesRef = useRef<{ mesh: THREE.Mesh; data: PlanetInfo; currentAngle: number }[]>([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0518, 0.008);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 20, 32);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // Deep Space Starfield
    const starCount = 2000;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const palette = [0xffffff, 0x00f0ff, 0xffd60a, 0xf43f5e, 0xa855f7];

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 260;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 160;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 260;

      const c = new THREE.Color(palette[Math.floor(Math.random() * palette.length)]);
      starColors[i * 3] = c.r;
      starColors[i * 3 + 1] = c.g;
      starColors[i * 3 + 2] = c.b;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starField = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ size: 0.35, vertexColors: true, transparent: true, opacity: 0.85 })
    );
    scene.add(starField);

    // Central Sun
    const sunGeo = new THREE.SphereGeometry(2.6, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({
      color: 0xffdd00,
    });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sun);

    // Sun Corona Glow
    const coronaGeo = new THREE.SphereGeometry(3.1, 24, 24);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xff9900,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const corona = new THREE.Mesh(coronaGeo, coronaMat);
    sun.add(corona);

    // Sun Point Light
    const sunLight = new THREE.PointLight(0xfffbeb, 3.5, 120);
    scene.add(sunLight);

    const ambient = new THREE.AmbientLight(0x38185c, 1.2);
    scene.add(ambient);

    // Create planets & orbits
    const planetList: { mesh: THREE.Mesh; data: PlanetInfo; currentAngle: number }[] = [];

    PLANETS_DATA.forEach((p, idx) => {
      // Orbital Guide Line
      const orbitGeo = new THREE.BufferGeometry();
      const segments = 96;
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * p.distance, 0, Math.sin(theta) * p.distance));
      }
      orbitGeo.setFromPoints(points);
      const orbitLine = new THREE.Line(
        orbitGeo,
        new THREE.LineBasicMaterial({ color: 0x6d28d9, transparent: true, opacity: 0.35 })
      );
      scene.add(orbitLine);

      // Planet Mesh
      const pGeo = new THREE.SphereGeometry(p.size, 32, 32);
      const pMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(p.color),
        roughness: 0.5,
        metalness: 0.1,
      });
      const planetMesh = new THREE.Mesh(pGeo, pMat);
      planetMesh.userData = { planetData: p };

      // Extra details for specific planets
      if (p.hasRings) {
        // Saturn Rings
        const ringGeo = new THREE.RingGeometry(p.size * 1.4, p.size * 2.3, 32);
        const ringMat = new THREE.MeshStandardMaterial({
          color: 0xfef08a,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8,
        });
        const rings = new THREE.Mesh(ringGeo, ringMat);
        rings.rotation.x = Math.PI / 2.3;
        planetMesh.add(rings);
      }

      if (p.id === 'earth') {
        // Earth Atmosphere Cloud Layer
        const cloudGeo = new THREE.SphereGeometry(p.size * 1.025, 24, 24);
        const cloudMat = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.4,
          roughness: 0.9,
        });
        const clouds = new THREE.Mesh(cloudGeo, cloudMat);
        clouds.name = 'clouds';
        planetMesh.add(clouds);

        // Orbiting Moon
        const moonGeo = new THREE.SphereGeometry(0.25, 16, 16);
        const moonMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.8 });
        const moon = new THREE.Mesh(moonGeo, moonMat);
        moon.position.set(1.6, 0.2, 0);
        moon.name = 'earthMoon';
        planetMesh.add(moon);
      }

      const initialAngle = (idx * Math.PI) / 4;
      planetMesh.position.set(Math.cos(initialAngle) * p.distance, 0, Math.sin(initialAngle) * p.distance);

      scene.add(planetMesh);
      planetList.push({ mesh: planetMesh, data: p, currentAngle: initialAngle });
    });

    planetMeshesRef.current = planetList;

    // Raycasting for planet clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (e: PointerEvent) => {
      sceneState.current.isDragging = true;
      sceneState.current.dragStart = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (sceneState.current.isDragging) {
        const deltaX = e.clientX - sceneState.current.dragStart.x;
        const deltaY = e.clientY - sceneState.current.dragStart.y;
        sceneState.current.dragStart = { x: e.clientX, y: e.clientY };

        sceneState.current.orbitAngle += deltaX * 0.005;
        sceneState.current.orbitHeight = Math.max(
          5,
          Math.min(35, sceneState.current.orbitHeight - deltaY * 0.05)
        );

        if (!sceneState.current.isFocusingPlanet) {
          sceneState.current.targetCamPos.x = Math.sin(sceneState.current.orbitAngle) * sceneState.current.orbitDistance;
          sceneState.current.targetCamPos.z = Math.cos(sceneState.current.orbitAngle) * sceneState.current.orbitDistance;
          sceneState.current.targetCamPos.y = sceneState.current.orbitHeight;
        }
      }
    };

    const onPointerUp = () => {
      sceneState.current.isDragging = false;
    };

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = planetList.map((p) => p.mesh);
      const intersects = raycaster.intersectObjects(meshes, true);

      if (intersects.length > 0) {
        let cur: THREE.Object3D | null = intersects[0].object;
        while (cur && !cur.userData?.planetData && cur.parent) {
          cur = cur.parent;
        }
        if (cur && cur.userData?.planetData) {
          const data: PlanetInfo = cur.userData.planetData;
          soundEffects.click();
          selectPlanet(data, cur);
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

      // Sun pulsing glow
      corona.scale.setScalar(1 + Math.sin(time * 2) * 0.04);
      sun.rotation.y += delta * 0.2;

      // Orbit planets
      planetList.forEach((item) => {
        item.currentAngle += item.data.speed * delta * 2 * speedMultiplier;
        item.mesh.position.x = Math.cos(item.currentAngle) * item.data.distance;
        item.mesh.position.z = Math.sin(item.currentAngle) * item.data.distance;
        item.mesh.rotation.y += delta * 1.5;

        // Clouds rotation on Earth
        const clouds = item.mesh.getObjectByName('clouds');
        if (clouds) clouds.rotation.y += delta * 0.4;

        // Moon orbit on Earth
        const moon = item.mesh.getObjectByName('earthMoon');
        if (moon) {
          const mAngle = time * 2.5;
          moon.position.set(Math.cos(mAngle) * 1.6, 0.2, Math.sin(mAngle) * 1.6);
        }
      });

      // Smooth camera interpolation
      if (sceneState.current.isFocusingPlanet && sceneState.current.focusedMesh) {
        const targetMesh = sceneState.current.focusedMesh;
        const camOffset = new THREE.Vector3(0, targetMesh.scale.x * 2 + 2, targetMesh.scale.x * 3 + 3.5);
        const desiredPos = targetMesh.position.clone().add(camOffset);

        camera.position.lerp(desiredPos, delta * 3.5);
        sceneState.current.targetLookAt.lerp(targetMesh.position, delta * 5);
        camera.lookAt(sceneState.current.targetLookAt);
      } else {
        camera.position.lerp(sceneState.current.targetCamPos, delta * 3);
        sceneState.current.targetLookAt.lerp(new THREE.Vector3(0, 0, 0), delta * 4);
        camera.lookAt(sceneState.current.targetLookAt);
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
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('click', onClick);
      cancelAnimationFrame(animId);
      renderer.dispose();
      sunGeo.dispose();
      sunMat.dispose();
      starGeo.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [speedMultiplier]);

  const selectPlanet = (planet: PlanetInfo, meshObj?: THREE.Object3D) => {
    setSelectedPlanet(planet);

    // Track exploration & grant XP once per planet (persisted globally)
    recordPlanetExplored(planet.id);

    const foundItem = planetMeshesRef.current.find((p) => p.data.id === planet.id);
    if (foundItem) {
      sceneState.current.isFocusingPlanet = true;
      sceneState.current.focusedMesh = foundItem.mesh;
    }
  };

  const handleResetCamera = () => {
    soundEffects.click();
    sceneState.current.isFocusingPlanet = false;
    sceneState.current.focusedMesh = null;
    sceneState.current.targetCamPos.set(0, 20, 32);
    sceneState.current.targetLookAt.set(0, 0, 0);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '88vh', overflow: 'hidden' }}>
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, cursor: 'grab' }} />

      {/* Top Floating Header & Planet Switcher */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          textAlign: 'center',
          maxWidth: '96vw',
          pointerEvents: 'none',
        }}
      >
        <div className="d-inline-flex align-items-center gap-2 mb-2" style={{ pointerEvents: 'auto' }}>
          <span
            style={{
              background: 'rgba(26, 15, 60, 0.92)',
              border: '2px solid rgba(0, 240, 255, 0.5)',
              borderRadius: '16px',
              padding: '6px 20px',
              color: '#00f0ff',
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              fontWeight: 800,
              boxShadow: '0 6px 20px rgba(0,0,0,0.6)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Orbit size={18} /> 3D SOLAR SYSTEM EXPLORER
          </span>

          <button
            onClick={handleResetCamera}
            className="game-btn game-btn-secondary game-btn-sm"
            style={{ pointerEvents: 'auto' }}
            title="Overview of all planets"
          >
            <RotateCcw size={16} /> Overview
          </button>
        </div>

        {/* Planet Quick Select Chips */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '6px',
            pointerEvents: 'auto',
          }}
        >
          {PLANETS_DATA.map((planet) => {
            const isSelected = selectedPlanet?.id === planet.id;
            const isExplored = (progress.exploredPlanets || ['earth']).includes(planet.id);

            return (
              <button
                key={planet.id}
                onClick={() => selectPlanet(planet)}
                className="game-btn game-btn-sm"
                style={{
                  background: isSelected
                    ? `linear-gradient(135deg, ${planet.color} 0%, #3b82f6 100%)`
                    : 'rgba(24, 13, 56, 0.85)',
                  borderColor: isSelected ? '#ffd60a' : 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontSize: '0.85rem',
                  padding: '5px 12px',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: planet.color,
                    marginRight: '4px',
                  }}
                />
                {planet.name} {isExplored && '✓'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Planet Scientific Inspector Card (Bottom Dock) */}
      {selectedPlanet && (
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            width: 'min(860px, 94vw)',
            background: 'rgba(18, 10, 42, 0.94)',
            border: `3px solid ${selectedPlanet.color}`,
            borderRadius: '24px',
            padding: '20px 26px',
            boxShadow: `0 15px 40px rgba(0,0,0,0.7), 0 0 30px ${selectedPlanet.color}40`,
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div style={{ flex: 1 }}>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span
                  style={{
                    backgroundColor: selectedPlanet.color,
                    color: '#fff',
                    padding: '3px 12px',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                  }}
                >
                  {selectedPlanet.name.toUpperCase()}
                </span>
                <span style={{ color: '#ffd60a', fontWeight: 600, fontSize: '0.9rem' }}>
                  {selectedPlanet.tagline}
                </span>
              </div>

              {/* Astronomy Quick Stats Pill Grid */}
              <div className="d-flex flex-wrap gap-2 my-2">
                <div
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    color: '#e2e8f0',
                  }}
                >
                  <strong>Day:</strong> {selectedPlanet.dayLength}
                </div>
                <div
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    color: '#e2e8f0',
                  }}
                >
                  <strong>Year:</strong> {selectedPlanet.yearLength}
                </div>
                <div
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    color: '#e2e8f0',
                  }}
                >
                  <strong>Gravity:</strong> {selectedPlanet.gravityComparison}
                </div>
                <div
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    color: '#e2e8f0',
                  }}
                >
                  <strong>Moons:</strong> {selectedPlanet.moonsCount}
                </div>
              </div>

              {/* Real Educational Space Facts */}
              <ul style={{ margin: 0, paddingLeft: '18px', color: '#c4b5fd', fontSize: '0.9rem', lineHeight: 1.45 }}>
                {selectedPlanet.facts.map((fact, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>
                    {fact}
                  </li>
                ))}
              </ul>
            </div>

            {/* Orbit Speed Multiplier & Action */}
            <div className="d-flex flex-column gap-2 align-items-center">
              <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>ORBIT SPEED</div>
              <div className="d-flex gap-1">
                {[0.5, 1, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      soundEffects.click();
                      setSpeedMultiplier(s);
                    }}
                    className={`game-btn game-btn-sm ${speedMultiplier === s ? 'game-btn-accent' : 'game-btn-secondary'}`}
                    style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              <div
                style={{
                  color: '#34d399',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '4px',
                }}
              >
                <CheckCircle2 size={14} /> {(progress.exploredPlanets || ['earth']).length}/8 Explored (+50 XP)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
