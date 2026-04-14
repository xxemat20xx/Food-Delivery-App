import { useLocation, useNavigate  } from "react-router-dom";
import { useItemStore } from "../../store/useItemStore";
import { useEffect } from "react";
import {
  ShoppingCart,
  Tag,
  CircleCheck,
  CircleX,
  Coffee,
} from "lucide-react";

const MenuPage = () => {
  const { state } = useLocation();
  const { fetchItems, items, loading } = useItemStore();
  const navigate = useNavigate();

  const store = state?.store;

  useEffect(() => {
    fetchItems();
      if (!store) {
    navigate("/stores");
  }
  }, [fetchItems, store]);

  return (
    <div className="min-h-screen bg-[var(--color-dark)] text-white p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[var(--color-primary)] flex items-center gap-2">
          <Coffee size={28} />
          Menu
        </h2>
        <p className="text-[var(--color-lightGray)] opacity-80">
          Order at: {store?.name}
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-[var(--color-lightGray)] animate-pulse">
          Loading menu...
        </p>
      )}

      {/* GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items?.map((item) => (
          <div
            key={item._id}
            className="group bg-[#2a2a2a] rounded-3xl overflow-hidden border border-white/5 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
          >
            {/* IMAGE */}
            <div className="h-52 bg-[#1f1f1f] flex items-center justify-center overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="h-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* CONTENT */}
            <div className="p-5 space-y-3">

              {/* TITLE + CATEGORY */}
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h3 className="text-lg font-semibold leading-tight">
                    {item.name}
                  </h3>

                  <div className="flex items-center gap-1 text-sm text-[var(--color-lightGray)] opacity-80 mt-1">
                    <Tag size={14} />
                    {item.category?.name}
                  </div>
                </div>
              </div>

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-400 line-clamp-2">
                {item.description}
              </p>

              {/* PRICE + STATUS */}
              <div className="flex items-center justify-between">
                <p className="text-[var(--color-primary)] font-bold text-lg">
                  ₱{item.storePrices?.[0]?.price || item.basePrice}
                </p>

                <div
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${
                    item.isAvailable
                      ? "bg-[var(--color-green)]/20 text-[var(--color-green)]"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {item.isAvailable ? (
                    <>
                      <CircleCheck size={14} /> Available
                    </>
                  ) : (
                    <>
                      <CircleX size={14} /> Sold out
                    </>
                  )}
                </div>
              </div>

              {/* OPTIONS */}
              {item.customizations?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.customizations[0].options
                    .slice(0, 3)
                    .map((opt, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1 rounded-full border border-white/10 text-[var(--color-lightGray)]"
                      >
                        {opt.name}
                      </span>
                    ))}
                </div>
              )}

              {/* BUTTON */}
              <button className="w-full mt-2 flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:opacity-90 text-white font-medium py-2.5 rounded-xl transition active:scale-95">
                <ShoppingCart size={16} />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;