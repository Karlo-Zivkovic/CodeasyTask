import { Center, GeoJson, Route, Viewport } from "../types";

interface SideBarProps {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  setAllRoutes: React.Dispatch<React.SetStateAction<Route[] | null>>;
  setFetchAllRoutes: React.Dispatch<React.SetStateAction<boolean>>;
  setId: React.Dispatch<React.SetStateAction<number | null>>;
  setRouteGeoJson: React.Dispatch<
    React.SetStateAction<{
      centers: Center[];
      geoJson: GeoJson[];
    } | null>
  >;
  routeGeoJson: {
    centers: Center[];
    geoJson: GeoJson[];
  } | null;
  fetchViewportPoints: () => Promise<void>;
  setViewportPoints: React.Dispatch<React.SetStateAction<Center[] | null>>;
  viewport: Viewport | null;
  errorMsg: string | null;
  handleFindMe: () => void;
}
export const SideBar = ({
  handleFindMe,
  count,
  setCount,
  setAllRoutes,
  setFetchAllRoutes,
  routeGeoJson,
  setRouteGeoJson,
  setId,
  fetchViewportPoints,
  setViewportPoints,
  viewport,
  errorMsg,
}: SideBarProps) => {
  const handleClearRouteGeoJson = () => {
    setRouteGeoJson(null);
    setId(null);
  };
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCount(+e.target.value);
    setId(null);
  };

  return (
    <div className="bg-sky-950 text-white p-6 w-[28%] flex flex-col items-center gap-3">
      <h1 className="font-semibold text-2xl tracking-widest my-4 text-amber-400">
        Find Your Journey
      </h1>
      <div className="grid gap-3 items-center justify-center grid-cols-2 grid-rows-2 w-full mb-4">
        <div className="flex gap-3 items-center text-sm md:text-base">
          <img
            className="h-7 w-4"
            src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png"
            alt="marker"
          />
          <p>You</p>
        </div>
        <div className="flex gap-3 items-center text-sm md:text-base">
          <img
            className="h-7 w-4"
            src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png"
            alt="marker"
          />
          <p>All tours</p>
        </div>
        <div className="flex gap-3 items-center text-sm md:text-base">
          <img
            className="h-7 w-4"
            src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png"
            alt="marker"
          />
          <p>Nearest tours</p>
        </div>
        <div className="flex gap-3 items-center text-sm md:text-base">
          <img
            className="h-7 w-4"
            src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png"
            alt="marker"
          />
          <p>Tour points</p>
        </div>
      </div>
      {errorMsg && (
        <div className="p-4 border border-red-500 bg-red-400 rounded-md flex flex-col gap-2 w-full">
          <p className="font-bold">Error: {errorMsg}</p>
          <p>Please try again later.</p>
        </div>
      )}
      <div className="p-4 border border-gray-500 rounded-md flex flex-col gap-2 w-full">
        <p>
          Find me{" "}
          <select
            value={count}
            onChange={handleSelectChange}
            className="cursor-pointer transition-all duration-1000 disabled:opacity-50 disabled:cursor-not-allowed bg-sky-950 border border-amber-400 rounded-md"
            disabled={errorMsg ? true : false}
          >
            <option value="0">0</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>{" "}
          closest tours!
        </p>
        <div className="flex gap-2 self-end flex-col md:flex-row w-full md:justify-end">
          <button
            onClick={() => setCount(0)}
            className="transition-colors border border-red-400 py-1.5 px-4 text-xs rounded-md border-opacity-70 font-semibold hover:bg-red-700"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="p-4 border border-gray-500 rounded-md flex flex-col gap-2 w-full">
        <p>Find all tours!</p>
        <div className="flex gap-2 self-end flex-col md:flex-row w-full md:justify-end">
          <button
            onClick={() => setFetchAllRoutes(true)}
            disabled={errorMsg ? true : false}
            className="transition-colors border border-amber-400 py-1.5 px-4 text-xs rounded-md border-opacity-70 font-semibold hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Find
          </button>
          <button
            onClick={() => setAllRoutes(null)}
            className="transition-colors border border-red-400 py-1.5 px-4 text-xs rounded-md border-opacity-70 font-semibold hover:bg-red-700"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="p-4 border border-gray-500 rounded-md flex flex-col gap-2 w-full">
        <p>Find points in viewport!</p>
        <div className="flex gap-2 self-end flex-col md:flex-row w-full md:justify-end">
          <button
            onClick={() => fetchViewportPoints()}
            disabled={!viewport || errorMsg ? true : false}
            className="transition-colors border border-amber-400 py-1.5 px-4 text-xs rounded-md border-opacity-70 font-semibold hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Find
          </button>
          <button
            onClick={() => setViewportPoints(null)}
            className="transition-colors border border-red-400 py-1.5 px-4 text-xs rounded-md border-opacity-70 font-semibold hover:bg-red-700"
          >
            Clear
          </button>
        </div>
      </div>
      {routeGeoJson && (
        <div className="p-4 border border-gray-500 rounded-md flex flex-col gap-2 w-full">
          <p>Current tour points of interest</p>
          <div className="flex gap-2 self-end flex-col md:flex-row w-full md:justify-end">
            <button
              onClick={handleClearRouteGeoJson}
              className="transition-colors border border-red-400 py-1.5 px-4 text-xs rounded-md border-opacity-70 font-semibold hover:bg-red-700"
            >
              Clear
            </button>
          </div>
        </div>
      )}
      <button
        className="border border-amber-400 rounded-md px-4 py-1 hover:border-amber-600"
        onClick={() => handleFindMe()}
      >
        Where am I?
      </button>
      <img className="mt-auto" src="logo-white.4da930f.webp" alt="logo" />
    </div>
  );
};
