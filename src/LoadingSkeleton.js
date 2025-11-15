import React from 'react';
import EnhancedLoader from './EnhancedLoader';

const LoadingSkeleton = ({ type = 'card' }) => {

  if (type === 'input') {
    return (
      <EnhancedLoader 
        message="Preparing your design workspace..." 
      />
    );
  }

  if (type === 'results') {
    return (
      <EnhancedLoader 
        message="Crafting your 3D masterpiece..." 
      />
    );
  }

  // Default card skeleton with enhanced loader
  return (
    <EnhancedLoader 
      message="Loading..." 
    />
  );
};

export default LoadingSkeleton;