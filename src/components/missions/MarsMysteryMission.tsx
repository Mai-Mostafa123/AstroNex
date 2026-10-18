import React, { useState } from 'react';
import { soundEffects } from '../../utils/audio';
import { useGame } from '../../context/GameContext';
import { ArrowLeft, CheckCircle, Search, Wrench, Sparkles, Trophy, AlertCircle, Compass } from 'lucide-react';

interface MarsMysteryMissionProps {
  onBackToHub: () => void;
}

interface ClueStep {
  id: number;
  title: string;
  location: string;
  prompt: string;
  requiredTool: string;
  toolHint: string;
  discovery: string;
  fact: string;
  completed: boolean;
}

const TOOLS = [
  { id: 'drill', name: 'Diamond Core Drill', icon: '🔩', desc: 'Penetrates hard rock to retrieve unweathered core samples' },
  { id: 'laser', name: 'Laser Spectrometer', icon: '⚡', desc: 'Zaps rock samples to analyze chemical elements and minerals' },
  { id: 'cam', name: 'High-Res Mast Camera', icon: '📷', desc: 'Captures stereo 3D photos of sand dunes and layered canyon walls' },
  { id: 'scoop', name: 'Regolith Soil Scoop', icon: '🥄', desc: 'Collects loose red Martian dust to test for magnetic iron minerals' },
];

