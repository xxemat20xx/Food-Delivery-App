import PastaImage1 from "../../assets/pastry1.png";
import PastryImage from "../../assets/pastry2.png";
import PastaImage2 from "../../assets/pastry3.png";

const HomepageScroll_2 = () => {
  const pastries = [
    {
      id: 1,
      name: "Buttery Croissant",
      description: "Flaky, golden, and melt‑in‑your‑mouth.",
      image: PastaImage1,
    },
    {
      id: 2,
      name: "Rich Muffin",
      description: "Moist, soft, and packed with flavor.",
      image: PastaImage2,
    },
    {
      id: 3,
      name: "Sweet Danish",
      description: "Fruit‑filled perfection, dusted with sugar.",
      image: PastryImage,
    },
  ];

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Best{" "}
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Pasta & Pastry
            </span>
          </h1>
          <div className="text-3xl md:text-4xl font-bold text-white mt-1">
            Categories
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto mt-4 text-sm md:text-base">
            Freshly baked pastries at{" "}
            <span className="text-amber-400 font-medium">Inarawan Coffee!</span>{" "}
            From buttery croissants and flaky danishes to rich muffins and
            sweet tarts, each treat is made from scratch with high‑quality
            ingredients.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pastries.map((item) => (
            <div
              key={item.id}
              className="group bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800 hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5 overflow-hidden"
            >
              {/* Image */}
              <div className="overflow-hidden h-64 bg-gray-800/50 flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              {/* Content */}
              <div className="p-5 text-center">
                <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition">
                  {item.name}
                </h3>
                <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                <button className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-5 py-2 rounded-full font-medium text-sm hover:shadow-lg transition-all">
                  Order now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomepageScroll_2;