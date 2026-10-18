import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { soundEffects } from '../../utils/audio';
import { Send, Sparkles, X, MessageSquare, Bot, HelpCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'cosmo' | 'user';
  text: string;
  time: string;
}

interface CosmoChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  missionContext?: string;
}

const QUICK_PROMPTS = [
  'Why is Mars red? 🔴',
  'What is a black hole? 🕳️',
  'How do rockets fly in space? 🚀',
  'Tell me a secret space fact! ✨',
  'Give me a flight tip for my missions! 🛰️',
];

export const CosmoChatModal: React.FC<CosmoChatModalProps> = ({ isOpen, onClose, missionContext }) => {
  const { progress } = useGame();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'cosmo',
      text: `Zorp zorp, Cadet! I'm COSMO, your flight buddy and science guide! Ask me anything about planets, stars, rockets, or your missions! 🌟`,
      time: 'Now',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || loading) return;

    soundEffects.click();
    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setLoading(true);

    try {
      const res = await fetch('/api/cosmo/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          missionContext: missionContext || 'Exploring Astro Quest space hub',
          rank: progress.rank,
        }),
      });

      const data = await res.json();
      soundEffects.starCollect();

      const cosmoReply: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'cosmo',
        text: data.reply || "Bloop! Space transmission received loud and clear, Cadet!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, cosmoReply]);
    } catch (err) {
      console.warn('Cosmo chat network fallback', err);
      const fallbackReply: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'cosmo',
        text: "Bzzzt! Cosmo's radio antenna caught a solar flare! Remember: gravity connects all objects in space, and every great astronaut never stops asking questions! 🌟",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        background: 'rgba(10, 5, 27, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(180deg, #1e1145 0%, #0e0724 100%)',
          border: '3px solid #00f0ff',
          borderRadius: '28px',
          width: '100%',
          maxWidth: '640px',
          height: 'min(640px, 90vh)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0, 240, 255, 0.35)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            background: 'linear-gradient(90deg, #6b21a8 0%, #0369a1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid rgba(255,255,255,0.2)',
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #a855f7 0%, #00f0ff 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                border: '2px solid #fff',
                boxShadow: '0 0 12px rgba(0, 240, 255, 0.8)',
              }}
            >
              👾
            </div>
            <div>
              <div style={{ color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem' }}>
                COSMO • AI SPACE BUDDY
              </div>
              <div style={{ color: '#38bdf8', fontSize: '0.8rem', fontWeight: 600 }}>
                Flight Mentor • Gemini 3.8 Flash Powered
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              soundEffects.click();
              onClose();
            }}
            className="game-btn game-btn-secondary game-btn-sm"
            style={{ padding: '6px 12px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Chat Messages Log */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={m.sender === 'cosmo' ? 'chat-bubble-cosmo' : 'chat-bubble-user'}
              style={{ maxWidth: '85%' }}
            >
              <div style={{ fontSize: '0.95rem', lineHeight: 1.45 }}>{m.text}</div>
              <div
                style={{
                  fontSize: '0.7rem',
                  opacity: 0.7,
                  marginTop: '4px',
                  textAlign: m.sender === 'cosmo' ? 'left' : 'right',
                }}
              >
                {m.time}
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-bubble-cosmo" style={{ maxWidth: '70%' }}>
              <div className="d-flex align-items-center gap-2">
                <Sparkles size={16} color="#ffd60a" className="float-animation" />
                <span style={{ fontSize: '0.9rem', color: '#c4b5fd' }}>Cosmo is checking galactic star charts...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div
          style={{
            padding: '8px 16px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
          }}
        >
          {QUICK_PROMPTS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="game-btn game-btn-secondary game-btn-sm"
              style={{ fontSize: '0.8rem', padding: '4px 10px' }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div
          style={{
            padding: '14px 18px',
            background: 'rgba(15, 8, 36, 0.95)',
            borderTop: '2px solid rgba(168, 85, 247, 0.3)',
            display: 'flex',
            gap: '10px',
          }}
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask Cosmo about planets, black holes, rockets..."
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.08)',
              border: '2px solid rgba(168, 85, 247, 0.5)',
              borderRadius: '16px',
              padding: '10px 16px',
              color: '#fff',
              outline: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
            }}
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={loading || !inputVal.trim()}
            className="game-btn game-btn-primary"
            style={{ padding: '10px 18px' }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
