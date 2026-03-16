import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { Feather } from '@expo/vector-icons';
import { Card } from '../atoms/Card';
import { Course } from '../../../types/course';

interface CourseCardProps {
  course: Course;
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onEdit, onDelete }) => {
  return (
    <Card style={tw`mb-4 p-4`}>
      <View style={tw`flex-row justify-between items-start mb-3`}>
        <View>
          <Text style={tw`text-lg font-semibold text-black`}>{course.code}</Text>
          <Text style={tw`text-sm text-gray-600`}>{course.name}</Text>
        </View>
        <View
          style={[
            tw`px-3 py-1 rounded-full`,
            course.status === "Active" ? tw`bg-green-100` : tw`bg-yellow-100`
          ]}
        >
          <Text style={tw`text-xs text-gray-800`}>{course.status}</Text>
        </View>
      </View>

      <View style={tw`mb-3`}>
        <View style={tw`flex-row items-center mb-1`}>
          <Feather name="user" size={16} color="#666" />
          <Text style={tw`ml-2 text-gray-700`}>{course.instructor}</Text>
        </View>
        <View style={tw`flex-row items-center mb-1`}>
          <Feather name="clock" size={16} color="#666" />
          <Text style={tw`ml-2 text-gray-700`}>{course.schedule}</Text>
        </View>
        <View style={tw`flex-row items-center`}>
          <Feather name="map-pin" size={16} color="#666" />
          <Text style={tw`ml-2 text-gray-700`}>{course.location}</Text>
        </View>
      </View>

      {/* Enrollment Bar */}
      <View style={tw`mb-3`}>
        <Text style={tw`text-sm text-gray-700 mb-1`}>Enrollment</Text>
        <View style={tw`h-2 bg-gray-200 rounded-full`}>
          <View
            style={[
              tw`h-2 rounded-full bg-green-500`,
              { width: `${(course.enrolled / course.capacity) * 100}%` },
            ]}
          />
        </View>
        <Text style={tw`text-right text-gray-600 text-xs mt-1`}>
          {course.enrolled}/{course.capacity}
        </Text>
      </View>

      {/* Actions */}
      <View style={tw`flex-row justify-between`}>
        <TouchableOpacity
          onPress={() => onEdit(course)}
          style={tw`flex-row items-center px-4 py-2 bg-blue-100 rounded-xl`}
        >
          <Feather name="edit-2" size={18} color="#2563eb" />
          <Text style={tw`ml-2 text-blue-600 font-semibold`}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onDelete(course.id)}
          style={tw`flex-row items-center px-4 py-2 bg-red-100 rounded-xl`}
        >
          <Feather name="trash-2" size={18} color="#dc2626" />
          <Text style={tw`ml-2 text-red-600 font-semibold`}>Delete</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}
