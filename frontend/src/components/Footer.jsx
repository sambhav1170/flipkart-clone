import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#172337] mt-8 text-white pt-10 pb-6 border-t border-gray-700">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-gray-400 text-xs font-bold uppercase mb-4">About</h3>
          <ul className="text-xs space-y-2 font-medium text-white/80">
            <li><Link to="#">Contact Us</Link></li>
            <li><Link to="#">About Us</Link></li>
            <li><Link to="#">Careers</Link></li>
            <li><Link to="#">Flipkart Stories</Link></li>
            <li><Link to="#">Press</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-gray-400 text-xs font-bold uppercase mb-4">Help</h3>
          <ul className="text-xs space-y-2 font-medium text-white/80">
            <li><Link to="#">Payments</Link></li>
            <li><Link to="#">Shipping</Link></li>
            <li><Link to="#">Cancellation & Returns</Link></li>
            <li><Link to="#">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-gray-400 text-xs font-bold uppercase mb-4">Consumer Policy</h3>
          <ul className="text-xs space-y-2 font-medium text-white/80">
            <li><Link to="#">Return Policy</Link></li>
            <li><Link to="#">Terms Of Use</Link></li>
            <li><Link to="#">Security</Link></li>
            <li><Link to="#">Privacy</Link></li>
          </ul>
        </div>
        <div className="pl-0 md:pl-5 border-l-0 md:border-l border-gray-600">
          <h3 className="text-gray-400 text-xs font-bold uppercase mb-4">Mail Us:</h3>
          <p className="text-xs text-white/80 leading-relaxed">
            Flipkart Internet Private Limited, <br />
            Buildings Alyssa, Begonia & <br />
            Clove Embassy Tech Village, <br />
            Outer Ring Road, Devarabeesanahalli Village, <br />
            Bengaluru, 560103, <br />
            Karnataka, India
          </p>
        </div>
      </div>
      <div className="mt-10 border-t border-gray-700 pt-6 px-4 flex flex-col md:flex-row justify-between items-center text-xs text-white/80">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <span className="flex items-center gap-1"><span className="text-flipkart-yellow text-lg">🛍</span> Become a Seller</span>
          <span className="flex items-center gap-1"><span className="text-flipkart-yellow text-lg">💡</span> Advertise</span>
          <span className="flex items-center gap-1"><span className="text-flipkart-yellow text-lg">🎁</span> Gift Cards</span>
        </div>
        <p>© 2007-{new Date().getFullYear()} Flipkart.com</p>
      </div>
    </footer>
  );
};

export default Footer;
