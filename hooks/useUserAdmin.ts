import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { collection, getDocs, doc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { AdminUserData } from "../types/userAdmin";

export function useUserAdmin() {
  const [users, setUsers] = useState<AdminUserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [addingUser, setAddingUser] = useState(false);
  const [updatingUser, setUpdatingUser] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);

      const usersData: AdminUserData[] = [];
      querySnapshot.forEach((doc) => {
        usersData.push({
          id: doc.id,
          ...doc.data(),
        } as AdminUserData);
      });

      // Sort by role: admin, faculty, student
      usersData.sort((a, b) => {
        const roleOrder = { admin: 0, faculty: 1, student: 2 };
        return roleOrder[a.role] - roleOrder[b.role];
      });

      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      Alert.alert("Error", "Failed to fetch users");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const addUser = async (userData: any) => {
    try {
      setAddingUser(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        userId: user.uid,
        fullName: userData.fullName,
        email: userData.email,
        role: userData.role,
        createdAt: new Date().toISOString(),
      });

      return true;
    } catch (error: any) {
      console.error("Error adding user:", error);
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Error", "Email already exists");
      } else {
        Alert.alert("Error", error.message || "Failed to add user");
      }
      return false;
    } finally {
      setAddingUser(false);
    }
  };

  const updateRole = async (userId: string, newRole: "student" | "faculty" | "admin") => {
    try {
      setUpdatingUser(true);
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { role: newRole });
      return true;
    } catch (error: any) {
      console.error("Error updating user:", error);
      Alert.alert("Error", `Failed to update user role: ${error.message || "Unknown error"}`);
      return false;
    } finally {
      setUpdatingUser(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      return true;
    } catch (error: any) {
      console.error("Error deleting user:", error);
      Alert.alert("Error", `Failed to delete user: ${error.message || "Unknown error"}`);
      return false;
    }
  };

  return {
    users,
    loading,
    refreshing,
    setRefreshing,
    fetchUsers,
    addingUser,
    addUser,
    updatingUser,
    updateRole,
    deleteUser,
  };
}
