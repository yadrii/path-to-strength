import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ExternalLink } from 'lucide-react';

const LegalRights = () => {
  const { t } = useLanguage();

  const rights = [
    {
      title: t('Right to Mental Healthcare', 'मानसिक स्वास्थ्य सेवाको अधिकार'),
      desc: t(
        'Every citizen has the right to access basic mental health services under Nepal’s National Mental Health Policy. Public hospitals are required to provide mental health support.',
        'नेपालको राष्ट्रिय मानसिक स्वास्थ्य नीतिअन्तर्गत प्रत्येक नागरिकलाई आधारभूत मानसिक स्वास्थ्य सेवा पाउने अधिकार छ। सरकारी अस्पतालहरूले मानसिक स्वास्थ्य सेवा उपलब्ध गराउनुपर्छ।'
      ),
    },
    {
      title: t('Right to Dignity and Non-Discrimination', 'गरिमा र भेदभावरहित व्यवहारको अधिकार'),
      desc: t(
        'The Constitution of Nepal guarantees dignity and equality. Individuals with mental health conditions must not face discrimination in healthcare, education, or employment.',
        'नेपालको संविधानले गरिमा र समानताको अधिकार सुनिश्चित गर्दछ। मानसिक स्वास्थ्य समस्या भएका व्यक्तिहरूले स्वास्थ्य, शिक्षा वा रोजगारीमा भेदभाव सहनु हुँदैन।'
      ),
    },
    {
      title: t('Right to Confidentiality', 'गोपनीयताको अधिकार'),
      desc: t(
        'Your mental health condition and treatment details must be kept confidential by healthcare providers unless disclosure is required by law.',
        'तपाईंको मानसिक स्वास्थ्य अवस्था र उपचारसम्बन्धी विवरण स्वास्थ्य सेवा प्रदायकले गोप्य राख्नुपर्छ, कानुनले आवश्यक ठानेमा बाहेक।'
      ),
    },
    {
      title: t('Right to Informed Consent', 'जानकारीसहितको सहमतिको अधिकार'),
      desc: t(
        'You have the right to understand your diagnosis and treatment options before giving consent. Treatment should not be forced unless in extreme cases defined by law.',
        'तपाईंलाई आफ्नो रोग र उपचार विकल्पबारे बुझेर मात्र सहमति दिन पाउने अधिकार छ। कानुनले परिभाषित गरेको अत्यन्त अवस्थाबाहेक जबर्जस्ती उपचार गर्नु हुँदैन।'
      ),
    },
    {
      title: t('Right to Community-Based Care', 'समुदायमा आधारित हेरचाहको अधिकार'),
      desc: t(
        'Nepal promotes community-based mental healthcare, allowing individuals to receive support within their communities instead of institutional isolation.',
        'नेपालले समुदायमा आधारित मानसिक स्वास्थ्य सेवामा जोड दिन्छ, जसले व्यक्तिलाई संस्थागत अलगावको सट्टा आफ्नै समुदायमा सहयोग पाउन मद्दत गर्दछ।'
      ),
    },
    {
      title: t('Right to Emergency Mental Health Support', 'आपतकालीन मानसिक स्वास्थ्य सहयोगको अधिकार'),
      desc: t(
        'In crisis situations, individuals have the right to immediate care and support from hospitals and emergency services.',
        'आपतकालीन अवस्थामा व्यक्तिले तुरुन्त स्वास्थ्य सेवा र सहयोग पाउने अधिकार राख्दछ।'
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">
          {t('Know Your Mental Health Rights', 'आफ्ना मानसिक स्वास्थ्य अधिकार जान्नुहोस्')}
        </h2>
        <p className="text-muted-foreground text-sm">
          {t(
            'Clear, simple information based on Nepal’s policies and constitutional rights.',
            'नेपालको नीति र संवैधानिक अधिकारमा आधारित सरल जानकारी।'
          )}
        </p>
      </div>

      {/* Rights Cards */}
      <div className="space-y-4">
        {rights.map((right, i) => (
          <Card
            key={i}
            className="border-border/50 hover:shadow-md transition-shadow"
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-sage-light flex items-center justify-center shrink-0 mt-0.5">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {right.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {right.desc}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Helpline CTA */}
      <div className="pt-2">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center"
          onClick={() => window.open('https://www.tponepal.org', '_blank')}
        >
          {t(
            'Contact Mental Health Support',
            'मानसिक स्वास्थ्य सहयोग सम्पर्क गर्नुहोस्'
          )}
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center pt-2">
        {t(
          'This information is for awareness and does not replace professional legal advice.',
          'यो जानकारी केवल सचेतनाका लागि हो र पेशेवर कानुनी सल्लाहको विकल्प होइन।'
        )}
      </p>
    </div>
  );
};

export default LegalRights;