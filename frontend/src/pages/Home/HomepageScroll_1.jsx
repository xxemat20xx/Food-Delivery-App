import HomePageScroll1Img from "../../assets/fscroll-img.jpg";

const HomepageScroll_1 = () => {
  return (
<section className="w-full">
  {/* Image */}
  <img
    src={HomePageScroll1Img}
    alt="Coffee and pastries"
    className="w-full h-[500px] object-cover md:h-[600px] lg:h-[620px]"
  />

  {/* Cards BELOW image */}
  <div className="bg-transparent p-4 md:p-6 lg:p-8 -mt-32">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
      
      {/* Card 1 */}
      <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10">
        <h3 className="text-xl font-bold text-amber-400 mb-2">
          Grind with perfection,<br />Brewed with precision.
        </h3>
        <p className="text-gray-200 text-sm leading-relaxed">
          Our skilled baristas take pride in the brewing process, using expert techniques to highlight the unique flavors and aromas of our coffee.
        </p>
      </div>

      {/* Card 2 */}
      <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10">
        <h3 className="text-xl font-bold text-amber-400 mb-2">
          Freshly Bake
        </h3>
        <p className="text-gray-200 text-sm leading-relaxed">
          Our pastries are made from scratch using high-quality ingredients, sourced locally whenever possible. Each item is carefully prepared by our talented bakers who pour their passion into every batch.
        </p>
      </div>

      {/* Card 3 */}
      <div className="bg-black/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/10">
        <h3 className="text-xl font-bold text-amber-400 mb-2">
          Cozy Comfort
        </h3>
        <p className="text-gray-200 text-sm leading-relaxed">
          Step into our space and feel instantly at home. With warm lighting, comfortable seating, and thoughtfully curated decor, our café provides the perfect backdrop for a quiet moment or a lively gathering with friends.
        </p>
      </div>

    </div>
  </div>
</section>
  );
};

export default HomepageScroll_1;