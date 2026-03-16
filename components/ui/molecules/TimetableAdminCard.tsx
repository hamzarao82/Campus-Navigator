import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { Feather, Entypo, FontAwesome5 } from "@expo/vector-icons";

export interface CourseSchedule {
  code: string;
  name: string;
  day: string;
  time: string;
  room: string;
  instructor: string;
}

export interface StudentTimetable {
  id: number;
  studentName: string;
  studentId: string;
  courses: CourseSchedule[];
}

interface TimetableAdminCardProps {
  student: StudentTimetable;
  selectedDay: string;
  onViewAll: (student: StudentTimetable) => void;
}

export const TimetableAdminCard: React.FC<TimetableAdminCardProps> = ({
  student,
  selectedDay,
  onViewAll,
}) => {
  const filteredCourses = student.courses.filter((c) => c.day === selectedDay);

  return (
    <View style={tw`bg-white rounded-2xl border border-gray-100 p-3 mb-3`}>
      {/* Student Header */}
      <View style={tw`flex-row justify-between items-center mb-2`}>
        <View>
          <Text style={tw`text-sm font-semibold text-gray-900`}>
            {student.studentName}
          </Text>
          <Text style={tw`text-xs text-gray-500`}>{student.studentId}</Text>
        </View>

        <TouchableOpacity
          style={tw`px-3 py-1 bg-blue-100 rounded-full`}
          onPress={() => onViewAll(student)}
        >
          <Text style={tw`text-blue-600 text-xs font-medium`}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Courses */}
      {filteredCourses.length > 0 ? (
        filteredCourses.map((course, idx) => (
          <View key={idx} style={tw`border-t border-gray-200 pt-2 mt-2`}>
            <Text style={tw`text-sm font-semibold text-gray-900`}>
              {course.code} — {course.name}
            </Text>

            <View style={tw`mt-1`}>
              <View style={tw`flex-row items-center`}>
                <Feather name="clock" size={12} color="#6b7280" />
                <Text style={tw`text-xs text-gray-600 ml-1`}>{course.time}</Text>
              </View>

              <View style={tw`flex-row items-center mt-1`}>
                <Entypo name="location-pin" size={13} color="#6b7280" />
                <Text style={tw`text-xs text-gray-600 ml-1`}>{course.room}</Text>
              </View>

              <View style={tw`flex-row items-center mt-1`}>
                <FontAwesome5 name="user-graduate" size={11} color="#6b7280" />
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
};
