import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { ManagePOI } from "../types/poi";

export function useManagePOIs() {
  const [pois, setPois] = useState<ManagePOI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "pois"),
      (snapshot) => {
        const poisData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ManagePOI[];
        setPois(poisData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching POIs:", error);
        Alert.alert("Error", "Failed to load POIs");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addPOI = async (poiData: Omit<ManagePOI, "id">) => {
    try {
      await addDoc(collection(db, "pois"), {
        ...poiData,
        createdAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error("Error adding POI:", error);
      Alert.alert("Error", "Failed to add POI");
      return false;
    }
  };

  const updatePOI = async (id: string, poiData: Partial<ManagePOI>) => {
    try {
      const poiRef = doc(db, "pois", id);
      await updateDoc(poiRef, {
        ...poiData,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error("Error updating POI:", error);
      Alert.alert("Error", "Failed to update POI");
      return false;
    }
  };

  const deletePOI = async (id: string) => {
    try {
      await deleteDoc(doc(db, "pois", id));
      return true;
    } catch (error) {
      console.error("Error deleting POI:", error);
      Alert.alert("Error", "Failed to delete POI");
      return false;
    }
  };

  return {
    pois,
    loading,
    addPOI,
    updatePOI,
    deletePOI
  };
}
