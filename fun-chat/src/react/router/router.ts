import { useLayoutEffect } from '../hooks/use-leyouteffect';
import { useState } from '../hooks/use-state';
import { navigate } from './navigate';

interface RouterProps {
  routes: Route[];
  fallback: React.ReactNode;
}

interface Route {
  path: string;
  guard?: () => boolean;
  redirectTo?: string;
  component?: React.ReactNode;
}

export const Router = ({ routes, fallback }: RouterProps): React.ReactNode => {
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);

  useLayoutEffect(() => {
    const resolveRoute = (path: string): Route | null => {
      const route = routes.find((r) => r.path === path);
      if (!route) return null;
      if (route.redirectTo && (!route.guard || !route.guard())) {
        return routes.find((r) => r.path === route.redirectTo) ?? null;
      }
      return route;
    };

    const handlePopState = (): void => {
      const nextRoute = resolveRoute(window.location.pathname);

      if (!nextRoute) {
        setCurrentRoute(null);
        return;
      }

      if (nextRoute.path !== window.location.pathname) {
        navigate(nextRoute.path);
        return;
      }

      setCurrentRoute(nextRoute);
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState();

    return (): void => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [routes]);

  const result = currentRoute?.component ?? fallback;
  return result;
};
