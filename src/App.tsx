import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import IntroSection from './components/IntroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import Footer from './components/Footer';
import CallToActionSection from './components/CallToActionSection';
import './index.css';

// Routes
const Home: React.FC = () => <div className="container mx-auto"></div>;
const About: React.FC = () => <div className="container mx-auto">About Page</div>;
const Team: React.FC = () => <div className="container mx-auto">Team Page</div>;
const Contact: React.FC = () => <div className="container mx-auto">Contact Page</div>;

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <IntroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CallToActionSection />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;