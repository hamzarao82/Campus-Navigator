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
import { useUserAdmin } from "../../hooks/useUserAdmin";
import { UserPermissionCard } from "../../components/ui/molecules/UserPermissionCard";
import { UserFormsModal } from "../../components/ui/organisms/UserFormsModal";
import { AdminUserData } from "../../types/userAdmin";

export default function UserPermissionsScreen() {
  const {
    users,
    loading,
    refreshing,
    fetchUsers,
    addingUser,
    addUser,
    updatingUser,
    updateRole,
    deleteUser,
  } = useUserAdmin();

  // Add User Modal State
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addFormData, setAddFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student" as "student" | "faculty" | "admin",
  });

  // Edit User Modal State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUserData | null>(null);
  const [editRole, setEditRole] = useState<"student" | "faculty" | "admin">("student");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = async () => {
    if (!addFormData.fullName || !addFormData.email || !addFormData.password) {
      Alert.alert("Missing Fields", "Please fill all fields");
      return;
    }

    if (addFormData.password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters");
      return;
    }

    const success = await addUser(addFormData);
    if (success) {
      Alert.alert("Success", `User ${addFormData.fullName} added successfully!`);
      setAddFormData({ fullName: "", email: "", password: "", role: "student" });
      setAddModalVisible(false);
      fetchUsers();
    }
  };

  const handleEditUser = (user: AdminUserData) => {
    setSelectedUser(user);
    setEditRole(user.role);
    setEditModalVisible(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;

    const success = await updateRole(selectedUser.id, editRole);
    if (success) {
      Alert.alert("Success", "User role updated successfully!");
      setEditModalVisible(false);
      fetchUsers();
    }
  };

  const handleDeleteUser = async (user: AdminUserData) => {
    Alert.alert(
      "Delete User",
      `Are you sure you want to delete ${user.fullName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deleteUser(user.id);
            if (success) {
              Alert.alert("Success", "User deleted successfully");
              fetchUsers();
            }
          },
        },
      ]
    );
  };



  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between px-4 py-3`}>
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
            <UserPermissionCard
              key={user.id}
              user={user}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
            />
          ))}

          {users.length === 0 && (
            <View style={tw`items-center justify-center py-20`}>
              <Feather name="users" size={48} color="#9CA3AF" />
              <Text style={tw`text-gray-500 mt-4`}>No users found</Text>
            </View>
          )}
        </ScrollView>
      )}

      <UserFormsModal
        isAddModalVisible={addModalVisible}
        isEditModalVisible={editModalVisible}
        onCloseAddModal={() => setAddModalVisible(false)}
        onCloseEditModal={() => setEditModalVisible(false)}
        
        // Add User Form State
        addFormData={addFormData}
        setAddFormData={setAddFormData}
        onAddUser={handleAddUser}
        isAdding={addingUser}
        
        // Edit User Form State
        editingUser={selectedUser}
        editRole={editRole}
        setEditRole={setEditRole}
        onUpdateRole={handleUpdateRole}
        isUpdating={updatingUser}
      />
    </SafeAreaView>
  );
}
