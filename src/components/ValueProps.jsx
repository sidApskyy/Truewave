import React from 'react';
import { motion } from 'framer-motion';
import { 
  TargetIcon, 
  ShieldCheckIcon, 
  GlobeAltIcon,
  ChartBarIcon,
  UsersIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

const ValueProps = ({ isDarkMode }) => {
  const valueProps = [
    {
      icon: TargetIcon,
      title: "Data-Driven Targeting",
      description: "Leverage advanced demographic and firmographic filters to reach the right people at the right time",
      gradient: "gradient-primary"
    },
    {
      icon: ShieldCheckIcon,
      title: "Uncompromising Quality",
      description: "Experience 100% reliability with active engagement of your Ideal Customer Profiles (ICP)",
      gradient: "gradient-secondary"
    },
    {
      icon: GlobeAltIcon,
      title: "Compliance at Core",
      description: "GDPR, CCPA, CASL, and LGPD compliant marketing operations safeguarding data privacy",
      gradient: "gradient-accent"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.3
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
    <section className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
            Why Choose TrueWaveites?
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            We combine cutting-edge technology with proven strategies to deliver exceptional results for B2B companies
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {valueProps.map((prop, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
              className={`relative group cursor-pointer`}
            >
              <div className={`card ${isDarkMode ? 'card-dark' : ''} h-full p-8 text-center relative overflow-hidden`}>
                {/* Background Gradient */}
                <div className={`absolute inset-0 ${prop.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`w-16 h-16 mx-auto mb-6 rounded-full ${prop.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <prop.icon className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <h3 className={`text-xl font-bold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {prop.title}
                </h3>
                
                <p className={`${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                } leading-relaxed`}>
                  {prop.description}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 border-2 border-primary-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className={`mt-16 p-8 rounded-2xl ${
            isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
          }`}
        >
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h4 className={`font-bold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Measurable Results
                </h4>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Track your ROI with detailed analytics and performance metrics
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <UsersIcon className="h-8 w-8 text-secondary-600" />
              </div>
              <div>
                <h4 className={`font-bold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Expert Team
                </h4>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Work with seasoned B2B marketing professionals
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <LightBulbIcon className="h-8 w-8 text-accent-600" />
              </div>
              <div>
                <h4 className={`font-bold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Innovation First
                </h4>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Stay ahead with cutting-edge marketing technologies
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ValueProps;
