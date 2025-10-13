import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import tw from 'twrnc';
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome } from '@expo/vector-icons';

export default function NotificationsScreen() {
  const router = useRouter();

  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('all');
  const [isSending, setIsSending] = useState(false);

  const [recentNotifications, setRecentNotifications] = useState([
    {
      id: '1',
      title: 'System Maintenance',
      message: 'Scheduled downtime tonight at 11 PM.',
      recipients: 'all',
      status: 'Sent',
      timestamp: 'Oct 11, 2025, 8:00 PM',
    },
    {
      id: '2',
      title: 'Faculty Meeting',
      message: 'Reminder: Department meeting tomorrow at 10 AM.',
      recipients: 'faculty',
      status: 'Sent',
      timestamp: 'Oct 10, 2025, 9:15 AM',
    },
  ]);

  const handleSendNotification = () => {
    if (!notificationTitle || !notificationMessage) {
      alert('Please fill in both title and message.');
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      const newNotification = {
        id: Date.now().toString(),
        title: notificationTitle,
        message: notificationMessage,
        recipients: selectedRecipient,
        status: 'Sent',
        timestamp: new Date().toLocaleString(),
      };
      setRecentNotifications([newNotification, ...recentNotifications]);
      setNotificationTitle('');
      setNotificationMessage('');
      setSelectedRecipient('all');
      setIsSending(false);
      alert('Notification sent successfully!');
    }, 1000);
  };

  const getRecipientLabel = (type: string) => {
    switch (type) {
      case 'student': return 'Students';
      case 'faculty': return 'Faculty';
      default: return 'All Users';
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
        <Text style={tw`text-2xl font-bold text-gray-900`}>Notifications</Text>
      </View>

      <ScrollView style={tw`flex-1 px-6`} showsVerticalScrollIndicator={false}>
        {/* Compose Card */}
        <View style={tw`bg-white rounded-2xl shadow p-4 mb-6 border border-gray-100`}>
          <Text style={tw`text-lg font-semibold text-gray-900 mb-4`}>Send New Notification</Text>

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
            {['all', 'student', 'faculty'].map((type) => (
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
        <Text style={tw`text-xl font-semibold text-gray-900 mb-4`}>Recent Notifications</Text>

        {recentNotifications.length === 0 ? (
          <Text style={tw`text-center text-gray-500 mb-4`}>
            No recent notifications to display.
          </Text>
        ) : (
          recentNotifications.map((notification) => (
            <View key={notification.id} style={tw`bg-white rounded-2xl shadow p-4 mb-4 border border-gray-100`}>
              {/* Header */}
              <View style={tw`flex-row items-center mb-3`}>
                <View style={tw`w-12 h-12 rounded-full bg-blue-100 items-center justify-center mr-3`}>
                  <Ionicons name="notifications-outline" size={24} color="#2563EB" />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-base font-semibold text-gray-900`}>
                    {notification.title}
                  </Text>
                  <View style={tw`bg-green-100 px-2 py-1 rounded-full self-start mt-1`}>
                    <Text style={tw`text-green-700 text-xs font-medium`}>
                      {notification.status}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Message */}
              <Text style={tw`text-gray-600 text-sm mb-3`}>
                {notification.message}
              </Text>

              {/* Info */}
              <View style={tw`flex-row justify-between`}>
                <View style={tw`flex-row items-center`}>
                  <FontAwesome name="users" size={14} color="#6B7280" />
                  <Text style={tw`text-gray-500 text-sm ml-2`}>
                    {getRecipientLabel(notification.recipients)}
                  </Text>
                </View>
                <View style={tw`flex-row items-center`}>
                  <Feather name="clock" size={14} color="#6B7280" />
                  <Text style={tw`text-gray-500 text-sm ml-2`}>
                    {notification.timestamp}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
