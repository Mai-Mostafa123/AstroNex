import * as THREE from 'three';

/**
 * Procedural 3D Model Factory for Astro Quest
 * Built with composite 3-12 part THREE.Group geometries and rich PBR materials.
 * Zero external 3D file dependencies, zero 404 risk!
 */

// Palette helper
export const SUIT_COLORS: Record<string, number> = {
  white: 0xf8fafc,
  orange: 0xf97316,
  cyan: 0x06b6d4,
  purple: 0x9333ea,
  gold: 0xfbbf24,
  'neon-pink': 0xf43f5e,
};

/**
 * Creates a cute stylized Astronaut with helmet, reflective visor, life-support pack, and limbs.
 */
export function createAstronaut(suitColorHex = 0x06b6d4): THREE.Group {
  const group = new THREE.Group();

  const suitMaterial = new THREE.MeshStandardMaterial({
    color: suitColorHex,
    roughness: 0.35,
    metalness: 0.15,
  });

  const whiteSuitMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.4,
    metalness: 0.1,
  });

  const visorMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x00f0ff,
    roughness: 0.05,
    metalness: 0.9,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    reflectivity: 0.9,
  });

  const darkTrimMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e1b4b,
    roughness: 0.5,
  });

  // 1. Torso
  const torsoGeo = new THREE.CylinderGeometry(0.5, 0.45, 0.9, 16);
  const torso = new THREE.Mesh(torsoGeo, suitMaterial);
  torso.position.y = 1.1;
  torso.castShadow = true;
  group.add(torso);

  // Chest control console
  const consoleGeo = new THREE.BoxGeometry(0.35, 0.25, 0.1);
  const consoleMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3 });
  const chestConsole = new THREE.Mesh(consoleGeo, consoleMat);
  chestConsole.position.set(0, 1.2, 0.46);
  group.add(chestConsole);

  // Little button indicators on chest
  const btn1 = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
  btn1.position.set(-0.08, 1.2, 0.52);
  const btn2 = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
  btn2.position.set(0.08, 1.2, 0.52);
  group.add(btn1, btn2);

  // 2. Helmet (Cute large bubble helmet)
  const helmetGeo = new THREE.SphereGeometry(0.6, 24, 24);
  const helmet = new THREE.Mesh(helmetGeo, whiteSuitMaterial);
  helmet.position.y = 1.95;
  helmet.castShadow = true;
  group.add(helmet);

  // Helmet collar ring
  const ringGeo = new THREE.TorusGeometry(0.48, 0.06, 12, 24);
  const collarRing = new THREE.Mesh(ringGeo, darkTrimMaterial);
  collarRing.rotation.x = Math.PI / 2;
  collarRing.position.y = 1.55;
  group.add(collarRing);

  // 3. Shiny Curved Visor
  const visorGeo = new THREE.SphereGeometry(0.44, 20, 20, 0, Math.PI);
  const visor = new THREE.Mesh(visorGeo, visorMaterial);
  visor.rotation.y = -Math.PI / 2;
  visor.position.set(0, 1.95, 0.2);
  group.add(visor);

  // 4. Life Support Backpack
  const packGeo = new THREE.BoxGeometry(0.65, 0.8, 0.32);
  const backpack = new THREE.Mesh(packGeo, whiteSuitMaterial);
  backpack.position.set(0, 1.15, -0.5);
  backpack.castShadow = true;
  group.add(backpack);

  // Twin Thruster Nozzles on backpack
  const nozzleGeo = new THREE.CylinderGeometry(0.09, 0.14, 0.25, 12);
  const nozzleMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7 });
  const nozzleL = new THREE.Mesh(nozzleGeo, nozzleMat);
  nozzleL.position.set(-0.2, 0.7, -0.5);
  const nozzleR = new THREE.Mesh(nozzleGeo, nozzleMat);
  nozzleR.position.set(0.2, 0.7, -0.5);
  group.add(nozzleL, nozzleR);

  // 5. Left Arm (Can wave!)
  const armGeo = new THREE.CapsuleGeometry(0.16, 0.5, 8, 12);
  const leftArmGroup = new THREE.Group();
  leftArmGroup.position.set(0.65, 1.4, 0);
  leftArmGroup.name = 'leftArmGroup';

  const leftArm = new THREE.Mesh(armGeo, suitMaterial);
  leftArm.position.y = -0.28;
  leftArmGroup.add(leftArm);

  const leftGlove = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), darkTrimMaterial);
  leftGlove.position.y = -0.58;
  leftArmGroup.add(leftGlove);
  group.add(leftArmGroup);

  // 6. Right Arm (Waving arm)
  const rightArmGroup = new THREE.Group();
  rightArmGroup.position.set(-0.65, 1.4, 0);
  rightArmGroup.name = 'rightArmGroup';

  const rightArm = new THREE.Mesh(armGeo, suitMaterial);
  rightArm.position.y = -0.28;
  rightArmGroup.add(rightArm);

  const rightGlove = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), darkTrimMaterial);
  rightGlove.position.y = -0.58;
  rightArmGroup.add(rightGlove);
  group.add(rightArmGroup);

  // 7. Legs & Boots
  const legGeo = new THREE.CapsuleGeometry(0.18, 0.55, 8, 12);
  const leftLeg = new THREE.Mesh(legGeo, suitMaterial);
  leftLeg.position.set(0.25, 0.45, 0);
  leftLeg.castShadow = true;
  group.add(leftLeg);

  const leftBoot = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.22, 0.42), darkTrimMaterial);
  leftBoot.position.set(0.25, 0.11, 0.06);
  group.add(leftBoot);

  const rightLeg = new THREE.Mesh(legGeo, suitMaterial);
  rightLeg.position.set(-0.25, 0.45, 0);
  rightLeg.castShadow = true;
  group.add(rightLeg);

  const rightBoot = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.22, 0.42), darkTrimMaterial);
  rightBoot.position.set(-0.25, 0.11, 0.06);
  group.add(rightBoot);

  return group;
}

