import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Alert } from "react-native";
import { auth, db } from "../firebaseConfig";
import { UserProfileData } from "../types/userProfile";

export function useUserProfile(defaultRoleData: Partial<UserProfileData> = {}) {
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data() as UserProfileData;
        setProfileData({ ...defaultRoleData, ...data, id: user.uid });
      } else {
        // Fallback for demo if users collection is empty
        setProfileData({
          id: user.uid,
          fullName: user.displayName || "User",
          email: user.email || "",
          role: "student",
          ...defaultRoleData
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profileData || !auth.currentUser) return;

    try {
      setSaving(true);
      const userRef = doc(db, "users", auth.currentUser.uid);
      
      const updateData = { ...profileData };
      delete updateData.id; // Don't upload the document ID as a field
      
      await updateDoc(userRef, updateData);
      Alert.alert("Success", "Profile updated successfully.");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: keyof UserProfileData, value: string) => {
    setProfileData((prev) => (prev ? { ...prev, [key]: value } : null));
  };

  return {
    profileData,
    loading,
    saving,
    isEditing,
    setIsEditing,
    handleSave,
    updateField,
  };
}
