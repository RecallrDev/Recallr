import React from 'react';
import { Zap, BookOpen, BarChart2, Users, Library, WifiOff } from 'lucide-react';
import FlipCard from './FlipCard';

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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center">
        <span className="text-sm uppercase tracking-wide text-gray-500">
          Features
        </span>
        <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
          Why our flashcards are better
        </h2>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
          We have enhanced the proven Anki method with modern features to improve your learning experience.
        </p>

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
