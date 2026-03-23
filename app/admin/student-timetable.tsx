// StudentTimetableScreen_NoGap.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather, Entypo, FontAwesome5 } from "@expo/vector-icons";
import tw from "twrnc";
import { router } from "expo-router";

import { useAdminTimetable } from "../../hooks/useAdminTimetable";
import { TimetableAdminCard } from "../../components/ui/molecules/TimetableAdminCard";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function StudentTimetableScreen_NoGap() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDay, setSelectedDay] = useState("Monday");
  const { timetableData, loading } = useAdminTimetable();

  const handleViewAll = (student: any) => {
    alert(`View all classes for ${student.studentName}`);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View
        style={tw`flex-row items-center justify-between px-4 py-3`}
      >
        <TouchableOpacity
          style={tw`w-9 h-9 rounded-full bg-transparent items-center justify-center`}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={20} color="#333" />
        </TouchableOpacity>

        <Text style={tw`text-base font-semibold text-gray-900`}>
          Student Timetable
        </Text>

        <TouchableOpacity
          style={tw`w-9 h-9 rounded-full bg-blue-100 items-center justify-center`}
          onPress={() => alert("Feature coming soon")}
        >
          <Feather name="filter" size={18} color="#2563eb" />
        </TouchableOpacity>
      </View>

      {/* Main ScrollView */}
      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`px-4 pb-6`}
        showsVerticalScrollIndicator={false}
      >
        {/* Search */}
        <View style={tw`mt-4`}>
          <View
            style={tw`flex-row items-center bg-gray-100 rounded-full px-3 py-1.5`}
          >
            <Feather name="search" size={16} color="#9ca3af" />
            <TextInput
              style={tw`flex-1 ml-2 text-sm text-gray-800`}
              placeholder="Search students..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Day Selector */}
        <View style={tw`mt-3 mb-2`}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={tw`py-0`}
          >
            {days.map((day) => (
              <TouchableOpacity
                key={day}
                activeOpacity={0.85}
                onPress={() => setSelectedDay(day)}
                style={[
                  tw`mr-3 rounded-full border items-center justify-center`,
                  selectedDay === day
                    ? tw`bg-blue-600 border-blue-600`
                    : tw`bg-gray-100 border-gray-200`,
                  {
                    paddingHorizontal: 10,
                    height: 26,
                    minWidth: 48,
                  },
                ]}
              >
                <Text
                  style={[
                    tw`text-xs font-medium`,
                    selectedDay === day ? tw`text-white` : tw`text-gray-700`,
                    { lineHeight: 14 },
                  ]}
                >
                  {day.slice(0, 3)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Timetable Cards */}
        <View style={tw`mt-1`}>
          {timetableData.map((student) => (
            <TimetableAdminCard
              key={student.id}
              student={student}
              selectedDay={selectedDay}
              onViewAll={handleViewAll}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
