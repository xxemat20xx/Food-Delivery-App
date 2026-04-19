import { useState, useEffect, useRef } from "react";
import { getDistance } from "../../utils/distance";
import { useNavigate } from "react-router-dom";
import { useStoreStore } from "../../store/useStoreStore";
import {
  MapPin,
  Navigation,
  Star,
  Clock,
  Phone,
  ChevronRight,
  Coffee,
} from "lucide-react";

const StoreFinder = () => {
  const {
    stores,
    fetchStores,
    loading,
    userLocation,
    setUserLocation,
  } = useStoreStore();

  const [results, setResults] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const hasComputed = useRef(false);

  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const today = days[new Date().getDay()];

  const navigate = useNavigate();

  useEffect(() => {
    fetchStores();
  }, []);

  const computeStores = (latitude, longitude) => {
    const computed = stores.map((store) => {
      const lat = parseFloat(store.lat ?? store.location?.coordinates?.[1]);
      const lng = parseFloat(store.lng ?? store.location?.coordinates?.[0]);

      return {
        ...store,
        lat,
        lng,
        distance: getDistance(latitude, longitude, lat, lng),
      };
    });

    computed.sort((a, b) => a.distance - b.distance);

    setResults(computed);
    setSelectedStore(computed[0]);
    setLocationLoading(false);
  };

  const handleFind = () => {
    setLocationError(null);

    if (userLocation?.latitude && userLocation?.longitude) {
      computeStores(userLocation.latitude, userLocation.longitude);
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ latitude, longitude });
        computeStores(latitude, longitude);
      },
      (err) => {
        setLocationLoading(false);
        let errorMsg = "Unable to get your location.";
        if (err.code === 1) errorMsg = "Location access denied.";
        if (err.code === 2) errorMsg = "Location unavailable.";
        setLocationError(errorMsg);
      }
    );
  };

  useEffect(() => {
    if (
      hasComputed.current ||
      !userLocation?.latitude ||
      !userLocation?.longitude ||
      !stores.length
    )
      return;
    hasComputed.current = true;
    computeStores(userLocation.latitude, userLocation.longitude);
  }, [stores, userLocation]);

  const handleOrder = (store) => {
    navigate("/menu", { state: { store } });
  };

  const formatDistance = (km) => `${km.toFixed(1)} km`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with gradient and icon */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-amber-500/20 rounded-full mb-4">
            <Coffee className="h-8 w-8 text-amber-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            Find Your Nearest Store
          </h1>
          <p className="mt-3 text-gray-400 max-w-md mx-auto">
            Discover the closest Inarawan location and start ordering
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* Location Button with gradient */}
            <button
              onClick={handleFind}
              disabled={locationLoading || loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-amber-500/25 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
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

            {loading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
              </div>
            )}

            {locationError && (
              <div className="bg-red-900/30 backdrop-blur-sm border border-red-700 rounded-xl p-4 text-red-200">
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
                <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-amber-400" />
                  Stores near you
                </h2>

                <div className="space-y-4">
                  {results.map((store, index) => (
                    <div
                      key={store._id}
                      onClick={() => setSelectedStore(store)}
                      className={`group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer backdrop-blur-sm ${
                        selectedStore?._id === store._id
                          ? "bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/10"
                          : "bg-gray-900/60 border-gray-800 hover:border-amber-500/50 hover:bg-gray-900/80"
                      }`}
                    >
                      {index === 0 && (
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                          <Star className="h-3 w-3 fill-current" />
                          Nearest
                        </div>
                      )}

                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition">
                            {store.name}
                          </h3>
                          <p className="text-sm text-gray-400 mt-1 flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            {store.address}
                          </p>

                          <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
                            {store.distance && (
                              <span className="flex items-center gap-1.5 bg-gray-800/50 px-2 py-1 rounded-full">
                                <Navigation className="h-3.5 w-3.5" />
                                {formatDistance(store.distance)}
                              </span>
                            )}
                            {store.phone && (
                              <span className="flex items-center gap-1.5 bg-gray-800/50 px-2 py-1 rounded-full">
                                <Phone className="h-3.5 w-3.5" />
                                {store.phone}
                              </span>
                            )}
                            {store.hours && store.hours[today] && (
                              <span className="flex items-center gap-1.5 bg-gray-800/50 px-2 py-1 rounded-full">
                                <Clock className="h-3.5 w-3.5" />
                                {store.hours[today].open} -{" "}
                                {store.hours[today].close}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOrder(store);
                          }}
                          className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-4 py-2 rounded-lg hover:shadow-lg transition-all font-medium"
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
              <div className="text-center py-16 bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800">
                <MapPin className="h-14 w-14 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 font-medium">
                  Click the button above to find stores near you.
                </p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - MAP */}
          <div className="lg:sticky lg:top-8 h-[450px] lg:h-[calc(100vh-8rem)]">
            {selectedStore ? (
              <div className="relative h-full rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                {(() => {
                  const lat = parseFloat(
                    selectedStore.lat ??
                      selectedStore.location?.coordinates?.[1]
                  );
                  const lng = parseFloat(
                    selectedStore.lng ??
                      selectedStore.location?.coordinates?.[0]
                  );
                  return (
                    <iframe
                      title={`Map showing ${selectedStore.name}`}
                      src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
                      className="w-full h-full"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  );
                })()}
                <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md rounded-xl p-3 shadow-lg border border-gray-700">
                  <p className="font-semibold text-white">{selectedStore.name}</p>
                  <p className="text-sm text-gray-300 truncate">
                    {selectedStore.address}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-gray-900/60 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-700 text-center p-6">
                <MapPin className="h-14 w-14 text-gray-600 mb-4" />
                <p className="text-gray-400 font-medium">No store selected</p>
                <p className="text-sm text-gray-500 mt-1">
                  Choose a store from the list to view on map
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreFinder;