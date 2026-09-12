'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/adminApi';
import ImageGalleryUpload, { GalleryImage } from '@/components/ImageGalleryUpload';
import { PencilSquareIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

const PROPERTY_STATUSES = [
  'DRAFT',
  'PUBLISHED',
  'AVAILABLE',
  'RESERVED',
  'SOLD',
  'RENTED',
  'ARCHIVED',
];

const CURRENCIES = ['NGN', 'USD', 'GBP', 'EUR'];

/**
 * Monochrome status ramp: the darker the chip, the more actionable the listing.
 * Available is the strongest signal, sold/rented fade out, draft and archived
 * stay quiet. Red is never used here — it is reserved for a "sold out" warning.
 */
function statusChipClass(status: string) {
  switch (status) {
    case 'AVAILABLE':
      return 'bg-neutral-900 text-white';
    case 'PUBLISHED':
      return 'bg-neutral-800 text-white';
    case 'RESERVED':
      return 'bg-neutral-600 text-white';
    case 'SOLD':
    case 'RENTED':
      return 'bg-neutral-400 text-white';
    case 'DRAFT':
      return 'bg-neutral-200 text-neutral-800';
    default:
      return 'bg-neutral-100 text-neutral-600';
  }
}

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
  const [totalUnits, setTotalUnits] = useState('1');
  const [availableUnits, setAvailableUnits] = useState('1');
  const [currency, setCurrency] = useState('NGN');
  const [isFeatured, setIsFeatured] = useState(false);
  const [amenities, setAmenities] = useState('');
  const [features, setFeatures] = useState('');
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

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

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setImages([]);
    setTotalUnits('1');
    setAvailableUnits('1');
    setCurrency('NGN');
    setIsFeatured(false);
    setAmenities('');
    setFeatures('');
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (prop: any) => {
    setEditingId(prop.id);
    setTitle(prop.title ?? '');
    setDescription(prop.description ?? '');
    setPropertyType(prop.propertyType ?? 'Detached Duplex');
    setListingType(prop.listingType ?? 'SALE');
    setPrice(String(prop.price ?? 0));
    setLocation(prop.location ?? '');
    setCity(prop.city ?? '');
    setState(prop.state ?? '');
    setBedrooms(String(prop.bedrooms ?? 0));
    setBathrooms(String(prop.bathrooms ?? 0));
    setParkingSpaces(String(prop.parkingSpaces ?? 0));
    setStatus(prop.status ?? 'AVAILABLE');
    setTotalUnits(String(prop.totalUnits ?? 1));
    setAvailableUnits(String(prop.availableUnits ?? prop.totalUnits ?? 1));
    setCurrency(prop.currency ?? 'NGN');
    setIsFeatured(Boolean(prop.isFeatured));
    setAmenities(prop.amenities ?? '');
    setFeatures(prop.features ?? '');
    setImages(
      (prop.images ?? []).map((img: any, i: number) => ({
        url: img.url,
        publicId: img.publicId,
        caption: img.caption,
        isPrimary: img.isPrimary ?? i === 0,
      })),
    );
    setShowModal(true);
  };

  const handleSaveProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Mirror the server-side clamp so the number shown in the table after save
    // always matches what the API accepted.
    const total = Math.max(1, parseInt(totalUnits) || 1);
    const available = Math.min(Math.max(0, parseInt(availableUnits) || 0), total);

    const payload = {
      title,
      description,
      propertyType,
      listingType,
      price: parseFloat(price) || 0,
      currency,
      location,
      city,
      state,
      bedrooms: parseInt(bedrooms) || 0,
      bathrooms: parseInt(bathrooms) || 0,
      parkingSpaces: parseInt(parkingSpaces) || 0,
      status,
      isFeatured,
      totalUnits: total,
      availableUnits: available,
      amenities: amenities.trim() || undefined,
      features: features.trim() || undefined,
      images,
    };

    try {
      if (editingId) {
        await adminApi.properties.update(editingId, payload);
      } else {
        await adminApi.properties.create(payload);
      }
      setShowModal(false);
      resetForm();
      loadProperties();
    } catch (err: any) {
      alert(err.message || 'Failed to save property');
    } finally {
      setSubmitting(false);
    }
  };

  /** Quick status change straight from the table, no modal required. */
  const handleUpdateStatus = async (id: string, nextStatus: string) => {
    setSavingId(id);
    try {
      await adminApi.properties.update(id, { status: nextStatus });
      await loadProperties();
    } catch (err: any) {
      alert(err.message || 'Failed to update property status');
    } finally {
      setSavingId(null);
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
          <h1 className="text-2xl font-black text-neutral-900">Properties Management</h1>
          <p className="text-neutral-500 text-xs mt-0.5">
            Create, edit, publish, and manage real estate property listings
          </p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-md shadow-black/10"
        >
          <PlusIcon className="w-4 h-4" /> Add New Property
        </button>
      </div>

      {/* Properties Datatable */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-xs text-neutral-500">
            Loading properties catalog...
          </div>
        ) : properties.length === 0 ? (
          <div className="p-10 text-center text-xs text-neutral-500">
            No properties in database. Click &quot;Add New Property&quot; to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-4">Property</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Listing</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Units</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700 font-medium">
                {properties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-neutral-50">
                    <td className="p-4 font-bold text-neutral-900 max-w-xs truncate">
                      {prop.title}
                    </td>
                    <td className="p-4">{prop.propertyType}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded text-white ${
                          prop.listingType === 'SALE' ? 'bg-neutral-900' : 'bg-neutral-600'
                        }`}
                      >
                        {prop.listingType}
                      </span>
                    </td>
                    <td className="p-4 font-bold">₦{prop.price?.toLocaleString()}</td>
                    <td className="p-4">
                      {prop.location}, {prop.city}
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-neutral-900">
                        {prop.availableUnits ?? 1}
                      </span>
                      <span className="text-neutral-400"> / {prop.totalUnits ?? 1}</span>
                      {(prop.availableUnits ?? 1) === 0 && (
                        <span className="ml-1.5 text-[10px] font-extrabold uppercase text-red-600">
                          Sold out
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <select
                        value={prop.status}
                        onChange={(e) => handleUpdateStatus(prop.id, e.target.value)}
                        disabled={savingId === prop.id}
                        title="Update property status"
                        className={`px-2 py-1 text-[10px] font-extrabold uppercase rounded border-0 cursor-pointer disabled:opacity-50 ${statusChipClass(prop.status)}`}
                      >
                        {PROPERTY_STATUSES.map((option) => (
                          <option key={option} value={option} className="bg-white text-neutral-900">
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => openEdit(prop)}
                        className="p-2 text-neutral-500 hover:text-neutral-900 transition"
                        title="Edit Property"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProperty(prop.id)}
                        className="p-2 text-neutral-500 hover:text-red-600 transition"
                        title="Delete Property"
                      >
                        <TrashIcon className="w-4 h-4" />
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
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <h2 className="text-xl font-bold text-neutral-900">
                {editingId ? 'Edit Property Listing' : 'Add New Property Listing'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-500 hover:text-neutral-900"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveProperty} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Property Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 4 Bedroom Detached Duplex"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Listing Type *
                  </label>
                  <select
                    value={listingType}
                    onChange={(e) => setListingType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm"
                  >
                    <option value="SALE">For Sale</option>
                    <option value="RENT">For Rent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Property Type *
                  </label>
                  <input
                    type="text"
                    required
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    placeholder="e.g. Detached Duplex, Apartment, Land"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Price *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Lekki Phase 1"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Lekki"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Lagos"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Parking</label>
                  <input
                    type="number"
                    value={parkingSpaces}
                    onChange={(e) => setParkingSpaces(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Unit inventory — 1 of 1 for a standalone property, many for an
                  estate or block listing. */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Total Units
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={totalUnits}
                    onChange={(e) => setTotalUnits(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm"
                  />
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Use 1 for a single standalone property.
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Units Available
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={availableUnits}
                    onChange={(e) => setAvailableUnits(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm"
                  />
                  <p className="text-[10px] text-neutral-500 mt-1">
                    How many are still unsold or unlet.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm"
                  >
                    {PROPERTY_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="w-full inline-flex items-center gap-2.5 px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 accent-neutral-900"
                    />
                    <span className="text-xs font-bold text-neutral-700">
                      Featured on the homepage
                    </span>
                  </label>
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
                <label className="block text-xs font-bold text-neutral-700 mb-1">Amenities</label>
                <textarea
                  rows={2}
                  value={amenities}
                  onChange={(e) => setAmenities(e.target.value)}
                  placeholder="Comma-separated, e.g. Swimming Pool, 24/7 Security, Fitted Kitchen"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Features</label>
                <textarea
                  rows={2}
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="Comma-separated, e.g. En-suite Bedrooms, Walk-in Closet, Boys Quarters"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter full property description..."
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-5 py-2.5 border border-neutral-200 text-neutral-600 font-bold text-xs rounded-lg hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-lg shadow-md"
                >
                  {submitting
                    ? 'Saving Property...'
                    : editingId
                      ? 'Save Changes'
                      : 'Save & Publish Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
