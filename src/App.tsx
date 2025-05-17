import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import IntroSection from './components/IntroSection';
import FeaturesSection from './components/FeaturesSection';
import './index.css';

// Routes
const Home: React.FC = () => <div className="container mx-auto p-4"></div>;
const About: React.FC = () => <div className="container mx-auto p-4">About Page</div>;
const Team: React.FC = () => <div className="container mx-auto p-4">Team Page</div>;
const Contact: React.FC = () => <div className="container mx-auto p-4">Contact Page</div>;

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <IntroSection />
        <FeaturesSection />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;