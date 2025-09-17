'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';

interface Admin {
  id: number;
  name: string;
  email: string;
  username: string;
  phone: string;
  address: string;
  country: string;
  dateOfBirth: string;
  socialMediaLink: string;
  joiningDate: string;
  isVerified: boolean;
  uniqueId: string;
}

export default function DefaultCountryAdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDefaultCountryAdmins();
  }, []);

  const fetchDefaultCountryAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/defaultCountry');
      const data = await response.json();
      
      if (data.success) {
        setAdmins(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch admins');
      }
    } catch (err) {
      setError('An error occurred while fetching admins');
      console.error('Error fetching admins:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCountry = async (adminId: number, newCountry: string) => {
    if (!newCountry.trim()) {
      alert('Please enter a valid country');
      return;
    }

    try {
      const response = await fetch(`/api/admin/updateCountry/${adminId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ country: newCountry }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the local state
        setAdmins(admins.map(admin => 
          admin.id === adminId 
            ? { ...admin, country: newCountry }
            : admin
        ));
        alert('Country updated successfully!');
      } else {
        alert(data.message || 'Failed to update country');
      }
    } catch (err) {
      alert('An error occurred while updating country');
      console.error('Error updating country:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={fetchDefaultCountryAdmins}
                className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admins with Default Country</h1>
        <p className="mt-2 text-gray-600">
          Admins who have "Unknown" as their country ({admins.length} total)
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Action Required</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                These admins have "Unknown" as their country. You can update their country information by clicking the "Update Country" button.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Admins Table */}
      {admins.length > 0 ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {admin.name ? admin.name.charAt(0).toUpperCase() : '?'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{admin.name || 'No Name'}</div>
                          <div className="text-sm text-gray-500">@{admin.username || 'No Username'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{admin.email || 'No Email'}</div>
                      <div className="text-sm text-gray-500">{admin.phone || 'No Phone'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        {admin.country || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        admin.isVerified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {admin.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {admin.joiningDate ? new Date(admin.joiningDate).toLocaleDateString() : 'Not available'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <UpdateCountryButton 
                        adminId={admin.id}
                        adminName={admin.name || 'No Name'}
                        onUpdate={handleUpdateCountry}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">All admins have country information</h3>
          <p className="mt-1 text-sm text-gray-500">
            There are no admins with "Unknown" country. All admins have proper country information.
          </p>
        </div>
      )}
    </div>
  );
}

// Component for updating country
function UpdateCountryButton({ 
  adminId, 
  adminName, 
  onUpdate 
}: { 
  readonly adminId: number; 
  readonly adminName: string; 
  readonly onUpdate: (id: number, country: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [newCountry, setNewCountry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCountry.trim()) {
      onUpdate(adminId, newCountry.trim());
      setNewCountry('');
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-600 hover:text-blue-900"
      >
        Update Country
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <select
        value={newCountry}
        onChange={(e) => setNewCountry(e.target.value)}
        className="text-xs border border-gray-300 rounded px-2 py-1"
        autoFocus
      >
        <option value="">Select country</option>
        <option value="United States">United States</option>
        <option value="Canada">Canada</option>
        <option value="United Kingdom">United Kingdom</option>
        <option value="Germany">Germany</option>
        <option value="France">France</option>
        <option value="Japan">Japan</option>
        <option value="Australia">Australia</option>
        <option value="India">India</option>
        <option value="China">China</option>
        <option value="Brazil">Brazil</option>
      </select>
      <button
        type="submit"
        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
      >
        Save
      </button>
      <button
        type="button"
        onClick={() => {
          setIsOpen(false);
          setNewCountry('');
        }}
        className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400"
      >
        Cancel
      </button>
    </form>
  );
}
