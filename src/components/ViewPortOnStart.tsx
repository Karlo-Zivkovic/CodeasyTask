import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { Viewport } from "../types";

interface ViewPortOnStartProps {
  setViewport: React.Dispatch<React.SetStateAction<Viewport | null>>;
}
export const ViewPortOnStart = ({ setViewport }:ViewPortOnStartProps) => {
  const map = useMap();

  const bounds = map.getBounds();
  const southwest = bounds.getSouthWest();
  const northeast = bounds.getNorthEast();

  useEffect(() => {
    setViewport({
      bounds: {
        southwest: { lat: southwest.lat, lng: southwest.lng },
        northeast: { lat: northeast.lat, lng: northeast.lng },
      },
    });
  }, [setViewport, southwest.lat, northeast.lat, southwest.lng, northeast.lng]);

  return null;
};
