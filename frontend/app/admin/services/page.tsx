'use client';

import { useState, useEffect } from 'react';
import { api, ServiceItem } from '@/lib/api';
import { Briefcase, CheckCircle2 } from 'lucide-react';

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await api.services.getAll();
        setServices(data || []);
      } catch {
        // Fallback
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Services Content Management</h1>
        <p className="text-slate-500 text-xs mt-0.5">Core business service pillars active on SwiftStruct Limited platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((srv) => (
          <div key={srv.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 bg-blue-100 text-blue-700 font-extrabold text-[10px] uppercase rounded">
                Active Pillar
              </span>
              <span className="text-xs font-mono text-slate-400">/{srv.slug}</span>
            </div>

            <h3 className="font-bold text-slate-900 text-lg">{srv.name}</h3>
            <p className="text-slate-600 text-xs leading-relaxed">{srv.shortDescription}</p>

            {srv.features && (
              <div className="pt-2 border-t border-slate-100 space-y-1">
                {srv.features.split(',').slice(0, 3).map((f, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <CheckCircle2 className="w-3 h-3 text-blue-600" />
                    <span>{f.trim()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
