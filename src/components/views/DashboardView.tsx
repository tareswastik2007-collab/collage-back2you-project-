/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Coins,
  ArrowRight,
  Plus,
  Clock,
  MapPin,
  Sparkles,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { User, ItemPost, ITEM_CATEGORIES, CAMPUS_LOCATIONS } from '../../types';
import { NavTab } from '../Sidebar';

interface DashboardViewProps {
  currentUser: User;
  posts: ItemPost[];
  onNavigate: (tab: NavTab) => void;
  onOpenCreatePost: (type: 'lost' | 'found') => void;
  onSelectItem: (post: ItemPost) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  posts,
  onNavigate,
  onOpenCreatePost,
  onSelectItem,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'lost' | 'found'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  // Stats calculation
  const totalLost = posts.filter((p) => p.type === 'lost').length;
  const totalFound = posts.filter((p) => p.type === 'found').length;
  const totalReturned = posts.filter((p) => p.status === 'returned').length;
  const totalCoinsEarned = currentUser.totalCoinsEarned;

  // Potential smart matches for current user
  const userLostPosts = posts.filter(
    (p) => p.postedByUserId === currentUser.id && p.type === 'lost' && p.status !== 'returned'
  );
  const potentialMatches = posts.filter(
    (p) =>
      p.type === 'found' &&
      p.status === 'active' &&
      p.postedByUserId !== currentUser.id &&
      userLostPosts.some(
        (lp) =>
          lp.category === p.category ||
          lp.location === p.location ||
          p.itemName.toLowerCase().includes(lp.itemName.toLowerCase()) ||
          lp.itemName.toLowerCase().includes(p.itemName.toLowerCase())
      )
  );

  // Filtered posts
  const filteredPosts = posts.filter((post) => {
    if (filterType !== 'all' && post.type !== filterType) return false;
    if (selectedCategory !== 'all' && post.category !== selectedCategory) return false;
    if (selectedLocation !== 'all' && post.location !== selectedLocation) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = post.itemName.toLowerCase().includes(q);
      const matchCat = post.category.toLowerCase().includes(q);
      const matchLoc = post.location.toLowerCase().includes(q);
      const matchDesc = post.description.toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchLoc && !matchDesc) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B192C] via-[#10243E] to-[#1E3E62] text-white p-6 sm:p-8 shadow-md border border-slate-800">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Official College Campus Network</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif-title font-bold tracking-tight text-white">
            Welcome Back, {currentUser.name.split(' ')[0]}!
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            “A Little Help. A Lost Item. A Way Back to You.”
            <br />
            Report misplaced belongings, assist fellow campus students, verify ownership securely, and earn R Coins.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenCreatePost('lost')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-sm transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Report Lost Item
            </button>
            <button
              onClick={() => onOpenCreatePost('found')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-sm transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Report Found Item
            </button>
            <button
              onClick={() => onNavigate('lost-items')}
              className="px-4 py-2 text-xs sm:text-sm font-medium rounded-xl bg-white/10 hover:bg-white/15 text-white backdrop-blur-xs transition-colors flex items-center gap-1.5"
            >
              Browse All Items
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Decorative Watermark Emblem */}
        <div className="absolute right-4 -bottom-10 opacity-10 pointer-events-none select-none hidden md:block">
          <Coins className="w-72 h-72 text-amber-300" />
        </div>
      </div>

      {/* Dynamic Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Lost */}
        <div
          onClick={() => onNavigate('lost-items')}
          className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Lost Items
            </span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600 group-hover:scale-105 transition-transform">
              <Search className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-serif-title text-slate-900">
              {totalLost}
            </span>
            <span className="text-xs text-rose-600 font-medium">Reported</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">misplaced on campus</p>
        </div>

        {/* Total Found */}
        <div
          onClick={() => onNavigate('found-items')}
          className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Found Items
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-serif-title text-slate-900">
              {totalFound}
            </span>
            <span className="text-xs text-emerald-600 font-medium">Discovered</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">awaiting rightful owners</p>
        </div>

        {/* Successfully Returned */}
        <div
          onClick={() => onNavigate('my-posts')}
          className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Successfully Returned
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-serif-title text-slate-900">
              {totalReturned}
            </span>
            <span className="text-xs text-blue-600 font-medium">Reunited</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">verified handovers</p>
        </div>

        {/* Total R Coins Earned */}
        <div
          onClick={() => onNavigate('wallet')}
          className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:border-amber-300 hover:shadow-xs transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              R Coins Earned
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-serif-title text-slate-900">
              {totalCoinsEarned}
            </span>
            <span className="text-xs text-amber-700 font-medium">Available: {currentUser.rCoins}</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">5 coins / return</p>
        </div>
      </div>

      {/* Smart Match Suggestion Alert (If any found items match user's lost reports) */}
      {potentialMatches.length > 0 && (
        <div className="p-4 sm:p-5 rounded-xl bg-amber-50/90 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-950">
                Potential Match Detected on Campus!
              </h3>
              <p className="text-xs text-amber-900/80 mt-0.5 leading-relaxed">
                We found {potentialMatches.length} recently posted item(s) that might belong to you
                (e.g., "{potentialMatches[0].itemName}" at {potentialMatches[0].location}).
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectItem(potentialMatches[0])}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors shrink-0 shadow-2xs"
          >
            Review Potential Match
          </button>
        </div>
      )}

