import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { GeoJson, Center } from "../types";

const useFetchRouteGeoJson = (
  id: number | null,
  setErrorMsg: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  const [routeGeoJson, setRouteGeoJson] = useState<{
    centers: Center[];
    geoJson: GeoJson[];
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const response = await axios(`http://localhost:3000/route/${id}`);
          setRouteGeoJson(response.data);
        }
      } catch (error) {
        const err = error as AxiosError;
        setErrorMsg(err.message);
        console.error("Error fetching data:", error);
      }
    };
    if (id) {
      fetchData();
    }
  }, [id, setErrorMsg]);

  return { routeGeoJson, setRouteGeoJson };
};

export default useFetchRouteGeoJson;
