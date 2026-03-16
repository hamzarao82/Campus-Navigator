import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather, Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { StudentCourseData } from "../../../types/studentEnrollment";

interface EnrollmentCourseCardProps {
  course: StudentCourseData;
  isEnrolled: boolean;
  onEnroll: (course: StudentCourseData) => void;
  onGetDirections: (course: StudentCourseData) => void;
}

export const EnrollmentCourseCard: React.FC<EnrollmentCourseCardProps> = ({
  course,
  isEnrolled,
  onEnroll,
  onGetDirections,
}) => {
  const isFull = course.enrolled >= course.capacity;

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
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

  const enrolledProgress = Math.min(((course.enrolled || 0) / (course.capacity || 1)) * 100, 100);

  return (
    <View style={tw`bg-white p-4 mb-4 rounded-2xl shadow-sm ${isEnrolled ? 'border-2 border-green-500' : ''}`}>
      {/* Enrolled Badge */}
      {isEnrolled && (
        <View style={tw`absolute top-3 right-3 bg-green-500 px-2 py-1 rounded-full`}>
          <Text style={tw`text-white text-xs font-bold`}>✓ Enrolled</Text>
        </View>
      )}

      {/* Header */}
      <View style={tw`flex-row justify-between items-start mb-3 flex-wrap pr-16`}>
        {/* Left side: Course name & code */}
        <View style={tw`flex-1 pr-3`}>
          <Text style={[tw`text-lg font-semibold text-gray-900`, { flexShrink: 1, flexWrap: 'wrap' }]}>
            {course.name}
          </Text>
          <Text style={tw`text-sm text-gray-500`}>{course.code}</Text>
        </View>

        {/* Right side: Status badge */}
        {!isEnrolled && (
          <View style={tw`px-3 py-1 rounded-full ${getStatusColor(course.status)}`}>
            <Text style={tw`text-xs font-medium capitalize`}>{course.status}</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={tw`mb-4`}>
        <View style={tw`flex-row items-center mb-2`}>
          <Feather name="clock" size={16} color="#6b7280" />
          <Text style={tw`ml-2 text-gray-600 text-sm`}>
            {course.schedule || "Schedule TBD"}
          </Text>
        </View>
        <View style={tw`flex-row items-center mb-2`}>
          <Entypo name="location-pin" size={18} color="#6b7280" />
          <Text style={tw`ml-1 text-gray-600 text-sm`}>
            {course.location || "Location TBD"}
          </Text>
        </View>
        <View style={tw`flex-row items-center`}>
          <FontAwesome name="user" size={16} color="#6b7280" />
          <Text style={tw`ml-2 text-gray-600 text-sm`}>
            {course.instructor || "Instructor TBD"}
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
            style={[
              tw`h-2 rounded-full ${getProgressColor(course.enrolled || 0, course.capacity || 1)}`,
              { width: `${enrolledProgress}%` }
            ]}
          />
        </View>
        <Text
          style={tw`text-right text-sm font-medium ${(course.enrolled || 0) / (course.capacity || 1) >= 0.9
            ? "text-red-600"
            : (course.enrolled || 0) / (course.capacity || 1) >= 0.7
              ? "text-yellow-600"
              : "text-green-600"
            }`}
        >
          {course.enrolled || 0}/{course.capacity || 0} Enrolled
        </Text>
      </View>

      {/* Buttons */}
      <View style={tw`flex-row gap-3`}>
        {isEnrolled ? (
          <View style={tw`flex-1 bg-green-100 py-3 rounded-xl items-center`}>
            <Text style={tw`text-green-700 text-sm font-semibold`}>
              ✓ Already Enrolled
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={tw`flex-1 ${isFull ? 'bg-gray-400' : 'bg-blue-600'} py-3 rounded-xl items-center`}
            onPress={() => !isFull && onEnroll(course)}
            disabled={isFull}
          >
            <Text style={tw`text-white text-sm font-semibold`}>
              {isFull ? "Course Full" : "Enroll Now"}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={tw`flex-1 bg-blue-100 py-3 rounded-xl items-center flex-row justify-center`}
          onPress={() => onGetDirections(course)}
        >
          <Ionicons name="navigate" size={16} color="#2563EB" />
          <Text style={tw`text-blue-600 text-sm font-semibold ml-1`}>
            Directions
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
