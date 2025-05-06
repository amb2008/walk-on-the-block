import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, MapPin, Clock } from 'lucide-react-native';

export default function HomeScreen() {
  const [userType, setUserType] = useState('student'); // 'student' or 'owner'
  
  // Mock data
  const nearbyDogs = [
    {
      id: '1',
      name: 'Max',
      breed: 'Golden Retriever',
      distance: '0.5 miles',
      image: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg',
      time: '3:00 PM - 4:00 PM',
      rating: 4.8,
    },
    {
      id: '2',
      name: 'Bella',
      breed: 'Poodle',
      distance: '0.7 miles',
      image: 'https://images.pexels.com/photos/1458916/pexels-photo-1458916.jpeg',
      time: '5:30 PM - 6:30 PM',
      rating: 4.7,
    },
    {
      id: '3',
      name: 'Charlie',
      breed: 'Beagle',
      distance: '1.2 miles',
      image: 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg',
      time: '4:00 PM - 5:00 PM',
      rating: 4.9,
    },
  ];

  const topWalkers = [
    {
      id: '1',
      name: 'Emma Thompson',
      rating: 4.9,
      walks: 42,
      image: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg',
    },
    {
      id: '2',
      name: 'Michael Wilson',
      rating: 4.8,
      walks: 36,
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4A80F0', '#50E3C2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.greeting}>Good Afternoon,</Text>
        <Text style={styles.username}>{userType === 'student' ? 'Alex' : 'Sarah'}</Text>
        
        <View style={styles.statsContainer}>
          {userType === 'student' ? (
            <>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Walks</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>$86</Text>
                <Text style={styles.statLabel}>Earned</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>4.8</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>8</Text>
                <Text style={styles.statLabel}>Bookings</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>Max</Text>
                <Text style={styles.statLabel}>Dog</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>4.9</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </>
          )}
        </View>
      </LinearGradient>

      <ScrollView style={styles.contentContainer}>
        {userType === 'student' ? (
          <>
            <Text style={styles.sectionTitle}>Dogs Nearby</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScrollView}
            >
              {nearbyDogs.map(dog => (
                <TouchableOpacity key={dog.id} style={styles.dogCard}>
                  <Image source={{ uri: dog.image }} style={styles.dogImage} />
                  <View style={styles.dogInfo}>
                    <Text style={styles.dogName}>{dog.name}</Text>
                    <Text style={styles.dogBreed}>{dog.breed}</Text>
                    <View style={styles.dogDetails}>
                      <View style={styles.detailItem}>
                        <MapPin size={14} color="#4A80F0" />
                        <Text style={styles.detailText}>{dog.distance}</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Clock size={14} color="#4A80F0" />
                        <Text style={styles.detailText}>{dog.time}</Text>
                      </View>
                    </View>
                    <View style={styles.ratingContainer}>
                      <Star size={14} color="#FFD700" fill="#FFD700" />
                      <Text style={styles.ratingText}>{dog.rating}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.quickActions}>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#E3F2FD' }]}>
                <Text style={[styles.actionText, { color: '#4A80F0' }]}>Available Now</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#FFF3E0' }]}>
                <Text style={[styles.actionText, { color: '#FF9557' }]}>Weekend Only</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#E8F5E9' }]}>
                <Text style={[styles.actionText, { color: '#50E3C2' }]}>Set Radius</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Top Student Walkers</Text>
            {topWalkers.map(walker => (
              <TouchableOpacity key={walker.id} style={styles.walkerCard}>
                <Image source={{ uri: walker.image }} style={styles.walkerImage} />
                <View style={styles.walkerInfo}>
                  <Text style={styles.walkerName}>{walker.name}</Text>
                  <View style={styles.walkerStats}>
                    <View style={styles.walkerStat}>
                      <Star size={14} color="#FFD700" fill="#FFD700" />
                      <Text style={styles.walkerStatText}>{walker.rating}</Text>
                    </View>
                    <View style={styles.walkerStat}>
                      <Text style={styles.walkerStatText}>{walker.walks} walks</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={styles.contactButton}>
                  <Text style={styles.contactButtonText}>Contact</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.scheduleButton}>
              <LinearGradient
                colors={['#4A80F0', '#50E3C2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.scheduleButtonGradient}
              >
                <Text style={styles.scheduleButtonText}>Schedule a Walk</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
        
        {/* Toggle button for demo purposes */}
        <TouchableOpacity 
          style={styles.toggleButton} 
          onPress={() => setUserType(userType === 'student' ? 'owner' : 'student')}
        >
          <Text style={styles.toggleButtonText}>
            Switch to {userType === 'student' ? 'Owner' : 'Student'} View
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  greeting: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '400',
  },
  username: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    width: '30%',
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    marginTop: 10,
    color: '#333333',
  },
  horizontalScrollView: {
    marginBottom: 20,
  },
  dogCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginRight: 15,
    width: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dogImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  dogInfo: {
    padding: 12,
  },
  dogName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
  },
  dogBreed: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  dogDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#333333',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  actionText: {
    fontWeight: '600',
    fontSize: 12,
  },
  walkerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  walkerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  walkerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  walkerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  walkerStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walkerStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  walkerStatText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666666',
  },
  contactButton: {
    backgroundColor: '#4A80F0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  scheduleButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  scheduleButtonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  scheduleButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  toggleButton: {
    marginTop: 30,
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#EEEEEE',
    borderRadius: 12,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#333333',
    fontWeight: '600',
  },
});