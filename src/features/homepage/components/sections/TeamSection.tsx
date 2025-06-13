import React from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../sub_components/SectionHeader';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  initials: string;
}

const TeamSection: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      name: "Luka Petrovic",
      role: "Co-Founder & Fullstack Engineer",
      bio: "Computer science student at the FH Technikum Wien in the 4th semester. Enthusiastic about clean architectures, scalable code and the interaction of frontend and backend. Currently working on all aspects of the project - from design to database.",
      initials: "LP"
    },
    {
      name: "Samuel Hammerschmidt",
      role: "Co-Founder & Fullstack Engineer",
      bio: "Also a 4th semester computer science student at the FH Technikum Wien. Contributes technical precision and creative solutions - whether in UI design, API development or complex backend structures.",
      initials: "SH"
    },
    {
      name: "Lorenz Rentenberger",
      role: "Co-Founder & Fullstack Engineer",
      bio: "CS student at UAS Technikum Vienna with a passion for software, data, and the web. I love building things with ♥ – always with a focus on simplicity, usability, and real-world value.",
      initials: "LR"
    },
    {
      name: "-",
      role: "-",
      bio: "Would you like to become part of our team? Write to us - we look forward to new ideas and support!",
      initials: "--"
    }
  ];

  return (
    <section id="team" className="py-16 bg-purple-50">
      <div className="container mx-auto px-4 text-center">
        <SectionHeader
          titlebox="Our Team"
          title="Meet the people behind Recallr"
          subtitle="We're a group of passionate learners on a mission to revolutionize how students study"
        />

        <div className="mt-12 max-w-5xl mx-auto">
          <div className="prose prose-purple mx-auto mb-12">
            <p className="text-gray-700 text-lg leading-relaxed text-center">
              Our diverse team combines expertise in education, technology, and design to create
              the best learning experience possible. We're united by our belief that learning should
              be efficient, enjoyable, and accessible to everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="p-6 flex flex-col items-center text-center group hover:-translate-y-2 transition-all duration-300 bg-white border border-gray-100 hover:border-purple-200 hover:shadow-xl rounded-xl"
              >
                <div className="h-24 w-24 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <span className="text-xl font-bold text-purple-600">{member.initials}</span>
                </div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-purple-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Join Our Team</h3>

          <div className="bg-white p-8 rounded-xl shadow-sm">
            <p className="text-gray-700 text-lg leading-relaxed text-center mb-6">
              We're always looking for talented individuals who are passionate about education and technology.
              If you believe in our mission and want to help shape the future of learning, we'd love to hear from you.
            </p>

            <div className="text-center">
              <a
                href="#contact"
                className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition inline-block"
              >
                Get In Touch
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
