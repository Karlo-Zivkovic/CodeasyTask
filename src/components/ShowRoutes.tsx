import { Popup, useMap } from "react-leaflet";
import { Route } from "../types";

interface ShowRoutesProps {
  id: number;
  lat: number;
  lng: number;
  setAllRoutes: React.Dispatch<React.SetStateAction<Route[] | null>>;
  setId: React.Dispatch<React.SetStateAction<number | null>>;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}

export const ShowRoutes = ({
  setId,
  id,
  lat,
  lng,
  setCount,
  setAllRoutes,
}: ShowRoutesProps) => {
  const map = useMap();

  const handleShowRoutes = (id: number, lat: number, lng: number) => {
    setId(id);
    map.flyTo([lat, lng], 6);
    setCount(0);
    setAllRoutes(null);
  };

  return (
    <Popup className="">
      Show me the whole route!{" "}
      <button
        className="transition-colors border border-amber-400 py-1.5 px-4 text-xs rounded-md border-opacity-70 font-semibold hover:bg-amber-600 bg-sky-950 text-white"
        onClick={() => handleShowRoutes(id, lat, lng)}
      >
        Show
      </button>
    </Popup>
  );
};
