import React from 'react';
import { UserPlus, Layers, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionHeader from './section_components/SectionHeader';

const steps = [
  {
    number: 1,
    title: 'Sign Up',
    description: 'Create a free account and discover our platform.',
    icon: <UserPlus className="h-8 w-8 text-purple-600" />
  },
  {
    number: 2,
    title: 'Create or import decks',
    description: 'Easily create your own flashcards or import existing decks.',
    icon: <Layers className="h-8 w-8 text-purple-600" />
  },
  {
    number: 3,
    title: 'Start learning',
    description: 'Use our powerful tools to enhance your learning experience.',
    icon: <Rocket className="h-8 w-8 text-purple-600" />
  }
];

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="bg-purple-50 py-16 relative overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <SectionHeader 
          titlebox="How it works" 
          title="Success through three simple steps" 
          subtitle="Our process is simple and effective, so you can start learning right away." 
        />

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white p-8 rounded-xl shadow-md border border-purple-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="bg-purple-100 p-4 rounded-full">
                  {step.icon}
                </div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Step {step.number}: {step.title}</h4>
              <p className="text-gray-700 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
