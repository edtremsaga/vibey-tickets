import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = 'w-5 h-5' }) => {
  return (
    <div className={`${className} border-2 border-t-purple-400 border-r-purple-400 border-b-transparent border-l-transparent rounded-full animate-spin`}></div>
  );
};

export default LoadingSpinner;