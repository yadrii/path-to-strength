import { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import CaseTracker from './CaseTracker';

// ─── Choice Banks ────────────────────────────────────────────────────────────
const TIER1_CHOICES = (t: (en: string, ne: string) => string) => [
  {
    id: 'color',
    category: t('Colour', 'रङ'),
    question: t('What color did your day begin with?', 'आज तपाईंको दिन कुन रङमा सुरु भयो?'),
    type: 'colors' as const,
    why: t('One decision at a time reduces pressure. Clear options stabilise an exhausted nervous system.', 'एक पटकमा एउटा निर्णयले दबाब घटाउँछ। स्पष्ट विकल्पहरूले थकित स्नायु प्रणालीलाई स्थिर बनाउँछन्।'),
  },
  {
    id: 'sound',
    category: t('Sound', 'ध्वनि'),
    question: t('What sound do you want to wake up to tomorrow?', 'भोलि बिहान कुन आवाज सुन्न चाहनुहुन्छ?'),
    type: 'options' as const,
    options: [
      { value: 'rain',  label: t('Rain 🌧️', 'वर्षाको आवाज 🌧️') },
      { value: 'bells', label: t('Temple Bells 🔔', 'मन्दिरको घण्टी 🔔') },
      { value: 'birds', label: t('Birdsong 🐦', 'चराको चिरबिर 🐦') },
    ],
    why: t('Choosing a sound gives your senses a safe anchor.', 'आवाजको छनौटले इन्द्रियहरूलाई सुरक्षित महसुस गराउँछ।'),
  },
  {
    id: 'word',
    category: t('Word', 'शब्द'),
    question: t('Describe your morning in one word.', 'आजको बिहानलाई एक शब्दमा भन्नुहोस्।'),
    type: 'text' as const,
    placeholder: t('One word only...', 'एक शब्द मात्र...'),
    why: t('Naming your experience means understanding it. This calms the mind.', 'आफ्नो अनुभवलाई नाम दिनु भनेको त्यसलाई बुझ्नु हो। यो मस्तिष्कलाई शान्त बनाउँछ।'),
  },
  {
    id: 'pace',
    category: t('Pace', 'गति'),
    question: t('How do you want today to feel?', 'आज कस्तो दिन महसुस हुनु परेको छ?'),
    type: 'options' as const,
    options: [
      { value: 'quiet',  label: t('Quiet 🌿', 'शान्त 🌿') },
      { value: 'active', label: t('Active ⚡', 'सक्रिय ⚡') },
    ],
    why: t('Choosing your own pace is the first step to self-control.', 'आफ्नो गतिलाई आफैले छान्नु भनेको आत्म-नियन्त्रणको पहिलो कदम हो।'),
  },
  {
    id: 'intention',
    category: t('Intention', 'इरादा'),
    question: t('One small thing only for yourself today.', 'आज केवल आफ्नो लागि एउटा काम के गर्नुहुन्छ?'),
    type: 'text' as const,
    placeholder: t('Just for me...', 'आफ्नो लागि मात्र...'),
    why: t('Thinking "for myself" is powerful. This small intention builds self-worth.', '"आफ्नो लागि" भन्ने सोच्नु शक्तिशाली छ। यो सानो इरादाले आत्म-सम्मान बढाउँछ।'),
  },
];

const MOOD_PALETTE = [
  { value: 'coral',  hex: '#D85A30' },
  { value: 'amber',  hex: '#EF9F27' },
  { value: 'green',  hex: '#1D9E75' },
  { value: 'blue',   hex: '#378ADD' },
  { value: 'purple', hex: '#7F77DD' },
  { value: 'rose',   hex: '#ED93B1' },
];

type ChoiceType = 'options' | 'text' | 'colors';

interface Choice {
  id: string;
  category: string;
  question: string;
  type: ChoiceType;
  options?: { value: string; label: string }[];
  placeholder?: string;
  why?: string;
}

interface TodayScreenProps {
  moodColor?: string;
  signupDate?: Date;
}

const MOOD_HEX: Record<string, string> = {
  purple: '#7F77DD', amber: '#EF9F27', rose: '#ED93B1',
  green: '#1D9E75', blue: '#378ADD', coral: '#D85A30',
  yellow: '#FAC775', nearwhite: '#b0a89a',
};

function getTier(signupDate: Date): 1 | 2 | 3 {
  const days = Math.floor((Date.now() - signupDate.getTime()) / 86400000);
  if (days < 30) return 1;
  if (days < 60) return 2;
  return 3;
}

const TodayScreen = ({ moodColor = 'green', signupDate = new Date() }: TodayScreenProps) => {
  const { t } = useLanguage();
  // We use CSS transition with the parent context, but keeping accent fallback
  const accent = MOOD_HEX[moodColor] ?? '#1D9E75';
  const tier = getTier(signupDate);
  const dayCount = Math.floor((Date.now() - signupDate.getTime()) / 86400000) + 1;
  const choices: Choice[] = TIER1_CHOICES(t);

  const [step, setStep]       = useState(0);
  const [textVal, setTextVal] = useState('');
  const [sliding, setSliding] = useState(false);
  const [pulse, setPulse]     = useState(false);

  const done = step >= choices.length;
  const current = choices[step] || choices[choices.length - 1];

  const submit = (val: string) => {
    console.log(`[Supabase Log] ${current.id}: ${val} | Tier: ${tier}`);
    setTextVal('');
    
    if (step === choices.length - 1) {
      setPulse(true);
      setTimeout(() => setPulse(false), 2000);
      setStep(step + 1);
      return;
    }

    setSliding(true);
    setTimeout(() => {
      setStep(step + 1);
      setSliding(false);
    }, 400); // Wait for exit animation
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  const heroBg = `linear-gradient(135deg, #fde8d8 0%, #faf0e6 40%, #e8f5e9 100%)`;

  return (
    <>
      <style>
        {`
          @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
          @keyframes slideOutLeft { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(-30px); } }
          .slide-enter { animation: slideInRight 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .slide-exit { animation: slideOutLeft 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          
          @keyframes pulseScale {
            0%, 100% { transform: scale(1); box-shadow: 0 0 0 0px var(--mood-accent, #e08080); }
            50% { transform: scale(1.4); box-shadow: 0 0 0 10px rgba(0,0,0,0); }
          }
          .dots-pulse .progress-dot { animation: pulseScale 1s ease-out; background: var(--mood-accent, #e08080) !important; }
        `}
      </style>

      {/* Hero Banner */}
      <div style={{ padding: '0 0 1.5rem', fontFamily: 'DM Sans, sans-serif' }}>
        <div style={{
          background: heroBg,
          borderRadius: 20,
          padding: '2rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          flexWrap: 'wrap',
        }}>
          {/* Left: title */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <p style={{ fontSize: 11, color: '#9a8e84', letterSpacing: '0.08em', marginBottom: 6 }}>{t('Daily Restoration', 'आजको पुनर्स्थापना')}</p>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: '#2d2520', margin: 0, lineHeight: 1.2 }}>
              {t("Today's 5 Choices", 'आजको ५ छनौट')}
            </h1>
            <p style={{ fontSize: 13, color: '#7a6e66', marginTop: 10, maxWidth: 320, lineHeight: 1.6 }}>
              {t('Short, clear, safe decisions ground the mind today.', 'छोटो, स्पष्ट, र सुरक्षित निर्णयहरूले आज मस्तिष्कलाई थकित होइन, स्थिर बनाउँछन्।')}
            </p>
          </div>

          {/* Right: info cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 200 }}>
            {[
              { icon: '✦', label: t('Today', 'आजको दिन'), value: `${t('Day', 'दिन')} ${dayCount}` },
              { icon: '○', label: t('Done', 'सम्पन्न'),   value: `${done ? 5 : step}/5` },
              { icon: '◎', label: t('Tier', 'स्तर'),      value: `${t('Tier', 'तह')} ${tier}` },
            ].map(card => (
              <div key={card.label} style={{
                background: '#fff', borderRadius: 12, padding: '0.6rem 1rem',
                display: 'flex', alignItems: 'center', gap: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)', minWidth: 190,
              }}>
                <span style={{
                  width: 32, height: 32, borderRadius: '50%', background: '#fff0f0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, color: 'var(--mood-accent, #e08080)', flexShrink: 0,
                }}>{card.icon}</span>
                <div>
                  <p style={{ fontSize: 10, color: '#9a8e84', margin: 0, letterSpacing: '0.06em' }}>{card.label}</p>
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#2d2520', margin: 0 }}>{card.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main interaction row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(260px, 300px)',
          gap: '1.25rem',
          alignItems: 'stretch',
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        {/* Left: quiz card — same outer size, denser, larger inner content */}
        <div
          style={{
            background: 'var(--card, #fff)',
            borderRadius: 20,
            padding: '1.25rem 1.75rem 1.75rem',
            boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
            minHeight: 300,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            position: 'relative',
          }}
        >
          {/* Step dots — compact strip */}
          <div
            className={pulse ? 'dots-pulse' : ''}
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'center',
              marginBottom: 4,
            }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="progress-dot"
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: i < step ? 'var(--mood-accent, #e08080)' : '#ebe4dc',
                  transition: 'background 400ms, transform 200ms',
                }}
              />
            ))}
          </div>

          <div style={{ width: '100%', maxWidth: 560, margin: '0 auto', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0 }}>
            {!done ? (
              <div key={current.id} className={sliding ? 'slide-exit' : 'slide-enter'}>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#8a7d72',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    margin: '0 0 10px',
                  }}
                >
                  {current.category}
                </p>
                <p
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: 'clamp(1.35rem, 2.6vw, 1.85rem)',
                    fontWeight: 500,
                    color: '#2d2520',
                    margin: '0 0 1.1rem',
                    lineHeight: 1.45,
                    maxWidth: '42ch',
                  }}
                >
                  {current.question}
                </p>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: current.type === 'colors' ? 14 : 12,
                    alignItems: 'center',
                  }}
                >
                  {current.type === 'colors' &&
                    MOOD_PALETTE.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        title={c.value}
                        onClick={() => submit(c.value)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.06)';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.18)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
                        }}
                        style={{
                          width: 68,
                          height: 68,
                          borderRadius: 16,
                          border: '2px solid rgba(255,255,255,0.85)',
                          background: c.hex,
                          cursor: 'pointer',
                          transition: 'transform 160ms ease, box-shadow 160ms ease',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                          flexShrink: 0,
                        }}
                      />
                    ))}

                  {current.type === 'options' &&
                    current.options?.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => submit(opt.value)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--mood-accent, #c9a08a)';
                          e.currentTarget.style.background = '#fffdfb';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e8e2dc';
                          e.currentTarget.style.background = '#fff';
                        }}
                        style={{
                          padding: '0.95rem 1.5rem',
                          borderRadius: 999,
                          border: '1.5px solid #e8e2dc',
                          background: '#fff',
                          color: '#3d3530',
                          fontFamily: 'DM Sans, sans-serif',
                          fontSize: 16,
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'border-color 200ms, background 200ms',
                          lineHeight: 1.35,
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}

                  {current.type === 'text' && (
                    <div style={{ width: '100%' }}>
                      <input
                        type="text"
                        value={textVal}
                        onChange={(e) => setTextVal(e.target.value)}
                        placeholder={current.placeholder}
                        onKeyDown={(e) => e.key === 'Enter' && textVal.trim() && submit(textVal.trim())}
                        style={{
                          width: '100%',
                          padding: '1rem 1.25rem',
                          borderRadius: 14,
                          border: '1.5px solid #e0d8d0',
                          background: '#fdfbf9',
                          fontFamily: 'DM Sans, sans-serif',
                          fontSize: 17,
                          outline: 'none',
                          color: '#2d2520',
                          boxSizing: 'border-box',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => textVal.trim() && submit(textVal.trim())}
                        disabled={!textVal.trim()}
                        style={{
                          marginTop: 12,
                          padding: '0.7rem 1.6rem',
                          borderRadius: 999,
                          border: 'none',
                          background: textVal.trim() ? 'var(--mood-accent, #e08080)' : '#e8e2dc',
                          color: textVal.trim() ? '#fff' : '#9a8e84',
                          cursor: textVal.trim() ? 'pointer' : 'not-allowed',
                          fontFamily: 'DM Sans, sans-serif',
                          fontSize: 15,
                          fontWeight: 600,
                          transition: 'background 200ms',
                        }}
                      >
                        {t('Next →', 'अगाडि →')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="slide-enter" style={{ textAlign: 'center', padding: '0.5rem 0 0' }}>
                <p
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: 'clamp(1.35rem, 2.5vw, 1.75rem)',
                    color: 'var(--mood-accent, #e08080)',
                    lineHeight: 1.5,
                    margin: '0 0 14px',
                  }}
                >
                  {t('5 Decisions. Yours. Today.', '५ निर्णय। तपाईंका। आज।')}
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 99,
                        background: 'var(--mood-accent, #e08080)',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Why panel — aligned height, slightly larger type */}
        <div
          style={{
            background: 'var(--card, #fff)',
            borderRadius: 20,
            padding: '1.35rem 1.5rem',
            boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            minHeight: 300,
          }}
        >
          <p style={{ fontSize: 12, fontWeight: 600, color: '#8a7d72', letterSpacing: '0.1em', marginBottom: 10 }}>
            {t('Why this?', 'किन यसरी?')}
          </p>
          <p style={{ fontSize: 15, color: '#4a4039', lineHeight: 1.7, margin: 0 }}>
            {done
              ? t(
                  'You made 5 decisions today. This small sequence gives your mind stability.',
                  'तपाईंले आज ५ निर्णय लिनुभयो। यो सानो क्रमले तपाईंको मस्तिष्कलाई स्थिरता दिन्छ।',
                )
              : current.why ?? t('One decision at a time reduces pressure.', 'एक पटकमा एउटा निर्णयले दबाब घटाउँछ।')}
          </p>
          {!done && (
            <div style={{ marginTop: 'auto', paddingTop: '1.25rem' }}>
              <div style={{ padding: '1rem', background: 'linear-gradient(180deg, #fdf9f6 0%, #faf6f2 100%)', borderRadius: 12, border: '1px solid #f0e8e0' }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#a8988c', letterSpacing: '0.08em', marginBottom: 8 }}>{t('Progress', 'प्रगति')}</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        height: 6,
                        flex: 1,
                        borderRadius: 99,
                        background: i < step ? 'var(--mood-accent, #e08080)' : '#ebe4dc',
                        transition: 'background 400ms',
                      }}
                    />
                  ))}
                </div>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#6b5f56', marginTop: 10 }}>
                  {step} / 5 {t('done', 'पूरा भयो')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Put the CaseTracker BELOW the new layout per instructions */}
      <div style={{ marginTop: '3rem' }}>
        <CaseTracker />
      </div>
    </>
  );
};

export default TodayScreen;
