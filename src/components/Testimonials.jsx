import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/solid';
import { UserIcon } from '@heroicons/react/24/outline';

const Testimonials = ({ isDarkMode }) => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      company: "TechCorp Inc.",
      position: "Marketing Director",
      content: "TrueWaveites transformed our lead generation strategy. We saw a 300% increase in qualified leads within the first quarter.",
      rating: 5,
      avatar: UserIcon
    },
    {
      name: "Michael Chen",
      company: "Global Solutions Ltd.",
      position: "CEO",
      content: "The team's expertise in B2B demand generation is unmatched. They helped us expand into new markets with confidence.",
      rating: 5,
      avatar: UserIcon
    },
    {
      name: "Emily Rodriguez",
      company: "Innovation Labs",
      position: "Sales Manager",
      content: "Outstanding service and measurable results. Our sales pipeline has never been healthier.",
      rating: 5,
      avatar: UserIcon
    }
  ];

  return (
    <section className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
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
            What Our Clients Say
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Don't just take our word for it - hear from businesses we've helped grow
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className={`card ${isDarkMode ? 'card-dark' : ''} relative overflow-hidden`}
            >
              {/* Quote Icon */}
              <ChatBubbleLeftIcon className={`absolute top-4 right-4 h-8 w-8 ${
                isDarkMode ? 'text-gray-700' : 'text-primary-100'
              }`} />

              {/* Rating */}
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className={`mb-6 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              } leading-relaxed`}>
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                } flex items-center justify-center`}>
                  <testimonial.avatar className={`h-6 w-6 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                </div>
                <div>
                  <div className={`font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {testimonial.name}
                  </div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {testimonial.position}, {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className={`mt-16 p-8 rounded-2xl ${
            isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
          }`}
        >
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
              <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Happy Clients
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary-600 mb-2">10K+</div>
              <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Leads Generated
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent-600 mb-2">99%</div>
              <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Satisfaction Rate
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">12+</div>
              <div className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Years Experience
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
