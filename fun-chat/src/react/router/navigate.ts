export function navigate(href?: string): void {
  if (window.location.pathname === href) {
    return;
  }
  if (href === undefined) {
    href = window.location.pathname;
  }

  window.history.pushState(null, '', href);

  const navEvent = new PopStateEvent('popstate');
  window.dispatchEvent(navEvent);
}
