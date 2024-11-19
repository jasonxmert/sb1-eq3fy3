"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Building2, Globe2, MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Place {
  'place name': string;
  state: string;
  'state abbreviation': string;
  longitude: string;
  latitude: string;
}

interface Location {
  'post code': string;
  country: string;
  'country abbreviation': string;
  places: Place[];
}

interface LocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  location: Location | null;
}

export default function LocationDialog({ isOpen, onClose, location }: LocationDialogProps) {
  if (!location) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapIcon className="h-5 w-5" />
            Location Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
            <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg">{location.places[0]["place name"]}</h3>
              <p className="text-sm text-muted-foreground">
                {location.places[0].state} {location.places[0]["state abbreviation"]}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span className="text-sm font-medium">Postal Code</span>
              </div>
              <p className="text-sm pl-6">{location["post code"]}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Globe2 className="h-4 w-4" />
                <span className="text-sm font-medium">Country</span>
              </div>
              <p className="text-sm pl-6">
                {location.country} ({location["country abbreviation"]})
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Coordinates</h4>
            <div className="grid grid-cols-2 gap-4 pl-6">
              <div>
                <span className="text-sm text-muted-foreground">Latitude</span>
                <p className="text-sm">{location.places[0].latitude}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Longitude</span>
                <p className="text-sm">{location.places[0].longitude}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}