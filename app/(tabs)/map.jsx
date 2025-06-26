import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { MapPin, FileSliders as Sliders, Search } from 'lucide-react-native';
import { pushSignIn } from '../../hooks/pushSignIn.js';

export default function MapScreen() {
  pushSignIn();
  const [selectedDog, setSelectedDog] = useState(null);
  
  // Simulated data - in a real app, this would be replaced with actual map markers
  const mapMarkers = [
    {
      id: '1',
      name: 'Max',
      breed: 'Golden Retriever',
      owner: 'Sarah Johnson',
      distance: '0.5 miles',
      time: '3:00 PM - 4:00 PM',
      image: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg',
      location: { top: '35%', left: '40%' },
    },
    {
      id: '2',
      name: 'Bella',
      breed: 'Poodle',
      owner: 'Robert Smith',
      distance: '0.7 miles',
      time: '5:30 PM - 6:30 PM',
      image: 'https://images.pexels.com/photos/1458916/pexels-photo-1458916.jpeg',
      location: { top: '50%', left: '60%' },
    },
    {
      id: '3',
      name: 'Charlie',
      breed: 'Beagle',
      owner: 'Emily Davis',
      distance: '1.2 miles',
      time: '4:00 PM - 5:00 PM',
      image: 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg',
      location: { top: '65%', left: '30%' },
    },
  ];

  const handleMarkerPress = (dog) => {
    setSelectedDog(dog);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#8A8A8A" />
          <Text style={styles.searchPlaceholder}>Search for dogs or locations...</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Sliders size={20} color="#4A80F0" />
        </TouchableOpacity>
      </View>
      
      {/* Simulated map view */}
      <View style={styles.mapContainer}>
        <View style={styles.mockMap}>
          <Text style={styles.mockMapText}>Map View</Text>
          
          {/* Simulated markers */}
          {mapMarkers.map(marker => (
            <TouchableOpacity
              key={marker.id}
              style={[styles.mapMarker, marker.location]}
              onPress={() => handleMarkerPress(marker)}
            >
              <View style={styles.markerDot} />
              <Image
                source={{ uri: marker.image }}
                style={[styles.markerImage, selectedDog?.id === marker.id && styles.selectedMarker]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {/* Current location button */}
      <TouchableOpacity style={styles.currentLocationButton}>
        <MapPin size={24} color="#4A80F0" />
      </TouchableOpacity>
      
      {/* Dog detail card */}
      {selectedDog && (
        <View style={styles.dogDetailCard}>
          <Image source={{ uri: selectedDog.image }} style={styles.detailImage} />
          <View style={styles.detailContent}>
            <View style={styles.detailHeader}>
              <View>
                <Text style={styles.detailName}>{selectedDog.name}</Text>
                <Text style={styles.detailBreed}>{selectedDog.breed}</Text>
              </View>
              <View style={styles.distanceContainer}>
                <MapPin size={14} color="#4A80F0" />
                <Text style={styles.distanceText}>{selectedDog.distance}</Text>
              </View>
            </View>
            
            <Text style={styles.ownerText}>Owner: {selectedDog.owner}</Text>
            <Text style={styles.timeText}>Available: {selectedDog.time}</Text>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.messageButton}>
                <Text style={styles.messageButtonText}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.requestButton}>
                <Text style={styles.requestButtonText}>Request Walk</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F6F8',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  searchPlaceholder: {
    marginLeft: 10,
    color: '#8A8A8A',
    fontSize: 14,
  },
  filterButton: {
    backgroundColor: '#F4F6F8',
    padding: 10,
    borderRadius: 12,
  },
  mapContainer: {
    flex: 1,
  },
  mockMap: {
    flex: 1,
    backgroundColor: '#E1E8ED',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mockMapText: {
    color: '#8A8A8A',
    fontSize: 16,
    fontWeight: '500',
  },
  mapMarker: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4A80F0',
    position: 'absolute',
    bottom: -4,
    zIndex: 2,
  },
  markerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  selectedMarker: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderColor: '#4A80F0',
    borderWidth: 3,
  },
  currentLocationButton: {
    position: 'absolute',
    right: 20,
    bottom: 220,
    backgroundColor: '#FFFFFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  dogDetailCard: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  detailImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  detailContent: {
    flex: 1,
    marginLeft: 15,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 2,
  },
  detailBreed: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 12,
    color: '#4A80F0',
    fontWeight: '500',
    marginLeft: 4,
  },
  ownerText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  messageButton: {
    backgroundColor: '#F4F6F8',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  messageButtonText: {
    color: '#4A80F0',
    fontWeight: '600',
    fontSize: 14,
  },
  requestButton: {
    backgroundColor: '#4A80F0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1.5,
    alignItems: 'center',
  },
  requestButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});