/**
 * Creates a playful retro-future Rocket with nose cone, body, fins, porthole, and engine nozzle.
 */
export function createRocket(color = 0xff2a85, trimColor = 0xffffff): THREE.Group {
  const rocket = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: trimColor,
    roughness: 0.25,
    metalness: 0.3,
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.3,
    metalness: 0.2,
  });

  const metallicMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.2,
    metalness: 0.8,
  });

  // 1. Fuselage Body
  const bodyGeo = new THREE.CylinderGeometry(0.6, 0.7, 2.2, 24);
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 1.6;
  body.castShadow = true;
  rocket.add(body);

  // 2. Nose Cone
  const coneGeo = new THREE.ConeGeometry(0.6, 1.2, 24);
  const cone = new THREE.Mesh(coneGeo, accentMat);
  cone.position.y = 3.3;
  cone.castShadow = true;
  rocket.add(cone);

  // Antenna on nose tip
  const antennaGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);
  const antenna = new THREE.Mesh(antennaGeo, metallicMat);
  antenna.position.y = 4.0;
  const tipGeo = new THREE.SphereGeometry(0.08, 12, 12);
  const tip = new THREE.Mesh(tipGeo, new THREE.MeshBasicMaterial({ color: 0xffd60a }));
  tip.position.y = 4.25;
  rocket.add(antenna, tip);

  // 3. Porthole Window
  const windowRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.06, 12, 24),
    metallicMat
  );
  windowRing.position.set(0, 2.1, 0.62);
  const windowGlass = new THREE.Mesh(
    new THREE.CircleGeometry(0.28, 24),
    new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      roughness: 0.1,
      metalness: 0.8,
      clearcoat: 1.0,
    })
  );
  windowGlass.position.set(0, 2.1, 0.63);
  rocket.add(windowRing, windowGlass);

  // 4. Accent Strip
  const stripeGeo = new THREE.CylinderGeometry(0.655, 0.655, 0.2, 24);
  const stripe = new THREE.Mesh(stripeGeo, accentMat);
  stripe.position.y = 1.4;
  rocket.add(stripe);

  // 5. 4 Rocket Fins
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(0.7, -0.4);
    finShape.lineTo(0.7, 0.3);
    finShape.lineTo(0, 0.9);
    finShape.closePath();

    const extrudeSettings = { depth: 0.08, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 };
    const finGeo = new THREE.ExtrudeGeometry(finShape, extrudeSettings);
    const fin = new THREE.Mesh(finGeo, accentMat);
    fin.position.set(Math.cos(angle) * 0.5, 0.8, Math.sin(angle) * 0.5);
    fin.rotation.y = -angle + Math.PI / 2;
    rocket.add(fin);
  }

  // 6. Engine Exhaust Bell
  const bellGeo = new THREE.CylinderGeometry(0.4, 0.65, 0.6, 24, 1, true);
  const bell = new THREE.Mesh(bellGeo, metallicMat);
  bell.position.y = 0.25;
  rocket.add(bell);

  // 7. Animated Flame Cone (can scale dynamically)
  const flameGeo = new THREE.ConeGeometry(0.5, 1.4, 16);
  const flameMat = new THREE.MeshBasicMaterial({
    color: 0xffa500,
    transparent: true,
    opacity: 0.85,
  });
  const flame = new THREE.Mesh(flameGeo, flameMat);
  flame.name = 'flame';
  flame.position.y = -0.8;
  flame.rotation.x = Math.PI;
  flame.visible = false;
  rocket.add(flame);

  // Core inner flame
  const innerFlameGeo = new THREE.ConeGeometry(0.28, 1.0, 16);
  const innerFlameMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.95,
  });
  const innerFlame = new THREE.Mesh(innerFlameGeo, innerFlameMat);
  innerFlame.name = 'innerFlame';
  innerFlame.position.y = -0.6;
  innerFlame.rotation.x = Math.PI;
  innerFlame.visible = false;
  rocket.add(innerFlame);

  return rocket;
}

