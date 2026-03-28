import { useState, useEffect } from 'react';
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
  MapPin
} from 'lucide-react';

const API = "http://localhost:5001/api/chautara";

const PeerConnect = () => {
  const { toast } = useToast();

  const [feed, setFeed] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [mode, setMode] = useState<'share' | 'read'>('share');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ NEW: comment state
  const [commentInputs, setCommentInputs] = useState<{[key: string]: string}>({});

  // ---------- LOAD FEED ----------
  const loadFeed = async () => {
    try {
      const res = await fetch(`${API}/feed`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setFeed(data);
    } catch (e) {
      console.error("❌ Feed error:", e);
    }
  };

  useEffect(() => {
    loadFeed();
    const interval = setInterval(loadFeed, 3000);
    return () => clearInterval(interval);
  }, []);

  // ---------- VOICE INPUT ----------
  const startVoice = () => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition ||
      (window as any).SpeechRecognition;

    if (!SpeechRecognition) {
      alert("Mic not supported");
      return;
    }

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

  // ---------- POST STORY ----------
  const handlePost = async () => {
    if (!text.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(`${API}/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text })
      });

      if (!res.ok) throw new Error();

      setText("");
      setMode('read');

      toast({
        title: "Story Witnessed",
        description: "RAG matching you with sisters now."
      });

      await loadFeed();

    } catch {
      toast({
        title: "Error",
        description: "Failed to send message"
      });
    } finally {
      setLoading(false);
    }
  };

  // ---------- ✅ NEW: SEND COMMENT ----------
  const handleComment = async (storyId: string) => {
    const content = commentInputs[storyId];

    if (!content || !content.trim()) return;

    try {
      const res = await fetch(`${API}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          story_id: storyId,
          content
        })
      });

      if (!res.ok) {
        const err = await res.text();

        toast({
          title: "Blocked",
          description: err || "Only supportive messages allowed"
        });

        return;
      }

      setCommentInputs(prev => ({
        ...prev,
        [storyId]: ""
      }));

      toast({
        title: "Support Shared",
        description: "Your message was posted safely"
      });

      await loadFeed();

    } catch {
      toast({
        title: "Error",
        description: "Failed to send comment"
      });
    }
  };

  // ---------- UI ----------
  return (
    <div className="max-w-2xl mx-auto h-screen flex flex-col pb-10 px-4 overflow-hidden">

      {/* Toggle */}
      <div className="flex-none py-6 flex justify-center">
        <div className="bg-white p-1 rounded-full shadow-md border flex">
          <Button
            variant={mode === 'share' ? "default" : "ghost"}
            onClick={() => setMode('share')}
            className="rounded-full px-8 text-xs gap-2"
          >
            <PenTool className="h-3 w-3" /> Share Story
          </Button>

          <Button
            variant={mode === 'read' ? "default" : "ghost"}
            onClick={() => setMode('read')}
            className="rounded-full px-8 text-xs gap-2"
          >
            <BookOpen className="h-3 w-3" /> Read & Witness
          </Button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 overflow-hidden">
        {mode === 'share' ? (
          <Card className="bg-white rounded-[2.5rem] shadow-xl border-primary/10 overflow-hidden">
            <CardContent className="p-6 space-y-4">

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="यहाँ आफ्नो कथा लेख्नुहोस्..."
                className="w-full p-6 text-md border-none bg-primary/5 rounded-[2rem] min-h-[160px] outline-none shadow-inner"
              />

              <div className="flex gap-2">

                <Button
                  onClick={startVoice}
                  variant="outline"
                  className={`rounded-2xl h-14 w-20 ${
                    isListening
                      ? 'bg-red-50 text-red-500 animate-pulse'
                      : ''
                  }`}
                >
                  <Mic className="h-6 w-6" />
                </Button>

                <Button
                  onClick={handlePost}
                  disabled={loading}
                  className="flex-1 bg-primary h-14 rounded-2xl text-white font-bold text-lg shadow-lg"
                >
                  {loading ? "Sending..." : "Send to Chautara"}
                </Button>

              </div>
            </CardContent>
          </Card>

        ) : (
          <ScrollArea className="h-full pr-4">
            <div className="space-y-6 pb-20">

              {feed.map((story) => (
                <Card
                  key={story.id}
                  className="border-none shadow-md rounded-[2rem] bg-white p-8"
                >

                  {/* Header */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-xs font-bold text-primary italic">
                        Anonymous Sister
                        <MapPin className="h-3 w-3 inline ml-1 opacity-30" />
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-orange-500 text-xs font-bold">
                      <Flame className="h-4 w-4" />
                      {story.diyas} Diyas
                    </div>
                  </div>

                  {/* Story */}
                  <p className="text-lg font-serif italic leading-relaxed text-foreground/90">
                    "{story.content}"
                  </p>

                  {/* Replies */}
                  <div className="mt-6 pt-4 border-t border-dashed border-primary/10 space-y-3">
                    {story.replies?.map((r: any) => (
                      <div
                        key={r.id}
                        className="bg-primary/5 p-4 rounded-2xl text-xs italic text-foreground/60 border border-white"
                      >
                        <div className="text-[9px] font-bold text-primary mb-1 opacity-40 uppercase tracking-widest flex items-center gap-1">
                          <Sparkles className="h-2 w-2" /> {r.author}
                        </div>
                        "{r.content}"
                      </div>
                    ))}
                  </div>

                  {/* ✅ COMMENT BOX (ONLY ADDITION) */}
                  <div className="mt-4 flex gap-2">
                    <input
                      value={commentInputs[story.id] || ""}
                      onChange={(e) =>
                        setCommentInputs(prev => ({
                          ...prev,
                          [story.id]: e.target.value
                        }))
                      }
                      placeholder="Send supportive reply..."
                      className="flex-1 p-3 rounded-2xl border border-primary/10 bg-primary/5 text-sm outline-none"
                    />

                    <Button
                      onClick={() => handleComment(story.id)}
                      className="rounded-2xl px-4"
                    >
                      Send
                    </Button>
                  </div>

                </Card>
              ))}

            </div>
          </ScrollArea>
        )}
      </div>

      {/* Footer */}
      <div className="flex-none text-center opacity-30 text-[9px] font-bold uppercase tracking-widest pt-4 flex items-center justify-center gap-2">
        <ShieldCheck className="h-3 w-3" />
        Anonymous Sanctuary • Powered by RAG
      </div>
    </div>
  );
};

export default PeerConnect;