export const MarsMysteryMission: React.FC<MarsMysteryMissionProps> = ({ onBackToHub }) => {
  const { addXP, completeMission } = useGame();

  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; success: boolean } | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [missionComplete, setMissionComplete] = useState(false);

  const [steps, setSteps] = useState<ClueStep[]>([
    {
      id: 1,
      title: 'Clue 1: The Rusty Dust Mystery',
      location: 'Dune Basin Alpha',
      prompt: 'Cadet, examine the strange red soil! Which tool will collect loose regolith to test why Mars looks so red and rusty?',
      requiredTool: 'scoop',
      toolHint: 'Loose surface dust needs a tool that can dig and collect soil granules!',
      discovery: 'Sample verified: The Martian dust is rich in iron minerals that oxidized (rusted) when exposed to oxygen long ago!',
      fact: 'Did you know? Mars looks reddish-orange because of iron oxide—the exact same chemical as rusty iron nails on Earth!',
      completed: false,
    },
    {
      id: 2,
      title: 'Clue 2: The Ancient Riverbed Pebbles',
      location: 'Jezero Delta Outflow',
      prompt: 'Look at these rounded rocks! On Earth, water currents smooth rocks into rounded pebbles. Which tool can photograph the rock layers in high definition?',
      requiredTool: 'cam',
      toolHint: 'You need optics to zoom in and capture panoramic stereo images of geological layers!',
      discovery: 'High-definition photo confirms rounded conglomerate pebbles formed by an ancient flowing river!',
      fact: 'Scientists believe billions of years ago, Mars had lakes, rivers, and a thicker, warmer atmosphere!',
      completed: false,
    },
    {
      id: 3,
      title: 'Clue 3: Subsurface Mineral Layers',
      location: 'Sediment Ridge Omega',
      prompt: 'A rocky crust hides deep mineral layers. We need to bore into the rock interior where sunlight hasn’t reached for billions of years!',
      requiredTool: 'drill',
      toolHint: 'Hard rock surfaces require a powerful rotary cutting tool to extract a core sample!',
      discovery: 'Drill core extracted! Rich in clay minerals and carbonates that only form in neutral, non-acidic liquid water!',
      fact: 'Robotic rovers like Perseverance store sealed rock cores in titanium tubes for future missions to bring back to Earth!',
      completed: false,
    },
    {
      id: 4,
      title: 'Clue 4: Chemical Laser Spectroscopy',
      location: 'Polar Escarpment',
      prompt: 'Fire an instrument at that strange shiny crystal outcrop to vaporize a tiny pinpoint and measure its spectral light signature!',
      requiredTool: 'laser',
      toolHint: 'Zapping rocks with pulses of concentrated light gives us an instant elemental fingerprint!',
      discovery: 'Laser analysis complete: High concentrations of pure water ice mixed with frozen carbon dioxide (dry ice)!',
      fact: 'Mars has enough frozen water ice in its polar caps that if melted, it could cover the whole planet in an ocean 35 feet deep!',
      completed: false,
    },
  ]);

  const currentStep = steps[activeStepIdx];

  const handleTestTool = () => {
    if (!selectedTool) {
      setFeedback({ text: 'Please select a tool from the rover workbench first!', success: false });
      soundEffects.gentleError();
      return;
    }

    setAnalyzing(true);
    soundEffects.click();

    setTimeout(() => {
      setAnalyzing(false);
      if (selectedTool === currentStep.requiredTool) {
        soundEffects.starCollect();
        setFeedback({ text: currentStep.discovery, success: true });
        addXP(60, `Solved ${currentStep.title}!`);

        const updated = [...steps];
        updated[activeStepIdx].completed = true;
        setSteps(updated);

        // Check if finished
        if (activeStepIdx === steps.length - 1) {
          setMissionComplete(true);
          completeMission('mars-mystery', 'mars-pioneer', 250);
        }
      } else {
        soundEffects.gentleError();
        setFeedback({
          text: `Not quite! ${currentStep.toolHint} Try another tool on the rover rack!`,
          success: false,
        });
      }
    }, 1200);
  };

  const handleNextStep = () => {
    soundEffects.click();
    setFeedback(null);
    setSelectedTool(null);
    setActiveStepIdx((prev) => Math.min(steps.length - 1, prev + 1));
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '88vh',
        padding: '30px 20px',
        background: 'radial-gradient(circle at 50% 10%, #7c2d12 0%, #300c06 50%, #150604 100%)',
        overflowX: 'hidden',
      }}
    >
      {/* Top Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 max-w-5xl mx-auto" style={{ maxWidth: '960px' }}>
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
              background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
              color: '#fff',
              padding: '6px 16px',
              borderRadius: '12px',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '0.95rem',
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          >
            MISSION 2: MARS MYSTERY 🔴
          </span>
          <span className="xp-badge">
            <Trophy size={16} /> +250 XP
          </span>
        </div>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        {/* Progress Step Indicator */}
        <div className="game-card p-3 mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
          {steps.map((st, idx) => (
            <div
              key={st.id}
              className="d-flex align-items-center gap-2"
              style={{
                opacity: idx === activeStepIdx ? 1 : st.completed ? 0.9 : 0.45,
                fontWeight: idx === activeStepIdx ? 800 : 600,
                color: idx === activeStepIdx ? '#ffd60a' : st.completed ? '#34d399' : '#e2e8f0',
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: st.completed ? '#059669' : idx === activeStepIdx ? '#d97706' : '#334155',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  color: '#fff',
                }}
              >
                {st.completed ? '✓' : idx + 1}
              </div>
              <span className="d-none d-md-inline" style={{ fontSize: '0.9rem' }}>
                {st.location}
              </span>
            </div>
          ))}
        </div>

        {/* Main Investigation Panel */}
        <div className="row g-4">
          {/* Left Column: Martian Scene & Clue */}
          <div className="col-12 col-lg-7">
            <div className="game-card p-4 h-100" style={{ borderColor: '#f97316' }}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span
                  style={{
                    color: '#fdba74',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  📍 LOCATION: {currentStep.location}
                </span>

                <span
                  style={{
                    background: 'rgba(234, 88, 12, 0.3)',
                    color: '#fed7aa',
                    padding: '2px 8px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                  }}
                >
                  Step {activeStepIdx + 1} of {steps.length}
                </span>
              </div>

              <h3 style={{ color: '#fff', fontWeight: 800, marginBottom: '14px' }}>
                {currentStep.title}
              </h3>

              {/* Decorative Mars Panoramic Box */}
              <div
                style={{
                  background: 'linear-gradient(180deg, #9a3412 0%, #431407 100%)',
                  border: '2px solid rgba(254, 215, 170, 0.3)',
                  borderRadius: '16px',
                  padding: '24px',
                  marginBottom: '18px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '8px' }}>
                  🪐 🔴 🏜️ 🤖
                </div>
                <div style={{ color: '#ffedd5', fontSize: '1.05rem', lineHeight: 1.5, fontWeight: 500 }}>
                  “{currentStep.prompt}”
                </div>
              </div>

              {/* Feedback and Results */}
              {feedback && (
                <div
                  style={{
                    background: feedback.success ? 'rgba(5, 150, 105, 0.25)' : 'rgba(220, 38, 38, 0.25)',
                    border: `2px solid ${feedback.success ? '#34d399' : '#f87171'}`,
                    borderRadius: '16px',
                    padding: '16px',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      color: feedback.success ? '#34d399' : '#fca5a5',
                      fontWeight: 700,
                      marginBottom: '6px',
                    }}
                  >
                    {feedback.success ? '🎉 DISCOVERY LOGGED!' : '⚠️ INSTRUMENT ERROR'}
                  </div>
                  <div style={{ color: '#fff', fontSize: '0.95rem' }}>{feedback.text}</div>

                  {feedback.success && (
                    <div
                      style={{
                        background: 'rgba(0,0,0,0.3)',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        marginTop: '10px',
                        color: '#fef08a',
                        fontSize: '0.85rem',
                      }}
                    >
                      💡 <strong>Cosmo’s Science Fact:</strong> {currentStep.fact}
                    </div>
                  )}
                </div>
              )}

              {currentStep.completed && activeStepIdx < steps.length - 1 && (
                <button onClick={handleNextStep} className="game-btn game-btn-accent w-100">
                  Proceed to Next Clue <Sparkles size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Rover Instrument Rack */}
          <div className="col-12 col-lg-5">
            <div className="game-card p-4 h-100" style={{ borderColor: '#fdba74' }}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <Wrench size={22} color="#ffd60a" />
                <h4 style={{ margin: 0, color: '#fff', fontWeight: 800 }}>ROVER TOOL RACK</h4>
              </div>

              <p style={{ color: '#fed7aa', fontSize: '0.9rem', marginBottom: '16px' }}>
                Select the instrument best suited to investigate this Martian clue:
              </p>

              <div className="d-flex flex-column gap-3 mb-4">
                {TOOLS.map((tool) => {
                  const isSelected = selectedTool === tool.id;
                  return (
                    <div
                      key={tool.id}
                      onClick={() => {
                        soundEffects.click();
                        setSelectedTool(tool.id);
                      }}
                      style={{
                        background: isSelected
                          ? 'linear-gradient(135deg, rgba(234, 88, 12, 0.4) 0%, rgba(194, 65, 12, 0.4) 100%)'
                          : 'rgba(40, 16, 10, 0.7)',
                        border: `2px solid ${isSelected ? '#ffd60a' : 'rgba(251, 146, 60, 0.3)'}`,
                        borderRadius: '16px',
                        padding: '12px 16px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <span style={{ fontSize: '1.8rem' }}>{tool.icon}</span>
                        <div>
                          <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>
                            {tool.name}
                          </div>
                          <div style={{ color: '#fed7aa', fontSize: '0.8rem' }}>{tool.desc}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                disabled={analyzing || currentStep.completed}
                onClick={handleTestTool}
                className="game-btn game-btn-primary w-100 game-btn-lg"
              >
                {analyzing ? 'ANALYZING SAMPLE...' : 'DEPLOY INSTRUMENT 🔬'}
              </button>
            </div>
          </div>
        </div>

        {/* Mission Completed Modal */}
        {missionComplete && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 50,
              background: 'rgba(20, 5, 2, 0.94)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(180deg, #7c2d12 0%, #2e0d06 100%)',
                border: '4px solid #ffd60a',
                borderRadius: '28px',
                padding: '40px',
                maxWidth: '560px',
                width: '100%',
                textAlign: 'center',
                boxShadow: '0 25px 60px rgba(251, 146, 60, 0.4)',
              }}
            >
              <div style={{ fontSize: '3.8rem', marginBottom: '8px' }}>🔴🏆</div>

              <h2 style={{ color: '#fff', fontWeight: 900, marginBottom: '8px' }}>
                MARS MYSTERY SOLVED!
              </h2>

              <p style={{ color: '#fed7aa', fontSize: '1.1rem', marginBottom: '20px' }}>
                You successfully confirmed oxidized iron minerals, ancient riverbed sediments, clay deposits, and sub-surface polar water ice!
              </p>

              <div
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: '18px',
                  padding: '16px',
                  marginBottom: '24px',
                }}
              >
                <div className="d-flex justify-content-center align-items-center gap-3">
                  <span className="xp-badge" style={{ fontSize: '1.1rem' }}>
                    <Trophy size={18} /> +250 XP
                  </span>
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #f97316 0%, #c2410c 100%)',
                      color: '#fff',
                      padding: '6px 14px',
                      borderRadius: '12px',
                      fontWeight: 800,
                    }}
                  >
                    BADGE: Red Planet Pioneer 🔴
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
    </div>
  );
};
