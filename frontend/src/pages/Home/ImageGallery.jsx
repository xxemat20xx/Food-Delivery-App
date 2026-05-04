import ImageGal1 from "../../assets/img-gal1.jpg";
import ImageGal2 from "../../assets/img-gal2.jpg";
import ImageGal3 from "../../assets/img-gal3.jpg";
import ImageGal4 from "../../assets/img-gal4.png";
import ImageGal5 from "../../assets/img-gal5.jpg";


const ImageGallery = () => {
  return (
    <section className="bg-black py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Optional title / brand header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-wide text-white">
            THE <span className="text-amber-500">YORKER</span>
          </h2>
          <p className="text-amber-500 text-sm tracking-[0.2em] mt-1">Brew Ha Ha</p>
        </div>

        {/* Gallery grid – matches CSS layout: 2fr / 1fr, five images */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column (spans 2fr using col-span-2) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="overflow-hidden rounded-2xl group h-80">
              <img
                src={ImageGal1}
                alt="Gallery"
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="overflow-hidden rounded-2xl group h-80">
              <img
                src={ImageGal5}
                alt="Gallery"
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Right column (1fr) */}
          <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl group h-80">
              <img
                src={ImageGal2}
                alt="Gallery"
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="overflow-hidden rounded-2xl group h-80">
              <img
                src={ImageGal4}
                alt="Gallery"
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* Full‑width bottom image (spans both columns) */}
        <div className="mt-6 overflow-hidden rounded-2xl group h-80">
          <img
            src={ImageGal3}
            alt="Gallery"
            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
};

export default ImageGallery;