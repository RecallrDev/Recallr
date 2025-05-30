import React from 'react';
import { BookOpen, Brain, Users } from 'lucide-react';
import SectionHeader from './section_components/SectionHeader';

const AboutSection: React.FC = () => {
  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-purple-600" />,
      title: "Enhanced Anki Decks",
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

  return (
    <section id="about" className="py-16 bg-gradient-to-r from-gray-50 to-white">
      <div className="container mx-auto px-4 text-center">
        <SectionHeader
          titlebox="About Us"
          title="The Story Behind Recallr"
          subtitle="Learn how we're revolutionizing the way people study with modern technology"
        />

        <div className="mt-12 max-w-4xl mx-auto">
          <div className="prose prose-purple mx-auto">
            <p className="text-gray-700 text-lg leading-relaxed">
              Recallr was founded in 2025 by a group of university students who were frustrated with the limitations of traditional 
              study methods. We were all avid users of Anki, but felt that its interface and features hadn't kept up with modern technology.
            </p>
            
            <p className="text-gray-700 text-lg leading-relaxed mt-4">
              Our mission is to take the proven science of spaced repetition and enhance it with cutting-edge features, analytics, 
              and a user experience that makes learning more effective and enjoyable.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed mt-4">
              Whether you're a medical student memorizing anatomy, a language learner mastering vocabulary, or a history buff learning dates, 
              Recallr helps you learn faster and remember longer.
            </p>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">What Makes Recallr Special?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-8 flex flex-col items-center text-center hover:-translate-y-2 transition-all duration-300 bg-white border border-gray-100 hover:border-purple-200 hover:shadow-xl rounded-xl">
                <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-purple-50 p-8 rounded-xl max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">Our Vision</h3>
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