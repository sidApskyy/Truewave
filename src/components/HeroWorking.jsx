import React from 'react';
import { CheckCircleIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { PlayIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

const HeroWorking = ({ isDarkMode }) => {
  const stats = [
    { value: '2012', label: 'Founded' },
    { value: '10K+', label: 'Leads Generated' },
    { value: '500+', label: 'Happy Clients' },
    { value: '99%', label: 'Satisfaction' },
  ];

  return (
    <section id="hero" className={`py-20 ${isDarkMode ? 'bg-gradient-to-br from-blue-50 to-indigo-100' : 'bg-gradient-to-br from-gray-50 to-blue-100'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/2 w-64 h-64 bg-blue-400 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute top-0 right-1/2 w-64 h-64 bg-indigo-400 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-10"></div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Headline */}
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              We Slice Through The Clutter
            </h1>
            <p className={`text-xl max-w-3xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Your trusted B2B demand generation partner since 2012. We prioritize what truly counts - Outcomes!
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className={`text-center p-6 rounded-xl ${
                    isDarkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
                  } shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                >
                  <div className={`text-3xl sm:text-4xl font-bold mb-2 ${
                    isDarkMode ? 'text-primary-400' : 'text-primary-600'
                  }`}>
                    {stat.value}
                  </div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg`}>
                <PlayIcon className="mr-2 h-5 w-5" />
                Get Your Free Lead Generation Audit
              </button>
              
              <button className={`bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-lg`}>
                <ArrowRightIcon className="ml-2 h-5 w-5" />
                Watch How It Works
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-6 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg">
                <CheckCircleIcon className="h-8 w-8 text-secondary-500 mx-auto mb-4" />
                <div className="font-medium text-gray-700">GDPR Compliant</div>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg">
                <CheckCircleIcon className="h-8 w-8 text-secondary-500 mx-auto mb-4" />
                <div className="font-medium text-gray-700">CCPA Compliant</div>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg">
                <CheckCircleIcon className="h-8 w-8 text-secondary-500 mx-auto mb-4" />
                <div className="font-medium text-gray-700">Global Reach</div>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg sm:col-span-2">
                <CheckCircleIcon className="h-8 w-8 text-secondary-500 mx-auto mb-4" />
                <div className="font-medium text-gray-700">10+ Years Experience</div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <ArrowDownIcon className={`h-6 w-6 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroWorking;
