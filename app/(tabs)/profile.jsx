import React, { useState, useEffect, use } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { CreditCard as Edit2, LogOut, Clock, DollarSign, Star, MapPin, Bell, Shield, CircleHelp as HelpCircle, ChevronRight, Pencil } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { getFirestore, collection, setDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore"; // <-- Add this import

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAuF6WtTM8bQw0coC6htQnQ3lGhMfjmkgU",
  authDomain: "walk-on-the-block.firebaseapp.com",
  projectId: "walk-on-the-block",
  storageBucket: "walk-on-the-block.firebasestorage.app",
  messagingSenderId: "656366015014",
  appId: "1:656366015014:web:19b1b64fdd9e3a95238ce7",
  measurementId: "G-H5NSBP9ZTE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // <-- Get the Firestore service

export default function ProfileScreen() {
  const [userType, setUserType] = useState('walkers'); // 'student' or 'dogs'
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [nearbyDogs, setNearbyDogs] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        console.log("User is signed in:", user.email);
        setUserEmail(user.email);
        setUserId(user.uid);
        setUserName(user.displayName || "User");
        setUserImage(user.photoURL || "https://via.placeholder.com/150");
        console.log("User ID:", user.uid);
        console.log("User Name:", user.displayName);
        console.log("User Email:", user.email);
        console.log("User Photo URL:", user.photoURL);
      } else {
        console.log("No user is signed in.");
      }
    });
  }, []);
  useEffect(() => {
    userq = query(collection(db, "walkers"), where("email", "==", userEmail));
    // find user in walkers collection
    getDocs(userq).then((querySnapshot) => {
      if (!querySnapshot.empty) {
        console.log("User found in walkers collection.");
        setUserType('walkers'); // User is a walker
      } else {
        // If not found in walkers, check dogs collection
        userq = query(collection(db, "dogs"), where("email", "==", userEmail));
        getDocs(userq).then((querySnapshot) => {
          if (!querySnapshot.empty) {
            console.log("User found in dogs collection.");
            setUserType('dogs'); // User is an owner
          }
        });
      }
    }
    ).catch((error) => {
      console.error("Error fetching user type:", error);
    } );

  }, [userEmail]);


  // Mock data
  const studentData = {
    name: 'Alex Johnson',
    age: 17,
    school: 'Lincoln High School',
    bio: 'Animal lover with 2 years of experience taking care of dogs. Available on weekdays after 3 PM and weekends.',
    photo: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    stats: [
      { icon: <Clock size={18} color="#4A80F0" />, value: '28', label: 'Walks' },
      { icon: <DollarSign size={18} color="#4A80F0" />, value: '$235', label: 'Earned' },
      { icon: <Star size={18} color="#4A80F0" />, value: '4.9', label: 'Rating' },
    ],
  };

  const ownerData = {
    name: 'Sarah Williams',
    bio: 'Owner of Max, a friendly Golden Retriever who loves long walks and playing fetch.',
    photo: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg',
    location: 'Westfield, LA',
    dogs: [
      { 
        name: 'Max', 
        breed: 'Golden Retriever', 
        age: '3 years',
        photo: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg'
      }
    ],
    stats: [
      { icon: <Clock size={18} color="#4A80F0" />, value: '18', label: 'Bookings' },
      { icon: <Star size={18} color="#4A80F0" />, value: '4.8', label: 'Rating' },
    ],
  };

  const userData = userType === 'student' ? studentData : ownerData;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4A80F0', '#50E3C2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image source={{ uri: userData.photo }} style={styles.profileImage} />
            <TouchableOpacity style={styles.editButton}>
              <Edit2 size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{userData.name}</Text>
          {userType === 'student' ? (
            <Text style={styles.profileSchool}>{userData.school}</Text>
          ) : (
            <View style={styles.locationContainer}>
              <MapPin size={14} color="#FFFFFF" />
              <Text style={styles.locationText}>{userData.location}</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.statsContainer}>
          {userData.stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              {stat.icon}
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.bioContainer}> 
          <Text style={styles.sectionTitle}>About</Text>
          <ScrollView>
            <Text style={styles.bioText}>{userData.bio}</Text>
            <TouchableOpacity style={styles.settingItem}><Pencil size={16} color="red" style={{ marginTop: 10 }}/></TouchableOpacity>
          </ScrollView>
            {/* <Text style={styles.bioText}>{userData.bio}</Text>/ */}
        
        </View>

        {userType === 'owner' && (
          <View style={styles.dogsContainer}>
            <Text style={styles.sectionTitle}>My Dogs</Text>
            {userData.dogs.map((dog, index) => (
              <View key={index} style={styles.dogCard}>
                <Image source={{ uri: dog.photo }} style={styles.dogImage} />
                <View style={styles.dogInfo}>
                  <Text style={styles.dogName}>{dog.name}</Text>
                  <Text style={styles.dogDetails}>{dog.breed}, {dog.age}</Text>
                </View>
                <TouchableOpacity style={styles.editDogButton}>
                  <Edit2 size={16} color="#4A80F0" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addDogButton}>
              <Text style={styles.addDogButtonText}>+ Add Another Dog</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.settingsContainer}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <View style={[styles.settingIcon, { backgroundColor: '#E3F2FD' }]}>
                <Bell size={18} color="#4A80F0" />
              </View>
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E0E0E0', true: '#4A80F0' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <View style={[styles.settingIcon, { backgroundColor: '#FFF3E0' }]}>
                <MapPin size={18} color="#FF9557" />
              </View>
              <Text style={styles.settingText}>Location Services</Text>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: '#E0E0E0', true: '#4A80F0' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <View style={[styles.settingIcon, { backgroundColor: '#E8F5E9' }]}>
                <Shield size={18} color="#50E3C2" />
              </View>
              <Text style={styles.settingText}>Privacy & Security</Text>
            </View>
            <ChevronRight size={18} color="#8A8A8A" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <View style={[styles.settingIcon, { backgroundColor: '#E3F2FD' }]}>
                <HelpCircle size={18} color="#4A80F0" />
              </View>
              <Text style={styles.settingText}>Help & Support</Text>
            </View>
            <ChevronRight size={18} color="#8A8A8A" />
          </TouchableOpacity>
        </View>
        
        {/* Toggle button for demo purposes */}
        <TouchableOpacity 
          style={styles.toggleButton} 
          onPress={() => setUserType(userType === 'student' ? 'owner' : 'student')}
        >
          <Text style={styles.toggleButtonText}>
            Switch to {userType === 'student' ? 'Owner' : 'Student'} View
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={18} color="#FF5252" />
          <Text style={styles.logoutText}>Log Out</Text>
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
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profileHeader: {
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4A80F0',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  profileSchool: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginTop: -25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#8A8A8A',
    marginTop: 2,
  },
  bioContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666666',
  },
  dogsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  dogCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  dogImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  dogInfo: {
    flex: 1,
    marginLeft: 15,
  },
  dogName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  dogDetails: {
    fontSize: 14,
    color: '#666666',
  },
  editDogButton: {
    backgroundColor: '#FFFFFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  addDogButton: {
    borderWidth: 1,
    borderColor: '#4A80F0',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  addDogButtonText: {
    color: '#4A80F0',
    fontWeight: '600',
    fontSize: 14,
  },
  settingsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    fontSize: 14,
    color: '#333333',
  },
  toggleButton: {
    backgroundColor: '#EEEEEE',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  toggleButtonText: {
    color: '#333333',
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginTop: 20,
    marginBottom: 30,
  },
  logoutText: {
    color: '#FF5252',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});