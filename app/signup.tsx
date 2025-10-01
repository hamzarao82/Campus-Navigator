import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import DropDownPicker from "react-native-dropdown-picker";
import tw from "twrnc";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignupScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Dropdown state
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Student", value: "student" },
    { label: "Faculty", value: "faculty" },
    { label: "Admin", value: "admin" },
  ]);

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <KeyboardAvoidingView
        style={tw`flex-1 px-6 pb-8`}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Back Button */}
        <View style={tw`h-12 justify-center`}>
          <TouchableOpacity
            style={tw`w-10 h-10 rounded-full bg-transparent items-center justify-center mt-2`}
            onPress={() => router.replace("/login")}
          >
            <Ionicons name="chevron-back" size={22} color="#2258A2" />
          </TouchableOpacity>
        </View>

        {/* Logo */}
        <View style={tw`items-center  `}>
          <Image
            source={require("../assets/images/login logo.png")}
            style={tw`w-24 h-24`}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={tw`text-2xl font-bold text-blue-600 mb-6`}>Sign Up</Text>

        {/* Full Name */}
        <View style={tw`mb-4`}>
          <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>
            Full Name
          </Text>
          <TextInput
            style={tw`bg-gray-100 rounded-xl px-4 py-3`}
            placeholder="Enter your full name"
            placeholderTextColor={"#999"}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        {/* Role Dropdown */}
        <View style={tw`mb-4 z-10`}>
          <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Role</Text>
          <DropDownPicker
            open={open}
            value={role}
            items={items}
            setOpen={setOpen}
            setValue={setRole}
            setItems={setItems}
            placeholder="Select your role"
            style={tw`bg-gray-100 border border-gray-200 rounded-xl`}
            textStyle={tw`text-base text-gray-800`}
            dropDownContainerStyle={tw`bg-white border border-gray-200 rounded-xl`}
            ArrowDownIconComponent={() => (
              <Ionicons name="chevron-down" size={20} color="#2563EB" />
            )}
            ArrowUpIconComponent={() => (
              <Ionicons name="chevron-up" size={20} color="#2563EB" />
            )}
          />
        </View>

        {/* Email */}
        <View style={tw`mb-4`}>
          <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Email</Text>
          <TextInput
            style={tw`bg-gray-100 rounded-xl px-4 py-3`}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password */}
        <View style={tw`mb-4`}>
          <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>
            Password
          </Text>
        <View style={tw`flex-row items-center bg-gray-100 rounded-xl px-4`}>
            <TextInput
            style={tw`flex-1 py-3`}
            placeholder="Enter your password"
            placeholderTextColor={"#999"}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
             <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
                color="#2563EB"
            />
                </TouchableOpacity>
            </View>
        </View>

        {/* Confirm Password */}
       <View style={tw`mb-4`}>
  <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>
    Confirm Password
  </Text>
  <View style={tw`flex-row items-center bg-gray-100 rounded-xl px-4`}>
    <TextInput
      style={tw`flex-1 py-3`}
      placeholder="Confirm your password"
      placeholderTextColor={"#999"}
      secureTextEntry={!showConfirmPassword}
      value={confirmPassword}
      onChangeText={setConfirmPassword}
    />
    <TouchableOpacity
      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
    >
      <Ionicons
        name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
        size={20}
        color="#2563EB"
      />
    </TouchableOpacity>
  </View>
</View>

        {/* Terms */}
        <TouchableOpacity
          style={tw`flex-row items-center mb-6`}
          onPress={() => setAgreeTerms(!agreeTerms)}
        >
          <Ionicons
            name={agreeTerms ? "checkbox" : "square-outline"}
            size={20}
            color="#2563EB"
          />
          <Text style={tw`ml-2 text-sm text-gray-700`}>
            I agree with Terms & Conditions
          </Text>
        </TouchableOpacity>

        {/* Sign Up Button */}
        <TouchableOpacity
          style={tw`bg-blue-600 py-4 rounded-2xl`}
          onPress={() => router.replace("/login")}
        >
          <Text style={tw`text-white text-center text-lg font-semibold`}>
            Sign Up
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
