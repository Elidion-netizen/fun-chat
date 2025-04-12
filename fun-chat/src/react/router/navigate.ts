export function navigate(href: string): void {
  window.history.pushState(null, '', href);

  const navEvent = new PopStateEvent('popstate');
  window.dispatchEvent(navEvent);
}
