import { useEffect, useState } from "react";
import { useCategoryStore } from "../../store/useCategoryStore";
import { useStoreStore } from "../../store/useStoreStore";

const CategoryForm = ({
  onClose,
  initialData = null,
  mode = "create",
}) => {
  const { createCategory, updateCategory } = useCategoryStore();
  const { fetchStores, stores } = useStoreStore();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    store: "",
    displayOrder: 1,
  });

  // Fetch stores
  useEffect(() => {
    fetchStores();
  }, []);

  // ✅ Populate form when modal opens (edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        store: initialData.store?._id || initialData.store || "",
        displayOrder: initialData.displayOrder || 1,
      });
    } else {
      // Reset when switching back to create
      setFormData({
        name: "",
        description: "",
        store: "",
        displayOrder: 1,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "displayOrder" ? Number(value) : value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (mode === "edit" && initialData?._id) {
      await updateCategory(initialData._id, formData);
    } else {
      await createCategory(formData);
    }

    onClose(); // ✅ CLOSE MODAL AFTER SUCCESS
  } catch (err) {
    console.error(err);
  }
};
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1f1f1f]/90 border border-gray-700 rounded-2xl shadow-xl w-[400px] p-6 relative text-white">

        <h2 className="text-xl font-semibold mb-4">
          {mode === "edit" ? "Edit Category" : "Create Category"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Category Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg p-2 text-white"
            required
          />

          {/* Description */}
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg p-2 text-white"
            required
          />

          {/* Store */}
          <select
            name="store"
            value={formData.store}
            onChange={handleChange}
            className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg p-2 text-white"
            required
          >
            <option value="">Select Store</option>
            {stores?.map((store) => (
              <option key={store._id} value={store._id}>
                {store.name}
              </option>
            ))}
          </select>

          {/* Display Order */}
          <input
            type="number"
            name="displayOrder"
            value={formData.displayOrder}
            onChange={handleChange}
            min={1}
            className="w-full bg-[#2a2a2a] border border-gray-600 rounded-lg p-2 text-white"
          />

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              className="bg-orange-600 px-4 py-2 rounded-lg"
            >
              {mode === "edit" ? "Update" : "Save"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="bg-gray-700 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default CategoryForm;