import HeroImage from '../../assets/hero-img.png';
import { Facebook, Instagram, Twitter, ArrowRight, Coffee } from "lucide-react";
import HomepageScroll_1 from './HomepageScroll_1';
import HomepageScroll_2 from './HomepageScroll_2';
import HomepageScroll_3 from './HomepageScroll_3';
import ImageGallery from './ImageGallery';
import Footer from '../../components/Layout/Footer';

const Homepage = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-12 md:py-20 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* IMAGE - on top for mobile, right for desktop */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-transparent rounded-full blur-2xl"></div>
              <div className="relative animate-float">
                <img
                  src={HeroImage}
                  alt="Inarawan Coffee"
                  className="w-full max-w-md lg:max-w-lg h-auto object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
          
          {/* TEXT CONTENT - below image on mobile, left on desktop */}
          <div className="order-2 lg:order-1 space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-500/10 backdrop-blur-sm rounded-full px-4 py-2 text-amber-400 text-sm font-medium mx-auto lg:mx-0">
              <Coffee className="h-4 w-4" />
              <span>Since 2020</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight">
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Inarawan
              </span>
              <br />
              <span className="text-white">Coffee</span>
            </h1>
            
            <p className="text-base sm:text-lg text-gray-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Founded in 2020, Inarawan Coffee emerged from a passion for exceptional
              coffee and a commitment to community. Our journey began in a small,
              cozy café where we sourced beans from local farms, ensuring that each
              cup is not only delicious but also ethically produced.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black px-6 sm:px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-amber-500/25 transition-all duration-300 hover:scale-105 active:scale-95">
                Order Now
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="inline-flex items-center justify-center gap-2 border border-amber-500/50 text-amber-400 px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-amber-500/10 transition-all duration-300">
                View Menu
              </button>
            </div>
            
            {/* Handle & Social */}
            <div className="pt-4 space-y-4">
              <span className="text-gray-500 text-sm tracking-wider block">@InarawanCoffee</span>
              <div className="flex gap-6 justify-center lg:justify-start">
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-all duration-300 hover:scale-110">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-all duration-300 hover:scale-110">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-all duration-300 hover:scale-110">
                  <Twitter className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          
        </div>
      </div>
      
      {/* Add custom animation for floating effect - use global CSS or style tag */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
        <HomepageScroll_1 />
        <HomepageScroll_2 />
        <HomepageScroll_3 />
        <ImageGallery />
      
    </section>
  );
};

export default Homepage;