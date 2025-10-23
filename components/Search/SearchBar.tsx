"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import Image from "next/image";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  sellerName: string;
  image: string;
  rating: number;
}

interface SearchBarProps {
  className?: string;
  mobile?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ className = "", mobile = false }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isExpanded, setIsExpanded] = useState(mobile);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data);
        setIsOpen(data.length > 0);
        setIsLoading(false);
      } catch (error) {
        console.error("Search error:", error);
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (!mobile) setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobile]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
        if (!mobile) setIsExpanded(false);
        inputRef.current?.blur();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        handleSelectResult(results[selectedIndex]);
      }
    },
    [results, selectedIndex, mobile]
  );

  const handleSelectResult = (result: SearchResult) => {
    router.push(`/prompt/${result.id}`);
    setQuery("");
    setIsOpen(false);
    setResults([]);
    if (!mobile) setIsExpanded(false);
  };

  const handleExpand = () => {
    setIsExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div
        className={`flex items-center gap-2 bg-[var(--input-bg)] border border-[var(--border-color)] rounded-full transition-all duration-300 ${
          isExpanded ? "w-full md:w-[400px]" : "w-10 md:w-10"
        } h-10 overflow-hidden`}
      >
        {!isExpanded && !mobile && (
          <button
            onClick={handleExpand}
            className="flex items-center justify-center w-full h-full text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors"
            aria-label="Open search"
          >
            <Search className="w-5 h-5" />
          </button>
        )}

        {(isExpanded || mobile) && (
          <>
            <Search className="w-5 h-5 ml-4 text-[var(--text-secondary)] flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search prompts..."
              className="flex-1 bg-transparent outline-none text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] text-sm"
            />
            {query && (
              <button
                onClick={handleClear}
                className="mr-2 p-1 hover:bg-[var(--border-color)] rounded-full transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-[var(--text-secondary)]" />
              </button>
            )}
            {isLoading && (
              <Loader2 className="w-4 h-4 mr-3 text-[var(--accent-primary)] animate-spin" />
            )}
          </>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (isExpanded || mobile) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--card-bg)] backdrop-blur-lg border border-[var(--border-color)] rounded-xl shadow-2xl z-[200] max-h-[400px] overflow-y-auto">
          {results.map((result, index) => (
            <button
              key={result.id}
              onClick={() => handleSelectResult(result)}
              className={`w-full p-3 flex items-center gap-3 hover:bg-[var(--bg-secondary)] transition-colors border-b border-[var(--border-color)] last:border-b-0 ${
                index === selectedIndex ? "bg-[var(--bg-secondary)]" : ""
              }`}
            >
              {/* Image */}
              <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--bg-tertiary)]">
                <Image
                  src={result.image}
                  alt={result.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>

              {/* Content */}
              <div className="flex-1 text-left min-w-0">
                <h4 className="font-semibold text-[var(--text-primary)] truncate text-sm">
                  {result.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-block px-2 py-0.5 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] dark:bg-[#16c252]/10 dark:text-[#16c252] rounded-full text-xs font-medium">
                    {result.category}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    by {result.sellerName}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex-shrink-0 text-right">
                <div className="font-bold text-[var(--accent-primary)] dark:text-[#16c252]">
                  ${result.price}
                </div>
                {result.rating > 0 && (
                  <div className="text-xs text-[var(--text-secondary)] mt-1">
                    ★ {result.rating.toFixed(1)}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && results.length === 0 && query.trim() && !isLoading && (isExpanded || mobile) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--card-bg)] backdrop-blur-lg border border-[var(--border-color)] rounded-xl shadow-2xl z-[200] p-6 text-center">
          <div className="text-[var(--text-secondary)] text-sm">
            <Search className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="font-medium">No prompts found</p>
            <p className="text-xs mt-1">Try different keywords</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

