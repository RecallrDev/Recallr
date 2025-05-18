import React from 'react';
import { Zap, BookOpen, BarChart2, Users, Library, WifiOff } from 'lucide-react';
import FlipCard from './FlipCard';
import SectionHeader from './SectionHeader';

const features = [
  {
    icon: <Zap className="w-6 h-6 text-purple-600" />, 
    title: 'Intelligent Flashcards',
    description: 'Dynamic algorithm for efficient learning',
  },
  {
    icon: <BookOpen className="w-6 h-6 text-purple-600" />,
    title: 'Advanced Card Types',
    description: 'Multimedia, Cloze, and interactive flashcards',
  },
  {
    icon: <BarChart2 className="w-6 h-6 text-purple-600" />,
    title: 'Detailed Analytics',
    description: 'Track your progress with comprehensive statistics',
  },
  {
    icon: <Users className="w-6 h-6 text-purple-600" />,
    title: 'Collaborative Learning',
    description: 'Share and edit decks together with others',
  },
  {
    icon: <Library className="w-6 h-6 text-purple-600" />,
    title: 'Extensive Library',
    description: 'Access to thousands of pre-made decks',
  },
  {
    icon: <WifiOff className="w-6 h-6 text-purple-600" />,
    title: 'Offline Mode',
    description: 'Learn anywhere, even without an internet connection',
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-16 bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 text-center">
        <SectionHeader 
          titlebox="Features" 
          title="Why our flashcards are better" 
          subtitle="We have enhanced the proven Anki method with modern features to improve your learning experience." 
        />

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <FlipCard
              key={idx}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;