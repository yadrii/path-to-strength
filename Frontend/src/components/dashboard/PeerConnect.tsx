import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import {
  Flame,
  ShieldCheck,
  Sparkles,
  User,
  BookOpen,
  PenTool,
  Mic,
  MapPin,
  Send,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const API = "http://localhost:5001/api/chautara";

function getMainApiBase(): string {
  const fromEnv =
    import.meta.env.VITE_API_BASE_URL ??
    (import.meta.env.VITE_BACKEND_URL as string | undefined);
  const raw = (fromEnv || 'http://127.0.0.1:5000').replace(/\/$/, '');
  return raw.replace(/\/api\/?$/i, '');
}

const PeerConnect = () => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const [feed, setFeed] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [mode, setMode] = useState<'share' | 'read'>('share');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});

  // ---------- LOAD FEED ----------
  const loadFeed = async () => {
    try {
      const res = await fetch(`${API}/feed`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setFeed(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadFeed();
    const interval = setInterval(loadFeed, 3000);
    return () => clearInterval(interval);
  }, []);

  // ---------- VOICE ----------
  const startVoice = () => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'ne-NP';

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setText(prev => prev + " " + transcript);
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // ---------- RECORD ----------
  const transcribeBlob = useCallback(async (audioBlob: Blob) => {
    const base = getMainApiBase();
    const formData = new FormData();
    formData.append('file', audioBlob);

    setIsTranscribing(true);

    try {
      const res = await fetch(`${base}/stt/transcribe`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (data.transcript) {
        setText(prev => prev + " " + data.transcript);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTranscribing(false);
    }
  }, []);

  const toggleMic = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = e => audioChunksRef.current.push(e.data);

    recorder.onstop = async () => {
      const blob = new Blob(audioChunksRef.current);
      await transcribeBlob(blob);
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    audioChunksRef.current = [];
    setIsRecording(true);
  };

  // ---------- POST ----------
  const handlePost = async () => {
    if (!text.trim()) return;

    setLoading(true);

    try {
      await fetch(`${API}/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text })
      });

      setText("");
      setMode('read');
      await loadFeed();
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async (storyId: string) => {
    const content = commentInputs[storyId];
    if (!content?.trim()) return;

    await fetch(`${API}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ story_id: storyId, content })
    });

    setCommentInputs(prev => ({ ...prev, [storyId]: "" }));
    await loadFeed();
  };

  return (
    <div className="max-w-2xl mx-auto h-screen flex flex-col pb-10 px-4 overflow-hidden">

      {/* TOGGLE */}
      <div className="flex justify-center py-6">
        <div className="flex rounded-full border bg-white p-1 shadow-md">
          <Button onClick={() => setMode('share')} className="rounded-full px-6 text-xs">
            <PenTool className="h-3 w-3" /> Share
          </Button>
          <Button onClick={() => setMode('read')} className="rounded-full px-6 text-xs">
            <BookOpen className="h-3 w-3" /> Read
          </Button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 overflow-hidden">
        {mode === 'share' ? (
          <Card>
            <CardContent className="p-6 space-y-4">

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-4 border rounded-xl"
              />

              <div className="flex gap-2">
                <Button onClick={startVoice}>
                  <Mic />
                </Button>

                <Button onClick={toggleMic}>
                  {isTranscribing ? <Loader2 className="animate-spin" /> : <Mic />}
                </Button>

                <Button onClick={handlePost} disabled={loading}>
                  <Send /> Send
                </Button>
              </div>

            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="h-full">
            <div className="space-y-6 pb-20">
              {feed.map((story) => (
                <Card key={story.id}>
                  <CardContent className="p-6">

                    <p>{story.content}</p>

                    <div className="mt-4 flex gap-2">
                      <input
                        value={commentInputs[story.id] || ""}
                        onChange={(e) =>
                          setCommentInputs(prev => ({
                            ...prev,
                            [story.id]: e.target.value
                          }))
                        }
                        className="flex-1 border p-2 rounded"
                      />
                      <Button onClick={() => handleComment(story.id)}>
                        Send
                      </Button>
                    </div>

                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <div className="text-center text-xs pt-4">
        <ShieldCheck className="h-3 w-3 inline" /> Safe Space
      </div>
    </div>
  );
};

export default PeerConnect;