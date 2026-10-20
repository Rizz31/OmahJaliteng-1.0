/**
 * Resolves static asset paths taking into account Vite base URL
 * Essential for subpath deployments like GitHub Pages (e.g. https://username.github.io/repo-name/)
 */
export function getAssetUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const base = import.meta.env.BASE_URL || './';
  const cleanPath = path.replace(/^\.?\//, '');
  if (base.endsWith('/')) {
    return `${base}${cleanPath}`;
  }
  return `${base}/${cleanPath}`;
}
