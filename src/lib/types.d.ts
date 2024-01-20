export type MapLocation = {
  name: string;
  position: {
    lat: number;
    lng: number;
  };
};

export type MapLocationWithDistance = MapLocation & {
  distance: google.maps.Distance;
};
