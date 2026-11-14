/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  UserCircle,
  Mail,
  Shield,
  Coins,
  Building,
  KeyRound,
  CheckCircle2,
  Calendar,
  Lock,
  Edit2,
  Save,
} from 'lucide-react';
import { User, ItemPost } from '../../types';
import { StorageService } from '../../services/storage';

interface ProfileViewProps {
  currentUser: User;
  posts: ItemPost[];
  onRefreshUser: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  posts,
  onRefreshUser,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [collegeEmail, setCollegeEmail] = useState(currentUser.collegeEmail);
  const [department, setDepartment] = useState(currentUser.department);
  const [studentId, setStudentId] = useState(currentUser.studentId);
  const [newPassword, setNewPassword] = useState('');
  const [saveMsg, setSaveMsg] = useState('');

  const myPostsCount = posts.filter((p) => p.postedByUserId === currentUser.id).length;
  const myReturnedCount = posts.filter(
    (p) => p.status === 'returned' && p.postedByUserId === currentUser.id
  ).length;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    currentUser.name = name.trim();
    currentUser.collegeEmail = collegeEmail.trim().toLowerCase();
    currentUser.department = department.trim();
    currentUser.studentId = studentId.trim();
    if (newPassword.trim()) {
      currentUser.passwordHash = newPassword.trim();
    }

    StorageService.saveUser(currentUser);
    StorageService.setCurrentUser(currentUser);
    setIsEditing(false);
    setSaveMsg('Profile and credentials updated successfully!');
    onRefreshUser();
    setTimeout(() => setSaveMsg(''), 4000);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold font-serif-title text-slate-900">
          Student Profile & Campus Credentials
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Authorized university student identity, verified college email, and activity summary.
        </p>
      </div>

      {saveMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveMsg}</span>
        </div>
      )}

      {/* College Virtual ID Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0B192C] via-[#10243E] to-[#1E3E62] text-white shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Subtle decorative watermark */}
        <div className="absolute right-4 bottom-2 opacity-10 select-none pointer-events-none">
          <Shield className="w-48 h-48 text-amber-300" />
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <div className="relative">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-24 h-24 rounded-2xl object-cover border-2 border-amber-400/80 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-slate-800 border-2 border-amber-400 flex items-center justify-center text-amber-300 text-3xl font-bold">
                {currentUser.name.charAt(0)}
              </div>
            )}
            <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider">
              {currentUser.role}
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white/10 text-amber-300 text-[11px] font-mono tracking-wider">
              <span>CAMPUS ID: {currentUser.studentId}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-title">{currentUser.name}</h2>
            <p className="text-xs sm:text-sm text-slate-300 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span>{currentUser.department}</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-300 font-medium">{currentUser.collegeEmail}</span>
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>
                  <strong>{currentUser.rCoins}</strong> R Coins Available
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  <strong>{myReturnedCount}</strong> Verified Returns
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="self-center sm:self-start px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors flex items-center gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Credentials'}</span>
          </button>
        </div>
      </div>

      {/* Edit Credentials Form */}
      {isEditing ? (
        <form
          onSubmit={handleSave}
          className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-4 animate-in fade-in"
        >
          <h3 className="text-base font-bold text-slate-900 font-serif-title">
            Update Student Credentials
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Student Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Official College Email</label>
              <input
                type="email"
                required
                value={collegeEmail}
                onChange={(e) => setCollegeEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Roll / Student ID Number</label>
              <input
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Academic Department</label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="block font-bold text-slate-700 text-xs">
              Change Password (leave blank to keep current)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new secure password"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 bg-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-2xs flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      ) : (
        /* Read-only profile details */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Campus Authorization
            </h3>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">College Email:</span>
                <span className="font-semibold text-slate-900">{currentUser.collegeEmail}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Student ID / Roll:</span>
                <span className="font-semibold text-slate-900">{currentUser.studentId}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Department:</span>
                <span className="font-semibold text-slate-900">{currentUser.department}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Portal Access:</span>
                <span className="font-semibold text-emerald-700">Active & Verified</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Good Samaritan Summary
            </h3>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Total Posts Created:</span>
                <span className="font-semibold text-slate-900">{myPostsCount}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Belongings Reunited:</span>
                <span className="font-semibold text-slate-900">{myReturnedCount}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">All-Time Coins Earned:</span>
                <span className="font-semibold text-amber-700">+{currentUser.totalCoinsEarned}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Member Since:</span>
                <span className="font-semibold text-slate-900">
                  {new Date(currentUser.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
