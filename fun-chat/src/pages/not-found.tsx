import React from '@/react';
import { Link } from '@/react/router/link';

export function NotFound(): React.JSX.Element {
  return (
    <div>
      <h2>Ooops! The page you requested could not be found</h2>
      <Link to="/">Return to Home Page</Link>
    </div>
  );
}
