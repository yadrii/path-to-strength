import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { applyMoodThemeFromKey } from '@/lib/moodTheme';

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

    applyMoodThemeFromKey(color.value);

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

      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#faf8f5] px-4 transition-opacity duration-1000"
        style={{ opacity: spillCoord ? 0 : 1 }}
      >
        <h1 className="mb-8 max-w-xl px-1 text-center font-display text-2xl font-bold leading-tight text-[#2d2520] xs:text-3xl sm:mb-12 sm:text-4xl md:mb-14 md:text-[2.5rem]">
          {t('What color is your mind today?', 'आज तपाईंको मन कुन रङजस्तो छ?')}
        </h1>

        <div className="grid w-full max-w-[600px] grid-cols-4 justify-items-center gap-4 xs:gap-6 sm:gap-8">
          {COLORS.map((color, index) => (
            <button
              key={color.value}
              type="button"
              onClick={(e) => handleSelect(e, color)}
              className={`breathing-circle h-14 w-14 cursor-pointer rounded-full border-0 outline-none ring-2 ring-white/50 transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 xs:h-[4.25rem] xs:w-[4.25rem] sm:h-[72px] sm:w-[72px] ${selected === color.value ? 'selected' : ''}`}
              style={{
                backgroundColor: color.hex,
                animationDelay: `${index * 0.3}s`,
                boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
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
