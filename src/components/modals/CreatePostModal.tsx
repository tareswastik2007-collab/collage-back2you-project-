/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  ShieldAlert,
  Info,
  Check,
  AlertCircle,
} from 'lucide-react';
import {
  ItemType,
  ItemCategory,
  ITEM_CATEGORIES,
  CAMPUS_LOCATIONS,
  User,
  ItemPost,
} from '../../types';

interface CreatePostModalProps {
  initialType?: ItemType;
  currentUser: User;
  onClose: () => void;
  onSubmit: (post: ItemPost) => void;
}

// Sample photo presets for rapid testing
const SAMPLE_PHOTOS = [
  { label: 'Backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80' },
  { label: 'Charger', url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=500&q=80' },
  { label: 'Watch', url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=500&q=80' },
  { label: 'Calculator', url: 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e485?auto=format&fit=crop&w=500&q=80' },
  { label: 'ID Card', url: 'https://images.unsplash.com/photo-1589330694653-dad6ef0140be?auto=format&fit=crop&w=500&q=80' },
  { label: 'Water Bottle', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=500&q=80' },
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  initialType = 'lost',
  currentUser,
  onClose,
  onSubmit,
}) => {
  const [postType, setPostType] = useState<ItemType>(initialType);
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Electronics');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [customLocation, setCustomLocation] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [approximateTime, setApproximateTime] = useState('02:00 PM');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [contactInfo, setContactInfo] = useState(currentUser.collegeEmail);
  const [isContactPrivate, setIsContactPrivate] = useState(true);
  const [imageUrl, setImageUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const isLost = postType === 'lost';

  // Handle local file upload as base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 2MB limit. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
      setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) {
      setErrorMsg('Please specify the Item Name.');
      return;
    }
    if (!description.trim()) {
      setErrorMsg('Please provide a brief description of the item.');
      return;
    }

    const resolvedLocation = customLocation.trim() ? customLocation.trim() : location;

    const newPost: ItemPost = {
      id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: postType,
      itemName: itemName.trim(),
      category,
      description: description.trim(),
      imageUrl: imageUrl.trim() || undefined,
      location: resolvedLocation,
      date,
      approximateTime,
      additionalDetails: additionalDetails.trim() || undefined,
      contactInfo: contactInfo.trim() || currentUser.collegeEmail,
      isContactPrivate,
      postedByUserId: currentUser.id,
      postedByName: currentUser.name,
      postedByEmail: currentUser.collegeEmail,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    onSubmit(newPost);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-[#0B192C] text-white">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${isLost ? 'bg-rose-500' : 'bg-emerald-500'}`}
            />
            <h2 className="text-lg font-bold font-serif-title">
              {isLost ? 'Report a Lost Item' : 'Report a Found Item'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section Selection Tabs: ITEM LOST vs ITEM FOUND */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setPostType('lost')}
              className={`py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                isLost
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>ITEM LOST</span>
              <span className="text-[10px] font-normal opacity-90">(I lost my belonging)</span>
            </button>
            <button
              type="button"
              onClick={() => setPostType('found')}
              className={`py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                !isLost
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span>ITEM FOUND</span>
              <span className="text-[10px] font-normal opacity-90">(I found someone's item)</span>
            </button>
          </div>

          {/* Item Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {isLost ? 'Lost Item Name' : 'Found Item Name'} <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder={isLost ? 'e.g., Wildcraft Black Backpack' : 'e.g., Casio Scientific Calculator'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Item Category <span className="text-rose-600">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 bg-white"
              >
                {ITEM_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Public Description <span className="text-rose-600">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                isLost
                  ? 'Describe general appearance, color, brand, and where you remember having it...'
                  : 'Describe general color, brand, condition, and any safe details for public browsing...'
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Note: Do NOT include secret identifying details here. Put confidential marks in the verification field below.
            </p>
          </div>

          {/* Campus Location & Custom Spot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Campus Location <span className="text-rose-600">*</span>
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 bg-white"
              >
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Specific Spot / Bench / Room (Optional)
              </label>
              <input
                type="text"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                placeholder="e.g. Table 4 near east entrance"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {isLost ? 'Date of Loss' : 'Date Found'} <span className="text-rose-600">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Approximate Time <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={approximateTime}
                onChange={(e) => setApproximateTime(e.target.value)}
                placeholder="e.g. 01:30 PM or After lunch"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              />
            </div>
          </div>

          {/* Image Upload or Presets */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-slate-500" />
                <span>Upload Item Photograph (Optional)</span>
              </label>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="text-xs text-rose-600 hover:underline"
                >
                  Remove image
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white border border-dashed border-slate-300 hover:border-amber-500 cursor-pointer text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 shadow-2xs transition-colors">
                <Upload className="w-4 h-4 text-amber-600" />
                <span>Choose Local File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <span className="text-xs text-slate-400">or use sample campus preset:</span>

              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_PHOTOS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setImageUrl(p.url)}
                    className={`text-[11px] px-2 py-1 rounded-md border transition-all ${
                      imageUrl === p.url
                        ? 'bg-amber-600 text-white border-amber-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {imageUrl && (
              <div className="mt-2 w-28 h-28 rounded-lg overflow-hidden border border-slate-300 relative shadow-2xs">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1 py-0.5 rounded">
                  Preview
                </span>
              </div>
            )}
          </div>

          {/* Additional Identification Details (Confidential) */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2">
            <div className="flex items-center gap-2 text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
              <label className="text-xs font-bold uppercase tracking-wider">
                Confidential Ownership Details (Private)
              </label>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              These details are <strong>never shown to the public</strong>. They are stored securely
              to verify legitimate ownership during the claim review stage (e.g. serial number digits,
              lock screen image, engraved text, hidden scratch, pouch contents).
            </p>
            <textarea
              rows={2}
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="e.g. Serial ends in 492; red sticker inside battery cover; lock screen is a golden retriever"
              className="w-full px-3 py-2 rounded-lg bg-white border border-amber-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            />
          </div>

          {/* Contact Information & Privacy Toggle */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Student Contact Information
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600">
                <input
                  type="checkbox"
                  checked={isContactPrivate}
                  onChange={(e) => setIsContactPrivate(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
                />
                <span>Keep Private (Recommended)</span>
              </label>
            </div>
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="College email or campus intercom"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 bg-white"
            />
            <p className="text-[11px] text-slate-400">
              {isContactPrivate
                ? 'Your contact details will only be revealed to the verified student once an ownership claim is safely approved.'
                : 'Your contact details will be visible on the public feed.'}
            </p>
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition-all flex items-center gap-2 ${
                isLost ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-700 hover:bg-emerald-800'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{isLost ? 'Submit Lost Item Post' : 'Submit Found Item Post'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
