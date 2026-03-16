import React from 'react';
import { View, Text, TouchableOpacity, Modal, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { FormInput } from '../atoms/FormInput';
import { PrimaryButton } from '../atoms/PrimaryButton';
import { PageHeader } from './PageHeader';

interface POIFormData {
  name: string;
  description: string;
  category: string;
  locationDetails: string;
}

interface POIFormModalProps {
  visible: boolean;
  isEditMode: boolean;
  formData: POIFormData;
  isSaving: boolean;
  onClose: () => void;
  onSave: () => void;
  onChangeText: (field: keyof POIFormData, text: string) => void;
  categories: string[];
}

export function POIFormModal({
  visible,
  isEditMode,
  formData,
  isSaving,
  onClose,
  onSave,
  onChangeText,
  categories,
}: POIFormModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={tw`flex-1 justify-end bg-black/50`}
      >
        <View style={tw`bg-white rounded-t-3xl shadow-2xl h-[85%]`}>
          <PageHeader 
            title={isEditMode ? 'Edit Location' : 'Save Location'} 
            leftActionIcon="close"
            onLeftAction={onClose}
          />

          <ScrollView style={tw`p-6`} showsVerticalScrollIndicator={false}>
            <View style={tw`mb-6`}>
              <View style={tw`w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-4 self-center`}>
                <Ionicons name="location" size={24} color="#2563EB" />
              </View>
              <Text style={tw`text-center text-gray-500 mb-2`}>
                {isEditMode ? "Update details for this location" : "Enter details for the selected location on the map"}
              </Text>
            </View>

            <FormInput
              label="Location Name"
              placeholder="e.g., Main Library, Cafe"
              value={formData.name}
              onChangeText={(text) => onChangeText('name', text)}
              containerStyle={tw`mb-4`}
            />

            <FormInput
              label="Description (Optional)"
              placeholder="Details about this place..."
              value={formData.description}
              onChangeText={(text) => onChangeText('description', text)}
              multiline
              numberOfLines={3}
              containerStyle={tw`mb-4`}
            />

            <Text style={tw`text-sm font-medium text-gray-700 mb-2`}>Category</Text>
            <View style={tw`flex-row flex-wrap gap-2 mb-4`}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={tw`px-4 py-2 rounded-full border ${
                    formData.category === cat
                      ? 'bg-blue-600 border-blue-600'
                      : 'bg-white border-gray-300'
                  }`}
                  onPress={() => onChangeText('category', cat)}
                >
                  <Text style={tw`text-sm font-medium ${
                    formData.category === cat ? 'text-white' : 'text-gray-700'
                  }`}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <FormInput
              label="Room / Floor Details (Optional)"
              placeholder="e.g., Ground Floor, Room 101"
              value={formData.locationDetails}
              onChangeText={(text) => onChangeText('locationDetails', text)}
              containerStyle={tw`mb-8`}
            />

            <PrimaryButton
              title={isSaving ? 'Saving...' : (isEditMode ? 'Update Location' : 'Save Location')}
              onPress={onSave}
              disabled={isSaving || !formData.name.trim() || !formData.category}
              loading={isSaving}
              style={tw`mb-10`}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
