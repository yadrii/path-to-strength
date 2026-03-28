import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserCheck, UserX, Phone, Video, MessageCircle, Shield, BarChart3, Calendar } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const NgoDashboard = () => {
  const { t } = useLanguage();
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || user?.role !== 'ngo') return <Navigate to="/auth" />;

  const stats = [
    { label: t('Active Cases', 'सक्रिय मुद्दाहरू'), value: '24', icon: Users, color: 'bg-sage-light text-primary' },
    { label: t('Anonymous Users', 'अज्ञात प्रयोगकर्ता'), value: '18', icon: Shield, color: 'bg-terracotta-light text-terracotta' },
    { label: t('Registered Users', 'दर्ता प्रयोगकर्ता'), value: '6', icon: UserCheck, color: 'bg-sage-light text-primary' },
    { label: t('Sessions This Week', 'यो हप्ताका सत्रहरू'), value: '12', icon: Calendar, color: 'bg-rose-soft text-foreground' },
  ];

  const patients = [
    { id: '1', name: t('Anonymous #42', 'अज्ञात #४२'), type: 'anonymous', stage: t('Court Hearing', 'अदालत सुनुवाइ'), lastActive: '2h ago', urgency: 'medium' },
    { id: '2', name: 'Sita K.', type: 'registered', stage: t('Police Report', 'प्रहरी रिपोर्ट'), lastActive: '1h ago', urgency: 'high' },
    { id: '3', name: t('Anonymous #78', 'अज्ञात #७८'), type: 'anonymous', stage: t('Shelter System', 'आश्रय प्रणाली'), lastActive: '5h ago', urgency: 'low' },
    { id: '4', name: 'Rina T.', type: 'registered', stage: t('Court Hearing', 'अदालत सुनुवाइ'), lastActive: '30m ago', urgency: 'high' },
    { id: '5', name: t('Anonymous #105', 'अज्ञात #१०५'), type: 'anonymous', stage: t('Court Hearing', 'अदालत सुनुवाइ'), lastActive: '1d ago', urgency: 'low' },
  ];

  const urgencyColors = {
    high: 'bg-destructive/10 text-destructive',
    medium: 'bg-gold-warm/20 text-foreground',
    low: 'bg-sage-light text-primary',
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground">{t('NGO Dashboard', 'एनजीओ ड्यासबोर्ड')}</h1>
            <p className="text-muted-foreground">{t('Manage and support survivors in their journey', 'बाँचेकाहरूलाई उनीहरूको यात्रामा व्यवस्थापन र समर्थन गर्नुहोस्')}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
              <Card key={i}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Patients */}
          <Tabs defaultValue="all">
            <TabsList className="bg-muted mb-6">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">{t('All', 'सबै')}</TabsTrigger>
              <TabsTrigger value="anonymous" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">{t('Anonymous', 'अज्ञात')}</TabsTrigger>
              <TabsTrigger value="registered" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">{t('Registered', 'दर्ता')}</TabsTrigger>
            </TabsList>

            {['all', 'anonymous', 'registered'].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-3">
                {patients
                  .filter((p) => tab === 'all' || p.type === tab)
                  .map((patient) => (
                    <Card key={patient.id} className="border-border/50 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-sage-light flex items-center justify-center">
                              {patient.type === 'anonymous' ? <Shield className="h-5 w-5 text-primary" /> : <UserCheck className="h-5 w-5 text-primary" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-foreground">{patient.name}</p>
                                <Badge className={urgencyColors[patient.urgency as keyof typeof urgencyColors]} variant="secondary">
                                  {patient.urgency}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{patient.stage} · {patient.lastActive}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="text-primary hover:bg-sage-light"><MessageCircle className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-primary hover:bg-sage-light"><Phone className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-primary hover:bg-sage-light"><Video className="h-4 w-4" /></Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default NgoDashboard;
