/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  Search,
  CheckCircle2,
  PlusCircle,
  FileText,
  Coins,
  UserCircle,
  ShieldAlert,
  LogOut,
  Database,
  X,
} from 'lucide-react';
import { Logo } from './Logo';
import { User } from '../types';

export type NavTab =
  | 'dashboard'
  | 'lost-items'
  | 'found-items'
  | 'create-post'
  | 'my-posts'
  | 'wallet'
  | 'profile'
  | 'admin'
  | 'cloud-config';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  currentUser: User;
  onLogout: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  unreadNotifsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onLogout,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'lost-items' as NavTab, label: 'Lost Items', icon: Search },
    { id: 'found-items' as NavTab, label: 'Found Items', icon: CheckCircle2 },
    { id: 'create-post' as NavTab, label: 'Create a Post', icon: PlusCircle, highlight: true },
    { id: 'my-posts' as NavTab, label: 'My Posts', icon: FileText },
    { id: 'wallet' as NavTab, label: 'R Coins Wallet', icon: Coins },
    { id: 'profile' as NavTab, label: 'Profile', icon: UserCircle },
  ];

  // Admin section
  const isAdmin = currentUser.role === 'admin' || currentUser.collegeEmail.includes('swastik');

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0B192C] text-slate-100 flex flex-col border-r border-slate-800/80 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800/80">
          <Logo size="md" variant="light" showTagline={false} />
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Mini Profile Card */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-slate-900/80 border border-slate-800/90 flex items-center gap-3">
          <div className="relative">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-amber-500/40 flex items-center justify-center font-bold text-amber-400 text-sm">
                {currentUser.name.charAt(0)}
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0B192C] rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white truncate">{currentUser.name}</h4>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
              <Coins className="w-3.5 h-3.5 shrink-0" />
              <span>{currentUser.rCoins} R Coins</span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Navigation
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                    : item.highlight
                    ? 'text-amber-300 hover:bg-slate-800/80 hover:text-white'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-slate-950' : item.highlight ? 'text-amber-400' : 'text-slate-400'
                  }`}
                />
                <span className="truncate">{item.label}</span>
                {item.highlight && !isActive && (
                  <span className="ml-auto text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-amber-500/20 text-amber-300">
                    New
                  </span>
                )}
              </button>
            );
          })}

          {/* Admin section */}
          <div className="pt-4 mt-4 border-t border-slate-800/80">
            <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Administration
            </p>
            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  currentTab === 'admin'
                    ? 'bg-amber-500 text-slate-950 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Admin Panel</span>
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  Manager
                </span>
              </button>
            )}

            <button
              onClick={() => handleNavClick('cloud-config')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'cloud-config'
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Database className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Firebase & Storage</span>
            </button>
          </div>
        </div>

        {/* Bottom logout */}
        <div className="p-3 border-t border-slate-800/80">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
