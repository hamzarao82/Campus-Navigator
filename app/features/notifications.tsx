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
import { PageHeader } from "../../components/ui/molecules/PageHeader";
import { EmptyState } from "../../components/ui/molecules/EmptyState";
import { useNotifications } from "../../hooks/useNotifications";
import { NotificationFormCard } from "../../components/ui/organisms/NotificationFormCard";
import { NotificationCard } from "../../components/ui/molecules/NotificationCard";

export default function NotificationsScreen() {
  const router = useRouter();

  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<'all' | 'student' | 'faculty'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const {
    notifications,
    loading,
    isSending,
    fetchNotifications,
    sendNotification,
  } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleSendNotification = async () => {
    const success = await sendNotification(
      notificationTitle,
      notificationMessage,
      selectedRecipient
    );
    if (success) {
      setNotificationTitle('');
      setNotificationMessage('');
      setSelectedRecipient('all');
      fetchNotifications();
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <PageHeader title="Send Notifications" />

      <ScrollView
        style={tw`flex-1 px-6`}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await fetchNotifications();
              setRefreshing(false);
            }}
          />
        }
      >
        {/* Compose Card */}
        <NotificationFormCard
          notificationTitle={notificationTitle}
          setNotificationTitle={setNotificationTitle}
          notificationMessage={notificationMessage}
          setNotificationMessage={setNotificationMessage}
          selectedRecipient={selectedRecipient}
          setSelectedRecipient={setSelectedRecipient}
          isSending={isSending}
          onSend={handleSendNotification}
        />

        {/* Recent Notifications */}
        <Text style={tw`text-xl font-semibold text-gray-900 mb-4`}>
          Recent Notifications ({notifications.length})
        </Text>

        {loading ? (
          <View style={tw`items-center justify-center py-10`}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={tw`text-gray-500 mt-4`}>Loading notifications...</Text>
          </View>
        ) : notifications.length === 0 ? (
          <EmptyState
            iconName="notifications-off-outline"
            title="No notifications sent yet."
            subtitle="Send your first notification above!"
          />
        ) : (
          notifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
