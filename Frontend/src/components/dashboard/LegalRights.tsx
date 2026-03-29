import { useState, useEffect, useRef } from 'react';
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

  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 🧠 ENHANCED Q&A + DEFINITIONS
  const qaDB = {
    mental_health_access: {
      definition:
        'Mental healthcare includes services for diagnosis, treatment, and prevention of mental health conditions.',
      qa: [
        {
          questions: ['what does the right to mental healthcare include'],
          answer:
            'It includes access to mental health services, treatment, and support without discrimination.',
        },
        {
          questions: ['who can access mental healthcare'],
          answer:
            'Every citizen has the right to access mental healthcare services.',
        },
        {
          questions: ['is mental healthcare free'],
          answer:
            'Basic healthcare services should be accessible and affordable.',
        },
        {
          questions: ['can i be denied mental health treatment'],
          answer:
            'No, denying essential mental healthcare may violate your rights.',
        },
        {
          questions: ['cannot access mental health services'],
          answer:
            'You can approach government hospitals, NGOs, or file a complaint.',
        },
      ],
    },

    mental_health_dignity: {
      definition:
        'Equality ensures all individuals are treated fairly without discrimination.',
      qa: [
        {
          questions: ['what does equality mean'],
          answer:
            'It ensures equal protection under the law and prohibits discrimination.',
        },
        {
          questions: ['discrimination mental health'],
          answer:
            'No, discrimination based on mental health is a violation.',
        },
        {
          questions: ['workplace equality'],
          answer:
            'Yes, employers must treat individuals equally.',
        },
        {
          questions: ['face discrimination'],
          answer:
            'You can file a complaint or seek legal aid.',
        },
        {
          questions: ['everyone protected'],
          answer:
            'Yes, all individuals are entitled to equal protection.',
        },
      ],
    },

    mental_health_privacy: {
      definition:
        'Confidentiality means your medical and personal data must remain private.',
      qa: [
        {
          questions: ['what is confidentiality'],
          answer:
            'Your personal and medical information must be kept private.',
        },
        {
          questions: ['doctor share records'],
          answer:
            'No, doctors cannot share records without consent.',
        },
        {
          questions: ['data leak'],
          answer:
            'You can file a complaint against the responsible party.',
        },
        {
          questions: ['mental health data protected'],
          answer:
            'Yes, mental health data is protected like any medical data.',
        },
        {
          questions: ['family access records'],
          answer:
            'No, consent is required unless legally mandated.',
        },
      ],
    },

    dv_report: {
      definition:
        'Domestic violence includes physical, emotional, sexual, or economic abuse within a household.',
      qa: [
        {
          questions: ['what is domestic violence', 'define domestic violence'],
          answer:
            'Domestic violence includes physical, emotional, sexual, or economic abuse within a household.',
        },
        {
          questions: ['where report domestic violence'],
          answer:
            'You can report it at the nearest police station.',
        },
        {
          questions: ['proof needed'],
          answer:
            'Evidence helps, but you can file based on your statement.',
        },
        {
          questions: ['abuse without injury'],
          answer:
            'Yes, non-physical abuse is also recognized.',
        },
        {
          questions: ['after complaint'],
          answer:
            'Police may investigate and take legal action.',
        },
        {
          questions: ['someone else report'],
          answer:
            'Yes, a family member or concerned person can report.',
        },
      ],
    },

    dv_protection: {
      definition:
        'A protection order is a legal order preventing an abuser from contacting or harming a victim.',
      qa: [
        {
          questions: ['what is protection order'],
          answer:
            'It prevents the abuser from contacting or harming you.',
        },
        {
          questions: ['how apply protection order'],
          answer:
            'You can apply through the court.',
        },
        {
          questions: ['immediate protection'],
          answer:
            'Courts may issue temporary protection quickly.',
        },
        {
          questions: ['violate protection order'],
          answer:
            'Violating it leads to legal penalties.',
        },
        {
          questions: ['need lawyer'],
          answer:
            'Not mandatory; legal aid is available.',
        },
      ],
    },

    legal_aid: {
      definition:
        'Legal aid provides free legal services to individuals who cannot afford them.',
      qa: [
        {
          questions: ['who eligible legal aid'],
          answer:
            'People who cannot afford legal services are eligible.',
        },
        {
          questions: ['how apply legal aid'],
          answer:
            'Apply through legal aid offices or NGOs.',
        },
        {
          questions: ['services legal aid'],
          answer:
            'Includes legal advice and court representation.',
        },
        {
          questions: ['legal aid domestic violence'],
          answer:
            'Yes, victims can access free support.',
        },
        {
          questions: ['documents required'],
          answer:
            'Proof of income may be required.',
        },
      ],
    },
  };

  // 🧠 IMPROVED MATCHING ENGINE
  const getBotResponse = (query, right) => {
    if (!right) return 'Please select a legal topic first.';

    const q = query.toLowerCase();
    const data = qaDB[right.context];

    // 1️⃣ Exact / semantic match
    for (const item of data.qa) {
      if (item.questions.some((ques) => q.includes(ques))) {
        return `${item.answer} (Legal Basis: ${right.law})`;
      }
    }

    // 2️⃣ Definition fallback
    if (q.includes('what is') || q.includes('define')) {
      return `${data.definition} (Legal Basis: ${right.law})`;
    }

    // 3️⃣ Keyword scoring (smarter fallback)
    let bestMatch = null;
    let maxScore = 0;

    for (const item of data.qa) {
      let score = 0;
      for (const word of item.questions.join(' ').split(' ')) {
        if (q.includes(word)) score++;
      }
      if (score > maxScore) {
        maxScore = score;
        bestMatch = item;
      }
    }

    if (bestMatch) {
      return `${bestMatch.answer} (Legal Basis: ${right.law})`;
    }

    return `${data.definition} (Legal Basis: ${right.law})`;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    const botMsg = {
      role: 'bot',
      text: getBotResponse(input, selectedRight),
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput('');
  };

  const handleCardClick = (right) => {
    setSelectedRight(right);
    setMessages([
      {
        role: 'bot',
        text: `You selected "${right.title}". Ask your question.`,
      },
    ]);
    setOpen(true);
  };

  const rights = [
    {
      title: 'Right to Mental Healthcare',
      desc: 'Access mental health services in Nepal.',
      law: 'Article 35 of Constitution of Nepal',
      context: 'mental_health_access',
    },
    {
      title: 'Right to Equality',
      desc: 'Equal protection and no discrimination.',
      law: 'Article 18 of Constitution of Nepal',
      context: 'mental_health_dignity',
    },
    {
      title: 'Right to Confidentiality',
      desc: 'Your mental health data must remain private.',
      law: 'Public Health Service Act 2018',
      context: 'mental_health_privacy',
    },
    {
      title: 'File Domestic Violence Complaint',
      desc: 'Report abuse at any police station.',
      law: 'Domestic Violence Act 2066',
      context: 'dv_report',
    },
    {
      title: 'Protection Order',
      desc: 'Court protection from abuser.',
      law: 'Domestic Violence Act 2066',
      context: 'dv_protection',
    },
    {
      title: 'Free Legal Aid',
      desc: 'Free lawyer support if needed.',
      law: 'Legal Aid Act 2054',
      context: 'legal_aid',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Know Your Legal Rights</h2>

      <div className="space-y-4">
        {rights.map((right, i) => (
          <Card key={i} onClick={() => handleCardClick(right)} className="cursor-pointer">
            <CardContent className="p-5 flex gap-3">
              <BookOpen className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold">{right.title}</h3>
                <p className="text-sm text-muted-foreground">{right.desc}</p>
                <p className="text-xs text-primary mt-2">{right.law}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedRight?.title}</DialogTitle>
          </DialogHeader>

          {/* 💬 CHAT UI */}
          <div className="h-64 overflow-y-auto space-y-3 border p-3 bg-muted/30 rounded-lg">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-br-md'
                      : 'bg-white text-gray-800 border rounded-bl-md'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatRef} />
          </div>

          <div className="flex gap-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} />
            <Button onClick={handleSend}>Send</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LegalRights;