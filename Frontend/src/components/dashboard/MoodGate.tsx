import { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

/** Total spill: expand + shrink back (must match CSS animation duration). */
const SPILL_TOTAL_MS = 2600;

const COLORS = [
  { value: 'purple',    hex: '#7F77DD' },
  { value: 'amber',     hex: '#EF9F27' },
  { value: 'rose',      hex: '#ED93B1' },
  { value: 'green',     hex: '#1D9E75' },
  { value: 'blue',      hex: '#378ADD' },
  { value: 'coral',     hex: '#D85A30' },
  { value: 'yellow',    hex: '#FAC775' },
  { value: 'nearwhite', hex: '#b0a89a' },
];

interface MoodGateProps {
  onComplete: (mood: string) => void;
}

const MoodGate = ({ onComplete }: MoodGateProps) => {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);
  const [spillCoord, setSpillCoord] = useState<{ x: number; y: number; color: string } | null>(null);

  const handleSelect = (e: React.MouseEvent<HTMLButtonElement>, color: typeof COLORS[0]) => {
    if (selected) return; // prevent multiple clicks
    setSelected(color.value);
    
    // Get center of circle for spill effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    setSpillCoord({ x, y, color: color.hex });

    // Update root CSS variables to new color scheme with HSL
    // Extract RGB from HEX simple parser
    const hex = color.hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Quick RGB to HSL conversion (normalized to percentages for standard HSL CSS variables if needed)
    // For simplicity, we can pass the hex as the primary color. But we also need a muted background tint.
    // Creating a very light version for the background:
    const root = document.documentElement;
    root.style.setProperty('--primary', color.hex);
    root.style.setProperty('--primary-transparent', `${color.hex}33`); // 20% opacity
    root.style.setProperty('--card', '#ffffff');
    root.style.setProperty('--background', '#faf8f5');
    // We also set a specific tracking variable so other components can pick up the mood colour
    root.style.setProperty('--mood-accent', color.hex);

    // After expand + reverse shrink completes
    setTimeout(() => {
      onComplete(color.value);
    }, SPILL_TOTAL_MS);
  };

  return (
    <>
      <style>
        {`
          @keyframes breathe {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          
          .breathing-circle {
            animation: breathe 3s infinite ease-in-out;
            transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          
          .breathing-circle.selected {
            transform: scale(0.9) !important;
            animation: none;
          }

          /* Expand to cover screen, then shrink back the same way (no hold). */
          @keyframes spillExpandShrink {
            0% {
              transform: translate(-50%, -50%) scale(0);
              opacity: 1;
            }
            50% {
              transform: translate(-50%, -50%) scale(100);
              opacity: 0.98;
            }
            100% {
              transform: translate(-50%, -50%) scale(0);
              opacity: 1;
            }
          }
          
          .spill-ripple {
            position: fixed;
            width: 15vw;
            height: 15vw;
            border-radius: 50%;
            pointer-events: none;
            z-index: 100;
            will-change: transform, opacity;
            animation: spillExpandShrink ${SPILL_TOTAL_MS}ms cubic-bezier(0.45, 0.05, 0.25, 1) forwards;
          }
        `}
      </style>

      {/* Spill effect overlay */}
      {spillCoord && (
        <div 
          className="spill-ripple"
          style={{
            left: spillCoord.x,
            top: spillCoord.y,
            backgroundColor: spillCoord.color,
          }}
        />
      )}

      {/* Main MoodGate container */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#faf8f5',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h1 
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '2.5rem',
            color: '#2d2520',
            marginBottom: '4rem',
            textAlign: 'center',
            padding: '0 2rem'
          }}
        >
          {t('What color is your mind today?', 'आज तपाईंको मन कुन रङजस्तो छ?')}
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '2rem',
          maxWidth: '600px'
        }}>
          {COLORS.map((color, index) => (
            <button
              key={color.value}
              onClick={(e) => handleSelect(e, color)}
              className={`breathing-circle ${selected === color.value ? 'selected' : ''}`}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: color.hex,
                border: 'none',
                cursor: 'pointer',
                animationDelay: `${index * 0.3}s`,
                boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                outline: 'none',
              }}
              aria-label={color.value}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default MoodGate;
