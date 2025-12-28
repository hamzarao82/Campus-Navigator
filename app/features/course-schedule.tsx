import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { db } from "../../firebaseConfig";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, serverTimestamp } from "firebase/firestore";

interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  schedule: string;
  location: string;
  capacity: number;
  enrolled: number;
  status: string;
}

export default function CourseScheduleScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [newCourse, setNewCourse] = useState({
    code: "",
    name: "",
    instructor: "",
    schedule: "",
    location: "",
    capacity: "",
    enrolled: "",
  });

  // Firebase data
  const [courses, setCourses] = useState<Course[]>([]);

  // Fetch courses from Firebase in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "courses"),
      (snapshot) => {
        const coursesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Course[];
        setCourses(coursesData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching courses:", error);
        Alert.alert("Error", "Failed to load courses");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleAddCourse = async () => {
    if (!newCourse.code || !newCourse.name || !newCourse.instructor) {
      Alert.alert("Missing Info", "Please fill in all required fields.");
      return;
    }

    try {
      const courseData = {
        code: newCourse.code,
        name: newCourse.name,
        instructor: newCourse.instructor,
        schedule: newCourse.schedule,
        location: newCourse.location,
        capacity: parseInt(newCourse.capacity) || 0,
        enrolled: parseInt(newCourse.enrolled) || 0,
        status: "Active",
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "courses"), courseData);
      Alert.alert("Success", "Course added successfully!");
      setNewCourse({ code: "", name: "", instructor: "", schedule: "", location: "", capacity: "", enrolled: "" });
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding course:", error);
      Alert.alert("Error", "Failed to add course");
    }
  };

  const handleUpdateCourse = async () => {
    if (!editingCourse) return;

    try {
      const courseRef = doc(db, "courses", editingCourse.id);
      await updateDoc(courseRef, {
        code: editingCourse.code,
        name: editingCourse.name,
        instructor: editingCourse.instructor,
        schedule: editingCourse.schedule,
        location: editingCourse.location,
        capacity: typeof editingCourse.capacity === 'string' ? parseInt(editingCourse.capacity) : editingCourse.capacity,
        enrolled: typeof editingCourse.enrolled === 'string' ? parseInt(editingCourse.enrolled) : editingCourse.enrolled,
        status: editingCourse.status,
        updatedAt: serverTimestamp(),
      });
      Alert.alert("Success", "Course updated successfully!");
      setEditingCourse(null);
    } catch (error) {
      console.error("Error updating course:", error);
      Alert.alert("Error", "Failed to update course");
    }
  };

  const handleDeleteCourse = (id: string) => {
    Alert.alert("Confirm", "Are you sure you want to delete this course?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "courses", id));
            Alert.alert("Success", "Course deleted successfully!");
          } catch (error) {
            console.error("Error deleting course:", error);
            Alert.alert("Error", "Failed to delete course");
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
                placeholderTextColor="#888"
                value={(editingCourse ? editingCourse[field as keyof typeof editingCourse] : newCourse[field as keyof typeof newCourse]).toString()}
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
