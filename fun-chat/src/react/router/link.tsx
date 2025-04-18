import { navigate } from './navigate';
import React from '@/react';

export function Link({
  to,
  className,
  children,
}: {
  to: string;
  className?: string;
  children: string;
}): React.JSX.Element {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>): void {
    e.preventDefault();
    navigate(to);
  }

  return (
    <a href={to} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
