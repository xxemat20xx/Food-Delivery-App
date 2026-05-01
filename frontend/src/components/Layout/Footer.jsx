import Logo from "../../assets/inarawan-logo.png";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800 pt-12 pb-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={Logo} alt="Inarawan Coffee" className="h-10 w-auto" />
              <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Inarawan Coffee
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Serving exceptional coffee and community since 2020. Brewed with
              passion, enjoyed with love.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="#"
                className="text-gray-400 hover:text-amber-400 transition"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-amber-400 transition"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-amber-400 transition"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/menu" className="text-gray-400 hover:text-amber-400 transition text-sm">
                  Menu
                </a>
              </li>
              <li>
                <a href="/stores" className="text-gray-400 hover:text-amber-400 transition text-sm">
                  Find a Store
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-amber-400 transition text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-amber-400 transition text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-amber-400 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  2 Sampaguita St, Marikina, 1807 Metro Manila
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-amber-400" />
                <a href="tel:+639171234567" className="text-gray-400 hover:text-amber-400 transition text-sm">
                  +63 917 123 4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-amber-400" />
                <a href="mailto:info@inarawan.com" className="text-gray-400 hover:text-amber-400 transition text-sm">
                  info@inarawan.com
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Opening Hours</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between text-gray-400">
                <span>Monday – Friday</span>
                <span>8:00 AM – 10:00 PM</span>
              </li>
              <li className="flex justify-between text-gray-400">
                <span>Saturday – Sunday</span>
                <span>8:00 AM – 9:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-6 mt-6 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} Inarawan Coffee. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;