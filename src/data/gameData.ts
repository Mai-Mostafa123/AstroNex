import { Badge, Companion, MissionData } from '../types/game';

export const COMPANIONS: Companion[] = [
  {
    id: 'cosmo',
    name: 'Cosmo',
    species: 'Starlight Hopper',
    description: 'An enthusiastic purple-cyan alien buddy who loves star charts and galactic jokes!',
    color: '#9333ea',
    accent: '#06b6d4',
    perk: '+10% bonus star boost on planetary missions'
  },
  {
    id: 'pip',
    name: 'Robo-Pip',
    species: 'Nano Maintenance Bot',
    description: 'A cheerful floating robot with blinking LED eyes and magnetic tool tentacles!',
    color: '#3b82f6',
    accent: '#fbbf24',
    perk: 'Special tool diagnostic tips in technical puzzles'
  },
  {
    id: 'nova',
    name: 'Nova',
    species: 'Solar Flame Kitten',
    description: 'A warm, purring cosmic critter that glows like a newborn star in deep space!',
    color: '#f97316',
    accent: '#ffd60a',
    perk: 'Illuminates hidden clues in dark moon craters'
  },
  {
    id: 'bloop',
    name: 'Bloop',
    species: 'Nebula Gel Pod',
    description: 'A bouncy, joyful teal jelly companion that can change shape to imitate asteroids!',
    color: '#10b981',
    accent: '#38bdf8',
    perk: 'Extra resilience in zero-gravity obstacle courses'
  }
];

export const BADGES: Badge[] = [
  {
    id: 'first-launch',
    title: 'Liftoff Legend',
    description: 'Completed your very first countdown and launched into orbit!',
    icon: '🚀',
    category: 'mission'
  },
  {
    id: 'moon-walker',
    title: 'Moon Dash Champion',
    description: 'Mastered 1/6th gravity and harvested lunar science crystals!',
    icon: '🌕',
    category: 'mission'
  },
  {
    id: 'mars-pioneer',
    title: 'Red Planet Pioneer',
    description: 'Analyzed Martian soil, discovered polar water ice, and built a sensor outpost!',
    icon: '🔴',
    category: 'mission'
  },
  {
    id: 'station-hero',
    title: 'Space Station Guardian',
    description: 'Restored the oxygen scrubbers, aligned solar arrays, and rescued the crew bot!',
    icon: '🛰️',
    category: 'mission'
  },
  {
    id: 'rocket-builder',
    title: 'Master Rocket Architect',
    description: 'Assembled stages, fuel pumps, command pods, and fins in correct order!',
    icon: '🛠️',
    category: 'minigame'
  },
  {
    id: 'cosmic-scholar',
    title: 'Astrophysics Genius',
    description: 'Achieved a perfect score on the Galactic Trivia Quiz!',
    icon: '🧠',
    category: 'quiz'
  },
  {
    id: 'asteroid-ace',
    title: 'Asteroid Belt Ace',
    description: 'Navigated 30 seconds of high-speed cosmic debris dodging!',
    icon: '☄️',
    category: 'minigame'
  },
  {
    id: 'solar-voyager',
    title: 'Solar System Explorer',
    description: 'Inspected all 8 planets and discovered their unique planetary secrets!',
    icon: '🪐',
    category: 'explorer'
  }
];

export const MISSIONS: MissionData[] = [
  {
    id: 'moon-dash',
    title: 'Moon Dash: Crystal Run',
    location: 'Lunar South Pole Crater',
    tagline: 'Drive the Apollo-Next Rover, hop across low-gravity craters, and collect ice crystals!',
    difficulty: 'Easy',
    rewardXP: 150,
    badgeId: 'moon-walker',
    description: 'The Moon has 1/6th of Earth gravity. Pilot the rover using keyboard or on-screen touch arrows, dodge lunar boulders, collect glowing crystals, and calibrate the science beacon!',
    color: '#94a3b8',
    icon: '🌕'
  },
  {
    id: 'mars-mystery',
    title: 'Mars Mystery: Ancient Water',
    location: 'Jezero Crater, Mars',
    tagline: 'Team up with Robo-Pip to drill sediment, identify minerals, and deploy the weather station!',
    difficulty: 'Medium',
    rewardXP: 250,
    badgeId: 'mars-pioneer',
    description: 'Mars is cold, dusty, and has an atmosphere mostly made of carbon dioxide. Use specialized rover instruments like Raman spectrometers and robotic drills to analyze clues of past water!',
    color: '#f97316',
    icon: '🔴'
  },
  {
    id: 'save-station',
    title: 'Save the Space Station',
    location: 'Orbiting Research Habitat',
    tagline: 'A micrometeorite tripped the power circuit! Reroute solar power, fix the air filters, and save the day!',
    difficulty: 'Challenging',
    rewardXP: 350,
    badgeId: 'station-hero',
    description: 'Living in microgravity takes sharp teamwork! Inspect the station module by module, balance battery reserves, reset life-support oxygen generators, and re-establish communications with Earth.',
    color: '#06b6d4',
    icon: '🛰️'
  }
];

