import OnboardingFlow from '@/components/onboarding/onboarding-flow';
import { StatusBar } from 'expo-status-bar';

export default function OnboardingScreen() {
  return (
    <>
      <StatusBar style="dark" />
      <OnboardingFlow />
    </>
  );
}
