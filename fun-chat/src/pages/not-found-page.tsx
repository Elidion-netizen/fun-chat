import React from '@/react';
import { Link } from '@/react/router/link';

export function NotFound(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Ooops! The page you requested could not be found
      </h2>
      <Link to="/">Return to Home Page</Link>
    </div>
  );
}
