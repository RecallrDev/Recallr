import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import IntroSection from './components/IntroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import Footer from './components/Footer';
import CallToActionSection from './components/CallToActionSection';
import AboutSection from './components/AboutSection';
import TeamSection from './components/TeamSection';
import ContactSection from './components/ContactSection';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <IntroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <AboutSection />
        <TeamSection />
        <ContactSection />
        <CallToActionSection />
      </div>
      <Footer />
    </Router>
  );
};

export default App;