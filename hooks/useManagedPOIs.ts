import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { POI } from '../types/map';

export function useManagedPOIs() {
  const [managedPOIs, setManagedPOIs] = useState<POI[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'pois'),
      (snapshot) => {
        const pois = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
          category: 'Managed',
          savedAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        }));
        setManagedPOIs(pois);
      },
      (error: any) => {
        console.error('Error fetching managed POIs:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  return { managedPOIs, setManagedPOIs };
}
