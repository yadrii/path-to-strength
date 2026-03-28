import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, AlertCircle, CheckCircle2 } from 'lucide-react';
import { NEPAL_DISTRICTS } from '@/data/helpResources';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AuthPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupRole, setSignupRole] = useState<'user' | 'ngo'>('user');
  const [signupPhoneNumber, setSignupPhoneNumber] = useState('');
  const [signupDistrict, setSignupDistrict] = useState<string>('Kathmandu');
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const { login, signup, isLoading, error, clearError } = useAuth();

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) => password.length >= 6;

  const resetMessages = () => {
    setLoginErrors({});
    setSignupErrors({});
    clearError();
    setSuccessMessage('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    const errors: Record<string, string> = {};
    if (!loginEmail) errors.email = t('Email is required', 'इमेल आवश्यक छ');
    else if (!validateEmail(loginEmail)) errors.email = t('Invalid email format', 'इमेल ढाँचा गलत छ');

    if (!loginPassword) errors.password = t('Password is required', 'पासवर्ड आवश्यक छ');
    else if (!validatePassword(loginPassword)) errors.password = t('Password must be at least 6 characters', 'पासवर्ड कम्तीमा ६ वर्णको हुनुपर्छ');

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      return;
    }

    try {
      const userRole = await login(loginEmail, loginPassword);
      setSuccessMessage(t('Login successful! Redirecting...', 'लगइन सफल भयो! रिडाइरेक्ट गर्दै...'));
      setTimeout(() => navigate(userRole === 'ngo' ? '/ngo-dashboard' : '/dashboard'), 1000);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    const errors: Record<string, string> = {};
    if (!signupName) errors.name = t('Name is required', 'नाम आवश्यक छ');
    if (!signupEmail) errors.email = t('Email is required', 'इमेल आवश्यक छ');
    else if (!validateEmail(signupEmail)) errors.email = t('Invalid email format', 'इमेल ढाँचा गलत छ');
    if (!signupPassword) errors.password = t('Password is required', 'पासवर्ड आवश्यक छ');
    else if (!validatePassword(signupPassword)) errors.password = t('Password must be at least 6 characters', 'पासवर्ड कम्तीमा ६ वर्णको हुनुपर्छ');
    if (!signupConfirmPassword) errors.confirmPassword = t('Please confirm your password', 'कृपया पासवर्ड पुष्टि गर्नुहोस्');
    else if (signupPassword !== signupConfirmPassword) errors.confirmPassword = t('Passwords do not match', 'पासवर्ड मिलेन');

    if (Object.keys(errors).length > 0) {
      setSignupErrors(errors);
      return;
    }

    try {
      await signup(signupName, signupEmail, signupPassword, signupRole, signupPhoneNumber || undefined);
      setSuccessMessage(t('Account created successfully! Redirecting...', 'खाता सफलतापूर्वक सिर्जना भयो! रिडाइरेक्ट गर्दै...'));
      setTimeout(() => navigate(signupRole === 'ngo' ? '/ngo-dashboard' : '/dashboard'), 1000);
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-lg">
          <Tabs defaultValue="login" className="w-full" value={isLogin ? 'login' : 'signup'} onValueChange={(value: string) => setIsLogin(value === 'login')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{t('Login', 'लगइन')}</TabsTrigger>
              <TabsTrigger value="signup">{t('Sign Up', 'साइन अप')}</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <CardHeader>
                <div className="flex justify-center mb-3">
                  <Heart className="h-8 w-8 text-indigo-600" />
                </div>
                <CardTitle>{t('Welcome Back', 'फिर्ता स्वागत छ')}</CardTitle>
                <CardDescription>{t('Login to access your Sahara dashboard', 'आफ्नो Sahara ड्यासबोर्ड पहुँच गर्न लगइन गर्नुहोस्')}</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  {successMessage && (
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="login-email">{t('Email', 'इमेल')}</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      disabled={isLoading}
                      className={loginErrors.email ? 'border-red-500' : ''}
                    />
                    {loginErrors.email && <p className="text-sm text-red-500">{loginErrors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">{t('Password', 'पासवर्ड')}</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      disabled={isLoading}
                      className={loginErrors.password ? 'border-red-500' : ''}
                    />
                    {loginErrors.password && <p className="text-sm text-red-500">{loginErrors.password}</p>}
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? t('Logging in...', 'लगइन गर्दै...') : t('Login', 'लगइन')}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <CardHeader>
                <div className="flex justify-center mb-3">
                  <Heart className="h-8 w-8 text-indigo-600" />
                </div>
                <CardTitle>{t('Create Account', 'खाता सिर्जना गर्नुहोस्')}</CardTitle>
                <CardDescription>{t('Join Sahara as a user or NGO partner', 'एक प्रयोगकर्ता वा NGO साझेदारको रूपमा Sahara मा सामेल हुनुहोस्')}</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  {successMessage && (
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label>{t('I am a:', 'म हुँ:')}</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="user"
                          checked={signupRole === 'user'}
                          onChange={(e) => setSignupRole(e.target.value as 'user' | 'ngo')}
                          disabled={isLoading}
                        />
                        <span className="text-sm">{t('Individual User', 'व्यक्ति प्रयोगकर्ता')}</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="ngo"
                          checked={signupRole === 'ngo'}
                          onChange={(e) => setSignupRole(e.target.value as 'user' | 'ngo')}
                          disabled={isLoading}
                        />
                        <span className="text-sm">{t('NGO Partner', 'NGO साझेदार')}</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-name">{signupRole === 'ngo' ? t('Organization Name', 'संस्थाको नाम') : t('Full Name', 'पूर्ण नाम')}</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder={signupRole === 'ngo' ? 'Helping Organization' : 'John Doe'}
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      disabled={isLoading}
                      className={signupErrors.name ? 'border-red-500' : ''}
                    />
                    {signupErrors.name && <p className="text-sm text-red-500">{signupErrors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">{t('Email', 'इमेल')}</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      disabled={isLoading}
                      className={signupErrors.email ? 'border-red-500' : ''}
                    />
                    {signupErrors.email && <p className="text-sm text-red-500">{signupErrors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">{t('Password', 'पासवर्ड')}</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      disabled={isLoading}
                      className={signupErrors.password ? 'border-red-500' : ''}
                    />
                    {signupErrors.password && <p className="text-sm text-red-500">{signupErrors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">{t('Confirm Password', 'पासवर्ड पुष्टि गर्नुहोस्')}</Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      className={signupErrors.confirmPassword ? 'border-red-500' : ''}
                    />
                    {signupErrors.confirmPassword && <p className="text-sm text-red-500">{signupErrors.confirmPassword}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">{t('Phone Number (optional)', 'फोन नम्बर (ऐच्छिक)')}</Label>
                    <Input
                      id="signup-phone"
                      type="text"
                      placeholder="98XXXXXXXX"
                      value={signupPhoneNumber}
                      onChange={(e) => setSignupPhoneNumber(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-district">{t('District', 'जिल्ला')}</Label>
                    <Select
                      value={signupDistrict}
                      onValueChange={(value) => setSignupDistrict(value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger id="signup-district">
                        <SelectValue placeholder={t('Select district...', 'जिल्ला छान्नुहोस्...')} />
                      </SelectTrigger>
                      <SelectContent>
                        {NEPAL_DISTRICTS.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? t('Creating account...', 'खाता बनाइरहेको छ...') : t('Sign Up', 'साइन अप')}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
