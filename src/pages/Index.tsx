import { useAuth } from "@/hooks/useAuth";
import { useStore } from "@/store/useStore";
import AuthPage from "@/pages/AuthPage";
import OnboardingPage from "@/pages/OnboardingPage";
import Dashboard from "@/pages/Dashboard";

const Index = () => {
  const { user, loading } = useAuth();
  const { onboarded } = useStore();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-display">Mom is checking on you...</p>
        </div>
      </div>
    );
  }

  if (!user) return <AuthPage />;
  return onboarded ? <Dashboard /> : <OnboardingPage />;
};

export default Index;
