import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import tw from "twrnc";
import { auth, db } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Check Firebase auth state on mount
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (!isMounted || !user) return;

      try {
        // Fetch user role from Firestore using direct document access
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();

          // Redirect based on role
          if (userData.role === "student") {
            router.replace("/student/student-dashboard");
          } else if (userData.role === "faculty") {
            router.replace("/faculty/faculty-dashboard");
          } else if (userData.role === "admin") {
            router.replace("/admin/admin-dashboard");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user role from Firestore using direct document access
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        Alert.alert("Error", "User data not found in database");
        await auth.signOut();
        return;
      }

      const userData = userDoc.data();

      // Redirect based on role
      if (userData.role === "student") {
        router.replace("/student/student-dashboard");
      } else if (userData.role === "faculty") {
        router.replace("/faculty/faculty-dashboard");
      } else if (userData.role === "admin") {
        router.replace("/admin/admin-dashboard");
      } else {
        Alert.alert("Error", "Invalid user role");
        await auth.signOut();
      }
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle specific Firebase errors
      if (error.code === "auth/invalid-credential") {
        Alert.alert("Login Failed", "Invalid email or password");
      } else if (error.code === "auth/user-not-found") {
        Alert.alert("Login Failed", "No account found with this email");
      } else if (error.code === "auth/wrong-password") {
        Alert.alert("Login Failed", "Incorrect password");
      } else if (error.code === "auth/too-many-requests") {
        Alert.alert(
          "Too Many Attempts",
          "Account temporarily disabled. Please try again later or reset your password."
        );
      } else {
        Alert.alert("Login Failed", error?.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Firebase password reset
  const handlePasswordReset = async () => {
    if (!resetEmail) {
      Alert.alert("Missing Email", "Please enter your email address");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      Alert.alert(
        "Password Reset",
        "Password reset link has been sent to your email. Please check your inbox."
      );
      setModalVisible(false);
      setResetEmail("");
    } catch (error: any) {
      console.error("Password reset error:", error);

      if (error.code === "auth/user-not-found") {
        Alert.alert("Error", "No account found with this email");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Error", "Invalid email address");
      } else {
        Alert.alert("Error", error?.message || "Failed to send reset link");
      }
    }
  };

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
          <View style={tw`items-center mt-10 mb-10`}>
            <Image
              source={require("../assets/images/login logo.png")}
              style={tw`w-28 h-28`}
              resizeMode="contain"
            />
          </View>

          <Text style={tw`text-2xl font-bold text-blue-600 mb-1`}>Login</Text>
          <Text style={tw`text-base text-black mb-8`}>
            Please sign in to continue
          </Text>

          <View style={tw`mb-4`}>
            <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Email</Text>
            <TextInput
              style={tw`bg-gray-100 rounded-xl px-4 py-3`}
              placeholder="Your email address"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={tw`mb-4`}>
            <Text style={tw`text-sm font-medium text-gray-700 mb-1`}>Password</Text>
            <View style={tw`flex-row items-center bg-gray-100 rounded-xl px-4`}>
              <TextInput
                style={tw`flex-1 py-3 text-gray-900`}
                placeholder="Enter your password"
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
          </View>

          <View style={tw`flex-row items-center justify-between mb-6`}>
            <TouchableOpacity
              style={tw`flex-row items-center`}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={tw`w-5 h-5 rounded border-2 border-blue-600 mr-2 items-center justify-center ${rememberMe ? 'bg-blue-600' : 'bg-white'
                }`}>
                {rememberMe && (
                  <Ionicons name="checkmark" size={14} color="white" />
                )}
              </View>
              <Text style={tw`text-gray-700 text-sm`}>Remember Me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={tw`text-blue-600 font-medium text-sm`}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={tw`bg-blue-600 py-4 rounded-2xl mt-2`}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={tw`text-white text-center text-lg font-semibold`}>
                Login
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={tw`mt-8 items-center`}
            onPress={() => router.replace("/signup")}
          >
            <Text style={tw`text-sm text-gray-600`}>
              Don’t have an account?{" "}
              <Text style={tw`text-blue-600 font-semibold`}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
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
              placeholderTextColor="#999"
              keyboardType="email-address"
              value={resetEmail}
              onChangeText={setResetEmail}
            />
            <TouchableOpacity
              style={tw`bg-blue-600 py-3 rounded-xl mb-3`}
              onPress={handlePasswordReset}
            >
              <Text style={tw`text-white text-center font-semibold`}>
                Send Reset Link
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={tw`text-center text-gray-600 font-medium`}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
