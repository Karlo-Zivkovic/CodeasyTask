import { GeolibInputCoordinates } from "geolib/es/types";

export interface Route {
  id: number;
  pointsOnRoutes: Point[];
}

export interface GeoJsonTour {
  centers: { longitude: number; latitude: number }[];
  geoJson: GeoJson[];
}

export interface GeoJson {
  geometry: {
    coordinates: number[][];
    properties: {
      center: number[];
    };
  };
  type:
    | "Point"
    | "MultiPoint"
    | "LineString"
    | "MultiLineString"
    | "Polygon"
    | "MultiPolygon"
    | "GeometryCollection"
    | "Feature"
    | "FeatureCollection";
}

export interface Point {
  point: {
    region: {
      type: string;
      geometry: {
        coordinates: GeolibInputCoordinates;
      };
    };
  };
}

export interface CentersWithId {
  id: number;
  coords: GeolibInputCoordinates;
}
