import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';
import { Card } from '../atoms/Card';
import { FormInput } from '../atoms/FormInput';
import { PrimaryButton } from '../atoms/PrimaryButton';
import { Course } from '../../../types/course';

interface CourseFormCardProps {
  editingCourse: Course | null;
  newCourseForm: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'status'>;
  setNewCourseForm: (course: any) => void;
  setEditingCourse: (course: any) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function CourseFormCard({
  editingCourse,
  newCourseForm,
  setNewCourseForm,
  setEditingCourse,
  onSubmit,
  onCancel
}: CourseFormCardProps) {
  
  const handleUpdateField = (field: string, text: string) => {
    if (editingCourse) {
      setEditingCourse({ ...editingCourse, [field]: text });
    } else {
      setNewCourseForm({ ...newCourseForm, [field]: text });
    }
  };

  const getFieldValue = (field: keyof typeof newCourseForm) => {
    const val = editingCourse ? editingCourse[field as keyof Course] : newCourseForm[field];
    return val !== undefined && val !== null ? String(val) : '';
  };

  return (
    <Card style={tw`mb-4`}>
      <Text style={tw`text-lg font-semibold text-center mb-4`}>
        {editingCourse ? "Edit Course" : "Add New Course"}
      </Text>

      {["code", "name", "instructor", "schedule", "location", "capacity", "enrolled"].map((field) => (
        <FormInput
          key={field}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={getFieldValue(field as any)}
          onChangeText={(text) => handleUpdateField(field, text)}
          keyboardType={["capacity", "enrolled"].includes(field) ? "numeric" : "default"}
          containerStyle={tw`mb-3`}
        />
      ))}

      <View style={tw`flex-row justify-around mt-2`}>
        <PrimaryButton
          onPress={onSubmit}
          title={editingCourse ? "Save Changes" : "Add Course"}
          style={tw`flex-1 mr-2 px-0`}
        />
        <PrimaryButton
          onPress={onCancel}
          title="Cancel"
          style={tw`flex-1 ml-2 px-0 bg-gray-400`}
        />
      </View>
    </Card>
  );
}
