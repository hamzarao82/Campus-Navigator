import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { Ionicons, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { db } from "../../firebaseConfig";
import { collection, query, getDocs, orderBy } from "firebase/firestore";

interface Notification {
  id: string;
  title: string;
  message: string;
  recipients: string;
  time: string;
  createdAt?: any;
}

export default function StudentNotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching notifications from Firebase...");

      const notificationsRef = collection(db, "notifications");

      // Fetch all notifications ordered by createdAt
      // We'll filter client-side to avoid needing a composite index
      const q = query(notificationsRef, orderBy("createdAt", "desc"));

      const querySnapshot = await getDocs(q);
      console.log("📊 Total notifications in Firebase:", querySnapshot.size);

      const notificationsData: Notification[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log("📝 Notification data:", {
          id: doc.id,
          recipients: data.recipients,
          title: data.title
        });

        // Filter for students: only show 'all' or 'student' recipients
        if (data.recipients === 'all' || data.recipients === 'student') {
          console.log("✅ Including notification:", data.title);
          notificationsData.push({
            id: doc.id,
            title: data.title,
            message: data.message,
            recipients: data.recipients,
            time: data.time || formatDate(data.createdAt),
            createdAt: data.createdAt,
          });
        } else {
          console.log("❌ Excluding notification (recipients:", data.recipients + ")");
        }
      });

      console.log("✨ Final filtered notifications count:", notificationsData.length);
      setNotifications(notificationsData);
    } catch (error: any) {
      console.error("❌ Error fetching notifications:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);

      // Fallback to sample data
      console.log("⚠️ Using fallback sample data");
      setNotifications([
        {
          id: "1",
          title: "Class Schedule Updated",
          message: "Your Monday 9 AM class has been moved to Room 204.",
          recipients: "Students",
          time: "Oct 8, 2025 • 10:15 AM",
        },
        {
          id: "2",
          title: "New Event: Tech Fest",
          message: "Join the Annual Tech Fest on Friday in the main auditorium.",
          recipients: "All Users",
          time: "Oct 6, 2025 • 03:45 PM",
        },
        {
          id: "3",
          title: "Exam Reminder",
          message: "Your midterm exam is scheduled for Oct 12 at 11 AM.",
          recipients: "Students",
          time: "Oct 5, 2025 • 08:00 AM",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Recently";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "Recently";
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`flex-row items-center px-5 py-4`}>
        <TouchableOpacity style={tw`p-2 rounded-full bg-transparent mr-3`}
          onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#1f2937" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold text-gray-800`}>My Notifications</Text>
      </View>

      {/* Notification List */}
      <ScrollView style={tw`flex-1 px-5 pt-4`}>
        {loading ? (
          <View style={tw`flex-1 justify-center items-center mt-20`}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={tw`text-gray-500 mt-4`}>Loading notifications...</Text>
          </View>
        ) : (
          <>
            {notifications.map((item) => (
              <View
                key={item.id}
                style={tw`bg-white border border-gray-200 rounded-2xl p-4 mb-4 shadow-sm`}
              >
                <View style={tw`flex-row items-center mb-3`}>
                  <View
                    style={tw`w-10 h-10 rounded-full bg-blue-100 justify-center items-center mr-3`}
                  >
                    <Ionicons name="notifications-outline" size={22} color="#2563eb" />
                  </View>
                  <Text style={tw`text-lg font-semibold text-gray-800 flex-1`}>
                    {item.title}
                  </Text>
                </View>

                <Text style={tw`text-gray-600 text-sm mb-3`}>{item.message}</Text>

                <View style={tw`flex-row justify-between items-center`}>
                  <View style={tw`flex-row items-center`}>
                    <Ionicons name="people-outline" size={16} color="#6b7280" />
                    <Text style={tw`text-gray-500 text-xs ml-1`}>
                      {item.recipients}
                    </Text>
                  </View>

                  <View style={tw`flex-row items-center`}>
                    <Ionicons name="time-outline" size={16} color="#6b7280" />
                    <Text style={tw`text-gray-500 text-xs ml-1`}>{item.time}</Text>
                  </View>
                </View>
              </View>
            ))}

            {/* Empty State */}
            {notifications.length === 0 && (
              <View style={tw`flex-1 justify-center items-center mt-10`}>
                <Ionicons name="notifications-off-outline" size={40} color="#9ca3af" />
                <Text style={tw`text-gray-500 mt-2`}>No new notifications</Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
