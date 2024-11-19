"use client";

import { useState } from "react";
import { Search, MapPin, Globe2, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import SearchResults from "@/components/search-results";
import CountrySelector from "@/components/country-selector";
import LocationDialog from "@/components/location-dialog";
import PostcodeAutocomplete from "@/components/postcode-autocomplete";

interface Place {
  'place name': string;
  longitude: string;
  latitude: string;
  state: string;
  'state abbreviation': string;
}

interface ZippopotamResponse {
  'post code': string;
  country: string;
  'country abbreviation': string;
  places: Place[];
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("AU");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ZippopotamResponse | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (searchQuery = query, searchCountry = country) => {
    if (!searchQuery.trim()) {
      toast({
        title: "Error",
        description: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResults(null);
    
    try {
      const cleanQuery = searchQuery.trim().replace(/[^\w\s-]/g, "");
      const baseUrl = "https://api.zippopotam.us";
      const apiUrl = `${baseUrl}/${searchCountry.toLowerCase()}/${cleanQuery}`;

      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: "No results found",
            description: `No results found for ${cleanQuery} in the selected country`,
          });
          return;
        }
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data: ZippopotamResponse = await response.json();
      
      if (data && data.places && data.places.length > 0) {
        setResults(data);
        setIsDialogOpen(true);
      } else {
        toast({
          title: "No results found",
          description: "Try a different search term or country",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4 flex items-center justify-center gap-2">
            <Globe2 className="h-8 w-8" />
            Search By Postcode
          </h1>
          <p className="text-muted-foreground text-lg">
            Search postal codes and locations worldwide
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Options</CardTitle>
            <CardDescription>
              Choose your preferred search method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="postcode" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="postcode">
                  <MapPin className="h-4 w-4 mr-2" />
                  By Postcode
                </TabsTrigger>
                <TabsTrigger value="country">
                  <Globe2 className="h-4 w-4 mr-2" />
                  By Country
                </TabsTrigger>
                <TabsTrigger value="location">
                  <Building2 className="h-4 w-4 mr-2" />
                  By Location
                </TabsTrigger>
              </TabsList>

              <TabsContent value="postcode" className="space-y-4">
                <PostcodeAutocomplete onSelect={(postcode, country) => handleSearch(postcode, country)} />
              </TabsContent>

              <TabsContent value="country" className="space-y-4">
                <CountrySelector
                  value={country}
                  onChange={(value) => setCountry(value)}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter city or region..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button onClick={() => handleSearch()} disabled={loading}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Searching...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        Search
                      </span>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="location" className="space-y-4">
                <CountrySelector
                  value={country}
                  onChange={(value) => setCountry(value)}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter location name..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button onClick={() => handleSearch()} disabled={loading}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Searching...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        Search
                      </span>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {results && <SearchResults results={results} />}
        <LocationDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          location={results}
        />
      </div>
    </main>
  );
}