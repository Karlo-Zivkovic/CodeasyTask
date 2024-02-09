export interface Route {
  createdAt: string;
  id: number;
  pointsOnRoutes: Array<{ point: Point }>;
}

export interface Point {
  createdAt: string;
  id: number;
  region: {
    geometry: {
      coordinates: [number, number][];
    };
    properties: {
      center: [number, number];
    };
  };
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

export interface Route {
  coords: Center;
  id: number;
}
export interface Center {
  latitude: number;
  longitude: number;
}
export interface Viewport {
  bounds: {
    northeast:{
      lat:number,
      lng: number
    }
    southwest:{
      lat:number,
      lng: number
    }

  }
}
