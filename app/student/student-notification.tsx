import React, { useEffect, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { Ionicons, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useNotifications } from "../../hooks/useNotifications";
import { NotificationCard } from "../../components/ui/molecules/NotificationCard";

export default function StudentNotificationsScreen() {
  const { notifications, loading, fetchNotifications } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const studentNotifications = useMemo(() => {
    return notifications.filter(
      (n) => n.recipients === "all" || n.recipients === "student"
    );
  }, [notifications]);

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
            {studentNotifications.map((item) => (
              <NotificationCard key={item.id} notification={item as any} />
            ))}

            {/* Empty State */}
            {studentNotifications.length === 0 && (
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
