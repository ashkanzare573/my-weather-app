import React from 'react';
const LoadingBox = () => (
  <div className="text-center text-white text-lg">
    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
    <div>Loading weather data...</div>
  </div>
);
export default LoadingBox;
