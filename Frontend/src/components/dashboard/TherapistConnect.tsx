import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Building2, Phone, Video, Star, MapPin } from 'lucide-react';

const TherapistConnect = () => {
  const { t } = useLanguage();

  const professionals = [
    {
      id: '1',
      name: t('Dr. Sunita Sharma', 'डा. सुनिता शर्मा'),
      type: t('Clinical Psychologist', 'क्लिनिकल मनोवैज्ञानिक'),
      org: t('Transcultural Psychosocial Organization', 'ट्रान्सकल्चरल साइकोसोशल संगठन'),
      location: t('Kathmandu', 'काठमाडौं'),
      rating: 4.8,
      available: true,
    },
    {
      id: '2',
      name: t('Rina Tamang', 'रिना तामाङ'),
      type: t('Trauma Counselor', 'ट्रमा काउन्सेलर'),
      org: t('WOREC Nepal', 'वर्क नेपाल'),
      location: t('Lalitpur', 'ललितपुर'),
      rating: 4.9,
      available: true,
    },
    {
      id: '3',
      name: t('Helping Hands Nepal', 'हेल्पिङ ह्यान्ड्स नेपाल'),
      type: t('NGO — Women Support', 'एनजीओ — महिला सहयोग'),
      org: '',
      location: t('Bhaktapur', 'भक्तपुर'),
      rating: 4.7,
      available: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">{t('Connect with Support', 'सहयोगसँग जोडिनुहोस्')}</h2>
        <p className="text-muted-foreground text-sm">{t('Verified therapists and NGOs ready to help', 'प्रमाणित थेरापिस्ट र एनजीओहरू मद्दतको लागि तयार')}</p>
      </div>

      <div className="space-y-4">
        {professionals.map((pro) => (
          <Card key={pro.id} className="border-border/50 hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-sage-light flex items-center justify-center shrink-0">
                    {pro.org ? <Heart className="h-6 w-6 text-primary" /> : <Building2 className="h-6 w-6 text-primary" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{pro.name}</h3>
                    <p className="text-sm text-muted-foreground">{pro.type}</p>
                    {pro.org && <p className="text-xs text-muted-foreground">{pro.org}</p>}
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{pro.location}</span>
                      <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-gold-warm text-gold-warm" />{pro.rating}</span>
                    </div>
                  </div>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full mt-1 ${pro.available ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
              </div>
              <div className="flex gap-2 mt-4 ml-16">
                <Button variant="outline" size="sm" className="gap-2 border-primary/30 text-primary hover:bg-sage-light">
                  <Phone className="h-3.5 w-3.5" />
                  {t('Call', 'कल')}
                </Button>
                <Button variant="outline" size="sm" className="gap-2 border-primary/30 text-primary hover:bg-sage-light">
                  <Video className="h-3.5 w-3.5" />
                  {t('Video', 'भिडियो')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TherapistConnect;
