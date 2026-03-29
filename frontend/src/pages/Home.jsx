import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories, fetchProducts } from '../api/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          fetchCategories(),
          fetchProducts()
        ]);
        
        if (catsRes.success) setCategories(catsRes.data);
        if (prodsRes.success) setFeaturedProducts(prodsRes.data); // Pull entirely to categorize
      } catch (error) {
        console.error('Failed to load home data', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="flex flex-col gap-4 max-w-[1700px] mx-auto overflow-hidden">
      {/* Categories Bar */}
      <div className="bg-white shadow-sm mt-2 px-6 py-4 flex justify-around items-center overflow-x-auto mx-2 md:mx-4 rounded-sm">
        {categories.map(cat => (
          <Link to={`/products?category_id=${cat.id}`} key={cat.id} className="flex flex-col items-center gap-2 min-w-[80px] hover:text-flipkart-blue transition duration-200">
            <div className="w-16 h-16 flex items-center justify-center">
              <img src={cat.image_url} alt={cat.name} className="max-h-full object-contain" />
            </div>
            <span className="text-sm font-semibold text-gray-800">{cat.name}</span>
          </Link>
        ))}
      </div>

      {/* Hero Banner Placeholder */}
      <div className="mx-2 md:mx-4 bg-blue-50 relative overflow-hidden h-[280px] flex items-center shadow-sm cursor-pointer rounded-sm border border-gray-200">
        <div className="px-12 w-full md:w-1/2 z-10">
          <h2 className="text-4xl font-black text-gray-800 mb-2 leading-tight tracking-tight">Big Saving Days</h2>
          <p className="text-xl text-gray-600 mb-6 font-medium">Extra 10% Off on top brands</p>
          <Link to="/products" className="inline-block bg-flipkart-blue text-white px-8 py-3 rounded-sm font-bold shadow-md hover:bg-blue-600 transition">Shop Now</Link>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-blue-50 hidden md:flex items-center justify-center">
          <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1600&auto=format&fit=crop" alt="Banner" className="object-cover h-full w-full" />
        </div>
      </div>

      {/* Categorized Product Rows */}
      {categories.map(cat => {
        const catProducts = featuredProducts.filter(p => p.category_id === cat.id).slice(0, 5);
        if (catProducts.length === 0) return null;
        
        return (
          <div key={cat.id} className="mx-2 md:mx-4 bg-white p-4 pb-6 shadow-sm rounded-sm mb-4">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-gray-100">
              <h2 className="text-xl font-bold tracking-tight text-gray-900">
                {cat.name === 'Electronics' ? 'Best of Electronics & Appliances' : `Top Deals in ${cat.name}`}
              </h2>
              <Link to={`/products?category_id=${cat.id}`} className="bg-flipkart-blue text-white px-6 py-2 rounded-sm text-sm font-semibold shadow-sm hover:shadow-md transition">VIEW ALL</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {catProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
