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
      iconLib: Ionicons,
      iconName: "map-outline",
      description: "Navigate through campus",
    },
    {
      title: "Check POI",
      route: "/student/poi",
      iconLib: Ionicons,
      iconName: "location-outline",
      description: "Find points of interest",
    },
    {
      title: "Schedules",
      route: "/student/schedules",
      iconLib: Ionicons,
      iconName: "calendar-outline",
      description: "View your class schedule",
    },
    {
      title: "Notifications",
      route: "/student/student-notification",
      iconLib: Ionicons,
      iconName: "notifications-outline",
      description: "View important announcements",
    },
    {
      title: "Profile",
      route: "/student/student-profile",
      iconLib: Ionicons,
      iconName: "person-outline",
      description: "Manage your account",
    },
    {
      title: "Settings",
      route: "/features/settings",
      iconLib: Ionicons,
      iconName: "settings-outline",
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
          {menuItems.map((item, index) => {
            const IconComponent = item.iconLib;
            return (
              <TouchableOpacity
                key={index}
                style={tw`flex-row items-center bg-white rounded-2xl p-4 border border-gray-100 shadow-sm`}
                onPress={() => router.push(item.route as any)}
              >
                <View
                  style={tw`w-12 h-12 rounded-full bg-blue-100 justify-center items-center mr-4`}
                >
                  <IconComponent name={item.iconName as any} size={22} color="#2563EB" />
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
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
