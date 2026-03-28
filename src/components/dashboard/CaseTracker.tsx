import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, FileText, Plus, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface CaseEvent {
  id: string;
  date: string;
  type: 'court' | 'police' | 'document' | 'milestone';
  title: string;
  status: 'completed' | 'upcoming' | 'delayed';
  emotionalNote?: string;
}

const CaseTracker = () => {
  const { t } = useLanguage();

  const [events] = useState<CaseEvent[]>([
    { id: '1', date: '2024-01-15', type: 'police', title: t('FIR Filed', 'प्रथम सूचना दर्ता'), status: 'completed' },
    { id: '2', date: '2024-03-20', type: 'court', title: t('First Hearing', 'पहिलो सुनुवाइ'), status: 'completed' },
    { id: '3', date: '2024-06-10', type: 'court', title: t('Second Hearing — Postponed', 'दोस्रो सुनुवाइ — स्थगित'), status: 'delayed', emotionalNote: t("This is the 2nd postponement. It's okay to feel frustrated. Many women at this stage feel the same exhaustion.", 'यो दोस्रो स्थगन हो। निराश महसुस गर्नु ठीक छ। यस चरणमा धेरै महिलाहरूले उस्तै थकान महसुस गर्छन्।') },
    { id: '4', date: '2024-09-15', type: 'court', title: t('Rescheduled Hearing', 'पुन: तालिका सुनुवाइ'), status: 'upcoming' },
  ]);

  const statusColors = {
    completed: 'bg-primary/10 text-primary',
    upcoming: 'bg-gold-warm/20 text-foreground',
    delayed: 'bg-destructive/10 text-destructive',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">
            {t('Your Case Journey', 'तपाईंको मुद्दाको यात्रा')}
          </h2>
          <p className="text-muted-foreground text-sm">{t('Every step forward counts', 'हरेक अगाडिको कदम मायने राख्छ')}</p>
        </div>
        <Button className="btn-hero text-sm px-4 py-2 gap-2">
          <Plus className="h-4 w-4" />
          {t('Add Event', 'घटना थप्नुहोस्')}
        </Button>
      </div>

      {/* Timeline */}
      <div className="relative space-y-4">
        {events.map((event, i) => (
          <div key={event.id} className="relative pl-8">
            {i < events.length - 1 && (
              <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-border" />
            )}
            <div className={`absolute left-0 top-2 w-8 h-8 rounded-full flex items-center justify-center ${event.status === 'completed' ? 'bg-primary text-primary-foreground' : event.status === 'delayed' ? 'bg-destructive text-destructive-foreground' : 'bg-muted text-muted-foreground'}`}>
              {event.type === 'court' ? <Calendar className="h-4 w-4" /> : event.type === 'police' ? <FileText className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
            </div>
            <Card className="ml-4 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-foreground">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                  <Badge className={statusColors[event.status]}>
                    {t(event.status.charAt(0).toUpperCase() + event.status.slice(1), event.status === 'completed' ? 'सम्पन्न' : event.status === 'delayed' ? 'ढिलो' : 'आगामी')}
                  </Badge>
                </div>
                {event.emotionalNote && (
                  <div className="mt-3 p-3 rounded-lg bg-terracotta-light border border-terracotta/20">
                    <div className="flex gap-2 items-start">
                      <AlertTriangle className="h-4 w-4 text-terracotta mt-0.5 shrink-0" />
                      <p className="text-sm text-foreground/80 italic">{event.emotionalNote}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaseTracker;
