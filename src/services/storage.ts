/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  User,
  ItemPost,
  ItemClaim,
  RCoinTransaction,
  StationeryReward,
  RedemptionRequest,
  AppNotification,
  ItemCategory,
} from '../types';

const STORAGE_KEYS = {
  USERS: 'b2y_users_v2',
  CURRENT_USER: 'b2y_current_user_v2',
  POSTS: 'b2y_posts_v2',
  CLAIMS: 'b2y_claims_v2',
  TRANSACTIONS: 'b2y_transactions_v2',
  REWARDS: 'b2y_rewards_v2',
  REDEMPTIONS: 'b2y_redemptions_v2',
  NOTIFICATIONS: 'b2y_notifications_v2',
};

// Default seed users matching the explicit prompt instructions
// Swastik Tare, Prince Gupta, Samar Modak
const DEFAULT_USERS: User[] = [
  {
    id: 'user_swastik',
    name: 'Swastik Tare',
    collegeEmail: 'swastik.tare@college.edu',
    studentId: 'B2Y-2024-001',
    department: 'Computer Science & Engineering',
    role: 'admin', // Swastik as lead administrator & student
    passwordHash: 'College@2026',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    rCoins: 35,
    totalCoinsEarned: 35,
    isActivated: true,
    createdAt: '2026-08-15T10:00:00.000Z',
  },
  {
    id: 'user_prince',
    name: 'Prince Gupta',
    collegeEmail: 'prince.gupta@college.edu',
    studentId: 'B2Y-2024-042',
    department: 'Electronics & Communication',
    role: 'student',
    passwordHash: 'Prince@123',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    rCoins: 15,
    totalCoinsEarned: 15,
    isActivated: true,
    createdAt: '2026-08-18T11:30:00.000Z',
  },
  {
    id: 'user_samar',
    name: 'Samar Modak',
    collegeEmail: 'samar.modak@college.edu',
    studentId: 'B2Y-2024-089',
    department: 'Mechanical Engineering',
    role: 'student',
    passwordHash: 'Samar@123',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
    rCoins: 10,
    totalCoinsEarned: 10,
    isActivated: true,
    createdAt: '2026-08-20T09:15:00.000Z',
  },
];

// Pre-seeded College Stationery Catalogue
const DEFAULT_REWARDS: StationeryReward[] = [
  {
    id: 'rew_1',
    title: 'Executive College Hardbound Journal',
    rCoinsRequired: 100,
    description: 'A5 192-page ruled journal with 100 GSM ivory paper, embossed college crest, and ribbon bookmark.',
    stock: 28,
    category: 'Notebooks',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'rew_2',
    title: 'Parker Stainless Steel Pen Set',
    rCoinsRequired: 150,
    description: 'Classic brushed stainless steel rollerball pen with chrome trim and refill cartridge.',
    stock: 14,
    category: 'Writing',
    imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'rew_3',
    title: 'Casio fx-991EX ClassWiz Calculator',
    rCoinsRequired: 300,
    description: 'High-resolution scientific calculator featuring 552 functions, dual power, and matrix calculation.',
    stock: 6,
    category: 'Tools',
    imageUrl: 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e485?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'rew_4',
    title: 'Engineering Technical Drafting Kit',
    rCoinsRequired: 200,
    description: 'Precision compass, set-squares, roller scale, French curves, and 0.5mm clutch pencil with lead.',
    stock: 12,
    category: 'Tools',
    imageUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'rew_5',
    title: 'Zebra Mildliner Pastel 5-Color Bundle',
    rCoinsRequired: 100,
    description: 'Double-ended soft pastel highlighters with chisel and bullet tips for clean lecture notes.',
    stock: 35,
    category: 'Writing',
    imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'rew_6',
    title: 'Insulated Campus Stainless Steel Flask (750ml)',
    rCoinsRequired: 250,
    description: 'Double-wall vacuum insulation keeps drinks hot for 12h or cold for 24h. Leak-proof sport cap.',
    stock: 9,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=500&q=80',
  },
];

