/** Maps a page path to its link-preview card: '/' → 'index', '/work/tallyline' → 'work/tallyline'. */
export function ogSlug(pathname: string): string {
  const p = pathname.replace(/\/+$/, '').replace(/^\/+/, '').replace(/\.html$/, '');
  if (!p || p === '404') return 'index';
  return p;
}
