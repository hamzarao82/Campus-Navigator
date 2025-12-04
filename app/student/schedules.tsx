import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather, Entypo, FontAwesome } from "@expo/vector-icons";
import tw from "twrnc";
import { router } from "expo-router";
import { db, auth } from "@/firebaseConfig";
import { collection, onSnapshot, doc, updateDoc, arrayUnion, getDoc, setDoc, increment } from "firebase/firestore";

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
  enrolledStudents?: string[];
}

export default function ScheduleScreen() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const currentUserId = auth.currentUser?.uid || "anonymous";

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

  // Fetch user's enrolled courses
  useEffect(() => {
    if (!currentUserId || currentUserId === "anonymous") return;

    const fetchEnrollments = async () => {
      try {
        const userEnrollmentsRef = doc(db, "enrollments", currentUserId);
        const enrollmentsSnap = await getDoc(userEnrollmentsRef);

        if (enrollmentsSnap.exists()) {
          setEnrolledCourseIds(enrollmentsSnap.data().courseIds || []);
        }
      } catch (error) {
        console.error("Error fetching enrollments:", error);
      }
    };

    fetchEnrollments();
  }, [currentUserId]);

  const handleEnroll = async (course: Course) => {
    if (!auth.currentUser) {
      Alert.alert("Login Required", "Please log in to enroll in courses.");
      return;
    }

    // Check if already enrolled
    if (enrolledCourseIds.includes(course.id)) {
      Alert.alert("Already Enrolled", "You are already enrolled in this course.");
      return;
    }

    // Check if course is full
    if (course.enrolled >= course.capacity) {
      Alert.alert("Course Full", "This course has reached its maximum capacity.");
      return;
    }

    Alert.alert(
      "Confirm Enrollment",
      `Do you want to enroll in ${course.code} - ${course.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Enroll",
          onPress: async () => {
            try {
              // Update course enrolled count
              const courseRef = doc(db, "courses", course.id);
              await updateDoc(courseRef, {
                enrolled: increment(1),
                enrolledStudents: arrayUnion(currentUserId),
              });

              // Save to user's enrollments
              const userEnrollmentsRef = doc(db, "enrollments", currentUserId);
              await setDoc(userEnrollmentsRef, {
                courseIds: arrayUnion(course.id),
                userId: currentUserId,
              }, { merge: true });

              // Update local state
              setEnrolledCourseIds([...enrolledCourseIds, course.id]);

              Alert.alert("Success", `You have enrolled in ${course.code}!`);
            } catch (error) {
              console.error("Error enrolling:", error);
              Alert.alert("Error", "Failed to enroll. Please try again.");
            }
          },
        },
      ]
    );
  };

  const handleGetDirections = (course: Course) => {
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
          filteredCourses.map((course) => {
            const isEnrolled = enrolledCourseIds.includes(course.id);
            const isFull = course.enrolled >= course.capacity;

            return (
              <View
                key={course.id}
                style={tw`bg-white p-4 mb-4 rounded-2xl shadow-sm ${isEnrolled ? 'border-2 border-green-500' : ''}`}
              >
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
                    <Text
                      style={[tw`text-lg font-semibold text-gray-900`, { flexShrink: 1, flexWrap: 'wrap' }]}
                    >
                      {course.name}
                    </Text>
                    <Text style={tw`text-sm text-gray-500`}>{course.code}</Text>
                  </View>

                  {/* Right side: Status badge */}
                  {!isEnrolled && (
                    <View style={tw`px-3 py-1 rounded-full ${getStatusColor(course.status)}`}>
                      <Text style={tw`text-xs font-medium capitalize`}>
                        {course.status}
                      </Text>
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
                        tw`h-2 rounded-full ${getProgressColor(
                          course.enrolled || 0,
                          course.capacity || 1
                        )}`,
                        { width: `${Math.min(((course.enrolled || 0) / (course.capacity || 1)) * 100, 100)}%` }
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
                      onPress={() => !isFull && handleEnroll(course)}
                      disabled={isFull}
                    >
                      <Text style={tw`text-white text-sm font-semibold`}>
                        {isFull ? "Course Full" : "Enroll Now"}
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={tw`flex-1 bg-blue-100 py-3 rounded-xl items-center flex-row justify-center`}
                    onPress={() => handleGetDirections(course)}
                  >
                    <Ionicons name="navigate" size={16} color="#2563EB" />
                    <Text style={tw`text-blue-600 text-sm font-semibold ml-1`}>
                      Directions
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}

        {/* Bottom padding */}
        <View style={tw`h-6`} />
      </ScrollView>
    </SafeAreaView>
  );
}
