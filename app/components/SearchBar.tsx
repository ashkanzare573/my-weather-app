import React from 'react';

interface SearchBarProps {
  location: string;
  setLocation: (val: string) => void;
  activeSuggestion: number;
  setActiveSuggestion: (val: number) => void;
  suggestions: any[];
  selectSuggestion: (suggestion: any) => void;
  handleInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ location, setLocation, activeSuggestion, setActiveSuggestion, suggestions, selectSuggestion, handleInputKeyDown }) => (
  <div className="relative">
    <div className="relative">
      {/* ...search icon and input... */}
      <input
        type="text"
        value={location}
        onChange={e => { setLocation(e.target.value); setActiveSuggestion(-1); }}
        onKeyDown={handleInputKeyDown}
        placeholder="Search for a city in Germany..."
        className="w-full pl-8 pr-4 py-4 rounded-xl border-0 shadow-lg text-lg focus:ring-4 focus:ring-blue-400 focus:outline-none bg-white text-gray-900 transition-all duration-200 placeholder-gray-400"
        autoComplete="off"
      />
    </div>
    {suggestions.length > 0 && (
      <div className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-lg mt-2 z-50 max-h-60 overflow-y-auto border border-gray-200">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => selectSuggestion(suggestion)}
            className={`w-full text-left px-4 py-3 border-b border-gray-100 last:border-b-0 transition-colors duration-150 ${activeSuggestion === index ? 'bg-blue-100 text-blue-900 font-semibold' : 'hover:bg-gray-50'}`}
            tabIndex={-1}
          >
            <div className="font-medium">{suggestion.name}</div>
            <div className="text-sm text-gray-500">{suggestion.admin1}, {suggestion.country}</div>
          </button>
        ))}
      </div>
    )}
  </div>
);

export default SearchBar;
