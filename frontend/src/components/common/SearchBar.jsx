import { useState } from 'react';

const SearchBar = ({ defaultValue = '', loading = false, onSearch }) => {
  const [inputValue, setInputValue] = useState(defaultValue);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (typeof onSearch === 'function') {
      onSearch(inputValue);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="github-username">GitHub Username</label>
      <div>
        <input
          id="github-username"
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="e.g. torvalds"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
