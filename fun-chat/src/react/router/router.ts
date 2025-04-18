import { useCallback } from '../hooks/use-callback';
import { useLayoutEffect } from '../hooks/use-leyouteffect';
import { useState } from '../hooks/use-state';
import { navigate } from './navigate';

interface RouterProps {
  routes: {
    path: string;
    guard?: () => boolean;
    redirectTo?: string;
    component?: React.ReactNode;
  }[];
  fallback: React.ReactNode;
}

export const Router = ({ routes, fallback }: RouterProps): React.ReactNode => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const resolvePath = useCallback(
    (path: string): string => {
      const route = routes.find((r) => r.path === path);
      if (!route) return path;
      if (route.redirectTo && (!route.guard || !route.guard())) {
        return route.redirectTo;
      }
      return path;
    },
    [routes]
  );

  useLayoutEffect(() => {
    const handlePopState = (): void => {
      const nextResolvedPath = resolvePath(window.location.pathname);

      if (nextResolvedPath !== window.location.pathname) {
        navigate(nextResolvedPath);
        return;
      }

      setCurrentPath(nextResolvedPath);
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState();

    return (): void => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [resolvePath]);

  const route = routes.find((r) => r.path === currentPath);
  const result = route?.component ?? fallback;

  return result;
};
