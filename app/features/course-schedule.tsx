import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { router } from "expo-router";

export default function CourseScheduleScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [newCourse, setNewCourse] = useState({
    code: "",
    name: "",
    instructor: "",
    schedule: "",
    location: "",
    capacity: "",
    enrolled: "",
  });

  // Mock data
  const [courses, setCourses] = useState([
    {
      id: "1",
      code: "CS101",
      name: "Introduction to Computer Science",
      instructor: "Dr. Ali",
      schedule: "Mon, Wed 10:00 AM",
      location: "Room 201",
      capacity: 50,
      enrolled: 40,
      status: "Active",
    },
    {
      id: "2",
      code: "MTH203",
      name: "Calculus II",
      instructor: "Prof. Sara",
      schedule: "Tue, Thu 2:00 PM",
      location: "Room 305",
      capacity: 40,
      enrolled: 35,
      status: "Pending",
    },
  ]);

  const handleAddCourse = () => {
    if (!newCourse.code || !newCourse.name || !newCourse.instructor) {
      Alert.alert("Missing Info", "Please fill in all fields.");
      return;
    }
    setCourses([
      ...courses,
      { id: Date.now().toString(), ...newCourse, capacity: +newCourse.capacity, enrolled: +newCourse.enrolled, status: "Pending" },
    ]);
    setNewCourse({ code: "", name: "", instructor: "", schedule: "", location: "", capacity: "", enrolled: "" });
    setIsAdding(false);
  };

  const handleUpdateCourse = () => {
    if (!editingCourse) return;
    setCourses(courses.map(c => (c.id === editingCourse.id ? editingCourse : c)));
    setEditingCourse(null);
  };

  const handleDeleteCourse = (id: string) => {
    Alert.alert("Confirm", "Are you sure you want to delete?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: () => setCourses(courses.filter(c => c.id !== id)) },
    ]);
  };

  const filteredCourses = courses.filter(
    c =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`flex-row justify-between items-center px-6 py-4`}>
        <TouchableOpacity style={tw`p-2 bg-gray-100 rounded-full`}
        onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="black" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold text-black`}>Course Schedule</Text>
        <TouchableOpacity onPress={() => setIsAdding(true)} style={tw`p-2 bg-gray-100 rounded-full`}>
          <Ionicons name="add" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView style={tw`px-6`} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={tw`mb-4`}>
          <TextInput
            style={tw`bg-gray-100 rounded-xl px-4 py-3 text-base text-black`}
            placeholder="Search courses..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#888"
          />
        </View>

        {/* Add / Edit Form */}
        {(isAdding || editingCourse) && (
          <View style={tw`bg-white rounded-2xl p-4 mb-4 shadow`}>
            <Text style={tw`text-lg font-semibold text-center mb-4`}>
              {editingCourse ? "Edit Course" : "Add New Course"}
            </Text>

            {["code", "name", "instructor", "schedule", "location", "capacity", "enrolled"].map(field => (
              <TextInput
                key={field}
                style={tw`bg-gray-100 rounded-xl px-4 py-3 mb-3 text-black`}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={(editingCourse ? editingCourse[field] : newCourse[field]).toString()}
                onChangeText={text =>
                  editingCourse
                    ? setEditingCourse({ ...editingCourse, [field]: text })
                    : setNewCourse({ ...newCourse, [field]: text })
                }
                keyboardType={["capacity", "enrolled"].includes(field) ? "numeric" : "default"}
              />
            ))}

            <View style={tw`flex-row justify-around mt-2`}>
              <TouchableOpacity
                onPress={editingCourse ? handleUpdateCourse : handleAddCourse}
                style={tw`bg-blue-500 px-6 py-3 rounded-xl`}
              >
                <Text style={tw`text-white font-semibold`}>
                  {editingCourse ? "Save Changes" : "Add Course"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsAdding(false);
                  setEditingCourse(null);
                }}
                style={tw`bg-gray-400 px-6 py-3 rounded-xl`}
              >
                <Text style={tw`text-white font-semibold`}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Course List */}
        {filteredCourses.length === 0 ? (
          <View style={tw`py-12 items-center`}>
            <Text style={tw`text-gray-500`}>No courses found</Text>
          </View>
        ) : (
          filteredCourses.map(course => (
            <View key={course.id} style={tw`bg-white rounded-2xl p-4 mb-4 shadow`}>
              <View style={tw`flex-row justify-between items-start mb-3`}>
                <View>
                  <Text style={tw`text-lg font-semibold text-black`}>{course.code}</Text>
                  <Text style={tw`text-sm text-gray-600`}>{course.name}</Text>
                </View>
                <View
                  style={tw`px-3 py-1 rounded-full`}
                  className={`bg-${course.status === "Active" ? "green" : "yellow"}-100`}
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
                  onPress={() => {
                    setEditingCourse(course);
                    setIsAdding(false);
                  }}
                  style={tw`flex-row items-center px-4 py-2 bg-blue-100 rounded-xl`}
                >
                  <Feather name="edit-2" size={18} color="#2563eb" />
                  <Text style={tw`ml-2 text-blue-600 font-semibold`}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDeleteCourse(course.id)}
                  style={tw`flex-row items-center px-4 py-2 bg-red-100 rounded-xl`}
                >
                  <Feather name="trash-2" size={18} color="#dc2626" />
                  <Text style={tw`ml-2 text-red-600 font-semibold`}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
