import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentTextIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon,
  CogIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

const Services = ({ isDarkMode }) => {
  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      icon: DocumentTextIcon,
      title: "Content Syndication Leads",
      description: "Initial-stage content marketing efforts targeting prospects at the beginning of the sales funnel",
      features: [
        "100% engagement with opt-in leads",
        "Customized content distribution",
        "Real-time lead qualification",
        "Multi-channel content promotion"
      ],
      color: "primary",
      gradient: "gradient-primary"
    },
    {
      icon: UserGroupIcon,
      title: "Marketing Qualified Leads",
      description: "Mid-funnel prospects that have demonstrated engagement and undergone profiling",
      features: [
        "Customized questioning for qualification",
        "Pipeline criteria matching",
        "Behavioral tracking and scoring",
        "Automated lead nurturing"
      ],
      color: "secondary",
      gradient: "gradient-secondary"
    },
    {
      icon: CurrencyDollarIcon,
      title: "Sales Qualified Leads",
      description: "Bottom-of-funnel prospects exhibiting strong purchasing intent using BANT and I2P strategies",
      features: [
        "BANT qualification framework",
        "I2P assessment methodology",
        "High-intent prospect identification",
        "Direct sales handoff support"
      ],
      color: "accent",
      gradient: "gradient-accent"
    },
    {
      icon: CogIcon,
      title: "Customized Programs",
      description: "Tailored solutions designed to meet your specific business objectives and target audience",
      features: [
        "Custom strategy development",
        "Dedicated account management",
        "Flexible pricing models",
        "Performance-based guarantees"
      ],
      color: "primary",
      gradient: "gradient-primary"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  return (
    <section id="services" className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Our B2B Demand Generation Services
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Comprehensive lead generation solutions designed to fuel your sales pipeline and drive measurable growth
          </p>
        </motion.div>

        {/* Service Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {services.map((service, index) => (
            <motion.button
              key={index}
              onClick={() => setActiveService(index)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeService === index
                  ? `${service.gradient} text-white shadow-lg transform scale-105`
                  : isDarkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              whileHover={{ scale: activeService === index ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {service.title}
            </motion.button>
          ))}
        </div>

        {/* Active Service Display */}
        <motion.div
          key={activeService}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Service Content */}
          <div>
            <motion.div
              className={`w-20 h-20 rounded-2xl ${services[activeService].gradient} flex items-center justify-center mb-6`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              {React.createElement(services[activeService].icon, { className: "h-10 w-10 text-white" })}
            </motion.div>

            <h3 className={`text-3xl font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {services[activeService].title}
            </h3>

            <p className={`text-lg mb-8 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {services[activeService].description}
            </p>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              {services[activeService].features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <CheckCircleIcon className={`h-6 w-6 ${
                    services[activeService].color === 'primary' ? 'text-primary-600' :
                    services[activeService].color === 'secondary' ? 'text-secondary-600' : 'text-accent-600'
                  } flex-shrink-0 mt-0.5`} />
                  <span className={`${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {feature}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.button
              className={`btn-${services[activeService].color} text-lg px-8 py-4`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Learn More About {services[activeService].title}
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </motion.button>
          </div>

          {/* Visual Representation */}
          <motion.div
            className={`relative p-8 rounded-2xl ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-xl`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`absolute inset-0 ${services[activeService].gradient} opacity-5 rounded-2xl`} />
            
            {/* Service Illustration */}
            <div className="relative z-10">
              <div className={`w-full h-64 rounded-lg ${services[activeService].gradient} opacity-20 flex items-center justify-center`}>
                {React.createElement(services[activeService].icon, { className: "h-32 w-32 text-white opacity-50" })}
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className={`text-center p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div className={`text-2xl font-bold ${
                    services[activeService].color === 'primary' ? 'text-primary-600' :
                    services[activeService].color === 'secondary' ? 'text-secondary-600' : 'text-accent-600'
                  }`}>
                    {activeService === 0 ? '500+' : activeService === 1 ? '85%' : activeService === 2 ? '92%' : '100%'}
                  </div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {activeService === 0 ? 'Active Campaigns' : 
                     activeService === 1 ? 'Qualification Rate' :
                     activeService === 2 ? 'Conversion Rate' : 'Customization'}
                  </div>
                </div>
                
                <div className={`text-center p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div className={`text-2xl font-bold ${
                    services[activeService].color === 'primary' ? 'text-primary-600' :
                    services[activeService].color === 'secondary' ? 'text-secondary-600' : 'text-accent-600'
                  }`}>
                    {activeService === 0 ? '24/7' : activeService === 1 ? '3-5 days' : activeService === 2 ? '48 hours' : 'Flexible'}
                  </div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {activeService === 0 ? 'Support' : 
                     activeService === 1 ? 'Turnaround Time' :
                     activeService === 2 ? 'Response Time' : 'Timeline'}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Additional Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-20"
        >
          <h3 className={`text-2xl font-bold text-center mb-8 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Additional Solutions
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "360° Demand Generation", description: "End-to-end marketing solutions" },
              { title: "Account-Based Marketing", description: "Targeted high-value accounts" },
              { title: "Marketing Automation", description: "Streamlined lead nurturing" }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className={`card ${isDarkMode ? 'card-dark' : ''} text-center`}
              >
                <h4 className={`font-bold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {item.title}
                </h4>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
