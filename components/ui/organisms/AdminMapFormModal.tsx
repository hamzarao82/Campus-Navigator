import React from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from "react-native";
import tw from "twrnc";
import { AdminMapData } from "../../../types/mapAdmin";

interface AdminMapFormModalProps {
  visible: boolean;
  editingMap: AdminMapData | null;
  formData: {
    name: string;
    description: string;
    status: string;
    type: string;
    image: string;
  };
  setFormData: (data: any) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export const AdminMapFormModal: React.FC<AdminMapFormModalProps> = ({
  visible,
  editingMap,
  formData,
  setFormData,
  onClose,
  onSubmit,
}) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
      >
        <View style={tw`bg-white rounded-2xl p-6 w-11/12 max-w-md`}>
          <Text style={tw`text-xl font-bold text-gray-900 mb-4`}>
            {editingMap ? "Edit Map" : "Add New Map"}
          </Text>

          <TextInput
            style={tw`bg-gray-100 rounded-xl px-4 py-3 mb-3 text-gray-900`}
            placeholder="Map Name *"
            placeholderTextColor="#999"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />

          <TextInput
            style={tw`bg-gray-100 rounded-xl px-4 py-3 mb-3 text-gray-900`}
            placeholder="Description *"
            placeholderTextColor="#999"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
            numberOfLines={3}
          />

          <TextInput
            style={tw`bg-gray-100 rounded-xl px-4 py-3 mb-3 text-gray-900`}
            placeholder="Image URL (optional)"
            placeholderTextColor="#999"
            value={formData.image}
            onChangeText={(text) => setFormData({ ...formData, image: text })}
          />

          {/* Type Selector */}
          <View style={tw`mb-3`}>
            <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>Map Type</Text>
            <View style={tw`flex-row gap-2`}>
              <TouchableOpacity
                style={tw`flex-1 py-3 rounded-xl ${formData.type === "Outdoor" ? "bg-orange-500" : "bg-gray-100"}`}
                onPress={() => setFormData({ ...formData, type: "Outdoor" })}
              >
                <Text style={tw`text-center font-semibold ${formData.type === "Outdoor" ? "text-white" : "text-gray-700"}`}>
                  Outdoor
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`flex-1 py-3 rounded-xl ${formData.type === "Indoor" ? "bg-blue-500" : "bg-gray-100"}`}
                onPress={() => setFormData({ ...formData, type: "Indoor" })}
              >
                <Text style={tw`text-center font-semibold ${formData.type === "Indoor" ? "text-white" : "text-gray-700"}`}>
                  Indoor
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Status Selector */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>Status</Text>
            <View style={tw`flex-row gap-2`}>
              <TouchableOpacity
                style={tw`flex-1 py-3 rounded-xl ${formData.status === "Active" ? "bg-green-500" : "bg-gray-100"}`}
                onPress={() => setFormData({ ...formData, status: "Active" })}
              >
                <Text style={tw`text-center font-semibold ${formData.status === "Active" ? "text-white" : "text-gray-700"}`}>
                  Active
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`flex-1 py-3 rounded-xl ${formData.status === "Pending" ? "bg-yellow-500" : "bg-gray-100"}`}
                onPress={() => setFormData({ ...formData, status: "Pending" })}
              >
                <Text style={tw`text-center font-semibold ${formData.status === "Pending" ? "text-white" : "text-gray-700"}`}>
                  Pending
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Buttons */}
          <View style={tw`flex-row gap-3`}>
            <TouchableOpacity
              style={tw`flex-1 bg-gray-200 py-3 rounded-xl`}
              onPress={onClose}
            >
              <Text style={tw`text-center font-semibold text-gray-700`}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`flex-1 bg-blue-600 py-3 rounded-xl`}
              onPress={onSubmit}
            >
              <Text style={tw`text-center font-semibold text-white`}>
                {editingMap ? "Update" : "Add"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
