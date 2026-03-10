'use client';

import { useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

/**
 * AuthSync is a headless component that synchronizes the Firebase Authentication
 * user state with a corresponding document in the 'users' Firestore collection.
 */
export function AuthSync() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  useEffect(() => {
    if (isUserLoading || !user || !db) return;

    const userRef = doc(db, 'users', user.uid);
    
    // We use setDocumentNonBlocking with merge: true to ensure the user document
    // is created if it doesn't exist, or updated with the latest basic info.
    setDocumentNonBlocking(
      userRef,
      {
        id: user.uid,
        name: user.displayName || 'Anonymous User',
        email: user.email || '',
        profilePhotoUrl: user.photoURL || '',
        updatedAt: serverTimestamp(),
        // Only set createdAt if it's a new document
        createdAt: serverTimestamp(), 
      },
      { merge: true }
    );
  }, [user, isUserLoading, db]);

  return null;
}
