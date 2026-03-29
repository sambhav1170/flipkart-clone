import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../api/api';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('category_id');
  const searchKeyword = searchParams.get('search');
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOption, setSortOption] = useState('');

  // Apply filters triggers reload
  const applyFilters = () => {
    // Force useEffect dependency trigger by updating URL params or maintaining a counter
    // For simplicity, we just trigger the loadProducts explicitly.
    loadProducts();
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const [prodsRes, catsRes] = await Promise.all([
        fetchProducts({
          category_id: categoryId,
          search: searchKeyword,
          min_price: minPrice || undefined,
          max_price: maxPrice || undefined,
          sort: sortOption || undefined
        }),
        fetchCategories()
      ]);
      if (prodsRes.success) setProducts(prodsRes.data);
      if (catsRes.success) setCategories(catsRes.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, searchKeyword, sortOption]);

  return (
    <div className="container mx-auto px-2 py-4 flex gap-4">
      {/* Advanced Sidebar Filters */}
      <div className="w-64 hidden lg:block bg-white shadow-sm h-fit border border-gray-200 rounded-sm">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold">Filters</h2>
        </div>
        
        {/* Categories */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium text-[13px] text-gray-500 uppercase tracking-widest mb-3">Categories</h3>
          <ul className="space-y-2 text-sm max-h-48 overflow-y-auto custom-scrollbar">
            <li>
              <a href="/products" className={`block py-1 hover:text-flipkart-blue transition ${!categoryId ? 'font-bold text-flipkart-blue' : 'text-gray-700'}`}>
                All Products
              </a>
            </li>
            {categories.map(cat => (
              <li key={cat.id}>
                <a href={`/products?category_id=${cat.id}`} className={`block py-1 hover:text-flipkart-blue transition ${cat.id.toString() === categoryId ? 'font-bold text-flipkart-blue' : 'text-gray-700'}`}>
                  {cat.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Price Filter */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium text-[13px] text-gray-500 uppercase tracking-widest mb-3">Price</h3>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-sm overflow-hidden">
              <span className="text-gray-500 text-xs px-2 pointer-events-none absolute mt-[10px]">₹</span>
              <input 
                type="number" 
                placeholder="Min" 
                className="w-full text-sm pl-6 py-2 outline-none bg-transparent"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <span className="text-gray-400 font-medium whitespace-nowrap">to</span>
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-sm overflow-hidden relative">
              <span className="text-gray-500 text-xs px-2 pointer-events-none absolute mt-[10px]">₹</span>
              <input 
                type="number" 
                placeholder="Max" 
                className="w-full text-sm pl-6 py-2 outline-none bg-transparent"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
          <button 
            onClick={applyFilters}
            className="w-full bg-flipkart-blue text-white py-1.5 rounded-sm font-semibold text-sm hover:shadow-md transition"
          >
            Apply Price Filter
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="flex-grow bg-white shadow-sm p-4 border border-gray-200 rounded-sm h-fit">
        <div className="border-b border-gray-200 pb-4 mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">{searchKeyword ? `Search results for "${searchKeyword}"` : 'All Products'}</h1>
            <p className="text-xs text-gray-500 mt-1">(Showing {products.length} products)</p>
          </div>
          
          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-800">Sort By</span>
            <select 
              className="border-b-2 border-flipkart-blue text-sm font-semibold text-gray-700 py-1 outline-none bg-transparent cursor-pointer"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Relevance</option>
              <option value="price_low">Price -- Low to High</option>
              <option value="price_high">Price -- High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="p-16 text-center text-gray-500">Loading products...</div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 border-t border-l border-gray-200">
            {products.map(product => (
              <div key={product.id} className="border-r border-b border-gray-200 -mt-[1px] -ml-[1px]">
                 <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/error-no-search-results_2353c5.png" alt="No results" className="mx-auto w-[250px] mb-6" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Sorry, no results found!</h2>
            <p className="text-gray-500 font-medium">Please check the spelling or try searching for something else</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
