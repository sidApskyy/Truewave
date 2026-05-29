import React from 'react';

/**
 * Responsive Container Component
 * Provides consistent layout container across all pages
 * Follows the pattern: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
 */
const Container = ({ 
  children, 
  className = '', 
  size = 'default',
  ...props 
}) => {
  const sizeClasses = {
    default: 'max-w-7xl',
    narrow: 'max-w-5xl',
    wide: 'max-w-[1400px]',
    full: 'max-w-full',
  };

  return (
    <div
      className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
