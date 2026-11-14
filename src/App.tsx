/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storage';
import {
  User,
  ItemPost,
  ItemClaim,
  RCoinTransaction,
  StationeryReward,
  RedemptionRequest,
  AppNotification,
  ItemType,
} from './types';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { AuthView } from './components/views/AuthView';
import { DashboardView } from './components/views/DashboardView';
import { FeedListView } from './components/views/FeedListView';
import { MyPostsView } from './components/views/MyPostsView';
import { RCoinsWalletView } from './components/views/RCoinsWalletView';
import { ProfileView } from './components/views/ProfileView';
import { AdminPanelView } from './components/views/AdminPanelView';
import { CloudConfigView } from './components/views/CloudConfigView';
import { CreatePostModal } from './components/modals/CreatePostModal';
import { ItemDetailModal } from './components/modals/ItemDetailModal';

export default function App() {
  // Initialize default data if empty
  useEffect(() => {
    StorageService.init();
  }, []);

  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    StorageService.getCurrentUser()
  );
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // App entities
  const [users, setUsers] = useState<User[]>(() => StorageService.getUsers());
  const [posts, setPosts] = useState<ItemPost[]>(() => StorageService.getPosts());
  const [claims, setClaims] = useState<ItemClaim[]>(() => StorageService.getClaims());
  const [transactions, setTransactions] = useState<RCoinTransaction[]>(() =>
    StorageService.getTransactions()
  );
  const [rewards, setRewards] = useState<StationeryReward[]>(() =>
    StorageService.getRewards()
  );
  const [redemptions, setRedemptions] = useState<RedemptionRequest[]>(() =>
    StorageService.getRedemptions()
  );
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Modals
  const [selectedPost, setSelectedPost] = useState<ItemPost | null>(null);
  const [createPostState, setCreatePostState] = useState<{
    isOpen: boolean;
    initialType: ItemType;
  }>({
    isOpen: false,
    initialType: 'lost',
  });

  // Refresh all state from localStorage
  const refreshAppData = () => {
    const updatedUsers = StorageService.getUsers();
    setUsers(updatedUsers);
    setPosts(StorageService.getPosts());
    setClaims(StorageService.getClaims());
    setTransactions(StorageService.getTransactions());
    setRewards(StorageService.getRewards());
    setRedemptions(StorageService.getRedemptions());

    if (currentUser) {
      const refreshedUser = updatedUsers.find((u) => u.id === currentUser.id);
      if (refreshedUser) {
        setCurrentUser(refreshedUser);
        setNotifications(StorageService.getNotifications(refreshedUser.id));
      }
    }
  };

  useEffect(() => {
    refreshAppData();
    const handleStorageChange = () => refreshAppData();
    window.addEventListener('b2y_storage_change', handleStorageChange);
    return () => window.removeEventListener('b2y_storage_change', handleStorageChange);
  }, [currentUser?.id]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentTab('dashboard');
    refreshAppData();
  };

  const handleLogout = () => {
    StorageService.setCurrentUser(null);
    setCurrentUser(null);
  };

  const handleOpenCreatePost = (type: ItemType) => {
    setCreatePostState({ isOpen: true, initialType: type });
  };

  const handleCreatePostSubmit = (newPost: ItemPost) => {
    StorageService.savePost(newPost);
    setCreatePostState({ isOpen: false, initialType: 'lost' });
    refreshAppData();
    // Redirect to relevant view or dashboard
    if (newPost.type === 'lost') {
      setCurrentTab('lost-items');
    } else {
      setCurrentTab('found-items');
    }
  };

  // If user is not logged in, render the login page
  if (!currentUser) {
    return <AuthView onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#F9F9F6] text-slate-800 flex flex-col lg:flex-row">
      {/* Responsive Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'create-post') {
            handleOpenCreatePost('lost');
          } else {
            setCurrentTab(tab);
          }
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        unreadNotifsCount={notifications.filter((n) => !n.isRead).length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Header bar */}
        <Header
          currentUser={currentUser}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onNavigate={(tab) => setCurrentTab(tab)}
          onOpenCreatePost={handleOpenCreatePost}
          notifications={notifications}
          onRefreshNotifications={refreshAppData}
        />

        {/* View content container */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          {currentTab === 'dashboard' && (
            <DashboardView
              currentUser={currentUser}
              posts={posts}
              onNavigate={(tab) => setCurrentTab(tab)}
              onOpenCreatePost={handleOpenCreatePost}
              onSelectItem={(post) => setSelectedPost(post)}
            />
          )}

          {currentTab === 'lost-items' && (
            <FeedListView
              type="lost"
              posts={posts}
              onSelectItem={(post) => setSelectedPost(post)}
              onOpenCreatePost={handleOpenCreatePost}
            />
          )}

          {currentTab === 'found-items' && (
            <FeedListView
              type="found"
              posts={posts}
              onSelectItem={(post) => setSelectedPost(post)}
              onOpenCreatePost={handleOpenCreatePost}
            />
          )}

          {currentTab === 'my-posts' && (
            <MyPostsView
              currentUser={currentUser}
              posts={posts}
              claims={claims}
              onRefresh={refreshAppData}
              onSelectItem={(post) => setSelectedPost(post)}
            />
          )}

          {currentTab === 'wallet' && (
            <RCoinsWalletView
              currentUser={currentUser}
              transactions={transactions}
              rewards={rewards}
              redemptions={redemptions}
              onRefresh={refreshAppData}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileView
              currentUser={currentUser}
              posts={posts}
              onRefreshUser={refreshAppData}
            />
          )}

          {currentTab === 'admin' && (
            <AdminPanelView
              currentUser={currentUser}
              users={users}
              posts={posts}
              claims={claims}
              rewards={rewards}
              redemptions={redemptions}
              transactions={transactions}
              onRefresh={refreshAppData}
            />
          )}

          {currentTab === 'cloud-config' && <CloudConfigView />}
        </main>
      </div>

      {/* Create Post Modal */}
      {createPostState.isOpen && (
        <CreatePostModal
          initialType={createPostState.initialType}
          currentUser={currentUser}
          onClose={() => setCreatePostState({ isOpen: false, initialType: 'lost' })}
          onSubmit={handleCreatePostSubmit}
        />
      )}

      {/* Item Details & Verification Claim Modal */}
      {selectedPost && (
        <ItemDetailModal
          post={selectedPost}
          currentUser={currentUser}
          onClose={() => setSelectedPost(null)}
          onDeletePost={(id) => {
            StorageService.deletePost(id);
            refreshAppData();
          }}
          onClaimSubmitted={refreshAppData}
          onNavigateToMyPosts={() => setCurrentTab('my-posts')}
        />
      )}
    </div>
  );
}
