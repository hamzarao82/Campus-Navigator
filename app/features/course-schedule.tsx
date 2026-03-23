import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { Feather } from "@expo/vector-icons";
import { Course } from "../../types/course";
import { useCourses } from "../../hooks/useCourses";
import { CourseCard } from "../../components/ui/molecules/CourseCard";
import { CourseFormCard } from "../../components/ui/organisms/CourseFormCard";
import { PageHeader } from "../../components/ui/molecules/PageHeader";
import { EmptyState } from "../../components/ui/molecules/EmptyState";
import { FormInput } from "../../components/ui/atoms/FormInput";

export default function CourseScheduleScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [newCourse, setNewCourse] = useState({
    code: "",
    name: "",
    instructor: "",
    schedule: "",
    location: "",
    capacity: "",
    enrolled: "",
  });

  const { courses, loading, addCourse, updateCourse, deleteCourse } = useCourses();

  const handleAddCourse = async () => {
    if (!newCourse.code || !newCourse.name || !newCourse.instructor) {
      Alert.alert("Missing Info", "Please fill in all required fields.");
      return;
    }

    const courseData = {
      code: newCourse.code,
      name: newCourse.name,
      instructor: newCourse.instructor,
      schedule: newCourse.schedule,
      location: newCourse.location,
      capacity: parseInt(newCourse.capacity as string) || 0,
      enrolled: parseInt(newCourse.enrolled as string) || 0,
      status: "Active",
    };

    const success = await addCourse(courseData);
    if (success) {
      Alert.alert("Success", "Course added successfully!");
      setNewCourse({ code: "", name: "", instructor: "", schedule: "", location: "", capacity: "", enrolled: "" });
      setIsAdding(false);
    }
  };

  const handleUpdateCourse = async () => {
    if (!editingCourse) return;

    const courseData = {
      code: editingCourse.code,
      name: editingCourse.name,
      instructor: editingCourse.instructor,
      schedule: editingCourse.schedule,
      location: editingCourse.location,
      capacity: typeof editingCourse.capacity === 'string' ? parseInt(editingCourse.capacity) : editingCourse.capacity,
      enrolled: typeof editingCourse.enrolled === 'string' ? parseInt(editingCourse.enrolled) : editingCourse.enrolled,
      status: editingCourse.status,
    };

    const success = await updateCourse(editingCourse.id, courseData);
    if (success) {
      Alert.alert("Success", "Course updated successfully!");
      setEditingCourse(null);
    }
  };

  const handleDeleteCourse = (id: string) => {
    Alert.alert("Confirm", "Are you sure you want to delete this course?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const success = await deleteCourse(id);
          if (success) {
            Alert.alert("Success", "Course deleted successfully!");
          }
        },
      },
    ]);
  };

  const filteredCourses = courses.filter(
    c =>
      c.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 bg-white items-center justify-center`}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={tw`mt-4 text-gray-600`}>Loading courses...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <PageHeader 
        title="Course Schedule" 
        rightActionIcon="add"
        onRightAction={() => setIsAdding(true)}
      />

      <ScrollView style={tw`px-6`} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <FormInput
          placeholder="Search courses..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={tw`mb-4 mt-2`}
        />

        {/* Add / Edit Form */}
        {(isAdding || editingCourse) && (
          <CourseFormCard
            editingCourse={editingCourse}
            newCourseForm={newCourse as any}
            setNewCourseForm={setNewCourse}
            setEditingCourse={setEditingCourse}
            onSubmit={editingCourse ? handleUpdateCourse : handleAddCourse}
            onCancel={() => {
               setIsAdding(false);
               setEditingCourse(null);
            }}
          />
        )}

        {/* Course List */}
        {filteredCourses.length === 0 ? (
          <EmptyState 
            iconName="book-outline"
            title="No courses found" 
          />
        ) : (
          filteredCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={(c: Course) => {
                setEditingCourse(c);
                setIsAdding(false);
              }}
              onDelete={handleDeleteCourse}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
