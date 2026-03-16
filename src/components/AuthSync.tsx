'use client';

import { useEffect } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

/**
 * AuthSync is a headless component that synchronizes the Firebase Authentication
 * user state with a corresponding document in the 'users' Firestore collection.
 * It seeds initial default data ONLY if the user profile does not already exist.
 */
export function AuthSync() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  const userRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid);
  }, [db, user]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userRef);

  useEffect(() => {
    // Only proceed if auth is ready, profile check is finished, and NO profile exists yet.
    if (isUserLoading || isProfileLoading || !user || !db || profile) return;

    // This block only runs for a brand new user profile
    // Update or create the core user profile
    setDocumentNonBlocking(
      userRef!,
      {
        id: user.uid,
        name: user.displayName || 'Anonymous User',
        email: user.email || '',
        profilePhotoUrl: user.photoURL || '',
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(), 
        roles: ['Creative'],
      },
      { merge: true }
    );

    // Seed default shows
    const defaultShows = [
      {
        id: 'default-show-1',
        title: 'Acoustic Night Live',
        venue: 'The Garden Cafe',
        payout: '$250',
        date: '2024-12-15',
      },
      {
        id: 'default-show-2',
        title: 'Jazz in the Park',
        venue: 'Central Park Amphitheater',
        payout: '$500',
        date: '2024-12-20',
      },
      {
        id: 'default-show-3',
        title: 'Tech Conference Keynote',
        venue: 'Grand Hall Convention Center',
        payout: '$1,200',
        date: '2025-01-10',
      }
    ];

    defaultShows.forEach((show) => {
      const showRef = doc(db, 'users', user.uid, 'shows', show.id);
      setDocumentNonBlocking(
        showRef,
        {
          ...show,
          userId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    });

    // Seed default workshops
    const defaultWorkshops = [
      {
        id: 'default-ws-1',
        title: 'Mastering React Server Components',
        category: 'Coding',
        price: '$49',
        date: '2024-12-24',
        participants: 12,
        maxParticipants: 20,
        image: 'https://picsum.photos/seed/react/600/400'
      },
      {
        id: 'default-ws-2',
        title: 'Introduction to Brand Identity',
        category: 'Design',
        price: 'Free',
        date: '2024-12-28',
        participants: 45,
        maxParticipants: 100,
        image: 'https://picsum.photos/seed/brand/600/400'
      }
    ];

    defaultWorkshops.forEach((ws) => {
      const wsRef = doc(db, 'users', user.uid, 'workshops', ws.id);
      setDocumentNonBlocking(
        wsRef,
        {
          ...ws,
          userId: user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    });

    // Seed default notifications
    const defaultNotifications = [
      {
        id: 'welcome-notification',
        title: 'Welcome to TalentHub!',
        message: 'Start by setting up your profile and adding your first show.',
        read: false,
        type: 'info',
      },
      {
        id: 'seed-notification-1',
        title: 'New Booking Request',
        message: 'You have a new inquiry for "Acoustic Night Live".',
        read: false,
        type: 'success',
      }
    ];

    defaultNotifications.forEach((notification) => {
      const notificationRef = doc(db, 'users', user.uid, 'notifications', notification.id);
      setDocumentNonBlocking(
        notificationRef,
        {
          ...notification,
          userId: user.uid,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
    });

  }, [user, isUserLoading, isProfileLoading, profile, db, userRef]);

  return null;
}
