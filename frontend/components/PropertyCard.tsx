import Link from 'next/link';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { BathIcon, BedIcon, CarIcon } from '@/components/icons/UiIcons';
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
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Image Container */}
      <div className="relative aspect-16/10 bg-neutral-100 overflow-hidden">
        <img
          src={primaryImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span
            className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md text-white shadow-md ${
              property.listingType === 'SALE' ? 'bg-black' : 'bg-neutral-600'
            }`}
          >
            For {property.listingType}
          </span>
          {property.isFeatured && (
            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md text-neutral-900 bg-white border border-neutral-300 shadow-md">
              Featured
            </span>
          )}
          {property.totalUnits > 1 &&
            (property.availableUnits > 0 ? (
              <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md text-neutral-900 bg-neutral-100 border border-neutral-300 shadow-md">
                {property.availableUnits} of {property.totalUnits} units left
              </span>
            ) : (
              <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-md text-red-600 bg-white border border-neutral-300 shadow-md">
                All units taken
              </span>
            ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 mb-2">
            <MapPinIcon className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">{property.location}, {property.city}</span>
          </div>

          <h3 className="font-bold text-neutral-900 text-lg leading-snug group-hover:text-neutral-600 transition line-clamp-2 mb-3">
            {property.title}
          </h3>

          {/* Specs */}
          <div className="flex items-center gap-4 text-xs font-medium text-neutral-600 py-3 border-y border-neutral-100 mb-4">
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1">
                <BedIcon className="w-4 h-4 text-neutral-400" />
                <span>{property.bedrooms} Beds</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1">
                <BathIcon className="w-4 h-4 text-neutral-400" />
                <span>{property.bathrooms} Baths</span>
              </div>
            )}
            {property.parkingSpaces > 0 && (
              <div className="flex items-center gap-1">
                <CarIcon className="w-4 h-4 text-neutral-400" />
                <span>{property.parkingSpaces} Parking</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Price & Action */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="block text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Price</span>
            <span className="text-xl font-extrabold text-neutral-900">{formattedPrice}</span>
          </div>
          <Link
            href={`/properties/${property.slug}`}
            className="px-4 py-2 text-xs font-semibold text-white bg-black rounded-lg hover:bg-neutral-800 transition shadow-sm"
          >
            View Property
          </Link>
        </div>
      </div>
    </div>
  );
}