export interface PlanetInfo {
  id: string;
  name: string;
  tagline: string;
  color: string;
  size: number; // visual scale in scene
  distance: number; // orbital distance
  speed: number; // orbital velocity
  tilt: number;
  hasRings?: boolean;
  facts: string[];
  dayLength: string;
  yearLength: string;
  gravityComparison: string;
  moonsCount: number;
}

export const PLANETS_DATA: PlanetInfo[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    tagline: 'The Swift Swift Baker',
    color: '#9ca3af',
    size: 0.6,
    distance: 4.5,
    speed: 0.03,
    tilt: 0.03,
    facts: [
      'Mercury is the smallest planet in the solar system and closest to the Sun.',
      'It has no atmosphere, meaning temperatures swing from 430°C by day to -180°C at night!',
      'It zips around the Sun in just 88 Earth days.'
    ],
    dayLength: '59 Earth days',
    yearLength: '88 Earth days',
    gravityComparison: '38% of Earth gravity',
    moonsCount: 0
  },
  {
    id: 'venus',
    name: 'Venus',
    tagline: 'The Super-Heated Greenhouse',
    color: '#eab308',
    size: 0.95,
    distance: 6.8,
    speed: 0.022,
    tilt: 3.1,
    facts: [
      'Venus is the hottest planet in our solar system (over 465°C) due to a runaway greenhouse effect!',
      'It spins backwards compared to most other planets (retrograde rotation).',
      'Its thick yellow clouds are made of sulfuric acid!'
    ],
    dayLength: '243 Earth days',
    yearLength: '225 Earth days',
    gravityComparison: '90% of Earth gravity',
    moonsCount: 0
  },
  {
    id: 'earth',
    name: 'Earth',
    tagline: 'Our Vibrant Oasis of Life',
    color: '#3b82f6',
    size: 1.0,
    distance: 9.5,
    speed: 0.018,
    tilt: 0.41,
    facts: [
      'The only known planet in the universe with liquid water oceans and thriving life!',
      'The atmosphere is 78% nitrogen, 21% oxygen, and 1% other gases.',
      'Has one lovely natural satellite: our Moon.'
    ],
    dayLength: '24 hours',
    yearLength: '365.25 days',
    gravityComparison: '1.0g (Standard Earth Gravity)',
    moonsCount: 1
  },
  {
    id: 'mars',
    name: 'Mars',
    tagline: 'The Dusty Red Frontier',
    color: '#ef4444',
    size: 0.75,
    distance: 12.5,
    speed: 0.014,
    tilt: 0.44,
    facts: [
      'Mars looks red because iron minerals in its soil oxidize (turn to rust)!',
      'Home to Olympus Mons, a giant volcano 3 times taller than Mount Everest!',
      'Has two small potato-shaped moons named Phobos and Deimos.'
    ],
    dayLength: '24 hours 37 minutes',
    yearLength: '687 Earth days',
    gravityComparison: '38% of Earth gravity',
    moonsCount: 2
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    tagline: 'The King of Giants',
    color: '#d97706',
    size: 2.2,
    distance: 17.0,
    speed: 0.009,
    tilt: 0.05,
    facts: [
      'Jupiter is the largest planet—more than 1,300 Earths could fit inside it!',
      'Its Great Red Spot is a spinning storm larger than Earth that has existed for centuries.',
      'Has 95 confirmed moons, including Europa which might have an ocean of liquid water!'
    ],
    dayLength: '9 hours 56 minutes',
    yearLength: '11.8 Earth years',
    gravityComparison: '253% of Earth gravity',
    moonsCount: 95
  },
  {
    id: 'saturn',
    name: 'Saturn',
    tagline: 'The Ringed Jewel',
    color: '#fbbf24',
    size: 1.8,
    distance: 22.0,
    speed: 0.007,
    tilt: 0.47,
    hasRings: true,
    facts: [
      'Saturn is famous for its dazzling rings made of billions of chunks of ice, dust, and rocks!',
      'It is so light that if you had a bathtub big enough, Saturn would float on water!',
      'Its moon Titan has a thick nitrogen atmosphere and lakes of liquid methane.'
    ],
    dayLength: '10 hours 42 minutes',
    yearLength: '29.5 Earth years',
    gravityComparison: '106% of Earth gravity',
    moonsCount: 146
  },
  {
    id: 'uranus',
    name: 'Uranus',
    tagline: 'The Tilted Ice Giant',
    color: '#22d3ee',
    size: 1.3,
    distance: 26.5,
    speed: 0.005,
    tilt: 1.7, // tilted on its side!
    facts: [
      'Uranus spins on its side like a bowling ball rolling around the Sun!',
      'It has a pale cyan color due to methane gas in its upper atmosphere absorbing red light.',
      'It is an ice giant with temperatures dipping to -224°C.'
    ],
    dayLength: '17 hours 14 minutes',
    yearLength: '84 Earth years',
    gravityComparison: '89% of Earth gravity',
    moonsCount: 28
  },
  {
    id: 'neptune',
    name: 'Neptune',
    tagline: 'The Supersonic Blue Whirlwind',
    color: '#38bdf8',
    size: 1.3,
    distance: 30.5,
    speed: 0.004,
    tilt: 0.49,
    facts: [
      'Neptune has the fastest winds in the solar system, reaching over 2,100 km/h (1,300 mph)!',
      'It is the farthest major planet from the Sun, taking 165 Earth years to complete one orbit.',
      'Its moon Triton orbits backward and shoots geysers of liquid nitrogen!'
    ],
    dayLength: '16 hours 6 minutes',
    yearLength: '165 Earth years',
    gravityComparison: '114% of Earth gravity',
    moonsCount: 16
  }
];

