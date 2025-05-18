import React from 'react';
import SectionHeader from './SectionHeader';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-16 bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4">
        <SectionHeader
          titlebox="Contact Us"
          title="Get in touch with our team"
          subtitle="Have questions or feedback? We'd love to hear from you!"
        />

        <div className="mt-12 max-w-3xl mx-auto">
          <form className="grid gap-6 bg-white p-8 rounded-xl shadow-sm">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <span className="text-purple-600 mr-2">👤</span>
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Name
                  </label>
                </div>
                <input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <span className="text-purple-600 mr-2">✉️</span>
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <span className="text-purple-600 mr-2">💬</span>
                <label htmlFor="message" className="text-sm font-medium text-gray-700">
                  Message
                </label>
              </div>
              <textarea
                id="message"
                placeholder="Your message to us..."
                rows={5}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition w-full md:w-auto md:self-end"
            >
              Send Message
            </button>
          </form>
        </div>

        <div className="mt-16 max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white border border-gray-100 rounded-xl hover:border-purple-200 hover:shadow-md transition">
            <div className="h-12 w-12 text-purple-600 mx-auto mb-3 flex items-center justify-center text-2xl">
              ✉️
            </div>
            <h3 className="text-lg font-semibold mb-2">Email</h3>
            <p className="text-gray-600">info@recallr.com</p>
          </div>
          
          <div className="p-6 bg-white border border-gray-100 rounded-xl hover:border-purple-200 hover:shadow-md transition">
            <div className="h-12 w-12 text-purple-600 mx-auto mb-3 flex items-center justify-center text-2xl">
              📍
            </div>
            <h3 className="text-lg font-semibold mb-2">Location</h3>
            <p className="text-gray-600">Vienna, Austria</p>
          </div>
          
          <div className="p-6 bg-white border border-gray-100 rounded-xl hover:border-purple-200 hover:shadow-md transition">
            <div className="h-12 w-12 text-purple-600 mx-auto mb-3 flex items-center justify-center text-2xl">
              📱
            </div>
            <h3 className="text-lg font-semibold mb-2">Social</h3>
            <p className="text-gray-600">@recallr_app</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;