import React from "react";

type SearchBarProps = {
  searchQuery: string;
  onSearch: (query: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearch }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    console.log("Search Query:", query);
    onSearch(query);
  };
  return (
    <div className="relative w-full mb-4">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search tasks..."
        className="w-full p-3 pl-10 rounded-lg text-lg border border-gray-300 focus:outline-none focus:border-blue-500"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35m1.35-6.65a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
};

export default SearchBar;
