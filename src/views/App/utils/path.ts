export function toBasePath(path: string): string {
  const urlString = path.startsWith('http')
    ? path
    : `https://${trimSlashes(path)}`;

  try {
    const url = new URL(urlString);
    return url.hostname;
  } catch {
    const withoutProtocol = urlString.replace(/^https?:\/\//, '');
    return withoutProtocol.split('/')[0];
  }
}

export function trimSlashes(value: string): string {
  while (value.startsWith('/')) {
    value = value.substring(1);
  }

  return value;
}
