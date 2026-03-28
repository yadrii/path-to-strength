import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageCircle, Shield } from 'lucide-react';

const PeerConnect = () => {
  const { t } = useLanguage();

  const peers = [
    {
      id: '1',
      alias: t('Sister in Courage #42', 'हिम्मतकी दिदी #४२'),
      stage: t('Court Hearing Stage', 'अदालत सुनुवाइ चरण'),
      message: t('"The waiting is the hardest part. But we wait together."', '"पर्खाइ सबैभन्दा कठिन छ। तर हामी सँगै पर्खन्छौं।"'),
      online: true,
    },
    {
      id: '2',
      alias: t('Sister in Courage #78', 'हिम्मतकी दिदी #७८'),
      stage: t('Police Report Filed', 'प्रहरी रिपोर्ट दर्ता'),
      message: t('"I filed mine 6 months ago. It gets easier to breathe."', '"मैले ६ महिना अघि दर्ता गरें। सास फेर्न सजिलो हुन्छ।"'),
      online: false,
    },
    {
      id: '3',
      alias: t('Sister in Courage #105', 'हिम्मतकी दिदी #१०५'),
      stage: t('Court Hearing Stage', 'अदालत सुनुवाइ चरण'),
      message: t('"3 postponements and counting. Still standing."', '"३ स्थगन भइसक्यो। अझै उभिइरहेकी छु।"'),
      online: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">{t('Peer Connection', 'साथी जडान')}</h2>
        <p className="text-muted-foreground text-sm">{t('Not therapy. Solidarity. Connect with women who understand.', 'थेरापी होइन। एकजुटता। बुझ्ने महिलाहरूसँग जोडिनुहोस्।')}</p>
      </div>

      <Card className="border-primary/20 bg-sage-light">
        <CardContent className="p-4 flex items-center gap-3">
          <Shield className="h-5 w-5 text-primary shrink-0" />
          <p className="text-sm text-foreground/80">
            {t('All connections are anonymous. No personal details are shared. You are safe here.', 'सबै जडानहरू गोप्य छन्। कुनै व्यक्तिगत विवरण साझा गरिँदैन। तपाईं यहाँ सुरक्षित हुनुहुन्छ।')}
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {peers.map((peer) => (
          <Card key={peer.id} className="border-border/50 hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sage-light flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{peer.alias}</p>
                    <p className="text-xs text-muted-foreground">{peer.stage}</p>
                  </div>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ${peer.online ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
              </div>
              <p className="text-sm text-muted-foreground italic mb-4">{peer.message}</p>
              <Button variant="outline" size="sm" className="gap-2 border-primary/30 text-primary hover:bg-sage-light">
                <MessageCircle className="h-4 w-4" />
                {t('Send Message', 'सन्देश पठाउनुहोस्')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PeerConnect;
