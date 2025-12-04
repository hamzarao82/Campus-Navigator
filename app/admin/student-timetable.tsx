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

const timetableData = [
  {
    id: 1,
    studentName: "Alice Johnson",
    studentId: "STU001",
    courses: [
      {
        code: "CS101",
        name: "Introduction to Computer Science",
        day: "Monday",
        time: "10:00 AM - 11:30 AM",
        room: "Room 201",
        instructor: "Dr. Sarah Johnson",
      },
      {
        code: "MATH201",
        name: "Advanced Calculus",
        day: "Tuesday",
        time: "2:00 PM - 3:30 PM",
        room: "Room 305",
        instructor: "Prof. Michael Smith",
      },
    ],
  },
  {
    id: 2,
    studentName: "Bob Wilson",
    studentId: "STU002",
    courses: [
      {
        code: "ENG102",
        name: "Academic Writing",
        day: "Wednesday",
        time: "1:00 PM - 2:30 PM",
        room: "Room 102",
        instructor: "Dr. Emily Brown",
      },
      {
        code: "PHYS101",
        name: "Physics Fundamentals",
        day: "Thursday",
        time: "11:00 AM - 12:30 PM",
        room: "Lab 203",
        instructor: "Dr. James Wilson",
      },
    ],
  },
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function StudentTimetableScreen_NoGap() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDay, setSelectedDay] = useState("Monday");

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View
        style={tw`flex-row items-center justify-between px-4 py-3 border-b border-gray-100`}
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
          {timetableData.map((student) => {
            const filteredCourses = student.courses.filter(
              (c) => c.day === selectedDay
            );

            return (
              <View
                key={student.id}
                style={tw`bg-white rounded-2xl border border-gray-100 p-3 mb-3`}
              >
                {/* Student Header */}
                <View style={tw`flex-row justify-between items-center mb-2`}>
                  <View>
                    <Text style={tw`text-sm font-semibold text-gray-900`}>
                      {student.studentName}
                    </Text>
                    <Text style={tw`text-xs text-gray-500`}>
                      {student.studentId}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={tw`px-3 py-1 bg-blue-100 rounded-full`}
                    onPress={() =>
                      alert(`View all classes for ${student.studentName}`)
                    }
                  >
                    <Text style={tw`text-blue-600 text-xs font-medium`}>
                      View All
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Courses */}
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course, idx) => (
                    <View key={idx} style={tw`border-t border-gray-200 pt-2 mt-2`}>
                      <Text
                        style={tw`text-sm font-semibold text-gray-900`}
                      >{`${course.code} — ${course.name}`}</Text>

                      <View style={tw`mt-1`}>
                        <View style={tw`flex-row items-center`}>
                          <Feather name="clock" size={12} color="#6b7280" />
                          <Text style={tw`text-xs text-gray-600 ml-1`}>
                            {course.time}
                          </Text>
                        </View>

                        <View style={tw`flex-row items-center mt-1`}>
                          <Entypo name="location-pin" size={13} color="#6b7280" />
                          <Text style={tw`text-xs text-gray-600 ml-1`}>
                            {course.room}
                          </Text>
                        </View>

                        <View style={tw`flex-row items-center mt-1`}>
                          <FontAwesome5
                            name="user-graduate"
                            size={11}
                            color="#6b7280"
                          />
                          <Text style={tw`text-xs text-gray-600 ml-1`}>
                            {course.instructor}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={tw`py-3 items-center`}>
                    <Text style={tw`text-gray-400 text-xs`}>
                      No classes scheduled for {selectedDay}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