// Pre-seeded realistic Lost and Found posts
const DEFAULT_POSTS: ItemPost[] = [
  {
    id: 'post_1',
    type: 'lost',
    itemName: 'HP Envy 65W Laptop Charger',
    category: 'Electronics',
    description: 'Left plugged into wall socket on 1st Floor quiet study cubicle near Window 4. Has a small piece of blue electrical tape near the barrel connector.',
    location: 'Central Library (1st Floor)',
    date: '2026-11-09',
    approximateTime: '04:30 PM',
    additionalDetails: 'Serial number ends with 4981. Blue electrical tape around the adapter neck.',
    contactInfo: 'swastik.tare@college.edu',
    isContactPrivate: true,
    postedByUserId: 'user_swastik',
    postedByName: 'Swastik Tare',
    postedByEmail: 'swastik.tare@college.edu',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=500&q=80',
    createdAt: '2026-11-09T17:10:00.000Z',
  },
  {
    id: 'post_2',
    type: 'found',
    itemName: 'Black Titan Neo Quartz Watch',
    category: 'Watches',
    description: 'Found on the bench beside the goalpost at the football ground after evening practice. Black leather strap with steel buckle.',
    location: 'College Football & Cricket Ground',
    date: '2026-11-10',
    approximateTime: '06:15 PM',
    additionalDetails: 'Engraving on back case: "Class of 24 - With Love Mom". Minor scratch at 7 oclock position.',
    contactInfo: 'prince.gupta@college.edu',
    isContactPrivate: true,
    postedByUserId: 'user_prince',
    postedByName: 'Prince Gupta',
    postedByEmail: 'prince.gupta@college.edu',
    status: 'active',
    imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=500&q=80',
    createdAt: '2026-11-10T18:40:00.000Z',
  },
  {
    id: 'post_3',
    type: 'found',
    itemName: 'Navy Blue Wildcraft Backpack',
    category: 'Bags and Backpacks',
    description: 'Found under the corner dining table in the cafeteria. Contains several spiral notebooks and a pencil case.',
    location: 'Main Cafeteria & Food Court',
    date: '2026-11-08',
    approximateTime: '01:45 PM',
    additionalDetails: 'Inside has a Physics textbook with student name Samar Modak written on page 3, and a silver keychain.',
    contactInfo: 'swastik.tare@college.edu',
    isContactPrivate: true,
    postedByUserId: 'user_swastik',
    postedByName: 'Swastik Tare',
    postedByEmail: 'swastik.tare@college.edu',
    status: 'claim_pending',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80',
    createdAt: '2026-11-08T14:00:00.000Z',
  },
  {
    id: 'post_4',
    type: 'lost',
    itemName: 'Wildcraft Campus Backpack (Navy)',
    category: 'Bags and Backpacks',
    description: 'Left my backpack near table 12 while grabbing lunch. Has all my class notes for upcoming semester exams.',
    location: 'Main Cafeteria & Food Court',
    date: '2026-11-08',
    approximateTime: '01:30 PM',
    additionalDetails: 'Has a physics book with my name, a mini compass, and a Batman metal badge on the front zipper.',
    contactInfo: 'samar.modak@college.edu',
    isContactPrivate: true,
    postedByUserId: 'user_samar',
    postedByName: 'Samar Modak',
    postedByEmail: 'samar.modak@college.edu',
    status: 'claim_pending',
    imageUrl: 'https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=500&q=80',
    createdAt: '2026-11-08T15:20:00.000Z',
    matchedPostId: 'post_3',
  },
  {
    id: 'post_5',
    type: 'found',
    itemName: 'College Student Identity Card',
    category: 'Identity Cards',
    description: 'Found on the staircase between 2nd and 3rd floor in Engineering Block B. In a transparent lanyarded cardholder.',
    location: 'Engineering Block B - Computer Labs',
    date: '2026-11-07',
    approximateTime: '11:15 AM',
    additionalDetails: 'ID number starts with 2024-EC-08X. Has a small green holographic sticker on the top right.',
    contactInfo: 'samar.modak@college.edu',
    isContactPrivate: true,
    postedByUserId: 'user_samar',
    postedByName: 'Samar Modak',
    postedByEmail: 'samar.modak@college.edu',
    status: 'returned',
    imageUrl: 'https://images.unsplash.com/photo-1589330694653-dad6ef0140be?auto=format&fit=crop&w=500&q=80',
    createdAt: '2026-11-07T11:45:00.000Z',
    returnedAt: '2026-11-07T16:30:00.000Z',
    returnedToName: 'Rohan Sharma',
  },
];

