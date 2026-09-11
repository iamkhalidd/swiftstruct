'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/adminApi';
import ImageGalleryUpload, { GalleryImage } from '@/components/ImageGalleryUpload';
import { Home, Plus, Trash2, Edit3, Check, X, Building2 } from 'lucide-react';

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New Property Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState('Detached Duplex');
  const [listingType, setListingType] = useState('SALE');
  const [price, setPrice] = useState('185000000');
  const [location, setLocation] = useState('Lekki Phase 1');
  const [city, setCity] = useState('Lekki');
  const [state, setState] = useState('Lagos');
  const [bedrooms, setBedrooms] = useState('4');
  const [bathrooms, setBathrooms] = useState('5');
  const [parkingSpaces, setParkingSpaces] = useState('3');
  const [status, setStatus] = useState('AVAILABLE');
  const [images, setImages] = useState<GalleryImage[]>([]);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const res = await adminApi.properties.getAll();
      setProperties(res.data || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminApi.properties.create({
        title,
        description,
        propertyType,
        listingType,
        price: parseFloat(price) || 0,
        location,
        city,
        state,
        bedrooms: parseInt(bedrooms) || 0,
        bathrooms: parseInt(bathrooms) || 0,
        parkingSpaces: parseInt(parkingSpaces) || 0,
        status,
        images,
      });
      setShowModal(false);
      setTitle('');
      setDescription('');
      setImages([]);
      loadProperties();
    } catch (err: any) {
      alert(err.message || 'Failed to create property');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    try {
      await adminApi.properties.delete(id);
      loadProperties();
    } catch (err: any) {
      alert(err.message || 'Failed to delete property');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Properties Management</h1>
          <p className="text-slate-500 text-xs mt-0.5">Create, edit, publish, and manage real estate property listings</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-md shadow-blue-900/20"
        >
          <Plus className="w-4 h-4" /> Add New Property
        </button>
      </div>

      {/* Properties Datatable */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-xs text-slate-500">Loading properties catalog...</div>
        ) : properties.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500">No properties in database. Click "Add New Property" to create one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-4">Property</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Listing</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900 max-w-xs truncate">{prop.title}</td>
                    <td className="p-4">{prop.propertyType}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded text-white ${
                          prop.listingType === 'SALE' ? 'bg-blue-600' : 'bg-emerald-600'
                        }`}
                      >
                        {prop.listingType}
                      </span>
                    </td>
                    <td className="p-4 font-bold">₦{prop.price?.toLocaleString()}</td>
                    <td className="p-4">{prop.location}, {prop.city}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-slate-100 font-extrabold uppercase text-[10px] rounded text-slate-800">
                        {prop.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteProperty(prop.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition"
                        title="Delete Property"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal - Create Property */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">Add New Property Listing</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateProperty} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Property Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 4 Bedroom Detached Duplex"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Listing Type *</label>
                  <select
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  >
                    <option value="SALE">For Sale</option>
                    <option value="RENT">For Rent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Property Type *</label>
                  <input
                    type="text"
                    required
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    placeholder="e.g. Detached Duplex, Apartment, Land"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price (NGN) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Lekki Phase 1"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Parking</label>
                  <input
                    type="number"
                    value={parkingSpaces}
                    onChange={(e) => setParkingSpaces(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <ImageGalleryUpload
                  label="Property Images"
                  images={images}
                  onChange={setImages}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter full property description..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-slate-200 text-slate-600 font-bold text-xs rounded-lg hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-md"
                >
                  {submitting ? 'Saving Property...' : 'Save & Publish Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
