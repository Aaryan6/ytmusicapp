const MAX_RECENT_SEARCHES = 5;

export const getRecentSearches = (): string[] => {
  if (typeof window === "undefined") return [];
  const searches = localStorage.getItem("recentSearches");
  return searches ? JSON.parse(searches) : [];
};

export const addRecentSearch = (query: string): void => {
  if (typeof window === "undefined") return;
  const searches = getRecentSearches();
  const updatedSearches = [query, ...searches.filter((s) => s !== query)].slice(
    0,
    MAX_RECENT_SEARCHES
  );
  localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
};
