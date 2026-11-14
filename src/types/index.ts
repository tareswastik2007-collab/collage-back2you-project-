/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ItemType = 'lost' | 'found';

export type ItemCategory =
  | 'Electronics'
  | 'Mobile Phones'
  | 'Phone Covers'
  | 'Keys and Keychains'
  | 'Bags and Backpacks'
  | 'Water Bottles'
  | 'Books and Notebooks'
  | 'Identity Cards'
  | 'Wallets'
  | 'Jewelry and Accessories'
  | 'Watches'
  | 'Stationery'
  | 'Clothing'
  | 'Other Items';

export const ITEM_CATEGORIES: ItemCategory[] = [
  'Electronics',
  'Mobile Phones',
  'Phone Covers',
  'Keys and Keychains',
  'Bags and Backpacks',
  'Water Bottles',
  'Books and Notebooks',
  'Identity Cards',
  'Wallets',
  'Jewelry and Accessories',
  'Watches',
  'Stationery',
  'Clothing',
  'Other Items',
];

export const CAMPUS_LOCATIONS = [
  'Central Library (1st Floor)',
  'Central Library (Reading Hall)',
  'Main Cafeteria & Food Court',
  'Student Activity Center (SAC)',
  'Engineering Block A - Ground Floor',
  'Engineering Block B - Computer Labs',
  'Science Block & Chemistry Wing',
  'Main Auditorium & Foyer',
  'Sports Complex & Gym',
  'College Football & Cricket Ground',
  'Boys Hostel Block 1 & 2',
  'Girls Hostel Common Lounge',
  'Administration Block & Dean Office',
  'Campus Parking Zone 1',
  'College Main Gate & Bus Stop',
];

export type PostStatus = 'active' | 'claim_pending' | 'handover_scheduled' | 'returned';

export interface User {
  id: string;
  name: string;
  collegeEmail: string;
  studentId: string;
  department: string;
  role: 'student' | 'admin';
  passwordHash: string; // Plain/hashed for local collegiate verification
  avatarUrl?: string;
  rCoins: number;
  totalCoinsEarned: number;
  isActivated: boolean; // Flag to indicate if real email/password has been set up
  createdAt: string;
}

export interface ItemPost {
  id: string;
  type: ItemType;
  itemName: string;
  category: ItemCategory;
  description: string;
  imageUrl?: string;
  location: string;
  date: string; // YYYY-MM-DD
  approximateTime: string;
  additionalDetails?: string; // Private verification details (not visible to public)
  contactInfo: string;
  isContactPrivate: boolean;
  postedByUserId: string;
  postedByName: string;
  postedByEmail: string;
  status: PostStatus;
  createdAt: string;
  returnedAt?: string;
  returnedToName?: string;
  returnedToUserId?: string;
  matchedPostId?: string;
}

export interface ClaimVerificationAnswers {
  identificationProof: string; // Unique markings, serial numbers, wallpapers, contents
  lostDateLocation: string; // Exact circumstances, spot, and time last seen
  additionalVerification: string; // Any receipt, photo, passcode test, or distinguishing feature
}

export interface HandoverDetails {
  location: string;
  scheduledTime: string;
  notes?: string;
  claimantConfirmed: boolean;
  finderConfirmed: boolean;
  handoverOtp: string; // 4-digit code for physical confirmation
}

export type ClaimStatus =
  | 'submitted'
  | 'under_review'
  | 'proof_requested'
  | 'approved'
  | 'rejected'
  | 'disputed';

export interface ItemClaim {
  id: string;
  postId: string;
  postTitle: string;
  postType: ItemType;
  claimantUserId: string;
  claimantName: string;
  claimantEmail: string;
  finderUserId: string;
  finderName: string;
  finderEmail: string;
  answers: ClaimVerificationAnswers;
  status: ClaimStatus;
  finderFeedback?: string;
  handoverDetails?: HandoverDetails;
  createdAt: string;
  updatedAt: string;
  disputeReason?: string;
}

export interface RCoinTransaction {
  id: string;
  userId: string;
  userName: string;
  amount: number; // +5 for return, -100 for stationery redemption
  type: 'earn_return' | 'redeem_reward' | 'admin_adjustment';
  description: string;
  relatedItemId?: string;
  relatedItemName?: string;
  referenceCode: string;
  createdAt: string;
}

export interface StationeryReward {
  id: string;
  title: string;
  rCoinsRequired: number;
  description: string;
  stock: number;
  imageUrl: string;
  category: 'Notebooks' | 'Writing' | 'Tools' | 'Accessories';
}

export type RedemptionStatus =
  | 'pending_approval'
  | 'approved_ready_for_pickup'
  | 'collected'
  | 'rejected';

export interface RedemptionRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  rewardId: string;
  rewardTitle: string;
  rCoinsDeducted: number;
  redemptionCode: string; // e.g. "B2Y-STAT-8924"
  status: RedemptionStatus;
  createdAt: string;
  approvedAt?: string;
  adminNotes?: string;
}

export type NotificationType =
  | 'match'
  | 'claim'
  | 'claim_approved'
  | 'claim_rejected'
  | 'proof_requested'
  | 'handover'
  | 'coins_earned'
  | 'redemption'
  | 'system';

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  relatedPostId?: string;
  relatedClaimId?: string;
}
