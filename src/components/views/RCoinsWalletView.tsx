/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Coins,
  Gift,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  ShoppingBag,
  Ticket,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User, RCoinTransaction, StationeryReward, RedemptionRequest } from '../../types';
import { StorageService } from '../../services/storage';

interface RCoinsWalletViewProps {
  currentUser: User;
  transactions: RCoinTransaction[];
  rewards: StationeryReward[];
  redemptions: RedemptionRequest[];
  onRefresh: () => void;
}

export const RCoinsWalletView: React.FC<RCoinsWalletViewProps> = ({
  currentUser,
  transactions,
  rewards,
  redemptions,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'store' | 'history' | 'my-vouchers'>('store');
  const [selectedReward, setSelectedReward] = useState<StationeryReward | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  const userTransactions = transactions.filter((t) => t.userId === currentUser.id);
  const userRedemptions = redemptions.filter((r) => r.userId === currentUser.id);

  const handleRedeem = (reward: StationeryReward) => {
    const res = StorageService.requestRedemption(currentUser, reward);
    if (res.success) {
      setStatusMsg({ type: 'success', text: res.message });
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      setSelectedReward(null);
      onRefresh();
    } else {
      setStatusMsg({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Wallet Balance Hero Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B192C] via-[#10243E] to-[#1E3E62] text-white p-6 sm:p-8 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>Campus Good Samaritan Currency</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold font-serif-title tracking-tight text-white flex items-baseline gap-2">
              <span>{currentUser.rCoins}</span>
              <span className="text-base sm:text-lg font-sans text-amber-400 font-medium">
                R Coins Available
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Earn <strong>+5 R Coins</strong> each time you return a lost campus item. Accumulate
              100+ R Coins to redeem official college stationery at the campus store!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/80 space-y-2 shrink-0 md:w-64">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Coins Earned:</span>
              <span className="font-bold text-amber-400">+{currentUser.totalCoinsEarned}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Items Returned:</span>
              <span className="font-bold text-white">
                {Math.floor(currentUser.totalCoinsEarned / 5)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Next Stationery Goal:</span>
              <span className="font-bold text-emerald-400">
                {currentUser.rCoins >= 100
                  ? 'Eligible!'
                  : `${100 - (currentUser.rCoins % 100)} coins needed`}
              </span>
            </div>

            {/* Progress bar to 100 coins */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (currentUser.rCoins % 100) || (currentUser.rCoins >= 100 ? 100 : 0))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Alert Status */}
      {statusMsg && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
          <button
            onClick={() => setStatusMsg(null)}
            className="text-xs font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl">
        <button
          onClick={() => setActiveTab('store')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'store'
              ? 'bg-white text-slate-900 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
          <span>College Stationery Store</span>
        </button>
        <button
          onClick={() => setActiveTab('my-vouchers')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'my-vouchers'
              ? 'bg-white text-slate-900 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Ticket className="w-3.5 h-3.5 text-emerald-600" />
          <span>My Redemption Vouchers ({userRedemptions.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'history'
              ? 'bg-white text-slate-900 shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>Transaction History</span>
        </button>
      </div>

      {/* TAB 1: COLLEGE STATIONERY STORE */}
      {activeTab === 'store' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold font-serif-title text-slate-900">
                Official College Stationery Catalogue
              </h2>
              <p className="text-xs text-slate-500">
                Redeem your verified Good Samaritan R Coins for premium university academic supplies.
              </p>
            </div>
            <div className="text-xs text-slate-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>100 R Coins = Standard Stationery Item</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rewards.map((reward) => {
              const canAfford = currentUser.rCoins >= reward.rCoinsRequired;
              const inStock = reward.stock > 0;

              return (
                <div
                  key={reward.id}
                  className="rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col overflow-hidden"
                >
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={reward.imageUrl}
                      alt={reward.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-900/90 text-amber-300 shadow-2xs backdrop-blur-xs flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5" />
                        <span>{reward.rCoinsRequired} R Coins</span>
                      </span>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/90 text-slate-700 shadow-2xs">
                        {reward.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-slate-900">{reward.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{reward.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span
                        className={`text-xs ${
                          inStock ? 'text-slate-500' : 'text-rose-600 font-semibold'
                        }`}
                      >
                        {inStock ? `${reward.stock} in stock` : 'Out of Stock'}
                      </span>

                      <button
                        disabled={!canAfford || !inStock}
                        onClick={() => setSelectedReward(reward)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          canAfford && inStock
                            ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-2xs'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {!inStock
                          ? 'Out of Stock'
                          : canAfford
                          ? 'Redeem Reward'
                          : `Need ${reward.rCoinsRequired - currentUser.rCoins} more`}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MY REDEMPTION VOUCHERS */}
      {activeTab === 'my-vouchers' && (
        <div className="space-y-4">
          {userRedemptions.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-xl border border-slate-200 p-8 space-y-2">
              <Ticket className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">No Vouchers Generated Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Once you accumulate 100+ R Coins, redeem them for stationery and present your
                voucher code at the campus bookstore!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userRedemptions.map((red) => (
                <div
                  key={red.id}
                  className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        Stationery Voucher
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-1">{red.rewardTitle}</h4>
                      <p className="text-xs text-slate-400">
                        Requested on {new Date(red.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                        red.status === 'approved_ready_for_pickup'
                          ? 'bg-emerald-100 text-emerald-800'
                          : red.status === 'collected'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {red.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Voucher Code Box */}
                  <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-slate-400 block">
                        Present at Campus Bookstore
                      </span>
                      <span className="text-base sm:text-lg font-mono font-bold text-amber-400 tracking-wider">
                        {red.redemptionCode}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-300">
                      -{red.rCoinsDeducted} Coins
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    Show this 8-character voucher code to the college stationery store attendant at
                    the Student Activity Center (SAC) ground floor to collect your stationery.
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TRANSACTION HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {userTransactions.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-xl border border-slate-200 p-8 text-xs text-slate-500">
              No coin transactions recorded yet.
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs divide-y divide-slate-100">
              {userTransactions.map((tx) => {
                const isPositive = tx.amount > 0;
                return (
                  <div key={tx.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-xl ${
                          isPositive
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-rose-50 text-rose-600'
                        }`}
                      >
                        {isPositive ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                          {tx.description}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                          <span aria-hidden="true">·</span>
                          <span>Ref: {tx.referenceCode}</span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`text-sm sm:text-base font-bold font-mono ${
                        isPositive ? 'text-emerald-600' : 'text-slate-800'
                      }`}
                    >
                      {isPositive ? `+${tx.amount}` : tx.amount} R Coins
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Confirm Redemption Modal */}
      {selectedReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 font-serif-title">
              Confirm Stationery Redemption
            </h3>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <img
                src={selectedReward.imageUrl}
                alt={selectedReward.title}
                className="w-14 h-14 object-cover rounded-lg"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900">{selectedReward.title}</h4>
                <p className="text-xs text-amber-700 font-bold">
                  Cost: {selectedReward.rCoinsRequired} R Coins
                </p>
                <p className="text-[11px] text-slate-400">
                  Remaining balance after redemption: {currentUser.rCoins - selectedReward.rCoinsRequired} Coins
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Upon confirmation, {selectedReward.rCoinsRequired} R Coins will be deducted and an
              official pickup voucher code will be issued.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
              <button
                onClick={() => setSelectedReward(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRedeem(selectedReward)}
                className="px-5 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-2xs"
              >
                Confirm & Redeem Voucher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