// Pre-seeded claim for the navy backpack
const DEFAULT_CLAIMS: ItemClaim[] = [
  {
    id: 'claim_1',
    postId: 'post_3',
    postTitle: 'Navy Blue Wildcraft Backpack',
    postType: 'found',
    claimantUserId: 'user_samar',
    claimantName: 'Samar Modak',
    claimantEmail: 'samar.modak@college.edu',
    finderUserId: 'user_swastik',
    finderName: 'Swastik Tare',
    finderEmail: 'swastik.tare@college.edu',
    answers: {
      identificationProof: 'Inside front zipper pocket is a Batman enamel pin and a silver keychain. My handwritten name is on the Physics book inside.',
      lostDateLocation: 'Main Cafeteria & Food Court around 1:30 PM on Nov 8th, table near the east exit.',
      additionalVerification: 'There is also a 16GB SanDisk metal flash drive in the inner mesh pocket with project files labeled "CAD_Modak".',
    },
    status: 'approved',
    finderFeedback: 'Details match the backpack contents accurately! Let us coordinate safe handover at SAC or Library.',
    handoverDetails: {
      location: 'Student Activity Center (SAC) - Ground Floor Lobby',
      scheduledTime: '2026-11-12 at 03:00 PM',
      notes: 'Meet near the reception desk. I will bring the bag.',
      claimantConfirmed: false,
      finderConfirmed: false,
      handoverOtp: '8492',
    },
    createdAt: '2026-11-08T16:00:00.000Z',
    updatedAt: '2026-11-08T18:00:00.000Z',
  },
];

const DEFAULT_TRANSACTIONS: RCoinTransaction[] = [
  {
    id: 'tx_1',
    userId: 'user_swastik',
    userName: 'Swastik Tare',
    amount: 5,
    type: 'earn_return',
    description: 'Reward for successfully returning Casio fx-991CW to owner',
    referenceCode: 'RET-2026-091',
    createdAt: '2026-10-24T14:20:00.000Z',
  },
  {
    id: 'tx_2',
    userId: 'user_swastik',
    userName: 'Swastik Tare',
    amount: 5,
    type: 'earn_return',
    description: 'Reward for returning Lab Coat & Safety Goggles',
    referenceCode: 'RET-2026-104',
    createdAt: '2026-10-31T11:00:00.000Z',
  },
  {
    id: 'tx_3',
    userId: 'user_samar',
    userName: 'Samar Modak',
    amount: 5,
    type: 'earn_return',
    description: 'Reward for returning College ID Card to Rohan Sharma',
    referenceCode: 'RET-2026-112',
    createdAt: '2026-11-07T16:30:00.000Z',
  },
  {
    id: 'tx_4',
    userId: 'user_prince',
    userName: 'Prince Gupta',
    amount: 5,
    type: 'earn_return',
    description: 'Reward for returning Scientific Calculator in Lab B',
    referenceCode: 'RET-2026-115',
    createdAt: '2026-11-05T12:00:00.000Z',
  },
];

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    userId: 'user_samar',
    title: 'Claim Approved for Safe Handover',
    message: 'Swastik Tare verified your answers for "Navy Blue Wildcraft Backpack". Please check handover details.',
    type: 'claim_approved',
    isRead: false,
    createdAt: '2026-11-08T18:00:00.000Z',
    relatedPostId: 'post_3',
    relatedClaimId: 'claim_1',
  },
  {
    id: 'notif_2',
    userId: 'user_swastik',
    title: 'New Ownership Claim Submitted',
    message: 'Samar Modak submitted a claim for "Navy Blue Wildcraft Backpack" found by you.',
    type: 'claim',
    isRead: true,
    createdAt: '2026-11-08T16:00:00.000Z',
    relatedPostId: 'post_3',
    relatedClaimId: 'claim_1',
  },
  {
    id: 'notif_3',
    userId: 'user_prince',
    title: 'Potential Match Found on Campus',
    message: 'A post matching your found watch was reported recently in Sports Complex.',
    type: 'match',
    isRead: true,
    createdAt: '2026-11-10T19:00:00.000Z',
    relatedPostId: 'post_2',
  },
];

