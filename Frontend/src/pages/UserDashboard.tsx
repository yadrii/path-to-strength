import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import CaseTracker from "@/components/dashboard/CaseTracker";
import IncidentLog from "@/components/dashboard/IncidentLog";
import PeerConnect from "@/components/dashboard/PeerConnect";
import SafetyPlanning from "@/components/dashboard/SafetyPlanning";
import LegalRights from "@/components/dashboard/LegalRights";
import TherapistConnect from "@/components/dashboard/TherapistConnect";
import Chatbot from "@/components/dashboard/Chatbot";
import MoodGate from "@/components/dashboard/MoodGate";
import TodayScreen from "@/components/dashboard/TodayScreen";
import {
  Scale,
  FileText,
  Users,
  Shield,
  BookOpen,
  Heart,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Navigate } from "react-router-dom";

const navItems = [
  {
    key: "case",
    icon: Scale,
    labelEn: "Case Tracker",
    labelNe: "मुद्दा ट्र्याकर",
  },
  {
    key: "incident",
    icon: FileText,
    labelEn: "Incident Log",
    labelNe: "घटना लग",
  },
  {
    key: "chatbot",
    icon: MessageCircle,
    labelEn: "Sahara Chat",
    labelNe: "सहारा च्याट",
  },
  { key: "peer", icon: Users, labelEn: "Peer Connect", labelNe: "साथी जडान" },
  {
    key: "rights",
    icon: BookOpen,
    labelEn: "Legal Rights",
    labelNe: "कानुनी अधिकार",
  },
  {
    key: "therapist",
    icon: Heart,
    labelEn: "Therapist / NGO",
    labelNe: "थेरापिस्ट / एनजीओ",
  },
  {
    key: "safety",
    icon: Shield,
    labelEn: "Safety Plan",
    labelNe: "सुरक्षा योजना",
  },
];

const UserDashboard = () => {
  const { t } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState("case");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [moodDone, setMoodDone] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  if (!isAuthenticated || user?.role !== "user") return <Navigate to="/auth" />;

  const handleMoodDone = (moodHex: string) => {
    setSelectedMood(moodHex);
    setMoodDone(true);
    // Slide in sidebar naturally after the 800ms spill animation
    setTimeout(() => setSidebarOpen(true), 200);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "case":
        return <TodayScreen moodColor={selectedMood ?? "green"} />;
      case "incident":
        return <IncidentLog />;
      case "chatbot":
        return <Chatbot />;
      case "peer":
        return <PeerConnect />;
      case "rights":
        return <LegalRights />;
      case "therapist":
        return <TherapistConnect />;
      case "safety":
        return <SafetyPlanning />;

      default:
        return <TodayScreen moodColor={selectedMood ?? "green"} />;
    }
  };

  return (
    <div
      className="min-h-screen bg-background"
      style={{ transition: "background-color 800ms ease" }}
    >
      {!moodDone && <MoodGate onComplete={handleMoodDone} />}

      {/* Navbar fades in after mood selection */}
      <div
        style={{
          opacity: moodDone ? 1 : 0,
          transition: "opacity 800ms ease",
          pointerEvents: moodDone ? "auto" : "none",
        }}
      >
        <Navbar />
      </div>

      {/* Body */}
      <div
        className="flex"
        style={{
          paddingTop: "4rem",
          height: "100vh",
          opacity: moodDone ? 1 : 0,
          transition: "opacity 800ms ease 100ms",
        }}
      >
        {/* ── Sidebar slides in after color transition ── */}
        <aside
          style={{
            width: sidebarOpen ? "15rem" : "0",
            minWidth: sidebarOpen ? "15rem" : "0",
            transition:
              "width 600ms cubic-bezier(0.4,0,0.2,1), min-width 600ms cubic-bezier(0.4,0,0.2,1)",
            overflow: "hidden",
            borderRight: "1px solid var(--border)",
            background: "var(--card)",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            flexShrink: 0,
          }}
        >
          <div style={{ width: "15rem", padding: "1.25rem 0.75rem", flex: 1 }}>
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#8c7b6c",
                fontWeight: 600,
                padding: "0 1rem",
                marginBottom: "1.25rem",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              YOUR JOURNEY
            </p>
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.875rem",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.75rem",
                  border: "none",
                  cursor: "pointer",
                  marginBottom: "0.25rem",
                  background:
                    activeTab === item.key
                      ? "var(--primary-transparent, #ebf5ee)"
                      : "transparent",
                  transition: "background 200ms",
                  textAlign: "left",
                  fontFamily: "DM Sans, sans-serif",
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== item.key)
                    e.currentTarget.style.background = "hsl(var(--muted))";
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== item.key)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <item.icon
                  size={18}
                  color={
                    activeTab === item.key
                      ? "var(--mood-accent, #1D9E75)"
                      : "#8c7b6c"
                  }
                  style={{ flexShrink: 0 }}
                />
                <span
                  style={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: activeTab === item.key ? 500 : 400,
                    color:
                      activeTab === item.key
                        ? "var(--mood-accent, #1D9E75)"
                        : "#5a4e47",
                  }}
                >
                  {t(item.labelEn, item.labelNe)}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* ── Sidebar toggle ── */}
        {moodDone && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              position: "absolute",
              left: sidebarOpen ? "15rem" : "0",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 50,
              width: 20,
              height: 48,
              borderRadius: "0 8px 8px 0",
              border: "1px solid var(--border)",
              borderLeft: "none",
              background: "var(--card)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "left 600ms cubic-bezier(0.4,0,0.2,1)",
              flexShrink: 0,
            }}
          >
            {sidebarOpen ? (
              <ChevronLeft size={12} color="hsl(var(--muted-foreground))" />
            ) : (
              <ChevronRight size={12} color="hsl(var(--muted-foreground))" />
            )}
          </button>
        )}

        {/* ── Main content ── */}
        <main
          style={{
            flex: 1,
            overflowY: activeTab === "chatbot" ? "hidden" : "auto",
            overflowX: "hidden",
            height: "100%",
            padding: activeTab === "chatbot" ? 0 : "2rem",
            display: activeTab === "chatbot" ? "flex" : "block",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
