import React from 'react';

const ErrorBox = ({ error }: { error: string }) => (
  <div className="max-w-2xl mx-auto mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
    {error}
  </div>
);

export default ErrorBox;
