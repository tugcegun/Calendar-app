import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import type { CalendarEvent } from '../types';

function eventsCol(userId: string) {
  return collection(db, 'users', userId, 'events');
}

export function subscribeToEvents(
  userId: string,
  onEvents: (events: CalendarEvent[]) => void,
): Unsubscribe {
  return onSnapshot(eventsCol(userId), (snapshot) => {
    const events: CalendarEvent[] = snapshot.docs.map((d) => ({
      ...(d.data() as Omit<CalendarEvent, 'id'>),
      id: d.id,
    }));
    onEvents(events);
  });
}

export async function addFirestoreEvent(
  userId: string,
  event: Omit<CalendarEvent, 'id'>,
): Promise<string> {
  const docRef = await addDoc(eventsCol(userId), event);
  return docRef.id;
}

export async function deleteFirestoreEvent(
  userId: string,
  eventId: string,
): Promise<void> {
  await deleteDoc(doc(db, 'users', userId, 'events', eventId));
}
