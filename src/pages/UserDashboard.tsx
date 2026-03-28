import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import CaseTracker from '@/components/dashboard/CaseTracker';
import IncidentLog from '@/components/dashboard/IncidentLog';
import PeerConnect from '@/components/dashboard/PeerConnect';
import SafetyPlanning from '@/components/dashboard/SafetyPlanning';
import LegalRights from '@/components/dashboard/LegalRights';
import TherapistConnect from '@/components/dashboard/TherapistConnect';
import Chatbot from '@/components/dashboard/Chatbot';
import { Scale, FileText, Users, Shield, BookOpen, Heart, MessageCircle, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navigate } from 'react-router-dom';

const navItems = [
  { key: 'case', icon: Scale, labelEn: 'Case Tracker', labelNe: 'मुद्दा ट्र्याकर' },
  { key: 'incident', icon: FileText, labelEn: 'Incident Log', labelNe: 'घटना लग' },
  { key: 'peer', icon: Users, labelEn: 'Peer Connect', labelNe: 'साथी जडान' },
  { key: 'safety', icon: Shield, labelEn: 'Safety Plan', labelNe: 'सुरक्षा योजना' },
  { key: 'rights', icon: BookOpen, labelEn: 'Legal Rights', labelNe: 'कानुनी अधिकार' },
  { key: 'therapist', icon: Heart, labelEn: 'Therapist / NGO', labelNe: 'थेरापिस्ट / एनजीओ' },
  { key: 'chatbot', icon: MessageCircle, labelEn: 'Sahara Chat', labelNe: 'सहारा च्याट' },
];

const UserDashboard = () => {
  const { t } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('case');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isAuthenticated || user?.role !== 'user') return <Navigate to="/auth" />;

  const renderContent = () => {
    switch (activeTab) {
      case 'case': return <CaseTracker />;
      case 'incident': return <IncidentLog />;
      case 'peer': return <PeerConnect />;
      case 'safety': return <SafetyPlanning />;
      case 'rights': return <LegalRights />;
      case 'therapist': return <TherapistConnect />;
      case 'chatbot': return <Chatbot />;
      default: return <CaseTracker />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} border-r bg-card transition-all duration-300 min-h-[calc(100vh-4rem)] shrink-0`}>
          <div className="p-4 space-y-1">
            <div className="px-3 py-2 mb-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                {t('Your Journey', 'तपाईंको यात्रा')}
              </p>
            </div>
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  activeTab === item.key
                    ? 'bg-sage-light text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {t(item.labelEn, item.labelNe)}
              </button>
            ))}
          </div>
        </aside>

        {/* Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed left-2 top-20 z-40 md:relative md:left-0 md:top-0 md:mt-4 md:ml-2"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>

        {/* Main */}
        <main className="flex-1 p-6 md:p-8 max-w-4xl">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