export class StorageService {
  private static load<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return fallback;
      return JSON.parse(item) as T;
    } catch (e) {
      console.warn(`Failed reading ${key} from localStorage`, e);
      return fallback;
    }
  }

  private static save<T>(key: string, data: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      window.dispatchEvent(new Event('b2y_storage_change'));
    } catch (e) {
      console.error(`Failed writing ${key} to localStorage`, e);
    }
  }

  // Initializer
  public static init(): void {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.save(STORAGE_KEYS.USERS, DEFAULT_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
      this.save(STORAGE_KEYS.POSTS, DEFAULT_POSTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CLAIMS)) {
      this.save(STORAGE_KEYS.CLAIMS, DEFAULT_CLAIMS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
      this.save(STORAGE_KEYS.TRANSACTIONS, DEFAULT_TRANSACTIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.REWARDS)) {
      this.save(STORAGE_KEYS.REWARDS, DEFAULT_REWARDS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      this.save(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
    }
  }

  // Authentication & Users
  public static getUsers(): User[] {
    return this.load<User[]>(STORAGE_KEYS.USERS, DEFAULT_USERS);
  }

  public static saveUser(user: User): void {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    this.save(STORAGE_KEYS.USERS, users);

    // Update current user if matches
    const current = this.getCurrentUser();
    if (current && current.id === user.id) {
      this.save(STORAGE_KEYS.CURRENT_USER, user);
    }
  }

  public static getCurrentUser(): User | null {
    return this.load<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  }

  public static setCurrentUser(user: User | null): void {
    this.save(STORAGE_KEYS.CURRENT_USER, user);
  }

  public static getUserByEmail(email: string): User | undefined {
    const normalized = email.trim().toLowerCase();
    return this.getUsers().find((u) => u.collegeEmail.toLowerCase() === normalized);
  }

  public static registerAuthorizedUser(user: Omit<User, 'id' | 'createdAt' | 'rCoins' | 'totalCoinsEarned'>): User {
    const newUser: User = {
      ...user,
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      rCoins: 0,
      totalCoinsEarned: 0,
      createdAt: new Date().toISOString(),
    };
    this.saveUser(newUser);
    return newUser;
  }

  public static updateStudentCredentials(
    userId: string,
    collegeEmail: string,
    newPassword?: string,
    studentId?: string,
    department?: string
  ): boolean {
    const users = this.getUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return false;

    user.collegeEmail = collegeEmail.trim().toLowerCase();
    if (newPassword) {
      user.passwordHash = newPassword;
    }
    if (studentId) user.studentId = studentId;
    if (department) user.department = department;
    user.isActivated = true;

    this.save(STORAGE_KEYS.USERS, users);
    const current = this.getCurrentUser();
    if (current && current.id === userId) {
      this.setCurrentUser(user);
    }
    return true;
  }

  // Posts
  public static getPosts(): ItemPost[] {
    return this.load<ItemPost[]>(STORAGE_KEYS.POSTS, DEFAULT_POSTS);
  }

  public static getPostById(id: string): ItemPost | undefined {
    return this.getPosts().find((p) => p.id === id);
  }

  public static savePost(post: ItemPost): void {
    const posts = this.getPosts();
    const index = posts.findIndex((p) => p.id === post.id);
    if (index >= 0) {
      posts[index] = post;
    } else {
      posts.unshift(post);
    }
    this.save(STORAGE_KEYS.POSTS, posts);

    // Run auto-matching for potential matches
    this.checkSmartMatches(post);
  }

  public static deletePost(id: string): void {
    const posts = this.getPosts().filter((p) => p.id !== id);
    this.save(STORAGE_KEYS.POSTS, posts);
  }

  // Smart Matching Engine
  public static checkSmartMatches(newPost: ItemPost): void {
    const allPosts = this.getPosts();
    const oppositeType = newPost.type === 'lost' ? 'found' : 'lost';
    const potentialMatches = allPosts.filter(
      (p) =>
        p.id !== newPost.id &&
        p.type === oppositeType &&
        p.status === 'active' &&
        (p.category === newPost.category ||
          p.itemName.toLowerCase().includes(newPost.itemName.toLowerCase()) ||
          newPost.itemName.toLowerCase().includes(p.itemName.toLowerCase()))
    );

    for (const match of potentialMatches) {
      // Create notification for opposite post creator
      this.addNotification({
        userId: match.postedByUserId,
        title: `Smart Match Detected for "${match.itemName}"`,
        message: `${newPost.postedByName} posted a ${newPost.type} item: "${newPost.itemName}" at ${newPost.location}. Check if it belongs to you!`,
        type: 'match',
        relatedPostId: newPost.id,
      });

      // Create notification for new poster
      this.addNotification({
        userId: newPost.postedByUserId,
        title: `Possible Match Found for "${newPost.itemName}"`,
        message: `We found an existing ${match.type} item "${match.itemName}" posted by ${match.postedByName}.`,
        type: 'match',
        relatedPostId: match.id,
      });
    }
  }

  // Claims
  public static getClaims(): ItemClaim[] {
    return this.load<ItemClaim[]>(STORAGE_KEYS.CLAIMS, DEFAULT_CLAIMS);
  }

  public static getClaimById(id: string): ItemClaim | undefined {
    return this.getClaims().find((c) => c.id === id);
  }

  public static saveClaim(claim: ItemClaim): void {
    const claims = this.getClaims();
    const index = claims.findIndex((c) => c.id === claim.id);
    if (index >= 0) {
      claims[index] = claim;
    } else {
      claims.unshift(claim);
    }
    this.save(STORAGE_KEYS.CLAIMS, claims);
  }

  public static createClaim(
    post: ItemPost,
    claimant: User,
    answers: {
      identificationProof: string;
      lostDateLocation: string;
      additionalVerification: string;
    }
  ): ItemClaim {
    const newClaim: ItemClaim = {
      id: `claim_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      postId: post.id,
      postTitle: post.itemName,
      postType: post.type,
      claimantUserId: claimant.id,
      claimantName: claimant.name,
      claimantEmail: claimant.collegeEmail,
      finderUserId: post.postedByUserId,
      finderName: post.postedByName,
      finderEmail: post.postedByEmail,
      answers,
      status: 'submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.saveClaim(newClaim);

    // Update post status to claim_pending
    post.status = 'claim_pending';
    this.savePost(post);

    // Notify the finder/poster
    this.addNotification({
      userId: post.postedByUserId,
      title: 'New Ownership Claim Submitted',
      message: `${claimant.name} submitted a claim with verification proof for "${post.itemName}".`,
      type: 'claim',
      relatedPostId: post.id,
      relatedClaimId: newClaim.id,
    });

    return newClaim;
  }

  // Two-party Handover Confirmation & R Coins Award
  public static confirmHandoverStep(
    claimId: string,
    party: 'claimant' | 'finder',
    otpEntered?: string
  ): { success: boolean; completed: boolean; message: string } {
    const claim = this.getClaimById(claimId);
    if (!claim || !claim.handoverDetails) {
      return { success: false, completed: false, message: 'Handover details not found.' };
    }

    if (party === 'claimant') {
      if (otpEntered && otpEntered.trim() !== claim.handoverDetails.handoverOtp) {
        return { success: false, completed: false, message: 'Invalid 4-digit Handover Code.' };
      }
      claim.handoverDetails.claimantConfirmed = true;
    } else {
      claim.handoverDetails.finderConfirmed = true;
    }

    claim.updatedAt = new Date().toISOString();

    const bothConfirmed =
      claim.handoverDetails.claimantConfirmed && claim.handoverDetails.finderConfirmed;

    if (bothConfirmed) {
      claim.status = 'approved';

      // 1. Update post to returned
      const post = this.getPostById(claim.postId);
      if (post) {
        post.status = 'returned';
        post.returnedAt = new Date().toISOString();
        post.returnedToName = claim.claimantName;
        post.returnedToUserId = claim.claimantUserId;
        this.savePost(post);
      }

      // 2. Award 5 R Coins to the Finder
      const finder = this.getUsers().find((u) => u.id === claim.finderUserId);
      if (finder) {
        finder.rCoins += 5;
        finder.totalCoinsEarned += 5;
        this.saveUser(finder);

        // Record Transaction
        this.addTransaction({
          userId: finder.id,
          userName: finder.name,
          amount: 5,
          type: 'earn_return',
          description: `Reward for successfully returning "${claim.postTitle}" to ${claim.claimantName}`,
          relatedItemId: claim.postId,
          relatedItemName: claim.postTitle,
          referenceCode: `RET-${Date.now().toString().slice(-6)}`,
        });

        // Notify finder
        this.addNotification({
          userId: finder.id,
          title: '🎉 +5 R Coins Credited!',
          message: `Both parties confirmed handover of "${claim.postTitle}". You earned 5 R Coins!`,
          type: 'coins_earned',
          relatedPostId: claim.postId,
          relatedClaimId: claim.id,
        });
      }

      // Notify claimant
      this.addNotification({
        userId: claim.claimantUserId,
        title: 'Item Successfully Returned!',
        message: `Your item "${claim.postTitle}" has been safely returned. Thank you for using Back to You!`,
        type: 'handover',
        relatedPostId: claim.postId,
        relatedClaimId: claim.id,
      });

      this.saveClaim(claim);
      return { success: true, completed: true, message: 'Handover complete! 5 R Coins credited.' };
    } else {
      this.saveClaim(claim);
      return {
        success: true,
        completed: false,
        message: 'Your confirmation recorded. Awaiting the other student’s confirmation.',
      };
    }
  }

  // R Coins & Rewards
  public static getTransactions(): RCoinTransaction[] {
    return this.load<RCoinTransaction[]>(STORAGE_KEYS.TRANSACTIONS, DEFAULT_TRANSACTIONS);
  }

  public static addTransaction(tx: Omit<RCoinTransaction, 'id' | 'createdAt'>): RCoinTransaction {
    const transactions = this.getTransactions();
    const newTx: RCoinTransaction = {
      ...tx,
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    transactions.unshift(newTx);
    this.save(STORAGE_KEYS.TRANSACTIONS, transactions);
    return newTx;
  }

  public static getRewards(): StationeryReward[] {
    return this.load<StationeryReward[]>(STORAGE_KEYS.REWARDS, DEFAULT_REWARDS);
  }

  public static saveReward(reward: StationeryReward): void {
    const rewards = this.getRewards();
    const index = rewards.findIndex((r) => r.id === reward.id);
    if (index >= 0) {
      rewards[index] = reward;
    } else {
      rewards.push(reward);
    }
    this.save(STORAGE_KEYS.REWARDS, rewards);
  }

  public static getRedemptions(): RedemptionRequest[] {
    return this.load<RedemptionRequest[]>(STORAGE_KEYS.REDEMPTIONS, []);
  }

  public static saveRedemptions(list: RedemptionRequest[]): void {
    this.save(STORAGE_KEYS.REDEMPTIONS, list);
  }

  public static requestRedemption(user: User, reward: StationeryReward): { success: boolean; message: string } {
    if (user.rCoins < reward.rCoinsRequired) {
      return { success: false, message: `Insufficient R Coins. You have ${user.rCoins}, but need ${reward.rCoinsRequired}.` };
    }
    if (reward.stock <= 0) {
      return { success: false, message: 'Item is currently out of stock.' };
    }

    // Deduct coins immediately
    user.rCoins -= reward.rCoinsRequired;
    this.saveUser(user);

    // Update stock
    reward.stock -= 1;
    this.saveReward(reward);

    const code = `B2Y-STAT-${Math.floor(1000 + Math.random() * 9000)}`;
    const redemptions = this.getRedemptions();
    const req: RedemptionRequest = {
      id: `red_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.collegeEmail,
      rewardId: reward.id,
      rewardTitle: reward.title,
      rCoinsDeducted: reward.rCoinsRequired,
      redemptionCode: code,
      status: 'pending_approval',
      createdAt: new Date().toISOString(),
    };
    redemptions.unshift(req);
    this.saveRedemptions(redemptions);

    // Record Transaction
    this.addTransaction({
      userId: user.id,
      userName: user.name,
      amount: -reward.rCoinsRequired,
      type: 'redeem_reward',
      description: `Redeemed: ${reward.title} (Voucher: ${code})`,
      referenceCode: code,
    });

    // Notify user
    this.addNotification({
      userId: user.id,
      title: 'Stationery Redemption Submitted',
      message: `Your redemption request for "${reward.title}" (Code: ${code}) has been submitted for admin approval.`,
      type: 'redemption',
    });

    return { success: true, message: `Redemption requested! Voucher code: ${code}. Present at college stationery store once approved.` };
  }

  public static approveRedemption(redemptionId: string, adminNotes?: string): boolean {
    const list = this.getRedemptions();
    const item = list.find((r) => r.id === redemptionId);
    if (!item) return false;

    item.status = 'approved_ready_for_pickup';
    item.approvedAt = new Date().toISOString();
    if (adminNotes) item.adminNotes = adminNotes;
    this.saveRedemptions(list);

    this.addNotification({
      userId: item.userId,
      title: 'Stationery Redemption Approved!',
      message: `Your voucher ${item.redemptionCode} for "${item.rewardTitle}" is ready for pickup at the College Stationery Store.`,
      type: 'redemption',
    });

    return true;
  }

  // Notifications
  public static getNotifications(userId: string): AppNotification[] {
    const all = this.load<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
    return all.filter((n) => n.userId === userId);
  }

  public static addNotification(notif: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>): AppNotification {
    const all = this.load<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
    const newNotif: AppNotification = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    all.unshift(newNotif);
    this.save(STORAGE_KEYS.NOTIFICATIONS, all);
    return newNotif;
  }

  public static markNotificationRead(id: string): void {
    const all = this.load<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
    const item = all.find((n) => n.id === id);
    if (item) {
      item.isRead = true;
      this.save(STORAGE_KEYS.NOTIFICATIONS, all);
    }
  }

  public static markAllNotificationsRead(userId: string): void {
    const all = this.load<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
    all.forEach((n) => {
      if (n.userId === userId) n.isRead = true;
    });
    this.save(STORAGE_KEYS.NOTIFICATIONS, all);
  }

  // System Stats
  public static getStats() {
    const posts = this.getPosts();
    const transactions = this.getTransactions();
    const users = this.getUsers();

    const totalLost = posts.filter((p) => p.type === 'lost').length;
    const totalFound = posts.filter((p) => p.type === 'found').length;
    const totalReturned = posts.filter((p) => p.status === 'returned').length;
    const totalCoinsCirculating = users.reduce((acc, u) => acc + (u.rCoins || 0), 0);
    const totalCoinsEarnedAllTime = transactions
      .filter((t) => t.amount > 0)
      .reduce((acc, t) => acc + t.amount, 0);

    return {
      totalLost,
      totalFound,
      totalReturned,
      totalCoinsCirculating,
      totalCoinsEarnedAllTime,
      totalUsers: users.length,
      returnRatePercent: totalLost + totalFound > 0 ? Math.round((totalReturned / (totalLost + totalFound)) * 100) : 0,
    };
  }

  // Reset to default seed data if needed
  public static resetDemoData(): void {
    this.save(STORAGE_KEYS.USERS, DEFAULT_USERS);
    this.save(STORAGE_KEYS.POSTS, DEFAULT_POSTS);
    this.save(STORAGE_KEYS.CLAIMS, DEFAULT_CLAIMS);
    this.save(STORAGE_KEYS.TRANSACTIONS, DEFAULT_TRANSACTIONS);
    this.save(STORAGE_KEYS.REWARDS, DEFAULT_REWARDS);
    this.save(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
    this.save(STORAGE_KEYS.REDEMPTIONS, []);
  }
}
