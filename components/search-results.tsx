import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Building2, Globe2 } from "lucide-react";

interface Place {
  'place name': string;
  state: string;
  'state abbreviation': string;
  longitude: string;
  latitude: string;
}

interface SearchResult {
  'post code': string;
  country: string;
  'country abbreviation': string;
  places: Place[];
}

interface SearchResultsProps {
  results: SearchResult;
}

export default function SearchResults({ results }: SearchResultsProps) {
  if (!results?.places?.length) return null;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe2 className="h-5 w-5" />
            Search Results
          </CardTitle>
          <CardDescription>
            Found {results.places.length} location{results.places.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {results.places.map((place, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{place["place name"]}</p>
                        <p className="text-sm text-muted-foreground">
                          {place.state} {place["state abbreviation"]}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Building2 className="h-4 w-4 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm">
                          Postal Code: {results["post code"]}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {results.country} ({results["country abbreviation"]})
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Longitude: {place.longitude}
                          <br />
                          Latitude: {place.latitude}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}