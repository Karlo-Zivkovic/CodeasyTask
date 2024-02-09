import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Center, GeoJson } from "../types";

const useNearestRoutes = (
  count: number,
  setRouteGeoJson: React.Dispatch<
    React.SetStateAction<{
      centers: Center[];
      geoJson: GeoJson[];
    } | null>
  >,
  setErrorMsg: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  const [userLocation, setUserLocation] = useState<number[] | null>(null);
  const [nearestRoutes, setNearestRoutes] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              setUserLocation([latitude, longitude]);

              const response = await axios(
                `http://localhost:3000/findNearestRoutes?lat=${latitude}&lng=${longitude}&count=${count}`,
              );
              setNearestRoutes(response.data);
            },
            (error) => {
              console.error("Error getting user location:", error);
              setErrorMsg(error.message);
            },
          );
        } else {
          console.error("Geolocation is not supported in this browser.");
        }
      } catch (error) {
        const err = error as AxiosError;
        setErrorMsg(err.message);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    setRouteGeoJson(null);
  }, [count, setRouteGeoJson, setErrorMsg]);

  return { userLocation, nearestRoutes };
};

export default useNearestRoutes;
