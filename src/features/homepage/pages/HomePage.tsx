import React from 'react';
import IntroSection from '../components/sections/IntroSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import CallToActionSection from '../components/sections/CallToActionSection';
import AboutSection from '../components/sections/AboutSection';
import TeamSection from '../components/sections/TeamSection';
import ContactSection from '../components/sections/ContactSection';
import BattleSection from '../components/sections/BattleSection';

const HomePage: React.FC = () => {
  return (
    <>
      <IntroSection />
      <HowItWorksSection />
      <AboutSection />
      <BattleSection />
      <TeamSection />
      <ContactSection />
      <CallToActionSection />
    </>
  );
};

export default HomePage;