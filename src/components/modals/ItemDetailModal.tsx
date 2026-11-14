/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  User,
  Share2,
  Trash2,
  Edit3,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { ItemPost, User as UserType } from '../../types';
import { StorageService } from '../../services/storage';

interface ItemDetailModalProps {
  post: ItemPost;
  currentUser: UserType;
  onClose: () => void;
  onDeletePost?: (postId: string) => void;
  onClaimSubmitted?: () => void;
  onNavigateToMyPosts?: () => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  post,
  currentUser,
  onClose,
  onDeletePost,
  onClaimSubmitted,
  onNavigateToMyPosts,
}) => {
  const [isClaimMode, setIsClaimMode] = useState(false);
  const [proofAnswers, setProofAnswers] = useState({
    identificationProof: '',
    lostDateLocation: '',
    additionalVerification: '',
  });
  const [claimError, setClaimError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const isOwner = post.postedByUserId === currentUser.id;
  const isLost = post.type === 'lost';
  const isReturned = post.status === 'returned';

  // Check if current user has already submitted a claim on this post
  const existingClaims = StorageService.getClaims().filter(
    (c) => c.postId === post.id && c.claimantUserId === currentUser.id
  );
  const hasExistingClaim = existingClaims.length > 0;

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofAnswers.identificationProof.trim()) {
      setClaimError('Please provide unique identification details.');
      return;
    }
    if (!proofAnswers.lostDateLocation.trim()) {
      setClaimError('Please provide approximate time and location circumstances.');
      return;
    }

    setIsSubmitting(true);
    try {
      StorageService.createClaim(post, currentUser, proofAnswers);
      setIsSubmitting(false);
      setClaimSuccess(true);
      if (onClaimSubmitted) onClaimSubmitted();
    } catch (err) {
      setIsSubmitting(false);
      setClaimError('Failed submitting claim. Please try again.');
    }
  };

  const handleReportSuspicious = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim()) return;
    // Log report to storage notifications for admin
    StorageService.addNotification({
      userId: 'user_swastik', // Admin
      title: `Suspicious Post Reported: "${post.itemName}"`,
      message: `${currentUser.name} reported post ${post.id}. Reason: "${reportReason.trim()}"`,
      type: 'system',
      relatedPostId: post.id,
    });
    setReportSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-[#0B192C] text-white">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider text-white ${
                isReturned ? 'bg-slate-700' : isLost ? 'bg-rose-600' : 'bg-emerald-600'
              }`}
            >
              {isReturned ? 'Returned' : isLost ? 'LOST ITEM' : 'FOUND ITEM'}
            </span>
            <span className="text-slate-400 text-xs hidden sm:inline">·</span>
            <span className="text-xs text-slate-300 hidden sm:inline">{post.category}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Main Image if any */}
          {post.imageUrl && (
            <div className="h-64 sm:h-72 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <img
                src={post.imageUrl}
                alt={post.itemName}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Title & Category */}
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold font-serif-title text-slate-900">
                {post.itemName}
              </h2>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 shrink-0">
                {post.category}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Reported on {new Date(post.createdAt).toLocaleDateString()} by {post.postedByName}
            </p>
          </div>

          {/* Key metadata grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Campus Location:</strong> {post.location}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
              <span>
                <strong>Date:</strong> {post.date}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500 shrink-0" />
              <span>
                <strong>Approximate Time:</strong> {post.approximateTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-500 shrink-0" />
              <span>
                <strong>Status:</strong>{' '}
                <span className="capitalize font-semibold text-slate-900">
                  {post.status.replace('_', ' ')}
                </span>
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Item Description
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-100">
              {post.description}
            </p>
          </div>

          {/* Private info guard alert */}
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Zero-Fraud Verification Policy</p>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                To prevent false claims on college belongings, matching a photo or category alone
                does NOT grant possession. Claimants must provide verifiable private details
                (markings, unlock confirmation, serial digits) before a safe handover is authorized.
              </p>
            </div>
          </div>

          {/* Owner specific view */}
          {isOwner && (
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Post Management (You Created This)
                </span>
                {onDeletePost && !isReturned && (
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this post?')) {
                        onDeletePost(post.id);
                        onClose();
                      }
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Post
                  </button>
                )}
              </div>

              {post.additionalDetails && (
                <div className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                  <strong className="text-slate-800">Your Private Verification Notes:</strong>{' '}
                  {post.additionalDetails}
                </div>
              )}

              {onNavigateToMyPosts && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToMyPosts();
                  }}
                  className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                >
                  Manage Claims & Safe Handover in "My Posts"
                </button>
              )}
            </div>
          )}

          {/* Claim Mode Form (When non-owner clicks "Claim This Item") */}
          {!isOwner && !isReturned && isClaimMode && !claimSuccess && (
            <form
              onSubmit={handleClaimSubmit}
              className="p-5 rounded-xl bg-amber-50/60 border border-amber-300 space-y-4 animate-in fade-in"
            >
              <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                  <ShieldAlert className="w-4 h-4 text-amber-700" />
                  <span>Submit Ownership Verification Claim</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsClaimMode(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>

              {claimError && (
                <div className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                  {claimError}
                </div>
              )}

              {/* Q1: Specific private markings */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  1. What unique markings, scratches, wallpaper, or pouch contents prove this is yours? *
                </label>
                <textarea
                  required
                  rows={2}
                  value={proofAnswers.identificationProof}
                  onChange={(e) =>
                    setProofAnswers({ ...proofAnswers, identificationProof: e.target.value })
                  }
                  placeholder="e.g. Inside zip has a silver keychain; crack on bottom left; phone wallpaper is a car..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40 bg-white"
                />
              </div>

              {/* Q2: Time and location circumstance */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  2. Where and when did you last have or misplace this item on campus? *
                </label>
                <input
                  type="text"
                  required
                  value={proofAnswers.lostDateLocation}
                  onChange={(e) =>
                    setProofAnswers({ ...proofAnswers, lostDateLocation: e.target.value })
                  }
                  placeholder="e.g. Around 1:30 PM at the cafeteria corner table"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40 bg-white"
                />
              </div>

              {/* Q3: Additional verifiable proof */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  3. Additional proof (e.g. serial digits, passcode unlock demonstration upon meetup)
                </label>
                <input
                  type="text"
                  value={proofAnswers.additionalVerification}
                  onChange={(e) =>
                    setProofAnswers({ ...proofAnswers, additionalVerification: e.target.value })
                  }
                  placeholder="e.g. Can unlock passcode on spot; invoice in college email; name written on 1st page"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40 bg-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsClaimMode(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Claim to Finder'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Claim Submitted Success Message */}
          {claimSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h4 className="text-sm font-bold">Ownership Claim Submitted Successfully!</h4>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                {post.postedByName} has been notified to review your verification answers. Once
                approved, you will receive an in-app notification to coordinate a safe campus handover!
              </p>
              <button
                onClick={() => {
                  onClose();
                  if (onNavigateToMyPosts) onNavigateToMyPosts();
                }}
                className="mt-2 text-xs font-bold text-emerald-700 hover:underline"
              >
                Track claim in "My Posts" →
              </button>
            </div>
          )}

          {/* Report Suspicious Post Box */}
          {isReporting && !reportSubmitted && (
            <form
              onSubmit={handleReportSuspicious}
              className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-3"
            >
              <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Report Suspicious / Inappropriate Post</span>
              </h4>
              <textarea
                required
                rows={2}
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Describe why this post is suspicious or violates college conduct..."
                className="w-full p-2.5 rounded-lg border border-rose-300 text-xs text-slate-900 bg-white"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReporting(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-xs font-bold px-4 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700"
                >
                  Submit Report to Admin
                </button>
              </div>
            </form>
          )}

          {reportSubmitted && (
            <div className="p-3 rounded-lg bg-slate-100 text-xs text-slate-700">
              Thank you. This post has been flagged for administrative review.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!isOwner && !isReporting && !reportSubmitted && (
              <button
                onClick={() => setIsReporting(true)}
                className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Report Post</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Close
            </button>

            {/* Non-owner CTA: Claim or Contact */}
            {!isOwner && !isReturned && !isClaimMode && !claimSuccess && (
              <button
                onClick={() => setIsClaimMode(true)}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-all flex items-center gap-1.5 ${
                  !isLost ? 'bg-amber-600 hover:bg-amber-700' : 'bg-slate-900 hover:bg-slate-800'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {hasExistingClaim
                    ? 'Claim Already Submitted (Update)'
                    : !isLost
                    ? 'Claim This Item (Prove Ownership)'
                    : 'I Found This Item (Coordinate Return)'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
