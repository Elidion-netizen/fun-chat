import { navigate } from './navigate';
import React from '@/react';

export function Link({
  to,
  children,
}: {
  to: string;
  children: string;
}): React.JSX.Element {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>): void {
    e.preventDefault();
    navigate(to);
  }

  return (
    <a href={to} onClick={handleClick}>
      {children}
    </a>
  );
}
