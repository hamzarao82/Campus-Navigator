import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import tw from 'twrnc';
import { Ionicons, Feather, FontAwesome } from '@expo/vector-icons';
import { auth, db } from '../../firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

interface Notification {
  id: string;
  title: string;
  message: string;
  recipients: 'all' | 'student' | 'faculty';
  createdAt: Timestamp;
  createdBy: string;
  time?: string;
}

export default function NotificationsScreen() {
  const router = useRouter();

  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<'all' | 'student' | 'faculty'>('all');
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const notificationsRef = collection(db, 'notifications');
      const q = query(notificationsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const notificationsData: Notification[] = [];
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

      setRecentNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      Alert.alert('Error', 'Failed to fetch notifications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

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

  const handleSendNotification = async () => {
    if (!notificationTitle || !notificationMessage) {
      Alert.alert('Missing Fields', 'Please fill in both title and message.');
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert('Error', 'You must be logged in to send notifications');
      return;
    }

    try {
      setIsSending(true);

      // Add notification to Firestore
      await addDoc(collection(db, 'notifications'), {
        title: notificationTitle,
        message: notificationMessage,
        recipients: selectedRecipient,
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

      // Reset form
      setNotificationTitle('');
      setNotificationMessage('');
      setSelectedRecipient('all');

      // Refresh notifications list
      fetchNotifications();
    } catch (error: any) {
      console.error('Error sending notification:', error);
      Alert.alert('Error', `Failed to send notification: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSending(false);
    }
  };

  const getRecipientLabel = (type: string) => {
    switch (type) {
      case 'student':
        return 'Students';
      case 'faculty':
        return 'Faculty';
      default:
        return 'All Users';
    }
  };

  const getRecipientColor = (type: string) => {
    switch (type) {
      case 'student':
        return 'bg-green-100 text-green-700';
      case 'faculty':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-purple-100 text-purple-700';
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`flex-row items-center px-6 py-4`}>
        <TouchableOpacity
          style={tw`w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-4`}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={tw`text-2xl font-bold text-gray-900`}>Send Notifications</Text>
      </View>

      <ScrollView
        style={tw`flex-1 px-6`}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchNotifications();
            }}
          />
        }
      >
        {/* Compose Card */}
        <View style={tw`bg-white rounded-2xl shadow p-4 mb-6 border border-gray-100`}>
          <Text style={tw`text-lg font-semibold text-gray-900 mb-4`}>
            Send New Notification
          </Text>

          {/* Title */}
          <Text style={tw`text-sm font-medium text-gray-800 mb-2`}>Title</Text>
          <TextInput
            style={tw`bg-gray-100 rounded-lg p-3 mb-4 text-base text-gray-800`}
            placeholder="Enter notification title"
            placeholderTextColor="#999"
            value={notificationTitle}
            onChangeText={setNotificationTitle}
          />

          {/* Message */}
          <Text style={tw`text-sm font-medium text-gray-800 mb-2`}>Message</Text>
          <TextInput
            style={tw`bg-gray-100 rounded-lg p-3 mb-4 text-base text-gray-800 h-28`}
            placeholder="Enter your message"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            value={notificationMessage}
            onChangeText={setNotificationMessage}
          />

          {/* Recipients */}
          <Text style={tw`text-sm font-medium text-gray-800 mb-2`}>Recipients</Text>
          <View style={tw`flex-row mb-4`}>
            {(['all', 'student', 'faculty'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                style={tw.style(
                  'px-4 py-2 rounded-full mr-2',
                  selectedRecipient === type ? 'bg-blue-600' : 'bg-gray-100'
                )}
                onPress={() => setSelectedRecipient(type)}
              >
                <Text
                  style={tw.style(
                    'text-sm font-medium',
                    selectedRecipient === type ? 'text-white' : 'text-gray-600'
                  )}
                >
                  {getRecipientLabel(type)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Send Button */}
          <TouchableOpacity
            style={tw`flex-row items-center justify-center bg-blue-600 rounded-xl py-3`}
            onPress={handleSendNotification}
            disabled={isSending}
          >
            {isSending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Feather name="send" size={18} color="#fff" />
                <Text style={tw`text-white text-base font-semibold ml-2`}>
                  Send Notification
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Recent Notifications */}
        <Text style={tw`text-xl font-semibold text-gray-900 mb-4`}>
          Recent Notifications ({recentNotifications.length})
        </Text>

        {loading ? (
          <View style={tw`items-center justify-center py-10`}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={tw`text-gray-500 mt-4`}>Loading notifications...</Text>
          </View>
        ) : recentNotifications.length === 0 ? (
          <View style={tw`items-center justify-center py-10`}>
            <Ionicons name="notifications-off-outline" size={48} color="#9CA3AF" />
            <Text style={tw`text-center text-gray-500 mt-4`}>
              No notifications sent yet.
            </Text>
            <Text style={tw`text-center text-gray-400 text-sm mt-1`}>
              Send your first notification above!
            </Text>
          </View>
        ) : (
          recentNotifications.map((notification) => (
            <View
              key={notification.id}
              style={tw`bg-white rounded-2xl shadow p-4 mb-4 border border-gray-100`}
            >
              {/* Header */}
              <View style={tw`flex-row items-center mb-3`}>
                <View style={tw`w-12 h-12 rounded-full bg-blue-100 items-center justify-center mr-3`}>
                  <Ionicons name="notifications-outline" size={24} color="#2563EB" />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-base font-semibold text-gray-900`}>
                    {notification.title}
                  </Text>
                  <View
                    style={tw`px-2 py-1 rounded-full self-start mt-1 ${getRecipientColor(
                      notification.recipients
                    )}`}
                  >
                    <Text style={tw`text-xs font-medium`}>
                      {getRecipientLabel(notification.recipients)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Message */}
              <Text style={tw`text-gray-600 text-sm mb-3`}>
                {notification.message}
              </Text>

              {/* Info */}
              <View style={tw`flex-row items-center`}>
                <Feather name="clock" size={14} color="#6B7280" />
                <Text style={tw`text-gray-500 text-sm ml-2`}>
                  {notification.time}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
