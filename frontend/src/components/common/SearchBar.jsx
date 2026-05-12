import { useEffect, useState } from 'react';

/**
 * compact=true  → slim inline form for the top nav
 * compact=false → full card with label (default)
 */
const SearchBar = ({ defaultValue = '', loading = false, onSearch, compact = false }) => {
  const [inputValue, setInputValue] = useState(defaultValue);

  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (typeof onSearch === 'function') {
      onSearch(inputValue);
    }
  };

  if (compact) {
    return (
      <form className="flex items-center gap-2 w-full" onSubmit={handleSubmit}>
        <input
          className="flex-1 min-w-0 rounded-md border bg-surface px-3 py-1.5 text-sm text-primary outline-none transition-shadow focus:ring-2 focus:ring-accent/30 disabled:opacity-60"
          style={{ borderColor: 'var(--color-line)' }}
          id="github-username-nav"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search GitHub username…"
          disabled={loading}
        />
        <button
          className="flex-shrink-0 rounded-md px-3 py-1.5 text-sm font-medium text-white transition-opacity disabled:opacity-60"
          style={{ backgroundColor: 'var(--color-accent)' }}
          type="submit"
          disabled={loading}
        >
          {loading ? '…' : 'Go'}
        </button>
      </form>
    );
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <label className="text-sm font-medium text-primary" htmlFor="github-username">
        GitHub Username
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          className="w-full rounded-md border px-3 py-2 text-sm text-primary outline-none transition-shadow focus:ring-2 focus:ring-accent/30"
          style={{ borderColor: 'var(--color-line)', backgroundColor: 'var(--color-surface)' }}
          id="github-username"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="e.g. torvalds"
          disabled={loading}
        />
        <button
          className="rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          style={{ backgroundColor: 'var(--color-accent)' }}
          type="submit"
          disabled={loading}
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
