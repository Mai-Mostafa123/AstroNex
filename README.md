# 🚀 ASTRO QUEST — 3D Space Adventure for Kids

Welcome to **Astro Quest**, an award-winning interactive 3D astronaut-training adventure designed for children aged 8–14. Enter a vibrant animated universe where junior astronauts pilot rockets, explore realistic 3D planets, drive lunar rovers, repair orbital habitats, and converse with **Cosmo**, their AI space buddy!

---

## ✨ Art Style & Visual Polish

- **Cosmic Palette**: Deep nebula purples, electric cyan, sunshine yellow, and supernova pink accents.
- **Cartoon 3D PBR Aesthetic**: Procedural 3D models composed of 3–12 parts with realistic physical lighting, ambient starfields, soft shadows, and reflections.
- **Friendly Characters**:
  - Cute bubble-helmet Astronaut with waving animations, life-support pack, and customizable suit colors.
  - Multi-stage Rocket with shaking countdown, flame particles, and warp starfield liftoff.
  - Apollo-Next Lunar Rover with rolling tires, camera mast, and antenna dish.
  - Cosmo the Starlight Hopper alien with bouncing antennae and glowing eyes.
- **Kid-Friendly UI**: Chunky 3D tactile buttons, glossy rounded cards, zero-pill typography, audio effects with mute toggle, and victory confetti.

---

## 🎮 Playable Expeditions & Missions

### 1. 🌕 Mission 1: Moon Dash (Crystal Run)
- **Mechanics**: Drive the rover across the bumpy lunar crater surface using **Keyboard (WASD / Arrow Keys)** or **On-Screen Touch Arrows**.
- **Physics**: Real lunar gravity simulation (1.62 m/s², 1/6th of Earth gravity) with suspension bouncing.
- **Objectives**: Collect 5 glowing cryogenic science crystals and solve the mid-mission gravity checkpoint.
- **Reward**: +150 XP and the **Moon Walker Champion** badge.

### 2. 🔴 Mission 2: Mars Mystery (Ancient Water)
- **Mechanics**: Investigate Jezero Crater through 4 scientific clues.
- **Rover Instrument Workbench**:
  - *Regolith Soil Scoop*: Discovers oxidized iron minerals (rust).
  - *Panoramic Mastcam*: Analyzes water-rounded conglomerate riverbed pebbles.
  - *Diamond Core Drill*: Extracts subsurface clay mineral cores.
  - *Laser Spectrometer*: Detects polar water ice deposits mixed with dry ice.
- **Reward**: +250 XP and the **Red Planet Pioneer** badge.

### 3. 🛰️ Mission 3: Save the Space Station
- **Mechanics**: Manage vital station telemetry following a micrometeorite impact:
  - *Solar Tracking Alignment*: Rotate photovoltaic arrays toward direct sunlight.
  - *Battery Bus Reroute*: Switch power to lithium-ion reserves.
  - *CO2 Scrubbers*: Clear carbon dioxide filters to restore clean breathable oxygen.
  - *Houston Radio Link*: Re-establish satellite communications.
- **Engineering Decision**: Balance habitat heating, lighting, and oxygen flow.
- **Reward**: +350 XP and the **Space Station Guardian** badge.

---

## 🕹️ Space Academy Mini-Games

1. **🛠️ Build a Rocket**: Assemble 5 essential rocket stages in order:
   - Stabilizer Fins ➡️ Heavy Booster ➡️ Fuel Tank ➡️ Crew Capsule ➡️ Launch Escape Tower, followed by an orbital test liftoff!
2. **☄️ Asteroid Dodge**: Arcade shuttle navigation game dodging incoming space rocks and collecting star score points.
3. **🪐 Planet Matching**: Match planets with their distinct colors and planetary traits.
4. **✨ Cosmic Memory**: Flip and match pairs of celestial objects (Black Hole, Rocket, Moon, Saturn, Alien).
5. **🧠 Space Trivia Quiz**: Real astronomy questions testing knowledge of gravity, Mars, Saturn's rings, and rocket propulsion with thorough scientific explanations.

---

## 🪐 3D Solar System Explorer

- **Interactive 3D Simulation**: Real rotation and orbital motion for Mercury, Venus, Earth with orbiting Moon, Mars, Jupiter with Great Red Spot, Saturn with ring system, Uranus, and Neptune.
- **Planet Inspector**: Click or select any planet to smoothly fly the camera closer and view:
  - Day & Year length comparison.
  - Gravity ratio vs. Earth.
  - Number of moons.
  - 3 authentic astronomy facts.
- **Controls**: Drag to rotate orbit, change orbit speeds (0.5x, 1x, 2x), and reset camera overview.

---

## 👾 Cosmo — AI Space Buddy

- **Flight Mentor**: Cosmo is always available via the floating alien avatar button.
- **Powered by Gemini 3.8 Flash** via secure server-side Express proxy (`/api/cosmo/chat`) with warm, kid-safe system prompting.
- **Offline / Smart Fallback**: Delivers pre-written educational explanations and star facts even if offline or if API limits are reached.
- **Quick Prompts**: Direct buttons for questions like *"Why is Mars red?"*, *"What is a black hole?"*, *"How do rockets fly?"*, and mission hints.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Three.js r160+ (procedural 3D models), Bootstrap 5, Lucide React, Canvas Confetti.
- **Audio**: Procedural Web Audio API sound synthesis (zero external audio files).
- **Backend**: Express on Node.js running Vite middleware in dev and handling server-side Gemini API calls.
- **Data Persistence**: LocalStorage for saving XP stars, astronaut rank, badges, and suit colors.
