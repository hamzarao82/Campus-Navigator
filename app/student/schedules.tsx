import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather, Entypo, FontAwesome } from "@expo/vector-icons";
import tw from "twrnc";
import { useRouter } from "expo-router";
import tw from "twrnc";
import { useStudentEnrollment } from "../../hooks/useStudentEnrollment";
import { EnrollmentCourseCard } from "../../components/ui/molecules/EnrollmentCourseCard";
import { StudentCourseData } from "../../types/studentEnrollment";

export default function ScheduleScreen() {
  const router = useRouter();
  const { courses, enrolledCourseIds, loading, enrollCourse } = useStudentEnrollment();
  const [searchQuery, setSearchQuery] = useState("");

  const handleEnroll = async (course: StudentCourseData) => {
    await enrollCourse(course);
  };

  const handleGetDirections = (course: StudentCourseData) => {
    // Navigate to map with course location
    router.push({
      pathname: "/features/maps",
      params: {
        poiName: `${course.code} - ${course.location}`,
        // Default coordinates (could be enhanced with actual location data)
        poiLat: "33.6844",
        poiLng: "73.0479",
      },
    });
  };



  const filteredCourses = courses.filter(
    (c) =>
      c.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50 items-center justify-center`}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={tw`mt-4 text-gray-600`}>Loading available courses...</Text>
      </SafeAreaView>
    );
  }

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

      {/* Search Bar */}
      <View style={tw`px-6 mb-4`}>
        <View style={tw`flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm`}>
          <Feather name="search" size={18} color="#9CA3AF" />
          <TextInput
            style={tw`flex-1 ml-2 text-base text-gray-800`}
            placeholder="Search courses..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView style={tw`px-6`} showsVerticalScrollIndicator={false}>
        {filteredCourses.length === 0 ? (
          <View style={tw`items-center justify-center py-20`}>
            <Ionicons name="school-outline" size={60} color="#D1D5DB" />
            <Text style={tw`text-lg font-semibold text-gray-600 mt-4`}>
              No courses available
            </Text>
            <Text style={tw`text-sm text-gray-500 text-center mt-1`}>
              Check back later for new course offerings.
            </Text>
          </View>
        ) : (
          filteredCourses.map((course) => (
            <EnrollmentCourseCard
              key={course.id}
              course={course}
              isEnrolled={enrolledCourseIds.includes(course.id)}
              onEnroll={handleEnroll}
              onGetDirections={handleGetDirections}
            />
          ))
        )}

        {/* Bottom padding */}
        <View style={tw`h-6`} />
      </ScrollView>
    </SafeAreaView>
  );
}
