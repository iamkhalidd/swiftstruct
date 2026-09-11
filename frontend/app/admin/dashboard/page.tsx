'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/adminApi';
import {
  Home,
  HardHat,
  Inbox,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  RefreshCw,
  Building2,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [propertiesCount, setPropertiesCount] = useState<number>(0);
  const [projects, setProjects] = useState<any[]>([]);
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [propsRes, projRes, enqRes] = await Promise.all([
        adminApi.properties.getAll(),
        adminApi.projects.getAll(),
        adminApi.enquiries.getAll(),
      ]);

      setPropertiesCount(propsRes.total || propsRes.data?.length || 0);
      setProjects(projRes.data || []);
      setEnquiries(enqRes || []);
    } catch {
      // Graceful fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const activeProjectsCount = projects.filter((p) => p.status === 'ONGOING').length;
  const completedProjectsCount = projects.filter((p) => p.status === 'COMPLETED').length;
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'NEW').length;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 text-xs mt-0.5">
            System metrics, real estate listings, and project enquiries summary
          </p>
        </div>
        <button
          onClick={loadData}
          className="p-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-slate-600 text-xs font-bold flex items-center gap-1.5 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold">
            <Home className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Properties</span>
            <span className="text-2xl font-black text-slate-900 block">{propertiesCount}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold">
            <HardHat className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Projects</span>
            <span className="text-2xl font-black text-slate-900 block">{activeProjectsCount}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Projects</span>
            <span className="text-2xl font-black text-slate-900 block">{completedProjectsCount}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center font-bold">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Enquiries</span>
            <span className="text-2xl font-black text-slate-900 block">{newEnquiriesCount}</span>
          </div>
        </div>
      </div>

      {/* Recent Enquiries Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Lead Enquiries</h2>
            <p className="text-slate-500 text-xs">Submissions from properties, project briefs, and contact forms</p>
          </div>
          <Link
            href="/admin/enquiries"
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            Manage All Enquiries <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-10 text-center text-xs text-slate-500">Loading enquiries...</div>
        ) : enquiries.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500">No enquiries submitted yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Email / Phone</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {enquiries.slice(0, 5).map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">{enq.name}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-slate-100 font-mono text-[10px] uppercase font-bold text-slate-800 rounded">
                        {enq.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <div>{enq.email}</div>
                      <div className="text-slate-400 text-[11px]">{enq.phone}</div>
                    </td>
                    <td className="p-4 max-w-xs truncate">{enq.subject || enq.message}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded ${
                          enq.status === 'NEW'
                            ? 'bg-amber-100 text-amber-800'
                            : enq.status === 'RESOLVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-[11px]">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
