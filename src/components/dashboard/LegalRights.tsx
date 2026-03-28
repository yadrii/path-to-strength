import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ExternalLink } from 'lucide-react';

const LegalRights = () => {
  const { t } = useLanguage();

  const rights = [
    {
      title: t('Right to File a Police Report', 'प्रहरी रिपोर्ट दर्ता गर्ने अधिकार'),
      desc: t('Under the Domestic Violence Act 2066, you have the right to file a complaint at any police station. The police MUST register your complaint.', 'घरेलु हिंसा ऐन २०६६ अन्तर्गत, तपाईंलाई कुनै पनि प्रहरी चौकीमा उजुरी दर्ता गर्ने अधिकार छ। प्रहरीले तपाईंको उजुरी दर्ता गर्नै पर्छ।'),
    },
    {
      title: t('Right to Legal Aid', 'कानुनी सहायताको अधिकार'),
      desc: t('If you cannot afford a lawyer, the government must provide free legal aid. Contact the District Legal Aid Committee.', 'यदि तपाईं वकिल भर्न सक्नुहुन्न भने, सरकारले निःशुल्क कानुनी सहायता प्रदान गर्नुपर्छ।'),
    },
    {
      title: t('Right to Protection Order', 'सुरक्षा आदेशको अधिकार'),
      desc: t('The court can issue a protection order against your abuser, preventing them from contacting or approaching you.', 'अदालतले तपाईंको दुर्व्यवहारकर्ता विरुद्ध सुरक्षा आदेश जारी गर्न सक्छ।'),
    },
    {
      title: t('Right to Compensation', 'क्षतिपूर्तिको अधिकार'),
      desc: t('You can claim compensation for physical, mental, and financial damages caused by domestic violence.', 'तपाईं घरेलु हिंसाबाट भएको शारीरिक, मानसिक र आर्थिक क्षतिको लागि क्षतिपूर्ति दाबी गर्न सक्नुहुन्छ।'),
    },
    {
      title: t('Right to Shelter', 'आश्रयको अधिकार'),
      desc: t('The government and NGOs provide shelter homes for survivors. You can stay there while your case is ongoing.', 'सरकार र एनजीओहरूले बाँचेकाहरूको लागि आश्रय गृहहरू प्रदान गर्छन्।'),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">{t('Know Your Rights', 'आफ्ना अधिकार जान्नुहोस्')}</h2>
        <p className="text-muted-foreground text-sm">{t('In plain language, not legal jargon. Knowledge is power.', 'सरल भाषामा, कानुनी शब्दावली होइन। ज्ञान शक्ति हो।')}</p>
      </div>

      <div className="space-y-4">
        {rights.map((right, i) => (
          <Card key={i} className="border-border/50 hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-sage-light flex items-center justify-center shrink-0 mt-0.5">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{right.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{right.desc}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LegalRights;
