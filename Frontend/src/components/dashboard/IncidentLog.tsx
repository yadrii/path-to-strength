import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiClient } from '@/services/apiClient';
import { useToast } from '@/hooks/use-toast';

interface Incident {
  id: string;
  date: string;
  type: string;
  description: string;
  supportMessage: string;
  userName: string;
  isAnonymous: boolean;
  status: 'pending' | 'in_progress' | 'resolved';
  createdAt: string;
}

interface IncidentLogProps {
  filter?: 'all' | 'anonymous' | 'registered';
}

const IncidentLog: React.FC<IncidentLogProps> = ({ filter = 'all' }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [incidentType, setIncidentType] = useState('');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const response = await apiClient.getIncidents();
      if (response.success) {
        setIncidents(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch incidents:', error);
      toast({
        title: t('Error', 'त्रुटि'),
        description: t('Failed to load incidents', 'घटनाहरू लोड गर्न असफल'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!incidentType || !description.trim()) {
      toast({
        title: t('Error', 'त्रुटि'),
        description: t('Please fill in all fields', 'सबै क्षेत्रहरू भर्नुहोस्'),
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await apiClient.createIncident({
        type: incidentType,
        description: description.trim(),
        isAnonymous,
      });

      if (response.success) {
        setIncidents(prev => [response.data, ...prev]);
        setIncidentType('');
        setDescription('');
        setIsAnonymous(false);
        setShowForm(false);
        toast({
          title: t('Success', 'सफलता'),
          description: t('Incident logged successfully', 'घटना सफलतापूर्वक दर्ता गरियो'),
        });
      }
    } catch (error) {
      console.error('Failed to create incident:', error);
      toast({
        title: t('Error', 'त्रुटि'),
        description: t('Failed to log incident', 'घटना दर्ता गर्न असफल'),
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (incidentId: string, newStatus: 'pending' | 'in_progress' | 'resolved') => {
    try {
      const response = await apiClient.updateIncidentStatus(incidentId, newStatus);
      if (response.success) {
        setIncidents((prev) => prev.map((incident) =>
          incident.id === incidentId ? { ...incident, status: response.data.status } : incident
        ));
        toast({
          title: t('Success', 'सफलता'),
          description: t('Incident status updated', 'घटनाको स्थिति अद्यावधिक गरियो'),
        });
      }
    } catch (err) {
      console.error('Failed to update incident status:', err);
      toast({
        title: t('Error', 'त्रुटि'),
        description: t('Failed to update status', 'स्थिति अद्यावधिक गर्न असफल'),
        variant: 'destructive',
      });
    }
  };

  const supportMessages: Record<string, string> = {
    court_delay: t('Another delay. Your frustration is valid. This is documented and it matters.', 'अर्को ढिलाइ। तपाईंको निराशा मान्य छ।'),
    police_dismissal: t('Being dismissed is painful. You deserve to be heard. We hear you.', 'अस्वीकार हुनु पीडादायक छ। तपाईं सुनिनु योग्य हुनुहुन्छ।'),
    threat: t('Your safety comes first. Consider reaching out to the safety planning module.', 'तपाईंको सुरक्षा पहिलो हो। सुरक्षा योजना मोड्युलमा सम्पर्क गर्नुहोस्।'),
    other: t('Whatever you are feeling right now is valid. You are not alone.', 'तपाईंले अहिले जे महसुस गरिरहनु भएको छ त्यो मान्य छ।'),
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">{t('Incident Log', 'घटना लग')}</h2>
            <p className="text-muted-foreground text-sm">{t('Loading incidents...', 'घटनाहरू लोड हुँदैछ...')}</p>
          </div>
        </div>
      </div>
    );
  }

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
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('Describe what happened in your own words...', 'आफ्नै शब्दमा वर्णन गर्नुहोस्...')}
              rows={4}
            />
            {incidentType && (
              <div className="p-4 rounded-lg bg-sage-light border border-primary/20">
                <div className="flex gap-2 items-start">
                  <Heart className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground/80 italic">{supportMessages[incidentType]}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                id="anonymous"
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="anonymous" className="text-sm text-foreground">
                {t('Submit anonymously', 'अनामतामा पठाउनुहोस्')}
              </label>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-hero text-sm"
            >
              {submitting ? t('Saving...', 'सुरक्षित गर्दै...') : t('Save', 'सुरक्षित गर्नुहोस्')}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {(() => {
          const filteredIncidents = incidents.filter(incident => {
            if (filter === 'anonymous') return incident.isAnonymous;
            if (filter === 'registered') return !incident.isAnonymous;
            return true;
          });
          return filteredIncidents.map((incident) => (
          <Card key={incident.id} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-foreground">{incident.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {incident.isAnonymous ? t('Raised anonymously', 'अनामिक रूपमा दर्ता गरियो') : `${t('Raised by', 'दर्ता गरेको')} ${incident.userName}`}
                  </p>
                </div>
                <div className="text-right text-xs text-muted-foreground shrink-0">
                  <div>{incident.date}</div>
                  <div className="text-primary font-medium">{incident.status.replace('_', ' ')}</div>
                </div>
              </div>

              {user?.role === 'ngo' && (
                <div className="mb-2">
                  <label className="text-xs text-muted-foreground mr-2">{t('Update status', 'स्थिति अद्यावधिक')}</label>
                  <select
                    value={incident.status}
                    onChange={(e) => handleStatusChange(incident.id, e.target.value as 'pending' | 'in_progress' | 'resolved')}
                    className="text-xs border rounded px-2 py-1"
                  >
                    <option value="pending">{t('Pending', 'प्रतीक्षारत')}</option>
                    <option value="in_progress">{t('In Progress', 'प्रगतिको क्रममा')}</option>
                    <option value="resolved">{t('Resolved', 'समाधान')}</option>
                  </select>
                </div>
              )}

              {/* Support Message */}
              <div className="p-3 rounded-lg bg-sage-light border border-primary/10 mt-2">
                <div className="flex gap-2 items-start">
                  <Heart className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground/80 italic">{incident.supportMessage}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ));
        })()}
      </div>
    </div>
  );
};

export default IncidentLog;
