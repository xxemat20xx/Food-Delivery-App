import { useEffect, useState } from "react";
import { useStoreStore } from "../../store/useStoreStore";
import { MapPin, Clock, Phone, Edit, Trash, PlusCircle, X, Eye, AlertCircle, ChevronRight } from "lucide-react";

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
  const [deleteConfirm, setDeleteConfirm] = useState(null);
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
    hours: {
      monday: { open: "", close: "" },
      tuesday: { open: "", close: "" },
      wednesday: { open: "", close: "" },
      thursday: { open: "", close: "" },
      friday: { open: "", close: "" },
      saturday: { open: "", close: "" },
      sunday: { open: "", close: "" },
    },
  });

  useEffect(() => {
    fetchStores();
  }, []);

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
        hours: selectedStore.hours || {
          monday: { open: "", close: "" },
          tuesday: { open: "", close: "" },
          wednesday: { open: "", close: "" },
          thursday: { open: "", close: "" },
          friday: { open: "", close: "" },
          saturday: { open: "", close: "" },
          sunday: { open: "", close: "" },
        },
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
      hours: {
        monday: { open: "", close: "" },
        tuesday: { open: "", close: "" },
        wednesday: { open: "", close: "" },
        thursday: { open: "", close: "" },
        friday: { open: "", close: "" },
        saturday: { open: "", close: "" },
        sunday: { open: "", close: "" },
      },
    });
    clearSelectedStore();
  };

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteClick = (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      try {
        await deleteStore(deleteConfirm);
        setDeleteConfirm(null);
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

  const handleHourChange = (day, field, value) => {
    setForm({
      ...form,
      hours: {
        ...form.hours,
        [day]: { ...form.hours[day], [field]: value },
      },
    });
  };

  const formatHoursForPreview = (hours) => {
    if (!hours) return [];
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const formatted = days
      .map((day, idx) => {
        const h = hours[day];
        if (h && h.open && h.close) {
          return { day: dayNames[idx], open: h.open, close: h.close };
        }
        return null;
      })
      .filter(Boolean);
    return formatted;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with glass effect */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-xl">
              <MapPin className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Store Management
              </h1>
              <p className="text-gray-400 text-sm mt-1">Manage your store locations</p>
            </div>
          </div>
          <button
            className="flex items-center gap-2 bg-amber-500 text-black px-5 py-2.5 rounded-xl hover:bg-amber-400 transition-all shadow-lg hover:shadow-amber-500/20"
            onClick={() => {
              resetFormAndSelection();
              setModalOpen(true);
            }}
          >
            <PlusCircle className="h-5 w-5" /> Add New Store
          </button>
        </div>

        {/* Search with icon */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search stores by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 pl-12 rounded-xl border border-gray-700 bg-gray-900/80 backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
          />
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        {/* Loading / Error / Store Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 text-red-200 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.length === 0 ? (
              <div className="col-span-full text-center py-16 text-gray-400 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800">
                No stores found. Click "Add New Store" to create one.
              </div>
            ) : (
              filteredStores.map((store) => (
                <div
                  key={store._id}
                  className="group bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800 hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-amber-400 mb-1">{store.name}</h3>
                        <p className="text-gray-300 text-sm flex items-center gap-1.5 mt-1">
                          <MapPin className="h-4 w-4 flex-shrink-0" /> {store.address}
                        </p>
                        {store.phone && (
                          <p className="text-gray-300 text-sm flex items-center gap-1.5 mt-1">
                            <Phone className="h-4 w-4 flex-shrink-0" /> {store.phone}
                          </p>
                        )}
                        {store.hours?.monday?.open && (
                          <p className="text-gray-400 text-sm flex items-center gap-1.5 mt-1">
                            <Clock className="h-4 w-4 flex-shrink-0" /> Mon: {store.hours.monday.open} - {store.hours.monday.close}
                          </p>
                        )}
                        {store.isActive === false && (
                          <span className="inline-block mt-2 text-xs bg-red-900/60 text-red-300 px-2 py-1 rounded-full">Inactive</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedStore(store);
                            setPreviewOpen(true);
                          }}
                          className="p-2 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition-all"
                          title="Preview"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStore(store);
                            setModalOpen(true);
                          }}
                          className="p-2 rounded-xl bg-amber-600/20 text-amber-400 hover:bg-amber-600 hover:text-white transition-all"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(store._id)}
                          className="p-2 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition-all"
                          title="Delete"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-800">
                      <button
                        onClick={() => {
                          setSelectedStore(store);
                          setPreviewOpen(true);
                        }}
                        className="text-amber-400 text-sm flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        View Details <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Edit/Create Modal - Improved responsiveness */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-all">
          <div className="bg-gray-900 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-800">
            <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 p-5 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-amber-400 flex items-center gap-2">
                {selectedStore?._id ? <Edit className="h-5 w-5" /> : <PlusCircle className="h-5 w-5" />}
                {selectedStore?._id ? "Edit Store" : "Add Store"}
              </h2>
              <button
                onClick={() => {
                  setModalOpen(false);
                  resetFormAndSelection();
                }}
                className="text-gray-400 hover:text-white transition p-1 rounded-lg hover:bg-gray-800"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info Section */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold border-l-4 border-amber-500 pl-3">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-1 text-sm font-medium">Store Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1 text-sm font-medium">Address *</label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1 text-sm font-medium">Latitude</label>
                    <input
                      type="text"
                      value={form.lat}
                      onChange={(e) => setForm({ ...form, lat: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1 text-sm font-medium">Longitude</label>
                    <input
                      type="text"
                      value={form.lng}
                      onChange={(e) => setForm({ ...form, lng: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1 text-sm font-medium">Phone</label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1 text-sm font-medium">Store Type</label>
                    <input
                      type="text"
                      value={form.storeType}
                      onChange={(e) => setForm({ ...form, storeType: e.target.value })}
                      placeholder="main, kiosk, popup"
                      className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1 text-sm font-medium">Delivery Radius (km)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={form.deliveryRadius}
                      onChange={(e) => setForm({ ...form, deliveryRadius: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-1 text-sm font-medium">Min. Order Amount</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.minOrderAmount}
                      onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-300 mb-1 text-sm font-medium">Description</label>
                    <textarea
                      rows="3"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Operating Hours Section - Modern & clean */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold border-l-4 border-amber-500 pl-3 flex items-center gap-2">
                  <Clock className="h-5 w-5" /> Operating Hours
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { key: "monday", label: "Monday" },
                    { key: "tuesday", label: "Tuesday" },
                    { key: "wednesday", label: "Wednesday" },
                    { key: "thursday", label: "Thursday" },
                    { key: "friday", label: "Friday" },
                    { key: "saturday", label: "Saturday" },
                    { key: "sunday", label: "Sunday" },
                  ].map((day) => (
                    <div key={day.key} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-gray-800/50 rounded-xl border border-gray-700">
                      <span className="w-28 font-medium text-gray-300">{day.label}</span>
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="time"
                          value={form.hours[day.key].open}
                          onChange={(e) => handleHourChange(day.key, "open", e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-amber-500"
                        />
                        <span className="text-gray-400">–</span>
                        <input
                          type="time"
                          value={form.hours[day.key].close}
                          onChange={(e) => handleHourChange(day.key, "close", e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 p-5 flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-black py-2.5 rounded-xl hover:from-amber-400 hover:to-amber-500 transition font-semibold shadow-lg"
              >
                {selectedStore?._id ? "Update Store" : "Create Store"}
              </button>
              <button
                onClick={() => {
                  setModalOpen(false);
                  resetFormAndSelection();
                }}
                className="flex-1 bg-gray-800 text-white py-2.5 rounded-xl hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewOpen && selectedStore && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-800">
            <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 p-5 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-amber-400 flex items-center gap-2">
                <Eye className="h-5 w-5" /> Store Preview
              </h2>
              <button
                onClick={() => {
                  setPreviewOpen(false);
                  resetFormAndSelection();
                }}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="border-b border-gray-800 pb-4">
                <h3 className="text-2xl font-bold text-amber-400">{selectedStore.name}</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-gray-300 flex items-center gap-2"><MapPin className="h-4 w-4" /> {selectedStore.address || "-"}</p>
                  {selectedStore.phone && <p className="text-gray-300 flex items-center gap-2"><Phone className="h-4 w-4" /> {selectedStore.phone}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div><span className="font-semibold text-gray-400">Store Type:</span> <span className="text-white">{selectedStore.storeType || "-"}</span></div>
                <div><span className="font-semibold text-gray-400">Delivery Radius:</span> <span className="text-white">{selectedStore.deliveryRadius || "-"} km</span></div>
                <div><span className="font-semibold text-gray-400">Min Order:</span> <span className="text-white">{selectedStore.minOrderAmount ? `₱${selectedStore.minOrderAmount}` : "-"}</span></div>
                <div><span className="font-semibold text-gray-400">Status:</span> <span className={`px-2 py-0.5 rounded-full text-xs ${selectedStore.isActive !== false ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>{selectedStore.isActive !== false ? "Active" : "Inactive"}</span></div>
              </div>
              {selectedStore.description && (
                <div>
                  <span className="font-semibold text-gray-400 block mb-1">Description:</span>
                  <p className="text-gray-300">{selectedStore.description}</p>
                </div>
              )}
              <div>
                <span className="font-semibold text-gray-400 block mb-3 flex items-center gap-2"><Clock className="h-4 w-4" /> Hours:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {formatHoursForPreview(selectedStore.hours).map((h, idx) => (
                    <div key={idx} className="bg-gray-800/70 p-2 rounded-lg flex justify-between items-center">
                      <span className="capitalize font-medium text-gray-300">{h.day}</span>
                      <span className="text-amber-400 text-sm">{h.open} – {h.close}</span>
                    </div>
                  ))}
                  {formatHoursForPreview(selectedStore.hours).length === 0 && <div className="text-gray-500">No hours set</div>}
                </div>
              </div>
              {selectedStore.lat && selectedStore.lng && (
                <iframe
                  title="Store Location"
                  src={`https://maps.google.com/maps?q=${selectedStore.lat},${selectedStore.lng}&z=15&output=embed`}
                  className="w-full h-64 rounded-xl border border-gray-700 mt-4"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-md w-full p-6 border border-gray-800 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-full">
                <Trash className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Confirm Delete</h3>
            </div>
            <p className="text-gray-300 mb-6">Are you sure you want to delete this store? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-500 transition"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreDashboard;