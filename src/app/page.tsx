"use client";

import GoogleMap from "~/components/Map";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { CardContent, Card } from "~/components/ui/card";
import Image from "next/image";
import { z } from "zod";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { MapLocation, MapLocationWithDistance } from "~/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";

const LocationOrderedList: React.FC<{
  locations: MapLocationWithDistance[];
}> = ({ locations }) => {
  return (
    <ol className="grid gap-4">
      {locations.map((location, index) => (
        <li key={index} className="w-full">
          <LocationListEntry index={index} location={location} />
        </li>
      ))}
    </ol>
  );
};

const LocationListEntry: React.FC<{
  location: MapLocationWithDistance;
  index: number;
}> = ({ location, index }) => {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <Image
          alt="Event 1"
          className="rounded-lg object-cover"
          height={80}
          src={`https://picsum.photos/80?random=${index}`}
          style={{
            aspectRatio: "80/80",
            objectFit: "cover",
          }}
          width={80}
        />
        <div className="space-y-1">
          <h3 className="font-semibold">{location.name}</h3>
          <p className="text-sm">Distance: {location.distance.text}</p>
          {/* <p className="text-sm">Date: January 25, 2024</p> */}
        </div>
      </CardContent>
    </Card>
  );
};

const ZipcodeForm: React.FC = () => {
  const router = useRouter();
  const params = useSearchParams();
  const formSchema = useMemo(
    () =>
      z.object({
        zipcode: z.string().min(5).max(5),
      }),
    [],
  );
  // Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      zipcode: params.get("zipcode") ?? "",
    },
  });

  // Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (!values.zipcode) return;
    router.push("/?zipcode=" + values.zipcode);
    console.log(values);
  }
  return (
    <>
      <h1 className="text-center text-2xl font-bold">Enter your Zipcode</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="zipcode"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="sr-only">Zipcode</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your zipcode" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};
// locations with random different positions in US
const locations = [
  {
    name: "Deez Nuts",
    position: {
      lat: 39.8283,
      lng: -98.5795,
    },
  },
  {
    name: "Your Mom",
    position: {
      lat: 40.7128,
      lng: -74.006,
    },
  },
  {
    name: "Blyt City",
    position: {
      lat: 37.7749,
      lng: -122.4194,
    },
  },
];

const Locations = () => {
  const params = useSearchParams();
  const zipcode = params.get("zipcode");
  const geocoding = useMapsLibrary("geocoding");
  const markerLib = useMapsLibrary("marker");
  const map = useMap();
  const [userLocation, setUserLocation] = useState<google.maps.LatLng>(null!);
  const [orderedLocations, setOrderedLocations] = useState<
    MapLocationWithDistance[]
  >([]);
  const userMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement>(null!);
  useEffect(() => {
    if (!zipcode) return;
    if (!geocoding) return;
    if (!map) return;
    if (!markerLib) return;
    // transform zipcode to lat/lng
    const geocoder = new geocoding.Geocoder();
    void geocoder.geocode({ address: zipcode }, (results, status) => {
      if (status !== geocoding.GeocoderStatus.OK) {
        console.error(
          "Geocode was not successful for the following reason: " + status,
        );
        return;
      }
      const location = results?.[0]?.geometry.location;
      if (!location) return;
      console.log(location);
      setUserLocation(location);
      // add marker to map
      if (userMarkerRef.current) {
        userMarkerRef.current.position = location;
      } else {
        userMarkerRef.current = new markerLib.AdvancedMarkerElement({
          position: location,
          map,
          title: "Your Location",
          content: new markerLib.PinElement({
            glyphColor: "blue",
            background: "white",
            borderColor: "gray",
          }).element,
        });
      }

      map.panTo(location);
      map.setZoom(6);
      google.maps
        .importLibrary("routes")
        .then((lib) => {
          const routes = lib as google.maps.RoutesLibrary;
          const service = new routes.DistanceMatrixService();
          void service.getDistanceMatrix(
            {
              origins: [location],
              destinations: locations.map((location) => location.position),
              travelMode: google.maps.TravelMode.DRIVING,
              unitSystem: google.maps.UnitSystem.IMPERIAL,
            },
            (response, status) => {
              if (status !== routes.DistanceMatrixStatus.OK) {
                console.error(
                  "Geocode was not successful for the following reason: " +
                    status,
                );
                return;
              }
              if (!response) {
                console.error("Geocode response does not exist.");
                return;
              }
              console.log(response);
              const temp = response.rows[0]?.elements
                .map((element, index) => ({
                  ...locations[index]!,
                  distance: element.distance,
                }))
                .sort((a, b) => a.distance.value - b.distance.value);
              if (!temp) return;
              setOrderedLocations(temp);
            },
          );
        })
        .catch(console.error);
    });
  }, [zipcode, geocoding, map, markerLib]);

  if (!zipcode || !geocoding || !map || !markerLib) {
    return null;
  }

  return (
    <div className="mt-4 w-full">
      <h2 className="text-xl font-bold">Locations Found:</h2>
      <LocationOrderedList locations={orderedLocations} />
    </div>
  );
};

export default function Home() {
  return (
    <div className="flex h-screen w-full flex-col md:flex-row">
      <div className="flex w-full flex-col items-stretch gap-3 p-4 md:w-1/3">
        <ZipcodeForm />
        <Locations />
      </div>
      <div className="h-full w-full">
        <GoogleMap locations={locations} />
      </div>
    </div>
  );
}