/**
 * Creates a playful Lunar/Mars Rover with rolling wheels, camera mast, and antenna.
 */
export function createRover(bodyColor = 0xffffff, wheelColor = 0x334155): THREE.Group {
  const rover = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: bodyColor,
    roughness: 0.4,
    metalness: 0.2,
  });

  const tireMat = new THREE.MeshStandardMaterial({
    color: wheelColor,
    roughness: 0.8,
  });

  const goldFoilMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.3,
    metalness: 0.7,
  });

  // Main chassis box
  const chassisGeo = new THREE.BoxGeometry(1.4, 0.5, 1.8);
  const chassis = new THREE.Mesh(chassisGeo, bodyMat);
  chassis.position.y = 0.65;
  chassis.castShadow = true;
  rover.add(chassis);

  // Gold thermal insulation wrap on back
  const foilGeo = new THREE.BoxGeometry(1.2, 0.4, 0.7);
  const foil = new THREE.Mesh(foilGeo, goldFoilMat);
  foil.position.set(0, 0.7, -0.45);
  rover.add(foil);

  // 4 Wheels
  const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.25, 16);
  wheelGeo.rotateZ(Math.PI / 2);

  const wheelPositions = [
    { x: -0.85, y: 0.35, z: 0.65 },
    { x: 0.85, y: 0.35, z: 0.65 },
    { x: -0.85, y: 0.35, z: -0.65 },
    { x: 0.85, y: 0.35, z: -0.65 },
  ];

  const wheelsGroup = new THREE.Group();
  wheelsGroup.name = 'wheels';

  wheelPositions.forEach((pos, idx) => {
    const wheel = new THREE.Mesh(wheelGeo, tireMat);
    wheel.name = `wheel_${idx}`;
    wheel.position.set(pos.x, pos.y, pos.z);
    wheel.castShadow = true;

    // Rim hubcap
    const capGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.27, 8);
    capGeo.rotateZ(Math.PI / 2);
    const cap = new THREE.Mesh(capGeo, new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
    cap.position.set(pos.x, pos.y, pos.z);

    wheelsGroup.add(wheel, cap);
  });
  rover.add(wheelsGroup);

  // Sensor Mast & Camera Head
  const mastGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.9, 8);
  const mast = new THREE.Mesh(mastGeo, new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.5 }));
  mast.position.set(0.4, 1.1, 0.6);
  rover.add(mast);

  const camHeadGeo = new THREE.BoxGeometry(0.3, 0.2, 0.25);
  const camHead = new THREE.Mesh(camHeadGeo, bodyMat);
  camHead.position.set(0.4, 1.55, 0.6);

  // Dual camera lenses (like Curiosity rover)
  const lensGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.08, 12);
  lensGeo.rotateX(Math.PI / 2);
  const lensMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
  const lens1 = new THREE.Mesh(lensGeo, lensMat);
  lens1.position.set(0.34, 1.55, 0.74);
  const lens2 = new THREE.Mesh(lensGeo, lensMat);
  lens2.position.set(0.46, 1.55, 0.74);
  rover.add(camHead, lens1, lens2);

  // High Gain Dish Antenna
  const dishGeo = new THREE.ConeGeometry(0.3, 0.1, 16, 1, true);
  dishGeo.rotateX(-Math.PI / 3);
  const dishMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  const dish = new THREE.Mesh(dishGeo, dishMat);
  dish.position.set(-0.35, 1.15, -0.4);
  dish.name = 'antennaDish';
  rover.add(dish);

  // Headlights
  const lightL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfffbeb }));
  lightL.position.set(-0.45, 0.75, 0.92);
  const lightR = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfffbeb }));
  lightR.position.set(0.45, 0.75, 0.92);
  rover.add(lightL, lightR);

  return rover;
}

