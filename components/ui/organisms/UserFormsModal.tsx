import React from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, ActivityIndicator } from "react-native";
import tw from "twrnc";
import { AdminUserData } from "../../../types/userAdmin";

interface UserFormsModalProps {
  isAddModalVisible: boolean;
  isEditModalVisible: boolean;
  onCloseAddModal: () => void;
  onCloseEditModal: () => void;
  
  // Add Form Props
  addFormData: any;
  setAddFormData: (data: any) => void;
  onAddUser: () => void;
  isAdding: boolean;

  // Edit Form Props
  editingUser: AdminUserData | null;
  editRole: "student" | "faculty" | "admin";
  setEditRole: (role: "student" | "faculty" | "admin") => void;
  onUpdateRole: () => void;
  isUpdating: boolean;
}

export const UserFormsModal: React.FC<UserFormsModalProps> = ({
  isAddModalVisible,
  isEditModalVisible,
  onCloseAddModal,
  onCloseEditModal,
  addFormData,
  setAddFormData,
  onAddUser,
  isAdding,
  editingUser,
  editRole,
  setEditRole,
  onUpdateRole,
  isUpdating,
}) => {
  return (
    <>
      {/* Add User Modal */}
      <Modal
        visible={isAddModalVisible}
        transparent
        animationType="slide"
        onRequestClose={onCloseAddModal}
      >
        <View style={tw`flex-1 justify-end bg-black/50`}>
          <View style={tw`bg-white rounded-t-3xl p-6`}>
            <Text style={tw`text-2xl font-bold text-gray-900 mb-4`}>Add New User</Text>

            <TextInput
              style={tw`bg-gray-100 rounded-xl px-4 py-3 mb-3`}
              placeholder="Full Name"
              value={addFormData.fullName}
              onChangeText={(text) => setAddFormData({ ...addFormData, fullName: text })}
            />

            <TextInput
              style={tw`bg-gray-100 rounded-xl px-4 py-3 mb-3`}
              placeholder="Email"
              value={addFormData.email}
              onChangeText={(text) => setAddFormData({ ...addFormData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={tw`bg-gray-100 rounded-xl px-4 py-3 mb-3`}
              placeholder="Password (min 6 characters)"
              value={addFormData.password}
              onChangeText={(text) => setAddFormData({ ...addFormData, password: text })}
              secureTextEntry
            />

            <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>Select Role:</Text>
            <View style={tw`flex-row gap-2 mb-4`}>
              {(["student", "faculty", "admin"] as const).map((role) => (
                <TouchableOpacity
                  key={role}
                  style={tw`flex-1 py-3 rounded-xl ${addFormData.role === role ? "bg-blue-600" : "bg-gray-100"}`}
                  onPress={() => setAddFormData({ ...addFormData, role })}
                >
                  <Text style={tw`text-center font-medium capitalize ${addFormData.role === role ? "text-white" : "text-gray-700"}`}>
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={tw`flex-row gap-3`}>
              <TouchableOpacity
                style={tw`flex-1 bg-gray-200 py-3 rounded-xl`}
                onPress={onCloseAddModal}
              >
                <Text style={tw`text-center text-gray-700 font-medium`}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`flex-1 bg-blue-600 py-3 rounded-xl`}
                onPress={onAddUser}
                disabled={isAdding}
              >
                {isAdding ? <ActivityIndicator color="#fff" /> : <Text style={tw`text-center text-white font-medium`}>Add User</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Role Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="fade"
        onRequestClose={onCloseEditModal}
      >
        <View style={tw`flex-1 justify-center items-center bg-black/50`}>
          <View style={tw`bg-white rounded-2xl p-6 w-80`}>
            <Text style={tw`text-xl font-bold text-gray-900 mb-4`}>Edit User Role</Text>

            <Text style={tw`text-gray-600 mb-4`}>{editingUser?.fullName}</Text>

            <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>Select New Role:</Text>
            <View style={tw`gap-2 mb-4`}>
              {(["student", "faculty", "admin"] as const).map((role) => (
                <TouchableOpacity
                  key={role}
                  style={tw`py-3 rounded-xl ${editRole === role ? "bg-blue-600" : "bg-gray-100"}`}
                  onPress={() => setEditRole(role)}
                >
                  <Text style={tw`text-center font-medium capitalize ${editRole === role ? "text-white" : "text-gray-700"}`}>
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={tw`flex-row gap-3`}>
              <TouchableOpacity
                style={tw`flex-1 bg-gray-200 py-3 rounded-xl`}
                onPress={onCloseEditModal}
              >
                <Text style={tw`text-center text-gray-700 font-medium`}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={tw`flex-1 bg-blue-600 py-3 rounded-xl`}
                onPress={onUpdateRole}
                disabled={isUpdating}
              >
                {isUpdating ? <ActivityIndicator color="#fff" /> : <Text style={tw`text-center text-white font-medium`}>Update</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};
