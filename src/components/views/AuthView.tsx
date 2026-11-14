/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Shield,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  UserCheck,
  Sparkles,
  HelpCircle,
  Settings,
} from 'lucide-react';
import { Logo } from '../Logo';
import { User } from '../../types';
import { StorageService } from '../../services/storage';

interface AuthViewProps {
  onLoginSuccess: (user: User) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotNotice, setForgotNotice] = useState<string | null>(null);

  // Setup / activation modal for the 3 initial students
  const [showCredentialSetupModal, setShowCredentialSetupModal] = useState(false);
  const [selectedSetupStudentId, setSelectedSetupStudentId] = useState('user_swastik');
  const [setupCollegeEmail, setSetupCollegeEmail] = useState('');
  const [setupPassword, setSetupPassword] = useState('');
  const [setupNotice, setSetupNotice] = useState<string | null>(null);

  const allUsers = StorageService.getUsers();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const targetUser = StorageService.getUserByEmail(email);

    if (!targetUser) {
      setErrorMsg(
        'Access Denied: This email is not registered in the college authorized student directory. Only authorized students may enter.'
      );
      return;
    }

    if (targetUser.passwordHash !== password.trim()) {
      setErrorMsg('Incorrect password. Please verify and try again.');
      return;
    }

    // Success
    StorageService.setCurrentUser(targetUser);
    onLoginSuccess(targetUser);
  };

  // Quick switch for one of the three students
  const handleQuickStudentLogin = (user: User) => {
    setEmail(user.collegeEmail);
    setPassword(user.passwordHash);
    StorageService.setCurrentUser(user);
    onLoginSuccess(user);
  };

  // Handle forgot password
  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = StorageService.getUserByEmail(forgotEmail);
    if (!user) {
      setForgotNotice('No authorized student record found with this college email.');
    } else {
      setForgotNotice(
        `Temporary password reset link sent to ${user.collegeEmail}. (Your current password is: ${user.passwordHash})`
      );
    }
  };

  // Handle first-time setup / credential update for Swastik, Prince, or Samar
  const handleSaveOfficialCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupCollegeEmail.trim() || !setupPassword.trim()) {
      setSetupNotice('Please provide both official college email and a secure password.');
      return;
    }

    const success = StorageService.updateStudentCredentials(
      selectedSetupStudentId,
      setupCollegeEmail.trim(),
      setupPassword.trim()
    );

    if (success) {
      setSetupNotice('Official credentials saved successfully! You can now log in.');
      setEmail(setupCollegeEmail.trim());
      setPassword(setupPassword.trim());
      setTimeout(() => {
        setShowCredentialSetupModal(false);
        setSetupNotice(null);
      }, 1500);
    } else {
      setSetupNotice('Failed to update credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F6] flex flex-col justify-between text-slate-800">
      {/* Top collegiate header */}
      <div className="h-16 px-6 sm:px-12 flex items-center justify-between border-b border-slate-200/80 bg-white/60 backdrop-blur-xs">
        <Logo size="md" variant="dark" showTagline={false} />
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Shield className="w-4 h-4 text-amber-600" />
          <span>Restricted Campus Portal · Verified Students Only</span>
        </div>
      </div>

      {/* Main container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Hero Column: Motto, Branding & Philosophy */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-900 border border-amber-400/30 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>COLLEGE LOST & FOUND MANAGEMENT</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold font-serif-title text-[#0B192C] leading-tight">
              “A Little Help. <br />
              A Lost Item. <br />
              <span className="text-amber-600 font-serif-title">A Way Back to You.”</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-lg mx-auto lg:mx-0">
              A trusted campus-exclusive platform where college students report lost belongings, post
              found items, verify true ownership with zero fraud, and earn <strong>R Coins</strong> rewards.
            </p>

            {/* Initial authorized students badge */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Initial Authorized Students
                </span>
                <button
                  type="button"
                  onClick={() => setShowCredentialSetupModal(true)}
                  className="text-xs text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Setup / Change Emails</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {allUsers.slice(0, 3).map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickStudentLogin(u)}
                    className="p-2 rounded-lg border border-slate-200 bg-slate-50/80 hover:bg-amber-50 hover:border-amber-300 text-left transition-all group"
                  >
                    <div className="text-xs font-bold text-slate-900 group-hover:text-amber-800 truncate">
                      {u.name}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {u.collegeEmail}
                    </div>
                    <div className="text-[9px] font-semibold text-emerald-600 mt-1">
                      Click to Test Login →
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Secure Login Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-5">
              <div className="text-center space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold font-serif-title text-[#0B192C]">
                  Student Sign In
                </h2>
                <p className="text-xs text-slate-500">
                  Enter your official college email ID and password
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Official College Email ID
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. swastik.tare@college.edu"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-xs text-amber-700 hover:text-amber-800 font-medium"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#0B192C] hover:bg-[#1E3E62] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </form>

              <div className="pt-3 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={() => setShowCredentialSetupModal(true)}
                  className="text-xs font-semibold text-slate-600 hover:text-amber-700"
                >
                  Need to configure student college emails? <strong>Admin Setup & Activation</strong>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <form
            onSubmit={handleForgotPasswordSubmit}
            className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in"
          >
            <h3 className="text-base font-bold text-slate-900 font-serif-title flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-600" />
              <span>Password Recovery</span>
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your authorized college email address to receive password recovery details.
            </p>

            {forgotNotice && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                {forgotNotice}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Registered College Email
              </label>
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="e.g. swastik.tare@college.edu"
                className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotNotice(null);
                }}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold bg-[#0B192C] text-white hover:bg-slate-800 rounded-lg"
              >
                Send Password Reset
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admin Setup & Student Credentials Configuration Modal */}
      {showCredentialSetupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <form
            onSubmit={handleSaveOfficialCredentials}
            className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-serif-title">
                  Admin Setup & Student Email Verification
                </h3>
                <p className="text-xs text-slate-500">
                  Set actual college email IDs & passwords for the initial students
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCredentialSetupModal(false)}
                className="text-xs text-slate-400 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            {setupNotice && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                {setupNotice}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Select Student Account to Configure:
                </label>
                <select
                  value={selectedSetupStudentId}
                  onChange={(e) => {
                    setSelectedSetupStudentId(e.target.value);
                    const sel = allUsers.find((u) => u.id === e.target.value);
                    if (sel) {
                      setSetupCollegeEmail(sel.collegeEmail);
                      setSetupPassword(sel.passwordHash);
                    }
                  }}
                  className="w-full p-2.5 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="user_swastik">Swastik Tare (Lead Administrator / CSE)</option>
                  <option value="user_prince">Prince Gupta (Student / ECE)</option>
                  <option value="user_samar">Samar Modak (Student / ME)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Actual Official College Email ID:
                </label>
                <input
                  type="email"
                  required
                  value={setupCollegeEmail}
                  onChange={(e) => setSetupCollegeEmail(e.target.value)}
                  placeholder="e.g. swastik.tare@college.edu or custom institute domain"
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Account Password:
                </label>
                <input
                  type="text"
                  required
                  value={setupPassword}
                  onChange={(e) => setSetupPassword(e.target.value)}
                  placeholder="Set login password"
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              Only authorized students with these registered emails can log into the application.
              Additional students can be authorized anytime from the Admin Panel.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowCredentialSetupModal(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 rounded-lg"
              >
                Save College Credentials
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Collegiate Footer */}
      <footer className="py-4 px-6 text-center text-xs text-slate-400 border-t border-slate-200/80">
        BACK TO YOU © {new Date().getFullYear()} · University Campus Lost & Found System · Official Student Union
      </footer>
    </div>
  );
};
