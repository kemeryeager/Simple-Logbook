import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, BackHandler } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TripListScreen from './screens/TripListScreen';
import TripDetailScreen from './screens/TripDetailScreen';

export default function App() {
  const [selectedTrip, setSelectedTrip] = useState(null);

  // Handle hardware back button on Android
  useEffect(() => {
    const onBackPress = () => {
      if (selectedTrip) {
        setSelectedTrip(null);
        return true; // handled
      }
      return false; // exit app
    };

    const backSubscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );
    return () => backSubscription.remove();
  }, [selectedTrip]);

  const handleSelectTrip = useCallback((trip) => {
    setSelectedTrip(trip);
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedTrip(null);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#FFFFFF" translucent={false} />
      {selectedTrip ? (
        <TripDetailScreen
          trip={selectedTrip}
          onBack={handleBackToList}
          onTripDeleted={handleBackToList}
        />
      ) : (
        <TripListScreen onSelectTrip={handleSelectTrip} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
