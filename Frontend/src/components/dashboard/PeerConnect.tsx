import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Flame, ShieldCheck, Sparkles, User, BookOpen, PenTool, Mic, MapPin, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const API = "http://127.0.0.1:5001/api/chautara";

/** Main API (main.py) — STT lives here, not on Chautara port 5001 */
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
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const loadFeed = async () => {
    try {
      const res = await fetch(`${API}/feed`);
      if (res.ok) setFeed(await res.json());
    } catch (e) { console.error("Sync error"); }
  };

  useEffect(() => {
    loadFeed();
    const interval = setInterval(loadFeed, 3000); 
    return () => clearInterval(interval);
  }, []);

  const transcribeBlob = useCallback(
    async (audioBlob: Blob) => {
      const base = getMainApiBase();
      const type = audioBlob.type || '';
      const ext = type.includes('mp4') ? 'm4a' : type.includes('ogg') ? 'ogg' : 'webm';
      const formData = new FormData();
      formData.append('file', audioBlob, `recording.${ext}`);
      formData.append('language_code', 'ne-IN');

      setIsTranscribing(true);
      try {

        const response = await fetch(`${base}/stt/transcribe`, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          const errText = await response.text().catch(() => response.statusText);
          throw new Error(errText || `HTTP ${response.status}`);
        }
        const data = (await response.json()) as { transcript?: string };
        const t = (data.transcript || '').trim();
        if (t) {
          setText((prev) => (prev ? `${prev.trim()} ${t}` : t));
          toast({ title: 'Voice added', description: 'Text from your recording was added to the story.' });
        } else {
          toast({
            title: 'No speech detected',
            description: 'Try speaking closer to the mic or check your Sarvam API key on the server.',
            variant: 'destructive',
          });
        }
      } catch (e) {
        console.error('PeerConnect STT:', e);
        toast({
          title: 'Could not transcribe',
          description:
            e instanceof Error
              ? e.message.slice(0, 120)
              : 'Is main.py running on port 5000 with SARVAM_API_KEY set?',
          variant: 'destructive',
        });
      } finally {
        setIsTranscribing(false);
      }
    },
    [toast],
  );

  const stopRecording = useCallback(() => {
    const rec = mediaRecorderRef.current;
    if (rec && rec.state !== 'inactive') {
      rec.stop();
    }
    mediaRecorderRef.current = null;
    setIsRecording(false);
  }, []);

  const toggleMic = async () => {
    if (isTranscribing) return;

    if (isRecording) {
      stopRecording();
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      toast({
        title: 'Microphone not available',
        description: 'This browser does not support recording, or the page is not served over HTTPS.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mimeCandidates = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
      ];
      const mimeType = mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m)) || '';
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) audioChunksRef.current.push(ev.data);
      };

      recorder.onstop = async () => {
        const chunks = audioChunksRef.current;
        const blobType = recorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(chunks, { type: blobType });
        stream.getTracks().forEach((track) => track.stop());
        if (audioBlob.size > 0) {
          await transcribeBlob(audioBlob);
        } else {
          toast({
            title: 'Empty recording',
            description: 'No audio was captured. Try again and speak after the mic turns red.',
            variant: 'destructive',
          });
        }
      };

      recorder.start(250);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error('getUserMedia:', err);
      toast({
        title: 'Microphone blocked',
        description: 'Allow microphone access for this site in your browser settings.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    return () => {
      const rec = mediaRecorderRef.current;
      if (rec && rec.state !== 'inactive') {
        rec.stream.getTracks().forEach((t) => t.stop());
        try {
          rec.stop();
        } catch {
          /* ignore */
        }
      }
      mediaRecorderRef.current = null;
    };
  }, []);

  const handlePost = async () => {
    if (!text.trim()) return;
    await fetch(`${API}/post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text })
    });
    setText("");
    setMode('read');
    toast({ title: "Story Witnessed", description: "RAG matching you with sisters now." });
  };

  return (
    <div className="max-w-2xl mx-auto h-screen flex flex-col pb-10 px-4 overflow-hidden">
      <div className="flex-none px-2 pt-4 text-center">
        <p className="text-sm font-medium text-foreground">
          {t('Chautari — quiet presence', 'चौतारी — शान्त उपस्थिति')}
        </p>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
          {t(
            'A shared space without having to start a conversation. Light a diya, leave a short pebble, or witness others quietly.',
            'कुरा सुरु नगरी पनि साझा ठाउँ। दिया बाल्नुहोस्, छोटो ढुङ्गो छोड्नुहोस्, वा चुपचाप साक्षी बन्नुहोस्।',
          )}
        </p>
      </div>
      <div className="flex-none py-6 flex justify-center">
        <div
          className="flex rounded-full border border-border bg-white p-1 shadow-md"
          role="tablist"
          aria-label={t('Chautara mode', 'चौतारी मोड')}
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'share'}
            onClick={() => setMode('share')}
            className={cn(
              'inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-xs font-semibold transition-colors sm:px-8',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-dark focus-visible:ring-offset-2',
              mode === 'share'
                ? 'bg-sage-dark text-white shadow-sm'
                : 'text-foreground hover:bg-muted/70',
            )}
          >
            <PenTool className="h-3.5 w-3.5 shrink-0 text-current" aria-hidden />
            Share Story
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'read'}
            onClick={() => setMode('read')}
            className={cn(
              'inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-xs font-semibold transition-colors sm:px-8',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-dark focus-visible:ring-offset-2',
              mode === 'read'
                ? 'bg-sage-dark text-white shadow-sm'
                : 'text-foreground hover:bg-muted/70',
            )}
          >
            <BookOpen className="h-3.5 w-3.5 shrink-0 text-current" aria-hidden />
            Read & Witness
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {mode === 'share' ? (
          <Card className="bg-white rounded-[2.5rem] shadow-xl border-primary/10 overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <textarea 
                value={text} onChange={(e) => setText(e.target.value)}
                placeholder="यहाँ आफ्नो कथा लेख्नुहोस्..."
                className="w-full p-6 text-md border-none bg-primary/5 rounded-[2rem] min-h-[160px] outline-none shadow-inner"
              />
              <div className="flex flex-row gap-3 items-stretch min-h-0">
                <Button
                  type="button"
                  onClick={() => void toggleMic()}
                  disabled={isTranscribing}
                  variant="outline"
                  className={`shrink-0 rounded-2xl h-14 w-14 sm:w-20 border-2 border-border ${
                    isRecording ? 'bg-red-50 text-red-600 border-red-200 animate-pulse' : 'bg-background'
                  }`}
                  aria-label={isRecording ? 'Stop recording and transcribe' : 'Start voice recording'}
                  aria-pressed={isRecording}
                >
                  {isTranscribing ? (
                    <Loader2 className="h-6 w-6 shrink-0 animate-spin" aria-hidden />
                  ) : (
                    <Mic className="h-6 w-6 shrink-0" />
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={handlePost}
                  className="min-w-0 flex-1 h-14 rounded-2xl font-bold text-base sm:text-lg shadow-md border-2 border-sage-dark/40 bg-sage-dark text-white hover:bg-sage-dark/90 hover:text-white focus-visible:ring-2 focus-visible:ring-sage-dark focus-visible:ring-offset-2 inline-flex items-center justify-center gap-2 px-4"
                >
                  <Send className="h-5 w-5 shrink-0 text-white" aria-hidden />
                  <span className="truncate text-white">Send to Chautara</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="h-full pr-4">
            <div className="space-y-6 pb-20">
              {feed.map((story) => (
                <Card key={story.id} className="border-none shadow-md rounded-[2rem] bg-white p-8 group transition-all">
                  <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                          <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center"><User className="h-4 w-4 text-primary" /></div>
                          <span className="text-xs font-bold text-primary italic">Anonymous Sister <MapPin className="h-3 w-3 inline ml-1 opacity-30" /></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-orange-500 text-xs font-bold">
                        <Flame className={`h-4 w-4 ${story.diyas > 0 ? 'fill-orange-500 animate-pulse' : ''}`} /> {story.diyas} Diyas
                      </div>
                  </div>
                  <p className="text-lg font-serif italic leading-relaxed text-foreground/90">"{story.content}"</p>
                  <div className="mt-6 pt-4 border-t border-dashed border-primary/10 space-y-3">
                    {story.replies?.map((r: any) => (
                      <div key={r.id} className="bg-primary/5 p-4 rounded-2xl text-xs italic text-foreground/60 border border-white">
                        <div className="text-[9px] font-bold text-primary mb-1 opacity-40 uppercase tracking-widest flex items-center gap-1">
                          <Sparkles className="h-2 w-2" /> {r.author}
                        </div>
                        "{r.content}"
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <div className="flex-none text-center opacity-30 text-[9px] font-bold uppercase tracking-widest pt-4 flex items-center justify-center gap-2">
        <ShieldCheck className="h-3 w-3" /> Anonymous Sanctuary • Powered by RAG
      </div>
    </div>
  );
};

export default PeerConnect;