/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Clock,
  Plus,
  Filter,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { ItemPost, ItemType, ITEM_CATEGORIES, CAMPUS_LOCATIONS } from '../../types';

interface FeedListViewProps {
  type: ItemType;
  posts: ItemPost[];
  onSelectItem: (post: ItemPost) => void;
  onOpenCreatePost: (type: ItemType) => void;
}

export const FeedListView: React.FC<FeedListViewProps> = ({
  type,
  posts,
  onSelectItem,
  onOpenCreatePost,
}) => {
  const isLost = type === 'lost';
  const pageTitle = isLost ? 'Reported Lost Belongings' : 'Reported Found Items on Campus';
  const pageDescription = isLost
    ? 'Browse items misplaced by students across the college campus. If you have found any of these, review and help return them.'
    : 'Items found and reported by students and campus staff awaiting their rightful owners.';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest'>('recent');

  const filteredPosts = posts
    .filter((p) => p.type === type)
    .filter((post) => {
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
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${isLost ? 'bg-rose-500' : 'bg-emerald-500'}`}
            />
            <h1 className="text-2xl font-bold font-serif-title text-slate-900">{pageTitle}</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">{pageDescription}</p>
        </div>

        <button
          onClick={() => onOpenCreatePost(type)}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center gap-2 shrink-0 ${
            isLost
              ? 'bg-rose-600 hover:bg-rose-700 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Report {isLost ? 'Lost Item' : 'Found Item'}</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${isLost ? 'lost' : 'found'} items by name, keywords...`}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          >
            <option value="all">All Categories ({ITEM_CATEGORIES.length})</option>
            {ITEM_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          >
            <option value="all">All Locations</option>
            {CAMPUS_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          >
            <option value="recent">Most Recent First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Grid listing */}
      {filteredPosts.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-xl border border-slate-200 p-8 space-y-3">
          <Filter className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No {isLost ? 'lost' : 'found'} items match your criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search filters or create a new post to notify the campus.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosts.map((post) => {
            const isReturned = post.status === 'returned';

            return (
              <div
                key={post.id}
                className="rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.itemName}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                      <Search className="w-8 h-8 stroke-1 text-slate-300 mb-1" />
                      <span className="text-xs">No image attached</span>
                    </div>
                  )}

                  {/* Status Banner */}
                  <div className="absolute top-3 left-3">
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

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                      {post.itemName}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {post.description}
                    </p>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="truncate">{post.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{post.date}</span>
                      <span aria-hidden="true">·</span>
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{post.approximateTime}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <span className="text-[11px] text-slate-500 truncate">
                      Reported by <strong className="text-slate-800">{post.postedByName}</strong>
                    </span>

                    <button
                      onClick={() => onSelectItem(post)}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-amber-600 text-white transition-colors"
                    >
                      {isReturned ? 'View History' : !isLost ? 'Claim This Item' : 'I Found This'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
