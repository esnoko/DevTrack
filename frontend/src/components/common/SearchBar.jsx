import { useEffect, useState } from 'react';

const SearchBar = ({ defaultValue = '', loading = false, onSearch }) => {
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

  return (
    <form className="card" onSubmit={handleSubmit}>
      <label className="text-sm font-medium text-primary" htmlFor="github-username">
        GitHub Username
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-primary outline-none ring-0"
          id="github-username"
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="e.g. torvalds"
          disabled={loading}
        />
        <button
          className="rounded-md border border-primary bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-70"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
