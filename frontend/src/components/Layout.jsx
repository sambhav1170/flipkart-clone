import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-[64px] md:pt-[64px] pb-8 bg-[#f1f3f6]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