export const QUIZ_QUESTIONS = [
  {
    question: "Why would you bounce six times higher if you jumped on the Moon than on Earth?",
    options: [
      "The Moon has special magnetic rubber soil",
      "The Moon's mass is smaller, so its gravity is only 1/6th of Earth's",
      "Because astronauts wear super bouncy springs on boots",
      "Because the Moon has no night time"
    ],
    correctIndex: 1,
    explanation: "Mass creates gravity! Because the Moon is much smaller and lighter than Earth, its gravitational pull is only 1/6th as strong, making you feel super light!"
  },
  {
    question: "Which planet is famous for being the hottest in our solar system, with thick acid clouds?",
    options: ["Mercury", "Mars", "Venus", "Jupiter"],
    correctIndex: 2,
    explanation: "Even though Mercury is closer to the Sun, Venus is hotter (465°C!) because its super thick carbon dioxide atmosphere traps heat like a giant thermal blanket!"
  },
  {
    question: "What are Saturn's beautiful glowing rings mainly made of?",
    options: [
      "Solid sheets of glowing neon plastic",
      "Billions of icy chunks, dust, and space rocks",
      "Laser beams projected from its moons",
      "Melted golden metal"
    ],
    correctIndex: 1,
    explanation: "Saturn's rings look solid from far away, but they are made of countless pieces of sparkling water ice and rocky debris ranging from tiny specks to house-sized boulders!"
  },
  {
    question: "How do rockets propel themselves in the vacuum of outer space where there is no air?",
    options: [
      "By pushing against air with wings like an airplane",
      "By action-reaction: blasting exhaust gas backwards pushes the rocket forwards",
      "By using giant cosmic fans",
      "By pulling themselves using magnetic ropes"
    ],
    correctIndex: 1,
    explanation: "Sir Isaac Newton's Third Law: For every action, there is an equal and opposite reaction! Ejecting hot gas out the rocket nozzle at high velocity drives the rocket forward!"
  },
  {
    question: "Why does Mars appear reddish-orange to our telescopes and rovers?",
    options: [
      "It is covered in glowing lava lakes",
      "Iron minerals in its soil oxidized (turned into rust)",
      "It is reflecting sunlight through cherry glass",
      "It gets super hot and blushes"
    ],
    correctIndex: 1,
    explanation: "Mars is rich in iron minerals. When exposed to trace atmospheric oxygen long ago, the iron rusted into reddish iron oxide dust that covers the whole planet!"
  }
];
