import React, { useState, useCallback, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoadingScreen } from "./components/LoadingScreen";
import { ScrollProgress } from "./components/ScrollProgress";
import { Navbar } from "./components/Navbar";
import { BackgroundGrid } from "./components/BackgroundGrid";
import { ScrollToTop } from "./components/ScrollToTop";
import { NotFound } from "./components/NotFound";

// Sections
import { Hero } from "./sections/Hero";
import { About } from "./sections/About";
import { WhyWorkWithMe } from "./sections/WhyWorkWithMe";
import { Skills } from "./sections/Skills";
import { FeaturedTechnologies } from "./sections/FeaturedTechnologies";
import { Services } from "./sections/Services";
import { DevProcess } from "./sections/DevProcess";
import { Projects } from "./sections/Projects";
import { FAQ } from "./sections/FAQ";
import { Contact } from "./sections/Contact";
import { Footer } from "./sections/Footer";

// Birthday Sale Campaign Components
import { useCampaign } from "./hooks/useCampaign";
import { BirthdaySaleModal } from "./components/campaign/BirthdaySaleModal";
import { BirthdayBadge } from "./components/campaign/BirthdayBadge";
import { CampaignErrorBoundary } from "./components/campaign/CampaignErrorBoundary";

// Portfolio Page Component
const Portfolio = () => {
  const [loading, setLoading] = useState(true);
  const campaign = useCampaign();
  const campaignRef = useRef(campaign);
  campaignRef.current = campaign;
  const hasAutoOpenedModalRef = useRef(false);

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
    if (!hasAutoOpenedModalRef.current) {
      hasAutoOpenedModalRef.current = true;
      // Automatically open the Birthday Sale modal above the homepage once loading reaches 100%
      campaignRef.current.openModal();
    }
  }, []);

  return (
    <>
      {/* Premium Loader: Original full-screen animation from 0% to 100% on every open */}
      {loading && <LoadingScreen onComplete={handleLoadingComplete} />}

      {!loading && (
        <div className="relative min-h-screen text-white select-none">
          {/* Top Progress bar */}
          <ScrollProgress />

          {/* Floating pill navigation */}
          <Navbar />

          {/* Vercel grid and background moving glows */}
          <BackgroundGrid />

          {/* Main Content Layout */}
          <main className="relative z-10 w-full">
            <Hero />
            <About />
            <WhyWorkWithMe />
            <Skills />
            <FeaturedTechnologies />
            <Services />
            <DevProcess />
            <Projects />
            <FAQ />
            <Contact />
            <Footer />
          </main>

          {/* Birthday Sale Campaign Modal & Floating Reopen Badge */}
          <CampaignErrorBoundary>
            <BirthdaySaleModal campaign={campaign} />
            <BirthdayBadge campaign={campaign} />
          </CampaignErrorBoundary>

          {/* Scroll back to top control */}
          <ScrollToTop />
        </div>
      )}
    </>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Portfolio />} />
        
        {/* 404 Custom Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
