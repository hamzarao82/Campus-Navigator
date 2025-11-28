import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import tw from "twrnc";
import { auth, db } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

interface User {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  role: "student" | "faculty" | "admin";
  createdAt: string;
}

export default function UserPermissionsScreen() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Add User Modal
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<"student" | "faculty" | "admin">("student");
  const [addingUser, setAddingUser] = useState(false);

  // Edit User Modal
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<"student" | "faculty" | "admin">("student");
  const [updatingUser, setUpdatingUser] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);

      const usersData: User[] = [];
      querySnapshot.forEach((doc) => {
        usersData.push({
          id: doc.id,
          ...doc.data(),
        } as User);
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
  };

  const handleAddUser = async () => {
    if (!newUserName || !newUserEmail || !newUserPassword) {
      Alert.alert("Missing Fields", "Please fill all fields");
      return;
    }

    if (newUserPassword.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters");
      return;
    }

    try {
      setAddingUser(true);

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newUserEmail,
        newUserPassword
      );
      const user = userCredential.user;

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        userId: user.uid,
        fullName: newUserName,
        email: newUserEmail,
        role: newUserRole,
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Success", `User ${newUserName} added successfully!`);

      // Reset form
      setNewUserName("");
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserRole("student");
      setAddModalVisible(false);

      // Refresh user list
      fetchUsers();
    } catch (error: any) {
      console.error("Error adding user:", error);
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Error", "Email already exists");
      } else {
        Alert.alert("Error", error.message || "Failed to add user");
      }
    } finally {
      setAddingUser(false);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditRole(user.role);
    setEditModalVisible(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;

    try {
      setUpdatingUser(true);

      // Update user role in Firestore using document ID
      const userRef = doc(db, "users", selectedUser.id);
      await updateDoc(userRef, {
        role: editRole,
      });

      Alert.alert("Success", "User role updated successfully!");
      setEditModalVisible(false);
      fetchUsers();
    } catch (error: any) {
      console.error("Error updating user:", error);
      Alert.alert("Error", `Failed to update user role: ${error.message || "Unknown error"}`);
    } finally {
      setUpdatingUser(false);
    }
  };

  const handleDeleteUser = async (user: User) => {
    Alert.alert(
      "Delete User",
      `Are you sure you want to delete ${user.fullName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // Use user.id which is the document ID
              await deleteDoc(doc(db, "users", user.id));
              Alert.alert("Success", "User deleted successfully");
              fetchUsers();
            } catch (error: any) {
              console.error("Error deleting user:", error);
              console.error("Error code:", error.code);
              console.error("Error message:", error.message);
              Alert.alert(
                "Error",
                `Failed to delete user: ${error.message || "Unknown error"}`
              );
            }
          },
        },
      ]
    );
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Ionicons name="shield-checkmark" size={20} color="#2563eb" />;
      case "faculty":
        return <Feather name="shield" size={20} color="#3b82f6" />;
      case "student":
        return <MaterialIcons name="person" size={20} color="#f59e0b" />;
      default:
        return null;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700";
      case "faculty":
        return "bg-blue-100 text-blue-700";
      case "student":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between px-4 py-3 border-b border-gray-200`}>
        <TouchableOpacity
          style={tw`w-10 h-10 rounded-full bg-gray-100 items-center justify-center`}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={22} color="#000" />
        </TouchableOpacity>

        <Text style={tw`text-xl font-semibold text-gray-900`}>
          User Management
        </Text>

        <TouchableOpacity
          style={tw`w-10 h-10 rounded-full bg-blue-100 items-center justify-center`}
          onPress={() => setAddModalVisible(true)}
        >
          <Feather name="plus" size={22} color="#2563eb" />
        </TouchableOpacity>
      </View>

      {/* User Count */}
      <View style={tw`px-4 py-3 bg-blue-50`}>
        <Text style={tw`text-sm text-blue-700`}>
          Total Users: {users.length} | Admins: {users.filter(u => u.role === "admin").length} |
          Faculty: {users.filter(u => u.role === "faculty").length} |
          Students: {users.filter(u => u.role === "student").length}
        </Text>
      </View>

      {/* User List */}
      {loading ? (
        <View style={tw`flex-1 items-center justify-center`}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={tw`text-gray-500 mt-4`}>Loading users...</Text>
        </View>
      ) : (
        <ScrollView
          style={tw`flex-1 px-4 py-2`}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchUsers();
              }}
            />
          }
        >
          {users.map((user) => (
            <View
              key={user.id}
              style={tw`bg-white rounded-2xl mb-4 p-4 shadow-md border border-gray-100`}
            >
              {/* Header */}
              <View style={tw`flex-row justify-between items-start mb-3`}>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-lg font-semibold text-gray-900`}>
                    {user.fullName}
                  </Text>
                  <Text style={tw`text-sm text-gray-500`}>{user.email}</Text>
                </View>

                <View style={tw`px-3 py-1 rounded-full ${getRoleBadgeColor(user.role)}`}>
                  <Text style={tw`text-xs font-medium capitalize`}>{user.role}</Text>
                </View>
              </View>

              {/* Role Icon */}
              <View style={tw`flex-row items-center mb-3`}>
                {getRoleIcon(user.role)}
                <Text style={tw`ml-2 text-sm text-gray-600`}>
                  {user.role === "admin" ? "Full Access" :
                    user.role === "faculty" ? "Can Manage Courses & POIs" :
                      "Student Access"}
                </Text>
              </View>

              {/* Created Date */}
              <Text style={tw`text-xs text-gray-400 mb-3`}>
                Created: {new Date(user.createdAt).toLocaleDateString()}
              </Text>

              {/* Action Buttons */}
              <View style={tw`flex-row gap-2`}>
                <TouchableOpacity
                  style={tw`flex-1 bg-blue-50 py-2 rounded-xl items-center`}
                  onPress={() => handleEditUser(user)}
                >
                  <Text style={tw`text-blue-600 text-sm font-medium`}>
                    Edit Role
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={tw`flex-1 bg-red-50 py-2 rounded-xl items-center`}
                  onPress={() => handleDeleteUser(user)}
                >
                  <Text style={tw`text-red-600 text-sm font-medium`}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {users.length === 0 && (
            <View style={tw`items-center justify-center py-20`}>
              <Feather name="users" size={48} color="#9CA3AF" />
              <Text style={tw`text-gray-500 mt-4`}>No users found</Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Add User Modal */}
      <Modal
        visible={addModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={tw`flex-1 justify-end bg-black/50`}>
          <View style={tw`bg-white rounded-t-3xl p-6`}>
            <Text style={tw`text-2xl font-bold text-gray-900 mb-4`}>
              Add New User
            </Text>

            <TextInput
              style={tw`bg-gray-100 rounded-xl px-4 py-3 mb-3`}
              placeholder="Full Name"
              value={newUserName}
              onChangeText={setNewUserName}
            />

            <TextInput
              style={tw`bg-gray-100 rounded-xl px-4 py-3 mb-3`}
              placeholder="Email"
              value={newUserEmail}
              onChangeText={setNewUserEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={tw`bg-gray-100 rounded-xl px-4 py-3 mb-3`}
              placeholder="Password (min 6 characters)"
              value={newUserPassword}
              onChangeText={setNewUserPassword}
              secureTextEntry
            />

            <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>
              Select Role:
            </Text>
            <View style={tw`flex-row gap-2 mb-4`}>
              {(["student", "faculty", "admin"] as const).map((role) => (
                <TouchableOpacity
                  key={role}
                  style={tw`flex-1 py-3 rounded-xl ${newUserRole === role ? "bg-blue-600" : "bg-gray-100"
                    }`}
                  onPress={() => setNewUserRole(role)}
                >
                  <Text
                    style={tw`text-center font-medium capitalize ${newUserRole === role ? "text-white" : "text-gray-700"
                      }`}
                  >
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={tw`flex-row gap-3`}>
              <TouchableOpacity
                style={tw`flex-1 bg-gray-200 py-3 rounded-xl`}
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={tw`text-center text-gray-700 font-medium`}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`flex-1 bg-blue-600 py-3 rounded-xl`}
                onPress={handleAddUser}
                disabled={addingUser}
              >
                {addingUser ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={tw`text-center text-white font-medium`}>
                    Add User
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Role Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black/50`}>
          <View style={tw`bg-white rounded-2xl p-6 w-80`}>
            <Text style={tw`text-xl font-bold text-gray-900 mb-4`}>
              Edit User Role
            </Text>

            <Text style={tw`text-gray-600 mb-4`}>
              {selectedUser?.fullName}
            </Text>

            <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>
              Select New Role:
            </Text>
            <View style={tw`gap-2 mb-4`}>
              {(["student", "faculty", "admin"] as const).map((role) => (
                <TouchableOpacity
                  key={role}
                  style={tw`py-3 rounded-xl ${editRole === role ? "bg-blue-600" : "bg-gray-100"
                    }`}
                  onPress={() => setEditRole(role)}
                >
                  <Text
                    style={tw`text-center font-medium capitalize ${editRole === role ? "text-white" : "text-gray-700"
                      }`}
                  >
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={tw`flex-row gap-3`}>
              <TouchableOpacity
                style={tw`flex-1 bg-gray-200 py-3 rounded-xl`}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={tw`text-center text-gray-700 font-medium`}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`flex-1 bg-blue-600 py-3 rounded-xl`}
                onPress={handleUpdateRole}
                disabled={updatingUser}
              >
                {updatingUser ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={tw`text-center text-white font-medium`}>
                    Update
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
