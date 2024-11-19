"use client";

import { useState, useEffect } from "react";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PostcodeAutocompleteProps {
  onSelect: (postcode: string, country: string) => void;
}

interface PostcodeResult {
  postcode: string;
  country: string;
  location: string;
}

export default function PostcodeAutocomplete({ onSelect }: PostcodeAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PostcodeResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchPostcodes = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        // This is a simplified example. In a real application, you would:
        // 1. Implement proper debouncing
        // 2. Connect to a real postcode API service
        // 3. Handle rate limiting and errors appropriately
        const response = await fetch(`https://api.zippopotam.us/US/${query}`);
        if (response.ok) {
          const data = await response.json();
          setResults([
            {
              postcode: data["post code"],
              country: data.country,
              location: data.places[0]["place name"]
            }
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch postcodes:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchPostcodes, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="relative">
      <Command className="rounded-lg border shadow-md">
        <div className="flex items-center border-b px-3">
          <Search className="h-4 w-4 shrink-0 opacity-50" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex h-11 w-full rounded-md bg-transparent py-3 px-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter postcode..."
          />
        </div>
        {query.length > 0 && (
          <Command.List className="max-h-[200px] overflow-y-auto p-2">
            {loading && (
              <Command.Loading>
                <div className="flex items-center justify-center p-4">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                </div>
              </Command.Loading>
            )}
            {results.map((result, index) => (
              <Command.Item
                key={index}
                value={result.postcode}
                onSelect={() => onSelect(result.postcode, result.country)}
                className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
              >
                <MapPin className="h-4 w-4" />
                <span>{result.postcode}</span>
                <span className="text-muted-foreground">-</span>
                <span className="text-muted-foreground">{result.location}</span>
              </Command.Item>
            ))}
            {!loading && results.length === 0 && query.length > 0 && (
              <p className="p-4 text-sm text-center text-muted-foreground">
                No postcodes found
              </p>
            )}
          </Command.List>
        )}
      </Command>
    </div>
  );
}