import React from 'react';
import SectionHeader from './SectionHeader';
import NumberedStep from './NumberedStep';


const HowItWorksSection: React.FC = () => {
    return (
        <section className="bg-white py-16">
            <div className="container mx-auto px-4 text-center">
                <SectionHeader title="How it works" />
                <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
                    Success through three simple steps
                </h2>
                <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
                    Our process is simple and effective, so you can start learning right away.
                </p>

                
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Step 1 */}
                    <NumberedStep
                        number={1}
                        title="Sign Up"
                        description="Create a free account and discover our platform."
                    />

                    {/* Step 2 */}
                    <NumberedStep
                        number={2}
                        title="Create or import decks"
                        description="Easily create your own flashcards or import existing decks."
                    />

                    {/* Step 3 */}
                    <NumberedStep
                        number={3}
                        title="Start learning"
                        description="Use our powerful tools to enhance your learning experience."
                    />
                </div>

            </div>
        </section>
    );
};

export default HowItWorksSection;