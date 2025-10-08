import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { Ionicons, Feather } from "@expo/vector-icons";
import { router } from "expo-router";

export default function StudentNotificationsScreen() {
  const sampleNotifications = [
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
  ];

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`flex-row items-center px-5 py-4 border-b border-gray-200`}>
        <TouchableOpacity style={tw`p-2 rounded-full bg-gray-100 mr-3`}
        onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#1f2937" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold text-gray-800`}>My Notifications</Text>
      </View>

      {/* Notification List */}
      <ScrollView style={tw`flex-1 px-5 pt-4`}>
        {sampleNotifications.map((item) => (
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

        {/* Empty State Example */}
        {sampleNotifications.length === 0 && (
          <View style={tw`flex-1 justify-center items-center mt-10`}>
            <Ionicons name="notifications-off-outline" size={40} color="#9ca3af" />
            <Text style={tw`text-gray-500 mt-2`}>No new notifications</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
