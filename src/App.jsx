import React, { useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoadingScreen } from "./components/LoadingScreen";
import { ScrollProgress } from "./components/ScrollProgress";
import { Navbar } from "./components/Navbar";
import { BackgroundGrid } from "./components/BackgroundGrid";
import { CustomCursor } from "./components/CustomCursor";
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

// Portfolio Page Component
const Portfolio = () => {
  const [loading, setLoading] = useState(true);

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <>
      {/* Premium Loader */}
      <LoadingScreen onComplete={handleLoadingComplete} />

      {!loading && (
        <div className="relative min-h-screen text-white select-none">
          {/* Top Progress bar */}
          <ScrollProgress />

          {/* Floating pill navigation */}
          <Navbar />

          {/* Vercel grid and background moving glows */}
          <BackgroundGrid />

          {/* Aceternity style custom glowing cursor trail */}
          <CustomCursor />

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
