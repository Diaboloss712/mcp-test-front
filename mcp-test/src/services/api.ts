export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function api(path: string): string {
  return `${API_BASE_URL}${path}`;
}