import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, updateDoc, getDoc, setDoc, increment, arrayUnion } from "firebase/firestore";
import { Alert } from "react-native";
import { db, auth } from "../firebaseConfig";
import { StudentCourseData } from "../types/studentEnrollment";

export function useStudentEnrollment() {
  const [courses, setCourses] = useState<StudentCourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const currentUserId = auth.currentUser?.uid || "anonymous";

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "courses"),
      (snapshot) => {
        const coursesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as StudentCourseData[];
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

  const enrollCourse = async (course: StudentCourseData) => {
    if (!auth.currentUser) {
      Alert.alert("Login Required", "Please log in to enroll in courses.");
      return false;
    }

    if (enrolledCourseIds.includes(course.id)) {
      Alert.alert("Already Enrolled", "You are already enrolled in this course.");
      return false;
    }

    if (course.enrolled >= course.capacity) {
      Alert.alert("Course Full", "This course has reached its maximum capacity.");
      return false;
    }

    return new Promise((resolve) => {
      Alert.alert(
        "Confirm Enrollment",
        `Do you want to enroll in ${course.code} - ${course.name}?`,
        [
          { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
          {
            text: "Enroll",
            onPress: async () => {
              try {
                const courseRef = doc(db, "courses", course.id);
                await updateDoc(courseRef, {
                  enrolled: increment(1),
                  enrolledStudents: arrayUnion(currentUserId),
                });

                const userEnrollmentsRef = doc(db, "enrollments", currentUserId);
                await setDoc(userEnrollmentsRef, {
                  courseIds: arrayUnion(course.id),
                  userId: currentUserId,
                }, { merge: true });

                setEnrolledCourseIds((prev) => [...prev, course.id]);
                Alert.alert("Success", `You have enrolled in ${course.code}!`);
                resolve(true);
              } catch (error) {
                console.error("Error enrolling:", error);
                Alert.alert("Error", "Failed to enroll. Please try again.");
                resolve(false);
              }
            },
          },
        ]
      );
    });
  };

  return {
    courses,
    enrolledCourseIds,
    loading,
    enrollCourse,
  };
}
