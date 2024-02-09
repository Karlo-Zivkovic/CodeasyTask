import { useState } from "react";
import { SideBar } from "./components/SideBar";
import { Map } from "./components/Map";
import useNearestRoutes from "./hooks/useNearestRoutes";
import useFetchAllRoutes from "./hooks/useFetchAllRoutes";
import useFetchRouteGeoJson from "./hooks/useFetchRouteGeoJson";
import axios, { AxiosError } from "axios";
import { Center, Viewport } from "./types";

function App() {
  const [id, setId] = useState<number | null>(null);
  const [count, setCount] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { routeGeoJson, setRouteGeoJson } = useFetchRouteGeoJson(
    id,
    setErrorMsg,
  );
  const { allRoutes, setFetchAllRoutes, setAllRoutes } =
    useFetchAllRoutes(setErrorMsg);
  const { userLocation, nearestRoutes } = useNearestRoutes(
    count,
    setRouteGeoJson,
    setErrorMsg,
  );
  const [viewportPoints, setViewportPoints] = useState<Center[] | null>(null);
  const [viewport, setViewport] = useState<Viewport | null>(null);
  const [flyToMyPosition, setFlyToMyPosition] = useState<boolean>(false);

  const fetchViewportPoints = async () => {
    try {
      if (viewport) {
        const { southwest, northeast } = viewport.bounds;

        const response = await axios(
          `http://localhost:3000/findPointsInViewport?lat1=${southwest.lat}&lng1=${southwest.lng}&lat2=${northeast.lat}&lng2=${northeast.lng}`,
        );

        setViewportPoints(response.data);
      }
    } catch (error) {
      const err = error as AxiosError;
      setErrorMsg(err.message);
      console.error("Error fetching data:", error);
    }
  };

  const handleFindMe = () => {
    setFlyToMyPosition(true);
  };
  return (
    <div className="flex h-screen">
      <SideBar
        handleFindMe={handleFindMe}
        setViewportPoints={setViewportPoints}
        fetchViewportPoints={fetchViewportPoints}
        setId={setId}
        count={count}
        setCount={setCount}
        setAllRoutes={setAllRoutes}
        setFetchAllRoutes={setFetchAllRoutes}
        setRouteGeoJson={setRouteGeoJson}
        routeGeoJson={routeGeoJson}
        viewport={viewport}
        errorMsg={errorMsg}
      />
      <Map
        setFlyToMyPosition={setFlyToMyPosition}
        flyToMyPosition={flyToMyPosition}
        userLocation={userLocation}
        allRoutes={allRoutes}
        nearestRoutes={nearestRoutes?.["nearestRoutes"] || null}
        setId={setId}
        routeGeoJson={routeGeoJson}
        viewport={viewport}
        setCount={setCount}
        setAllRoutes={setAllRoutes}
        setViewport={setViewport}
        viewportPoints={viewportPoints}
      />
    </div>
  );
}

export default App;
