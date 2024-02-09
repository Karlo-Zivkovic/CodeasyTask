import {
  GeoJSON,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { Center, GeoJson, Route, Viewport } from "../types";
import { greenIcon, redIcon, yellowIcon } from "../utils/leaftletUtils";
import { ShowRoutes } from "./ShowRoutes";
import { ViewPortOnStart } from "./ViewPortOnStart";
import { LeafletEvent } from "leaflet";
import { useEffect } from "react";

interface MapProps {
  nearestRoutes: { longitude: number; latitude: number; id: number }[] | null;
  allRoutes: Route[] | null;
  userLocation: number[] | null;
  setId: React.Dispatch<React.SetStateAction<number | null>>;
  routeGeoJson: {
    centers: Center[];
    geoJson: GeoJson[];
  } | null;
  setAllRoutes: React.Dispatch<React.SetStateAction<Route[] | null>>;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  setViewport: React.Dispatch<React.SetStateAction<Viewport | null>>;
  setFlyToMyPosition: React.Dispatch<React.SetStateAction<boolean>>;
  viewport: Viewport | null;
  viewportPoints: Center[] | null;
  flyToMyPosition: boolean;
}

export const Map = ({
  flyToMyPosition,
  setViewport,
  nearestRoutes,
  allRoutes,
  userLocation,
  setId,
  routeGeoJson,
  setAllRoutes,
  setCount,
  viewport,
  viewportPoints,
  setFlyToMyPosition,
}: MapProps) => {
  const handleMoveEnd = (event: LeafletEvent) => {
    const map = event.target;
    const bounds = map.getBounds();
    const southwest = bounds.getSouthWest();
    const northeast = bounds.getNorthEast();

    setViewport({
      bounds: {
        southwest: { lat: southwest.lat, lng: southwest.lng },
        northeast: { lat: northeast.lat, lng: northeast.lng },
      },
    });

    if (flyToMyPosition) {
      setFlyToMyPosition(false);
    }
  };

  return (
    <div className="bg-yellow-400 grow relative">
      <MapContainer center={[51.505, -0.09]} zoom={3} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {routeGeoJson &&
          routeGeoJson.geoJson.map((geoJsonData, index) => (
            <div key={index}>
              <GeoJSON
                data={geoJsonData}
                style={() => {
                  return { color: "blue" };
                }}
              />
              {routeGeoJson.centers[index] && (
                <Marker
                  key={`marker-${index}`}
                  position={[
                    routeGeoJson.centers[index].latitude,
                    routeGeoJson.centers[index].longitude,
                  ]}
                  icon={yellowIcon}
                >
                  <Popup>Route point</Popup>
                </Marker>
              )}
            </div>
          ))}
        {!viewport && <ViewPortOnStart setViewport={setViewport} />}
        <CustomMapEvents onMoveEnd={handleMoveEnd} />
        {userLocation && flyToMyPosition && (
          <CenterOnUserLocation userLocation={userLocation} />
        )}
        {viewportPoints?.map((point, index) => (
          <Marker
            position={[point.latitude, point.longitude]}
            icon={yellowIcon}
            key={index}
            zIndexOffset={10}
          >
            <Popup>One of the viewport points</Popup>
          </Marker>
        ))}
        {nearestRoutes?.map((routeCenters, index) => (
          <Marker
            position={[routeCenters.latitude, routeCenters.longitude]}
            icon={greenIcon}
            key={index}
            zIndexOffset={10}
          >
            <ShowRoutes
              setAllRoutes={setAllRoutes}
              setCount={setCount}
              setId={setId}
              id={routeCenters.id}
              lat={routeCenters.latitude}
              lng={routeCenters.longitude}
            />
          </Marker>
        ))}
        {allRoutes?.map((routeCenter, index) => (
          <Marker
            position={[
              routeCenter.coords.latitude,
              routeCenter.coords.longitude,
            ]}
            key={index}
            zIndexOffset={10}
          >
            <ShowRoutes
              setAllRoutes={setAllRoutes}
              setCount={setCount}
              setId={setId}
              id={routeCenter.id}
              lat={routeCenter.coords.latitude}
              lng={routeCenter.coords.longitude}
            />
          </Marker>
        ))}
        {userLocation && (
          <Marker position={[userLocation[0], userLocation[1]]} icon={redIcon}>
            <Popup>You :)</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

interface CustomMapEventsProps {
  onMoveEnd: (event: LeafletEvent) => void;
}

const CustomMapEvents = ({ onMoveEnd }: CustomMapEventsProps) => {
  useMapEvents({
    moveend: onMoveEnd,
  });

  return null;
};
const CenterOnUserLocation = ({ userLocation }: { userLocation: number[] }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([userLocation[0], userLocation[1]], 10);
  }, [userLocation, map]);
  return null;
};
