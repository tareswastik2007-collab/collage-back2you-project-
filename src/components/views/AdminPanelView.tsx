/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  FileText,
  Gift,
  Coins,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Lock,
  Mail,
  AlertTriangle,
  Sparkles,
  BarChart3,
  Edit,
  Save,
  Check,
} from 'lucide-react';
import {
  User,
  ItemPost,
  ItemClaim,
  StationeryReward,
  RedemptionRequest,
  RCoinTransaction,
} from '../../types';
import { StorageService } from '../../services/storage';

interface AdminPanelViewProps {
  currentUser: User;
  users: User[];
  posts: ItemPost[];
  claims: ItemClaim[];
  rewards: StationeryReward[];
  redemptions: RedemptionRequest[];
  transactions: RCoinTransaction[];
  onRefresh: () => void;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  currentUser,
  users,
  posts,
  claims,
  rewards,
  redemptions,
  transactions,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<
    'accounts' | 'posts' | 'redemptions' | 'rewards' | 'analytics'
  >('accounts');

  // Account management state
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editStudentId, setEditStudentId] = useState('');
  const [editDept, setEditDept] = useState('');

  // Add new student modal state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserStudentId, setNewUserStudentId] = useState('');
  const [newUserDept, setNewUserDept] = useState('Computer Science');
  const [newUserRole, setNewUserRole] = useState<'student' | 'admin'>('student');

  // Add new stationery reward modal state
  const [showAddRewardModal, setShowAddRewardModal] = useState(false);
  const [newRewTitle, setNewRewTitle] = useState('');
  const [newRewCost, setNewRewCost] = useState(100);
  const [newRewStock, setNewRewStock] = useState(10);
  const [newRewCat, setNewRewCat] = useState<'Notebooks' | 'Writing' | 'Tools' | 'Accessories'>('Writing');
  const [newRewDesc, setNewRewDesc] = useState('');
  const [newRewImg, setNewRewImg] = useState('https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=500&q=80');

  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Update existing user credentials
  const handleStartEditUser = (u: User) => {
    setEditingUserId(u.id);
    setEditEmail(u.collegeEmail);
    setEditPassword(u.passwordHash);
    setEditStudentId(u.studentId);
    setEditDept(u.department);
  };

  const handleSaveUserCredentials = (userId: string) => {
    if (!editEmail.trim()) return;
    StorageService.updateStudentCredentials(
      userId,
      editEmail.trim(),
      editPassword.trim() || undefined,
      editStudentId.trim() || undefined,
      editDept.trim() || undefined
    );
    setEditingUserId(null);
    showNotice('Student official college credentials updated!');
    onRefresh();
  };

  // Add new authorized student
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    StorageService.registerAuthorizedUser({
      name: newUserName.trim(),
      collegeEmail: newUserEmail.trim().toLowerCase(),
      studentId: newUserStudentId.trim() || `B2Y-${Date.now().toString().slice(-4)}`,
      department: newUserDept.trim(),
      role: newUserRole,
      passwordHash: newUserPassword.trim() || 'College@2026',
      isActivated: true,
    });

    setShowAddUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('');
    showNotice('New verified student authorized for Back to You!');
    onRefresh();
  };

  // Post moderation
  const handleDeletePost = (id: string) => {
    if (confirm('Delete this post permanently as administrator?')) {
      StorageService.deletePost(id);
      showNotice('Post removed by administrator.');
      onRefresh();
    }
  };

  // Approve stationery redemption
  const handleApproveRedemption = (reqId: string) => {
    StorageService.approveRedemption(reqId, 'Approved by Campus Administrator');
    showNotice('Stationery redemption approved! Voucher marked ready for pickup.');
    onRefresh();
  };

  // Add new reward product
  const handleCreateReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRewTitle.trim()) return;

    const newRew: StationeryReward = {
      id: `rew_${Date.now()}`,
      title: newRewTitle.trim(),
      rCoinsRequired: Number(newRewCost),
      stock: Number(newRewStock),
      category: newRewCat,
      description: newRewDesc.trim(),
      imageUrl: newRewImg.trim(),
    };

    StorageService.saveReward(newRew);
    setShowAddRewardModal(false);
    setNewRewTitle('');
    setNewRewDesc('');
    showNotice('New stationery reward product added to catalogue!');
    onRefresh();
  };

  // Stats
  const stats = StorageService.getStats();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Admin Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <h1 className="text-2xl font-bold font-serif-title text-slate-900">
              Campus Administration Portal
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage authorized student emails, moderate campus listings, audit R Coins, and approve stationery vouchers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
            Super Administrator Active
          </span>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Admin Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-xl">
        <button
          onClick={() => setActiveTab('accounts')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'accounts'
              ? 'bg-slate-900 text-white shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Authorized Student Accounts ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('posts')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'posts'
              ? 'bg-slate-900 text-white shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Post Moderation ({posts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('redemptions')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'redemptions'
              ? 'bg-slate-900 text-white shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Gift className="w-3.5 h-3.5" />
          <span>Stationery Redemptions ({redemptions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rewards')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'rewards'
              ? 'bg-slate-900 text-white shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>Store Inventory ({rewards.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'analytics'
              ? 'bg-slate-900 text-white shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Campus Analytics</span>
        </button>
      </div>

      {/* 1. STUDENT ACCOUNTS & CREDENTIALS SETUP (Fulfilling prompt instruction) */}
      {activeTab === 'accounts' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-bold flex items-center gap-1.5 text-sm">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <span>Authorized Student Accounts & College Email Setup</span>
              </h4>
              <p className="text-amber-900/80 mt-0.5 leading-relaxed">
                Initial authorized students: <strong>Swastik Tare</strong>, <strong>Prince Gupta</strong>, and <strong>Samar Modak</strong>.
                You can directly edit and enter their actual college email IDs and passwords here without inventing emails.
              </p>
            </div>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-3.5 py-2 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 shrink-0 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Authorize New Student</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs divide-y divide-slate-100">
            {users.map((u) => {
              const isEditing = editingUserId === u.id;
              return (
                <div key={u.id} className="p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{u.name}</h4>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                              u.role === 'admin'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {u.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {u.studentId} · {u.department}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                        {u.rCoins} R Coins
                      </span>
                      <button
                        onClick={() => (isEditing ? setEditingUserId(null) : handleStartEditUser(u))}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>{isEditing ? 'Cancel' : 'Edit Credentials'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Inline edit panel for student credentials */}
                  {isEditing ? (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                      <h5 className="font-bold text-slate-800">
                        Set Official College Email & Password for {u.name}:
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-600 mb-1">
                            Official College Email
                          </label>
                          <input
                            type="email"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            placeholder="e.g. swastik.tare@college.edu"
                            className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-600 mb-1">
                            New Password
                          </label>
                          <input
                            type="text"
                            value={editPassword}
                            onChange={(e) => setEditPassword(e.target.value)}
                            placeholder="Set secure password"
                            className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-600 mb-1">
                            Student ID
                          </label>
                          <input
                            type="text"
                            value={editStudentId}
                            onChange={(e) => setEditStudentId(e.target.value)}
                            className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-600 mb-1">
                            Department
                          </label>
                          <input
                            type="text"
                            value={editDept}
                            onChange={(e) => setEditDept(e.target.value)}
                            className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          onClick={() => setEditingUserId(null)}
                          className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveUserCredentials(u.id)}
                          className="px-4 py-1.5 text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 rounded flex items-center gap-1 shadow-2xs"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Official Credentials</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-4 pt-1">
                      <span>
                        College Email: <strong className="text-slate-800">{u.collegeEmail}</strong>
                      </span>
                      <span>
                        Account Status: <span className="text-emerald-700 font-semibold">Active & Authorized</span>
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. POST MODERATION */}
      {activeTab === 'posts' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs divide-y divide-slate-100">
          {posts.map((post) => (
            <div key={post.id} className="p-4 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      post.type === 'lost' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-800'
                    }`}
                  >
                    {post.type}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{post.itemName}</h4>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Reported by {post.postedByName} · {post.location} · {post.date}
                </p>
                <p className="text-xs text-slate-600 mt-1 line-clamp-1">{post.description}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-500 capitalize">{post.status}</span>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Remove Post"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. STATIONERY REDEMPTIONS APPROVAL */}
      {activeTab === 'redemptions' && (
        <div className="space-y-4">
          {redemptions.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-xl border border-slate-200 p-8 text-xs text-slate-500">
              No stationery redemption requests pending.
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs divide-y divide-slate-100">
              {redemptions.map((red) => (
                <div key={red.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {red.redemptionCode}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{red.rewardTitle}</h4>
                    </div>
                    <p className="text-xs text-slate-500">
                      Requested by <strong>{red.userName}</strong> ({red.userEmail}) on{' '}
                      {new Date(red.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-slate-400">Coins Deducted: {red.rCoinsDeducted} R Coins</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase ${
                        red.status === 'approved_ready_for_pickup'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {red.status.replace(/_/g, ' ')}
                    </span>

                    {red.status === 'pending_approval' && (
                      <button
                        onClick={() => handleApproveRedemption(red.id)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs"
                      >
                        Approve Voucher
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. STATIONERY REWARD CATALOGUE MANAGER */}
      {activeTab === 'rewards' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-serif-title text-slate-900">
              College Stationery Products & Stock
            </h3>
            <button
              onClick={() => setShowAddRewardModal(true)}
              className="px-3.5 py-2 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Stationery Item</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rewards.map((rew) => (
              <div
                key={rew.id}
                className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <img src={rew.imageUrl} alt={rew.title} className="h-32 w-full object-cover rounded-lg" />
                  <h4 className="text-sm font-bold text-slate-900">{rew.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2">{rew.description}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-700">{rew.rCoinsRequired} R Coins</span>
                  <span className="text-slate-600">Stock: <strong>{rew.stock}</strong> units</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CAMPUS ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 uppercase font-bold">Total Lost Items</span>
              <p className="text-2xl font-bold font-serif-title text-rose-600 mt-2">{stats.totalLost}</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 uppercase font-bold">Total Found Items</span>
              <p className="text-2xl font-bold font-serif-title text-emerald-600 mt-2">{stats.totalFound}</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 uppercase font-bold">Return Success Rate</span>
              <p className="text-2xl font-bold font-serif-title text-blue-600 mt-2">{stats.returnRatePercent}%</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-xs text-slate-500 uppercase font-bold">R Coins Circulating</span>
              <p className="text-2xl font-bold font-serif-title text-amber-600 mt-2">{stats.totalCoinsCirculating}</p>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <form
            onSubmit={handleCreateUser}
            className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in"
          >
            <h3 className="text-base font-bold text-slate-900 font-serif-title">
              Authorize New Student
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Swastik Tare"
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official College Email</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="e.g. swastik.tare@college.edu"
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="Set initial password"
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student / Roll ID</label>
                  <input
                    type="text"
                    value={newUserStudentId}
                    onChange={(e) => setNewUserStudentId(e.target.value)}
                    placeholder="B2Y-2024-101"
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="student">Student</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowAddUserModal(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 rounded-lg"
              >
                Authorize Student
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Reward Modal */}
      {showAddRewardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <form
            onSubmit={handleCreateReward}
            className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in"
          >
            <h3 className="text-base font-bold text-slate-900 font-serif-title">
              Add New Stationery Reward
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newRewTitle}
                  onChange={(e) => setNewRewTitle(e.target.value)}
                  placeholder="e.g. Oxford Scientific Lab Notebook"
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">R Coins Required</label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={newRewCost}
                    onChange={(e) => setNewRewCost(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Available Stock</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newRewStock}
                    onChange={(e) => setNewRewStock(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={newRewDesc}
                  onChange={(e) => setNewRewDesc(e.target.value)}
                  placeholder="Product description and specifications..."
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowAddRewardModal(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 rounded-lg"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