/**
 * Creates Cosmo the Alien Buddy in 3D
 */
export function createCosmoAlien(color = 0x9333ea, accentColor = 0x06b6d4): THREE.Group {
  const alien = new THREE.Group();

  const skinMat = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.3,
    metalness: 0.1,
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: accentColor,
    roughness: 0.2,
    metalness: 0.4,
  });

  // Pear-shaped friendly body
  const bodyGeo = new THREE.SphereGeometry(0.65, 24, 24);
  bodyGeo.scale(1, 1.15, 0.95);
  const body = new THREE.Mesh(bodyGeo, skinMat);
  body.position.y = 0.9;
  body.castShadow = true;
  alien.add(body);

  // Belly patch
  const bellyGeo = new THREE.SphereGeometry(0.45, 16, 16);
  bellyGeo.scale(0.9, 1.1, 0.4);
  const belly = new THREE.Mesh(bellyGeo, accentMat);
  belly.position.set(0, 0.85, 0.45);
  alien.add(belly);

  // Large expressive anime eyes
  const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
  const shineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

  const eyeGeo = new THREE.SphereGeometry(0.18, 16, 16);
  eyeGeo.scale(0.9, 1.1, 0.6);

  [-0.22, 0.22].forEach((x) => {
    const eye = new THREE.Mesh(eyeGeo, eyeWhiteMat);
    eye.position.set(x, 1.1, 0.52);

    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), pupilMat);
    pupil.position.set(x, 1.1, 0.6);

    const shine = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), shineMat);
    shine.position.set(x + 0.03, 1.14, 0.66);

    alien.add(eye, pupil, shine);
  });

  // Happy open smile
  const smileShape = new THREE.TorusGeometry(0.12, 0.03, 8, 16, Math.PI);
  const smileMat = new THREE.MeshBasicMaterial({ color: 0x1e1b4b });
  const smile = new THREE.Mesh(smileShape, smileMat);
  smile.rotation.z = Math.PI;
  smile.position.set(0, 0.85, 0.6);
  alien.add(smile);

  // Cute rosy cheeks
  const cheekMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.6 });
  const cheekL = new THREE.Mesh(new THREE.CircleGeometry(0.08, 12), cheekMat);
  cheekL.position.set(-0.35, 0.95, 0.55);
  const cheekR = new THREE.Mesh(new THREE.CircleGeometry(0.08, 12), cheekMat);
  cheekR.position.set(0.35, 0.95, 0.55);
  alien.add(cheekL, cheekR);

  // Springy Antennae with glowing orbs
  [-0.25, 0.25].forEach((x, i) => {
    const antennaCurve = new THREE.CylinderGeometry(0.03, 0.03, 0.45, 8);
    const stalk = new THREE.Mesh(antennaCurve, skinMat);
    stalk.position.set(x, 1.7, 0);
    stalk.rotation.z = i === 0 ? 0.3 : -0.3;

    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff })
    );
    orb.position.set(x * 1.5, 1.95, 0);

    alien.add(stalk, orb);
  });

  // Floating hover ring under alien
  const ringGeo = new THREE.TorusGeometry(0.5, 0.04, 12, 24);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.8 });
  const hoverRing = new THREE.Mesh(ringGeo, ringMat);
  hoverRing.name = 'hoverRing';
  hoverRing.rotation.x = Math.PI / 2;
  hoverRing.position.y = 0.25;
  alien.add(hoverRing);

  return alien;
}

