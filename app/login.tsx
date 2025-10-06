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
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <KeyboardAvoidingView
        style={tw`flex-1`}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={tw`flex-grow px-6 pb-6`}
          showsVerticalScrollIndicator={false}
        >
          {/* Back button */}
          <TouchableOpacity
            style={tw`w-10 h-10 bg-transparent items-center justify-center mt-1`}
            onPress={() => router.replace("/intro")}
          >
            <Ionicons name="chevron-back" size={22} color="#2252A2" />
          </TouchableOpacity>

          {/* Logo */}
          <View style={tw`items-center mt-6 mb-10`}>
            <Image
              source={require("../assets/images/login logo.png")}
              style={tw`w-28 h-28`}
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text style={tw`text-2xl font-bold text-blue-600 mb-1`}>Login</Text>
          <Text style={tw`text-base text-black mb-8`}>
            Please sign in to continue
          </Text>

          {/* Email Input */}
          <View style={tw`mb-4`}>
            <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Email</Text>
            <TextInput
              style={tw`bg-gray-100 rounded-xl px-4 py-3`}
              placeholder="Your email address"
              placeholderTextColor={"#999"}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password Input */}
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

          {/* Remember Me + Forgot Password */}
          <View style={tw`flex-row justify-between items-center mb-6`}>
            <TouchableOpacity
              style={tw`flex-row items-center`}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <Ionicons
                name={rememberMe ? "checkbox" : "square-outline"}
                size={20}
                color="#2563EB"
              />
              <Text style={tw`ml-2 text-sm text-gray-700`}>Remember Me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={tw`text-sm text-blue-600 font-medium`}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={tw`bg-blue-600 py-4 rounded-2xl`}
            onPress={() => router.replace("")}
          >
            <Text style={tw`text-white text-center text-lg font-semibold`}>
              Login
            </Text>
          </TouchableOpacity>

          {/* Signup link */}
          <TouchableOpacity
            style={tw`mt-6 items-center`}
            onPress={() => router.replace("/signup")}
          >
            <Text style={tw`text-sm text-gray-600 mt-2`}>
              Don’t have an account?{" "}
              <Text style={tw`text-blue-600 font-semibold`}>Sign Up</Text>
            </Text>
          </TouchableOpacity>

          {/* Footer Role Buttons */}
          <View style={tw`mt-10 flex-row justify-around`}>
            <TouchableOpacity
              style={tw`bg-blue-600 px-5 py-3 rounded-xl`}
              onPress={() => router.replace("/dashboards/admin")}
            >
              <Text style={tw`text-white font-semibold`}>Admin</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`bg-blue-600 px-5 py-3 rounded-xl`}
              onPress={() => router.replace("/dashboards/faculty")}
            >
              <Text style={tw`text-white font-semibold`}>Faculty</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`bg-blue-600 px-5 py-3 rounded-xl`}
              onPress={() => router.replace("/dashboards/student")}
            >
              <Text style={tw`text-white font-semibold`}>Student</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Forgot Password Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={tw`flex-1 justify-center items-center bg-black/50`}>
          <View style={tw`bg-white p-6 rounded-2xl w-80`}>
            <Text style={tw`text-lg font-semibold mb-3 text-blue-600`}>
              Reset Password
            </Text>
            <Text style={tw`text-sm text-gray-600 mb-4`}>
              Enter your email address to receive a password reset link.
            </Text>

            <TextInput
              style={tw`bg-gray-100 rounded-xl px-4 py-3 mb-4`}
              placeholder="Enter your email"
              placeholderTextColor={"#999"}
              keyboardType="email-address"
              value={resetEmail}
              onChangeText={setResetEmail}
            />

            <TouchableOpacity
              style={tw`bg-blue-600 py-3 rounded-xl mb-3`}
              onPress={() => {
                Alert.alert("Password reset link sent!");
                setModalVisible(false);
              }}
            >
              <Text style={tw`text-white text-center font-semibold`}>
                Send Reset Link
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={tw`text-center text-gray-600 font-medium`}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
