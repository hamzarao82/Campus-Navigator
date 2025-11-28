import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import tw from "twrnc";
import { Ionicons, Feather } from "@expo/vector-icons";
import { auth } from "../../firebaseConfig";
import { signOut } from "firebase/auth";

export default function StudentDashboard() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.error("Sign out error:", error);
      alert("Failed to sign out. Please try again.");
    }
  };

  const menuItems = [
    {
      title: "Campus Map",
      route: "/features/maps",
      icon: "map-outline",
      description: "Navigate through campus",
    },
    {
      title: "Check POI",
      route: "/student/poi",
      icon: "pin-outline",
      description: "Find points of interest",
    },
    {
      title: "Schedules",
      route: "/student/schedules",
      icon: "calendar-outline",
      description: "View your class schedule",
    },
    {
      title: "Notifications",
      route: "/student/student-notification",
      icon: "notifications-outline",
      description: "View important announcements",
    },
    {
      title: "Profile",
      route: "/student/student-profile",
      icon: "person-outline",
      description: "Manage your account",
    },
    {
      title: "Setting",
      route: "/features/settings",
      icon: "settings-outline",
      description: "System configuration",
    }
  ];

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`p-6 pb-20`}>
        {/* Header */}
        <View style={tw`flex-row justify-between items-center mb-8`}>
          <View>
            <Text style={tw`text-3xl font-bold text-blue-600`}>
              Student Dashboard
            </Text>
            <Text style={tw`text-base text-gray-500 mt-1`}>
              Welcome back!
            </Text>
          </View>

          {/* Sign Out */}
          <TouchableOpacity
            style={tw`p-3 rounded-xl bg-transparent`}
            onPress={handleSignOut}
          >
            <Feather name="log-out" size={22} color="#dc2626" />
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={tw`gap-4`}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={tw`flex-row items-center bg-gray-50 rounded-2xl p-4 shadow-sm`}
              onPress={() => router.push(item.route)}
            >
              <View
                style={tw`w-12 h-12 rounded-full bg-blue-100 justify-center items-center mr-4`}
              >
                <Ionicons name={item.icon} size={24} color="#2563eb" />
              </View>

              <View style={tw`flex-1`}>
                <Text style={tw`text-lg font-semibold text-gray-800`}>
                  {item.title}
                </Text>
                <Text style={tw`text-sm text-gray-500`}>
                  {item.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
