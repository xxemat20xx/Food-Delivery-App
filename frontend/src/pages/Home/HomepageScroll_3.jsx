import coffeCateg1 from "../../assets/1.png";
import coffeCateg2 from "../../assets/2.png";
import coffeCateg3 from "../../assets/3.png";
import coffeCateg4 from "../../assets/4.png";
import coffeCateg5 from "../../assets/5.png";
import coffeCateg6 from "../../assets/6.png";

const products = [
  { img: coffeCateg1, name: "Caramel Latte", desc: "Enjoy a balanced cup with a hint of sweetness and a velvety finish." },
  { img: coffeCateg2, name: "Mocha", desc: "Rich chocolate and espresso with creamy foam." },
  { img: coffeCateg3, name: "Vanilla Latte", desc: "Classic latte with sweet vanilla syrup." },
  { img: coffeCateg4, name: "Cappuccino", desc: "Perfect balance of espresso, steamed milk, and foam." },
  { img: coffeCateg5, name: "Americano", desc: "Bold espresso diluted with hot water." },
  { img: coffeCateg6, name: "Espresso", desc: "Pure, intense coffee shot with crema." },
];

const HomepageScroll_3 = () => {
  return (
    <section className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-16 px-6 md:px-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-3xl font-bold">
          Our <span className="text-amber-400">Coffee</span>
        </h2>
        <h3 className="text-2xl font-semibold mt-1">Categories</h3>

        <p className="text-gray-400 mt-4 max-w-xl text-sm">
          Experience the rich, bold flavors of our delicious coffee at{" "}
          <span className="text-amber-400">Inarawan Coffee!</span>
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
        {products.map((item, index) => (
          <div
            key={index}
            className="relative bg-gray-900/80 backdrop-blur-sm text-white rounded-2xl border border-gray-800 p-6 pt-16 shadow-lg hover:border-amber-500/50 transition"
          >
            {/* Floating Image */}
            <img
              src={item.img}
              alt={item.name}
              className="absolute -top-10 -right-12 md:-top-12 md:-right-16 w-32 object-contain drop-shadow-xl"
            />

            {/* Content */}
            <p className="text-sm text-gray-300 mb-6">{item.desc}</p>

            <p className="font-semibold text-base text-white mb-2">{item.name}</p>

            <button className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-medium px-4 py-2 rounded-full text-sm shadow-md hover:shadow-lg hover:from-amber-400 hover:to-amber-500 transition-all duration-200">
              Order now →
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomepageScroll_3;