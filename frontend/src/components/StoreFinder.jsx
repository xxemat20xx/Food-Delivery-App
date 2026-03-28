import { useState, useEffect } from "react";
import { getDistance } from "../utils/distance";
import { useNavigate } from "react-router-dom";
import { useStoreStore } from "../store/useStoreStore";
import { MapPin, Navigation, Star, Clock, Phone, ChevronRight } from "lucide-react";

const StoreFinder = () => {
  const { stores, fetchStores, loading } = useStoreStore();

  const [results, setResults] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const today = days[new Date().getDay()]; // get current day in lowercase

  const navigate = useNavigate();

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleFind = () => {
    setLocationLoading(true);
    setLocationError(null);

    if (!stores.length) {
      setLocationError("No stores available. Please try again later.");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        const computed = stores.map((store) => ({
          ...store,
          distance: getDistance(latitude, longitude, store.lat, store.lng),
        }));

        computed.sort((a, b) => a.distance - b.distance);

        setResults(computed);
        setSelectedStore(computed[0]);
        setLocationLoading(false);
      },
      (err) => {
        let errorMsg = "Unable to get your location.";
        if (err.code === 1) errorMsg = "Location access denied. Please enable location services.";
        if (err.code === 2) errorMsg = "Location unavailable. Check your device settings.";
        setLocationError(errorMsg);
        setLocationLoading(false);
      }
    );
  };

  const handleOrder = (store) => {
    navigate("/menu", { state: { store } });
  };

  const formatDistance = (km) => `${km.toFixed(1)} km`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 bg-black text-white">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          Find Your Nearest Store
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          Discover the closest location and start ordering
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Store List */}
        <div className="space-y-6">
          {/* Location Button */}
          <button
            onClick={handleFind}
            disabled={locationLoading || loading}
            className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {locationLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                <span>Locating you...</span>
              </>
            ) : (
              <>
                <Navigation className="h-5 w-5" />
                <span>📍 Use My Location</span>
              </>
            )}
          </button>

          {/* Loading / Error States */}
          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-pulse text-gray-400">Loading stores...</div>
            </div>
          )}

          {locationError && (
            <div className="bg-red-900/50 border border-red-700 rounded-xl p-4 text-red-200">
              <p className="font-medium">⚠️ {locationError}</p>
              <button
                onClick={handleFind}
                className="mt-2 text-sm underline hover:text-red-100"
              >
                Try again
              </button>
            </div>
          )}

          {/* Store List */}
          {results.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                Stores near you
              </h2>
              <div className="space-y-3">
                {results.map((store, index) => (
                  <div
                    key={store._id}
                    onClick={() => setSelectedStore(store)}
                    className={`group relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                      selectedStore?._id === store._id
                        ? "border-orange-500 bg-gray-800 shadow-lg"
                        : "border-gray-800 bg-gray-900 hover:border-gray-700 hover:shadow-md"
                    }`}
                  >
                    {/* Badge for nearest store */}
                    {index === 0 && (
                      <div className="absolute top-3 right-3 bg-yellow-500 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        Nearest
                      </div>
                    )}

                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">
                          {store.name}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          {store.address}
                        </p>
                        {/* Additional store details (if available) */}
                        <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500">
                          {store.distance && (
                            <span className="flex items-center gap-1">
                              <Navigation className="h-4 w-4" />
                              {formatDistance(store.distance)}
                            </span>
                          )}
                          {store.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {store.phone}
                            </span>
                          )}
                        {store.hours && store.hours[today] && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {store.hours[today].open} - {store.hours[today].close}
                          </span>
                        )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOrder(store);
                        }}
                        className="flex items-center gap-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-500 transition-colors text-sm font-medium shadow-sm"
                      >
                        Order
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && results.length === 0 && !locationError && (
            <div className="text-center py-12 bg-gray-900 rounded-2xl border border-gray-800">
              <MapPin className="h-12 w-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">Click the button above to find stores near you.</p>
            </div>
          )}
        </div>

        {/* Right Column - Map */}
        <div className="lg:sticky lg:top-8 h-[500px] lg:h-[calc(100vh-6rem)]">
          {selectedStore ? (
            <div className="relative h-full rounded-2xl overflow-hidden shadow-xl border border-gray-800">
              <iframe
                title={`Map showing ${selectedStore.name}`}
                src={`https://maps.google.com/maps?q=${selectedStore.lat},${selectedStore.lng}&z=15&output=embed`}
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              {/* Overlay for store info */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-700">
                <p className="font-semibold text-white">{selectedStore.name}</p>
                <p className="text-sm text-gray-300 truncate">{selectedStore.address}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full bg-gray-900 rounded-2xl border-2 border-dashed border-gray-800 text-center p-6">
              <MapPin className="h-12 w-12 text-gray-600 mb-3" />
              <p className="text-gray-400 font-medium">No store selected</p>
              <p className="text-sm text-gray-500 mt-1">
                Choose a store from the list to view on map
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreFinder;