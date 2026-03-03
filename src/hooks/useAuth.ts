import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { subscribeToEvents } from '../services/firestoreService';
import { useAppStore } from '../store/useAppStore';

export function useAuth() {
  const setFirebaseUser = useAppStore((s) => s.setFirebaseUser);
  const setAuthLoading = useAppStore((s) => s.setAuthLoading);
  const setEvents = useAppStore((s) => s.setEvents);

  useEffect(() => {
    let unsubFirestore: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      // Clean up previous Firestore listener
      if (unsubFirestore) {
        unsubFirestore();
        unsubFirestore = null;
      }

      if (user) {
        setFirebaseUser(user);
        setAuthLoading(false);

        // Subscribe to Firestore events for this user
        unsubFirestore = subscribeToEvents(user.uid, (events) => {
          setEvents(events);
        });
      } else {
        setFirebaseUser(null);
        setEvents([]);
        setAuthLoading(false);

        // Redirect to login page
        window.location.href = './login.html';
      }
    });

    return () => {
      unsubAuth();
      if (unsubFirestore) unsubFirestore();
    };
  }, [setFirebaseUser, setAuthLoading, setEvents]);
}
