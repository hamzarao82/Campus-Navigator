import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Course } from '../types/course';

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

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

  const addCourse = async (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addDoc(collection(db, "courses"), {
        ...courseData,
        createdAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error("Error adding course:", error);
      Alert.alert("Error", "Failed to add course");
      return false;
    }
  };

  const updateCourse = async (id: string, courseData: Partial<Course>) => {
    try {
      const courseRef = doc(db, "courses", id);
      await updateDoc(courseRef, {
        ...courseData,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error("Error updating course:", error);
      Alert.alert("Error", "Failed to update course");
      return false;
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      await deleteDoc(doc(db, "courses", id));
      return true;
    } catch (error) {
      console.error("Error deleting course:", error);
      Alert.alert("Error", "Failed to delete course");
      return false;
    }
  };

  return {
    courses,
    loading,
    addCourse,
    updateCourse,
    deleteCourse
  };
}
