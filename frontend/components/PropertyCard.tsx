import Link from 'next/link';
import { Bed, Bath, Car, MapPin, Tag } from 'lucide-react';
import { Property } from '@/lib/api';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const primaryImage =
    property.images?.find((img) => img.isPrimary)?.url ||
    property.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';

  const formattedPrice = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: property.currency || 'NGN',
    maximumFractionDigits: 0,
  }).format(property.price);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Image Container */}
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
        <img
          src={primaryImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md text-white shadow-md ${
              property.listingType === 'SALE' ? 'bg-blue-600' : 'bg-emerald-600'
            }`}
          >
            For {property.listingType}
          </span>
          {property.isFeatured && (
            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md text-amber-900 bg-amber-400 shadow-md">
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-2">
            <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">{property.location}, {property.city}</span>
          </div>

          <h3 className="font-bold text-slate-900 text-lg leading-snug group-hover:text-blue-600 transition line-clamp-2 mb-3">
            {property.title}
          </h3>

          {/* Specs */}
          <div className="flex items-center gap-4 text-xs font-medium text-slate-600 py-3 border-y border-slate-100 mb-4">
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4 text-slate-400" />
                <span>{property.bedrooms} Beds</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4 text-slate-400" />
                <span>{property.bathrooms} Baths</span>
              </div>
            )}
            {property.parkingSpaces > 0 && (
              <div className="flex items-center gap-1">
                <Car className="w-4 h-4 text-slate-400" />
                <span>{property.parkingSpaces} Parking</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Price & Action */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Price</span>
            <span className="text-xl font-extrabold text-slate-900">{formattedPrice}</span>
          </div>
          <Link
            href={`/properties/${property.slug}`}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-blue-600 transition shadow-sm"
          >
            View Property
          </Link>
        </div>
      </div>
    </div>
  );
}
