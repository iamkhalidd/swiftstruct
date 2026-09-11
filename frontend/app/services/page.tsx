import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { api, ServiceItem } from '@/lib/api';
import { ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export const revalidate = 60;

export default async function ServicesPage() {
  let services: ServiceItem[] = [];

  try {
    services = await api.services.getAll();
  } catch {
    // Fallback
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-white py-16 border-b border-neutral-200">
        <div className="container-custom">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
              Integrated Capabilities
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-neutral-900">
              SwiftStruct Professional Services
            </h1>
            <p className="text-neutral-600 text-base leading-relaxed">
              We operate across five integrated core business pillars — bridging real estate opportunities with structural engineering execution and complete project delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 flex-1">
        <div className="container-custom space-y-12">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12"
            >
              <div className={`lg:col-span-5 relative bg-neutral-50 min-h-[280px] ${index % 2 === 1 ? 'lg:order-last' : ''}`}>
                <img
                  src={service.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80'}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-neutral-900">
                    Service Pillar 0{index + 1}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                    {service.name}
                  </h2>
                  <p className="text-neutral-600 text-base leading-relaxed">
                    {service.shortDescription}
                  </p>

                  {/* Features tags */}
                  {service.features && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {service.features.split(',').map((feat, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 text-neutral-700 text-xs font-semibold rounded-md">
                          <CheckCircleIcon className="w-3.5 h-3.5 text-neutral-500" />
                          <span>{feat.trim()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <Link
                    href={`/services/${service.slug}`}
                    className="px-6 py-3 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-lg transition inline-flex items-center gap-2"
                  >
                    Explore {service.name} <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/contact?type=brief&service=${encodeURIComponent(service.name)}`}
                    className="text-xs font-bold text-neutral-900 hover:underline"
                  >
                    Request Consultation &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
