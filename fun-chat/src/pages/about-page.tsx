import React from '@/react';
import { Link } from '@/react/router/link';

export function About(): React.JSX.Element {
  return (
    <div>
      <h2>Fun Chat</h2>
      <p></p>
      <Link to="/chat">Return</Link>
    </div>
  );
}
