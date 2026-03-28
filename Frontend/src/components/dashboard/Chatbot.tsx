import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useRef } from 'react';
import { Send, Mic, MicOff, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
}

const Chatbot = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'bot', text: t('Namaste 🙏 I am Sahara, your companion. How can I help you today? You can ask me about your legal rights, safety planning, or just talk.', 'नमस्ते 🙏 म सहारा हुँ, तपाईंको साथी। आज म तपाईंलाई कसरी मद्दत गर्न सक्छु? तपाईं मलाई आफ्ना कानुनी अधिकार, सुरक्षा योजना, वा केही पनि बारेमा सोध्न सक्नुहुन्छ।') },
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const botResponses: Record<string, string> = {
    default: t('I hear you. Can you tell me more about what you need help with? I can assist with legal rights, safety planning, connecting with peers, or finding a therapist.', 'मैले सुनें। तपाईंलाई कुन कुरामा मद्दत चाहिन्छ भन्नुहोस्। म कानुनी अधिकार, सुरक्षा योजना, साथीहरूसँग जडान, वा थेरापिस्ट खोज्नमा मद्दत गर्न सक्छु।'),
    rights: t('Under Nepal\'s Domestic Violence Act 2066, you have the right to file a complaint, get a protection order, and receive free legal aid. Would you like to know more about any specific right?', 'नेपालको घरेलु हिंसा ऐन २०६६ अन्तर्गत, तपाईंलाई उजुरी दर्ता गर्ने, सुरक्षा आदेश पाउने, र निःशुल्क कानुनी सहायता प्राप्त गर्ने अधिकार छ।'),
    safety: t('Your safety is the priority. If you need to leave quickly, have your documents, phone, and a small bag ready. The Women Cell helpline is 1145. Shall I show you the full safety plan?', 'तपाईंको सुरक्षा प्राथमिकता हो। यदि तपाईंलाई छिटो जानु पर्छ भने, कागजात, फोन, र सानो झोला तयार राख्नुहोस्। महिला सेल हेल्पलाइन 1145 हो।'),
    scared: t('It is completely normal to feel scared. What you are going through is incredibly difficult, and your feelings are valid. You are not alone — there are women at the same stage who understand. Would you like to connect with a peer?', 'डराउनु पूर्ण रूपमा सामान्य हो। तपाईंले भोग्नुभइरहेको अत्यन्त कठिन छ, र तपाईंका भावनाहरू मान्य छन्। तपाईं एक्लो हुनुहुन्न।'),
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);

    const lower = input.toLowerCase();
    let response = botResponses.default;
    if (lower.includes('right') || lower.includes('law') || lower.includes('अधिकार')) response = botResponses.rights;
    else if (lower.includes('safe') || lower.includes('danger') || lower.includes('सुरक्षा')) response = botResponses.safety;
    else if (lower.includes('scar') || lower.includes('afraid') || lower.includes('डर')) response = botResponses.scared;

    setTimeout(() => {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'bot', text: response }]);
    }, 800);

    setInput('');
  };

  const toggleVoice = () => setIsListening(!isListening);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h2 className="text-2xl font-display font-bold text-foreground">{t('Sahara Assistant', 'सहारा सहायक')}</h2>
        <p className="text-muted-foreground text-sm">{t('Ask anything. I am here for you.', 'केही पनि सोध्नुहोस्। म तपाईंको लागि यहाँ छु।')}</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-sage-light flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-primary" />
              </div>
            )}
            <div className={`max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-muted text-foreground rounded-bl-md'}`}>
              {msg.text}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-terracotta-light flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-terracotta" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t">
        <Button variant="ghost" size="icon" onClick={toggleVoice} className={isListening ? 'text-destructive bg-destructive/10' : 'text-muted-foreground'}>
          {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={t('Type your message...', 'आफ्नो सन्देश टाइप गर्नुहोस्...')}
          className="flex-1"
        />
        <Button onClick={handleSend} className="bg-primary text-primary-foreground hover:bg-primary/90" size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Chatbot;
