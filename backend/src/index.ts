import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";
import {
  isPointInPolygon,
  orderByDistance,
  getCenter,
  getDistance,
  getLongitude,
  getLatitude,
} from "geolib";
import { CentersWithId, GeoJsonTour, Point, Route } from "../types.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.use(cors());

let allRoutesData = null;
let centerPerRoute = null;

async function fetchAllRoutesData() {
  try {
    const response = await axios.get(
      "https://chat.codeasy.com/api/job-application",
    );
    allRoutesData = response.data;

    const centersWithId = allRoutesData
      .map(
        (route: Route) =>
          route.pointsOnRoutes
            ?.map((point) => ({
              id: route.id,
              coords: getCenter(point.point.region.geometry.coordinates[0]),
            }))
            .filter((center) => center !== undefined),
      )
      .filter((center: CentersWithId[]) => center && center.length > 0)
      .map((center: CentersWithId[]) => ({
        id: center[0].id,
        coords: getCenter(center.map((item) => item.coords)),
      }));

    centerPerRoute = centersWithId;
  } catch (error) {
    console.error("Error fetching all routes data:", error.message);
    throw new Error("Failed to fetch all routes data");
  }
}

app.use(async (req, res, next) => {
  if (!allRoutesData || !centerPerRoute) {
    try {
      await fetchAllRoutesData();
    } catch (error) {
      return next(error); 
    }
  }
  next();
});

app.get("/allRoutes", async (req, res, next) => {
  try {
    res.json(centerPerRoute);
  } catch (error) {
    console.error("Error sending all routes data:", error.message);
    next(error);
  }
});

app.get("/route/:id", async (req, res, next) => {
  try {
    const route = allRoutesData.find(
      (item: Route) => item.id === +req.params.id,
    );

    const geoJsonData: GeoJsonTour = {
      centers: route.pointsOnRoutes.map((point: Point) =>
        getCenter(point.point.region.geometry.coordinates[0]),
      ),
      geoJson: route.pointsOnRoutes
        .map((point: Point) => point.point.region)
        .flat(),
    };

    res.json(geoJsonData);
  } catch (error) {
    console.error("Error sending all routes data:", error.message);
    next(error);
  }
});

app.get("/findNearestRoutes", async (req, res, next) => {
  try {
    const { lat, lng, count } = req.query;

    const nearestRoutes = orderByDistance(
      { latitude: +lat, longitude: +lng },
      centerPerRoute.map((item: CentersWithId) => ({
        ...item.coords,
        id: item.id,
      })),
    ).slice(0, +count);

    const distanceFromUser = nearestRoutes.map((route) =>
      getDistance(
        { latitude: +lat, longitude: +lng },
        {
          latitude: getLatitude(route),
          longitude: getLongitude(route),
        },
      ),
    );

    res.json({ nearestRoutes, distanceFromUser });
  } catch (error) {
    console.error("Error fetching external data:", error.message);
    next(error);
  }
});

app.get("/findPointsInViewport", (req, res) => {
  const { lng1, lat1, lng2, lat2 } = req.query;

  if (!lng1 || !lat1 || !lng2 || !lat2) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  const viewportPolygon = [
    { latitude: +lat1, longitude: +lng1 },
    { latitude: +lat1, longitude: +lng2 },
    { latitude: +lat2, longitude: +lng2 },
    { latitude: +lat2, longitude: +lng1 },
  ];

  const pointsInViewport = allRoutesData
    .map(
      (route: Route) =>
        route.pointsOnRoutes
          ?.map((point) =>
            getCenter(point.point.region.geometry.coordinates[0]),
          )
          .filter((center) => center !== undefined),
    )
    .filter((center: CentersWithId[]) => center && center.length > 0)
    .flat()
    .filter((point: { latitude: number; longitude: number }) =>
      isPointInPolygon(
        { latitude: point.latitude, longitude: point.longitude },
        viewportPolygon,
      ),
    );

  res.json(pointsInViewport);
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
