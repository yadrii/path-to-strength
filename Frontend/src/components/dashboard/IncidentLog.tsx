import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Heart, Loader2, CheckCircle2, RotateCcw } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { format, formatDistanceToNow } from 'date-fns';
import {
  createIncident,
  fetchIncidents,
  getTokenFromStorage,
  updateIncidentStatus,
  type IncidentDto,
} from '@/lib/incidentsApi';
import { cn } from '@/lib/utils';
import { CaseProgressStrip } from '@/components/dashboard/CaseProgressStrip';
import { progressLabel, unitLabel } from '@/lib/incidentMeta';

const IncidentLog = () => {
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [incidentType, setIncidentType] = useState('');
  const [description, setDescription] = useState('');
  const [anonymousToNgo, setAnonymousToNgo] = useState(false);
  const [incidents, setIncidents] = useState<IncidentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadList = useCallback(async () => {
    const token = getTokenFromStorage();
    if (!token) {
      setIncidents([]);
      setLoading(false);
      return;
    }
    setLoadError(null);
    setLoading(true);
    try {
      const rows = await fetchIncidents(token, 'all', statusFilter);
      setIncidents(rows);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : t('Could not load incidents', 'घटना लोड गर्न सकिएन'));
    } finally {
      setLoading(false);
    }
  }, [t, statusFilter]);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  const supportMessages: Record<string, string> = {
    court_delay: t('Another delay. Your frustration is valid. This is documented and it matters.', 'अर्को ढिलाइ। तपाईंको निराशा मान्य छ।'),
    police_dismissal: t('Being dismissed is painful. You deserve to be heard. We hear you.', 'अस्वीकार हुनु पीडादायक छ। तपाईं सुनिनु योग्य हुनुहुन्छ।'),
    threat: t('Your safety comes first. Consider reaching out to the safety planning module.', 'तपाईंको सुरक्षा पहिलो हो। सुरक्षा योजना मोड्युलमा सम्पर्क गर्नुहोस्।'),
    other: t('Whatever you are feeling right now is valid. You are not alone.', 'तपाईंले अहिले जे महसुस गरिरहनु भएको छ त्यो मान्य छ।'),
  };

  const handleSave = async () => {
    if (!incidentType.trim() || !description.trim()) return;
    const token = getTokenFromStorage();
    if (!token) {
      setSaveError(t('You need to be signed in.', 'लगइन चाहिन्छ।'));
      return;
    }
    setSaveError(null);
    setSaving(true);
    try {
      await createIncident(token, {
        incident_type: incidentType,
        description: description.trim(),
        priority: 'medium',
        anonymous_to_ngo: anonymousToNgo,
      });
      setIncidentType('');
      setDescription('');
      setAnonymousToNgo(false);
      setShowForm(false);
      await loadList();
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : t('Save failed', 'सुरक्षित गर्न सकिएन'));
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, next: 'pending' | 'resolved') => {
    const token = getTokenFromStorage();
    if (!token) return;
    setUpdatingId(id);
    try {
      await updateIncidentStatus(token, id, next);
      await loadList();
    } catch {
      /* surface via toast optional */
    } finally {
      setUpdatingId(null);
    }
  };

  const filterPills: { key: typeof statusFilter; labelEn: string; labelNe: string }[] = [
    { key: 'all', labelEn: 'All', labelNe: 'सबै' },
    { key: 'pending', labelEn: 'Pending', labelNe: 'बाँकी' },
    { key: 'resolved', labelEn: 'Resolved', labelNe: 'समाधान' },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={t('Record', 'रेकर्ड')}
        title={t('Incident Log', 'घटना लग')}
        description={t('Document what happened. Your voice matters.', 'के भयो दर्ता गर्नुहोस्। तपाईंको आवाज महत्त्वपूर्ण छ।')}
        action={
          <Button onClick={() => setShowForm(!showForm)} className="btn-hero gap-2 rounded-full px-5 text-sm">
            <Plus className="h-4 w-4" />
            {t('Log Incident', 'घटना दर्ता')}
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2">
        {filterPills.map((p) => (
          <Button
            key={p.key}
            type="button"
            variant={statusFilter === p.key ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
            onClick={() => setStatusFilter(p.key)}
          >
            {t(p.labelEn, p.labelNe)}
          </Button>
        ))}
      </div>

      {loadError ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
          {loadError}
        </p>
      ) : null}

      {showForm && (
        <Card className="rounded-2xl border-primary/20 shadow-sm">
          <CardContent className="space-y-4 p-6">
            <Select value={incidentType} onValueChange={setIncidentType}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder={t('What happened?', 'के भयो?')} />
              </SelectTrigger>
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
              className="min-h-[120px] rounded-xl border-border/80"
            />
            <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/30 p-3">
              <Checkbox
                id="anon-ngo"
                checked={anonymousToNgo}
                onCheckedChange={(c) => setAnonymousToNgo(c === true)}
              />
              <Label htmlFor="anon-ngo" className="cursor-pointer text-sm font-normal leading-snug text-foreground">
                {t(
                  'Show me as anonymous to NGO partners (they still see your report, not your name).',
                  'एनजीओ साझेदारलाई अज्ञात देखाउनुहोस् (उनीहरूले रिपोर्ट देख्छन्, नाम होइन)।',
                )}
              </Label>
            </div>
            {incidentType && (
              <div className="rounded-lg border border-primary/20 bg-sage-light p-4">
                <div className="flex items-start gap-2">
                  <Heart className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p className="text-sm italic text-foreground/80">{supportMessages[incidentType] ?? supportMessages.other}</p>
                </div>
              </div>
            )}
            {saveError ? (
              <p className="text-sm text-destructive" role="alert">
                {saveError}
              </p>
            ) : null}
            <Button className="btn-hero rounded-full text-sm" disabled={saving || !incidentType || !description.trim()} onClick={() => void handleSave()}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              {t('Save', 'सुरक्षित गर्नुहोस्')}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">{t('Loading…', 'लोड हुँदै…')}</p>
        ) : incidents.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('No incidents in this view.', 'यो दृश्यमा कुनै घटना छैन।')}</p>
        ) : (
          incidents.map((inc) => {
            const st = inc.status ?? 'pending';
            return (
              <Card
                key={inc.id}
                className={cn(
                  'rounded-2xl border-border/50 shadow-sm',
                  st === 'resolved' && 'border-primary/15 bg-muted/20',
                )}
              >
                <CardContent className="space-y-4 p-5 md:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={cn(
                            st === 'pending' ? 'bg-gold-warm/25 text-foreground' : 'bg-primary/15 text-primary',
                          )}
                        >
                          {st === 'pending' ? t('Pending', 'बाँकी') : t('Resolved', 'समाधान')}
                        </Badge>
                        <Badge variant="outline" className="font-normal">
                          {progressLabel(inc.progress_state ?? 'received', t)}
                        </Badge>
                        {st === 'resolved' && inc.resolved_at ? (
                          <span className="text-xs text-muted-foreground">
                            {t('Resolved', 'समाधान')}{' '}
                            {formatDistanceToNow(new Date(inc.resolved_at * 1000), { addSuffix: true })}
                          </span>
                        ) : null}
                      </div>
                      <p className="font-medium text-foreground">{inc.description}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {format(new Date(inc.created_at * 1000), 'yyyy-MM-dd')}
                    </span>
                  </div>

                  {(inc.assigned_to || inc.assigned_unit) && (
                    <div className="rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm">
                      <p className="font-medium text-foreground">{t('NGO coordination', 'एनजीओ समन्वय')}</p>
                      <p className="mt-1 text-muted-foreground">
                        {inc.assigned_unit ? (
                          <>
                            {t('Team', 'टोली')}: <span className="text-foreground">{unitLabel(inc.assigned_unit, t)}</span>
                            {inc.assigned_to ? ' · ' : ''}
                          </>
                        ) : null}
                        {inc.assigned_to ? (
                          <>
                            {t('Contact', 'सम्पर्क')}: <span className="text-foreground">{inc.assigned_to}</span>
                          </>
                        ) : null}
                      </p>
                    </div>
                  )}

                  <CaseProgressStrip progressState={inc.progress_state ?? 'received'} label={t} />

                  {inc.progress_updated_at ? (
                    <p className="text-[11px] text-muted-foreground">
                      {t('Progress last updated', 'प्रगति अपडेट')}{' '}
                      {formatDistanceToNow(new Date(inc.progress_updated_at * 1000), { addSuffix: true })}
                    </p>
                  ) : null}

                  <div className="rounded-lg border border-primary/10 bg-sage-light p-3">
                    <div className="flex items-start gap-2">
                      <Heart className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <p className="text-sm italic text-foreground/80">
                        {supportMessages[inc.incident_type] ?? supportMessages.other}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {st === 'pending' ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="gap-1.5 rounded-full border-primary/30"
                        disabled={updatingId === inc.id}
                        onClick={() => void handleStatusChange(inc.id, 'resolved')}
                      >
                        {updatingId === inc.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        ) : (
                          <CheckCircle2 className="h-4 w-4" aria-hidden />
                        )}
                        {t('Mark as resolved', 'समाधान भयो भन्नुहोस्')}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="gap-1.5 rounded-full"
                        disabled={updatingId === inc.id}
                        onClick={() => void handleStatusChange(inc.id, 'pending')}
                      >
                        {updatingId === inc.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        ) : (
                          <RotateCcw className="h-4 w-4" aria-hidden />
                        )}
                        {t('Reopen case', 'पुन: खोल्नुहोस्')}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default IncidentLog;
