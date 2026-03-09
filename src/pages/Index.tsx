import { useStore } from "@/store/useStore";
import OnboardingPage from "@/pages/OnboardingPage";
import Dashboard from "@/pages/Dashboard";

const Index = () => {
  const { onboarded } = useStore();
  return onboarded ? <Dashboard /> : <OnboardingPage />;
};

export default Index;
