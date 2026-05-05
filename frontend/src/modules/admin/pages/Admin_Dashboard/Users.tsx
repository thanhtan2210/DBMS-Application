import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Skeleton, Input } from '@admin/components/ui';
import { 
  Shield, 
  Search, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  UserCog,
  Ban
} from 'lucide-react';
import { adminListUsers, adminUpdateUserRole, adminUpdateUserStatus } from '@/modules/admin/services/user-service';

export default function Users() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(0);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res: any = await adminListUsers({ page, size: 20 });
      setUsers(res.content || []);
      setTotalPages(res.totalPages || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.fullName?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) || 
                          u.email?.toLowerCase().includes(debouncedSearchQuery.toLowerCase());
    // Generally only show Staff and Admin
    const isInternal = u.role === 'ADMIN' || u.role === 'STAFF';
    return matchesSearch && isInternal;
  });

  const handleRoleChange = async (id: number, newRole: string) => {
    try {
      await adminUpdateUserRole(id, newRole);
      fetchUsers();
    } catch(err) {
      console.error(err);
      alert('Failed to update role');
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'BANNED' ? 'ACTIVE' : 'BANNED';
    try {
      await adminUpdateUserStatus(id, newStatus);
      fetchUsers();
    } catch(err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Card className="p-6">
           <Skeleton className="h-64 w-full rounded-xl" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-extrabold text-on-surface">User Management</h2>
          <p className="text-on-surface-variant mt-1">Manage internal staff and administrators.</p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-6 border-b border-surface-container flex items-center justify-between bg-surface-container-lowest">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/50" />
            <Input 
              className="pl-10 h-10 text-xs" 
              placeholder="Search by name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">User Details</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {filteredUsers.map((user) => (
                <tr key={user.userId} className="hover:bg-surface-container-lowest transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center mt-1">
                        <UserCog className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{user.fullName}</p>
                        <p className="text-xs font-mono font-bold text-on-surface-variant mt-1">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      className="h-8 px-2 rounded-lg bg-surface-container border-none text-xs font-bold"
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.userId, e.target.value)}
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="STAFF">STAFF</option>
                      <option value="CUSTOMER">CUSTOMER</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={user.status === 'ACTIVE' ? 'success' : user.status === 'BANNED' ? 'error' : 'neutral'}>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={user.status === 'BANNED' ? "text-green-600 border-green-200 hover:bg-green-50" : "text-red-600 border-red-200 hover:bg-red-50"}
                      onClick={() => {
                        if(confirm(`Are you sure you want to ${user.status === 'BANNED' ? 'unban' : 'ban'} this user?`)) {
                           handleToggleStatus(user.userId, user.status);
                        }
                      }}
                    >
                      {user.status === 'BANNED' ? 'Unban' : 'Ban'}
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                 <tr>
                    <td colSpan={4} className="px-6 py-10 text-center italic text-on-surface-variant">No internal users found</td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-surface-container flex items-center justify-between">
           <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Page {page + 1} of {totalPages}</p>
           <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}><ChevronLeft className="w-4 h-4"/></Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}><ChevronRight className="w-4 h-4"/></Button>
           </div>
        </div>
      </Card>
    </div>
  );
}
