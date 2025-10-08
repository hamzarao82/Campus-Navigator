import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons, FontAwesome5, Entypo } from "@expo/vector-icons";
import tw from "twrnc";
import { useRouter } from "expo-router";

export default function StudentProfileScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Hamza Rao",
    email: "hamza@example.com",
    phone: "+92 300 1234567",
    address: "Lahore, Pakistan",
    studentId: "STU123456",
    major: "Computer Science",
    year: "Junior",
    gpa: "3.8",
    advisor: "Dr. Sarah Johnson",
  });

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert("Success", "Profile updated successfully!");
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`flex-row items-center justify-between px-6 pb-3 pt-4`}>
        <TouchableOpacity
          style={tw`w-10 h-10 rounded-full bg-gray-100 items-center justify-center`}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={22} color="#1f2937" />
        </TouchableOpacity>

        <Text style={tw`text-xl font-bold text-gray-800`}>Student Profile</Text>

        <TouchableOpacity
          style={tw`bg-blue-500 rounded-full px-4 py-2`}
          onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          <Text style={tw`text-white font-medium`}>
            {isEditing ? "Save" : "Edit"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={tw`px-6`} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={tw`items-center mt-4 mb-8`}>
          <View style={tw`relative`}>
            <Image
              source={{
                uri: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
              }}
              style={tw`w-30 h-30 rounded-full border-4 border-blue-500`}
            />
            {isEditing && (
              <TouchableOpacity
                style={tw`absolute bottom-0 right-0 bg-blue-500 w-9 h-9 rounded-full items-center justify-center border-2 border-white`}
                onPress={() =>
                  Alert.alert(
                    "Feature Coming Soon",
                    "Change profile picture functionality will be added later."
                  )
                }
              >
                <Ionicons name="camera" size={18} color="#fff" />
              </TouchableOpacity>
            )}
          </View>

          <View
            style={tw`flex-row items-center bg-blue-100 px-4 py-2 mt-4 rounded-full`}
          >
            <FontAwesome5 name="user-graduate" size={16} color="#3b82f6" />
            <Text style={tw`ml-2 text-blue-500 font-medium`}>Student</Text>
          </View>
        </View>

        {/* Personal Information */}
        <View style={tw`mb-8`}>
          <Text style={tw`text-lg font-semibold text-gray-800 mb-3`}>
            Personal Information
          </Text>
          <View style={tw`bg-white rounded-xl shadow p-4`}>
            {/* Full Name */}
            <View style={tw`border-b border-gray-200 pb-3 mb-3`}>
              <Text style={tw`text-gray-500 text-sm mb-1`}>Full Name</Text>
              {isEditing ? (
                <TextInput
                  value={profileData.name}
                  onChangeText={(text) =>
                    setProfileData({ ...profileData, name: text })
                  }
                  style={tw`bg-gray-100 rounded-md px-3 py-2 text-gray-800`}
                />
              ) : (
                <Text style={tw`text-gray-800`}>{profileData.name}</Text>
              )}
            </View>

            {/* Email */}
            <View style={tw`border-b border-gray-200 pb-3 mb-3`}>
              <View style={tw`flex-row items-center mb-1`}>
                <MaterialIcons name="email" size={16} color="gray" />
                <Text style={tw`ml-2 text-gray-500 text-sm`}>Email</Text>
              </View>
              <Text style={tw`text-gray-800`}>{profileData.email}</Text>
            </View>

            {/* Phone */}
            <View style={tw`border-b border-gray-200 pb-3 mb-3`}>
              <View style={tw`flex-row items-center mb-1`}>
                <Ionicons name="call-outline" size={16} color="gray" />
                <Text style={tw`ml-2 text-gray-500 text-sm`}>Phone</Text>
              </View>
              {isEditing ? (
                <TextInput
                  value={profileData.phone}
                  onChangeText={(text) =>
                    setProfileData({ ...profileData, phone: text })
                  }
                  style={tw`bg-gray-100 rounded-md px-3 py-2 text-gray-800`}
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={tw`text-gray-800`}>{profileData.phone}</Text>
              )}
            </View>

            {/* Address */}
            <View>
              <View style={tw`flex-row items-center mb-1`}>
                <Entypo name="location-pin" size={16} color="gray" />
                <Text style={tw`ml-2 text-gray-500 text-sm`}>Address</Text>
              </View>
              {isEditing ? (
                <TextInput
                  value={profileData.address}
                  onChangeText={(text) =>
                    setProfileData({ ...profileData, address: text })
                  }
                  style={tw`bg-gray-100 rounded-md px-3 py-2 text-gray-800`}
                />
              ) : (
                <Text style={tw`text-gray-800`}>{profileData.address}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Student Information */}
        <View style={tw`mb-8`}>
          <Text style={tw`text-lg font-semibold text-gray-800 mb-3`}>
            Student Information
          </Text>
          <View style={tw`bg-white rounded-xl shadow p-4`}>
            {Object.entries({
              studentId: "Student ID",
              major: "Major",
              year: "Year",
              gpa: "GPA",
              advisor: "Advisor",
            }).map(([key, label]) => (
              <View key={key} style={tw`border-b border-gray-200 pb-3 mb-3`}>
                <Text style={tw`text-gray-500 text-sm mb-1`}>{label}</Text>
                {isEditing ? (
                  <TextInput
                    value={profileData[key as keyof typeof profileData]}
                    onChangeText={(text) =>
                      setProfileData({ ...profileData, [key]: text })
                    }
                    style={tw`bg-gray-100 rounded-md px-3 py-2 text-gray-800`}
                  />
                ) : (
                  <Text style={tw`text-gray-800`}>
                    {profileData[key as keyof typeof profileData]}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={tw`mb-10`} />
      </ScrollView>
    </SafeAreaView>
  );
}
