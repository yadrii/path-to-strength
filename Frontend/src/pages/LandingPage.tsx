import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import {
  Heart,
  Shield,
  Users,
  BookOpen,
  Scale,
  MessageCircleHeart,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const LandingPage = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Scale,
      title: t('Today & your trail', 'आज र तपाईंको बाटो'),
      desc: t(
        'Five small choices each day and a private trail of presence — legal timelines live in Help when you need them.',
        'हरेक दिन पाँच साना छनौट र उपस्थितिको निजी बाटो — कानुनी समयरेखा सहायतामा जब चाहिन्छ।',
      ),
    },
    {
      icon: MessageCircleHeart,
      title: t('Emotional Support', 'भावनात्मक सहयोग'),
      desc: t(
        'Every delay, every setback — acknowledged. You are not alone in this.',
        'हरेक ढिलाइ, हरेक अवरोध — स्वीकृत। तपाईं यसमा एक्लो हुनुहुन्न।',
      ),
    },
    {
      icon: Users,
      title: t('Peer Connection', 'साथी जडान'),
      desc: t(
        'Anonymously connect with women at the same stage of the legal process.',
        'कानुनी प्रक्रियाको उस्तै चरणमा रहेका महिलाहरूसँग गोप्य रूपमा जोडिनुहोस्।',
      ),
    },
    {
      icon: Shield,
      title: t('Safety Planning', 'सुरक्षा योजना'),
      desc: t(
        'Practical steps for your safety — not clinical, but real.',
        'तपाईंको सुरक्षाका लागि व्यावहारिक कदमहरू — क्लिनिकल होइन, वास्तविक।',
      ),
    },
    {
      icon: BookOpen,
      title: t('Legal Rights', 'कानुनी अधिकार'),
      desc: t(
        'Understand your rights in plain language, not legal jargon.',
        'कानुनी शब्दावली होइन, सरल भाषामा आफ्ना अधिकार बुझ्नुहोस्।',
      ),
    },
    {
      icon: Heart,
      title: t('NGO & Therapist Access', 'एनजीओ र थेरापिस्ट पहुँच'),
      desc: t(
        'Connect with verified NGOs and mental health professionals.',
        'प्रमाणित एनजीओ र मानसिक स्वास्थ्य पेशेवरहरूसँग जोडिनुहोस्।',
      ),
    },
  ];

  const trustPoints = [
    {
      icon: ShieldCheck,
      label: t('Private by design', 'गोप्य डिजाइन'),
    },
    {
      icon: Sparkles,
      label: t('Built for Nepal', 'नेपालको लागि'),
    },
    {
      icon: Heart,
      label: t('Warm, not clinical', 'न्यानो, औपचारिक होइन'),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden pt-[calc(var(--nav-offset)+1rem)] md:pt-[calc(var(--nav-offset)+1.5rem)]">
        <div
          className="pointer-events-none absolute -right-20 top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl md:right-[10%]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-16 bottom-20 h-64 w-64 rounded-full bg-terracotta/15 blur-3xl"
          aria-hidden
        />

        <div className="container relative mx-auto px-4 py-16 md:py-24 lg:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_minmax(0,420px)] lg:gap-16">
            <div className="text-center lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-sage-light/90 px-4 py-2 text-sm font-medium text-sage-dark shadow-sm backdrop-blur-sm animate-fade-in">
                <Heart className="h-4 w-4 text-primary" />
                {t('Your journey matters', 'तपाईंको यात्रा महत्त्वपूर्ण छ')}
              </div>

              <h1
                className="font-display text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-[3.25rem] animate-fade-in text-balance"
                style={{ animationDelay: '0.08s' }}
              >
                {t('You are not alone in this fight', 'यो लडाइँमा तपाईं एक्लो हुनुहुन्न')}
              </h1>

              <p
                className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground lg:mx-0 animate-fade-in md:text-xl"
                style={{ animationDelay: '0.15s' }}
              >
                {t(
                  'A companion for your legal journey. Track your case, know your rights, and find solidarity with women who understand.',
                  'तपाईंको कानुनी यात्राको साथी। आफ्नो मुद्दा ट्र्याक गर्नुहोस्, आफ्ना अधिकार जान्नुहोस्, र बुझ्ने महिलाहरूसँग एकजुटता पाउनुहोस्।',
                )}
              </p>

              <div
                className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start animate-fade-in"
                style={{ animationDelay: '0.22s' }}
              >
                <Button asChild size="lg" className="btn-hero h-12 gap-2 rounded-full px-8 text-base shadow-md">
                  <Link to="/auth">
                    {t('Get Started', 'सुरु गर्नुहोस्')}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-full border-2 border-primary/40 bg-background/60 px-8 text-base font-medium backdrop-blur-sm hover:bg-primary hover:text-primary-foreground"
                >
                  <a href="#features">{t('Learn More', 'थप जान्नुहोस्')}</a>
                </Button>
              </div>

              <ul
                className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground lg:justify-start animate-fade-in"
                style={{ animationDelay: '0.28s' }}
              >
                {trustPoints.map((item) => (
                  <li key={item.label} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                    <span className="font-medium text-foreground/80">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Decorative panel — matches dashboard card language */}
            <div className="relative mx-auto w-full max-w-md lg:mx-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Card className="overflow-hidden rounded-[2rem] border-primary/10 bg-white/80 shadow-xl backdrop-blur-sm dark:bg-card/80">
                <CardContent className="space-y-5 p-8 md:p-10">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                      <MessageCircleHeart className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-display text-lg font-semibold text-foreground">
                        {t('Sahara Chat', 'सहारा च्याट')}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {t(
                          'A gentle space to speak — in Nepali, at your pace.',
                          'कुरा गर्ने न्यानो ठाउँ — नेपालीमा, तपाईंको गतिमा।',
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/5 p-4 text-center">
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary/70">
                      {t('Your journey', 'तपाईंको यात्रा')}
                    </p>
                    <p className="mt-2 font-display text-2xl font-bold text-foreground">
                      {t('One step at a time', 'एक पटकमा एक कदम')}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    {t('Anonymous options where it matters', 'जहाँ महत्त्वपूर्ण छ, गोप्य विकल्पहरू')}
                  </div>
                </CardContent>
              </Card>
              <div
                className="absolute -bottom-3 -right-3 -z-10 h-full w-full rounded-[2rem] bg-terracotta/20 blur-sm"
                aria-hidden
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-[var(--nav-offset)] border-t border-border/60 bg-background py-12 sm:py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-2xl text-center md:mb-16">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {t('Inside the app', 'एपभित्र')}
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl text-balance">
              {t('Everything you need, in one place', 'तपाईंलाई चाहिने सबै, एकै ठाउँमा')}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {t(
                'A legal tool that holds space for your heart. Because justice should not cost your peace.',
                'तपाईंको मुटुको लागि ठाउँ राख्ने कानुनी उपकरण। किनभने न्यायले तपाईंको शान्ति खर्च गर्नु हुँदैन।',
              )}
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {features.map((f, i) => (
              <Card
                key={f.title}
                className="group border-border/50 bg-card/90 shadow-[var(--shadow-soft)] transition-all duration-300 hover:border-primary/20 hover:shadow-lg rounded-[1.75rem]"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <CardContent className="p-6 md:p-7">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sage-light transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <f.icon className="h-6 w-6 text-primary transition-colors group-hover:text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-hero border-t border-border/40 py-20 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border-primary/15 bg-gradient-to-br from-card via-card to-sage-light/40 shadow-[var(--shadow-card)]">
            <CardContent className="px-8 py-12 text-center md:px-14 md:py-14">
              <Heart className="mx-auto mb-4 h-10 w-10 text-primary fill-primary/15" />
              <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl text-balance">
                {t(
                  'She came for legal help. She stayed for the community.',
                  'उनी कानुनी सहयोगको लागि आइन्। उनी समुदायको लागि बसिन्।',
                )}
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-muted-foreground leading-relaxed">
                {t('Join thousands of women reclaiming their story.', 'आफ्नो कथा पुनः दाबी गर्ने हजारौं महिलाहरूसँग जोडिनुहोस्।')}
              </p>
              <Button asChild size="lg" className="btn-hero mt-8 gap-2 rounded-full px-10 shadow-md">
                <Link to="/auth">
                  {t('Start Your Journey', 'आफ्नो यात्रा सुरु गर्नुहोस्')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 text-center md:flex-row md:text-left">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary fill-primary/20" />
              <span className="font-display text-lg font-semibold text-foreground">{t('Sahara', 'सहारा')}</span>
            </div>
            <p className="max-w-sm text-sm text-muted-foreground leading-relaxed">
              {t('Built with love for the women who fight.', 'लड्ने महिलाहरूको लागि मायाले बनाइएको।')}
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6">
            <Link
              to="/auth"
              className="text-sm font-medium text-primary transition-colors hover:text-sage-dark hover:underline"
            >
              {t('Sign in', 'साइन इन')}
            </Link>
            <span className="hidden text-border sm:inline" aria-hidden>
              |
            </span>
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t('Features', 'विशेषताहरू')}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
