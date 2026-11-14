/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Bell,
  Coins,
  Plus,
  Check,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import { User, AppNotification } from '../types';
import { NavTab } from './Sidebar';
import { StorageService } from '../services/storage';

interface HeaderProps {
  currentUser: User;
  onOpenMobileSidebar: () => void;
  onNavigate: (tab: NavTab) => void;
  onOpenCreatePost: (type: 'lost' | 'found') => void;
  notifications: AppNotification[];
  onRefreshNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenMobileSidebar,
  onNavigate,
  onOpenCreatePost,
  notifications,
  onRefreshNotifications,
}) => {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowNotifDropdown(false);
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    StorageService.markAllNotificationsRead(currentUser.id);
    onRefreshNotifications();
  };

  const handleNotificationClick = (notif: AppNotification) => {
    StorageService.markNotificationRead(notif.id);
    onRefreshNotifications();
    setShowNotifDropdown(false);

    if (notif.relatedPostId) {
      onNavigate('my-posts');
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#F9F9F6]/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between">
      {/* Left section: mobile hamburger & breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 -ml-2 rounded-lg text-slate-700 hover:bg-slate-200/60 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="text-slate-900 font-semibold tracking-wide">CAMPUS PORTAL</span>
          <span aria-hidden="true">·</span>
          <span>Official Lost & Found Network</span>
        </div>
      </div>

      {/* Right section: actions & profile */}
      <div className="flex items-center gap-2 sm:gap-4" ref={dropdownRef}>
        {/* Quick Report Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => onOpenCreatePost('lost')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 border border-rose-200/80 hover:bg-rose-100 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Report Lost</span>
          </button>
          <button
            onClick={() => onOpenCreatePost('found')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Report Found</span>
          </button>
        </div>

        {/* R Coins Pill */}
        <button
          onClick={() => onNavigate('wallet')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50/80 border border-amber-300 text-amber-900 text-xs font-semibold hover:bg-amber-100 transition-colors"
          title="Click to view R Coins Wallet"
        >
          <Coins className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{currentUser.rCoins}</span>
          <span className="hidden sm:inline text-amber-800 font-medium">R Coins</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="relative p-2 rounded-lg text-slate-700 hover:bg-slate-200/70 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-xs text-slate-400">
                    No notifications yet. You're all caught up!
                  </div>
                ) : (
                  notifications.slice(0, 8).map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${
                        !notif.isRead ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="text-xs font-semibold text-slate-900 leading-tight">
                          {notif.title}
                        </h5>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {new Date(notif.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="px-4 py-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setShowNotifDropdown(false);
                    onNavigate('my-posts');
                  }}
                  className="text-xs font-semibold text-slate-700 hover:text-amber-600 inline-flex items-center gap-1"
                >
                  View My Claims & Activity
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Mini Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-amber-500/50"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-800 text-amber-300 font-bold flex items-center justify-center text-xs">
                {currentUser.name.charAt(0)}
              </div>
            )}
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900 truncate">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser.collegeEmail}</p>
              </div>
              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  onNavigate('profile');
                }}
                className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Student Profile & ID
              </button>
              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  onNavigate('wallet');
                }}
                className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                R Coins Wallet ({currentUser.rCoins})
              </button>
              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  onNavigate('my-posts');
                }}
                className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                My Reported Posts
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
