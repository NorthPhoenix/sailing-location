"use client";

import React from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { env } from "~/env";

const GoogleMap = () => {
  return (
    <APIProvider apiKey={env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <Map
        zoom={3}
        center={{ lat: 22.54992, lng: 0 }}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      />
    </APIProvider>
  );
};

export default GoogleMap;
