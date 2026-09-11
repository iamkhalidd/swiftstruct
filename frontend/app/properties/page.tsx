'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import { api, Property } from '@/lib/api';
import { Search, Filter, RefreshCw, Building2 } from 'lucide-react';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [listingType, setListingType] = useState<string>('');
  const [propertyType, setPropertyType] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [bedrooms, setBedrooms] = useState<string>('');

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = {};
      if (listingType) params.listingType = listingType;
      if (propertyType) params.propertyType = propertyType;
      if (search) params.search = search;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (bedrooms) params.bedrooms = bedrooms;

      const res = await api.properties.getAll(params);
      setProperties(res.data || []);
    } catch (err: any) {
      setError('Could not load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [listingType, propertyType, bedrooms]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProperties();
  };

  const resetFilters = () => {
    setListingType('');
    setPropertyType('');
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-14 border-b border-slate-800">
        <div className="container-custom">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Real Estate Agency
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Discover Available Properties
            </h1>
            <p className="text-slate-300 text-sm">
              Explore prime residential homes, commercial office spaces, luxury apartments, and investment developments.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content & Filters */}
      <section className="py-10 flex-1">
        <div className="container-custom">
          {/* Search & Filter Bar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-10 space-y-4">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Search location, title, or city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="md:col-span-2">
                <select
                  value={listingType}
                  onChange={(e) => setListingType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                >
                  <option value="">All Listing Types</option>
                  <option value="SALE">For Sale</option>
                  <option value="RENT">For Rent</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                >
                  <option value="">All Types</option>
                  <option value="Duplex">Duplex</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Commercial">Commercial Space</option>
                  <option value="Mansion">Mansion</option>
                  <option value="Land">Land</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                >
                  <option value="">Bedrooms</option>
                  <option value="1">1+ Beds</option>
                  <option value="2">2+ Beds</option>
                  <option value="3">3+ Beds</option>
                  <option value="4">4+ Beds</option>
                  <option value="5">5+ Beds</option>
                </select>
              </div>

              <div className="md:col-span-2 flex gap-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-sm transition"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="p-2.5 border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-500"
                  title="Reset filters"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="py-20 text-center space-y-3">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
              <p className="text-slate-500 text-sm font-medium">Loading properties catalog...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center text-red-700 text-sm max-w-md mx-auto">
              <p>{error}</p>
              <button
                onClick={fetchProperties}
                className="mt-3 px-4 py-2 bg-red-600 text-white font-bold rounded-lg text-xs"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && properties.length === 0 && (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 max-w-lg mx-auto my-12 space-y-4">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-xl font-bold text-slate-800">No properties found</h3>
              <p className="text-slate-500 text-sm">
                No properties currently match your search criteria. Try adjusting your filters or resetting search parameters.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-blue-600 transition"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Property Cards Grid */}
          {!loading && !error && properties.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
