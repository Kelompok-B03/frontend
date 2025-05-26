"use client";
import { useState, useEffect } from 'react';
import { getUserList, blockUser, unblockUser, UserDTO } from '@/modules/AdminModule/service';
import { appColors } from '@/constants/colors';
import { 
  UserCircleIcon, 
  EllipsisVerticalIcon, 
  LockClosedIcon, 
  LockOpenIcon, 
  EyeIcon 
} from '@heroicons/react/24/outline';
import Image from 'next/image'; 
import { useRouter } from 'next/navigation'; 

export default function UsersSection() {
  const router = useRouter();
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [blockModalOpen, setBlockModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);
  const [blockReason, setBlockReason] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUserList();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleActionMenu = (userId: string | null) => {
    setActionMenuOpen(prevId => prevId === userId ? null : userId);
  };

  const closeAllMenus = () => {
    setActionMenuOpen(null);
  };

  const handleViewDetails = (user: UserDTO) => {
    router.push(`/admin/users/${user.id}`);
    closeAllMenus();
  };

  const openBlockModal = (user: UserDTO) => {
    setSelectedUser(user);
    setBlockReason('');
    setBlockModalOpen(true);
    closeAllMenus();
  };

  const handleBlockUser = async () => {
    if (!selectedUser || !blockReason.trim()) return;
    
    setIsProcessing(true);
    try {
      await blockUser(selectedUser.id, blockReason);
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === selectedUser.id 
            ? { ...user, active: false, status: 'BLOCKED' } 
            : user
        )
      );
      setBlockModalOpen(false);
      setSelectedUser(null);
      setBlockReason('');
    } catch (err) {
      console.error('Failed to block user:', err);
      alert('Failed to block user. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnblockUser = async (user: UserDTO) => {
    if (!confirm(`Are you sure you want to unblock ${user.name || user.email}?`)) {
      return;
    }
    
    try {
      await unblockUser(user.id);
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === user.id 
            ? { ...u, active: true, status: 'ACTIVE' } 
            : u
        )
      );
    } catch (err) {
      console.error('Failed to unblock user:', err);
      alert('Failed to unblock user. Please try again.');
    }
    closeAllMenus();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading users...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded">
        {error}
        <button 
          onClick={() => fetchUsers()} 
          className="ml-2 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold" style={{ color: appColors.textDark }}>Users</h1>
        <p className="text-sm" style={{ color: appColors.textDarkMuted }}>
          Manage user accounts and permissions.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: appColors.textDarkMuted }}>User</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: appColors.textDarkMuted }}>Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: appColors.textDarkMuted }}>Role</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: appColors.textDarkMuted }}>Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: appColors.textDarkMuted }}>Joined</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: appColors.textDarkMuted }}>Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      {user.profilePictureUrl ? (
                        <Image src={user.profilePictureUrl} alt={user.name} width={40} height={40} className="rounded-full" unoptimized />
                      ) : (
                        <UserCircleIcon className="h-8 w-8" style={{ color: appColors.textDarkMuted }} />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium" style={{ color: appColors.textDark }}>
                        {user.name || 'No Name'}
                      </div>
                      {user.phoneNumber && (
                        <div className="text-xs" style={{ color: appColors.textDarkMuted }}>
                          {user.phoneNumber}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm" style={{ color: appColors.textDark }}>{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm" style={{ color: appColors.textDark }}>
                    {user.roles?.map(role => role).join(', ') || user.role || 'DONOR'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.active ? 'Active' : 'Blocked'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: appColors.textDarkMuted }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                  <button
                    onClick={() => toggleActionMenu(user.id)}
                    className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  >
                    <EllipsisVerticalIcon className="h-5 w-5" />
                  </button>
                  
                  {actionMenuOpen === user.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
                      <button
                        onClick={() => handleViewDetails(user)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <EyeIcon className="h-4 w-4 inline mr-2" />
                        View Details
                      </button>
                      
                      {user.active ? (
                        <button
                          onClick={() => openBlockModal(user)}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <LockClosedIcon className="h-4 w-4 inline mr-2" />
                          Block User
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnblockUser(user)}
                          className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                        >
                          <LockOpenIcon className="h-4 w-4 inline mr-2" />
                          Unblock User
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Block User Modal */}
      {blockModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium mb-4" style={{ color: appColors.textDark }}>Block User</h3>
            <p className="mb-2 text-sm" style={{ color: appColors.textDarkMuted }}>
              You are about to block <span className="font-semibold">{selectedUser.name || selectedUser.email}</span>. This will prevent them from logging in and using the platform.
            </p>
            <p className="mb-4 text-sm" style={{ color: appColors.textDarkMuted }}>
              Please provide a reason for blocking:
            </p>
            <textarea
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="Enter reason for blocking..."
              className="w-full p-2 border rounded mb-4"
              rows={4}
              style={{ borderColor: appColors.lightGrayBg }}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setBlockModalOpen(false)}
                className="px-4 py-2 border rounded"
                style={{
                  borderColor: appColors.lightGrayBg,
                  color: appColors.textDark
                }}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={handleBlockUser}
                disabled={!blockReason.trim() || isProcessing}
                className="px-4 py-2 rounded text-white disabled:opacity-50"
                style={{ backgroundColor: appColors.babyPinkAccent }}
              >
                {isProcessing ? 'Processing...' : 'Block User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}