'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/adminApi';
import { ArrowPathIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const data = await adminApi.enquiries.getAll();
      setEnquiries(data || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await adminApi.enquiries.updateStatus(id, newStatus);
      loadEnquiries();
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-neutral-900">Enquiries & Lead Management</h1>
          <p className="text-neutral-500 text-xs mt-0.5">
            Track property inspection requests, project briefs, and client inquiries
          </p>
        </div>
        <button
          onClick={loadEnquiries}
          className="px-3.5 py-2 border border-neutral-200 bg-white hover:bg-neutral-50 rounded-lg text-neutral-700 text-xs font-bold flex items-center gap-1.5 shadow-sm"
        >
          <ArrowPathIcon className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Enquiries List */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-neutral-100 font-bold text-xs uppercase tracking-wider text-neutral-500">
            Received Submissions ({enquiries.length})
          </div>

          {loading ? (
            <div className="p-10 text-center text-xs text-neutral-500">Loading enquiries...</div>
          ) : enquiries.length === 0 ? (
            <div className="p-10 text-center text-xs text-neutral-500">
              No enquiries submitted yet.
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {enquiries.map((enq) => (
                <div
                  key={enq.id}
                  onClick={() => setSelectedEnquiry(enq)}
                  className={`p-5 cursor-pointer hover:bg-neutral-50 transition ${
                    selectedEnquiry?.id === enq.id
                      ? 'bg-neutral-100 border-l-4 border-black'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-sm text-neutral-900">{enq.name}</span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded ${
                        enq.status === 'NEW'
                          ? 'bg-neutral-900 text-white'
                          : enq.status === 'RESOLVED'
                            ? 'bg-neutral-200 text-neutral-800'
                            : 'bg-neutral-100 text-neutral-700'
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-neutral-500 mb-2">
                    <span className="font-mono bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">
                      {enq.type}
                    </span>
                    <span>• {enq.email}</span>
                  </div>

                  <p className="text-xs text-neutral-600 line-clamp-2">
                    {enq.subject || enq.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Enquiry Details & Status Changer */}
        <div className="lg:col-span-5">
          {selectedEnquiry ? (
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-6 sticky top-8">
              <div className="border-b border-neutral-100 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-neutral-500 tracking-wider">
                    {selectedEnquiry.type} Submission
                  </span>
                  <h2 className="text-xl font-bold text-neutral-900">{selectedEnquiry.name}</h2>
                </div>

                {/* Workflow Status Dropdown */}
                <select
                  value={selectedEnquiry.status}
                  onChange={(e) => handleStatusChange(selectedEnquiry.id, e.target.value)}
                  className="px-3 py-1.5 bg-neutral-100 border border-neutral-200 text-xs font-bold rounded-lg text-neutral-900"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <div className="space-y-3 text-xs text-neutral-700">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-neutral-500">
                    Email Address
                  </span>
                  <a
                    href={`mailto:${selectedEnquiry.email}`}
                    className="font-bold text-neutral-900 hover:underline"
                  >
                    {selectedEnquiry.email}
                  </a>
                </div>

                <div>
                  <span className="block text-[10px] uppercase font-bold text-neutral-500">
                    Phone Number
                  </span>
                  <a href={`tel:${selectedEnquiry.phone}`} className="font-bold text-neutral-900">
                    {selectedEnquiry.phone}
                  </a>
                </div>

                {selectedEnquiry.location && (
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-neutral-500">
                      Location
                    </span>
                    <span className="font-bold text-neutral-900">{selectedEnquiry.location}</span>
                  </div>
                )}

                {selectedEnquiry.budget && (
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-neutral-500">
                      Estimated Budget
                    </span>
                    <span className="font-bold text-neutral-900">{selectedEnquiry.budget}</span>
                  </div>
                )}

                {selectedEnquiry.serviceRequested && (
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-neutral-500">
                      Service Required
                    </span>
                    <span className="font-bold text-neutral-900">
                      {selectedEnquiry.serviceRequested}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-neutral-100">
                <span className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">
                  Message / Brief Details
                </span>
                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 leading-relaxed whitespace-pre-line">
                  {selectedEnquiry.message}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-10 rounded-2xl border border-neutral-200 shadow-sm text-center text-neutral-500 text-xs space-y-2">
              <ChatBubbleLeftIcon className="w-8 h-8 text-neutral-300 mx-auto" />
              <p>Select an enquiry from the list to view complete details and update lead status.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
