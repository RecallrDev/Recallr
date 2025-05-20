import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navigation/Navbar';
import IntroSection from './components/HomePage/IntroSection';
// import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HomePage/HowItWorksSection';
import Footer from './components/Navigation/Footer';
import CallToActionSection from './components/HomePage/CallToActionSection';
import AboutSection from './components/HomePage/AboutSection';
import TeamSection from './components/HomePage/TeamSection';
import ContactSection from './components/HomePage/ContactSection';
import BattleSection from './components/HomePage/BattleSection';
import UploadPage from './components/UploadPage/UploadPage';
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