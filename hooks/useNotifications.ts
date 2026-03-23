import { useState, useCallback } from "react";
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { Alert } from "react-native";
import { db, auth } from "../firebaseConfig";
import { AppNotification } from "../types/notification";

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch (error) {
      return 'Recently';
    }
  };

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const notificationsRef = collection(db, 'notifications');
      const q = query(notificationsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const notificationsData: AppNotification[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        notificationsData.push({
          id: doc.id,
          title: data.title,
          message: data.message,
          recipients: data.recipients,
          createdAt: data.createdAt,
          createdBy: data.createdBy,
          time: data.time || formatTimestamp(data.createdAt),
        });
      });

      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      Alert.alert('Error', 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  const sendNotification = async (
    title: string,
    message: string,
    recipients: "all" | "student" | "faculty"
  ) => {
    if (!title || !message) {
      Alert.alert('Missing Fields', 'Please fill in both title and message.');
      return false;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to send notifications');
      return false;
    }

    try {
      setIsSending(true);
      await addDoc(collection(db, 'notifications'), {
        title,
        message,
        recipients,
        createdAt: serverTimestamp(),
        createdBy: currentUser.uid,
        time: new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
      });

      Alert.alert('Success', 'Notification sent successfully!');
      return true;
    } catch (error: any) {
      console.error('Error sending notification:', error);
      Alert.alert('Error', `Failed to send notification: ${error.message || 'Unknown error'}`);
      return false;
    } finally {
      setIsSending(false);
    }
  };

  return {
    notifications,
    loading,
    isSending,
    fetchNotifications,
    sendNotification,
  };
}
