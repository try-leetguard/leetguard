import LandingPage from './LandingPage';
import { MarketingPageWrapper } from '@/components/MarketingPageWrapper';

export default function Home() {
  return (
    <MarketingPageWrapper>
      <LandingPage />
    </MarketingPageWrapper>
  );
}