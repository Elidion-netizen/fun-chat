import { useCallback } from '../hooks/use-callback';
import { useEffect } from '../hooks/use-effect';
import { useState } from '../hooks/use-state';

interface RouterProps {
  routes: { path: string; component: React.ReactNode }[];
  fallback: React.ReactNode;
}

export const Router = ({ routes, fallback }: RouterProps): React.ReactNode => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const handleHashChange = useCallback(() => {
    setCurrentPath(window.location.pathname);
    console.log(window.location.pathname);
  }, []);

  useEffect(() => {
    window.addEventListener('popstate', handleHashChange);
    return (): void => window.removeEventListener('popstate', handleHashChange);
  }, [handleHashChange]);

  const result =
    routes.find((route) => route.path === currentPath)?.component ?? fallback;

  return result;
};
