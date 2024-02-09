import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Route } from "../types";


const useFetchAllRoutes = (
  setErrorMsg: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  const [allRoutes, setAllRoutes] = useState<Route[] | null>(null);
  const [fetchAllRoutes, setFetchAllRoutes] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios("http://localhost:3000/allRoutes");
        setAllRoutes(response.data);
      } catch (error) {
        const err = error as AxiosError;
        setErrorMsg(err.message);
        console.error("Error fetching data:", error);
      }
    };

    if (fetchAllRoutes) {
      fetchData();
      setFetchAllRoutes(false);
    }
  }, [fetchAllRoutes, setErrorMsg]);

  return { allRoutes, setAllRoutes, setFetchAllRoutes };
};

export default useFetchAllRoutes;
