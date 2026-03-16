'use client';

import { useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

/**
 * AuthSync is a headless component that synchronizes the Firebase Authentication
 * user state with a corresponding document in the 'users' Firestore collection.
 * It also seeds initial default data like shows for a better first-time experience.
 */
export function AuthSync() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  useEffect(() => {
    if (isUserLoading || !user || !db) return;

    const userRef = doc(db, 'users', user.uid);
    
    // Update or create the core user profile
    setDocumentNonBlocking(
      userRef,
      {
        id: user.uid,
        name: user.displayName || 'Anonymous User',
        email: user.email || '',
        profilePhotoUrl: user.photoURL || '',
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(), 
      },
      { merge: true }
    );

    // Seed default shows with fixed IDs to prevent duplicates
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

  }, [user, isUserLoading, db]);

  return null;
}
