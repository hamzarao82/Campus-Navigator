import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather, Entypo, FontAwesome } from "@expo/vector-icons";
import tw from "twrnc";
import { router } from "expo-router";

export default function ScheduleScreen() {
  const courses = [
    {
      id: "1",
      code: "CS101",
      name: "Introduction to Computer Science",
      instructor: "Dr. Sarah Khan",
      schedule: "Mon & Wed, 10:00 AM - 11:30 AM",
      location: "Room A-201",
      capacity: 50,
      enrolled: 38,
      status: "Active",
    },
    {
      id: "2",
      code: "EE204",
      name: "Electrical Circuits II",
      instructor: "Prof. Ahmed Raza",
      schedule: "Tue & Thu, 12:00 PM - 1:30 PM",
      location: "Room B-305",
      capacity: 40,
      enrolled: 40,
      status: "Pending",
    },
    {
      id: "3",
      code: "MATH301",
      name: "Linear Algebra",
      instructor: "Dr. Hina Malik",
      schedule: "Fri, 2:00 PM - 4:00 PM",
      location: "Room C-102",
      capacity: 60,
      enrolled: 15,
      status: "Archived",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "archived":
        return "bg-gray-200 text-gray-600";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getProgressColor = (enrolled: number, capacity: number) => {
    const ratio = enrolled / capacity;
    if (ratio >= 0.9) return "bg-red-500";
    if (ratio >= 0.7) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-gray-50`}>
      {/* Header */}
      <View style={tw`flex-row items-center px-6 py-4`}>
        <TouchableOpacity
          style={tw`w-10 h-10 rounded-full bg-transparent items-center justify-center mr-3`}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={tw`text-2xl font-bold text-gray-900`}>Available Courses</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={tw`px-6`} showsVerticalScrollIndicator={false}>
        {courses.map((course) => (
          <View
            key={course.id}
            style={tw`bg-white p-4 mb-4 rounded-2xl shadow-sm`}
          >
            {/* Header */}
           <View style={tw`flex-row justify-between items-start mb-3 flex-wrap`}>
  {/* Left side: Course name & code */}
  <View style={tw`flex-1 pr-3`}>
    <Text
      style={[tw`text-lg font-semibold text-gray-900`, { flexShrink: 1, flexWrap: 'wrap' }]}
    >
      {course.name}
    </Text>
    <Text style={tw`text-sm text-gray-500`}>{course.code}</Text>
  </View>

  {/* Right side: Status badge */}
  <View style={tw`px-3 py-1 rounded-full ${getStatusColor(course.status)}`}>
  <Text style={tw`text-xs font-medium capitalize`}>
    {course.status}
  </Text>
</View>
</View>

            {/* Info */}
            <View style={tw`mb-4`}>
              <View style={tw`flex-row items-center mb-2`}>
                <Feather name="clock" size={16} color="#6b7280" />
                <Text style={tw`ml-2 text-gray-600 text-sm`}>
                  {course.schedule}
                </Text>
              </View>
              <View style={tw`flex-row items-center mb-2`}>
                <Entypo name="location-pin" size={18} color="#6b7280" />
                <Text style={tw`ml-1 text-gray-600 text-sm`}>
                  {course.location}
                </Text>
              </View>
              <View style={tw`flex-row items-center`}>
                <FontAwesome name="user" size={16} color="#6b7280" />
                <Text style={tw`ml-2 text-gray-600 text-sm`}>
                  {course.instructor}
                </Text>
              </View>
            </View>

            {/* Enrollment Progress */}
            <View style={tw`mb-4`}>
              <Text style={tw`text-sm font-medium text-gray-800 mb-1`}>
                Enrollment Progress
              </Text>
              <View style={tw`h-2 bg-gray-200 rounded-full mb-2`}>
                <View
                  style={tw`h-2 rounded-full ${getProgressColor(
                    course.enrolled,
                    course.capacity
                  )}`}
                  width={`${(course.enrolled / course.capacity) * 100}%`}
                />
              </View>
              <Text
                style={tw`text-right text-sm font-medium ${
                  course.enrolled / course.capacity >= 0.9
                    ? "text-red-600"
                    : course.enrolled / course.capacity >= 0.7
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {course.enrolled}/{course.capacity} Enrolled
              </Text>
            </View>

            {/* Buttons */}
            <View style={tw`flex-row gap-3`}>
              <TouchableOpacity
                style={tw`flex-1 bg-blue-600 py-3 rounded-xl items-center`}
              >
                <Text style={tw`text-white text-sm font-semibold`}>Enroll</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`flex-1 bg-blue-100 py-3 rounded-xl items-center`}
              >
                <Text style={tw`text-blue-600 text-sm font-semibold`}>
                  Get Directions
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
