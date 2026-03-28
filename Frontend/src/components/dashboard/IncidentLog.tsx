import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Heart } from 'lucide-react';
import { useState } from 'react';

interface Incident {
  id: string;
  date: string;
  type: string;
  description: string;
  supportMessage: string;
}

const IncidentLog = () => {
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [incidentType, setIncidentType] = useState('');
  const [description, setDescription] = useState('');

  const [incidents] = useState<Incident[]>([
    {
      id: '1', date: '2024-06-10', type: 'court_delay',
      description: t('Hearing postponed again. Judge was absent.', 'सुनुवाइ फेरि स्थगित। न्यायाधीश अनुपस्थित।'),
      supportMessage: t('Court delays are exhausting. Your patience is strength, not weakness.', 'अदालतको ढिलाइ थकित हुन्छ। तपाईंको धैर्य शक्ति हो, कमजोरी होइन।'),
    },
    {
      id: '2', date: '2024-05-02', type: 'police_dismissal',
      description: t('Officer said to "go home and sort it out"', 'अधिकारीले "घर जाऊ र मिलाऊ" भने'),
      supportMessage: t('Being dismissed by those meant to protect you is deeply painful. Your experience is valid. This is documented.', 'तपाईंलाई सुरक्षा दिनुपर्नेहरूले अस्वीकार गर्नु गहिरो पीडादायक छ। तपाईंको अनुभव मान्य छ।'),
    },
  ]);

  const supportMessages: Record<string, string> = {
    court_delay: t('Another delay. Your frustration is valid. This is documented and it matters.', 'अर्को ढिलाइ। तपाईंको निराशा मान्य छ।'),
    police_dismissal: t('Being dismissed is painful. You deserve to be heard. We hear you.', 'अस्वीकार हुनु पीडादायक छ। तपाईं सुनिनु योग्य हुनुहुन्छ।'),
    threat: t('Your safety comes first. Consider reaching out to the safety planning module.', 'तपाईंको सुरक्षा पहिलो हो। सुरक्षा योजना मोड्युलमा सम्पर्क गर्नुहोस्।'),
    other: t('Whatever you are feeling right now is valid. You are not alone.', 'तपाईंले अहिले जे महसुस गरिरहनु भएको छ त्यो मान्य छ।'),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">{t('Incident Log', 'घटना लग')}</h2>
          <p className="text-muted-foreground text-sm">{t('Document what happened. Your voice matters.', 'के भयो दर्ता गर्नुहोस्। तपाईंको आवाज महत्त्वपूर्ण छ।')}</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="btn-hero text-sm px-4 py-2 gap-2">
          <Plus className="h-4 w-4" />
          {t('Log Incident', 'घटना दर्ता')}
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/20">
          <CardContent className="p-6 space-y-4">
            <Select value={incidentType} onValueChange={setIncidentType}>
              <SelectTrigger><SelectValue placeholder={t('What happened?', 'के भयो?')} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="court_delay">{t('Court Delay/Postponement', 'अदालत ढिलाइ/स्थगन')}</SelectItem>
                <SelectItem value="police_dismissal">{t('Police Dismissal', 'प्रहरी अस्वीकार')}</SelectItem>
                <SelectItem value="threat">{t('Received Threat', 'धम्की प्राप्त')}</SelectItem>
                <SelectItem value="other">{t('Other', 'अन्य')}</SelectItem>
              </SelectContent>
            </Select>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('Describe what happened in your own words...', 'आफ्नै शब्दमा वर्णन गर्नुहोस्...')} rows={4} />
            {incidentType && (
              <div className="p-4 rounded-lg bg-sage-light border border-primary/20">
                <div className="flex gap-2 items-start">
                  <Heart className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground/80 italic">{supportMessages[incidentType]}</p>
                </div>
              </div>
            )}
            <Button className="btn-hero text-sm">{t('Save', 'सुरक्षित गर्नुहोस्')}</Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {incidents.map((inc) => (
          <Card key={inc.id} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium text-foreground">{inc.description}</p>
                <span className="text-xs text-muted-foreground shrink-0">{inc.date}</span>
              </div>
              <div className="p-3 rounded-lg bg-sage-light border border-primary/10 mt-2">
                <div className="flex gap-2 items-start">
                  <Heart className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground/80 italic">{inc.supportMessage}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default IncidentLog;
