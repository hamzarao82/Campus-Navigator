import { useState, useEffect } from "react";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { Alert } from "react-native";
import { db } from "../firebaseConfig";
import { AdminMapData } from "../types/mapAdmin";

const dummyMapUpdates: AdminMapData[] = [
  {
    id: "dummy-1",
    name: "Main Campus Map",
    image: "https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg",
    lastUpdated: "2024-03-10",
    status: "Active",
    type: "Outdoor",
    description: "Complete overview of main campus buildings and facilities",
  },
  {
    id: "dummy-2",
    name: "Science Complex",
    image: "https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg",
    lastUpdated: "2024-03-08",
    status: "Pending",
    type: "Indoor",
    description: "Detailed map of science buildings and laboratories",
  },
  {
    id: "dummy-3",
    name: "Student Center",
    image: "https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg",
    lastUpdated: "2024-03-05",
    status: "Active",
    type: "Indoor",
    description: "Map of student facilities and recreational areas",
  },
];

export function useMapAdmin() {
  const [firebaseMaps, setFirebaseMaps] = useState<AdminMapData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "mapUpdates"),
      (snapshot) => {
        const maps = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          lastUpdated: doc.data().updatedAt?.toDate?.()?.toISOString()?.split('T')[0] || new Date().toISOString().split('T')[0],
        })) as AdminMapData[];
        setFirebaseMaps(maps);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching maps:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const allMaps = [...firebaseMaps, ...dummyMapUpdates];

  const addMap = async (formData: Omit<AdminMapData, "id" | "lastUpdated">) => {
    try {
      await addDoc(collection(db, "mapUpdates"), {
        ...formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error("Error adding map:", error);
      Alert.alert("Error", "Failed to add map");
      return false;
    }
  };

  const updateMap = async (id: string, formData: Omit<AdminMapData, "id" | "lastUpdated">) => {
    if (id.startsWith("dummy-")) {
      Alert.alert("Info", "Cannot edit dummy data");
      return false;
    }

    try {
      await updateDoc(doc(db, "mapUpdates", id), {
        ...formData,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error("Error updating map:", error);
      Alert.alert("Error", "Failed to update map");
      return false;
    }
  };

  const deleteMap = async (id: string) => {
    if (id.startsWith("dummy-")) {
      Alert.alert("Info", "Cannot delete dummy data");
      return false;
    }

    try {
      await deleteDoc(doc(db, "mapUpdates", id));
      return true;
    } catch (error) {
      console.error("Error deleting map:", error);
      Alert.alert("Error", "Failed to delete map");
      return false;
    }
  };

  return {
    allMaps,
    loading,
    addMap,
    updateMap,
    deleteMap,
  };
}
