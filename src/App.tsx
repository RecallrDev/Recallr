import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import IntroSection from './components/IntroSection';
// import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import Footer from './components/Footer';
import CallToActionSection from './components/CallToActionSection';
import AboutSection from './components/AboutSection';
import TeamSection from './components/TeamSection';
import ContactSection from './components/ContactSection';
import BattleSection from './components/BattleSection';
import UploadPage from './components/UploadPage';
import './index.css';

const HomePage: React.FC = () => {
  return (
    <>
      <IntroSection />
      {/* <FeaturesSection /> */}
      <HowItWorksSection />
      <AboutSection />
      <BattleSection />
      <TeamSection />
      <ContactSection />
      <CallToActionSection />
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;