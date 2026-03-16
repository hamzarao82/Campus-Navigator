import React from "react";
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import tw from "twrnc";
import { FormInput } from "../atoms/FormInput";
import { PrimaryButton } from "../atoms/PrimaryButton";

interface ManagePOIFormProps {
  isEdit: boolean;
  formData: any;
  setFormData: (data: any) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ManagePOIForm: React.FC<ManagePOIFormProps> = ({
  isEdit,
  formData,
  setFormData,
  onSave,
  onCancel,
}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={tw`flex-1`}
    >
      <ScrollView
        style={tw`flex-1 px-6 py-4`}
        showsVerticalScrollIndicator={false}
      >
        <FormInput
          label="Name *"
          placeholder="Enter POI name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          containerStyle={tw`mb-4`}
        />

        <FormInput
          label="Image URL"
          placeholder="Enter image URL"
          value={formData.image}
          onChangeText={(text) => setFormData({ ...formData, image: text })}
          containerStyle={tw`mb-4`}
        />

        <FormInput
          label="Description"
          placeholder="Enter description"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          multiline
          numberOfLines={3}
          containerStyle={tw`mb-4`}
        />

        <FormInput
          label="Location"
          placeholder="Enter location"
          value={formData.location}
          onChangeText={(text) => setFormData({ ...formData, location: text })}
          containerStyle={tw`mb-4`}
        />

        <FormInput
          label="Hours"
          placeholder="e.g., 8:00 AM - 10:00 PM"
          value={formData.hours}
          onChangeText={(text) => setFormData({ ...formData, hours: text })}
          containerStyle={tw`mb-4`}
        />

        <View style={tw`flex-row gap-3 mb-4`}>
          <FormInput
            label="Capacity"
            placeholder="0"
            value={formData.capacity}
            onChangeText={(text) => setFormData({ ...formData, capacity: text })}
            keyboardType="numeric"
            containerStyle={tw`flex-1`}
          />
          <FormInput
            label="Occupancy"
            placeholder="0"
            value={formData.currentOccupancy}
            onChangeText={(text) => setFormData({ ...formData, currentOccupancy: text })}
            keyboardType="numeric"
            containerStyle={tw`flex-1`}
          />
        </View>

        <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>Status</Text>
        <View style={tw`flex-row gap-2 mb-4 flex-wrap`}>
          {["Open", "Busy", "Available", "Closed"].map((status) => (
            <TouchableOpacity
              key={status}
              style={tw`px-4 py-2 rounded-full ${formData.status === status
                ? "bg-blue-500"
                : "bg-gray-200"
                }`}
              onPress={() => setFormData({ ...formData, status })}
            >
              <Text
                style={tw`font-medium ${formData.status === status ? "text-white" : "text-gray-700"
                  }`}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>Coordinates (Optional)</Text>
        <View style={tw`flex-row gap-3 mb-6`}>
          <FormInput
            placeholder="Latitude"
            value={formData.latitude}
            onChangeText={(text) => setFormData({ ...formData, latitude: text })}
            keyboardType="decimal-pad"
            containerStyle={tw`flex-1`}
          />
          <FormInput
            placeholder="Longitude"
            value={formData.longitude}
            onChangeText={(text) => setFormData({ ...formData, longitude: text })}
            keyboardType="decimal-pad"
            containerStyle={tw`flex-1`}
          />
        </View>

        <View style={tw`flex-row gap-3 mb-6`}>
          <PrimaryButton
            title="Cancel"
            onPress={onCancel}
            style={tw`flex-1 bg-gray-200`}
            textStyle={tw`text-gray-700`}
          />
          <PrimaryButton
            title={isEdit ? "Update POI" : "Add POI"}
            onPress={onSave}
            style={tw`flex-1`}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
