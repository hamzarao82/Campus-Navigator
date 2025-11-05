import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SimpleMap() {
  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    let watch;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Location permission is required.");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      // Watch live location
      watch = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 5 },
        (locUpdate) => {
          setLocation(locUpdate.coords);
          mapRef.current?.animateCamera({
            center: { latitude: locUpdate.coords.latitude, longitude: locUpdate.coords.longitude },
          });
        }
      );
    })();

    return () => watch?.remove();
  }, []);

  if (!location)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="blue" />
        <Text style={{ marginTop: 8 }}>Waiting for GPS...</Text>
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      {/* Back Arrow */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        followsUserLocation
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  backButton: {
    position: "absolute",
    top: 50,
    left: 10,
    zIndex: 10,
    backgroundColor: "white",
    borderRadius: 25,
    padding: 5,
    elevation: 5,
  },
});