/**
 * Creates glowing Science Crystals for the Moon Dash mission.
 */
export function createScienceCrystal(colorHex = 0x00f0ff): THREE.Group {
  const group = new THREE.Group();

  const crystalGeo = new THREE.OctahedronGeometry(0.45, 0);
  crystalGeo.scale(0.8, 1.6, 0.8);

  const crystalMat = new THREE.MeshPhysicalMaterial({
    color: colorHex,
    roughness: 0.1,
    transmission: 0.7,
    thickness: 0.8,
    emissive: colorHex,
    emissiveIntensity: 0.6,
  });

  const crystal = new THREE.Mesh(crystalGeo, crystalMat);
  crystal.position.y = 0.7;
  crystal.castShadow = true;
  group.add(crystal);

  // Soft glow halo
  const glowGeo = new THREE.SphereGeometry(0.55, 12, 12);
  const glowMat = new THREE.MeshBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity: 0.25,
  });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  glow.position.y = 0.7;
  group.add(glow);

  // Rocky crystal pedestal
  const baseGeo = new THREE.DodecahedronGeometry(0.35, 1);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.scale.set(1.4, 0.4, 1.4);
  base.position.y = 0.15;
  group.add(base);

  return group;
}

/**
 * Creates a detailed Space Station model for the hub & mission
 */
export function createSpaceStation(): THREE.Group {
  const station = new THREE.Group();

  const moduleMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.3,
    metalness: 0.6,
  });

  const solarMat = new THREE.MeshStandardMaterial({
    color: 0x1e3a8a,
    roughness: 0.2,
    metalness: 0.8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.2,
  });

  // Central Hub Cylinder
  const hubGeo = new THREE.CylinderGeometry(0.6, 0.6, 2.5, 16);
  const hub = new THREE.Mesh(hubGeo, moduleMat);
  station.add(hub);

  // Cross research module
  const crossGeo = new THREE.CylinderGeometry(0.45, 0.45, 2.8, 16);
  crossGeo.rotateZ(Math.PI / 2);
  const crossModule = new THREE.Mesh(crossGeo, moduleMat);
  station.add(crossModule);

  // Observation Cupola Dome with glowing windows
  const cupolaGeo = new THREE.SphereGeometry(0.45, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const cupolaMat = new THREE.MeshPhysicalMaterial({ color: 0x00f0ff, roughness: 0.1, metalness: 0.7 });
  const cupola = new THREE.Mesh(cupolaGeo, cupolaMat);
  cupola.position.y = 1.25;
  station.add(cupola);

  // Dual Large Solar Array Wings
  const trussGeo = new THREE.CylinderGeometry(0.08, 0.08, 4.2, 8);
  trussGeo.rotateX(Math.PI / 2);
  const truss = new THREE.Mesh(trussGeo, new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 }));
  station.add(truss);

  [-1.6, 1.6].forEach((z) => {
    const panelGeo = new THREE.BoxGeometry(2.4, 0.04, 0.9);
    const panel = new THREE.Mesh(panelGeo, solarMat);
    panel.position.set(0, 0, z);
    panel.castShadow = true;
    station.add(panel);
  });

  // Docking Ports
  const portGeo = new THREE.TorusGeometry(0.35, 0.08, 12, 16);
  const portMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.6 });
  const port1 = new THREE.Mesh(portGeo, portMat);
  port1.rotation.y = Math.PI / 2;
  port1.position.set(1.4, 0, 0);
  const port2 = new THREE.Mesh(portGeo, portMat);
  port2.rotation.y = Math.PI / 2;
  port2.position.set(-1.4, 0, 0);
  station.add(port1, port2);

  return station;
}
