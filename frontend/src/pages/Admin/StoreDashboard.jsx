import { useEffect, useState } from "react";
import { useStoreStore } from "../../store/useStoreStore";
import { MapPin, Star, Clock, Phone, Edit, Trash, PlusCircle, X, Eye } from "lucide-react";

const StoreDashboard = () => {
  const {
    stores,
    fetchStores,
    loading,
    error,
    selectedStore,
    setSelectedStore,
    clearSelectedStore,
    deleteStore,
    createStore,
    updateStore,
  } = useStoreStore();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    address: "",
    lat: "",
    lng: "",
    phone: "",
    deliveryRadius: "",
    minOrderAmount: "",
    storeType: "",
    description: "",
  });

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  // Update form when editing a store
  useEffect(() => {
    if (selectedStore && modalOpen) {
      setForm({
        name: selectedStore.name || "",
        address: selectedStore.address || "",
        lat: selectedStore.lat || "",
        lng: selectedStore.lng || "",
        phone: selectedStore.phone || "",
        deliveryRadius: selectedStore.deliveryRadius || "",
        minOrderAmount: selectedStore.minOrderAmount || "",
        storeType: selectedStore.storeType || "",
        description: selectedStore.description || "",
      });
    }
  }, [selectedStore, modalOpen]);

  const resetFormAndSelection = () => {
    setForm({
      name: "",
      address: "",
      lat: "",
      lng: "",
      phone: "",
      deliveryRadius: "",
      minOrderAmount: "",
      storeType: "",
      description: "",
    });
    clearSelectedStore();
  };

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this store?")) {
      try {
        await deleteStore(id);
      } catch (err) {
        alert("Failed to delete store");
      }
    }
  };

  const handleSave = async () => {
    try {
      if (selectedStore?._id) {
        await updateStore(selectedStore._id, form);
      } else {
        await createStore(form);
      }
      setModalOpen(false);
      resetFormAndSelection();
    } catch (err) {
      alert(err.message || "Failed to save store");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-amber-400">Store Management</h1>
        <button
          className="flex items-center gap-2 bg-amber-500 text-black px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors"
          onClick={() => {
            resetFormAndSelection();
            setModalOpen(true);
          }}
        >
          <PlusCircle className="h-5 w-5" /> Add Store
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search stores..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Store List */}
      {loading ? (
        <div className="text-gray-400 py-6 text-center">Loading stores...</div>
      ) : error ? (
        <div className="text-red-600 py-6 text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Store List */}
          <div className="bg-gray-900 shadow rounded-lg p-4 max-h-[600px] overflow-y-auto">
            {filteredStores.length === 0 ? (
              <div className="text-gray-400 text-center py-12">No stores found.</div>
            ) : (
              filteredStores.map((store) => (
                <div
                  key={store._id}
                  className={`p-4 rounded-lg border mb-3 transition-all ${
                    selectedStore?._id === store._id
                      ? "border-amber-500 bg-gray-800 shadow"
                      : "border-gray-700 hover:bg-gray-800"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-amber-400">{store.name}</h3>
                      <p className="text-sm text-gray-400 flex items-center gap-1">
                        <MapPin className="h-4 w-4" /> {store.address}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-400">
                        {store.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" /> {store.phone}
                          </span>
                        )}
                        {store.hours && store.hours["monday"] && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {store.hours["monday"].open} - {store.hours["monday"].close}
                          </span>
                        )}
                        {store.isActive === false && (
                          <span className="text-red-500 font-medium">Inactive</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStore(store);
                          setPreviewOpen(true);
                        }}
                        className="flex items-center gap-1 text-amber-500 hover:text-amber-400"
                      >
                        <Eye className="h-4 w-4" /> Preview
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedStore(store);
                          setModalOpen(true);
                        }}
                        className="flex items-center gap-1 text-amber-500 hover:text-amber-400"
                      >
                        <Edit className="h-4 w-4" /> Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(store._id);
                        }}
                        className="flex items-center gap-1 text-red-500 hover:text-red-400"
                      >
                        <Trash className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-lg relative shadow-lg">
            <button
              onClick={() => {
                setModalOpen(false);
                resetFormAndSelection();
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold text-amber-400 mb-4">
              {selectedStore?._id ? "Edit Store" : "Add Store"}
            </h2>

            <div className="space-y-3 max-h-[70vh] overflow-y-auto">
              {[
                { label: "Name", key: "name" },
                { label: "Address", key: "address" },
                { label: "Latitude", key: "lat" },
                { label: "Longitude", key: "lng" },
                { label: "Phone", key: "phone" },
                { label: "Delivery Radius (km)", key: "deliveryRadius" },
                { label: "Minimum Order Amount", key: "minOrderAmount" },
                { label: "Store Type", key: "storeType" },
                { label: "Description", key: "description" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-gray-300 mb-1">{field.label}</label>
                  <input
                    type="text"
                    value={form[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleSave}
              className="mt-4 w-full bg-amber-500 text-black py-2 rounded-lg hover:bg-amber-400 transition-colors"
            >
              {selectedStore?._id ? "Update Store" : "Create Store"}
            </button>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewOpen && selectedStore && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-full max-w-lg relative shadow-lg max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setPreviewOpen(false);
                resetFormAndSelection();
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold text-amber-400 mb-4">{selectedStore.name}</h2>
            <p><span className="font-semibold">Address:</span> {selectedStore.address || "-"}</p>
            <p><span className="font-semibold">Phone:</span> {selectedStore.phone || "-"}</p>
            <p><span className="font-semibold">Delivery Radius:</span> {selectedStore.deliveryRadius || "-"} km</p>
            <p><span className="font-semibold">Minimum Order:</span> {selectedStore.minOrderAmount || "-"}</p>
            <p><span className="font-semibold">Store Type:</span> {selectedStore.storeType || "-"}</p>
            <p><span className="font-semibold">Description:</span> {selectedStore.description || "-"}</p>
            {selectedStore.lat && selectedStore.lng && (
              <iframe
                title="Store Location"
                src={`https://maps.google.com/maps?q=${selectedStore.lat},${selectedStore.lng}&z=15&output=embed`}
                className="w-full h-48 rounded-lg border border-gray-700 mt-4"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreDashboard;