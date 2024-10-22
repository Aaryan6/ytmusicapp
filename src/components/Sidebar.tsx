import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onSearch: (query: string) => void;
  recentSearches: string[];
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onSearch,
  recentSearches,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div
      className={`${
        isOpen ? "block" : "hidden"
      } md:block w-64 p-6 bg-black overflow-y-auto`}
    >
      <form onSubmit={handleSubmit} className="mb-6">
        <Input
          type="search"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-2 bg-[#242424] border-none text-white placeholder-gray-400"
        />
        <Button type="submit" className="w-full">
          Search
        </Button>
      </form>
      {recentSearches.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Recent Searches</h3>
          <ul>
            {recentSearches.map((search, index) => (
              <li key={index} className="mb-1">
                <button
                  onClick={() => onSearch(search)}
                  className="text-blue-300 hover:text-blue-100"
                >
                  {search}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
