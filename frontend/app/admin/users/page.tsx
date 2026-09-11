'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/adminApi';
import { PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('STAFF');
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminApi.users.getAll();
      setUsers(data || []);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminApi.users.create({
        email,
        password,
        firstName,
        lastName,
        role,
      });
      setShowModal(false);
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
      loadUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateRole = async (id: string, newRole: string) => {
    setSavingId(id);
    try {
      await adminApi.users.update(id, { role: newRole });
      await loadUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to update role');
      await loadUsers();
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to remove this user?')) return;
    try {
      await adminApi.users.delete(id);
      loadUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to remove user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-neutral-900">Users & Staff Management</h1>
          <p className="text-neutral-500 text-xs mt-0.5">
            Manage staff accounts and role permissions (ADMIN, STAFF)
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-md shadow-black/10"
        >
          <PlusIcon className="w-4 h-4" /> Add Staff Account
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-xs text-neutral-500">
            Loading user accounts...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700 font-medium">
                {users.map((usr) => (
                  <tr key={usr.id} className="hover:bg-neutral-50">
                    <td className="p-4 font-bold text-neutral-900">
                      {usr.firstName} {usr.lastName}
                    </td>
                    <td className="p-4">{usr.email}</td>
                    <td className="p-4">
                      {usr.email === 'admin@swiftstruct.com' ? (
                        <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase rounded bg-neutral-900 text-white">
                          {usr.role}
                        </span>
                      ) : (
                        <select
                          value={usr.role}
                          onChange={(e) => handleUpdateRole(usr.id, e.target.value)}
                          disabled={savingId === usr.id}
                          title="Change role and access"
                          className={`px-2 py-1 text-[10px] font-extrabold uppercase rounded cursor-pointer border-0 disabled:opacity-50 ${
                            usr.role === 'ADMIN'
                              ? 'bg-neutral-900 text-white'
                              : 'bg-neutral-100 text-neutral-700'
                          }`}
                        >
                          <option value="STAFF" className="bg-white text-neutral-900">
                            STAFF
                          </option>
                          <option value="ADMIN" className="bg-white text-neutral-900">
                            ADMIN
                          </option>
                        </select>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {usr.email !== 'admin@swiftstruct.com' && (
                        <button
                          onClick={() => handleDeleteUser(usr.id)}
                          className="p-2 text-neutral-500 hover:text-red-600 transition"
                          title="Remove User"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal - Create User */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <h2 className="text-xl font-bold text-neutral-900">Add Staff Account</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-500 hover:text-neutral-900"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staff@swiftstruct.com"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm"
                >
                  <option value="STAFF">STAFF</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 border border-neutral-200 text-neutral-600 font-bold text-xs rounded-lg hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-lg shadow-md"
                >
                  {submitting ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
