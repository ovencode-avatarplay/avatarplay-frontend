const STORAGE_KEY = 'recent_searches';
const MAX_ITEMS = 10;

export function getRecentSearches(): string[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(keyword: string) {
  if (!keyword.trim()) return;
  const prev = getRecentSearches().filter(item => item !== keyword);
  const next = [keyword, ...prev].slice(0, MAX_ITEMS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
