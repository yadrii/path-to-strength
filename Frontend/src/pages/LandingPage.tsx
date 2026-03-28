import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Heart, Shield, Users, BookOpen, Scale, MessageCircleHeart } from 'lucide-react';
import Navbar from '@/components/Navbar';

const LandingPage = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Scale,
      title: t('Case Tracker', 'मुद्दा ट्र्याकर'),
      desc: t('Track court dates, police reports, and legal milestones in one safe place.', 'अदालतका मिति, प्रहरी रिपोर्ट र कानुनी चरणहरू एक सुरक्षित ठाउँमा ट्र्याक गर्नुहोस्।'),
    },
    {
      icon: MessageCircleHeart,
      title: t('Emotional Support', 'भावनात्मक सहयोग'),
      desc: t('Every delay, every setback — acknowledged. You are not alone in this.', 'हरेक ढिलाइ, हरेक अवरोध — स्वीकृत। तपाईं यसमा एक्लो हुनुहुन्न।'),
    },
    {
      icon: Users,
      title: t('Peer Connection', 'साथी जडान'),
      desc: t('Anonymously connect with women at the same stage of the legal process.', 'कानुनी प्रक्रियाको उस्तै चरणमा रहेका महिलाहरूसँग गोप्य रूपमा जोडिनुहोस्।'),
    },
    {
      icon: Shield,
      title: t('Safety Planning', 'सुरक्षा योजना'),
      desc: t('Practical steps for your safety — not clinical, but real.', 'तपाईंको सुरक्षाका लागि व्यावहारिक कदमहरू — क्लिनिकल होइन, वास्तविक।'),
    },
    {
      icon: BookOpen,
      title: t('Legal Rights', 'कानुनी अधिकार'),
      desc: t('Understand your rights in plain language, not legal jargon.', 'कानुनी शब्दावली होइन, सरल भाषामा आफ्ना अधिकार बुझ्नुहोस्।'),
    },
    {
      icon: Heart,
      title: t('NGO & Therapist Access', 'एनजीओ र थेरापिस्ट पहुँच'),
      desc: t('Connect with verified NGOs and mental health professionals.', 'प्रमाणित एनजीओ र मानसिक स्वास्थ्य पेशेवरहरूसँग जोडिनुहोस्।'),
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero min-h-screen flex items-center pt-16">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-sage-light text-sage-dark px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in">
              <Heart className="h-4 w-4" />
              {t('Your journey matters', 'तपाईंको यात्रा महत्त्वपूर्ण छ')}
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {t('You are not alone in this fight', 'यो लडाइँमा तपाईं एक्लो हुनुहुन्न')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {t(
                'A companion for your legal journey. Track your case, know your rights, and find solidarity with women who understand.',
                'तपाईंको कानुनी यात्राको साथी। आफ्नो मुद्दा ट्र्याक गर्नुहोस्, आफ्ना अधिकार जान्नुहोस्, र बुझ्ने महिलाहरूसँग एकजुटता पाउनुहोस्।'
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Link to="/auth" className="btn-hero inline-flex items-center justify-center gap-2">
                {t('Get Started', 'सुरु गर्नुहोस्')}
              </Link>
              <a href="#features" className="btn-secondary-hero inline-flex items-center justify-center">
                {t('Learn More', 'थप जान्नुहोस्')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              {t('Everything you need, in one place', 'तपाईंलाई चाहिने सबै, एकै ठाउँमा')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t(
                'A legal tool that holds space for your heart. Because justice should not cost your peace.',
                'तपाईंको मुटुको लागि ठाउँ राख्ने कानुनी उपकरण। किनभने न्यायले तपाईंको शान्ति खर्च गर्नु हुँदैन।'
              )}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <div key={i} className="card-warm group cursor-default" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-12 h-12 rounded-xl bg-sage-light flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <f.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 font-sans">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">
            {t('She came for legal help. She stayed for the community.', 'उनी कानुनी सहयोगको लागि आइन्। उनी समुदायको लागि बसिन्।')}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            {t('Join thousands of women reclaiming their story.', 'आफ्नो कथा पुनः दाबी गर्ने हजारौं महिलाहरूसँग जोडिनुहोस्।')}
          </p>
          <Link to="/auth" className="btn-hero inline-flex items-center gap-2">
            {t('Start Your Journey', 'आफ्नो यात्रा सुरु गर्नुहोस्')}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t bg-background">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="h-4 w-4 text-primary fill-primary/20" />
            <span className="font-display font-semibold text-foreground">
              {t('Sahara', 'सहारा')}
            </span>
          </div>
          <p>{t('Built with love for the women who fight.', 'लड्ने महिलाहरूको लागि मायाले बनाइएको।')}</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
