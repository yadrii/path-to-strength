import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, User, Building2 } from 'lucide-react';

const AuthPage = () => {
  const { t } = useLanguage();
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'user' | 'ngo'>('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      login(email, password, role);
    } else {
      signup(name, email, password, role);
    }
    navigate(role === 'ngo' ? '/ngo-dashboard' : '/dashboard');
  };

  return (
    <div className="min-h-screen gradient-hero">
      <Navbar />
      <div className="flex items-center justify-center min-h-screen pt-16 px-4">
        <div className="w-full max-w-md">
          <div className="card-warm p-8">
            <div className="text-center mb-8">
              <Heart className="h-10 w-10 text-primary fill-primary/20 mx-auto mb-3" />
              <h1 className="text-2xl font-display font-bold text-foreground">
                {isLogin ? t('Welcome Back', 'फेरि स्वागत छ') : t('Join Sahara', 'सहारामा सामेल हुनुहोस्')}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {t('Your safe space awaits', 'तपाईंको सुरक्षित ठाउँ पर्खिरहेको छ')}
              </p>
            </div>

            {/* Role Selection */}
            <Tabs value={role} onValueChange={(v) => setRole(v as 'user' | 'ngo')} className="mb-6">
              <TabsList className="grid w-full grid-cols-2 bg-muted">
                <TabsTrigger value="user" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <User className="h-4 w-4" />
                  {t('User', 'प्रयोगकर्ता')}
                </TabsTrigger>
                <TabsTrigger value="ngo" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Building2 className="h-4 w-4" />
                  {t('NGO', 'एनजीओ')}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="name">{role === 'ngo' ? t('Organization Name', 'संस्थाको नाम') : t('Your Name', 'तपाईंको नाम')}</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={role === 'ngo' ? 'Helping Hands Nepal' : 'Sita'} className="mt-1" />
                </div>
              )}
              <div>
                <Label htmlFor="email">{t('Email', 'इमेल')}</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="password">{t('Password', 'पासवर्ड')}</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-1" />
              </div>
              <Button type="submit" className="w-full btn-hero">
                {isLogin ? t('Login', 'लगइन') : t('Create Account', 'खाता बनाउनुहोस्')}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {isLogin ? t("Don't have an account?", 'खाता छैन?') : t('Already have an account?', 'पहिले नै खाता छ?')}{' '}
              <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-medium hover:underline">
                {isLogin ? t('Sign Up', 'साइन अप') : t('Login', 'लगइन')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
