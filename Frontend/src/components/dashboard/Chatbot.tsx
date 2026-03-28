import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useRef } from 'react';
import { Send, Mic, MicOff, Bot, User, Loader2 } from 'lucide-react';

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
  
  // Voice recording state
  const [isListening, setIsListening] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleVoice = async () => {
    if (isListening) {
      // Stop recording
      if (mediaRecorder) {
        mediaRecorder.stop();
        setIsListening(false);
      }
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        audioChunks.current = [];

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.current.push(event.data);
          }
        };

        recorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
          stream.getTracks().forEach(track => track.stop());
          await processVoiceInput(audioBlob);
        };

        recorder.start();
        setMediaRecorder(recorder);
        setIsListening(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    }
  };

  const processVoiceInput = async (audioBlob: Blob) => {
    setIsProcessingVoice(true);
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");
    
    // Default to Nepali for STT as assumed, but you can add logic to switch
    formData.append("language_code", "ne-IN");

    try {
      const response = await fetch("http://localhost:8000/stt/transcribe", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Failed to transcribe audio");
      }
      
      const data = await response.json();
      if (data.transcript) {
        // Send the transcribed text through Groq automatically
        await handleSend(data.transcript); 
      }
    } catch (error) {
      console.error("Error with Speech-To-Text STT API:", error);
    } finally {
      setIsProcessingVoice(false);
    }
  };

  const handleSend = async (overrideText?: string | React.MouseEvent | React.KeyboardEvent) => {
    const textToSend = typeof overrideText === 'string' ? overrideText : input;
    if (!textToSend.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (typeof overrideText !== 'string') setInput('');
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:8000/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system_prompt: "You are a helpful companion. You must NOT act as a therapist. Do NOT use words that might harm or prescribe to patients. Be comforting and helpful with general advice.",
          messages: [
            ...messages.map(m => ({
              role: m.role === 'bot' ? 'assistant' : 'user',
              content: m.text
            })),
            {
              role: "user",
              content: textToSend
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error("Failed to connect to backend Chat API");
      }

      const data = await response.json();
      const botResponseText = data.choices?.[0]?.message?.content || "...";
      
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'bot', text: botResponseText }]);
    } catch (error) {
      console.error("Error calling Groq API:", error);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'bot', text: t("Sorry, I am having trouble connecting right now.", "माफ गर्नुहोस्, म अहिलै कनेक्ट गर्न समस्यामा छु।") }]);
    } finally {
      setIsTyping(false);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] min-h-[500px] w-full bg-background rounded-xl">
      <div className="mb-4 flex-shrink-0">
        <h2 className="text-2xl font-display font-bold text-foreground">{t('Sahara Assistant', 'सहारा सहायक')}</h2>
        <p className="text-muted-foreground text-sm">{t('Ask anything. I am here for you.', 'केही पनि सोध्नुहोस्। म तपाईंको लागि यहाँ छु।')}</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-2">
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
        {isProcessingVoice && (
          <div className="flex gap-3 justify-start">
             <div className="w-8 h-8 rounded-full bg-sage-light flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-primary" />
             </div>
             <div className="p-3 bg-muted text-foreground rounded-2xl rounded-bl-md text-sm flex items-center gap-2">
               <Loader2 className="h-4 w-4 animate-spin" /> {t('Transcribing your voice...', 'तपाईंको आवाज सुन्दै छु...')}
             </div>
          </div>
        )}
        {isTyping && !isProcessingVoice && (
          <div className="flex gap-3 justify-start">
             <div className="w-8 h-8 rounded-full bg-sage-light flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-primary" />
             </div>
             <div className="p-3 bg-muted text-foreground rounded-2xl rounded-bl-md text-sm flex items-center gap-2">
               <Loader2 className="h-4 w-4 animate-spin" /> {t('Typing...', 'टाइप गर्दै...')}
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2 mt-2 pt-4 border-t flex-shrink-0">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleVoice} 
          disabled={isProcessingVoice || isTyping}
          className={isListening ? 'text-destructive bg-destructive/10 animate-pulse' : 'text-muted-foreground'}
        >
          {isListening ? <MicOff className="h-5 w-5 fill-current" /> : <Mic className="h-5 w-5" />}
        </Button>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isListening || isProcessingVoice || isTyping}
          placeholder={isListening ? t('Listening...', 'सुन्दै छु...') : t('Type your message...', 'आफ्नो सन्देश टाइप गर्नुहोस्...')}
          className="flex-1"
        />
        <Button onClick={handleSend} disabled={isListening || isProcessingVoice || isTyping || !input.trim()} className="bg-primary text-primary-foreground hover:bg-primary/90" size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Chatbot;
