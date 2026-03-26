import { useState } from "react";
import { stores } from "../data/stores";
import { getDistance } from "../utils/distance";
import { useNavigate } from "react-router-dom";

const StoreFinder = () => {
  const [results, setResults] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFind = () => {
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        const computed = stores.map((store) => {
          const distance = getDistance(
            latitude,
            longitude,
            store.lat,
            store.lng
          );

          return { ...store, distance };
        });

        computed.sort((a, b) => a.distance - b.distance);

        setResults(computed);
        setSelectedStore(computed[0]);
        setLoading(false);
      },
      () => {
        alert("Please allow location access");
        setLoading(false);
      }
    );
  };

  const handleOrder = (store) => {
    navigate("/menu", { state: { store } });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">

      {/* LEFT SIDE */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Find Nearest Store</h2>

        <button
          onClick={handleFind}
          className="w-full bg-black text-white py-2 rounded-lg hover:opacity-90 transition"
        >
          📍 Use My Location
        </button>

        {loading && (
          <p className="mt-3 text-gray-500">Finding nearest store...</p>
        )}

        <div className="mt-4 space-y-3">
          {results.map((store, index) => (
            <div
              key={store.id}
              onClick={() => setSelectedStore(store)}
              className={`p-4 rounded-xl border cursor-pointer transition-all
              ${
                selectedStore?.id === store.id
                  ? "border-black bg-gray-100"
                  : "border-gray-200 bg-white hover:shadow-md"
              }`}
            >
              {/* HEADER */}
              <div className="text-gray-600 flex justify-between items-center">
                <h3 className="font-semibold text-lg">
                  {store.name} {index === 0 && "⭐"}
                </h3>
                <span className="text-sm text-gray-500">
                  {store.distance.toFixed(2)} km
                </span>
              </div>

              {/* ADDRESS */}
              <p className="text-sm text-gray-600 mt-1">
                {store.address}
              </p>

              {/* BUTTON */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOrder(store);
                }}
                className="mt-3 bg-orange-500 text-white px-4 py-1.5 rounded-md text-sm hover:bg-orange-600 transition"
              >
                Order Here
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE MAP */}
      <div className="w-full h-[400px] md:h-auto">
        {selectedStore ? (
          <iframe
            title="map"
            src={`https://maps.google.com/maps?q=${selectedStore.lat},${selectedStore.lng}&z=15&output=embed`}
            className="w-full h-full rounded-xl border"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full border border-dashed rounded-xl text-gray-400">
            Select a store to view location
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreFinder;