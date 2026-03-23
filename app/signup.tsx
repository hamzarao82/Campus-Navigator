import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import DropDownPicker from "react-native-dropdown-picker";
import tw from "twrnc";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../firebaseConfig";
import { FormInput } from "../components/ui/atoms/FormInput";
import { PrimaryButton } from "../components/ui/atoms/PrimaryButton";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function SignupScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Student", value: "student" },
    { label: "Faculty", value: "faculty" },
    { label: "Admin", value: "admin" },
  ]);

  const handleSignup = async () => {
    if (!fullName || !role || !email || !password || !confirmPassword) {
      return Alert.alert("Missing Fields", "Please fill all fields.");
    }
    if (password !== confirmPassword) {
      return Alert.alert("Password Mismatch", "Your passwords do not match.");
    }
    if (password.length < 6) {
      return Alert.alert("Weak Password", "Password must be at least 6 characters long.");
    }
    if (!agreeTerms) {
      return Alert.alert("Terms & Conditions", "Please agree to continue.");
    }

    setLoading(true);
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log("✅ User created:", user.uid);

      // Update user profile with display name
      await updateProfile(user, {
        displayName: fullName,
      });

      // Save user info to Firestore using user UID as document ID
      await setDoc(doc(db, "users", user.uid), {
        userId: user.uid,
        fullName,
        email,
        role,
        createdAt: new Date().toISOString(),
      });

      Alert.alert("Success", "Account created successfully!");

      // Redirect by role
      if (role === "student") {
        router.replace("/student/student-dashboard");
      } else if (role === "faculty") {
        router.replace("/faculty/faculty-dashboard");
      } else if (role === "admin") {
        router.replace("/admin/admin-dashboard");
      }
    } catch (error: any) {
      console.error("Signup error:", error);

      // Handle specific Firebase errors
      if (error.code === "auth/email-already-in-use") {
        Alert.alert(
          "Email Already Exists",
          "An account with this email already exists. Please login instead."
        );
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Invalid Email", "Please enter a valid email address.");
      } else if (error.code === "auth/weak-password") {
        Alert.alert("Weak Password", "Password should be at least 6 characters.");
      } else if (error.code === "auth/network-request-failed") {
        Alert.alert("Network Error", "Please check your internet connection.");
      } else {
        Alert.alert("Signup Failed", error.message || "Unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <KeyboardAvoidingView
        style={tw`flex-1`}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={tw`flex-grow px-6 pb-8`}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <View style={tw`h-12 justify-center`}>
            <TouchableOpacity
              style={tw`w-10 h-10 items-center justify-center mt-2`}
              onPress={() => router.replace("/login")}
            >
              <Ionicons name="chevron-back" size={22} color="#2258A2" />
            </TouchableOpacity>
          </View>

          {/* Logo */}
          <View style={tw`items-center mb-4`}>
            <Image
              source={require("../assets/images/login logo.png")}
              style={tw`w-24 h-24`}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text style={tw`text-2xl font-bold text-blue-600 mb-6`}>Sign Up</Text>

          {/* Inputs */}
          <FormInput
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            containerStyle={tw`mb-4`}
          />
          <DropDownPicker
            open={open}
            value={role}
            items={items}
            setOpen={setOpen}
            setValue={setRole}
            setItems={setItems}
            placeholder="Select your role"
            listMode="SCROLLVIEW"
            scrollViewProps={{
              nestedScrollEnabled: true,
            }}
            style={tw`bg-gray-100 border border-gray-200 rounded-xl mb-4`}
          />
          <FormInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            containerStyle={tw`mb-4`}
          />

          {/* Password Input with Eye Icon */}
          <View style={tw`flex-row items-center bg-gray-100 rounded-xl px-4 mb-4`}>
            <TextInput
              style={tw`flex-1 py-3 text-gray-900`}
              placeholder="Password"
              placeholderTextColor="#999"
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

          {/* Confirm Password Input with Eye Icon */}
          <View style={tw`flex-row items-center bg-gray-100 rounded-xl px-4 mb-4`}>
            <TextInput
              style={tw`flex-1 py-3 text-gray-900`}
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#2563EB"
              />
            </TouchableOpacity>
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

          {/* Button */}
          <PrimaryButton 
            title="Sign Up"
            onPress={handleSignup}
            loading={loading}
            style={tw`mb-4`}
          />

          {/* Login Link */}
          <TouchableOpacity
            style={tw`items-center mb-4`}
            onPress={() => router.replace("/login")}
          >
            <Text style={tw`text-sm text-gray-600`}>
              Already have an account?{" "}
              <Text style={tw`text-blue-600 font-semibold`}>Login</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
