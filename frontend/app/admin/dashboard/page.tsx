'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/adminApi';
import {
  HomeIcon,
  WrenchScrewdriverIcon,
  InboxIcon,
  CheckCircleIcon,
  ArrowUpRightIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

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
          <h1 className="text-2xl font-black text-neutral-900">Dashboard Overview</h1>
          <p className="text-neutral-500 text-xs mt-0.5">
            System metrics, real estate listings, and project enquiries summary
          </p>
        </div>
        <button
          onClick={loadData}
          className="p-2 border border-neutral-200 bg-white hover:bg-neutral-50 rounded-lg text-neutral-600 text-xs font-bold flex items-center gap-1.5 shadow-sm"
        >
          <ArrowPathIcon className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-neutral-100 text-neutral-900 rounded-xl flex items-center justify-center font-bold">
            <HomeIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Total Properties
            </span>
            <span className="text-2xl font-black text-neutral-900 block">{propertiesCount}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-neutral-100 text-neutral-900 rounded-xl flex items-center justify-center font-bold">
            <WrenchScrewdriverIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Active Projects
            </span>
            <span className="text-2xl font-black text-neutral-900 block">
              {activeProjectsCount}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-neutral-100 text-neutral-900 rounded-xl flex items-center justify-center font-bold">
            <CheckCircleIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Completed Projects
            </span>
            <span className="text-2xl font-black text-neutral-900 block">
              {completedProjectsCount}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-neutral-100 text-neutral-900 rounded-xl flex items-center justify-center font-bold">
            <InboxIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              New Enquiries
            </span>
            <span className="text-2xl font-black text-neutral-900 block">{newEnquiriesCount}</span>
          </div>
        </div>
      </div>

      {/* Recent Enquiries Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">Recent Lead Enquiries</h2>
            <p className="text-neutral-500 text-xs">
              Submissions from properties, project briefs, and contact forms
            </p>
          </div>
          <Link
            href="/admin/enquiries"
            className="text-xs font-bold text-neutral-900 hover:underline flex items-center gap-1"
          >
            Manage All Enquiries <ArrowUpRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-10 text-center text-xs text-neutral-500">Loading enquiries...</div>
        ) : enquiries.length === 0 ? (
          <div className="p-10 text-center text-xs text-neutral-500">
            No enquiries submitted yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Email / Phone</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700 font-medium">
                {enquiries.slice(0, 5).map((enq) => (
                  <tr key={enq.id} className="hover:bg-neutral-50">
                    <td className="p-4 font-bold text-neutral-900">{enq.name}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 bg-neutral-100 font-mono text-[10px] uppercase font-bold text-neutral-800 rounded">
                        {enq.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <div>{enq.email}</div>
                      <div className="text-neutral-500 text-[11px]">{enq.phone}</div>
                    </td>
                    <td className="p-4 max-w-xs truncate">{enq.subject || enq.message}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded ${
                          enq.status === 'NEW'
                            ? 'bg-neutral-900 text-white'
                            : enq.status === 'RESOLVED'
                              ? 'bg-neutral-200 text-neutral-800'
                              : 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-500 text-[11px]">
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
