import { LenisProvider } from './hooks/useLenis';
import Navigation from './sections/Navigation';
import HeroSection from './sections/HeroSection';
import FeaturedArtists from './sections/FeaturedArtists';
import LatestReleases from './sections/LatestReleases';
import MusicVideos from './sections/MusicVideos';
import TrendingCharts from './sections/TrendingCharts';
import Statistics from './sections/Statistics';
import ExploreGenres from './sections/ExploreGenres';
import LatestNews from './sections/LatestNews';
import PremiumMerch from './sections/PremiumMerch';
import CTABanner from './sections/CTABanner';
import Footer from './sections/Footer';

function App() {
  return (
    <LenisProvider>
      <div className="relative bg-[#070707] min-h-screen">
        <Navigation />
        <main>
          <HeroSection />
          <FeaturedArtists />
          <LatestReleases />
          <MusicVideos />
          <TrendingCharts />
          <Statistics />
          <ExploreGenres />
          <LatestNews />
          <PremiumMerch />
          <CTABanner />
        </main>
        <Footer />
      </div>
    </LenisProvider>
  );
}

export default App;
