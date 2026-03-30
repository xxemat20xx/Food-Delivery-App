import HeroImage from '../../assets/hero-img.png'
import { Facebook, Instagram, Twitter } from "lucide-react";

const Homepage = () => {
  return (
    // HERO SECTION
    <section
      id="home"
      className="w-full grid grid-cols-1 md:grid-cols-2 items-center gap-8 px-6 md:px-12 lg:px-16 py-10"
    >
      {/* TEXT CONTENT */}
      <div className="space-y-6 text-center md:text-left">
        <h1 className="text-amber-600 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
          Arawan Coffee
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto md:mx-0">
          Founded in 2020, Inarawan Coffee emerged from a passion for exceptional
          coffee and a commitment to community. Our journey began in a small,
          cozy café where we sourced beans from local farms, ensuring that each
          cup is not only delicious but also ethically produced.
        </p>

        {/* BUTTON */}
        <div>
          <button className="bg-amber-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-amber-500 hover:scale-105 active:scale-95 transition duration-300">
            Order Now
          </button>
        </div>

        {/* HANDLE */}
        <div>
          <span className="text-slate-400">@InarawanCoffee</span>
        </div>

        {/* SOCIAL MEDIA ICONS */}
        <div className="flex space-x-5 justify-center md:justify-start">
          <Facebook className="text-amber-500 hover:text-amber-400 cursor-pointer transition duration-300" />
          <Instagram className="text-amber-500 hover:text-amber-400 cursor-pointer transition duration-300" />
          <Twitter className="text-amber-500 hover:text-amber-400 cursor-pointer transition duration-300" />
        </div>
      </div>

      {/* IMAGE */}
      <div className="flex justify-center">
        <img
          src={HeroImage}
          alt="Hero"
          className="w-full max-w-md md:max-w-full h-auto object-contain"
        />
      </div>
    </section>
  )
}

export default Homepage