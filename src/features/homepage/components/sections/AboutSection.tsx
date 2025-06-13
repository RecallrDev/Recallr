import React from 'react';
import { BookOpen, Brain, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionHeader from '../sub_components/SectionHeader';

const AboutSection: React.FC = () => {
  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-purple-600" />,
      title: "Enhanced Flashcards and Decks",
      description: "Leverage advanced formatting options, multimedia integration, and intelligent spaced repetition algorithms that analyze your learning behavior."
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      title: "AI-Powered Learning",
      description: "Our platform uses artificial intelligence to adapt to your unique learning style and optimize your study sessions for maximum retention."
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Collaborative Learning",
      description: "Create and share flashcards with your fellow students. Learn together and benefit from shared knowledge within your study community."
    },
  ];

  const infoCards = [
    {
      title: "The Problem",
      text: "Recallr was founded in 2025 by a group of university students frustrated with the limitations of traditional study tools. Most flashcard apps hadn’t kept up with modern tech or usability needs."
    },
    {
      title: "The Mission",
      text: "Our mission is to enhance proven learning methods like spaced repetition with intuitive design, analytics, and next-gen features."
    },
    {
      title: "Who It's For",
      text: "Whether you’re learning medicine, a new language, or just love trivia, Recallr helps you remember more and study smarter."
    }
  ];

  return (
    <section id="about" className="py-16 bg-gradient-to-r from-gray-50 to-white">
      <div className="container mx-auto px-4 text-center">
        <SectionHeader
          titlebox="About Us"
          title="The Story Behind Recallr"
          subtitle="Learn how we're revolutionizing the way people study with modern technology"
        />

        <div className="mt-12 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {infoCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white p-6 rounded-xl shadow-md text-left border border-gray-100 hover:border-purple-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <h4 className="text-purple-600 font-semibold mb-2">{card.title}</h4>
              <p className="text-gray-700 leading-relaxed">{card.text}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">What Makes Recallr Special?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="group p-8 flex flex-col items-center text-center hover:-translate-y-2 transition-all duration-300 bg-white border border-gray-100 hover:border-purple-200 hover:shadow-xl rounded-xl"
              >
                <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-br from-purple-50 via-white to-purple-100 p-10 rounded-xl max-w-4xl mx-auto border border-purple-200 shadow-md">
          <h3 className="text-2xl font-bold text-center text-purple-700 mb-6">Our Vision</h3>
          <p className="text-gray-700 text-lg leading-relaxed text-center">
            At Recallr, we envision a world where learning is efficient, personalized, and enjoyable. 
            We believe that with the right tools, anyone can master any subject. Our goal is to continually 
            innovate and improve the learning experience, making education more accessible and effective for everyone.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
