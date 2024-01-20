"use client";

import { Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import type { MapLocation } from "~/lib/types";

type GoogleMapProps = {
  locations?: MapLocation[];
};

const GoogleMap: React.FC<GoogleMapProps> = ({ locations }) => {
  return (
    <Map
      mapId={"DEMO_MAP_ID"}
      zoom={4}
      center={{ lat: 39.8283, lng: -98.5795 }}
      gestureHandling={"greedy"}
      disableDefaultUI={true}
    >
      {!!locations &&
        locations.map((location, index) => (
          <CustomMarker key={index} location={location} />
        ))}
    </Map>
  );
};

const CustomMarker: React.FC<{ location: MapLocation }> = ({ location }) => {
  return <AdvancedMarker title={location.name} position={location.position} />;
};

export default GoogleMap;
