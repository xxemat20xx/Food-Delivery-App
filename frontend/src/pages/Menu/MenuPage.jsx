import { useLocation, useNavigate } from "react-router-dom";
import { useItemStore } from "../../store/useItemStore";
import { useCartStore } from "../../store/useCartStore";
import { useEffect, useMemo, useState } from "react";
import {
  ShoppingCart,
  Tag,
  CircleCheck,
  CircleX,
  Coffee,
  Search,
  Filter,
} from "lucide-react";

const MenuPage = () => {
  const { state } = useLocation();
  const { fetchItems, items, loading } = useItemStore();
  const { addToCart } = useCartStore();
  const navigate = useNavigate();

  const store = state?.store;

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [availability, setAvailability] = useState("All");

  useEffect(() => {
    fetchItems();
    if (!store) {
      navigate("/stores");
    }
  }, [fetchItems, store]);

  const handleAddToCart = (item) => {
    addToCart(item, 1, []);
  };

  const categories = useMemo(() => {
    const cats = items?.map((i) => i.category?.name).filter(Boolean);
    return ["All", ...new Set(cats)];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items?.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        selectedCategory === "All" || item.category?.name === selectedCategory;
      const matchAvailability =
        availability === "All" ||
        (availability === "Available" && item.isAvailable) ||
        (availability === "Sold out" && !item.isAvailable);
      return matchSearch && matchCategory && matchAvailability;
    });
  }, [items, search, selectedCategory, availability]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500/10 to-amber-600/10 rounded-xl px-4 py-2 mb-4">
            <Coffee className="h-6 w-6 text-amber-400" />
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Our Menu
            </h1>
          </div>
          <p className="text-gray-400">
            Order at: <span className="text-amber-400 font-medium">{store?.name}</span>
          </p>
        </div>

        {/* LAYOUT: Sidebar + Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR – sticky only on large screens, full width on mobile */}
          <aside className="lg:w-72 w-full bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800 p-4 space-y-5 lg:sticky lg:top-24 h-fit">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-800">
              <Filter className="h-4 w-4 text-amber-400" />
              <h3 className="font-medium text-white text-sm">Filters</h3>
            </div>

            {/* SEARCH */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition"
                />
              </div>
            </div>

            {/* CATEGORY */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                      selectedCategory === cat
                        ? "bg-amber-500 text-black"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* AVAILABILITY */}
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Availability</label>
              <div className="flex gap-2">
                {["All", "Available", "Sold out"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setAvailability(status)}
                    className={`flex-1 px-2 py-1 rounded-full text-xs font-medium transition ${
                      availability === status
                        ? "bg-amber-500 text-black"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* MENU GRID */}
          <div className="flex-1">
            {loading && (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
              </div>
            )}

            {!loading && filteredItems?.length === 0 && (
              <div className="text-center py-16 bg-gray-900/40 rounded-xl border border-gray-800">
                <Coffee className="h-10 w-10 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No items found</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems?.map((item) => (
                <div
                  key={item._id}
                  className="group bg-gray-900/40 rounded-xl overflow-hidden border border-gray-800 hover:border-amber-500/40 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="h-44 bg-gray-800/30 flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <Coffee className="h-8 w-8 text-gray-600" />
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition line-clamp-1">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        <Tag size={12} />
                        {item.category?.name || "Uncategorized"}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {item.description || "No description"}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <p className="text-lg font-bold text-amber-400">
                        ₱{item.storePrices?.[0]?.price || item.basePrice}
                      </p>
                      <div
                        className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                          item.isAvailable
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {item.isAvailable ? (
                          <>
                            <CircleCheck size={10} /> Available
                          </>
                        ) : (
                          <>
                            <CircleX size={10} /> Sold out
                          </>
                        )}
                      </div>
                    </div>
                    {item.customizations?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.customizations[0]?.options?.slice(0, 2).map((opt, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400"
                          >
                            {opt}
                          </span>
                        ))}
                        {item.customizations[0]?.options?.length > 2 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">
                            +{item.customizations[0].options.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.isAvailable}
                      className={`w-full mt-2 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition active:scale-95 ${
                        item.isAvailable
                          ? "bg-amber-500 text-black hover:bg-amber-400"
                          : "bg-gray-700 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <ShoppingCart size={14} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;