/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  Coins,
  ArrowRight,
  Trash2,
  Sparkles,
  KeyRound,
  MessageSquare,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User, ItemPost, ItemClaim, CAMPUS_LOCATIONS } from '../../types';
import { StorageService } from '../../services/storage';

interface MyPostsViewProps {
  currentUser: User;
  posts: ItemPost[];
  claims: ItemClaim[];
  onRefresh: () => void;
  onSelectItem: (post: ItemPost) => void;
}

export const MyPostsView: React.FC<MyPostsViewProps> = ({
  currentUser,
  posts,
  claims,
  onRefresh,
  onSelectItem,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'lost' | 'found' | 'incoming-claims' | 'my-claims' | 'returned'
  >('lost');

  // Selected claim for review / handover modal
  const [selectedClaimForReview, setSelectedClaimForReview] = useState<ItemClaim | null>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | 'proof' | null>(null);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [handoverSpot, setHandoverSpot] = useState(CAMPUS_LOCATIONS[0]);
  const [handoverTime, setHandoverTime] = useState('Tomorrow at 03:00 PM');
  const [otpInput, setOtpInput] = useState('');
  const [handoverMessage, setHandoverMessage] = useState('');

  // Data sets
  const myLostPosts = posts.filter((p) => p.postedByUserId === currentUser.id && p.type === 'lost');
  const myFoundPosts = posts.filter((p) => p.postedByUserId === currentUser.id && p.type === 'found');
  const incomingClaims = claims.filter((c) => c.finderUserId === currentUser.id);
  const mySubmittedClaims = claims.filter((c) => c.claimantUserId === currentUser.id);
  const returnedPosts = posts.filter(
    (p) =>
      p.status === 'returned' &&
      (p.postedByUserId === currentUser.id || p.returnedToUserId === currentUser.id)
  );

  const handleDeletePost = (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      StorageService.deletePost(id);
      onRefresh();
    }
  };

  const handleApproveClaim = (claim: ItemClaim) => {
    claim.status = 'approved';
    claim.finderFeedback = feedbackNote || 'Verification details approved. Safe handover scheduled.';
    claim.handoverDetails = {
      location: handoverSpot,
      scheduledTime: handoverTime,
      notes: feedbackNote,
      claimantConfirmed: false,
      finderConfirmed: false,
      handoverOtp: Math.floor(1000 + Math.random() * 9000).toString(),
    };
    claim.updatedAt = new Date().toISOString();

    StorageService.saveClaim(claim);

    // Update post status
    const post = StorageService.getPostById(claim.postId);
    if (post) {
      post.status = 'handover_scheduled';
      StorageService.savePost(post);
    }

    // Notify claimant
    StorageService.addNotification({
      userId: claim.claimantUserId,
      title: 'Claim Approved! Handover Scheduled',
      message: `${currentUser.name} approved your claim for "${claim.postTitle}". Meet at ${handoverSpot} at ${handoverTime}.`,
      type: 'claim_approved',
      relatedPostId: claim.postId,
      relatedClaimId: claim.id,
    });

    setSelectedClaimForReview(null);
    setReviewAction(null);
    onRefresh();
  };

  const handleRejectClaim = (claim: ItemClaim) => {
    claim.status = 'rejected';
    claim.finderFeedback = feedbackNote || 'Details provided did not match the item.';
    claim.updatedAt = new Date().toISOString();
    StorageService.saveClaim(claim);

    StorageService.addNotification({
      userId: claim.claimantUserId,
      title: 'Claim Needs Clarification or Was Declined',
      message: `${currentUser.name} reviewed your claim for "${claim.postTitle}": ${feedbackNote || 'Not matched'}.`,
      type: 'claim_rejected',
      relatedPostId: claim.postId,
      relatedClaimId: claim.id,
    });

    setSelectedClaimForReview(null);
    setReviewAction(null);
    onRefresh();
  };

  const handleConfirmHandover = (claim: ItemClaim, party: 'claimant' | 'finder') => {
    const result = StorageService.confirmHandoverStep(
      claim.id,
      party,
      party === 'claimant' ? otpInput : undefined
    );
    setHandoverMessage(result.message);

    if (result.completed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    onRefresh();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold font-serif-title text-slate-900">
          My Campus Posts & Handover Tracking
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor your reported lost items, review incoming ownership claims, and coordinate verified handovers.
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-xl">
        <button
          onClick={() => setActiveSubTab('lost')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === 'lost'
              ? 'bg-white text-slate-900 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          My Lost Items ({myLostPosts.length})
        </button>
        <button
          onClick={() => setActiveSubTab('found')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === 'found'
              ? 'bg-white text-slate-900 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          My Found Posts ({myFoundPosts.length})
        </button>
        <button
          onClick={() => setActiveSubTab('incoming-claims')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeSubTab === 'incoming-claims'
              ? 'bg-amber-500 text-slate-950 shadow-2xs font-bold'
              : 'text-amber-800 hover:bg-amber-100/60'
          }`}
        >
          <span>Incoming Claims</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900 text-white">
            {incomingClaims.length}
          </span>
        </button>
        <button
          onClick={() => setActiveSubTab('my-claims')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === 'my-claims'
              ? 'bg-white text-slate-900 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Claims I Submitted ({mySubmittedClaims.length})
        </button>
        <button
          onClick={() => setActiveSubTab('returned')}
          className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeSubTab === 'returned'
              ? 'bg-white text-slate-900 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Returned Items ({returnedPosts.length})
        </button>
      </div>

      {/* 1. MY LOST POSTS */}
      {activeSubTab === 'lost' && (
        <div className="space-y-4">
          {myLostPosts.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-xl border border-slate-200 p-8 space-y-2">
              <p className="text-sm text-slate-600 font-medium">You haven't reported any lost items.</p>
              <p className="text-xs text-slate-400">If you misplace anything on campus, report it to alert your peers.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myLostPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                        Lost Item
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-1">{post.itemName}</h4>
                      <p className="text-xs text-slate-500">{post.category} · {post.location}</p>
                    </div>

                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded capitalize ${
                        post.status === 'returned'
                          ? 'bg-emerald-50 text-emerald-800'
                          : post.status === 'claim_pending'
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {post.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">{post.description}</p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => onSelectItem(post)}
                      className="text-xs font-semibold text-amber-700 hover:text-amber-800"
                    >
                      View Full Details
                    </button>
                    {post.status !== 'returned' && (
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. MY FOUND POSTS */}
      {activeSubTab === 'found' && (
        <div className="space-y-4">
          {myFoundPosts.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-xl border border-slate-200 p-8 space-y-2">
              <p className="text-sm text-slate-600 font-medium">You haven't reported any found items.</p>
              <p className="text-xs text-slate-400">Earn 5 R Coins for every item you find and return to its rightful owner!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myFoundPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-xs transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        Found Item
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-1">{post.itemName}</h4>
                      <p className="text-xs text-slate-500">{post.category} · {post.location}</p>
                    </div>

                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded capitalize ${
                        post.status === 'returned'
                          ? 'bg-emerald-50 text-emerald-800'
                          : post.status === 'claim_pending'
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {post.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">{post.description}</p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => onSelectItem(post)}
                      className="text-xs font-semibold text-amber-700 hover:text-amber-800"
                    >
                      View Full Details
                    </button>
                    {post.status !== 'returned' && (
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. INCOMING CLAIMS TO REVIEW (Where I am the finder) */}
      {activeSubTab === 'incoming-claims' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Finder Verification Duty:</strong> Review the claimant's answers carefully.
              Verify private details before approving the campus handover.
            </span>
          </div>

          {incomingClaims.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-xl border border-slate-200 p-8 text-xs text-slate-500">
              No ownership claims have been submitted on your found items yet.
            </div>
          ) : (
            <div className="space-y-4">
              {incomingClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        Claim on: "{claim.postTitle}"
                      </h4>
                      <p className="text-xs text-slate-500">
                        Claimed by <strong>{claim.claimantName}</strong> ({claim.claimantEmail}) on{' '}
                        {new Date(claim.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider self-start sm:self-auto ${
                        claim.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : claim.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {claim.status}
                    </span>
                  </div>

                  {/* Answers submitted */}
                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <strong className="text-slate-800 block mb-0.5">
                        1. Unique Markings & Belonging Proof:
                      </strong>
                      <p className="text-slate-700 leading-relaxed">
                        {claim.answers.identificationProof}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <strong className="text-slate-800 block mb-0.5">
                        2. Lost Time & Circumstances:
                      </strong>
                      <p className="text-slate-700 leading-relaxed">
                        {claim.answers.lostDateLocation}
                      </p>
                    </div>

                    {claim.answers.additionalVerification && (
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <strong className="text-slate-800 block mb-0.5">
                          3. Additional Proof / Test:
                        </strong>
                        <p className="text-slate-700 leading-relaxed">
                          {claim.answers.additionalVerification}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Safe Handover details if approved */}
                  {claim.status === 'approved' && claim.handoverDetails && (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          <span>Safe Handover Coordinates</span>
                        </div>
                        <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-800">
                          Handover OTP: {claim.handoverDetails.handoverOtp}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-950">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>{claim.handoverDetails.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>{claim.handoverDetails.scheduledTime}</span>
                        </div>
                      </div>

                      {/* Finder Confirmation Button */}
                      <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between">
                        <span className="text-xs text-emerald-900">
                          Status:{' '}
                          {claim.handoverDetails.finderConfirmed
                            ? 'You confirmed physical return'
                            : 'Awaiting your physical return confirmation'}
                        </span>

                        {!claim.handoverDetails.finderConfirmed && (
                          <button
                            onClick={() => handleConfirmHandover(claim, 'finder')}
                            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors flex items-center gap-1.5 shadow-2xs"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            Confirm Handover Completed (+5 R Coins)
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Finder Actions if still under review */}
                  {claim.status === 'submitted' && (
                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setSelectedClaimForReview(claim);
                          setReviewAction('reject');
                        }}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-rose-700 hover:bg-rose-50"
                      >
                        Reject Claim
                      </button>
                      <button
                        onClick={() => {
                          setSelectedClaimForReview(claim);
                          setReviewAction('approve');
                        }}
                        className="px-4 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-amber-600 text-white transition-colors"
                      >
                        Approve & Schedule Safe Handover
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. CLAIMS I SUBMITTED (Where I am the claimant) */}
      {activeSubTab === 'my-claims' && (
        <div className="space-y-4">
          {mySubmittedClaims.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-xl border border-slate-200 p-8 text-xs text-slate-500">
              You haven't claimed any found items yet.
            </div>
          ) : (
            <div className="space-y-4">
              {mySubmittedClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        My Claim on: "{claim.postTitle}"
                      </h4>
                      <p className="text-xs text-slate-500">
                        Found by <strong>{claim.finderName}</strong> ({claim.finderEmail})
                      </p>
                    </div>

                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider self-start sm:self-auto ${
                        claim.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : claim.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {claim.status}
                    </span>
                  </div>

                  {claim.finderFeedback && (
                    <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
                      <strong>Finder Message:</strong> {claim.finderFeedback}
                    </div>
                  )}

                  {/* Safe Handover OTP Confirmation Room */}
                  {claim.status === 'approved' && claim.handoverDetails && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                        <KeyRound className="w-4 h-4 text-amber-600" />
                        <span>Safe Handover Meeting Details</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Location: <strong>{claim.handoverDetails.location}</strong>
                        <br />
                        Time: <strong>{claim.handoverDetails.scheduledTime}</strong>
                      </p>

                      <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-medium text-slate-700">
                            Enter Finder's Handover Code:
                          </label>
                          <input
                            type="text"
                            maxLength={4}
                            placeholder="4-digit OTP"
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value)}
                            className="w-24 px-2 py-1 text-center font-mono text-xs rounded border border-slate-300 uppercase"
                          />
                        </div>

                        <button
                          onClick={() => handleConfirmHandover(claim, 'claimant')}
                          className="px-4 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                        >
                          Confirm I Received My Item
                        </button>
                      </div>

                      {handoverMessage && (
                        <p className="text-xs font-semibold text-emerald-700">{handoverMessage}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. RETURNED ITEMS ARCHIVE */}
      {activeSubTab === 'returned' && (
        <div className="space-y-4">
          {returnedPosts.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-xl border border-slate-200 p-8 text-xs text-slate-500">
              No returned belongings in your history yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {returnedPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                      Successfully Returned
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(post.returnedAt || post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{post.itemName}</h4>
                  <p className="text-xs text-slate-600">{post.description}</p>
                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                    <span>Reunited with rightful owner</span>
                    <Coins className="w-4 h-4 text-amber-500" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Approve / Reject Claim Modal */}
      {selectedClaimForReview && reviewAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 font-serif-title">
              {reviewAction === 'approve'
                ? 'Approve Claim & Coordinate Safe Handover'
                : 'Decline Ownership Claim'}
            </h3>

            {reviewAction === 'approve' ? (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Select Safe College Handover Spot:
                  </label>
                  <select
                    value={handoverSpot}
                    onChange={(e) => setHandoverSpot(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs bg-white"
                  >
                    {CAMPUS_LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Meeting Date & Time:
                  </label>
                  <input
                    type="text"
                    value={handoverTime}
                    onChange={(e) => setHandoverTime(e.target.value)}
                    placeholder="e.g. Today at 4:30 PM outside SAC"
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Note to Claimant (Optional):
                  </label>
                  <textarea
                    rows={2}
                    value={feedbackNote}
                    onChange={(e) => setFeedbackNote(e.target.value)}
                    placeholder="e.g. Please bring college ID card for final verification."
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <label className="block font-bold text-slate-700 mb-1">
                  Reason for Declining:
                </label>
                <textarea
                  rows={3}
                  required
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                  placeholder="Explain which details did not match the item..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
              <button
                onClick={() => {
                  setSelectedClaimForReview(null);
                  setReviewAction(null);
                }}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (reviewAction === 'approve') {
                    handleApproveClaim(selectedClaimForReview);
                  } else {
                    handleRejectClaim(selectedClaimForReview);
                  }
                }}
                className={`px-4 py-1.5 text-xs font-bold text-white rounded-lg ${
                  reviewAction === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {reviewAction === 'approve' ? 'Schedule Handover' : 'Decline Claim'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
