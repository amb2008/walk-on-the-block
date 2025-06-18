import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Star, MapPin, Clock } from 'lucide-react-native';
import { db } from '/Users/c26ab1/Desktop/Coding/Web Apps + Games/Walk-On-The-Block/firebase.js'; // Adjust the import path as necessary
import useUserData from '/Users/c26ab1/Desktop/Coding/Web Apps + Games/Walk-On-The-Block/hooks/useUserData.js';
import { getFirestore, collection, setDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore"; // <-- Add this import

export default function HomeScreen() {
  const { 
    userData,
    userEmail,
    userType,
    userName,
    userImage,
    userRating,
    userWalks,
    userEarned,
    address,
    bio,
    contact,
    setAddress,
    setUserData,
    setUserName,
    setBio,
    setContact,
    refreshUserData
  } = useUserData();

  useFocusEffect(
    useCallback(() => {
      refreshUserData();
    }, [])
  );

  const [walkers, setWalkers] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [viewProfile, setViewProfile] = useState(false);
  const [profile, setProfile] = useState(null);


  const getUsers = async () => {
    if (!userData) return;
    console.log("User Data:", userData);
    if (userType === 'dogs'){
      const q = query(collection(db, "walkers"), where("address.city", "==", address.city));
      const querySnapshot = await getDocs(q);
      let newData = [];
      querySnapshot.forEach((doc) => {
        newData.push({...doc.data()});
      });
      setWalkers([...newData]);
    } 
    else if (userType === 'walkers'){
      const q = query(collection(db, "dogs"), where("address.city", "==", address.city));
      // const q = query(collection(db, "cities"), where("capital", "==", true));
      let newData = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {    
        newData.push({...doc.data()});  
      });
      setDogs([...newData]);
    }

    console.log("Walkers:", walkers);
    console.log("Dogs:", dogs);
  }

  useEffect(() => { getUsers();}, [userData]);

  function handleViewProfile(id) {
    console.log("Viewing profile for ID:", id);
    if (userType === 'dogs') {
      setProfile(walkers[id]);
    } else if (userType === 'walkers') {
      setProfile(dogs[id]);
    }
    setViewProfile(true);
    console.log("Profile Data:", profile);
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4A80F0', '#50E3C2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.greeting}>Welcome back,</Text>
        <Text style={styles.username}>{userName}!</Text>
        
        <View style={styles.statsContainer}>
          {userType === 'walkers' ? (
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
        {userType === 'walkers' ? (
          <>
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
            <Text style={styles.sectionTitle}>Dogs Nearby</Text>
              {dogs.map((dog, index) => (
              <TouchableOpacity key={index} style={styles.walkerCard} onPress={() => handleViewProfile(index)}>
                <Image source={{ uri: dog.image }} style={styles.walkerImage} />
                <View style={styles.walkerInfo}>
                  <Text style={styles.walkerName}>{dog.name}</Text>
                  <View style={styles.walkerStats}>
                    <View style={styles.walkerStat}>
                      <Star size={14} color="#FFD700" fill="#FFD700" />
                      <Text style={styles.walkerStatText}>{dog.rating}</Text>
                    </View>
                    <View style={styles.walkerStat}>
                      <Text style={styles.walkerStatText}>{dog.walks} walks</Text>
                    </View>
                  </View>
                </View>
                {/* <TouchableOpacity style={styles.contactButton} onPress={() => handleViewProfile(index)}>
                  <Text style={styles.contactButtonText}>View Profile</Text>
                </TouchableOpacity> */}
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Walkers In Your Area</Text>
            {walkers.map((walker, index) => (
              <TouchableOpacity key={index} style={styles.walkerCard} onPress={() => handleViewProfile(index)}>
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
                {/* <TouchableOpacity style={styles.contactButton} onPress={() => handleViewProfile(index)}>
                  <Text style={styles.contactButtonText}>View Profile</Text>
                </TouchableOpacity> */}
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    {viewProfile && profile && (
      <LinearGradient style={styles.profileModal} colors={['rgba(127, 23, 156, 0.64)', 'rgba(14, 111, 126, 0.5)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}>
        <Image source={{ uri: profile.image }} style={styles.profileImage} />
        <Text style={styles.profileName}>{profile.name}</Text>
        <Text style={styles.profileBio}>{profile.bio}</Text>
        <Text style={styles.profileBio}>Contact: {profile.contact}</Text>
        <TouchableOpacity onPress={() => setViewProfile(false)} style={styles.toggleButton}>
          <Text style={styles.toggleButtonText}>Close Profile</Text>
        </TouchableOpacity>
      </LinearGradient>
    )}
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
  profileModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.5) 100%)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  profileBio: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    width: '80%',
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  profileStat: {
    alignItems: 'center',
  },
  profileStatNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileStatLabel: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  profileActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  profileActionButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  profileActionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  }
});