      {/* Feed Section: Search & Quick Filters */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold font-serif-title text-slate-900">
              Campus Lost & Found Feed
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live reports across university blocks, library, sports ground, and labs
            </p>
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                filterType === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Posts ({posts.length})
            </button>
            <button
              onClick={() => setFilterType('lost')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                filterType === 'lost'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lost ({totalLost})
            </button>
            <button
              onClick={() => setFilterType('found')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                filterType === 'found'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Found ({totalFound})
            </button>
          </div>
        </div>

        {/* Search Bar & Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by item name, location, or keyword..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            >
              <option value="all">All Categories</option>
              {ITEM_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            >
              <option value="all">All Campus Locations</option>
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Posts Cards Grid */}
        {filteredPosts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-xl border border-slate-200 p-8 space-y-3">
            <Filter className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">No matching items found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search query, clearing filters, or report a new lost or found item.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPosts.map((post) => {
              const isLost = post.type === 'lost';
              const isReturned = post.status === 'returned';

              return (
                <div
                  key={post.id}
                  className="rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col overflow-hidden group"
                >
                  {/* Image container */}
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt={post.itemName}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                        <Search className="w-8 h-8 stroke-1 text-slate-300 mb-1" />
                        <span className="text-xs">No photograph provided</span>
                      </div>
                    )}

                    {/* Status badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-white shadow-2xs ${
                          isReturned
                            ? 'bg-slate-800'
                            : isLost
                            ? 'bg-rose-600'
                            : 'bg-emerald-700'
                        }`}
                      >
                        {isReturned ? 'Returned' : isLost ? 'LOST' : 'FOUND'}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="text-[11px] font-medium text-slate-700 bg-white/95 px-2 py-0.5 rounded-md shadow-2xs backdrop-blur-xs">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                        {post.itemName}
                      </h4>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {post.description}
                      </p>
                    </div>

                    {/* Meta location and time */}
                    <div className="space-y-1 pt-2 border-t border-slate-100 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">{post.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          {post.date} · {post.approximateTime}
                        </span>
                      </div>
                    </div>

                    {/* Footer with posted by & CTA */}
                    <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                      <span className="text-[11px] text-slate-500 truncate">
                        By <strong className="text-slate-800">{post.postedByName}</strong>
                      </span>

                      <button
                        onClick={() => onSelectItem(post)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-amber-600 text-white transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
