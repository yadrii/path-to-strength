import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { BookOpen } from 'lucide-react';

const LegalRights = () => {
  const { t } = useLanguage();

  const [open, setOpen] = useState(false);
  const [selectedRight, setSelectedRight] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // ✅ RIGHTS
  const rights = [
    {
      title: t('Right to Mental Healthcare', 'मानसिक स्वास्थ्य सेवाको अधिकार'),
      desc: t('Access mental health services in Nepal.', 'नेपालमा मानसिक स्वास्थ्य सेवा पाउने अधिकार।'),
      law: 'National Mental Health Policy 1996 & Constitution (Article 35)',
      context: 'mental_health_access',
    },
    {
      title: t('Right to Dignity & Equality', 'गरिमा र समानताको अधिकार'),
      desc: t('No discrimination based on mental health.', 'मानसिक स्वास्थ्यका आधारमा भेदभाव हुँदैन।'),
      law: 'Constitution of Nepal (Article 18)',
      context: 'mental_health_dignity',
    },
    {
      title: t('Right to Confidentiality', 'गोपनीयताको अधिकार'),
      desc: t('Your mental health data must remain private.', 'तपाईंको मानसिक स्वास्थ्य जानकारी गोप्य हुन्छ।'),
      law: 'Public Health Service Act 2018',
      context: 'mental_health_privacy',
    },
    {
      title: t('File Domestic Violence Complaint', 'घरेलु हिंसा उजुरी'),
      desc: t('Report abuse at any police station.', 'प्रहरीमा उजुरी दिन सकिन्छ।'),
      law: 'Domestic Violence Act 2066',
      context: 'dv_report',
    },
    {
      title: t('Protection Order', 'सुरक्षा आदेश'),
      desc: t('Court protection from abuser.', 'अदालतले सुरक्षा दिन सक्छ।'),
      law: 'Domestic Violence Act 2066 (Sec 6 & 7)',
      context: 'dv_protection',
    },
    {
      title: t('Free Legal Aid', 'निःशुल्क कानुनी सहायता'),
      desc: t('Free lawyer support if needed.', 'निःशुल्क वकिल पाइन्छ।'),
      law: 'Legal Aid Act 2054',
      context: 'legal_aid',
    },
  ];

  // 🔥 API CALL (FIXED)
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('http://localhost:8000/api/legal-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
      });

      const data = await res.json();

      const botMsg = {
        role: 'bot',
        text: data.reply || 'No response from server',
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      // 🔴 OFFLINE / ERROR FALLBACK
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: '⚠️ Unable to reach server. Please check backend or internet.',
        },
      ]);
    }

    setInput('');
  };

  // 🔹 CARD CLICK
  const handleCardClick = (right) => {
    setSelectedRight(right);
    setMessages([
      {
        role: 'bot',
        text: `You selected "${right.title}". (${right.law})\nAsk anything related to this right.`,
      },
    ]);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold">
          {t('Know Your Legal Rights', 'आफ्ना कानुनी अधिकार जान्नुहोस्')}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t(
            'Mental health and domestic violence rights in Nepal.',
            'नेपालमा मानसिक स्वास्थ्य र घरेलु हिंसा सम्बन्धी अधिकार।'
          )}
        </p>
      </div>

      {/* CARDS */}
      <div className="space-y-4">
        {rights.map((right, i) => (
          <Card
            key={i}
            onClick={() => handleCardClick(right)}
            className="cursor-pointer hover:shadow-md transition"
          >
            <CardContent className="p-5 flex gap-3">
              <BookOpen className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold">{right.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {right.desc}
                </p>

                <p className="text-xs text-primary mt-2 font-medium">
                  {t('Legal Basis:', 'कानुनी आधार:')} {right.law}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CHAT MODAL */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedRight?.title}</DialogTitle>
          </DialogHeader>

          {/* CHAT */}
          <div className="h-64 overflow-y-auto space-y-2 border p-3 rounded">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-sm ${
                  msg.role === 'user'
                    ? 'text-right text-blue-600'
                    : 'text-left text-gray-700'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div className="flex gap-2 mt-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your question..."
            />
            <Button onClick={handleSend}>Send</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LegalRights;