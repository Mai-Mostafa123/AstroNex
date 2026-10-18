import React, { useState } from 'react';
import { soundEffects } from '../../utils/audio';
import { useGame } from '../../context/GameContext';
import { ArrowLeft, Zap, Wind, Radio, ShieldAlert, CheckCircle2, Trophy, RotateCcw } from 'lucide-react';

interface SaveStationMissionProps {
  onBackToHub: () => void;
}

export const SaveStationMission: React.FC<SaveStationMissionProps> = ({ onBackToHub }) => {
  const { recordStationRepair, completeMission } = useGame();

  // Resource Management State: Power & Oxygen
  const [solarAligned, setSolarAligned] = useState(false);
  const [batteryRouted, setBatteryRouted] = useState(false);
  const [scrubbersCleared, setScrubbersCleared] = useState(false);
  const [commRestored, setCommRestored] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState<number | null>(null);
  const [solutionFeedback, setSolutionFeedback] = useState<string | null>(null);
  const [missionComplete, setMissionComplete] = useState(false);

  // Power balance (kW)
  const powerLevel = (solarAligned ? 45 : 15) + (batteryRouted ? 35 : 0);
  const oxygenLevel = scrubbersCleared ? 98 : 42;

  const handleAlignSolar = () => {
    soundEffects.starCollect();
    const nextVal = !solarAligned;
    setSolarAligned(nextVal);
    if (nextVal) {
      recordStationRepair('solar-aligned', 40);
    }
  };

  const handleRerouteBattery = () => {
    soundEffects.starCollect();
    const nextVal = !batteryRouted;
    setBatteryRouted(nextVal);
    if (nextVal) {
      recordStationRepair('battery-routed', 40);
    }
  };

  const handleClearScrubbers = () => {
    soundEffects.starCollect();
    const nextVal = !scrubbersCleared;
    setScrubbersCleared(nextVal);
    if (nextVal) {
      recordStationRepair('scrubbers-cleared', 50);
    }
  };

  const handleRestoreComm = () => {
    soundEffects.starCollect();
    if (!commRestored) {
      setCommRestored(true);
      recordStationRepair('comm-restored', 40);
    }
  };

  const handleFinalChoice = (choiceIdx: number) => {
    setSelectedSolution(choiceIdx);
    if (choiceIdx === 1) {
      soundEffects.fanfare();
      setSolutionFeedback(
        'Outstanding engineering decision! Balancing the solar load while venting carbon dioxide scrubbers ensures steady oxygen and battery preservation for the crew!'
      );
      setMissionComplete(true);
      completeMission('save-station', 'station-hero', 350);
    } else if (choiceIdx === 0) {
      soundEffects.gentleError();
      setSolutionFeedback(
        'Warning: Turning off all lights and heaters will cause habitat temperatures to plummet! We need a balanced power distribution.'
      );
    } else {
      soundEffects.gentleError();
      setSolutionFeedback(
        'Warning: Venting cabin air into space would deplete vital air reserves! The scrubbers remove CO2 without wasting oxygen.'
      );
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '88vh',
        padding: '30px 20px',
        background: 'radial-gradient(circle at 50% 10%, #0369a1 0%, #082f49 45%, #030712 100%)',
        overflowX: 'hidden',
      }}
    >
      {/* Header */}
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
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#fff',
              padding: '6px 16px',
              borderRadius: '12px',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '0.95rem',
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          >
            MISSION 3: SAVE THE SPACE STATION 🛰️
          </span>
          <span className="xp-badge">
            <Trophy size={16} /> +350 XP
          </span>
        </div>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        {/* Robot Alert Banner */}
        <div
          className="game-card p-3 mb-4 d-flex align-items-center gap-3"
          style={{ borderColor: '#38bdf8', background: 'rgba(12, 45, 78, 0.9)' }}
        >
          <div style={{ fontSize: '2.5rem' }}>🤖</div>
          <div>
            <div style={{ color: '#ffd60a', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
              ROBO-PIP ALERT: MICROMETEORITE IMPACT DETECTED!
            </div>
            <div style={{ color: '#e0f2fe', fontSize: '0.95rem' }}>
              “A tiny cosmic pebble struck our auxiliary solar wing! We need Cadet Alexander to balance our station life-support systems before battery reserves hit critical!”
            </div>
          </div>
        </div>

        {/* Station Telemetry Meters */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-6">
            <div className="game-card p-3" style={{ borderColor: powerLevel >= 70 ? '#34d399' : '#f59e0b' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="d-flex align-items-center gap-2" style={{ color: '#fff', fontWeight: 700 }}>
                  <Zap size={18} color="#ffd60a" /> ELECTRICAL GRID POWER
                </span>
                <span style={{ fontWeight: 800, color: powerLevel >= 70 ? '#34d399' : '#f59e0b' }}>
                  {powerLevel}% {powerLevel >= 70 ? '(STABLE)' : '(LOW)'}
                </span>
              </div>
              <div style={{ width: '100%', height: '14px', backgroundColor: '#1e293b', borderRadius: '8px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${powerLevel}%`,
                    height: '100%',
                    background: powerLevel >= 70 ? 'linear-gradient(90deg, #10b981, #34d399)' : 'linear-gradient(90deg, #f59e0b, #ef4444)',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="game-card p-3" style={{ borderColor: oxygenLevel >= 80 ? '#34d399' : '#ef4444' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="d-flex align-items-center gap-2" style={{ color: '#fff', fontWeight: 700 }}>
                  <Wind size={18} color="#38bdf8" /> OXYGEN / CO2 SCRUBBERS
                </span>
                <span style={{ fontWeight: 800, color: oxygenLevel >= 80 ? '#34d399' : '#ef4444' }}>
                  {oxygenLevel}% {oxygenLevel >= 80 ? '(PURE AIR)' : '(FILTER CLOGGED)'}
                </span>
              </div>
              <div style={{ width: '100%', height: '14px', backgroundColor: '#1e293b', borderRadius: '8px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${oxygenLevel}%`,
                    height: '100%',
                    background: oxygenLevel >= 80 ? 'linear-gradient(90deg, #06b6d4, #38bdf8)' : 'linear-gradient(90deg, #ef4444, #f97316)',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Systems Control Deck */}
        <div className="game-card p-4 mb-4" style={{ borderColor: '#38bdf8' }}>
          <h4 style={{ color: '#fff', fontWeight: 800, marginBottom: '16px' }}>
            🛰️ STATION REPAIR CONTROLS
          </h4>

          <div className="row g-3 mb-4">
            {/* Control 1: Solar Arrays */}
            <div className="col-12 col-md-6">
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: `2px solid ${solarAligned ? '#34d399' : '#f59e0b'}`,
                  borderRadius: '16px',
                  padding: '16px',
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ color: '#fff', fontWeight: 700 }}>Solar Array Sun-Tracking</span>
                  <span style={{ color: solarAligned ? '#34d399' : '#f59e0b', fontSize: '0.85rem', fontWeight: 800 }}>
                    {solarAligned ? 'OPTIMAL ANGLE' : 'OFF-AXIS'}
                  </span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '12px' }}>
                  Rotate the photovoltaic wings to face the direct sunlight as the station orbits Earth at 17,500 mph!
                </p>
                <button
                  onClick={handleAlignSolar}
                  className={`game-btn game-btn-sm w-100 ${solarAligned ? 'game-btn-success' : 'game-btn-primary'}`}
                >
                  {solarAligned ? '✓ Solar Arrays Locked' : 'Align Solar Panels to Sun'}
                </button>
              </div>
            </div>

            {/* Control 2: Battery Relays */}
            <div className="col-12 col-md-6">
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: `2px solid ${batteryRouted ? '#34d399' : '#f59e0b'}`,
                  borderRadius: '16px',
                  padding: '16px',
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ color: '#fff', fontWeight: 700 }}>Battery Bus Reroute</span>
                  <span style={{ color: batteryRouted ? '#34d399' : '#f59e0b', fontSize: '0.85rem', fontWeight: 800 }}>
                    {batteryRouted ? 'CIRCUIT CLOSED' : 'TRIPPED'}
                  </span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '12px' }}>
                  Bypass the burnt fuse by switching power through the secondary lithium-ion battery bank!
                </p>
                <button
                  onClick={handleRerouteBattery}
                  className={`game-btn game-btn-sm w-100 ${batteryRouted ? 'game-btn-success' : 'game-btn-secondary'}`}
                >
                  {batteryRouted ? '✓ Backup Power Engaged' : 'Switch Battery Bus'}
                </button>
              </div>
            </div>

            {/* Control 3: CO2 Scrubbers */}
            <div className="col-12 col-md-6">
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: `2px solid ${scrubbersCleared ? '#34d399' : '#f59e0b'}`,
                  borderRadius: '16px',
                  padding: '16px',
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ color: '#fff', fontWeight: 700 }}>Carbon Dioxide Scrubbers</span>
                  <span style={{ color: scrubbersCleared ? '#34d399' : '#ef4444', fontSize: '0.85rem', fontWeight: 800 }}>
                    {scrubbersCleared ? 'AIR NORMAL' : 'CO2 CLOGGED'}
                  </span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '12px' }}>
                  Astronauts exhale CO2. In microgravity, air doesn't naturally circulate, so fans must pull air through chemical scrubbers!
                </p>
                <button
                  onClick={handleClearScrubbers}
                  className={`game-btn game-btn-sm w-100 ${scrubbersCleared ? 'game-btn-success' : 'game-btn-accent'}`}
                >
                  {scrubbersCleared ? '✓ Scrubbers Desorbing' : 'Cycle CO2 Scrubbing Beds'}
                </button>
              </div>
            </div>

            {/* Control 4: Earth Comm Link */}
            <div className="col-12 col-md-6">
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: `2px solid ${commRestored ? '#34d399' : '#38bdf8'}`,
                  borderRadius: '16px',
                  padding: '16px',
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ color: '#fff', fontWeight: 700 }}>Houston Mission Control Radio</span>
                  <span style={{ color: commRestored ? '#34d399' : '#38bdf8', fontSize: '0.85rem', fontWeight: 800 }}>
                    {commRestored ? 'CONNECTED' : 'STANDBY'}
                  </span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '12px' }}>
                  Establish telemetry handoff through the TDRS satellite constellation so flight directors can confirm station status!
                </p>
                <button
                  onClick={handleRestoreComm}
                  className={`game-btn game-btn-sm w-100 ${commRestored ? 'game-btn-success' : 'game-btn-secondary'}`}
                >
                  {commRestored ? '✓ Signal Crystal Clear' : 'Lock Satellite Uplink'}
                </button>
              </div>
            </div>
          </div>

          {/* Final Educational Decision */}
          {powerLevel >= 70 && scrubbersCleared && (
            <div
              style={{
                background: 'rgba(6, 182, 212, 0.15)',
                border: '2px solid #06b6d4',
                borderRadius: '18px',
                padding: '20px',
                marginTop: '16px',
              }}
            >
              <h5 style={{ color: '#fff', fontWeight: 800, marginBottom: '10px' }}>
                🧠 FINAL MISSION DECISION: LIFE SUPPORT BALANCE
              </h5>
              <p style={{ color: '#e0f2fe', fontSize: '0.95rem', marginBottom: '14px' }}>
                Both power and oxygen are rising. Which engineering strategy best preserves life support for the 6 astronauts aboard?
              </p>

              <div className="d-flex flex-column gap-2">
                {[
                  'Turn off all heating and interior lighting completely to hoard power',
                  'Maintain balanced power routing while cycling air filters, keeping environmental temperatures safe and comfortable',
                  'Vent cabin air out the airlock to clean the filters faster',
                ].map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleFinalChoice(idx)}
                    className="game-btn game-btn-secondary"
                    style={{
                      textAlign: 'left',
                      justifyContent: 'flex-start',
                      padding: '10px 16px',
                      fontSize: '0.95rem',
                      background: selectedSolution === idx ? (idx === 1 ? '#059669' : '#dc2626') : undefined,
                    }}
                  >
                    {choice}
                  </button>
                ))}
              </div>

              {solutionFeedback && (
                <div
                  style={{
                    marginTop: '14px',
                    padding: '12px',
                    borderRadius: '12px',
                    background: selectedSolution === 1 ? 'rgba(5, 150, 105, 0.3)' : 'rgba(220, 38, 38, 0.3)',
                    color: '#fff',
                    fontSize: '0.95rem',
                  }}
                >
                  {solutionFeedback}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mission Complete Modal */}
        {missionComplete && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 50,
              background: 'rgba(3, 7, 18, 0.94)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(180deg, #0369a1 0%, #082f49 100%)',
                border: '4px solid #ffd60a',
                borderRadius: '28px',
                padding: '40px',
                maxWidth: '560px',
                width: '100%',
                textAlign: 'center',
                boxShadow: '0 25px 60px rgba(6, 182, 212, 0.4)',
              }}
            >
              <div style={{ fontSize: '3.8rem', marginBottom: '8px' }}>🛰️🏆</div>

              <h2 style={{ color: '#fff', fontWeight: 900, marginBottom: '8px' }}>
                SPACE STATION SAVED!
              </h2>

              <p style={{ color: '#e0f2fe', fontSize: '1.1rem', marginBottom: '20px' }}>
                You rerouted electrical bus power, calibrated solar arrays, restored clean breathable air, and re-linked with Mission Control!
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
                    <Trophy size={18} /> +350 XP
                  </span>
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
                      color: '#fff',
                      padding: '6px 14px',
                      borderRadius: '12px',
                      fontWeight: 800,
                    }}
                  >
                    BADGE: Space Station Guardian 🛰️
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
