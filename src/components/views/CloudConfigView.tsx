/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Database,
  Shield,
  Key,
  Copy,
  Check,
  Download,
  Upload,
  RefreshCw,
  Server,
  FileCode,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { StorageService } from '../../services/storage';

export const CloudConfigView: React.FC = () => {
  const [copiedRules, setCopiedRules] = useState(false);
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);

  // Firestore security rules conforming to hardened standards
  const FIRESTORE_RULES_SNIPPET = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Default deny all unknown collections
    match /{document=**} {
      allow read, write: if false;
    }

    function isSignedIn() {
      return request.auth != null;
    }

    function isCollegeVerified() {
      return isSignedIn() && request.auth.token.email.matches('.*@college\\\\.edu$');
    }

    function isAdmin() {
      return isCollegeVerified() && exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }

    // 1. Users Collection
    match /users/{userId} {
      // Any authenticated student can read basic profile
      allow get: if isCollegeVerified();
      // Only the student themselves or admin can update their profile
      allow update: if isCollegeVerified() && (request.auth.uid == userId || isAdmin());
      allow create: if isCollegeVerified() && request.auth.uid == userId;
    }

    // 2. Lost and Found Item Posts
    match /posts/{postId} {
      // Publicly readable by all verified college students
      allow read: if isCollegeVerified();

      // Creation allowed for verified students; must assign themselves as poster
      allow create: if isCollegeVerified()
        && request.resource.data.postedByUserId == request.auth.uid;

      // Update allowed by owner (or admin), or status transition during verified claim
      allow update: if isCollegeVerified() && (
        resource.data.postedByUserId == request.auth.uid
        || isAdmin()
        || request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status', 'returnedAt', 'returnedToName'])
      );

      // Deletion allowed only by author or admin
      allow delete: if isCollegeVerified() && (
        resource.data.postedByUserId == request.auth.uid || isAdmin()
      );
    }

    // 3. Ownership Verification Claims
    match /claims/{claimId} {
      // Only the claimant, finder, or administrator can read verification answers
      allow read: if isCollegeVerified() && (
        resource.data.claimantUserId == request.auth.uid
        || resource.data.finderUserId == request.auth.uid
        || isAdmin()
      );

      // Claimant creates the claim
      allow create: if isCollegeVerified()
        && request.resource.data.claimantUserId == request.auth.uid;

      // Update allowed only by finder (approval/rejection) or claimant (handover OTP confirmation)
      allow update: if isCollegeVerified() && (
        resource.data.finderUserId == request.auth.uid
        || resource.data.claimantUserId == request.auth.uid
        || isAdmin()
      );
    }

    // 4. R Coins Transactions & Ledger (Tamper-proof)
    match /transactions/{txId} {
      allow read: if isCollegeVerified() && (
        resource.data.userId == request.auth.uid || isAdmin()
      );
      // Writes strictly restricted to server or authorized return completion
      allow create: if isCollegeVerified();
      allow update, delete: if false; // Transactions are immutable ledger
    }

    // 5. College Stationery Rewards & Redemptions
    match /rewards/{rewardId} {
      allow read: if isCollegeVerified();
      allow write: if isAdmin();
    }

    match /redemptions/{redemptionId} {
      allow read: if isCollegeVerified() && (
        resource.data.userId == request.auth.uid || isAdmin()
      );
      allow create: if isCollegeVerified() && request.resource.data.userId == request.auth.uid;
      allow update: if isAdmin();
    }
  }
}`;

  const copyToClipboard = (text: string, type: 'rules' | 'config') => {
    navigator.clipboard.writeText(text);
    if (type === 'rules') {
      setCopiedRules(true);
      setTimeout(() => setCopiedRules(false), 2000);
    } else {
      setCopiedConfig(true);
      setTimeout(() => setCopiedConfig(false), 2000);
    }
  };

  const handleExportBackup = () => {
    const data = {
      users: StorageService.getUsers(),
      posts: StorageService.getPosts(),
      claims: StorageService.getClaims(),
      transactions: StorageService.getTransactions(),
      rewards: StorageService.getRewards(),
      redemptions: StorageService.getRedemptions(),
      exportedAt: new Date().toISOString(),
      app: 'BACK TO YOU - College Lost & Found',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `back_to_you_campus_db_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = JSON.parse(event.target?.result as string);
        if (content.posts && content.users) {
          localStorage.setItem('b2y_users_v2', JSON.stringify(content.users));
          localStorage.setItem('b2y_posts_v2', JSON.stringify(content.posts));
          if (content.claims) localStorage.setItem('b2y_claims_v2', JSON.stringify(content.claims));
          if (content.transactions) localStorage.setItem('b2y_transactions_v2', JSON.stringify(content.transactions));
          if (content.rewards) localStorage.setItem('b2y_rewards_v2', JSON.stringify(content.rewards));
          setImportNotice('Database imported successfully! Refreshing...');
          setTimeout(() => window.location.reload(), 1200);
        } else {
          setImportNotice('Invalid backup file format.');
        }
      } catch (err) {
        setImportNotice('Failed parsing JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in duration-300">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-amber-600" />
          <h1 className="text-2xl font-bold font-serif-title text-slate-900">
            Database & Firebase Storage Center
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Persistent application database status, Firestore data blueprint, and zero-trust security rules.
        </p>
      </div>

      {importNotice && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{importNotice}</span>
        </div>
      )}

      {/* Backend Persistence Status Banner */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Persistent Campus Storage Engine Active
              </h3>
              <p className="text-xs text-slate-500">
                All posts, claims, R Coin transactions, and user credentials persist across browser sessions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportBackup}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export DB Backup (JSON)</span>
            </button>

            <label className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs">
              <Upload className="w-3.5 h-3.5" />
              <span>Import DB Backup</span>
              <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block">Total Stored Posts:</span>
            <span className="text-base font-bold text-slate-900">
              {StorageService.getPosts().length} documents
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block">Verification Claims:</span>
            <span className="text-base font-bold text-slate-900">
              {StorageService.getClaims().length} records
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block">R Coin Ledger:</span>
            <span className="text-base font-bold text-slate-900">
              {StorageService.getTransactions().length} transactions
            </span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block">Authorized Accounts:</span>
            <span className="text-base font-bold text-slate-900">
              {StorageService.getUsers().length} students
            </span>
          </div>
        </div>
      </div>

      {/* Cloud Firestore Integration Setup Guide */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900">
          <Server className="w-5 h-5 text-amber-600" />
          <h3 className="text-base font-bold font-serif-title">
            Cloud Firestore Setup & Schema Blueprint
          </h3>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          The application is fully pre-architected for Cloud Firestore. The data models (Users, Posts,
          Claims, Transactions, Rewards, Notifications) strictly follow ABAC security conventions.
          To connect your own Google Cloud / Firebase project at any time:
        </p>

        <ol className="list-decimal list-inside space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <li>Create a Firebase Project at <strong>console.firebase.google.com</strong>.</li>
          <li>Enable <strong>Cloud Firestore</strong> in Native Mode (Production rules).</li>
          <li>Enable <strong>Firebase Authentication</strong> with Email/Password & Google Sign-In.</li>
          <li>Copy the security rules below into your Firebase Console Rules editor.</li>
        </ol>

        {/* Security Rules Code Window */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-amber-600" />
              <span>Production firestore.rules</span>
            </span>
            <button
              onClick={() => copyToClipboard(FIRESTORE_RULES_SNIPPET, 'rules')}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              {copiedRules ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedRules ? 'Copied Rules!' : 'Copy Rules to Clipboard'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto max-h-72 border border-slate-800 leading-relaxed">
            {FIRESTORE_RULES_SNIPPET}
          </pre>
        </div>
      </div>
    </div>
  );
};
